// imports
import { Document } from "mongoose";
import { Request } from "express";

// MulterFile type
export type MulterFileType = Express.Multer.File;

// Request with resource type
export interface RequestWithResourceType extends Request {
    resource?: UserType | CommentType | VideoType;
}

// User type
export interface UserType extends Document {
    username: string;
    fingerprint: string;
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
