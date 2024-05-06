import { Schema, model } from "mongoose";

const VideoSchema = new Schema(
    {
        uploader: {
            type: Schema.Types.ObjectId,
            ref: "User",
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
        views: {
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

export default model("Video", VideoSchema);
