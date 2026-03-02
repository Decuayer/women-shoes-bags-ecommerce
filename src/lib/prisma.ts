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

// Reuse pool across hot-reloads in dev
if (!globalForPrisma.pool) {
  try {
    globalForPrisma.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      // Use more connections so parallel Next.js requests don't queue up
      max: 5,
      min: 1,
      // How long to wait for a connection from the pool (ms)
      connectionTimeoutMillis: 10000,
      // How long a connection can stay idle before being closed (ms)
      idleTimeoutMillis: 30000,
      // How long a single query can run (ms)
      statement_timeout: 15000,
    })

    globalForPrisma.pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err)
    })

    globalForPrisma.pool.on('connect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Database connection established')
      }
    })

    // Warm-up: eagerly open a connection so the first request doesn't timeout
    globalForPrisma.pool.connect().then(client => {
      client.release()
    }).catch(err => {
      console.warn('⚠️ Database warm-up failed (will retry on first request):', err.message)
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
