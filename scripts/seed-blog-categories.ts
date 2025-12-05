import { prisma } from '../src/lib/prisma';

const categories = [
    { name: 'Study Tips', slug: 'study-tips', description: 'Effective study strategies and learning techniques' },
    { name: 'Speaking', slug: 'speaking', description: 'IELTS Speaking test tips and practice advice' },
    { name: 'Writing', slug: 'writing', description: 'Writing skills and task strategies' },
    { name: 'Reading', slug: 'reading', description: 'Reading comprehension and speed reading tips' },
    { name: 'Listening', slug: 'listening', description: 'Listening practice and comprehension strategies' },
    { name: 'General English', slug: 'general-english', description: 'Overall English language improvement' },
    { name: 'Life & Language', slug: 'life-and-language', description: 'Cultural insights and real-world language use' },
];

async function main() {
    console.log('Seeding blog categories...');

    for (const category of categories) {
        const existing = await prisma.blogCategory.findUnique({
            where: { slug: category.slug }
        });

        if (!existing) {
            await prisma.blogCategory.create({
                data: category
            });
            console.log(`✓ Created category: ${category.name}`);
        } else {
            console.log(`- Category already exists: ${category.name}`);
        }
    }

    console.log('\n✅ Categories seeded successfully!');
    await prisma.$disconnect();
}

main().catch(console.error);
