// imports
import express from "express";
import { UserType, CommentType, PeekoRequest } from "../types";
import Comment from "../models/comment";
import Video from "../models/video";
import { requireLogin } from "../middleware/authentication";

// express router
const router = express.Router();

/**
 * @get
 *      GET request to get comments of a specific video through provided video id
 */
router.get("/getComments", requireLogin, async (req, res) => {
    // destructure
    const videoKey = req.query.videoKey as string;

    try {
        // get comments
        const comments = await Comment.find({ videoKey });

        // return response
        res.status(200).json({
            success: true,
            comments,
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
 * @post
 *      POST request to post comment on a video through a provided video id
 */
router.post("/postComment", requireLogin, async (req: PeekoRequest, res) => {
    // destructure
    const { videoKey, comment } = req.body;
    const userObject = req.currentUser as UserType;

    try {
        // create comment structure
        const commentObject = {
            commentorId: userObject._id,
            commentorUsername: userObject.username,
            comment,
            videoKey,
        };

        // post comment to db
        const commentDocument: CommentType = await Comment.create(
            commentObject
        );

        // increment number of comments on video
        const updatedVideo = await Video.findOneAndUpdate(
            { videoKey },
            { $inc: { commentsNumber: 1 } },
            { new: true }
        );

        // if video doesn't exist, delete comment
        if (!updatedVideo) {
            await Comment.findByIdAndDelete(commentDocument._id);
            return res.status(400).json({
                success: false,
                error: "Video not found",
            });
        }

        // return response
        res.status(200).json({
            success: true,
            commentDocument,
            newCommentsNumber: updatedVideo.commentsNumber,
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
 *      DELETE request to delete comments form a video through a provided comment id
 */
router.delete(
    "/deleteComment",
    requireLogin,
    async (req: PeekoRequest, res) => {
        // destructure
        const commentId = req.query.commentId as string;

        try {
            const commentDocument = await Comment.findById(commentId);

            // if comment does not exist
            if (!commentDocument) {
                return res.status(400).json({
                    success: false,
                    error: "Comment not found",
                });
            }

            // if deleter is not commentor
            if (commentDocument.commentorId !== req.currentUser!._id) {
                return res.status(400).json({
                    success: false,
                    error: "Unauthorized Action",
                });
            }

            // delete comment from db
            const deletedCommentDocument = await Comment.findByIdAndDelete(
                commentId
            );

            // decrement the number of comments on a video
            const updatedVideo = await Video.findOneAndUpdate(
                { videoKey: deletedCommentDocument!.videoKey },
                { $inc: { commentsNumber: -1 } },
                { new: true }
            );

            // return response
            res.status(200).json({
                success: true,
                deletedCommentDocument,
                newCommentsNumber: updatedVideo?.commentsNumber,
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
