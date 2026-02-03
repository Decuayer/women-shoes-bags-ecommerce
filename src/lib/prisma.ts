import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Allow self-signed certificates for Supabase in development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Get DATABASE_URL with error handling
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please add it to your environment variables.'
  )
}

// Reuse pool in serverless environment
if (!globalForPrisma.pool) {
  try {
    globalForPrisma.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }, // Supabase requires this
      max: 1, // Limit connections in serverless environment
      idleTimeoutMillis: 60000, // 60 seconds before closing idle connections
      connectionTimeoutMillis: 30000, // 30 seconds to establish connection
      statement_timeout: 30000, // 30 seconds for query execution
    })

    // Test connection
    globalForPrisma.pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err)
    })

    globalForPrisma.pool.on('connect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Database connection established')
      }
    })
  } catch (error) {
    console.error('❌ Failed to create database connection pool:', error)
    throw new Error(
      'Database connection failed. Please check your DATABASE_URL and database server status.'
    )
  }
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

