import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'

export interface JWTPayload {
    userId: string
    email: string
    role: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

/**
 * Generate JWT access token (15 minutes)
 */
export function generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

/**
 * Generate JWT refresh token (7 days)
 */
export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch {
        return null
    }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
    } catch {
        return null
    }
}

/**
 * Get user from JWT token
 */
export async function getUserFromToken(token: string) {
    const payload = verifyAccessToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    })

    return user
}
