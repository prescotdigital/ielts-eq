import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileKey = searchParams.get('key');

        if (!fileKey) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        console.log("Streaming audio for key:", fileKey);

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        });

        const s3Response = await s3Client.send(command);

        if (!s3Response.Body) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Convert S3 stream to Web ReadableStream
        // @ts-ignore
        const stream = s3Response.Body.transformToWebStream();

        return new NextResponse(stream, {
            headers: {
                'Content-Type': s3Response.ContentType || 'audio/webm',
                'Content-Length': s3Response.ContentLength?.toString() || '',
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error("Audio Proxy Error:", error);
        return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 });
    }
}
