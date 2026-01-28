import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                phone: validatedData.phone,
                role: 'USER',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        })

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Set cookies
        const response = NextResponse.json(
            {
                user,
                message: 'Registration successful',
            },
            { status: 201 }
        )

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15, // 15 minutes
        })

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            )
        }

        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
