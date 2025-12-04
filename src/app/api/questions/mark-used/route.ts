import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { questionIds } = await request.json();

        if (!Array.isArray(questionIds) || questionIds.length === 0) {
            return NextResponse.json({ error: 'Invalid question IDs' }, { status: 400 });
        }

        // Look up user ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Mark questions as used
        await prisma.questionUsage.createMany({
            data: questionIds.map(questionId => ({
                userId: user.id,
                questionId
            })),
            skipDuplicates: true
        });

        return NextResponse.json({ success: true, marked: questionIds.length });
    } catch (error) {
        console.error('Failed to mark questions as used:', error);
        return NextResponse.json({ error: 'Failed to mark questions as used' }, { status: 500 });
    }
}
