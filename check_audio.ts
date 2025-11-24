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
    console.log("Checking Response Audio URLs...");
    const responses = await prisma.response.findMany({
        include: {
            question: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });

    console.log(`Found ${responses.length} responses.`);
    responses.forEach(r => {
        console.log(`Response ID: ${r.id}`);
        console.log(`  Question: ${r.question.text.substring(0, 50)}...`);
        console.log(`  Audio URL: ${r.audioUrl}`);
        console.log(`  Transcript: ${r.transcript?.substring(0, 50)}...`);
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
