import type { SocketStatus } from '../api/useScanSocket'

export function ConnectionBanner({ status }: { status: SocketStatus }) {
  if (status === 'open') return null

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-3 bg-amber-500 px-6 py-4 text-xl font-semibold text-amber-950"
    >
      <span className="inline-block size-3 animate-pulse rounded-full bg-amber-950" />
      {status === 'connecting'
        ? 'Connecting to the scanner…'
        : 'Scanner connection lost — reconnecting…'}
    </div>
  )
}
