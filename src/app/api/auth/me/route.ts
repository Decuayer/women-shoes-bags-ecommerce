import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken, getUserFromToken } from '@/lib/auth'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const user = await getUserFromToken(token)

        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Auth verification error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
