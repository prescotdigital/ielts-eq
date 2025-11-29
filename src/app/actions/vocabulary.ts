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

    // Log analytics event
    await prisma.analyticsEvent.create({
        data: {
            userId: user.id,
            type: 'VOCAB_PRACTICE',
            metadata: { flashcardId, familiarity }
        }
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

export async function getSublistProgress() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return {};

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) return {};

    // Get all progress for this user
    const progress = await prisma.userFlashcardProgress.findMany({
        where: { userId: user.id },
        include: { flashcard: true }
    });

    // Group by sublist
    const sublistStats: Record<number, { total: number, reviewed: number, mastered: number }> = {};

    // Initialize for 1-10
    for (let i = 1; i <= 10; i++) {
        sublistStats[i] = { total: 0, reviewed: 0, mastered: 0 };
    }

    // We need to know total words per sublist to be accurate, but for now we'll just count what we've seen
    // Ideally we'd query the Flashcard table for totals, but let's just track "active" progress for now.

    progress.forEach(p => {
        const sub = p.flashcard.sublist;
        if (!sublistStats[sub]) sublistStats[sub] = { total: 0, reviewed: 0, mastered: 0 };

        sublistStats[sub].reviewed++;
        if (p.familiarity === 3) sublistStats[sub].mastered++;
    });

    return sublistStats;
}

export async function updateGameProgress(wordIds: string[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    // Update all words to at least "reviewed" (familiarity 1) or increment review count
    await Promise.all(wordIds.map(async (id) => {
        const existing = await prisma.userFlashcardProgress.findUnique({
            where: { userId_flashcardId: { userId: user.id, flashcardId: id } }
        });

        if (existing) {
            await prisma.userFlashcardProgress.update({
                where: { id: existing.id },
                data: {
                    reviewCount: { increment: 1 },
                    lastReviewed: new Date(),
                    familiarity: existing.familiarity === 0 ? 1 : existing.familiarity
                }
            });
        } else {
            await prisma.userFlashcardProgress.create({
                data: {
                    userId: user.id,
                    flashcardId: id,
                    familiarity: 1,
                    reviewCount: 1,
                    lastReviewed: new Date()
                }
            });
        }
    }));

    // Log analytics
    await prisma.analyticsEvent.create({
        data: {
            userId: user.id,
            type: 'VOCAB_PRACTICE',
            metadata: { wordCount: wordIds.length }
        }
    });

    return { success: true };
}
