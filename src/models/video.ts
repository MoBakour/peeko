import { Schema, model } from "mongoose";

const videoSchema = new Schema(
    {
        uploaderId: {
            type: String,
            required: true,
            trim: true,
        },
        uploaderUsername: {
            type: String,
            required: true,
            trim: true,
        },
        videoKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        likes: {
            type: [String],
            default: [],
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default model("Video", videoSchema);
