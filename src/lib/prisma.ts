import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
}

// Configure connection pool for serverless (Neon)
const pool = new Pool({
    connectionString,
    max: 1, // Single connection per serverless instance to avoid exhaustion
    idleTimeoutMillis: 0, // Keep connection alive
    connectionTimeoutMillis: 5000, // 5 second timeout
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
    prisma_new: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma_new ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new = prisma

