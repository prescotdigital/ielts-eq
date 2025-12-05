import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const TITLE_GENERATION_PROMPT = `You are an expert SEO copywriter for an IELTS preparation blog.

Generate 5 SEO-optimized blog titles based on the topic provided.

REQUIREMENTS:
- Each title should be 50-60 characters
- Include the primary keyword naturally
- Make them engaging but professional
- Vary the formats: How-to, List, Question, Statement
- Target CEFR C1-C2 English proficiency level
- Academic yet approachable tone

Return ONLY a JSON array of 5 title strings, nothing else.`;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topic, keyword, category } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: TITLE_GENERATION_PROMPT },
                {
                    role: 'user',
                    content: `Topic: ${topic}\nPrimary Keyword: ${keyword || 'IELTS'}\nCategory: ${category || 'General'}\n\nGenerate 5 title options.`
                }
            ],
            temperature: 0.9,
            max_tokens: 300,
        });

        const content = completion.choices[0].message.content;
        const titles = JSON.parse(content || '[]');

        return NextResponse.json({ titles });
    } catch (error: any) {
        console.error('Title generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate titles' },
            { status: 500 }
        );
    }
}
