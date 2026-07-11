// Provisions a CommonEra admin account (out-of-band; admins never self-register).
// Usage: node scripts/create-admin.mjs <email> <password> "<display name>"
// Or:    pnpm admin:create <email> <password> "<display name>"
// Idempotent: if the email already exists, the account is promoted to admin.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = Object.fromEntries(
  readFileSync(join(root, '.env'), 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ]
    }),
)

const [email, password, displayName] = process.argv.slice(2)
if (!email || !password || !displayName) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password> "<display name>"')
  process.exit(1)
}

const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

let userId
const created = await admin.auth.admin.createUser({ email, password, email_confirm: true })
if (created.error) {
  if (created.error.code !== 'email_exists') {
    console.error('createUser failed:', created.error.message)
    process.exit(1)
  }
  // Already exists: find the user and reset the password.
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const existing = list.users.find((u) => u.email === email)
  if (!existing) {
    console.error('user reported as existing but not found')
    process.exit(1)
  }
  userId = existing.id
  await admin.auth.admin.updateUserById(userId, { password })
} else {
  userId = created.data.user.id
}

const { error: profileError } = await admin
  .from('profiles')
  .upsert({ id: userId, role: 'admin', display_name: displayName }, { onConflict: 'id' })
if (profileError) {
  console.error('profile upsert failed:', profileError.message)
  process.exit(1)
}

console.log(`admin ready: ${email} (${userId})`)
