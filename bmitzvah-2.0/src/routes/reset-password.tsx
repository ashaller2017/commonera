import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '@/components/form'
import { FieldGroup } from '@/components/ui/field'
import { Wordmark } from '@/components/wordmark'
import { resetPasswordFn } from '@/utils/auth.functions'
import type { ResetPasswordError } from '@/utils/auth.server'

const SearchSchema = z.object({
  token_hash: z.string().optional(),
  type: z.string().optional(),
})

export const Route = createFileRoute('/reset-password')({
  validateSearch: SearchSchema,
  component: ResetPasswordPage,
})

const RESET_ERROR_COPY: Record<ResetPasswordError, string> = {
  'invalid-or-expired': 'This reset link is invalid or has expired. Request a new one.',
  'update-failed': 'Something went wrong saving your new password. Try again.',
}

const schema = z.object({ password: z.string().min(8, 'At least 8 characters.') })

function ResetPasswordPage() {
  const { token_hash: tokenHash } = Route.useSearch()
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Wordmark className="text-2xl" />
        <h1 className="font-display text-3xl font-semibold">Choose a new password</h1>
      </div>
      {tokenHash ? <ResetForm tokenHash={tokenHash} /> : <InvalidLink />}
    </main>
  )
}

function ResetForm({ tokenHash }: { tokenHash: string }) {
  const router = useRouter()
  const form = useAppForm({
    defaultValues: { password: '' },
    validators: {
      onSubmit: schema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await resetPasswordFn({ data: { tokenHash, password: value.password } })
          return result.ok ? null : { form: RESET_ERROR_COPY[result.error] }
        } catch {
          return { form: RESET_ERROR_COPY['update-failed'] }
        }
      },
    },
    onSubmit: async () => {
      await router.invalidate()
      await router.navigate({ to: '/parent' })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup className="gap-4">
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              description="At least 8 characters."
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError />
          <form.SubmitButton size="lg" submittingLabel="Saving...">
            Save new password
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  )
}

function InvalidLink() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-secondary/40 p-6 text-center">
      <p className="font-bold">This link won't work</p>
      <p className="text-sm text-muted-foreground">
        It looks like the reset link is incomplete or has already been used.
      </p>
      <Link
        to="/forgot-password"
        className="font-bold text-primary underline-offset-4 hover:underline"
      >
        Request a new link
      </Link>
    </div>
  )
}
