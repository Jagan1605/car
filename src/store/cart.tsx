import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Car } from '../lib/supabase'

export interface CartItem {
  car: Car
  colorName: string
  trimName: string
  unitPrice: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  add: (item: CartItem) => void
  remove: (index: number) => void
  updateQty: (index: number, qty: number) => void
  clear: () => void
  open: () => void
  close: () => void
  toggle: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.findIndex(
        (p) => p.car.id === item.car.id && p.colorName === item.colorName && p.trimName === item.trimName,
      )
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = { ...next[existing], quantity: next[existing].quantity + item.quantity }
        return next
      }
      return [...prev, item]
    })
    setIsOpen(true)
  }, [])

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateQty = useCallback((index: number, qty: number) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, quantity: Math.max(1, qty) } : it)))
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  const count = items.reduce((sum, it) => sum + it.quantity, 0)
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, isOpen, add, remove, updateQty, clear, open, close, toggle, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
