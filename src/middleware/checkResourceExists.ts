// imports
import { Response, NextFunction } from "express";
import { PeekoRequest, UserType, VideoType } from "../types";
import User from "../models/user";
import Video from "../models/video";

// check if video exists in the database
export const checkVideoExists = async (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    // destructure
    const videoKey = (req.query.videoKey || req.body.videoKey) as string;

    try {
        // get video
        const video: VideoType | null = await Video.findOne({ videoKey });

        // if video does not exist
        if (!video) {
            return res.status(400).json({
                success: false,
                error: "Invalid Key Error: Video data was not found with the provided key",
            });
        }

        // go to next handler if video exists
        req.resource = video;
        next();
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// check if user exists in the database
export const checkUserExists = async (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    // destructure
    /*
        req.query.userId => for get/delete requests
        req.body.commentorId => for post comment request
    */
    const userId = (req.query.userId || req.body.commentorId) as string;

    try {
        // get user
        const user: UserType | null = await User.findById(userId);

        // if user does not exist
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid ID Error: User data was not found with the provided ID",
            });
        }

        // go to next handler if user exists
        req.resource = user;
        next();
    } catch (err: any) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};
