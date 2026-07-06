import { useState } from 'react'
import { simulateScan } from '../api/client'

/**
 * Dev-only helper: fires POST /scan with a seed tag so the full
 * scan → WS → cart flow is testable without the ESP32 hardware.
 * Rendered only when `import.meta.env.DEV` is true.
 */
const SEED_TAGS = [
  { tag: 'A0:D6:8E:39', label: 'T-Shirt (M, black)' },
  { tag: '9C:4C:52:07', label: 'Hoodie (L, grey)' },
] as const

export function SimulateScanButton() {
  const [error, setError] = useState<string | null>(null)

  if (!import.meta.env.DEV) return null

  const scan = async (tag: string) => {
    setError(null)
    try {
      await simulateScan(tag)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    }
  }

  return (
    <div className="fixed left-4 top-4 z-40 flex flex-col gap-2 opacity-70">
      <p className="text-xs font-mono text-slate-500">DEV · simulate scan</p>
      {SEED_TAGS.map(({ tag, label }) => (
        <button
          key={tag}
          type="button"
          onClick={() => scan(tag)}
          className="rounded-lg border border-dashed border-slate-400 bg-white px-4 py-2 font-mono text-sm text-slate-700 active:bg-slate-200"
        >
          scan {label}
        </button>
      ))}
      {error && <p className="max-w-52 text-xs text-red-600">{error}</p>}
    </div>
  )
}
