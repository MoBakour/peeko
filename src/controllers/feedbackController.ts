// imports
import express from "express";
import { CommentType } from "../middleware/types";
import User from "../models/user";
import Comment from "../models/comment";
import Video from "../models/video";

// express router
const router = express.Router();

/**
 * @get
 *      GET request to get comments of a specific video through provided videoId
 */
router.get("/getComments", async (req, res) => {
    // destructure
    const videoId = req.query.videoId as string;

    try {
        // check if video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(400).json({
                success: false,
                error: "Video does not exist",
            });
        }

        // get comments
        const comments = await Comment.find({ videoId });

        // return response
        res.status(200).json({
            success: true,
            comments,
            commentsCount: comments.length,
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
