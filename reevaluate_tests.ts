import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import OpenAI from 'openai';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function reEvaluateTests() {
    // Get the user's email (you'll need to replace this with the actual email)
    const user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!user) {
        console.log('No user found');
        return;
    }

    console.log(`Re-evaluating tests for user: ${user.email}\n`);

    // Get all completed test sessions
    const sessions = await prisma.testSession.findMany({
        where: {
            userId: user.id,
            status: 'COMPLETED'
        },
        include: {
            responses: {
                include: { question: true },
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: { completedAt: 'desc' }
    });

    console.log(`Found ${sessions.length} completed tests\n`);

    for (const session of sessions) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Test Session: ${session.id}`);
        console.log(`Date: ${session.completedAt?.toLocaleString()}`);
        console.log(`Current Score: ${session.score}`);
        console.log(`${'='.repeat(60)}\n`);

        // Construct the transcript
        let fullTranscript = "IELTS Speaking Test Transcript:\n\n";

        session.responses.forEach((response: any) => {
            const part = response.question?.part || 1;
            fullTranscript += `[Part ${part}] Question: ${response.question.text}\n`;
            fullTranscript += `Candidate Answer: ${response.transcript}\n\n`;
        });

        // Re-analyze with improved prompt
        const systemPrompt = `You are an expert IELTS Speaking Examiner. 
        Your task is to evaluate the following full speaking test transcript and provide a holistic Band Score (0-9) and detailed feedback.
        
        Evaluate based on the 4 official criteria:
        1. Fluency and Coherence
        2. Lexical Resource
        3. Grammatical Range and Accuracy
        4. Pronunciation (Note: You can only estimate this based on the transcript text features like pauses or repetition if noted, but primarily focus on the other 3 for text-based analysis. Acknowledge this limitation.)

        BAND SCORE GUIDELINES:
        - Band 9: Expert user with full operational command
        - Band 8: Very good user with fully operational command (occasional inaccuracies)
        - Band 7: Good user with operational command (occasional inaccuracies in unfamiliar situations)
        - Band 6: Competent user with generally effective command (some inaccuracies and misunderstandings)
        - Band 5: Modest user with partial command (frequent problems but basic communication)
        - Band 4: Limited user with basic competence in familiar situations
        - Band 3: Extremely limited user conveying only general meaning
        - Band 2: Intermittent user with great difficulty
        - Band 1: Non-user with no ability except isolated words
        - Band 0: Did not attempt the test

        Calculate the overall band score as the AVERAGE of the 4 sub-scores, rounded to the nearest 0.5.
        For example: If sub-scores are Fluency: 7.0, Lexical: 6.5, Grammar: 6.0, Pronunciation: 6.5, 
        the overall band = (7.0 + 6.5 + 6.0 + 6.5) / 4 = 6.5

        Return the response in strictly valid JSON format with the following structure:
        {
            "overall_band": <calculated average rounded to nearest 0.5>,
            "sub_scores": {
                "fluency": <score 0-9 in 0.5 increments>,
                "lexical": <score 0-9 in 0.5 increments>,
                "grammar": <score 0-9 in 0.5 increments>,
                "pronunciation": <score 0-9 in 0.5 increments>
            },
            "feedback": {
                "strengths": ["specific strength 1", "specific strength 2", "..."],
                "weaknesses": ["specific weakness 1", "specific weakness 2", "..."],
                "general_comments": "Overall assessment and recommendations for improvement"
            }
        }`;

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: fullTranscript }
                ],
                response_format: { type: "json_object" }
            });

            const analysisResult = JSON.parse(completion.choices[0].message.content || "{}");

            console.log('NEW EVALUATION:');
            console.log(`Overall Band Score: ${analysisResult.overall_band}`);
            console.log(`\nSub-scores:`);
            console.log(`  Fluency & Coherence: ${analysisResult.sub_scores.fluency}`);
            console.log(`  Lexical Resource: ${analysisResult.sub_scores.lexical}`);
            console.log(`  Grammar: ${analysisResult.sub_scores.grammar}`);
            console.log(`  Pronunciation: ${analysisResult.sub_scores.pronunciation}`);

            console.log(`\nStrengths:`);
            analysisResult.feedback.strengths.forEach((s: string, i: number) => {
                console.log(`  ${i + 1}. ${s}`);
            });

            console.log(`\nWeaknesses:`);
            analysisResult.feedback.weaknesses.forEach((w: string, i: number) => {
                console.log(`  ${i + 1}. ${w}`);
            });

            console.log(`\nGeneral Comments:`);
            console.log(`  ${analysisResult.feedback.general_comments}`);

            // Update the session with new score
            await prisma.testSession.update({
                where: { id: session.id },
                data: {
                    score: analysisResult.overall_band
                }
            });

            console.log(`\n✅ Updated session score from ${session.score} to ${analysisResult.overall_band}`);

        } catch (error) {
            console.error(`Failed to re-analyze session ${session.id}:`, error);
        }
    }
}

async function main() {
    try {
        await reEvaluateTests();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
