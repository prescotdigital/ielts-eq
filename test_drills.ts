import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Checking PronunciationDrills...');
    const drills = await prisma.pronunciationDrill.findMany();
    console.log(`Found ${drills.length} drills.`);
    drills.forEach(d => console.log(`- ${d.label} (${d.phoneme})`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
