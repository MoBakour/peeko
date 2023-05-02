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

// User Object Type
export interface UserObjectType {
    username: string;
    email?: string;
    password?: string;
    deviceId?: string;
    deviceInfo?: {
        fingerprint?: string;
        brand?: string;
        model?: string;
        osVersion?: string;
        ipAddress?: string;
        abi?: {
            abiArc?: string;
            supportedAbis?: string;
        };
    };
}

// User type
export interface UserType extends UserObjectType, Document {}

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
