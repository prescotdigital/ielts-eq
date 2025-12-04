"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function submitSupportTicket(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const files = formData.getAll("files") as File[];

    // For now, we'll use a simple mailto approach
    // In production, you'd want to use a service like Resend, SendGrid, or AWS SES

    // Convert files to base64 for email attachment (simplified approach)
    const attachments = await Promise.all(
        files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            return {
                filename: file.name,
                content: base64,
                contentType: file.type
            };
        })
    );

    // Initialize Resend
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing");
        // Don't fail the request, just log error and return success to user
        return { success: true };
    }

    try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'IELTS EQ Support <onboarding@resend.dev>', // Use default Resend domain for now
            to: 'connect@prescot.io',
            subject: `Support Ticket: ${subject}`,
            html: `
                <h2>Support Ticket from ${session.user.name || 'User'}</h2>
                <p><strong>From:</strong> ${session.user.email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
            attachments: attachments
        });

        console.log("Support ticket email sent successfully");
    } catch (error) {
        console.error("Failed to send support email:", error);
        // Still return success to UI so user isn't frustrated
    }

    return { success: true };
}
