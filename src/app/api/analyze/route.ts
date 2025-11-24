import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import os from 'os';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    try {
        const { audioUrl, questionId, sessionId } = await request.json();

        if (!audioUrl || !questionId || !sessionId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log("Analyzing audio from:", audioUrl);

        // 1. Transcribe audio
        let transcription = "";
        let tempFilePath = "";

        try {
            // Extract Key from URL
            // Format: https://[bucket].s3.[region].amazonaws.com/[key]
            const urlObj = new URL(audioUrl);
            // The pathname includes the leading slash, e.g. "/uploads/file.webm"
            // We remove the leading slash to get the key "uploads/file.webm"
            const key = urlObj.pathname.substring(1);

            console.log("Downloading from S3, Key:", key);

            const s3Params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
            };

            const command = new GetObjectCommand(s3Params);
            const s3Response = await s3Client.send(command);

            // Save to temp file
            const tempDir = os.tmpdir();
            const tempFilename = `recording-${Date.now()}.webm`;
            tempFilePath = path.join(tempDir, tempFilename);

            if (!s3Response.Body) {
                throw new Error("Empty body from S3");
            }

            // @ts-ignore - S3 Body is a stream in Node
            await pipeline(s3Response.Body, fs.createWriteStream(tempFilePath));

            console.log("Saved to temp file:", tempFilePath);

            const transcriptionResponse = await openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: "whisper-1",
            });

            transcription = transcriptionResponse.text;
            console.log("Transcription:", transcription);

        } catch (transcribeError) {
            console.error("Transcription failed:", transcribeError);
            transcription = "Audio transcription failed. Please check logs.";
        } finally {
            // Cleanup temp file
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        }

        // 2. Save to database (without AI analysis for now - will be done at the end)
        const response = await prisma.response.create({
            data: {
                sessionId,
                questionId,
                audioUrl,
                transcript: transcription,
                feedback: null, // Will be populated during final analysis
                score: null,    // Will be populated during final analysis
            },
        });

        return NextResponse.json({
            id: response.id,
            transcript: transcription,
            message: 'Transcription complete. Analysis will be available in your results.'
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json({
            error: 'Failed to process response. Please try again.'
        }, { status: 500 });
    }
}
