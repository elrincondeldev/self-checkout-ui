import { useCallback, useEffect, useRef, useState } from 'react'
import type { Product, Transaction } from './api/types'
import { ApiError, checkout } from './api/client'
import { useScanSocket } from './api/useScanSocket'
import { useCartStore } from './store/cart'
import { IdleView } from './views/IdleView'
import { CartView } from './views/CartView'
import { ReceiptView } from './views/ReceiptView'
import { ConnectionBanner } from './components/ConnectionBanner'
import { ErrorToast } from './components/ErrorToast'
import { SimulateScanButton } from './components/SimulateScanButton'

type View = 'idle' | 'cart' | 'receipt'

interface Receipt {
  transaction: Transaction
  productNames: Record<number, string>
}

function App() {
  const [view, setView] = useState<View>('idle')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addScan = useCartStore((s) => s.addScan)
  const clearCart = useCartStore((s) => s.clear)

  // Refs so the stable scan callback always sees current view/state.
  const viewRef = useRef(view)
  viewRef.current = view

  const handleScan = useCallback(
    (tagId: string, product: Product) => {
      // Each sticker is one physical garment: scanning the same one
      // twice means the customer re-scanned an item already in the cart.
      if (addScan(tagId, product) === 'duplicate') {
        setError(`${product.name} is already in your cart.`)
        return
      }
      // A scan always lands in the cart view: it starts a new cart from
      // idle and cuts a lingering receipt short for the next customer.
      if (viewRef.current !== 'cart') setView('cart')
    },
    [addScan],
  )

  const socketStatus = useScanSocket(handleScan)

  // If the customer removes every line, drop back to the idle screen.
  const cartEmpty = useCartStore((s) => s.lines.length === 0)
  useEffect(() => {
    if (view === 'cart' && cartEmpty) setView('idle')
  }, [view, cartEmpty])

  const handleFinish = useCallback(async () => {
    const lines = useCartStore.getState().lines
    if (lines.length === 0 || checkingOut) return

    setCheckingOut(true)
    setError(null)
    try {
      const transaction = await checkout({
        items: lines.map((l) => ({
          product_id: l.product.id,
          quantity: l.tagIds.length,
        })),
      })
      const productNames = Object.fromEntries(
        lines.map((l) => [l.product.id, l.product.name]),
      )
      setReceipt({ transaction, productNames })
      clearCart()
      setView('receipt')
    } catch (e) {
      // Any failure (409 stock conflict, network, …) keeps the cart intact.
      setError(
        e instanceof ApiError
          ? e.detail
          : 'Could not complete the purchase. Please try again.',
      )
    } finally {
      setCheckingOut(false)
    }
  }, [checkingOut, clearCart])

  const handleReceiptDone = useCallback(() => {
    setReceipt(null)
    setView('idle')
  }, [])

  return (
    <div className="h-full">
      <ConnectionBanner status={socketStatus} />

      {view === 'idle' && <IdleView />}
      {view === 'cart' && (
        <CartView onFinish={handleFinish} checkingOut={checkingOut} />
      )}
      {view === 'receipt' && receipt && (
        <ReceiptView
          transaction={receipt.transaction}
          productNames={receipt.productNames}
          onDone={handleReceiptDone}
        />
      )}

      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
      <SimulateScanButton />
    </div>
  )
}

export default App
