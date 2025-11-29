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

async function assignRemainingThemeGroups() {
    console.log('Assigning theme groups to remaining questions...\n');

    // PART 2 ASSIGNMENTS
    console.log('=== Part 2 Questions ===');

    // Hobbies/Activities → "interests" theme
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'hobby' } },
                { text: { contains: 'sport' } },
                { text: { contains: 'game' } },
                { text: { contains: 'outdoor activity' } },
                { category: 'Activity' }
            ]
        },
        data: { themeGroup: 'interests' }
    });
    console.log('✓ Assigned "interests" theme to hobby/sport/activity questions');

    // Books/Films/Media → "culture" theme
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'book' } },
                { text: { contains: 'film' } },
                { text: { contains: 'movie' } },
                { category: 'Object', text: { contains: 'book' } },
                { category: 'Media' }
            ]
        },
        data: { themeGroup: 'culture' }
    });
    console.log('✓ Assigned "culture" theme to book/film questions');

    // Goals/Future → "aspirations" theme (can link to work/education)
    await prisma.question.updateMany({
        where: {
            part: 2,
            OR: [
                { text: { contains: 'goal' } },
                { text: { contains: 'achieve' } },
                { text: { contains: 'ambition' } },
                { category: 'Future' }
            ]
        },
        data: { themeGroup: 'education' } // Link to education/learning theme
    });
    console.log('✓ Assigned "education" theme to goal/achievement questions');

    // PART 3 ASSIGNMENTS
    console.log('\n=== Part 3 Questions ===');

    // Places/Housing/Living → "places" theme
    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'housing' } },
                { text: { contains: 'accommodation' } },
                { text: { contains: 'living' } },
                { text: { contains: 'home' } },
                { text: { contains: 'city' } },
                { text: { contains: 'urban' } },
                { text: { contains: 'rural' } },
                { text: { contains: 'architecture' } }
            ]
        },
        data: { themeGroup: 'places' }
    });
    console.log('✓ Assigned "places" theme to housing/living questions');

    // Environment → "environment" theme (new theme group)
    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'environment' } },
                { text: { contains: 'climate' } },
                { text: { contains: 'pollution' } },
                { text: { contains: 'nature' } },
                { category: 'Environment' }
            ]
        },
        data: { themeGroup: 'environment' }
    });
    console.log('✓ Assigned "environment" theme to environmental questions');

    // Family/Relationships → "people" theme
    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'family' } },
                { text: { contains: 'grandparent' } },
                { text: { contains: 'parent' } },
                { text: { contains: 'children' } },
                { category: 'Family' }
            ]
        },
        data: { themeGroup: 'people' }
    });
    console.log('✓ Assigned "people" theme to family questions');

    // Privacy/Online → "technology" theme
    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'privacy' } },
                { text: { contains: 'online' } },
                { text: { contains: 'data' } }
            ]
        },
        data: { themeGroup: 'technology' }
    });
    console.log('✓ Assigned "technology" theme to privacy/online questions');

    // Teaching/Learning → "education" theme
    await prisma.question.updateMany({
        where: {
            part: 3,
            OR: [
                { text: { contains: 'teacher' } },
                { text: { contains: 'teaching' } },
                { category: 'Education' }
            ]
        },
        data: { themeGroup: 'education' }
    });
    console.log('✓ Assigned "education" theme to teaching questions');

    // Now create Part 2 questions for new themes if needed
    console.log('\n=== Creating Additional Part 2 Questions for Balance ===');

    // Check if we need more Part 2 questions for "environment" and "interests" themes
    const environmentPart2 = await prisma.question.count({
        where: { part: 2, themeGroup: 'environment' }
    });

    if (environmentPart2 === 0) {
        console.log('⚠ No Part 2 questions for "environment" theme - consider adding some');
    }

    const interestsPart2 = await prisma.question.count({
        where: { part: 2, themeGroup: 'interests' }
    });

    console.log(`✓ Part 2 "interests" theme has ${interestsPart2} questions`);

    // Print final summary
    console.log('\n=== Final Theme Group Summary ===');
    const summary = await prisma.question.groupBy({
        by: ['themeGroup', 'part'],
        where: {
            themeGroup: { not: null },
            part: { in: [2, 3] }
        },
        _count: true
    });

    const part2Groups = summary.filter(s => s.part === 2);
    const part3Groups = summary.filter(s => s.part === 3);

    console.log('\nPart 2:');
    part2Groups.forEach(g => {
        console.log(`  ${g.themeGroup}: ${g._count} questions`);
    });

    console.log('\nPart 3:');
    part3Groups.forEach(g => {
        console.log(`  ${g.themeGroup}: ${g._count} questions`);
    });

    // Check for orphaned Part 2 questions (theme group with no Part 3 questions)
    console.log('\n=== Checking for Orphaned Themes ===');
    const part2Themes = new Set(part2Groups.map(g => g.themeGroup));
    const part3Themes = new Set(part3Groups.map(g => g.themeGroup));

    part2Themes.forEach(theme => {
        if (!part3Themes.has(theme)) {
            console.log(`⚠ WARNING: Part 2 has "${theme}" theme but Part 3 does not!`);
        }
    });

    console.log('\n✅ Theme group assignment complete!');
}

async function main() {
    try {
        await assignRemainingThemeGroups();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
