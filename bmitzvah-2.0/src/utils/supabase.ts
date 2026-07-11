import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { getRequestHeader, setCookie } from '@tanstack/react-start/server'
import type { Database } from '@/types/database'

function parseRequestCookies(): { name: string; value: string }[] {
  const header = getRequestHeader('cookie') ?? ''
  const cookies: { name: string; value: string }[] = []
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf('=')
    if (eq <= 0) continue
    cookies.push({ name: part.slice(0, eq), value: decodeURIComponent(part.slice(eq + 1)) })
  }
  return cookies
}

// Server: cookie-bound, RLS-scoped to the signed-in user.
export function getSupabaseServerClient() {
  // process.env is read inline rather than via env.server.ts because this
  // module is also imported client-side for the browser client.
  return createServerClient<Database>(
    process.env.SUPABASE_URL ?? '',
    process.env.SUPABASE_PUBLISHABLE_KEY ?? '',
    {
      cookies: {
        getAll: parseRequestCookies,
        setAll: (cookies) => {
          for (const { name, value, options } of cookies) {
            setCookie(name, value, options)
          }
        },
      },
    },
  )
}

// Browser: anon key only, RLS still applies.
export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}
