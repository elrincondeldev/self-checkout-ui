import { create } from 'zustand'
import type { Product } from '../api/types'
import { parseCents } from '../lib/money'

export interface CartLine {
  product: Product
  quantity: number
}

interface CartState {
  lines: CartLine[]
  /** Add one unit; if the product is already in the cart, bump its quantity. */
  addProduct: (product: Product) => void
  increment: (productId: number) => void
  /** Decrement quantity; removes the line when it reaches zero. */
  decrement: (productId: number) => void
  removeLine: (productId: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],

  addProduct: (product) =>
    set((state) => {
      const existing = state.lines.find((l) => l.product.id === product.id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === product.id
              ? { product, quantity: l.quantity + 1 }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, { product, quantity: 1 }] }
    }),

  increment: (productId) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.product.id === productId ? { ...l, quantity: l.quantity + 1 } : l,
      ),
    })),

  decrement: (productId) =>
    set((state) => ({
      lines: state.lines
        .map((l) =>
          l.product.id === productId ? { ...l, quantity: l.quantity - 1 } : l,
        )
        .filter((l) => l.quantity > 0),
    })),

  removeLine: (productId) =>
    set((state) => ({
      lines: state.lines.filter((l) => l.product.id !== productId),
    })),

  clear: () => set({ lines: [] }),
}))

/** Line subtotal in integer cents. */
export function lineCents(line: CartLine): number {
  return parseCents(line.product.price) * line.quantity
}

/** Cart total in integer cents. */
export function totalCents(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineCents(line), 0)
}

/** Total number of units in the cart. */
export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}
