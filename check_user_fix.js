const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking for test user...");
        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' },
        });
        if (user) {
            console.log("User found:", user);
        } else {
            console.log("User NOT found. Creating...");
            await prisma.user.create({
                data: {
                    email: 'test@example.com',
                    name: 'Test User',
                }
            });
            console.log("User created.");
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
