import { prisma } from '../src/lib/prisma';

async function main() {
    const email = 'graham.page91@gmail.com';

    console.log('=== INVESTIGATING OAUTH ISSUE ===\n');

    // Check for ALL users with this email
    const users = await prisma.user.findMany({
        where: { email },
    });

    console.log(`Found ${users.length} user(s) with email: ${email}\n`);

    for (const user of users) {
        console.log(`User ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Has Password: ${!!user.password}`);
        console.log(`Email Verified: ${user.emailVerified}`);

        // Get accounts
        const accounts = await prisma.account.findMany({
            where: { userId: user.id }
        });

        console.log(`\nAccounts (${accounts.length}):`);
        accounts.forEach(acc => {
            console.log(`  - Provider: ${acc.provider}`);
            console.log(`    Provider Account ID: ${acc.providerAccountId}`);
            console.log(`    Type: ${acc.type}`);
        });

        // Get sessions
        const sessions = await prisma.session.findMany({
            where: { userId: user.id }
        });

        console.log(`\nActive Sessions: ${sessions.length}`);
        console.log('---\n');
    }

    // Check for orphaned accounts
    const orphanedAccounts = await prisma.account.findMany({
        where: {
            user: {
                email
            }
        },
        include: {
            user: true
        }
    });

    console.log(`\nTotal Account records for this email: ${orphanedAccounts.length}`);

    await prisma.$disconnect();
}

main().catch(console.error);
