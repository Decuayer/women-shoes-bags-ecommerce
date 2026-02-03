import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return NextResponse.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { id, isRead } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Missing message ID' },
                { status: 400 }
            )
        }

        const updatedMessage = await prisma.contactMessage.update({
            where: { id },
            data: { isRead }
        })

        return NextResponse.json(updatedMessage)
    } catch (error) {
        console.error('Error updating message:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
