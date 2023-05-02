// imports
import express from "express";
import requestIp from "request-ip";
import { requireLogin } from "../middleware/authentication";
import { PeekoRequest, UserType } from "../types";
import User from "../models/user";

// create router
const router = express.Router();

/**
 * @delete
 *      DELETE request to delete a user from the db
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
