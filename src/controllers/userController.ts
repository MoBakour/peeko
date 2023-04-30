// imports
import express from "express";
import mongoose from "mongoose";
import requestIp from "request-ip";
import { UserType } from "../types";
import User from "../models/user";
import { createToken } from "../middleware/authentication";
import { PeekoRequest } from "../types";
import { requireLogin } from "../middleware/authentication";

// express router
const router = express.Router();

/**
 * @post
 *      POST request to attempt signup from client.
 */
router.post("/createAccount", async (req, res) => {
    // destructure
    let { username, deviceId, deviceInfo } = req.body;
    deviceInfo = deviceInfo || {};

    try {
        // get user ip address
        const ipAddress = requestIp.getClientIp(req);

        // build user object structure
        const userObject = {
            username,
            deviceId,
            deviceInfo: { ...deviceInfo, ipAddress },
        };

        // insert to db and send response
        const userDocument: UserType = await User.create(userObject);

        // create JWT token
        const token = await createToken(userDocument._id);

        res.status(200).json({
            success: true,
            userDocument,
            token,
        });
    } catch (err: any) {
        // if not mongoose validation error, log to server console
        if (
            err.code !== 11000 &&
            !(err instanceof mongoose.Error.ValidationError)
        ) {
            console.error(err);
        }

        // modify error message if duplicate username error
        if (
            err.code === 11000 &&
            Object.keys(err.keyValue).includes("username")
        ) {
            err.message = `Username ${username} is already used. Try another username`;
        }

        // modify error message if username validation error
        const usernameValidationError = "Username max length is 24 characters";
        if (err.message.includes(usernameValidationError)) {
            err.message = usernameValidationError;
        }

        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

/**
 * @get
 *      GET request to check if device has a previous account.
 */
router.get("/hasAccount", async (req, res) => {
    // destructure
    const deviceId = req.query.deviceId as string;

    try {
        // check if deviceId matches in the db
        const accounts: UserType[] = await User.find({ deviceId });
        const hasAccount = accounts.length > 0;

        // create JWT token/s
        const tokens: { userId: string; token: string }[] = [];
        for (const account of accounts) {
            const token = (await createToken(account._id)) as string;
            tokens.push({ userId: account._id, token });
        }

        // return result
        res.status(200).json({
            success: true,
            hasAccount,
            accounts,
            tokens,
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
 *      DELETE request to delete a user from the db.
 */
router.delete(
    "/deleteAccount",
    requireLogin,
    async (req: PeekoRequest, res) => {
        // destructure
        const userId = req.currentUser!._id;

        try {
            // delete user
            const deletedUserDocument: UserType | null =
                await User.findByIdAndDelete(userId);

            // if user not found
            if (!deletedUserDocument) {
                return res.status(400).json({
                    success: false,
                    error: "User not found",
                });
            }

            // return response
            res.status(200).json({
                success: true,
                deletedUserDocument,
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

/**
 * @put
 *      PUT request to update the recorded IP address of the user
 */
router.put("/updateIpAddress", requireLogin, async (req: PeekoRequest, res) => {
    // destructure ip address
    const userId = req.currentUser!._id;

    try {
        // get ipAddress
        const ipAddress = requestIp.getClientIp(req);

        const result = await User.findByIdAndUpdate(userId, {
            "deviceInfo.ipAddress": ipAddress,
        });

        if (!result) {
            return res.status(400).json({
                success: false,
                error: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            ipAddress,
        });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

// export router
export default router;
