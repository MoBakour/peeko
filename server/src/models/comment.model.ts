import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        commentor: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        videoKey: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export default model("Comment", commentSchema);
