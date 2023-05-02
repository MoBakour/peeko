// imports
import express from "express";
import mongoose from "mongoose";
import requestIp from "request-ip";
import { UserObjectType, UserType } from "../types";
import User from "../models/user";
import { createToken } from "../middleware/authentication";
import { validateUser_app } from "../middleware/validation";

// express router
const router = express.Router();

/**
 * @post
 *      POST request to attempt signup (mobile-client)
 */
router.post("/signup", async (req, res) => {
    // destructure
    const { username, deviceId } = req.body;
    const deviceInfo = req.body.deviceInfo || {};

    try {
        // get user ip address
        const ipAddress = requestIp.getClientIp(req) || undefined;

        // build user object structure
        const userObject: UserObjectType = {
            username,
            deviceId,
            deviceInfo: { ...deviceInfo, ipAddress },
        };

        // validate user object
        const error = validateUser_app(userObject);
        if (error) {
            return res.status(400).json({
                success: false,
                error,
            });
        }

        // insert to db
        const userDocument: UserType = await User.create(userObject);

        // create JWT token
        const token = await createToken(userDocument._id.toString());

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

        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

/**
 * @get
 *      GET request to check if device has a previous account (mobile-client)
 */
router.get("/hasAccount/:deviceId", async (req, res) => {
    // destructure
    const { deviceId } = req.params;

    try {
        // check if deviceId matches in the db
        const accounts: UserType[] = await User.find({ deviceId });
        const hasAccount = accounts.length > 0;

        // create JWT token/s
        const tokens: { userId: string; token: string }[] = [];
        for (const account of accounts) {
            const token = (await createToken(account._id.toString())) as string;
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

// export router
export default router;
