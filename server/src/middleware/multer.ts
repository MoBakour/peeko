// imports
import fs from "fs";
import multer from "multer";

// set multer upload
export const upload = multer({
    dest: "./uploads/",
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
export const deleteFile = async (filePath: string | string[]) => {
    try {
        if (typeof filePath === "string") {
            await fs.promises.unlink(filePath);
        } else if (Array.isArray(filePath)) {
            for (const singlePath of filePath) {
                await fs.promises.unlink(singlePath);
            }
        }
    } catch (err: any) {
        console.error(err);
    }
};
