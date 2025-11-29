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
 * Select a complete set of questions for an authentic IELTS test
 * Part 1: 8-12 questions from 1-3 themes
 * Part 2: 1 cue card
 * Part 3: 4-6 follow-up questions thematically linked to Part 2
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

    // STEP 1: Select Part 2 question (with theme group)
    const part2Questions = await selectUnseenQuestions({
        userId,
        part: 2,
        count: 1
    });

    const part2Question = part2Questions[0];
    const themeGroup = part2Question?.themeGroup;

    // STEP 2: Select Part 3 questions (4-6) from same theme group
    const part3Count = randomInt(4, 6);
    let part3Questions: any[] = [];

    if (themeGroup) {
        // Try to get questions from same theme group
        const seenQuestionIds = await getSeenQuestionIds(userId, 3);

        part3Questions = await prisma.question.findMany({
            where: {
                part: 3,
                themeGroup: themeGroup,
                id: { notIn: seenQuestionIds }
            }
        });

        // If not enough unseen questions in theme group, allow repetition
        if (part3Questions.length < part3Count) {
            part3Questions = await prisma.question.findMany({
                where: {
                    part: 3,
                    themeGroup: themeGroup
                }
            });
        }
    }

    // Fallback: if still not enough, get random Part 3 questions
    if (part3Questions.length < part3Count) {
        part3Questions = await selectUnseenQuestions({
            userId,
            part: 3,
            count: part3Count
        });
    }

    // Shuffle and take the required count
    part3Questions = shuffleAndTake(part3Questions, part3Count);

    // STEP 3: Select Part 1 questions (8-12) from 1-3 themes
    const part1Count = randomInt(8, 12);
    const themeCount = randomInt(1, 3);

    // Get all Part 1 categories to use as themes
    const allPart1Questions = await prisma.question.findMany({
        where: { part: 1 },
        select: { category: true }
    });

    const uniqueCategories = [...new Set(allPart1Questions.map(q => q.category))];

    // Randomly select 1-3 themes
    const selectedThemes = shuffleAndTake(uniqueCategories, themeCount);

    // Distribute questions across themes
    const part1Questions = await distributeQuestionsAcrossThemes(
        userId,
        selectedThemes,
        part1Count
    );

    return {
        part1: part1Questions,
        part2: part2Question,
        part3: part3Questions
    };
}

/**
 * Distribute Part 1 questions across multiple themes
 * More questions from first theme, fewer from subsequent themes
 */
async function distributeQuestionsAcrossThemes(
    userId: string,
    themes: string[],
    totalCount: number
): Promise<any[]> {
    const distribution: number[] = [];

    if (themes.length === 1) {
        distribution.push(totalCount);
    } else if (themes.length === 2) {
        // e.g., 8 questions: 5 from theme 1, 3 from theme 2
        const firstThemeCount = Math.ceil(totalCount * 0.6);
        distribution.push(firstThemeCount, totalCount - firstThemeCount);
    } else {
        // 3 themes: e.g., 10 questions: 5, 3, 2
        const firstThemeCount = Math.ceil(totalCount * 0.5);
        const secondThemeCount = Math.ceil((totalCount - firstThemeCount) * 0.6);
        const thirdThemeCount = totalCount - firstThemeCount - secondThemeCount;
        distribution.push(firstThemeCount, secondThemeCount, thirdThemeCount);
    }

    const allQuestions: any[] = [];

    for (let i = 0; i < themes.length; i++) {
        const theme = themes[i];
        const count = distribution[i];

        const themeQuestions = await selectUnseenQuestions({
            userId,
            part: 1,
            count,
            category: theme
        });

        allQuestions.push(...themeQuestions);
    }

    return allQuestions;
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
