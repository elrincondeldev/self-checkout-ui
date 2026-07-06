import type { CartLine } from '../store/cart'
import { lineCents, lineQuantity } from '../store/cart'
import { formatCents, formatPrice } from '../lib/money'
import { useCartStore } from '../store/cart'

/**
 * One line = N identical garments, each backed by a scanned sticker.
 * There is no "+" button: adding a garment requires scanning it —
 * every physical item carries its own tag.
 */
export function CartLineRow({ line }: { line: CartLine }) {
  const removeOne = useCartStore((s) => s.removeOne)
  const removeLine = useCartStore((s) => s.removeLine)

  const quantity = lineQuantity(line)
  const attributes = [line.product.size, line.product.color]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-semibold text-slate-900">
          {line.product.name}
        </p>
        <p className="text-lg text-slate-500">
          {attributes && (
            <span className="mr-3 rounded-md bg-slate-100 px-2 py-0.5 text-base font-medium uppercase tracking-wide text-slate-600">
              {attributes}
            </span>
          )}
          {formatPrice(line.product.price)} each
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => removeOne(line.product.id)}
          aria-label={`Remove one ${line.product.name}`}
          className="flex size-14 items-center justify-center rounded-full text-3xl font-bold text-slate-700 active:bg-slate-300"
        >
          −
        </button>
        <span className="w-12 text-center text-2xl font-bold text-slate-900">
          {quantity}
        </span>
      </div>

      <p className="w-32 text-right text-2xl font-bold text-slate-900">
        {formatCents(lineCents(line))}
      </p>

      <button
        type="button"
        onClick={() => removeLine(line.product.id)}
        aria-label={`Remove ${line.product.name} from cart`}
        className="flex size-14 items-center justify-center rounded-full text-2xl text-slate-400 active:bg-red-100 active:text-red-600"
      >
        ✕
      </button>
    </li>
  )
}
