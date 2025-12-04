import { prisma } from '../src/lib/prisma';

async function main() {
    const email = 'graham.page91@gmail.com';

    // Check for ALL users with this email (should only be 1)
    const users = await prisma.user.findMany({
        where: { email },
        include: {
            accounts: true
        }
    });

    console.log(`Found ${users.length} user(s) with email: ${email}\n`);

    users.forEach((user, index) => {
        console.log(`User #${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Has Password: ${!!user.password}`);
        console.log(`  Accounts: ${user.accounts.length}`);
        user.accounts.forEach(acc => {
            console.log(`    - ${acc.provider} (ID: ${acc.providerAccountId})`);
        });
        console.log('');
    });

    if (users.length > 1) {
        console.log('⚠️  DUPLICATE USERS FOUND! This will cause OAuth issues.');
        console.log('Need to merge or delete duplicate accounts.');
    }

    await prisma.$disconnect();
}

main().catch(console.error);
