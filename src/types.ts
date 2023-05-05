// imports
import { Document } from "mongoose";
import { Request } from "express";

// MulterFile type
export type MulterFileType = Express.Multer.File;

// Client Types
export type ClientType = "web" | "mobile";

// Request with resource type
export interface PeekoRequest extends Request {
    resource?: UserType | CommentType | VideoType;
    currentUser?: UserType | null;
}

// timestamps
interface MongoTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

// User Object Type
export interface UserObjectType {
    username: string;
    email: string;
    password?: string;
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
    activation?: {
        activated: boolean;
        activationCode: string;
        attemptsLeft: number;
        blocked: boolean;
    };
}

// User type
export interface UserType extends UserObjectType, Document, MongoTimestamps {}

// Comment type
export interface CommentType extends Document, MongoTimestamps {
    commentorId: string;
    commentorUsername: string;
    comment: string;
    videoKey: string;
}

// Video type
export interface VideoType extends Document, MongoTimestamps {
    uploaderId: string;
    uploaderUsername: string;
    videoKey: string;
    likes: string[];
}
