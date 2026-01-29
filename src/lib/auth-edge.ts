import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

interface JWTPayload {
    userId: string
    email: string
    role: string
    [key: string]: any
}

/**
 * Verify JWT access token (Edge compatible)
 * Uses 'jose' library which is compatible with Edge Runtime
 */
export async function verifyAccessTokenEdge(token: string): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        return payload as unknown as JWTPayload
    } catch (error) {
        return null
    }
}
