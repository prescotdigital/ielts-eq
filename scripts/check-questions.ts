import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('🔍 Checking Part 1 questions in production database...\n');

    const part1Count = await prisma.question.count({
        where: { part: 1 }
    });

    const part2Count = await prisma.question.count({
        where: { part: 2 }
    });

    const part3Count = await prisma.question.count({
        where: { part: 3 }
    });

    console.log(`Part 1 Questions: ${part1Count}`);
    console.log(`Part 2 Questions: ${part2Count}`);
    console.log(`Part 3 Questions: ${part3Count}`);

    if (part1Count < 12) {
        console.log(`\n⚠️  Part 1 has only ${part1Count} questions. Need at least 12 for a full test!`);
    }

    // Show Part 1 categories
    const part1Questions = await prisma.question.findMany({
        where: { part: 1 },
        select: {
            id: true,
            text: true,
            category: true
        }
    });

    console.log('\nPart 1 Questions by Category:');
    const byCategory = part1Questions.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = [];
        acc[q.category].push(q.text);
        return acc;
    }, {} as Record<string, string[]>);

    Object.entries(byCategory).forEach(([category, questions]) => {
        console.log(`\n📂 ${category}: ${questions.length} questions`);
        questions.forEach((q, i) => console.log(`   ${i + 1}. ${q.substring(0, 60)}...`));
    });

    await prisma.$disconnect();
}

main().catch(console.error);
