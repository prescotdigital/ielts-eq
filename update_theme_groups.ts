import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Update existing questions with theme groups
 * This script assigns theme groups to Part 2 and Part 3 questions for thematic linking
 */

async function updateThemeGroups() {
    console.log('Starting theme group updates...\n');

    // Theme Group 1: EVENTS & CELEBRATIONS
    console.log('Updating Events & Celebrations theme group...');
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'event' } },
                { text: { contains: 'celebration' } },
                { text: { contains: 'festival' } },
                { text: { contains: 'party' } },
                { category: 'Event' }
            ]
        },
        data: { themeGroup: 'events' }
    });

    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'celebration' } },
                { text: { contains: 'festival' } },
                { text: { contains: 'event' } },
                { text: { contains: 'gather' } },
                { text: { contains: 'ceremony' } }
            ]
        },
        data: { themeGroup: 'events' }
    });

    // Theme Group 2: PEOPLE & RELATIONSHIPS
    console.log('Updating People & Relationships theme group...');
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'person' } },
                { text: { contains: 'friend' } },
                { text: { contains: 'family' } },
                { text: { contains: 'teacher' } },
                { text: { contains: 'someone' } },
                { category: 'Person' }
            ]
        },
        data: { themeGroup: 'people' }
    });

    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'relationship' } },
                { text: { contains: 'friend' } },
                { text: { contains: 'family' } },
                { text: { contains: 'people' } },
                { text: { contains: 'social' } }
            ]
        },
        data: { themeGroup: 'people' }
    });

    // Theme Group 3: PLACES & TRAVEL
    console.log('Updating Places & Travel theme group...');
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'place' } },
                { text: { contains: 'visit' } },
                { text: { contains: 'travel' } },
                { text: { contains: 'city' } },
                { text: { contains: 'country' } },
                { category: 'Place' }
            ]
        },
        data: { themeGroup: 'places' }
    });

    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'travel' } },
                { text: { contains: 'tourism' } },
                { text: { contains: 'place' } },
                { text: { contains: 'city' } },
                { text: { contains: 'destination' } }
            ]
        },
        data: { themeGroup: 'places' }
    });

    // Theme Group 4: TECHNOLOGY & INNOVATION
    console.log('Updating Technology & Innovation theme group...');
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'technology' } },
                { text: { contains: 'device' } },
                { text: { contains: 'internet' } },
                { text: { contains: 'phone' } },
                { text: { contains: 'computer' } },
                { category: 'Technology' }
            ]
        },
        data: { themeGroup: 'technology' }
    });

    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'technology' } },
                { text: { contains: 'innovation' } },
                { text: { contains: 'digital' } },
                { text: { contains: 'internet' } },
                { text: { contains: 'future' } }
            ]
        },
        data: { themeGroup: 'technology' }
    });

    // Theme Group 5: EDUCATION & LEARNING
    console.log('Updating Education & Learning theme group...');
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'learn' } },
                { text: { contains: 'study' } },
                { text: { contains: 'skill' } },
                { text: { contains: 'course' } },
                { text: { contains: 'subject' } },
                { category: 'Education' }
            ]
        },
        data: { themeGroup: 'education' }
    });

    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'education' } },
                { text: { contains: 'learning' } },
                { text: { contains: 'school' } },
                { text: { contains: 'student' } },
                { text: { contains: 'teaching' } }
            ]
        },
        data: { themeGroup: 'education' }
    });

    // Theme Group 6: WORK & CAREER
    console.log('Updating Work & Career theme group...');
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'job' } },
                { text: { contains: 'work' } },
                { text: { contains: 'career' } },
                { text: { contains: 'business' } },
                { category: 'Work' }
            ]
        },
        data: { themeGroup: 'work' }
    });

    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'work' } },
                { text: { contains: 'career' } },
                { text: { contains: 'job' } },
                { text: { contains: 'employment' } },
                { text: { contains: 'profession' } }
            ]
        },
        data: { themeGroup: 'work' }
    });

    console.log('\nTheme group updates completed!');

    // Print summary
    const part2WithTheme = await prisma.question.count({
        where: { part: 2, themeGroup: { not: null } }
    });

    const part3WithTheme = await prisma.question.count({
        where: { part: 3, themeGroup: { not: null } }
    });

    console.log(`\nSummary:`);
    console.log(`- Part 2 questions with theme groups: ${part2WithTheme}`);
    console.log(`- Part 3 questions with theme groups: ${part3WithTheme}`);
}

async function main() {
    try {
        await updateThemeGroups();
    } catch (error) {
        console.error('Error updating theme groups:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
