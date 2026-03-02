import { prisma } from '@/lib/prisma'
import CategoryForm from '@/components/admin/CategoryForm'
import { notFound } from 'next/navigation'

interface EditCategoryPageProps {
    params: Promise<{ locale: string; id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { locale, id } = await params

    const [category, parentCategories] = await Promise.all([
        prisma.category.findUnique({
            where: { id },
            select: { id: true, name_tr: true, name_en: true, parentId: true }
        }),
        prisma.category.findMany({
            where: { parentId: null, isActive: true },
            select: { id: true, name_tr: true, name_en: true },
            orderBy: { name_en: 'asc' }
        })
    ])

    if (!category) notFound()

    return <CategoryForm initialData={category} parentCategories={parentCategories} locale={locale} />
}
