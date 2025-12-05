import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface AnalysisResult {
    aiScore: number;
    confidence: 'high' | 'medium' | 'low';
    breakdown: {
        sentenceLengthVariance: number;
        burstiness: number;
        transitionDensity: number;
        clicheCount: number;
        passiveVoiceRatio: number;
    };
    issues: string[];
    recommendations: string[];
}

// AI clichés to detect
const AI_CLICHES = [
    'delve into', 'delving into', 'dive into', 'diving into',
    'navigate the landscape', 'landscape of', 'tapestry',
    'it\'s important to note', 'it\'s worth noting', 'it\'s worth mentioning',
    'in today\'s world', 'in this day and age',
    'unlock the secrets', 'unlock the power',
    'game-changer', 'game changer',
    'revolutionize', 'transform your',
    'embark on', 'journey into'
];

// Overused transitions
const OVERUSED_TRANSITIONS = [
    'furthermore', 'moreover', 'additionally', 'consequently',
    'therefore', 'thus', 'hence', 'accordingly'
];

function analyzeSentenceLengthVariance(sentences: string[]): number {
    const lengths = sentences.map(s => s.split(' ').length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    // Low variance (< 5) suggests AI. Higher variance (> 7) suggests human
    return stdDev;
}

function analyzeBurstiness(sentences: string[]): number {
    // Burstiness: ratio of consecutive short-short-long patterns
    // Humans tend to write in bursts, AI is more uniform
    let burstPatterns = 0;

    for (let i = 0; i < sentences.length - 2; i++) {
        const len1 = sentences[i].split(' ').length;
        const len2 = sentences[i + 1].split(' ').length;
        const len3 = sentences[i + 2].split(' ').length;

        // Short-short-long pattern (typical human burst)
        if (len1 < 12 && len2 < 12 && len3 > 20) {
            burstPatterns++;
        }
    }

    return burstPatterns / Math.max(sentences.length - 2, 1);
}

function analyzeTransitionDensity(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const transitionCount = OVERUSED_TRANSITIONS.reduce((count, transition) => {
        const regex = new RegExp(`\\b${transition}\\b`, 'gi');
        return count + (text.match(regex) || []).length;
    }, 0);

    return transitionCount / words.length;
}

function detectCliches(text: string): number {
    return AI_CLICHES.reduce((count, cliche) => {
        const regex = new RegExp(cliche, 'gi');
        return count + (text.match(regex) || []).length;
    }, 0);
}

function analyzePassiveVoice(text: string): number {
    // Simple passive voice detection: "is/are/was/were/been/be + past participle"
    const passivePatterns = [
        /\b(is|are|was|were|been|be)\s+\w+ed\b/gi,
        /\b(is|are|was|were|been|be)\s+(being\s+)?\w+en\b/gi
    ];

    const sentences = text.split(/[.!?]+/);
    const passiveCount = passivePatterns.reduce((count, pattern) => {
        return count + (text.match(pattern) || []).length;
    }, 0);

    return passiveCount / sentences.length;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Split into sentences
        const sentences = content
            .split(/[.!?]+/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);

        // Calculate metrics
        const sentenceLengthVariance = analyzeSentenceLengthVariance(sentences);
        const burstiness = analyzeBurstiness(sentences);
        const transitionDensity = analyzeTransitionDensity(content);
        const clicheCount = detectCliches(content);
        const passiveVoiceRatio = analyzePassiveVoice(content);

        // Calculate AI score (0-100, higher = more AI-like)
        const uniformityPenalty = sentenceLengthVariance < 5 ? (5 - sentenceLengthVariance) / 5 : 0;
        const burstinessPenalty = burstiness < 0.2 ? (0.2 - burstiness) / 0.2 : 0;
        const transitionPenalty = Math.min(transitionDensity / 0.05, 1);
        const clichePenalty = Math.min(clicheCount / 5, 1);
        const passivePenalty = Math.min(passiveVoiceRatio / 0.4, 1);

        const aiScore = Math.round(
            uniformityPenalty * 25 +
            burstinessPenalty * 20 +
            transitionPenalty * 20 +
            clichePenalty * 20 +
            passivePenalty * 15
        );

        // Determine confidence
        const confidence: 'high' | 'medium' | 'low' =
            aiScore > 60 || aiScore < 30 ? 'high' :
                aiScore > 45 || aiScore < 40 ? 'medium' : 'low';

        // Generate issues and recommendations
        const issues: string[] = [];
        const recommendations: string[] = [];

        if (sentenceLengthVariance < 5) {
            issues.push(`Sentence lengths too uniform (variance: ${sentenceLengthVariance.toFixed(1)})`);
            recommendations.push('Add 2-3 very short sentences (5-8 words) and 1-2 longer ones (30+ words)');
        }

        if (burstiness < 0.2) {
            issues.push(`Low burstiness score: ${burstiness.toFixed(2)} (target: >0.3)`);
            recommendations.push('Create short-short-long sentence patterns for natural flow');
        }

        if (transitionDensity > 0.03) {
            issues.push(`Overuse of formal transitions (${(transitionDensity * 100).toFixed(1)}% of text)`);
            recommendations.push('Replace "Furthermore" and "Moreover" with casual alternatives like "Plus" or "What\'s more"');
        }

        if (clicheCount > 0) {
            issues.push(`${clicheCount} AI cliché${clicheCount > 1 ? 's' : ''} detected`);
            recommendations.push('Remove phrases like "delve into", "landscape of", "it\'s worth noting"');
        }

        if (passiveVoiceRatio > 0.3) {
            issues.push(`High passive voice usage (${(passiveVoiceRatio * 100).toFixed(0)}%)`);
            recommendations.push('Convert passive constructions to active voice for more direct writing');
        }

        if (issues.length === 0) {
            issues.push('Content shows good human-like variation');
            recommendations.push('Consider adding 1-2 personal examples or specific details for extra authenticity');
        }

        const result: AnalysisResult = {
            aiScore,
            confidence,
            breakdown: {
                sentenceLengthVariance,
                burstiness,
                transitionDensity,
                clicheCount,
                passiveVoiceRatio
            },
            issues,
            recommendations
        };

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Content analysis error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze content' },
            { status: 500 }
        );
    }
}
