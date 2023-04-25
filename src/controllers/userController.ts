// imports
import express from "express";
import mongoose from "mongoose";
import { UserType } from "../types";
import User from "../models/user";
import { createToken, requireSelf } from "../middleware/authentication";

// express router
const router = express.Router();

/**
 * @post
 *      POST request to attempt signup from client.
 */
router.post("/createAccount", async (req, res) => {
    // destructure
    const { username, fingerprint } = req.body;

    try {
        // build user object structure
        const userObject = {
            username,
            fingerprint,
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
        if (
            err.code === 11000 ||
            err instanceof mongoose.Error.ValidationError
        ) {
            return res.status(400).json({
                success: false,
                error: err.message,
            });
        }

        console.error(err);
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
    const fingerprint = req.query.fingerprint as string;

    try {
        // check if fingerprint matches in the db
        const accounts: UserType[] = await User.find({ fingerprint });
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
router.delete("/deleteAccount", requireSelf, async (req, res) => {
    // destructure
    const userId = req.query.userId as string;

    try {
        // delete user
        const deletedUserDocument: UserType | null =
            await User.findByIdAndDelete(userId);

        // if user not found
        if (!deletedUserDocument) {
            return res.status(400).json({
                success: false,
                error: "Invalid ID Error: User data was not found with the provided ID",
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
});

/**
 * @post
 *      POST request to update the recorded IP address of the user
 */
router.post("/updateIpAddress", async (req, res) => {
    // destructure ip address
    const { ipAddress, userId } = req.body;

    try {
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
