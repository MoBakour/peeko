// imports
import express from "express";
import Video from "../models/video";
import { requireAuth } from "../middleware/authentication";
import { checkVideoExists } from "../middleware/checkResourceExists";

// express router
const router = express.Router();

/**
 * @put
 *      PUT request to toggle like on a video post
 */
router.put(
    "/toggleLike",
    requireAuth,
    checkVideoExists,
    async (req: PeekoRequest, res) => {
        // destructure
        const userId = req.currentUser!._id;
        const videoDocument = req.resource! as VideoType;

        try {
            // decide which operation to perform (like/unlike)
            const alreadyLiked = videoDocument.likes!.includes(userId);
            const updateOperation = alreadyLiked
                ? { $pull: { likes: userId } }
                : { $addToSet: { likes: userId } };

            // perform operation
            const updatedDocument = await Video.findOneAndUpdate(
                { videoKey: videoDocument.videoKey },
                updateOperation,
                { new: true }
            );

            // send back response
            res.status(200).json({
                success: true,
                likesCount: updatedDocument?.likes.length,
                operation: alreadyLiked ? "UNLIKE" : "LIKE",
            });
        } catch (err: any) {
            console.error(err);
            res.status(200).json({
                success: false,
                error: err.message,
            });
        }
    }
);

/**
 * @put
 *      PUT request to like a video post
 */
router.put("/likeVideo", requireAuth, async (req: PeekoRequest, res) => {
    // destructure
    const { videoKey } = req.body;
    const userId = req.currentUser!._id;

    try {
        // add userId to video likes array field in db
        const preUpdatedDocument = await Video.findOneAndUpdate(
            { videoKey },
            { $addToSet: { likes: userId } },
            { new: false }
        );

        // if video not found
        if (!preUpdatedDocument) {
            return res.status(400).json({
                success: false,
                error: "Video not found",
            });
        }

        // if userId was already in likes array
        if (preUpdatedDocument.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                likesCount: preUpdatedDocument.likes.length,
                error: "Invalid Feedback Operation Error: failed to like video post. reason: video was already liked",
            });
        }

        // return response
        res.status(200).json({
            success: true,
            likesCount: preUpdatedDocument.likes.length + 1,
            operation: "LIKE",
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
router.put("/unlikeVideo", requireAuth, async (req: PeekoRequest, res) => {
    // destructure
    const { videoKey } = req.body;
    const userId = req.currentUser!._id;

    try {
        // remove userId from video likes array field in db
        const preUpdatedDocument = await Video.findOneAndUpdate(
            { videoKey },
            { $pull: { likes: userId } },
            { new: false }
        );

        // if video not found
        if (!preUpdatedDocument) {
            return res.status(400).json({
                success: false,
                error: "Video not found",
            });
        }

        // if userId was not in likes array
        if (!preUpdatedDocument.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                likesCount: preUpdatedDocument.likes.length,
                error: "Invalid Feedback Operation Error: failed to unlike video post. reason: video post was not liked",
            });
        }

        // return response
        res.status(200).json({
            success: true,
            likesCount: preUpdatedDocument.likes.length - 1,
            operation: "UNLIKE",
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
