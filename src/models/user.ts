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
            required: true,
            unique: true,
            trim: true,
        },
        password: {
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
        activation: {
            activated: {
                type: Boolean,
                required: true,
            },
            activationCode: {
                type: String,
                trim: true,
                required: true,
            },
            attemptsLeft: {
                type: Number,
                required: true,
            },
            blocked: {
                type: Boolean,
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default model("User", userSchema);
