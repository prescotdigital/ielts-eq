// This script WIPES all users from the production database
// Run with: DATABASE_URL=<prod-url> npx tsx scripts/wipe-prod-users.ts

import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('⚠️  WARNING: About to DELETE ALL USERS from production database...');
    console.log('⏳ Waiting 5 seconds before proceeding...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🚀 Deleting related records first...');

    // Delete related records in order of dependency
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.testSession.deleteMany({});
    await prisma.userPronunciationProgress.deleteMany({});
    await prisma.userFlashcardProgress.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.analyticsEvent.deleteMany({});

    console.log('🚀 Deleting users...');
    const { count } = await prisma.user.deleteMany({});

    console.log(`✅ Deleted ${count} users.`);

    await prisma.$disconnect();
}

main().catch(console.error);
