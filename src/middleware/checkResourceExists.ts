// imports
import { Response, NextFunction } from "express";
import { RequestWithResourceType, UserType, VideoType } from "../types";
import User from "../models/user";
import Video from "../models/video";
import { invalidIdErrorMsg, invalidKeyErrorMsg } from "./errorHandling";

// check if video exists in the database
export const checkVideoExists = async (
    req: RequestWithResourceType,
    res: Response,
    next: NextFunction
) => {
    // destructure
    const videoKey = (req.query.videoKey || req.body.videoKey) as string;

    try {
        // get video
        const video: VideoType | null = await Video.findOne({ videoKey });

        // check if video exists
        if (!video) {
            return res.status(400).json({
                success: false,
                error: invalidKeyErrorMsg,
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
    req: RequestWithResourceType,
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

        // check if user exists
        if (!user) {
            return res.status(400).json({
                success: false,
                error: invalidIdErrorMsg,
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
