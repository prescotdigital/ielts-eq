import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkUserRole() {
    const email = 'connect@prescot.io';
    const user = await prisma.user.findUnique({
        where: { email }
    });

    console.log(`User: ${user?.email}`);
    console.log(`Role: ${user?.role}`);
}

checkUserRole()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
