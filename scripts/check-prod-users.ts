import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('🔍 Checking production database users...\n');

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            emailVerified: true,
            accounts: {
                select: {
                    provider: true,
                }
            }
        },
        take: 10
    });

    console.log(`Found ${users.length} users:\n`);

    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Has Password: ${user.password ? '✅ Yes' : '❌ No'}`);
        console.log(`   Email Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`);
        console.log(`   OAuth Providers: ${user.accounts.map(a => a.provider).join(', ') || 'None'}`);
        console.log('');
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
