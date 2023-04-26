import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            maxLength: [24, "Username max length is 24 characters"],
            trim: true,
            validate: {
                validator: (username: string) => {
                    const regex = /^[a-zA-Z0-9_ ]+$/;
                    return regex.test(username);
                },
                message:
                    "Username can only include letters, numbers, underscores, and spaces",
            },
        },
        deviceId: {
            type: String,
            required: true,
            trim: true,
        },
        deviceInfo: {
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
