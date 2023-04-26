// imports
import { Document } from "mongoose";
import { Request } from "express";

// MulterFile type
export type MulterFileType = Express.Multer.File;

// Request with resource type
export interface PeekoRequest extends Request {
    resource?: UserType | CommentType | VideoType;
    currentUser?: UserType | null;
}

// User type
export interface UserType extends Document {
    username: string;
    deviceId: string;
}

// Comment type
export interface CommentType extends Document {
    commentorId: string;
    commentorUsername: string;
    comment: string;
    videoKey: string;
}

// Video type
export interface VideoType extends Document {
    uploaderId: string;
    uploaderUsername: string;
    videoKey: string;
    likes: string[];
}
