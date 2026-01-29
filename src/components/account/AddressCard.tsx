'use client'

import { useState } from 'react'
import { MapPin, Edit2, Trash2, Check } from 'lucide-react'
import { deleteAddress } from '@/actions/addressActions'
import { useToast } from '@/context/ToastContext'
import AddressForm from './AddressForm'

interface Address {
    id: string
    title: string
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
}

interface AddressCardProps {
    address: Address
    locale: string
}

export default function AddressCard({ address, locale }: AddressCardProps) {
    const isTr = locale === 'tr'
    const { addToast } = useToast()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const handleDelete = async () => {
        if (!confirm(isTr ? 'Bu adresi silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this address?')) {
            return
        }

        setIsDeleting(true)
        try {
            const result = await deleteAddress(address.id)
            if (result.success) {
                addToast(
                    isTr ? 'Adres silindi' : 'Address deleted',
                    'success'
                )
            } else {
                addToast(
                    isTr ? 'Bir hata oluştu' : 'An error occurred',
                    'error'
                )
            }
        } catch {
            addToast(
                isTr ? 'Bir hata oluştu' : 'An error occurred',
                'error'
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="card p-6 relative group">
                {address.isDefault && (
                    <div className="absolute top-4 right-4 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded flex items-center gap-1">
                        <Check size={12} />
                        {isTr ? 'Varsayılan' : 'Default'}
                    </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${address.isDefault ? 'bg-secondary text-primary' : 'bg-surface text-text-muted'}`}>
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">{address.title}</h3>
                        <p className="text-sm text-text-muted">{address.fullName}</p>
                    </div>
                </div>

                <div className="space-y-1 text-sm text-text-dark mb-6">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.state}, {address.city} {address.postalCode}</p>
                    <p className="mt-2 text-text-muted">{address.phone}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-ghost btn-sm flex-1 gap-2"
                        disabled={isDeleting}
                    >
                        <Edit2 size={16} />
                        {isTr ? 'Düzenle' : 'Edit'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-ghost btn-sm flex-1 gap-2 text-error hover:bg-error/10 hover:text-error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="loading loading-spinner loading-xs" />
                        ) : (
                            <>
                                <Trash2 size={16} />
                                {isTr ? 'Sil' : 'Delete'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {isEditing && (
                <AddressForm
                    address={address}
                    locale={locale}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    )
}
