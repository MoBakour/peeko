// imports
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import { MulterFileType } from "../types";

// s3 instance
const bucketName = process.env.AWS_BUCKET_NAME!;
const region = process.env.AWS_BUCKET_REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

// upload to s3
export const s3_upload = async (file: MulterFileType) => {
    try {
        const fileStream = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.filename,
        };

        const result = await s3.upload(uploadParams).promise();
        return result;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

// download from s3
export const s3_download = (fileKey: string) => {
    try {
        const downloadParams = {
            Bucket: bucketName,
            Key: fileKey,
        };

        return s3.getObject(downloadParams);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};

// delete from s3
export const s3_delete = async (fileKey: string) => {
    try {
        const deleteParams = {
            Bucket: bucketName,
            Key: fileKey,
        };

        const result = await s3.deleteObject(deleteParams).promise();
        return result;
    } catch (err: any) {
        console.error(err);
        throw err;
    }
};
