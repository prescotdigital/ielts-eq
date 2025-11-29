"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getDrills() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    const drills = await prisma.pronunciationDrill.findMany({
        orderBy: { order: 'asc' },
        include: {
            userProgress: {
                where: { userId: user.id }
            }
        }
    });

    return drills;
}

export async function updateDrillProgress(drillId: string, score: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    await prisma.userPronunciationProgress.upsert({
        where: {
            userId_drillId: {
                userId: user.id,
                drillId
            }
        },
        update: {
            completed: true,
            score: Math.max(score, 0), // Keep highest score logic if needed, but for now just update
            attempts: { increment: 1 },
            lastAttempt: new Date()
        },
        create: {
            userId: user.id,
            drillId,
            completed: true,
            score,
            attempts: 1
        }
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
        data: {
            userId: user.id,
            type: 'PRONUNCIATION_PRACTICE',
            metadata: { drillId, score }
        }
    });

    return { success: true };
}
