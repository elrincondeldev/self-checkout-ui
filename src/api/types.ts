/** Product as returned by the API (WS `scan` events and GET /products). */
export interface Product {
  id: number
  name: string
  description: string | null
  category: string | null
  size: string | null
  color: string | null
  /** Decimal string, e.g. "12.99" — never a float. */
  price: string
  stock: number
  is_active: boolean
  /** All physical stickers registered to this product (one per garment). */
  nfc_tag_ids: string[]
  created_at: string
  updated_at: string
}

/** Response of POST /scan (dev simulation). */
export interface ScanResult {
  /** UID of the physical sticker that was scanned — identifies ONE garment. */
  tag_id: string
  product: Product
}

/** Message pushed over the WebSocket on every successful scan. */
export interface ScanEvent extends ScanResult {
  event: 'scan'
}

/** Pushed when a sticker with no registered product is scanned. */
export interface UnknownTagEvent {
  event: 'unknown_tag'
  tag_id: string
}

export type SocketEvent = ScanEvent | UnknownTagEvent

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
  /** Decimal string, e.g. "12.99". */
  unit_price: string
  /** Decimal string, e.g. "25.98". */
  subtotal: string
}

/** Response of POST /checkout (201). */
export interface Transaction {
  id: number
  /** Decimal string, e.g. "55.97". */
  total: string
  status: string
  created_at: string
  items: TransactionItem[]
}
