// import multer
import multer from "multer";
import fs from "fs";
import { getVideoDurationInSeconds } from "get-video-duration";
import { PeekoRequest } from "../types";
import { Response, NextFunction } from "express";

// create multer instance
const upload = multer({
    dest: "./uploads",
});

// handle file validation
const validateFile = async (
    req: PeekoRequest,
    res: Response,
    next: NextFunction
) => {
    // if file not found
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: "File not found",
        });
    }

    const filePath = req.file.path;

    // if file is not video
    if (!req.file.mimetype.startsWith("video/")) {
        await deleteFile(filePath);

        return res.status(400).json({
            success: false,
            error: "File must be a video",
        });
    }

    try {
        // validate size
        let { size: fileSize } = await fs.promises.stat(filePath);
        fileSize /= 1024 ** 2; // convert from bytes to mb

        if (fileSize > 300) {
            await deleteFile(filePath);

            return res.status(400).json({
                success: false,
                error: "Maximum video file size is 300 MB",
            });
        }

        // validate duration
        const duration = await getVideoDurationInSeconds(filePath);

        if (duration > 300) {
            await deleteFile(filePath);

            return res.status(400).json({
                success: false,
                error: "Video duration must not exceed 5 minutes",
            });
        }

        next();
    } catch (err: any) {
        await deleteFile(filePath);

        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// delete video from fs
const deleteFile = async (filePath: string) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (err: any) {
        throw err;
    }
};

// exoprts
export { upload, validateFile, deleteFile };
