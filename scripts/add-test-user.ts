import { UserRole, SubscriptionStatus } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Import prisma after dotenv.config()
    const { prisma } = await import('../src/lib/prisma');

    const email = 'vasilevsem2009@yandex.ru';
    const name = 'Simon';

    console.log(`🔍 Checking for user: ${email}...`);

    try {
        // Upsert user to ensure they exist and have ADMIN role
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: UserRole.ADMIN,
                name: name,
                emailVerified: new Date(), // Ensure OAuth linking works
            },
            create: {
                email,
                name,
                role: UserRole.ADMIN,
                emailVerified: new Date(), // Ensure OAuth linking works
                image: null, // Optional
            },
        });

        console.log(`✅ User upserted: ${user.email} (Role: ${user.role})`);

        // Check for existing active subscription
        const existingSub = await prisma.subscription.findFirst({
            where: {
                userId: user.id,
                status: SubscriptionStatus.ACTIVE,
            },
        });

        if (existingSub) {
            console.log(`ℹ️ User already has an active subscription: ${existingSub.id}`);
        } else {
            // Create a new active subscription
            const newSub = await prisma.subscription.create({
                data: {
                    userId: user.id,
                    status: SubscriptionStatus.ACTIVE,
                    planId: 'lifetime_access',
                    amount: 0,
                    currency: 'USD',
                    startDate: new Date(),
                },
            });
            console.log(`✅ Created active subscription for user: ${newSub.id}`);
        }

        console.log('\n🎉 Test user setup complete! They have full ADMIN access and an ACTIVE subscription.');

    } catch (error) {
        console.error('❌ Error setting up test user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
