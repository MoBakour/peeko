// imports
import fs from "fs";
import express from "express";
import upload from "../models/multerSetup";
import { s3_download, s3_upload, s3_delete } from "../models/s3";
import { MulterFileType, VideoType, RequestWithResourceType } from "../types";
import Video from "../models/video";
import { checkVideoExists } from "../middleware/checkResourceExists";
import { invalidKeyErrorMsg } from "../middleware/errorHandling";

// create router
const router = express.Router();

/**
 * @post
 *      POST request to upload a video to s3 and db
 */
router.post("/upload", upload.single("videoFile"), async (req, res) => {
    // destructure
    const uploaderId: string = req.body.uploaderId;
    const uploaderUsername: string = req.body.uploaderUsername;
    const videoFile: MulterFileType = req.file!;

    try {
        // upload file to s3
        const s3_result = await s3_upload(videoFile);
        await fs.promises.unlink(videoFile.path);

        // create video object structure
        const videoObject = {
            uploaderId,
            uploaderUsername,
            videoKey: s3_result.Key,
        };

        // upload video data to db
        const videoDocument: VideoType = await Video.create(videoObject);

        res.status(200).json({
            success: true,
            videoDocument,
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
 * @get
 *      GET request to get a specific video file through a provided video key
 */
router.get("/download/videoFile", checkVideoExists, async (req, res) => {
    // destructure
    const videoKey = req.query.videoKey as string;

    try {
        // get video from s3
        const readStream = s3_download(videoKey);
        readStream.pipe(res);
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

/**
 * @get
 *      GET request to get a specific video data through a provided video key
 */
router.get(
    "/download/videoData",
    checkVideoExists,
    async (req: RequestWithResourceType, res) => {
        // destructure
        const userId = req.query.username as string;

        // get video document from request object (attached by checkVideoExists handler)
        const videoData = req.resource as VideoType;

        // check if user liked the video
        const selfLikedVideo = videoData.likes.includes(userId);

        try {
            // return video data
            res.status(200).json({
                success: true,
                videoData,
                selfLikedVideo,
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
 * @post
 *      POST request to get random video data from the database.
 *      It is a POST method because a body is needed to pass data.
 */
router.post("/getVideos", async (req, res) => {
    // destructure
    const count = parseInt(req.body.count as string) || 10;
    const viewed: string[] = req.body.viewed;

    try {
        /**
         * Use MongoDB $match aggregation stage to exclude
         * previously watched videos from the pipeline.
         *
         * Use MongoDB $sample aggregation stage to get a
         * #count number of randomly selected videos.
         *
         * Use MongoDB $group aggregation stage to make sure
         * we don't get duplicate documents.
         */
        const videos: VideoType[] = await Video.aggregate([
            { $match: { videoKey: { $nin: viewed } } },
            { $sample: { size: count } },
            { $group: { _id: "$_id", doc: { $first: "$$ROOT" } } },
        ]);

        // return result
        return res.status(200).json({
            success: true,
            videos,
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
router.delete("/delete", async (req, res) => {
    // destructure
    const videoKey = req.query.videoKey as string;

    try {
        // delete video document from db
        const deletedVideoDocument: VideoType | null =
            await Video.findOneAndDelete({ videoKey });

        // check if video data was deleted from db
        if (!deletedVideoDocument) {
            return res.status(400).json({
                success: false,
                error: invalidKeyErrorMsg,
            });
        }

        // delete video file from s3
        await s3_delete(videoKey);

        // return response
        res.status(200).json({
            success: true,
            deletedVideoDocument,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

// export router
export default router;
