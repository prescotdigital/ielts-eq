import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Import prisma after dotenv.config()
    const { prisma } = await import('../src/lib/prisma');

    const email = 'vasilevsem2009@yandex.ru';
    const password = 'NhaTrang';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`🔍 Checking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        // Update existing user
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
            },
        });
        console.log(`✅ Updated password for existing user: ${email}`);
    } else {
        // Create new user
        await prisma.user.create({
            data: {
                email,
                name: 'Test User',
                password: hashedPassword,
                role: 'USER',
            },
        });
        console.log(`✅ Created new user: ${email}`);
    }

    console.log('🎉 Test User Created Successfully');
    await prisma.$disconnect();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
