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
    let user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
    })
    if (!user) {
        console.log('User not found. Creating...')
        user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                name: 'Test User',
            }
        })
        console.log('User created:', user)
    } else {
        console.log('User found:', user)
    }
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
