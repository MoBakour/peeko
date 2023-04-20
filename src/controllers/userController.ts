// imports
import express from "express";
import { UserType } from "../types";
import User from "../models/user";
import {
    invalidIdErrorMsg,
    invalidUsernameErrorMsg,
} from "../middleware/errorHandling";

// express router
const router = express.Router();

/**
 * @post
 *      POST request to attempt signup from client.
 */
router.post("/signup", async (req, res) => {
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

        res.status(200).json({
            success: true,
            userDocument,
        });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: invalidUsernameErrorMsg,
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

        // return result
        res.status(200).json({
            success: true,
            hasAccount,
            accounts,
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
router.delete("/delete", async (req, res) => {
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
                error: invalidIdErrorMsg,
            });
        }

        // if deleted user
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

// export router
export default router;
