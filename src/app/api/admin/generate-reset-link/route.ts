import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        // Check admin auth
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has password (not OAuth-only)
        if (!user.password) {
            return NextResponse.json(
                { error: 'This user only uses OAuth authentication (Google). No password to reset.' },
                { status: 400 }
            );
        }

        // Generate secure random token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        // Delete any existing reset tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email: user.email }
        });

        // Create new reset token
        await prisma.passwordResetToken.create({
            data: {
                email: user.email,
                token,
                expires
            }
        });

        // Return reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

        return NextResponse.json({
            resetUrl,
            expiresIn: '1 hour'
        });

    } catch (error) {
        console.error('Admin password reset error:', error);
        return NextResponse.json(
            { error: 'Failed to generate reset link' },
            { status: 500 }
        );
    }
}
