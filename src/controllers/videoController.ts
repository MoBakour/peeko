// imports
import fs from "fs";
import express from "express";
import upload from "../models/multerSetup";
import { s3_download, s3_upload } from "../models/s3";
import { MulterFileType, VideoType } from "../middleware/types";
import Video from "../models/video";

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
        const videoObject: VideoType = {
            uploaderId,
            uploaderUsername,
            videoKey: s3_result.Key,
            likes: [],
        };

        // upload video data to db
        const uploadedVideo = await Video.create(videoObject);

        res.status(200).json({
            success: true,
            uploadedVideo,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            error: err,
        });
    }
});

/**
 * @get
 *      GET request to get a specific video file through a provided video key
 */
router.get("/download/videoFile", async (req, res) => {
    // destructure
    const videoKey = req.query.videoKey as string;

    try {
        // check if video exists
        const videoObject = await Video.findOne({ videoKey });
        if (!videoObject) {
            return res.status(400).json({
                success: false,
                error: "Video file not found",
            });
        }

        // get video from s3
        const readStream = s3_download(videoKey);
        readStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

/**
 * @get
 *      GET request to get a specific video data through a provided video key
 */
router.get("/download/videoData", async (req, res) => {
    // destructure
    const videoKey = req.query.videoKey as string;

    try {
        // find video object
        const videoData = await Video.findOne({ videoKey });

        // if not found
        if (!videoData) {
            return res.status(400).json({
                success: false,
                error: "Video data not found",
            });
        }

        // return video data
        res.status(200).json({
            success: true,
            videoData,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

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
        const videos = await Video.aggregate([
            { $match: { _id: { $nin: viewed } } },
            { $sample: { size: count } },
            { $group: { _id: "$_id", doc: { $first: "$$ROOT" } } },
        ]);

        // return result
        return res.status(200).json({
            success: true,
            videos,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

// export router
export default router;
