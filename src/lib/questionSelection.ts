import { prisma } from './prisma';

/**
 * Question Selection Utilities
 * Smart rotation system to ensure users get different questions on each test
 */

interface SelectQuestionsOptions {
    userId: string;
    part: number;
    count: number;
    category?: string;
    ensureDifferentCategories?: boolean;
}

/**
 * Get list of question IDs that a user has already seen
 */
export async function getSeenQuestionIds(userId: string, part?: number): Promise<string[]> {
    const usageRecords = await prisma.questionUsage.findMany({
        where: {
            userId,
            ...(part && {
                question: {
                    part
                }
            })
        },
        select: {
            questionId: true
        }
    });

    return usageRecords.map(record => record.questionId);
}

/**
 * Select questions that user hasn't seen yet
 * If user has seen all questions, reset and allow repetition
 */
export async function selectUnseenQuestions(options: SelectQuestionsOptions): Promise<any[]> {
    const { userId, part, count, category, ensureDifferentCategories } = options;

    // 1. Get questions user has already seen
    const seenQuestionIds = await getSeenQuestionIds(userId, part);

    // 2. Query unseen questions
    let unseenQuestions = await prisma.question.findMany({
        where: {
            part,
            id: { notIn: seenQuestionIds },
            ...(category && { category })
        },
        orderBy: {
            createdAt: 'asc' // Older questions first
        }
    });

    // 3. If user has seen all questions in this category/part, allow repetition
    if (unseenQuestions.length < count) {
        console.log(`User ${userId} has seen most questions for part ${part}. Allowing repetition.`);
        unseenQuestions = await prisma.question.findMany({
            where: {
                part,
                ...(category && { category })
            }
        });
    }

    // 4. Apply selection strategy
    if (ensureDifferentCategories && unseenQuestions.length >= count) {
        return selectFromDifferentCategories(unseenQuestions, count);
    }

    // 5. Random selection
    return shuffleAndTake(unseenQuestions, count);
}

/**
 * Select questions ensuring they come from different categories
 */
function selectFromDifferentCategories(questions: any[], count: number): any[] {
    // Group questions by category
    const byCategory = questions.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = [];
        acc[q.category].push(q);
        return acc;
    }, {} as Record<string, any[]>);

    const categories = Object.keys(byCategory);
    const selected: any[] = [];
    const usedCategories = new Set<string>();

    // First pass: one question from each category
    for (let i = 0; i < count && categories.length > 0; i++) {
        const availableCategories = categories.filter(cat => !usedCategories.has(cat));

        if (availableCategories.length === 0) {
            // All categories used, reset
            usedCategories.clear();
        }

        const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const categoryQuestions = byCategory[randomCategory];
        const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

        selected.push(randomQuestion);
        usedCategories.add(randomCategory);
    }

    return selected.slice(0, count);
}

/**
 * Shuffle array and take first N elements
 */
function shuffleAndTake<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Select a complete set of questions for a full test
 * Part 1: 4 questions from different categories
 * Part 2: 1 cue card
 * Part 3: 4 follow-up questions related to Part 2 category
 */
export async function selectQuestionsForTest(userEmail: string) {
    // Look up user ID from email
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const userId = user.id;

    // Part 1: 4 questions from different categories
    const part1Questions = await selectUnseenQuestions({
        userId,
        part: 1,
        count: 4,
        ensureDifferentCategories: true
    });

    // Part 2: 1 cue card from random category
    const part2Questions = await selectUnseenQuestions({
        userId,
        part: 2,
        count: 1
    });

    const part2Question = part2Questions[0];

    // Part 3: 4 follow-up questions
    // Try to get questions from same category as Part 2, otherwise random
    let part3Questions = await selectUnseenQuestions({
        userId,
        part: 3,
        count: 4,
        category: part2Question?.category
    });

    // If not enough questions in same category, get random Part 3 questions
    if (part3Questions.length < 4) {
        part3Questions = await selectUnseenQuestions({
            userId,
            part: 3,
            count: 4
        });
    }

    return {
        part1: part1Questions,
        part2: part2Question,
        part3: part3Questions
    };
}

/**
 * Mark questions as used by a user
 */
export async function markQuestionsAsUsed(userId: string, questionIds: string[]) {
    await prisma.questionUsage.createMany({
        data: questionIds.map(questionId => ({
            userId,
            questionId
        })),
        skipDuplicates: true // Don't error if already marked
    });
}
