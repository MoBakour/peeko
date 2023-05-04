// imports
import fs from "fs";
import multer from "multer";

// set multer upload
export const upload = multer({
    dest: "./uploads",
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("video/")) {
            return cb(new Error("Only video files are accepted"));
        }
        cb(null, true);
    },
}).single("videoFile");

// delete file function
export const deleteFile = async (filePath: string) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (err: any) {
        console.error(err);
    }
};
