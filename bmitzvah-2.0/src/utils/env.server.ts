import { z } from 'zod'

const EnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  // Email (Resend). Optional in local dev: with no key, emails are logged to the server
  // console (including any reset link) instead of being sent, so flows are testable offline.
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default("B'Mitzvah Coach <onboarding@resend.dev>"),
  // Absolute base URL used to build links inside emails (reset password, etc.).
  SITE_URL: z.url().default('http://localhost:3000'),
})

export const env = EnvSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SITE_URL: process.env.SITE_URL,
})
