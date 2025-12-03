// This script creates an admin user in the production database
// Run with: DATABASE_URL=<prod-url> npx tsx scripts/create-prod-admin.ts

import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@ieltseq.com';
    const password = 'TempAdmin2024!';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('🚀 Creating production admin user...\n');

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
        create: {
            email,
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`\n⚠️  IMPORTANT: Change this password after first login!\n`);

    await prisma.$disconnect();
}

main().catch(console.error);
