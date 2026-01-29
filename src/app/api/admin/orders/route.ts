import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma, OrderStatus } from '@prisma/client'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        const skip = (page - 1) * limit

        const where: Prisma.OrderWhereInput = {
            ...(status && { status: status as OrderStatus }),
            ...(search && {
                OR: [
                    { orderNumber: { contains: search, mode: 'insensitive' } },
                    {
                        user: {
                            OR: [
                                { firstName: { contains: search, mode: 'insensitive' } },
                                { lastName: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                    }
                ]
            })
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    items: true
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.order.count({ where })
        ])

        return NextResponse.json({
            orders,
            total,
            pages: Math.ceil(total / limit)
        })

    } catch (error) {
        console.error('Get orders error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
