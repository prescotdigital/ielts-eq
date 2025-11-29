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
 * Add Part 3 questions for orphaned themes
 */

const newPart3Questions = [
    // PLACES theme (for "ideal home", "place you visited", etc.)
    {
        text: "How have housing options changed in your country over the years?",
        part: 3,
        category: "Places",
        themeGroup: "places",
        difficulty: "medium",
        tags: ["housing", "change", "society"]
    },
    {
        text: "What factors do people consider when choosing where to live?",
        part: 3,
        category: "Places",
        themeGroup: "places",
        difficulty: "medium",
        tags: ["housing", "decision-making", "preferences"]
    },
    {
        text: "Do you think it's better to live in a house or an apartment? Why?",
        part: 3,
        category: "Places",
        themeGroup: "places",
        difficulty: "medium",
        tags: ["housing", "opinion", "comparison"]
    },
    {
        text: "How important is location when choosing a place to live?",
        part: 3,
        category: "Places",
        themeGroup: "places",
        difficulty: "medium",
        tags: ["housing", "location", "priorities"]
    },
    {
        text: "What are the advantages and disadvantages of living in the city versus the countryside?",
        part: 3,
        category: "Places",
        themeGroup: "places",
        difficulty: "hard",
        tags: ["urban", "rural", "comparison"]
    },
    {
        text: "How do you think homes will change in the future?",
        part: 3,
        category: "Places",
        themeGroup: "places",
        difficulty: "hard",
        tags: ["housing", "future", "innovation"]
    },

    // EVENTS theme (for "memorable event", "celebration", etc.)
    {
        text: "Why do people celebrate special events?",
        part: 3,
        category: "Events",
        themeGroup: "events",
        difficulty: "medium",
        tags: ["celebration", "culture", "society"]
    },
    {
        text: "How have celebrations changed in your country over time?",
        part: 3,
        category: "Events",
        themeGroup: "events",
        difficulty: "medium",
        tags: ["celebration", "change", "tradition"]
    },
    {
        text: "Do you think traditional festivals are important? Why?",
        part: 3,
        category: "Events",
        themeGroup: "events",
        difficulty: "medium",
        tags: ["festivals", "tradition", "culture"]
    },
    {
        text: "How do people in your country celebrate important life events?",
        part: 3,
        category: "Events",
        themeGroup: "events",
        difficulty: "medium",
        tags: ["celebration", "culture", "customs"]
    },
    {
        text: "What role do public celebrations play in society?",
        part: 3,
        category: "Events",
        themeGroup: "events",
        difficulty: "hard",
        tags: ["celebration", "society", "community"]
    },
    {
        text: "Do you think people spend too much money on celebrations?",
        part: 3,
        category: "Events",
        themeGroup: "events",
        difficulty: "hard",
        tags: ["celebration", "money", "opinion"]
    },

    // INTERESTS theme (for "hobby", "sport", "outdoor activity", etc.)
    {
        text: "Why is it important for people to have hobbies?",
        part: 3,
        category: "Interests",
        themeGroup: "interests",
        difficulty: "medium",
        tags: ["hobbies", "wellbeing", "lifestyle"]
    },
    {
        text: "How have people's leisure activities changed over the years?",
        part: 3,
        category: "Interests",
        themeGroup: "interests",
        difficulty: "medium",
        tags: ["hobbies", "change", "society"]
    },
    {
        text: "Do you think children today have enough time for hobbies?",
        part: 3,
        category: "Interests",
        themeGroup: "interests",
        difficulty: "medium",
        tags: ["hobbies", "children", "time"]
    },
    {
        text: "What are the benefits of team sports compared to individual sports?",
        part: 3,
        category: "Interests",
        themeGroup: "interests",
        difficulty: "medium",
        tags: ["sports", "comparison", "benefits"]
    },
    {
        text: "How can governments encourage people to be more active?",
        part: 3,
        category: "Interests",
        themeGroup: "interests",
        difficulty: "hard",
        tags: ["sports", "health", "policy"]
    },
    {
        text: "Do you think outdoor activities are more beneficial than indoor ones?",
        part: 3,
        category: "Interests",
        themeGroup: "interests",
        difficulty: "medium",
        tags: ["activities", "health", "comparison"]
    },

    // CULTURE theme (for "favorite book", "favorite film", etc.)
    {
        text: "Why do you think reading is important?",
        part: 3,
        category: "Culture",
        themeGroup: "culture",
        difficulty: "medium",
        tags: ["reading", "education", "benefits"]
    },
    {
        text: "How has technology changed the way people read?",
        part: 3,
        category: "Culture",
        themeGroup: "culture",
        difficulty: "medium",
        tags: ["reading", "technology", "change"]
    },
    {
        text: "Do you think films can be educational?",
        part: 3,
        category: "Culture",
        themeGroup: "culture",
        difficulty: "medium",
        tags: ["films", "education", "media"]
    },
    {
        text: "How do films influence society?",
        part: 3,
        category: "Culture",
        themeGroup: "culture",
        difficulty: "hard",
        tags: ["films", "society", "influence"]
    },
    {
        text: "What makes a book or film popular?",
        part: 3,
        category: "Culture",
        themeGroup: "culture",
        difficulty: "medium",
        tags: ["culture", "popularity", "media"]
    },
    {
        text: "Do you think people read less than they used to? Why?",
        part: 3,
        category: "Culture",
        themeGroup: "culture",
        difficulty: "medium",
        tags: ["reading", "change", "society"]
    },
];

async function addMissingPart3Questions() {
    console.log('Adding missing Part 3 questions for orphaned themes...\n');

    for (const question of newPart3Questions) {
        await prisma.question.create({
            data: question
        });
    }

    console.log(`✅ Added ${newPart3Questions.length} new Part 3 questions\n`);

    // Print summary
    console.log('=== Updated Theme Group Summary ===');
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

    // Check for orphaned themes again
    console.log('\n=== Checking for Orphaned Themes ===');
    const part2Themes = new Set(part2Groups.map(g => g.themeGroup));
    const part3Themes = new Set(part3Groups.map(g => g.themeGroup));

    let orphanedCount = 0;
    part2Themes.forEach(theme => {
        if (!part3Themes.has(theme)) {
            console.log(`⚠ WARNING: Part 2 has "${theme}" theme but Part 3 does not!`);
            orphanedCount++;
        }
    });

    if (orphanedCount === 0) {
        console.log('✅ All Part 2 themes now have matching Part 3 questions!');
    }
}

async function main() {
    try {
        await addMissingPart3Questions();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
