import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MASTER_SYSTEM_PROMPT = `You are an expert IELTS and academic English content writer with a specialty in creating engaging, SEO-optimized blog content.

CRITICAL STYLE REQUIREMENTS - YOU MUST FOLLOW THESE:
- Write at CEFR C1-C2 level (advanced academic English)
- Use ONLY academic punctuation: periods, commas, semicolons, colons
- ABSOLUTELY NO em-dashes (—) or excessive ellipses (...)
- NEVER use these AI-detection patterns:
  * "delve into" or "delving into"
  * "navigate the landscape"
  * "it's important to note that"
  * "it's worth mentioning"
  * "unlock the secrets"
  * "in today's world"  
  * "in this article, we will..."
- Vary sentence structure naturally: mix simple, compound, and complex sentences
- Use active voice predominantly (80%+ of sentences)
- Include occasional contractions where natural ("it's", "you'll", "we're")
- Write with authority but approachability
- Use British English spelling (learnt, colour, analyse, organisation)
- Include specific examples and data where relevant

CONTENT STRUCTURE:
- Hook opening: Start with a surprising fact, question, or bold statement
- Clear thesis statement to orient the reader
- Logical progression with smooth transitions
- Concrete, actionable takeaways
- Strong conclusion with clear call-to-action

SEO OPTIMIZATION:
- Include primary keyword in the first paragraph naturally
- Use semantic variations of keywords throughout
- Natural keyword placement (aim for 2-3% density)
- Write for humans first, search engines second
- Create content worthy of featured snippets

AUTHENTICITY MARKERS:
- Include personal insights or anecdotes where appropriate
- Acknowledge limitations or counterarguments
- Use varied paragraph lengths (2-6 sentences)
- Occasional sentence fragments for emphasis (sparingly)
- Real-world examples with specific details`;

const STYLE_PROMPTS: Record<string, string> = {
    notice: `STYLE: Notice/Announcement
- Direct and professional tone
- Get to the point quickly
- Clear structure: What, Why, When, How
- Bullet points for key information
- Strong emphasis on actionability`,

    publication: `STYLE: Publication/Academic Article
- Formal yet accessible tone
- Evidence-based arguments
- Citations to studies or research where relevant
- Logical flow of ideas
- Comprehensive analysis`,

    editorial: `STYLE: Editorial/Opinion Piece
- Balanced, thoughtful perspective
- Personal voice with professional credibility
- Engagement through persuasion
- Acknowledge alternative viewpoints
- Compelling call-to-action`,

    tutorial: `STYLE: Tutorial/How-To Guide
- Practical, step-by-step approach
- Clear, numbered instructions where appropriate
- Anticipate common questions
- Include tips and warnings
- Focus on learner success`
};

const LENGTH_TARGETS: Record<string, string> = {
    short: '600-800 words',
    medium: '1000-1500 words',
    long: '2000-3000 words'
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, style = 'publication', length = 'medium', keyword, topic } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.publication;
        const targetLength = LENGTH_TARGETS[length] || LENGTH_TARGETS.medium;

        const userPrompt = `Write a blog post with the following specifications:

TITLE: ${title}
TARGET LENGTH: ${targetLength}
PRIMARY KEYWORD: ${keyword || ''}
TOPIC CONTEXT: ${topic || ''}

${stylePrompt}

Important reminders:
- NO em-dashes (—), use commas, semicolons, or periods instead
- Avoid AI clichés like "delve into" or "it's worth noting"
- Start strong with a hook, not with "In this article..."
- Use British spellings
- Include specific examples where possible
- Write naturally, as if explaining to a friend who respects your expertise

Return the content in clean markdown format with appropriate headers (##, ###), lists, and formatting.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: MASTER_SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        const content = completion.choices[0].message.content || '';

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error('Content generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate content' },
            { status: 500 }
        );
    }
}
