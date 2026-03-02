'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronDown, ChevronRight, FolderOpen, Folder } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/context/ToastContext'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface CategoryListClientProps {
    data: any[]
    locale: string
}

export default function CategoryListClient({ data, locale }: CategoryListClientProps) {
    const router = useRouter()
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }

    const handleDelete = async (category: any) => {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!categoryToDelete) return

        setDeleteLoading(true)

        try {
            const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
                method: 'DELETE'
            })

            const resData = await res.json()

            if (res.ok) {
                addToast(
                    isTr
                        ? `"${categoryToDelete.name_tr}" kategorisi başarıyla silindi!`
                        : `Category "${categoryToDelete.name_tr}" deleted successfully!`,
                    'success',
                    { title: isTr ? 'Başarılı' : 'Success' }
                )
                setDeleteDialogOpen(false)
                router.refresh()
            } else {
                addToast(
                    resData.error || resData.message || (isTr ? 'Kategori silinemedi' : 'Failed to delete category'),
                    'error',
                    { title: isTr ? 'Hata' : 'Error', duration: 7000 }
                )
            }
        } catch (error) {
            console.error('Delete error:', error)
            addToast(
                isTr ? 'Bir hata oluştu' : 'An error occurred',
                'error',
                { title: isTr ? 'Hata' : 'Error' }
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    // Separate parent and child categories
    const parentCategories = data.filter(c => !c.parentId)

    const renderCategory = (cat: any, isChild = false) => {
        const hasChildren = cat.children && cat.children.length > 0
        const isExpanded = expandedIds.has(cat.id)
        const productCount = cat._count?.products || 0

        return (
            <div key={cat.id}>
                <div className={`flex items-center gap-3 p-4 hover:bg-surface-light transition-colors border-b border-border ${isChild ? 'pl-12 bg-surface/40' : ''}`}>
                    {/* Expand toggle or spacer */}
                    <div className="w-6 flex-shrink-0">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(cat.id)}
                                className="text-text-muted hover:text-secondary transition-colors"
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        ) : isChild ? (
                            <span className="w-4 h-px bg-border inline-block ml-1" />
                        ) : null}
                    </div>

                    {/* Icon */}
                    <div className="text-text-muted">
                        {isChild ? <Folder size={16} /> : <FolderOpen size={18} />}
                    </div>

                    {/* Names */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{cat.name_tr}</span>
                            {!isChild && (
                                <span className="text-xs text-text-dark">/ {cat.name_en}</span>
                            )}
                            {isChild && (
                                <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
                                    {isTr ? 'Alt Kategori' : 'Subcategory'}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-text-dark">{cat.slug}</span>
                    </div>

                    {/* Product count */}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${productCount > 0 ? 'bg-success/10 text-success' : 'bg-surface-light text-text-dark'}`}>
                        {productCount} {isTr ? 'ürün' : 'product'}
                        {hasChildren && ` + ${cat.children.length} ${isTr ? 'alt' : 'sub'}`}
                    </span>

                    {/* Status */}
                    <span className={`w-2 h-2 rounded-full ${cat.isActive ? 'bg-success' : 'bg-error'}`} title={cat.isActive ? 'Active' : 'Inactive'} />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${locale}/admin/categories/${cat.id}`}
                            className="text-xs btn btn-ghost px-3 py-1 text-text-muted hover:text-secondary"
                        >
                            {isTr ? 'Düzenle' : 'Edit'}
                        </Link>
                        <button
                            onClick={() => handleDelete(cat)}
                            className="text-xs btn btn-ghost px-3 py-1 text-text-muted hover:text-error"
                        >
                            {isTr ? 'Sil' : 'Delete'}
                        </button>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div>
                        {cat.children.map((child: any) => renderCategory(child, true))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{isTr ? 'Kategoriler' : 'Categories'}</h1>
                    <p className="text-sm text-text-muted mt-1">
                        {parentCategories.length} {isTr ? 'ana kategori' : 'main categories'},&nbsp;
                        {data.filter(c => c.parentId).length} {isTr ? 'alt kategori' : 'subcategories'}
                    </p>
                </div>
                <Link href={`/${locale}/admin/categories/new`} className="btn btn-primary flex items-center gap-2">
                    <Plus size={20} /> {isTr ? 'Kategori Ekle' : 'Add Category'}
                </Link>
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 bg-surface-light border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wide">
                    <div className="w-6" />
                    <div className="w-4" />
                    <div className="flex-1">{isTr ? 'Kategori Adı' : 'Category Name'}</div>
                    <div>{isTr ? 'Ürünler' : 'Products'}</div>
                    <div className="w-4">{isTr ? 'Aktif' : 'Active'}</div>
                    <div className="w-28">{isTr ? 'İşlemler' : 'Actions'}</div>
                </div>

                {parentCategories.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">
                        <FolderOpen size={48} className="mx-auto mb-4 opacity-40" />
                        <p>{isTr ? 'Henüz kategori yok' : 'No categories yet'}</p>
                    </div>
                ) : (
                    parentCategories.map(cat => renderCategory(cat))
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={isTr ? 'Kategoriyi Sil' : 'Delete Category'}
                message={
                    categoryToDelete
                        ? (isTr
                            ? `"${categoryToDelete.name_tr}" kategorisini silmek istediğinizden emin misiniz?${categoryToDelete._count?.products > 0 ? ` Bu kategoriye ait ${categoryToDelete._count.products} ürün var ve silinemez.` : ''}${categoryToDelete.children?.length > 0 ? ` Alt kategorileri var, önce onları silin.` : ''}`
                            : `Are you sure you want to delete "${categoryToDelete.name_tr}"?${categoryToDelete._count?.products > 0 ? ` It has ${categoryToDelete._count.products} products and cannot be deleted.` : ''}${categoryToDelete.children?.length > 0 ? ` It has subcategories, delete them first.` : ''}`)
                        : ''
                }
                confirmText={isTr ? 'Sil' : 'Delete'}
                cancelText={isTr ? 'İptal' : 'Cancel'}
                variant={categoryToDelete?._count?.products > 0 || categoryToDelete?.children?.length > 0 ? 'warning' : 'danger'}
                loading={deleteLoading}
            />
        </div>
    )
}
