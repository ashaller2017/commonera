import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/form'
import { FieldGroup } from '@/components/ui/field'
import { Wordmark } from '@/components/wordmark'
import { homePathForRole } from '@/lib/auth/home-path'
import { requestPasswordResetFn } from '@/utils/auth.functions'

export const Route = createFileRoute('/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: homePathForRole(context.user.role) })
  },
  component: ForgotPasswordPage,
})

const schema = z.object({ email: z.email('Enter a valid email.') })

function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: { email: '' },
    validators: {
      onSubmit: schema,
      // Always resolve without error so this form cannot be used to probe which emails exist.
      onSubmitAsync: async ({ value }) => {
        try {
          await requestPasswordResetFn({ data: value })
        } catch {
          // swallow: the outcome the user sees must not depend on whether the email is registered
        }
        return null
      },
    },
    onSubmit: ({ value }) => {
      setSentTo(value.email)
    },
  })

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Wordmark className="text-2xl" />
        <h1 className="font-display text-3xl font-semibold">Reset your password</h1>
      </div>

      {sentTo ? (
        <div className="flex flex-col gap-4 rounded-2xl border bg-secondary/40 p-6 text-center">
          <p className="font-bold">Check your inbox</p>
          <p className="text-sm text-muted-foreground">
            If an account exists for {sentTo}, we've sent a link to reset your password. It expires
            in an hour.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Enter your email and we'll send you a link to choose a new password.
            </p>
            <form.AppField name="email">
              {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
            </form.AppField>
            <form.AppForm>
              <form.SubmitButton size="lg" submittingLabel="Sending...">
                Send reset link
              </form.SubmitButton>
            </form.AppForm>
          </FieldGroup>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </p>
    </main>
  )
}
