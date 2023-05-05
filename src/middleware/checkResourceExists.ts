// imports
import { Response, NextFunction } from "express";
import { ClientType, PeekoRequest, VideoType } from "../types";
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
                error: "video not found",
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

// check if client type is set
export const checkClientExists = async (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    // get client type from request body
    const { client } = req.body;

    // validate client type
    const validClientTypes: ClientType[] = ["web", "mobile"];
    if (!validClientTypes.includes(client?.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: "Invalid client type",
        });
    }

    next();
};
