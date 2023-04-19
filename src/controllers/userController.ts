// imports
import express from "express";
import { UserType } from "../middleware/types";
import User from "../models/user";

// express router
const router = express.Router();

/**
 * @get
 *      GET request to check if device has a previous account.
 */
router.get("/hasAccount", async (req, res) => {
    // destructure
    const fingerprint = req.query.fingerprint as string;

    try {
        // check if fingerprint matches in the db
        const accounts = await User.find({ fingerprint });
        const hasAccount = accounts.length > 0;

        // return result
        res.status(200).json({
            success: true,
            hasAccount,
            accounts,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

/**
 * @post
 *      POST request to attempt login from a new client.
 */
router.post("/login", async (req, res) => {
    // destructure
    const { username, fingerprint } = req.body;

    try {
        // build user object structure
        const userObject: UserType = {
            username,
            fingerprint,
        };

        // insert to db and send response
        const createdUser = await User.create(userObject);

        res.status(200).json({
            success: true,
            exists: false,
            createdUser,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err,
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
        const deletedUser = await User.findByIdAndDelete(userId);

        // if user not found
        if (!deletedUser) {
            return res.status(400).json({
                success: false,
                error: "No user found with the given id",
            });
        }

        // if deleted user
        res.status(200).json({
            success: true,
            deletedUser,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

// export router
export default router;
