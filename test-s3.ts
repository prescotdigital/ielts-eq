import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

async function testUpload() {
    console.log("Testing S3 Upload...");
    console.log("Region:", process.env.AWS_REGION);
    console.log("Bucket:", process.env.AWS_BUCKET_NAME);
    console.log("Access Key ID:", process.env.AWS_ACCESS_KEY_ID ? "Set" : "Not Set");

    const filename = `test-upload-${Date.now()}.txt`;

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filename,
                Body: "Hello from IELTS EQ S3 Test",
                ContentType: "text/plain",
            })
        );
        console.log(`Successfully uploaded ${filename}`);
        console.log(`URL: https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`);
    } catch (error) {
        console.error("S3 Upload Error:", error);
    }
}

testUpload();
