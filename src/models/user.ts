import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            maxLength: [24, "Username max length is 24 characters"],
            trim: true,
        },
        fingerprint: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export default model("User", userSchema);
