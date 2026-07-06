import { create } from 'zustand'
import type { Product } from '../api/types'
import { parseCents } from '../lib/money'

/**
 * One cart line groups identical garments of the same product.
 * Each physical garment is one scanned sticker, so quantity is
 * always `tagIds.length` — there is no manual "+1".
 */
export interface CartLine {
  product: Product
  /** Sticker UIDs scanned into this line, one per physical garment. */
  tagIds: string[]
}

export type AddScanResult = 'added' | 'duplicate'

interface CartState {
  lines: CartLine[]
  /**
   * Add the garment behind a scanned sticker. Returns 'duplicate' (and
   * changes nothing) when that exact sticker is already in the cart —
   * one sticker is one physical item and can't be bought twice.
   */
  addScan: (tagId: string, product: Product) => AddScanResult
  /** Remove one garment (the most recently scanned) from a line. */
  removeOne: (productId: number) => void
  removeLine: (productId: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],

  addScan: (tagId, product) => {
    const alreadyScanned = get().lines.some((l) => l.tagIds.includes(tagId))
    if (alreadyScanned) return 'duplicate'

    set((state) => {
      const existing = state.lines.find((l) => l.product.id === product.id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.product.id === product.id
              ? { product, tagIds: [...l.tagIds, tagId] }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, { product, tagIds: [tagId] }] }
    })
    return 'added'
  },

  removeOne: (productId) =>
    set((state) => ({
      lines: state.lines
        .map((l) =>
          l.product.id === productId
            ? { ...l, tagIds: l.tagIds.slice(0, -1) }
            : l,
        )
        .filter((l) => l.tagIds.length > 0),
    })),

  removeLine: (productId) =>
    set((state) => ({
      lines: state.lines.filter((l) => l.product.id !== productId),
    })),

  clear: () => set({ lines: [] }),
}))

/** Number of garments in a line. */
export function lineQuantity(line: CartLine): number {
  return line.tagIds.length
}

/** Line subtotal in integer cents. */
export function lineCents(line: CartLine): number {
  return parseCents(line.product.price) * line.tagIds.length
}

/** Cart total in integer cents. */
export function totalCents(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineCents(line), 0)
}

/** Total number of garments in the cart. */
export function itemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.tagIds.length, 0)
}
