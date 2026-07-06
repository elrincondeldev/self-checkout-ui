import { useCartStore, itemCount, totalCents } from '../store/cart'
import { formatCents } from '../lib/money'
import { CartLineRow } from '../components/CartLineRow'

interface CartViewProps {
  onFinish: () => void
  checkingOut: boolean
}

export function CartView({ onFinish, checkingOut }: CartViewProps) {
  const lines = useCartStore((s) => s.lines)
  const count = itemCount(lines)
  const total = totalCents(lines)

  return (
    <main className="flex h-full flex-col bg-slate-100">
      <header className="flex items-baseline justify-between px-8 pb-4 pt-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Your cart</h1>
        <p className="text-2xl text-slate-500">
          {count} {count === 1 ? 'item' : 'items'}
        </p>
      </header>

      <ul className="flex-1 space-y-4 overflow-y-auto px-8 pb-4">
        {lines.map((line) => (
          <CartLineRow key={line.product.id} line={line} />
        ))}
      </ul>

      <footer className="border-t border-slate-200 bg-white px-8 py-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="text-3xl font-semibold text-slate-600">Total</span>
          <span className="text-5xl font-extrabold text-slate-900">
            {formatCents(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={onFinish}
          disabled={checkingOut || lines.length === 0}
          className="w-full rounded-2xl bg-emerald-600 py-6 text-3xl font-bold text-white shadow-lg transition active:bg-emerald-700 disabled:opacity-50"
        >
          {checkingOut ? 'Processing…' : 'Finish purchase'}
        </button>
      </footer>
    </main>
  )
}
