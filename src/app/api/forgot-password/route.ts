import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Don't reveal if user exists (security best practice)
        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with that email, a password reset link has been sent.'
            });
        }

        // Check if user has a password (not OAuth-only)
        if (!user.password) {
            // User is OAuth-only, but don't reveal this
            return NextResponse.json({
                message: 'If an account exists with that email, a password reset link has been sent.'
            });
        }

        // Generate secure random token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        // Delete any existing reset tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email }
        });

        // Create new reset token
        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires
            }
        });

        // Send reset email
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

        await resend.emails.send({
            from: 'IELTS EQ <noreply@ieltseq.com>',
            to: email,
            subject: 'Reset Your Password - IELTS EQ',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #10b981;">Reset Your Password</h1>
                    <p>You requested to reset your password for your IELTS EQ account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #6b7280; font-size: 14px;">${resetUrl}</p>
                    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                        This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                    </p>
                </div>
            `
        });

        return NextResponse.json({
            message: 'If an account exists with that email, a password reset link has been sent.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
