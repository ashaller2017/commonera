import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FieldGroup } from '@/components/ui/field'
import { createAdminFn, deleteAdminFn, fetchAdminsFn } from '@/utils/admin.functions'
import type { CreateAdminError, DeleteAdminError } from '@/utils/admin.server'

export const Route = createFileRoute('/_authed/admin/admins')({
  loader: () => fetchAdminsFn(),
  component: AdminAdmins,
})

const CREATE_ADMIN_ERROR_COPY: Record<CreateAdminError, string> = {
  'not-admin': "You don't have permission to manage admins.",
  'email-taken': 'An account with that email already exists.',
  'create-failed': "Couldn't create the admin. Try again.",
}

const DELETE_ADMIN_ERROR_COPY: Record<DeleteAdminError, string> = {
  'not-admin': "You don't have permission to manage admins.",
  'cannot-delete-self': "You can't remove your own admin account.",
  'last-admin': "You can't remove the last admin.",
  'delete-failed': "Couldn't remove the admin. Try again.",
}

type AdminRow = { readonly id: string; readonly displayName: string; readonly isSelf: boolean }

function AdminAdmins() {
  const admins = Route.useLoaderData()
  const [creating, setCreating] = useState(false)
  const [removing, setRemoving] = useState<AdminRow | null>(null)

  return (
    <div className="mx-auto max-w-2xl py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admins</h1>
          <p className="mt-1 text-muted-foreground">
            {admins.length} CommonEra {admins.length === 1 ? 'operator' : 'operators'}.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreating(true)}>
          New admin
        </Button>
      </div>
      <ul className="mt-6 flex flex-col gap-2">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="flex items-center justify-between rounded-2xl border border-border p-3"
          >
            <span className="font-bold">
              {admin.displayName}
              {admin.isSelf ? (
                <span className="ml-2 text-xs text-muted-foreground">you</span>
              ) : null}
            </span>
            {admin.isSelf ? null : (
              <Button variant="ghost" size="sm" onClick={() => setRemoving(admin)}>
                Remove
              </Button>
            )}
          </li>
        ))}
      </ul>

      {creating ? <CreateAdminDialog onClose={() => setCreating(false)} /> : null}
      {removing ? <RemoveAdminDialog admin={removing} onClose={() => setRemoving(null)} /> : null}
    </div>
  )
}

const CreateAdminSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'At least 8 characters.'),
  displayName: z.string().trim().min(1).max(60),
})

function CreateAdminDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: { email: '', password: '', displayName: '' },
    validators: {
      onChange: CreateAdminSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await createAdminFn({ data: value })
          return result.ok ? null : { form: CREATE_ADMIN_ERROR_COPY[result.error] }
        } catch {
          return { form: CREATE_ADMIN_ERROR_COPY['create-failed'] }
        }
      },
    },
    onSubmit: async () => {
      await router.invalidate()
      onClose()
    },
  })

  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New admin</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.AppField name="displayName">
              {(field) => <field.TextField label="Name" autoComplete="off" />}
            </form.AppField>
            <form.AppField name="email">
              {(field) => <field.TextField label="Email" type="email" autoComplete="off" />}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  description="At least 8 characters. Share it with the new admin securely."
                />
              )}
            </form.AppField>
            <form.AppForm>
              <div className="flex flex-col gap-3">
                <form.FormError />
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="ghost" />}>
                    Cancel
                  </DialogClose>
                  <form.SubmitButton submittingLabel="Creating...">Create admin</form.SubmitButton>
                </DialogFooter>
              </div>
            </form.AppForm>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RemoveAdminDialog({ admin, onClose }: { admin: AdminRow; onClose: () => void }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    try {
      const result = await deleteAdminFn({ data: { adminId: admin.id } })
      if (result.ok) {
        await router.invalidate()
        onClose()
      } else {
        setError(DELETE_ADMIN_ERROR_COPY[result.error])
        setPending(false)
      }
    } catch {
      setError(DELETE_ADMIN_ERROR_COPY['delete-failed'])
      setPending(false)
    }
  }

  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Remove admin?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {admin.displayName} will lose access to the admin console. This can't be undone.
        </p>
        {error ? <p className="font-bold text-destructive text-sm">{error}</p> : null}
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="ghost" />}>Cancel</DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={confirm}>
            {pending ? 'Removing...' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
