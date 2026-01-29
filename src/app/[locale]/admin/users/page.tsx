import { prisma } from '@/lib/prisma'
import UserListClient from '@/components/admin/users/UserListClient'

interface UsersPageProps {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ page?: string; q?: string }>
}

export default async function UsersPage({ params, searchParams }: UsersPageProps) {
    const { locale } = await params
    const resolvedSearchParams = await searchParams
    const search = resolvedSearchParams.q || ''
    const page = Number(resolvedSearchParams.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const where = search ? {
        OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
        ]
    } : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            include: {
                _count: {
                    select: { orders: true }
                }
            },
            take: limit,
            skip,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {locale === 'tr' ? 'Kullanıcılar' : 'Users'}
                </h1>
            </div>

            <UserListClient
                users={users}
                fullPagination={{
                    currentPage: page,
                    totalPages,
                    totalItems: total
                }}
                searchParams={resolvedSearchParams}
                locale={locale}
            />
        </div>
    )
}
