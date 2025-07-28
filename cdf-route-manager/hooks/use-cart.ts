"use client"

import { useState, useCallback, useEffect } from "react"

export interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  stock: number
  sku: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 })

  // Calcular total cuando cambien los items
  useEffect(() => {
    const total = cart.items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    setCart((prev) => ({ ...prev, total }))
  }, [cart.items])

  const addItem = useCallback((product: Omit<CartItem, "cantidad">) => {
    setCart((prev) => {
      const existingItem = prev.items.find((item) => item.id === product.id)

      if (existingItem) {
        // Si ya existe, incrementar cantidad (respetando stock)
        const newQuantity = Math.min(existingItem.cantidad + 1, product.stock)
        return {
          ...prev,
          items: prev.items.map((item) => (item.id === product.id ? { ...item, cantidad: newQuantity } : item)),
        }
      } else {
        // Si no existe, agregar nuevo item
        return {
          ...prev,
          items: [...prev.items, { ...product, cantidad: 1 }],
        }
      }
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== productId),
    }))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId)
        return
      }

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === productId ? { ...item, cantidad: Math.min(quantity, item.stock) } : item,
        ),
      }))
    },
    [removeItem],
  )

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = cart.items.find((item) => item.id === productId)
      return item?.cantidad || 0
    },
    [cart.items],
  )

  const isInCart = useCallback(
    (productId: string): boolean => {
      return cart.items.some((item) => item.id === productId)
    },
    [cart.items],
  )

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 })
  }, [])

  const getItemCount = useCallback((): number => {
    return cart.items.reduce((sum, item) => sum + item.cantidad, 0)
  }, [cart.items])

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    getItemQuantity,
    isInCart,
    clearCart,
    getItemCount,
  }
}
