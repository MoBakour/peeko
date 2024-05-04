import { Document, PopulatedDoc } from "mongoose";
import { Request } from "express";

declare global {
    type MulterFileType = Express.Multer.File;
    type FileType = {
        path: string;
        filename: string;
        mimetype: string;
    };

    interface PeekoRequest extends Request {
        resource?: UserType | CommentType | VideoType;
        currentUser?: UserType | null;
    }

    interface MongoTimestamps {
        createdAt: Date;
        updatedAt: Date;
    }

    interface UserObjectType {
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
            activationCode?: string;
            attemptsLeft: number;
            blocked: boolean;
        };
    }

    interface UserType extends UserObjectType, Document, MongoTimestamps {}

    interface CommentType extends Document, MongoTimestamps {
        commentor: PopulatedDoc<UserType>;
        comment: string;
        videoKey: string;
    }

    interface VideoType extends Document, MongoTimestamps {
        uploader?: PopulatedDoc<UserType>;
        videoKey: string;
        likes?: string[];
        views?: string[];
        likesCount?: number;
        viewsCount?: number;
        commentsCount: number;
    }

    // interface VideoReturnType extends VideoType {
    //     likes?: string[];
    //     views?: string[];
    //     likesCount?: number;
    //     viewsCount?: number;
    // }
}
