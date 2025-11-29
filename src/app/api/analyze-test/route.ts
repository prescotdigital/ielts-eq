import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // 1. Fetch all responses for this session
        const session = await prisma.testSession.findUnique({
            where: { id: sessionId },
            include: {
                responses: {
                    include: { question: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (session.responses.length === 0) {
            return NextResponse.json({ error: 'No responses found for this session' }, { status: 400 });
        }

        // 2. Analyze each individual response and update feedback
        console.log(`Analyzing ${session.responses.length} individual responses...`);

        for (const response of session.responses) {
            if (!response.feedback) {
                try {
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4-turbo",
                        messages: [
                            {
                                role: "system",
                                content: `You are an IELTS speaking examiner. Analyze the user's response.
                                Provide feedback in JSON format with the following fields:
                                - grammar_errors: list of strings
                                - pronunciation_issues: list of strings (general tips)
                                - cefr_level: string (A1-C2)
                                - improved_response: string
                                - score: number (0-9)`
                            },
                            {
                                role: "user",
                                content: `Question: ${response.question.text}\n\nTranscript: ${response.transcript}`
                            }
                        ],
                        response_format: { type: "json_object" }
                    });

                    const feedback = JSON.parse(completion.choices[0].message.content || "{}");

                    await prisma.response.update({
                        where: { id: response.id },
                        data: {
                            feedback: JSON.stringify(feedback),
                            score: feedback.score
                        }
                    });
                } catch (err) {
                    console.error(`Failed to analyze response ${response.id}:`, err);
                    // Continue with other responses
                }
            }
        }

        // 3. Construct the collective transcript for holistic analysis
        let fullTranscript = "IELTS Speaking Test Transcript:\n\n";

        session.responses.forEach((response: any, index: number) => {
            const part = response.question?.part || 1;
            fullTranscript += `[Part ${part}] Question: ${response.question.text}\n`;
            fullTranscript += `Candidate Answer: ${response.transcript}\n\n`;
        });

        console.log("Sending full transcript to GPT-4 for holistic analysis...");

        // 4. Send to GPT-4 for Holistic Analysis
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

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: fullTranscript }
            ],
            response_format: { type: "json_object" }
        });

        const analysisResult = JSON.parse(completion.choices[0].message.content || "{}");

        // 5. Update the TestSession with score and analysis
        await prisma.testSession.update({
            where: { id: sessionId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                score: analysisResult.overall_band,
                analysis: JSON.stringify(analysisResult) // Save the full analysis with sub_scores
            }
        });

        // Log analytics event
        await prisma.analyticsEvent.create({
            data: {
                userId: session.userId,
                type: 'TEST_COMPLETE',
                metadata: {
                    sessionId: session.id,
                    score: analysisResult.overall_band
                }
            }
        });

        // 6. Mark questions as used for this user
        const questionIds = session.responses.map(r => r.questionId);
        await prisma.questionUsage.createMany({
            data: questionIds.map(questionId => ({
                userId: session.userId,
                questionId
            })),
            skipDuplicates: true
        });

        console.log(`✅ Marked ${questionIds.length} questions as used for user ${session.userId}`);

        return NextResponse.json({
            success: true,
            result: analysisResult
        });

    } catch (error) {
        console.error("Holistic Analysis Failed:", error);
        return NextResponse.json({
            error: 'Failed to complete analysis. Please try again.'
        }, { status: 500 });
    }
}
