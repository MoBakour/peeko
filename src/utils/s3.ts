import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";

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

export const s3_post = async (fileObject: FileType) => {
    const fileStream = fs.createReadStream(fileObject.path);

    const params = {
        Bucket: bucketName,
        Key: fileObject.filename,
        Body: fileStream,
        ContentType: fileObject.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return fileObject.filename;
};

export const s3_get = async (fileKey: string) => {
    const params = {
        Bucket: bucketName,
        Key: fileKey,
    };

    const command = new GetObjectCommand(params);
    const result = await s3.send(command);

    return result;
};

export const s3_delete = async (fileKey: string | string[]) => {
    // if user doesn't have videos, do not attempt delete
    if (!fileKey || fileKey.length === 0) return;

    if (typeof fileKey === "string") {
        return await s3.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
            })
        );
    } else if (Array.isArray(fileKey)) {
        return await s3.send(
            new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                    Objects: fileKey.map((key) => ({ Key: key })),
                },
            })
        );
    }
};
