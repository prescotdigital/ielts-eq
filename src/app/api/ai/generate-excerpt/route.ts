import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const EXCERPT_GENERATION_PROMPT = `You are an expert SEO copywriter for an IELTS preparation blog.

Generate 3 SEO-optimized meta descriptions/excerpts for a blog post.

REQUIREMENTS:
- Each excerpt should be 150-160 characters
- Compelling and click-worthy
- Include the primary keyword naturally
- End with a clear value proposition or hook
- Target CEFR C1-C2 English proficiency level

Return ONLY a JSON array of 3 excerpt strings, nothing else.`;

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, keyword } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: EXCERPT_GENERATION_PROMPT },
                {
                    role: 'user',
                    content: `Blog Title: ${title}\nPrimary Keyword: ${keyword || 'IELTS'}\n\nGenerate 3 excerpt options.`
                }
            ],
            temperature: 0.8,
            max_tokens: 300,
        });

        const content = completion.choices[0].message.content || '[]';

        // Remove markdown code blocks if present
        const cleanedContent = content
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const excerpts = JSON.parse(cleanedContent);

        return NextResponse.json({ excerpts });
    } catch (error: any) {
        console.error('Excerpt generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate excerpts' },
            { status: 500 }
        );
    }
}
