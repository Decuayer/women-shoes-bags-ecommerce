'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ParentCategory {
    id: string
    name_tr: string
    name_en: string
}

interface CategoryFormProps {
    initialData?: {
        id: string
        name_tr: string
        name_en: string
        parentId?: string | null
    }
    parentCategories: ParentCategory[] // list of available top-level categories for parent selection
    locale: string
}

export default function CategoryForm({ initialData, parentCategories, locale }: CategoryFormProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name_tr: initialData?.name_tr || '',
        name_en: initialData?.name_en || '',
        parentId: initialData?.parentId || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = initialData
                ? `/api/admin/categories/${initialData.id}`
                : '/api/admin/categories'

            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name_en: formData.name_en,
                    name_tr: formData.name_tr,
                    parentId: formData.parentId || null,
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to save category')
            }

            router.push(`/${locale}/admin/categories`)
            router.refresh()
        } catch (error) {
            console.error('Save error:', error)
            alert(error instanceof Error ? error.message : 'Failed to save category')
        } finally {
            setIsLoading(false)
        }
    }

    // Filter out self from parent options when editing
    const parentOptions = parentCategories.filter(c => c.id !== initialData?.id)

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-4 mb-6">
                <Link href={`/${locale}/admin/categories`} className="btn btn-ghost rounded-full p-2">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold">
                    {initialData ? (isTr ? 'Kategoriyi Düzenle' : 'Edit Category') : (isTr ? 'Yeni Kategori' : 'New Category')}
                </h1>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                {/* Parent Category */}
                <div>
                    <label className="label">{isTr ? 'Üst Kategori (Opsiyonel)' : 'Parent Category (Optional)'}</label>
                    <select
                        className="input w-full"
                        value={formData.parentId}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    >
                        <option value="">{isTr ? '— Ana Kategori (Üst Yok) —' : '— Main Category (No Parent) —'}</option>
                        {parentOptions.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {isTr ? cat.name_tr : cat.name_en}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-text-muted mt-1">
                        {isTr
                            ? 'Boş bırakırsanız bu ana kategori olur. Seçerseniz alt kategori olur.'
                            : 'Leave empty to create a main category. Select one to make it a subcategory.'}
                    </p>
                </div>

                <div>
                    <label className="label">Category Name (EN)</label>
                    <input
                        required
                        className="input w-full"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Shoes"
                    />
                </div>
                <div>
                    <label className="label">Kategori Adı (TR)</label>
                    <input
                        required
                        className="input w-full"
                        value={formData.name_tr}
                        onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                        placeholder="Ayakkabılar"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 mt-6"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isTr ? 'Kaydet' : 'Save'}
                </button>
            </div>
        </form>
    )
}
