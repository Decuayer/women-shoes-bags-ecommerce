'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddressForm from '@/components/account/AddressForm' // Updated path

interface AddAddressButtonProps {
    locale: string
    variant?: 'default' | 'primary'
}

export default function AddAddressButton({ locale, variant = 'default' }: AddAddressButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const isTr = locale === 'tr'

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`btn gap-2 ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
            >
                <Plus size={18} />
                {isTr ? 'Yeni Adres Ekle' : 'Add New Address'}
            </button>

            {isOpen && (
                <AddressForm
                    locale={locale}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
