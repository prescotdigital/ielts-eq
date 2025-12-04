import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { selectQuestionsForTest } from '@/lib/questionSelection';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use smart question selection to get unseen questions
        const questions = await selectQuestionsForTest(session.user.email);

        // Format response to match expected structure
        const grouped = {
            1: questions.part1,
            2: [questions.part2], // Part 2 is a single question, wrap in array
            3: questions.part3,
        };

        return NextResponse.json(grouped);
    } catch (error: any) {
        console.error('Failed to fetch questions:', error);
        if (error.message === 'User not found') {
            return NextResponse.json({ error: 'User account not found. Please sign out and sign in again.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
