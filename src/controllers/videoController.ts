// imports
import express from "express";
import { upload, validateFile, deleteFile } from "../models/multerSetup";
import { s3_download, s3_upload, s3_delete } from "../models/s3";
import { MulterFileType, VideoType, PeekoRequest } from "../types";
import Video from "../models/video";
import { checkVideoExists } from "../middleware/checkResourceExists";
import { requireLogin } from "../middleware/authentication";

// create router
const router = express.Router();

/**
 * @post
 *      POST request to upload a video to s3 and db
 */
router.post(
    "/uploadVideo",
    requireLogin,
    upload.single("videoFile"),
    validateFile,
    async (req: PeekoRequest, res) => {
        // destructure
        const uploaderId: string = req.currentUser!._id;
        const uploaderUsername: string = req.currentUser!.username;
        const videoFile: MulterFileType = req.file!;

        try {
            // upload file to s3
            const s3_result = await s3_upload(videoFile);
            await deleteFile(videoFile!.path);

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
    }
);

/**
 * @get
 *      GET request to get a specific video file through a provided video key
 */
router.get("/streamVideo/:videoKey", checkVideoExists, async (req, res) => {
    // destructure
    const videoKey = req.params.videoKey as string;

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
    "/getVideo/:videoKey",
    requireLogin,
    checkVideoExists,
    async (req: PeekoRequest, res) => {
        try {
            // get video from db
            const videoDocument = req.resource as VideoType;

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
    }
);

/**
 * @post
 *      POST request to get random video data from the database.
 *      It is a POST method because a body is needed to pass data.
 */
router.post("/getVideos", requireLogin, async (req, res) => {
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
        const videoDocuments: VideoType[] = await Video.aggregate([
            { $match: { videoKey: { $nin: viewed } } },
            { $sample: { size: count } },
            { $group: { _id: "$_id", doc: { $first: "$$ROOT" } } },
            { $replaceWith: "$doc" },
        ]);

        // return result
        return res.status(200).json({
            success: true,
            videoDocuments,
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
    "/deleteVideo/:videoKey",
    checkVideoExists,
    requireLogin,
    async (req: PeekoRequest, res) => {
        // destructure
        const videoDocument = req.resource as VideoType;
        const videoKey = req.params.videoKey as string;

        try {
            // if deleter is not publisher
            if (req.currentUser!._id !== videoDocument.uploaderId) {
                return res.status(400).json({
                    success: false,
                    error: "Unauthorized Action",
                });
            }

            // delete video document from db
            const deletedVideoDocument: VideoType | null =
                await Video.findOneAndDelete({ videoKey });

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
    }
);

// export router
export default router;
