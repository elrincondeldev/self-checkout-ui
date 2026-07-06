/** Product as returned by the API (WS `scan` events and GET /products). */
export interface Product {
  id: number
  nfc_tag_id: string
  name: string
  description: string | null
  /** Decimal string, e.g. "1.75" — never a float. */
  price: string
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Message pushed over the WebSocket on every successful scan. */
export interface ScanEvent {
  event: 'scan'
  product: Product
}

export interface CheckoutItemRequest {
  product_id: number
  quantity: number
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[]
}

export interface TransactionItem {
  product_id: number
  quantity: number
  /** Decimal string, e.g. "1.75". */
  unit_price: string
  /** Decimal string, e.g. "3.50". */
  subtotal: string
}

/** Response of POST /checkout (201). */
export interface Transaction {
  id: number
  /** Decimal string, e.g. "5.75". */
  total: string
  status: string
  created_at: string
  items: TransactionItem[]
}
