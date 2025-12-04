import { prisma } from '../src/lib/prisma';

async function main() {
    const email = 'graham.page91@gmail.com';

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            accounts: true
        }
    });

    if (user) {
        console.log('User found:');
        console.log(JSON.stringify(user, null, 2));

        if (user.accounts.length === 0) {
            console.log('\n⚠️  This is a credentials-only account (email/password)');
            console.log('User cannot sign in with Google because the account was created with email/password');
            console.log('\nOptions:');
            console.log('1. Sign in with email/password instead');
            console.log('2. Delete this account and re-create with Google OAuth');
            console.log('3. Link Google account to this user (requires code change)');
        } else {
            console.log('\n✅ User has linked accounts:');
            user.accounts.forEach(acc => {
                console.log(`  - ${acc.provider}`);
            });
        }
    } else {
        console.log('❌ User not found');
    }

    await prisma.$disconnect();
}

main().catch(console.error);
