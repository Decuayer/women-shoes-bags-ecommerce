import { prisma } from '@/lib/prisma'
import UserForm from '@/components/admin/users/UserForm'
import { notFound } from 'next/navigation'

interface EditUserPageProps {
    params: Promise<{ locale: string; id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
    const { locale, id } = await params

    const user = await prisma.user.findUnique({
        where: { id }
    })

    if (!user) {
        notFound()
    }

    return (
        <UserForm
            initialData={user}
            locale={locale}
        />
    )
}
