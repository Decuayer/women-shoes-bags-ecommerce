import { prisma } from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'
import { notFound } from 'next/navigation'

interface EditCategoryPageProps {
    params: Promise<{ locale: string; id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { locale, id } = await params

    const category = await prisma.category.findUnique({
        where: { id }
    })

    if (!category) notFound()

    return <CategoryForm initialData={category} locale={locale} />
}
