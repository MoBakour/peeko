import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        deviceId: {
            type: String,
            required: true,
            trim: true,
        },
        deviceInfo: {
            fingerprint: String,
            brand: String,
            model: String,
            osVersion: String,
            ipAddress: String,
            abi: {
                abiArc: String,
                supportedAbis: String,
            },
        },
    },
    { timestamps: true }
);

export default model("User", userSchema);
