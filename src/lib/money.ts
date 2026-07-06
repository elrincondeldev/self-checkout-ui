/**
 * Money utilities. Prices arrive from the API as decimal strings
 * ("1.75") and all arithmetic happens in integer cents — floating
 * point never touches a price.
 */

/** "1.75" -> 175. Throws on anything that isn't a plain decimal. */
export function parseCents(price: string): number {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(price.trim())
  if (!match) throw new Error(`Invalid price string: "${price}"`)
  const whole = Number(match[1])
  const fraction = Number((match[2] ?? '').padEnd(2, '0') || '0')
  return whole * 100 + fraction
}

const formatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

/** 175 -> "1,75 €" (locale-formatted). */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? -1 : 1
  const abs = Math.abs(cents)
  // Build an exact decimal from integers so no float math touches money.
  return formatter.format(
    Number(`${sign * Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, '0')}`),
  )
}

/** Convenience for API decimal strings: "1.75" -> "1,75 €". */
export function formatPrice(price: string): string {
  return formatCents(parseCents(price))
}
