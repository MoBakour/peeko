// imports
import { ObjectId } from "mongoose";

// MulterFile type
export type MulterFileType = Express.Multer.File;

// MongoDB Document Type
export interface MongoDocumentType {
    _id?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}

// User type
export interface UserType extends MongoDocumentType {
    username: string;
    fingerprint: string;
}

// Comment type
export interface CommentType extends MongoDocumentType {
    commenterId: string;
    commenterUsername: string;
    comment: string;
    videoId: string;
}

// Video type
export interface VideoType extends MongoDocumentType {
    uploaderId: string;
    uploaderUsername: string;
    videoKey: string;
    likes: string[];
}
