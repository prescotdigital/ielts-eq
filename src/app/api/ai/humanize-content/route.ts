import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PASS_1_STRUCTURAL_PROMPT = `You are a content humanization expert. Your task is to make AI-generated text sound more naturally human by varying sentence structure.

CRITICAL RULES:
1. Include 2-3 sentence fragments for emphasis (e.g., "Really important." or "Not always.")
2. Mix very short sentences (5-8 words) with longer ones (25-35 words)
3. Add 1-2 rhetorical questions
4. Create at least 1 single-sentence paragraph for impact
5. Use the "short-short-long" pattern in 2-3 places (two brief sentences followed by a complex one)
6. Maintain all facts and key points from the original
7. Keep C1-C2 English level

Original content:
{content}

Return ONLY the rewritten content with structural variation. No explanations.`;

const PASS_2_PERSONALITY_PROMPT = `You are adding personality and natural imperfections to make content sound human-written.

CRITICAL RULES:
1. Use contractions naturally where appropriate ("it's", "you'll", "we're", "don't")
2. Add 1-2 parenthetical asides - brief thoughts in parentheses
3. Replace some formal transitions:
   - "Furthermore" → "Plus," "What's more," "And here's the thing,"
   - "Moreover" → "Better yet," "Even more important,"
   - "Additionally" → "Oh, and," "Not to mention,"
   - "Therefore" → "So," "That's why,"
4. Add emphasis with strategic capitalization or formatting
5. Allow minor conversational imperfections
6. Start 1-2 sentences informally ("Look," "Here's what matters," "Think about it")
7. Maintain C1-C2 English level but with personality

Content:
{content}

Return ONLY the enhanced content with personality. No explanations.`;

const PASS_3_SPECIFICITY_PROMPT = `You are making content more specific and grounded with concrete details.

CRITICAL RULES:
1. Replace vague timeframes with specific periods (e.g., "recently" → "in the past six months")
2. Add concrete examples with realistic details
3. Where general claims exist, add plausible statistics or data points
4. Include specific scenarios or brief case mentions
5. Make abstract concepts tangible with real-world analogies
6. If user examples are provided, naturally incorporate them
7. Maintain all original key points and facts

User-provided specific examples to incorporate (if any):
{userExamples}

Content:
{content}

Return ONLY the enhanced content with added specificity. No explanations.`;

async function runHumanizationPass(
    content: string,
    prompt: string,
    userExamples: string[] = []
): Promise<string> {
    const formattedPrompt = prompt
        .replace('{content}', content)
        .replace('{userExamples}', userExamples.join('\n- ') || 'None provided');

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are an expert at humanizing AI-generated content while maintaining quality and accuracy.'
            },
            {
                role: 'user',
                content: formattedPrompt
            }
        ],
        temperature: 0.8, // Higher temperature for more creative variation
        max_tokens: 3000,
    });

    return completion.choices[0].message.content || content;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, userExamples = [] } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // Pass 1: Structural Humanization
        console.log('Running Pass 1: Structural variation...');
        let humanizedContent = await runHumanizationPass(content, PASS_1_STRUCTURAL_PROMPT);

        // Pass 2: Personality Injection
        console.log('Running Pass 2: Adding personality...');
        humanizedContent = await runHumanizationPass(humanizedContent, PASS_2_PERSONALITY_PROMPT);

        // Pass 3: Specificity Enhancement
        console.log('Running Pass 3: Adding specificity...');
        humanizedContent = await runHumanizationPass(
            humanizedContent,
            PASS_3_SPECIFICITY_PROMPT,
            userExamples
        );

        // Track changes (simplified - just note that humanization occurred)
        const changes = [
            {
                type: 'sentence_variation',
                description: 'Added sentence length variety and fragments',
                location: 'throughout'
            },
            {
                type: 'personality',
                description: 'Injected contractions, asides, and informal transitions',
                location: 'throughout'
            },
            {
                type: 'specificity',
                description: 'Enhanced with concrete details and examples',
                location: 'throughout'
            }
        ];

        if (userExamples.length > 0) {
            changes.push({
                type: 'user_examples',
                description: `Incorporated ${userExamples.length} user-provided example(s)`,
                location: 'various sections'
            });
        }

        return NextResponse.json({
            humanizedContent,
            changes,
            message: 'Content humanized successfully through 3-pass transformation'
        });
    } catch (error: any) {
        console.error('Humanization error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to humanize content' },
            { status: 500 }
        );
    }
}
