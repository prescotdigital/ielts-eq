import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'fs';
import path from 'path';

// Load .env manually
try {
    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });
} catch (e) {
    console.log('No .env file found or error reading it');
}

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
    ssl: true
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Checking Test Sessions...");
    const sessions = await prisma.testSession.findMany({
        include: {
            user: true,
            responses: true
        },
        orderBy: {
            date: 'desc'
        }
    });

    console.log(`Found ${sessions.length} sessions.`);
    sessions.forEach(s => {
        console.log(`Session ID: ${s.id}`);
        console.log(`  User: ${s.user.email} (${s.userId})`);
        console.log(`  Status: ${s.status}`);
        console.log(`  Date: ${s.date}`);
        console.log(`  Score: ${s.score}`);
        console.log(`  Responses: ${s.responses.length}`);
        console.log("---------------------------------------------------");
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
