// imports
import express from "express";
import { MulterError } from "multer";
import { getVideoDurationInSeconds } from "get-video-duration";
import SimpleThumbnail from "simple-thumbnail-ts";
import ffmpegPath from "ffmpeg-static";

import { checkVideoExists } from "../middleware/checkResourceExists";
import { requireAuth } from "../middleware/authentication";

import { upload, deleteFile } from "../middleware/multer";
import Video from "../models/video";
import Comment from "../models/comment";
import User from "../models/user";
import { s3_get, s3_post, s3_delete } from "../utils/s3";
import { PipelineStage } from "mongoose";
import { replaceArrayWithCount } from "../utils/utils";

// create router
const router = express.Router();
export const thumbnailSuffix = "-thumbnail.png";

/**
 * @post
 *      POST request to upload a video to s3 and db
 */
router.post("/upload", requireAuth, async (req: PeekoRequest, res) => {
    upload(req, res, async (err) => {
        if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                suucess: false,
                error: "Video file size must not exceed 100 MB",
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: err.message,
            });
        }

        // validate file existence
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Video file not found",
            });
        }

        // destructure
        const videoFile: MulterFileType = req.file;

        const thumbnailObject = {
            path: videoFile.path + thumbnailSuffix,
            filename: videoFile.filename + thumbnailSuffix,
            mimetype: "image/png",
        };

        try {
            // validate video file duration
            const duration = await getVideoDurationInSeconds(videoFile.path);
            if (duration > 300) {
                return res.status(400).json({
                    success: false,
                    error: "Video duration must not exceed 5 minutes",
                });
            }

            // create thumbnail
            await new SimpleThumbnail().generate(
                videoFile.path,
                thumbnailObject.path,
                "480x854",
                {
                    path: ffmpegPath,
                }
            );

            // upload to S3
            const [videoKey] = await Promise.all([
                s3_post(videoFile),
                s3_post(thumbnailObject),
            ]);

            // create video object structure
            const videoObject = {
                uploader: req.currentUser!._id,
                videoKey,
            };

            // upload video data to db
            let videoDocument: VideoType = await Video.create(videoObject);
            videoDocument = await videoDocument.populate("uploader", {
                username: 1,
            });

            // return result to client
            res.status(200).json({
                success: true,
                videoDocument: replaceArrayWithCount(videoDocument),
            });
        } catch (err: any) {
            console.error(err);

            // delete video and thumbnail if they were uploaded to s3
            await s3_delete([
                videoFile.filename,
                videoFile.filename + thumbnailSuffix,
            ]);

            return res.status(400).json({
                success: false,
                error: err.message,
            });
        } finally {
            await deleteFile([videoFile.path, thumbnailObject.path]);
        }
    });
});

/**
 * @get
 *      GET request to get a specific video thumbnail through a proided video key
 */
router.get(
    ["/streamThumbnail/:videoKey", "/streamVideo/:videoKey"],
    checkVideoExists,
    async (req, res) => {
        const { videoKey } = req.params;
        const isThumbnail = req.path.includes("streamThumbnail");

        try {
            // get requested resource from s3 and stream it back to client
            // if requesting thumbnail, add thumbnail key suffix
            const result = await s3_get(
                videoKey + (isThumbnail ? thumbnailSuffix : "")
            );
            const stream = result.Body as NodeJS.ReadableStream;

            // if requesting video, set "content-length"
            res.header({
                "content-type": result.ContentType,
                ...(isThumbnail
                    ? {}
                    : { "content-length": result.ContentLength }),
            });

            stream.pipe(res);
        } catch (err: any) {
            console.error(err);
            res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }
);

/**
 * @get
 *      GET request to get a specific video data through a provided video key
 */
router.get(
    "/get/:videoKey",
    checkVideoExists,
    async (req: PeekoRequest, res) => {
        try {
            // get video from db
            let videoDocument = req.resource as VideoType;

            // if user signed in, register view
            if (req.currentUser) {
                await Video.findByIdAndUpdate(videoDocument._id, {
                    $push: { views: req.currentUser._id },
                });
            }

            const isLiked = !!videoDocument.likes?.includes(
                req.currentUser?._id
            );

            res.status(200).json({
                success: true,
                videoDocument: replaceArrayWithCount(videoDocument),
                isLiked,
            });
        } catch (err: any) {
            console.error(err);
            res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }
);

/**
 * @get
 *      GET request to get random video data from the database.
 */
router.get("/getVideos/:count?", async (req: PeekoRequest, res) => {
    // destructure
    const count = parseInt(req.params.count as string) || 10;

    try {
        /**
         * Use $match stage to exclude
         * previously watched videos from the pipeline.
         *
         * Use $sample stage to get a
         * #count number of randomly selected videos.
         *
         * Use $lookup stage to populate uploader field
         *
         * Use $project stage to define what fields to include
         *
         * Use $group & $replaceWith stages to make sure
         * we don't get duplicate documents.
         */

        let matchStage = req.currentUser
            ? { views: { $ne: req.currentUser._id } }
            : {};

        const aggregationPipeline: PipelineStage[] = [
            { $match: matchStage },
            { $sample: { size: count } },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: "uploader",
                    foreignField: "_id",
                    as: "uploader",
                },
            },
            { $unwind: "$uploader" },
            {
                $project: {
                    uploader: {
                        _id: 1,
                        username: 1,
                    },
                    videoKey: 1,
                    likes: 1,
                    views: 1,
                    commentsCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            { $group: { _id: "$_id", doc: { $first: "$$ROOT" } } },
            { $replaceWith: "$doc" },
        ];

        let videoDocuments = await Video.aggregate(aggregationPipeline);

        // backup in case no unveiwed videos found
        if (videoDocuments.length === 0) {
            matchStage = {};
            videoDocuments = await Video.aggregate(aggregationPipeline);
        }

        // return result
        return res.status(200).json({
            success: true,
            videoDocuments: replaceArrayWithCount(videoDocuments),
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

/**
 * @delete
 *      DELETE request to delete a video from s3 and db
 */
router.delete(
    "/delete/:videoKey",
    requireAuth,
    checkVideoExists,
    async (req: PeekoRequest, res) => {
        // destructure
        const videoDocument = req.resource as VideoType;
        const videoKey = req.params.videoKey as string;

        try {
            // if deleter is not publisher
            if (
                req.currentUser!._id.toString() !==
                videoDocument.uploader._id.toString()
            ) {
                return res.status(400).json({
                    success: false,
                    error: "Unauthorized Action",
                });
            }

            // delete video document from db
            let deletedVideoDocument: VideoType | null =
                await Video.findOneAndDelete({
                    videoKey,
                });

            if (!deletedVideoDocument) {
                return res.status(400).json({
                    success: false,
                    error: "Video not found",
                });
            }

            deletedVideoDocument = await deletedVideoDocument.populate(
                "uploader",
                {
                    username: 1,
                }
            );

            // delete video file & thumbnail from s3
            await s3_delete([videoKey, videoKey + thumbnailSuffix]);

            // delete comments associated with video
            await Comment.deleteMany({ videoKey });

            // return response
            res.status(200).json({
                success: true,
                deletedVideoDocument:
                    replaceArrayWithCount(deletedVideoDocument),
            });
        } catch (err: any) {
            console.error(err);
            res.status(400).json({
                success: false,
                error: err.message,
            });
        }
    }
);

// export router
export default router;
