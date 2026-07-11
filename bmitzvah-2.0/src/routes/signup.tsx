import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '@/components/form'
import { FieldGroup } from '@/components/ui/field'
import { Wordmark } from '@/components/wordmark'
import { homePathForRole } from '@/lib/auth/home-path'
import { signupParentFn } from '@/utils/auth.functions'
import type { SignupParentError } from '@/utils/auth.server'

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: homePathForRole(context.user.role) })
    }
  },
  component: SignupPage,
})

const ERROR_COPY: Record<SignupParentError, string> = {
  'email-taken': 'There is already an account with that email. Try logging in instead.',
  'signup-failed': 'Something went wrong on our end. Give it another try.',
}

// Mirrors the server SignupParentSchema so client-valid input always clears the server validator.
const signupSchema = z.object({
  displayName: z.string().trim().min(1, 'Enter your name.').max(60, 'That name is a little long.'),
  email: z.email('Enter a valid email.'),
  password: z.string().min(8, 'At least 8 characters.'),
})

function SignupPage() {
  const router = useRouter()
  const form = useAppForm({
    defaultValues: { displayName: '', email: '', password: '' },
    validators: {
      onSubmit: signupSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await signupParentFn({ data: value })
          return result.ok ? null : { form: ERROR_COPY[result.error] }
        } catch {
          return { form: ERROR_COPY['signup-failed'] }
        }
      },
    },
    onSubmit: async () => {
      await router.invalidate()
      await router.navigate({ to: '/parent' })
    },
  })

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Wordmark className="text-2xl" />
        <h1 className="font-display text-3xl font-semibold">Start your family account</h1>
        <p className="text-muted-foreground">
          Parents set up the account. Your kid designs the journey. You'll add their login in a
          minute.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup className="gap-4">
          <form.AppField name="displayName">
            {(field) => <field.TextField label="Your name" autoComplete="name" />}
          </form.AppField>
          <form.AppField name="email">
            {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.TextField
                label="Password"
                type="password"
                autoComplete="new-password"
                description="At least 8 characters."
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.FormError />
            <form.SubmitButton size="lg" submittingLabel="Setting things up...">
              Create account
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already set up?{' '}
        <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  )
}
