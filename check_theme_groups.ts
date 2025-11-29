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

async function checkThemeGroups() {
    // Check Part 2 questions without theme groups
    const part2WithoutTheme = await prisma.question.findMany({
        where: {
            part: 2,
            themeGroup: null
        },
        select: {
            id: true,
            text: true,
            category: true
        }
    });

    console.log('\n=== Part 2 Questions WITHOUT Theme Groups ===');
    console.log(`Found ${part2WithoutTheme.length} questions:\n`);
    part2WithoutTheme.forEach((q, i) => {
        console.log(`${i + 1}. [${q.category}] ${q.text.substring(0, 80)}...`);
    });

    // Check Part 3 questions without theme groups
    const part3WithoutTheme = await prisma.question.findMany({
        where: {
            part: 3,
            themeGroup: null
        },
        select: {
            id: true,
            text: true,
            category: true
        }
    });

    console.log('\n=== Part 3 Questions WITHOUT Theme Groups ===');
    console.log(`Found ${part3WithoutTheme.length} questions:\n`);
    part3WithoutTheme.forEach((q, i) => {
        console.log(`${i + 1}. [${q.category}] ${q.text.substring(0, 80)}...`);
    });

    // Show summary of theme groups
    const themeGroupCounts = await prisma.question.groupBy({
        by: ['themeGroup', 'part'],
        where: {
            themeGroup: { not: null },
            part: { in: [2, 3] }
        },
        _count: true
    });

    console.log('\n=== Theme Group Distribution ===');
    themeGroupCounts.forEach(group => {
        console.log(`Part ${group.part} - ${group.themeGroup}: ${group._count} questions`);
    });
}

async function main() {
    try {
        await checkThemeGroups();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
