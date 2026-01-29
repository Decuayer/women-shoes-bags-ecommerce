'use client'

import { useState } from 'react'
import { MapPin, Plus, Check } from 'lucide-react'
import AddressForm from '@/components/account/AddressForm'

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

interface AddressSelectorProps {
    addresses: Address[]
    selectedAddressId: string | null
    onSelect: (address: Address) => void
    onManualEntry: () => void
    locale: string
}

export default function AddressSelector({
    addresses,
    selectedAddressId,
    onSelect,
    onManualEntry,
    locale
}: AddressSelectorProps) {
    const isTr = locale === 'tr'
    const [isAddingNew, setIsAddingNew] = useState(false)

    // Callback used when a new address is successfully added
    const handleAddressAdded = () => {
        // Ideally we should refresh the address list here. 
        // Since we are in a client component, we might rely on router.refresh() in the parent or
        // we can just close the modal and let the user reload or optimistically update if we had the state.
        // For now, triggering a page refresh via window or router is simplest to sync state, 
        // but let's just close modal. The parent (server component wrapper) needs to re-fetch.
        // We'll rely on router.refresh() being called inside the form/parent or manual refresh.
        // Actually, AddressForm calls addToast and effectively likely calls router.refresh() inside the action or we should do it here.
        window.location.reload() // Simple way to fetch new list for now
    }

    return (
        <div className="space-y-4 mb-6">
            <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        onClick={() => onSelect(addr)}
                        className={`relative cursor-pointer rounded-xl border p-4 transition-all ${selectedAddressId === addr.id
                            ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                            : 'border-border hover:border-secondary/50'
                            }`}
                    >
                        {selectedAddressId === addr.id && (
                            <div className="absolute top-3 right-3 text-secondary">
                                <Check size={18} />
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <MapPin size={20} className={selectedAddressId === addr.id ? 'text-secondary' : 'text-text-muted'} />
                            <div>
                                <h3 className="font-semibold text-sm">{addr.title}</h3>
                                <div className="text-sm text-text-muted mt-1 leading-relaxed">
                                    <p>{addr.fullName}</p>
                                    <p>{addr.addressLine1}</p>
                                    <p>{addr.city} / {addr.state}</p>
                                    <p className="mt-1">{addr.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <button
                    type="button"
                    onClick={() => setIsAddingNew(true)}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-text-muted hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition-all min-h-[140px]"
                >
                    <Plus size={24} />
                    <span className="font-medium">
                        {isTr ? 'Yeni Adres Ekle' : 'Add New Address'}
                    </span>
                </button>
            </div>

            {/* Link to manual entry if desired (usually implies not using a saved ID) */}
            <button
                type="button"
                onClick={onManualEntry}
                className="text-sm text-secondary hover:underline flex items-center gap-1 font-medium mt-2"
            >
                {isTr ? '+ Farklı bir teslimat adresi gir' : '+ Enter a different shipping address'}
            </button>

            {isAddingNew && (
                <AddressForm
                    locale={locale}
                    onClose={() => setIsAddingNew(false)}
                    onSuccess={handleAddressAdded}
                />
            )}
        </div>
    )
}
