'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface CartItem {
    productId: string
    variantId: string
    name: string
    price: number
    compareAtPrice?: number | null
    image: string
    size: string
    color: string
    quantity: number
    stock: number
    slug: string
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (variantId: string) => void
    updateQuantity: (variantId: string, quantity: number) => void
    clearCart: () => void
    itemCount: number
    subtotal: number
    isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'luxebags_cart'

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart:', e)
            }
        }
        setIsLoading(false)
    }, [])

    // Save cart to localStorage when items change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        }
    }, [items, isLoading])

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.variantId === item.variantId)

            if (existingIndex > -1) {
                // Update quantity if item exists
                const updated = [...prev]
                const newQuantity = Math.min(updated[existingIndex].quantity + 1, item.stock)
                updated[existingIndex] = { ...updated[existingIndex], quantity: newQuantity }
                return updated
            }

            // Add new item
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (variantId: string) => {
        setItems((prev) => prev.filter((i) => i.variantId !== variantId))
    }

    const updateQuantity = (variantId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(variantId)
            return
        }

        setItems((prev) =>
            prev.map((item) =>
                item.variantId === variantId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
