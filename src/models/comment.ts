import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        commenterId: {
            type: String,
            required: true,
            trim: true,
        },
        commenterUsername: {
            type: String,
            required: true,
            trim: true,
        },
        comment: {
            type: String,
            required: true,
            maxLength: [300, "Comment max length is 300 characters"],
            trim: true,
        },
        videoId: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export default model("Comment", commentSchema);
