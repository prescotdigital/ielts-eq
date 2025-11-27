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
            score: score, // Replace with new score
            completed: true
        },
        create: {
            userId: user.id,
            drillId,
            score,
            completed: true
        }
    });

    return { success: true };
}
