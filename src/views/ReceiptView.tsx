import { useEffect } from 'react'
import type { Transaction } from '../api/types'
import { formatPrice } from '../lib/money'

const AUTO_RESET_MS = 10_000

interface ReceiptViewProps {
  transaction: Transaction
  /** Map of product_id -> display name, captured from the cart at checkout. */
  productNames: Record<number, string>
  onDone: () => void
}

export function ReceiptView({ transaction, productNames, onDone }: ReceiptViewProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, AUTO_RESET_MS)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <main
      onClick={onDone}
      className="flex h-full cursor-pointer flex-col items-center justify-center gap-8 bg-gradient-to-b from-emerald-600 to-emerald-800 px-8 text-white"
    >
      <div aria-hidden className="text-8xl">✅</div>
      <h1 className="text-5xl font-extrabold">Thank you!</h1>

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
        <p className="mb-6 text-center text-lg text-slate-500">
          Purchase #{transaction.id} ·{' '}
          {new Date(transaction.created_at).toLocaleTimeString()}
        </p>

        <ul className="divide-y divide-slate-200">
          {transaction.items.map((item) => (
            <li
              key={item.product_id}
              className="flex items-baseline justify-between py-3 text-xl"
            >
              <span>
                {item.quantity} ×{' '}
                {productNames[item.product_id] ?? `Product ${item.product_id}`}
                <span className="ml-2 text-base text-slate-500">
                  ({formatPrice(item.unit_price)} each)
                </span>
              </span>
              <span className="font-semibold">{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-baseline justify-between border-t-2 border-slate-900 pt-4">
          <span className="text-2xl font-semibold">Total</span>
          <span className="text-4xl font-extrabold">
            {formatPrice(transaction.total)}
          </span>
        </div>
      </div>

      <p className="text-xl text-emerald-100">
        Tap anywhere to finish — returning to start shortly
      </p>
    </main>
  )
}
