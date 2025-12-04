import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, provider, error, userAgent } = await req.json();

        if (!email || !provider) {
            return NextResponse.json(
                { error: 'Email and provider are required' },
                { status: 400 }
            );
        }

        // Try to find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });

        // Get IP from headers
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');

        // Log the failed attempt
        await prisma.loginAttempt.create({
            data: {
                email,
                userId: user?.id,
                provider,
                success: false,
                error: error || 'Unknown error',
                ip: ip || undefined,
                userAgent: userAgent || undefined,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to log login attempt:', error);
        return NextResponse.json(
            { error: 'Failed to log attempt' },
            { status: 500 }
        );
    }
}
