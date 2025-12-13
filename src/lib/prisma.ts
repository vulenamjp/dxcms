import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// 1. Connection Pool
const connectionString = process.env.DATABASE_URL

const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === 'production' || connectionString?.includes('neondb') 
    ? { rejectUnauthorized: false } 
    : undefined 
})

// 2. Create Adapter
const adapter = new PrismaPg(pool)

// 3. Define Global to avoid "Too many connections" when Hot Reload Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 4. Initialize Prisma Client with Adapter
export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma