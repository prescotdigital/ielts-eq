import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Test User',
            // In a real app, you'd hash the password. 
            // Since our auth logic in route.ts is a placeholder that just checks if user exists,
            // we don't strictly need a password field in the DB for this MVP unless we added it to the schema.
            // Checking schema... User model doesn't have a password field yet.
            // The credentials provider in route.ts currently just checks if user exists.
            // We should probably add a password field to the schema for a real credentials flow,
            // but for this "magic link" style or simple check, just existing is enough for the code I wrote.
            // Wait, let me check route.ts again.
        },
    })
    console.log({ user })
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
