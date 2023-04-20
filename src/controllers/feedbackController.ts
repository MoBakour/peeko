// imports
import express from "express";
import {
    checkUserExists,
    checkVideoExists,
} from "../middleware/checkResourceExists";
import Video from "../models/video";
import { VideoType } from "../types";
import {
    invalidFeedbackOperationErrorMsg_LIKE,
    invalidFeedbackOperationErrorMsg_UNLIKE,
} from "../middleware/errorHandling";

// express router
const router = express.Router();

/**
 * @put
 *      PUT request to like a video post
 */
router.put("/like", checkVideoExists, checkUserExists, async (req, res) => {
    // destructure
    const { userId, videoKey } = req.body;

    try {
        // add userId to video likes array field in db
        const preUpdatedDocument = (await Video.findOneAndUpdate(
            { videoKey },
            { $addToSet: { likes: userId } },
            { new: false }
        )) as VideoType;

        // if userId was already in likes array
        if (preUpdatedDocument.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                likesCount: preUpdatedDocument.likes.length,
                error: invalidFeedbackOperationErrorMsg_LIKE,
            });
        }

        // return response
        res.status(200).json({
            success: true,
            likesCount: preUpdatedDocument.likes.length + 1,
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
 * @put
 *      PUT request to remove like from a video post
 */
router.put("/unlike", checkVideoExists, checkUserExists, async (req, res) => {
    // destructure
    const { userId, videoKey } = req.body;

    try {
        // remove userId from video likes array field in db
        const preUpdatedDocument = (await Video.findOneAndUpdate(
            { videoKey },
            { $pull: { likes: userId } },
            { new: false }
        )) as VideoType;

        // if userId was not in likes array
        if (!preUpdatedDocument.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                likesCount: preUpdatedDocument.likes.length,
                error: invalidFeedbackOperationErrorMsg_UNLIKE,
            });
        }

        // return promise
        res.status(200).json({
            success: true,
            likesCount: preUpdatedDocument.likes.length - 1,
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
