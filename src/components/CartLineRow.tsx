import type { CartLine } from '../store/cart'
import { lineCents } from '../store/cart'
import { formatCents, formatPrice } from '../lib/money'
import { useCartStore } from '../store/cart'

export function CartLineRow({ line }: { line: CartLine }) {
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const removeLine = useCartStore((s) => s.removeLine)

  return (
    <li className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-semibold text-slate-900">
          {line.product.name}
        </p>
        <p className="text-lg text-slate-500">
          {formatPrice(line.product.price)} each
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => decrement(line.product.id)}
          aria-label={`Remove one ${line.product.name}`}
          className="flex size-14 items-center justify-center rounded-full text-3xl font-bold text-slate-700 active:bg-slate-300"
        >
          −
        </button>
        <span className="w-12 text-center text-2xl font-bold text-slate-900">
          {line.quantity}
        </span>
        <button
          type="button"
          onClick={() => increment(line.product.id)}
          aria-label={`Add one ${line.product.name}`}
          className="flex size-14 items-center justify-center rounded-full text-3xl font-bold text-slate-700 active:bg-slate-300"
        >
          +
        </button>
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
