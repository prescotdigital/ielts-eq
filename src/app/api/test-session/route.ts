import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({
                error: 'Authentication required. Please sign in to start a test.'
            }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({
                error: 'User not found. Please sign in again.'
            }, { status: 404 });
        }

        const newTestSession = await prisma.testSession.create({
            data: {
                userId: user.id,
            }
        });

        return NextResponse.json({ sessionId: newTestSession.id });

    } catch (error: any) {
        console.error("Failed to create session:", error);
        return NextResponse.json({
            error: 'Failed to create test session. Please try again.'
        }, { status: 500 });
    }
}
