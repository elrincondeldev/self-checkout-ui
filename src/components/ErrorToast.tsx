import { useEffect } from 'react'

interface ErrorToastProps {
  message: string
  onDismiss: () => void
  /** Auto-dismiss delay in ms. */
  duration?: number
}

export function ErrorToast({ message, onDismiss, duration = 6000 }: ErrorToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div className="fixed inset-x-0 bottom-8 z-50 flex justify-center px-6">
      <button
        type="button"
        onClick={onDismiss}
        role="alert"
        className="flex max-w-3xl items-start gap-4 rounded-2xl bg-red-600 px-8 py-6 text-left text-xl font-medium text-white shadow-2xl"
      >
        <span aria-hidden className="text-2xl leading-none">⚠️</span>
        <span>{message}</span>
      </button>
    </div>
  )
}
