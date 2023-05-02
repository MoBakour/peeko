// imports
import { Response, NextFunction } from "express";
import { PeekoRequest, VideoType } from "../types";
import Video from "../models/video";

// check if video exists in the database
export const checkVideoExists = async (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    // destructure
    const videoKey = (req.body.videoKey || req.params.videoKey) as string;

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
