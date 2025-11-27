"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getWords(sublist: number = 1, limit: number = 20) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    // Get user ID
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    // Fetch words from the specified sublist
    // We could also implement logic to prioritize unseen words here
    const words = await prisma.flashcard.findMany({
        where: { sublist },
        take: limit,
        // Randomize order (Prisma doesn't support random natively well, so we'll shuffle in JS or use raw query if needed)
        // For now, simple fetch is fine, we can shuffle on client or add random skip
    });

    // Simple shuffle
    return words.sort(() => Math.random() - 0.5);
}

export async function updateProgress(flashcardId: string, familiarity: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    // Upsert progress
    await prisma.userFlashcardProgress.upsert({
        where: {
            userId_flashcardId: {
                userId: user.id,
                flashcardId,
            },
        },
        update: {
            familiarity,
            lastReviewed: new Date(),
            reviewCount: { increment: 1 },
        },
        create: {
            userId: user.id,
            flashcardId,
            familiarity,
            lastReviewed: new Date(),
            reviewCount: 1,
        },
    });

    return { success: true };
}

export async function getUserStats() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) return null;

    const progress = await prisma.userFlashcardProgress.findMany({
        where: { userId: user.id },
    });

    const totalReviewed = progress.length;
    const mastered = progress.filter(p => p.familiarity === 3).length;
    const learning = progress.filter(p => p.familiarity > 0 && p.familiarity < 3).length;

    return {
        totalReviewed,
        mastered,
        learning,
    };
}
