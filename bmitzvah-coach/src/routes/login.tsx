import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { useAppForm } from '@/components/form'
import { FieldGroup } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wordmark } from '@/components/wordmark'
import { homePathForRole } from '@/lib/auth/home-path'
import { loginKidFn, loginParentFn } from '@/utils/auth.functions'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: homePathForRole(context.user.role) })
    }
  },
  component: LoginPage,
})

// Login validation stays lenient: any mismatch (bad username shape or wrong password)
// resolves to the same friendly message rather than leaking the credential rules.
const MISMATCH = "That didn't match. Check your username and password."

const kidLoginSchema = z.object({
  username: z.string().min(1, 'Enter your username.'),
  password: z.string().min(1, 'Enter your password.'),
})

const parentLoginSchema = z.object({
  email: z.email('Enter a valid email.'),
  password: z.string().min(1, 'Enter your password.'),
})

function KidLoginForm() {
  const router = useRouter()
  const form = useAppForm({
    defaultValues: { username: '', password: '' },
    validators: {
      onSubmit: kidLoginSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await loginKidFn({ data: value })
          return result.ok ? null : { form: MISMATCH }
        } catch {
          return { form: MISMATCH }
        }
      },
    },
    onSubmit: async () => {
      await router.invalidate()
      await router.navigate({ to: '/kid' })
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
        <form.AppField name="username">
          {(field) => (
            <field.TextField
              label="Username"
              autoComplete="username"
              placeholder="the one your parent set up"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="current-password" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError />
          <form.SubmitButton size="lg" submittingLabel="Checking...">
            Jump back in
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  )
}

function ParentLoginForm() {
  const router = useRouter()
  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onSubmit: parentLoginSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await loginParentFn({ data: value })
          return result.ok ? null : { form: MISMATCH }
        } catch {
          return { form: MISMATCH }
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
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField label="Password" type="password" autoComplete="current-password" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError />
          <form.SubmitButton size="lg" submittingLabel="Checking...">
            Log in
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  )
}

function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Wordmark className="text-2xl" />
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
      </div>
      <Tabs defaultValue="kid">
        <TabsList className="w-full">
          <TabsTrigger value="kid" className="flex-1">
            I'm the kid
          </TabsTrigger>
          <TabsTrigger value="parent" className="flex-1">
            I'm the parent
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kid" className="pt-4">
          <KidLoginForm />
        </TabsContent>
        <TabsContent value="parent" className="pt-4">
          <ParentLoginForm />
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm text-muted-foreground">
        New here?{' '}
        <Link to="/signup" className="font-bold text-primary underline-offset-4 hover:underline">
          Create a family account
        </Link>
      </p>
    </main>
  )
}
