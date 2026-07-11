import { getRequestHeader } from '@tanstack/react-start/server'

// Absolute origin for share + OG URLs. Prefers a configured SITE_URL (canonical,
// spoof-proof), otherwise derives from the incoming request (proxy-aware).
// Server-only (reads request headers).
export function getSiteUrl(): string {
  const configured = process.env.SITE_URL?.replace(/\/+$/, '')
  if (configured) return configured
  const proto = getRequestHeader('x-forwarded-proto') ?? 'http'
  const host = getRequestHeader('x-forwarded-host') ?? getRequestHeader('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}
