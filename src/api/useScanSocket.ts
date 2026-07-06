import { useEffect, useRef, useState } from 'react'
import type { Product, SocketEvent } from './types'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8123/ws'

export type SocketStatus = 'connecting' | 'open' | 'reconnecting'

const BASE_DELAY_MS = 500
const MAX_DELAY_MS = 5000

/**
 * Keeps a WebSocket to the scan feed open for the lifetime of the
 * component, reconnecting with exponential backoff (capped at ~5s).
 * Calls `onScan` for every `{event: "scan"}` message with the scanned
 * sticker UID (one physical garment) and its product.
 */
export function useScanSocket(
  onScan: (tagId: string, product: Product) => void,
  onUnknownTag?: (tagId: string) => void,
): SocketStatus {
  const [status, setStatus] = useState<SocketStatus>('connecting')

  // Keep the latest callbacks without retriggering the effect.
  const onScanRef = useRef(onScan)
  onScanRef.current = onScan
  const onUnknownTagRef = useRef(onUnknownTag)
  onUnknownTagRef.current = onUnknownTag

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimer: number | undefined
    let attempt = 0
    let disposed = false

    const connect = () => {
      ws = new WebSocket(WS_URL)

      ws.onopen = () => {
        attempt = 0
        setStatus('open')
      }

      ws.onmessage = (event: MessageEvent<string>) => {
        try {
          const message = JSON.parse(event.data) as SocketEvent
          if (message.event === 'scan' && message.tag_id && message.product) {
            onScanRef.current(message.tag_id, message.product)
          } else if (message.event === 'unknown_tag' && message.tag_id) {
            onUnknownTagRef.current?.(message.tag_id)
          }
        } catch {
          // ignore malformed frames
        }
      }

      ws.onclose = () => {
        if (disposed) return
        setStatus('reconnecting')
        const delay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt)
        attempt += 1
        reconnectTimer = window.setTimeout(connect, delay)
      }

      ws.onerror = () => {
        // onclose fires after onerror and owns the retry logic
        ws?.close()
      }
    }

    connect()

    return () => {
      disposed = true
      window.clearTimeout(reconnectTimer)
      if (ws) {
        // silence handlers so cleanup doesn't trigger a reconnect
        ws.onclose = null
        ws.onerror = null
        ws.close()
      }
    }
  }, [])

  return status
}
