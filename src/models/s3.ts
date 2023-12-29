import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { MulterFileType } from "../types";

const bucketName = process.env.AWS_BUCKET_NAME!;
const region = process.env.AWS_BUCKET_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region,
});

export const s3_post = async (file: MulterFileType) => {
    try {
        const fileStream = fs.createReadStream(file.path);

        const params = {
            Bucket: bucketName,
            Key: file.filename,
            Body: fileStream,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        return file.filename;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

export const s3_get = async (fileKey: string) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };

        const command = new GetObjectCommand(params);
        const result = await s3.send(command);

        return result;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

export const s3_delete = async (fileKey: string) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };

        const command = new DeleteObjectCommand(params);
        const result = await s3.send(command);

        return result;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};
