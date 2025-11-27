"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

    // Here you would integrate with your email service
    // For example, using Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
        from: 'support@yourdomain.com',
        to: 'connect@prescot.io',
        subject: `Support Ticket: ${subject}`,
        html: `
            <h2>Support Ticket from ${session.user.name || session.user.email}</h2>
            <p><strong>From:</strong> ${session.user.email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
        attachments: attachments
    });
    */

    // For now, we'll just log it (you'll need to set up email service)
    console.log("Support ticket submitted:", {
        from: session.user.email,
        subject,
        message,
        attachmentCount: attachments.length
    });

    // Temporary: Return success
    // TODO: Implement actual email sending
    return { success: true };
}
