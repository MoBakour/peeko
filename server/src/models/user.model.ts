import { Schema, model } from "mongoose";

const DeviceInfoSchema = new Schema(
    {
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
    { _id: false }
);

const ActivationSchema = new Schema(
    {
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
    { _id: false }
);

const UserSchema = new Schema(
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
            type: DeviceInfoSchema,
        },
        activation: {
            type: ActivationSchema,
        },
    },
    { timestamps: true }
);

export default model("User", UserSchema);
