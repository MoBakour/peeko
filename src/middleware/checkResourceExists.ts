// imports
import { Response, NextFunction } from "express";
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
        const video: VideoType | null = await Video.findOne({
            videoKey,
        }).populate("uploader", { username: 1 });

        // if video does not exist
        if (!video) {
            return res.status(400).json({
                success: false,
                error: "Video not found",
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
