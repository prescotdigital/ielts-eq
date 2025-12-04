import { prisma } from '../src/lib/prisma';

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@ieltseq.com' },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });

    if (admin) {
        console.log('Admin user found:');
        console.log(JSON.stringify(admin, null, 2));

        if (admin.role !== 'ADMIN') {
            console.log('\n⚠️  Role is not ADMIN! Updating...');

            await prisma.user.update({
                where: { email: 'admin@ieltseq.com' },
                data: { role: 'ADMIN' }
            });

            console.log('✅ Role updated to ADMIN');
        } else {
            console.log('\n✅ Role is correctly set to ADMIN');
        }
    } else {
        console.log('❌ Admin user not found!');
    }

    await prisma.$disconnect();
}

main().catch(console.error);
