import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
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
import { useTemplate } from '@/hooks/use-templates'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { TemplateKey } from '@/lib/content/types'
import {
  deleteKidFn,
  deleteParentFn,
  fetchFamilyDetailFn,
  resetKidPasswordFn,
} from '@/utils/admin.functions'
import type { AccountActionError, AdminFamily, AdminKid } from '@/utils/admin.server'

export const Route = createFileRoute('/_authed/admin/accounts/$parentId')({
  loader: ({ params }) => fetchFamilyDetailFn({ data: { parentId: params.parentId } }),
  component: FamilyDetail,
})

const ACCOUNT_ERROR_COPY: Record<AccountActionError, string> = {
  'not-admin': 'You need admin access to do that.',
  'not-found': 'That account no longer exists. It may have already been removed.',
  'action-failed': 'Something went wrong. Try again in a moment.',
}

function FamilyDetail() {
  const family = Route.useLoaderData()
  const [resettingKid, setResettingKid] = useState<AdminKid | null>(null)
  const [deletingKid, setDeletingKid] = useState<AdminKid | null>(null)
  const [deletingFamily, setDeletingFamily] = useState(false)

  if (!family) {
    return (
      <div className="mx-auto max-w-4xl py-2">
        <h1 className="font-display text-2xl font-semibold">Family not found</h1>
        <p className="mt-2 text-muted-foreground">That family no longer exists.</p>
        <Link
          to="/admin/accounts"
          className="mt-4 inline-block text-sm font-bold text-primary underline-offset-4 hover:underline"
        >
          Back to accounts
        </Link>
      </div>
    )
  }

  const created = new Date(family.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-4xl py-2">
      <Link
        to="/admin/accounts"
        className="text-sm font-bold text-primary underline-offset-4 hover:underline"
      >
        Back to accounts
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-semibold">{family.displayName}</h1>
        <p className="mt-1 text-muted-foreground">
          Joined {created} · {family.kids.length} {family.kids.length === 1 ? 'child' : 'children'}
        </p>
      </header>

      {family.kids.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No children on this account yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {family.kids.map((kid) => (
            <KidCard
              key={kid.id}
              kid={kid}
              onResetPassword={() => setResettingKid(kid)}
              onDelete={() => setDeletingKid(kid)}
            />
          ))}
        </ul>
      )}

      <section className="mt-10 rounded-2xl border border-destructive/40 p-4">
        <h2 className="font-display text-lg font-semibold">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deleting this family removes the parent account and every child account with it.
        </p>
        <Button
          variant="destructive"
          size="sm"
          className="mt-3"
          onClick={() => setDeletingFamily(true)}
        >
          Delete family
        </Button>
      </section>

      {resettingKid ? (
        <ResetPasswordDialog kid={resettingKid} onClose={() => setResettingKid(null)} />
      ) : null}
      {deletingKid ? (
        <DeleteKidDialog kid={deletingKid} onClose={() => setDeletingKid(null)} />
      ) : null}
      {deletingFamily ? (
        <DeleteFamilyDialog family={family} onClose={() => setDeletingFamily(false)} />
      ) : null}
    </div>
  )
}

function KidCard({
  kid,
  onResetPassword,
  onDelete,
}: {
  kid: AdminKid
  onResetPassword: () => void
  onDelete: () => void
}) {
  return (
    <li className="rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold">{kid.displayName}</p>
          {kid.username ? <p className="text-xs text-muted-foreground">@{kid.username}</p> : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="sm" onClick={onResetPassword}>
            Reset password
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
      {kid.journey ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
          <JourneyChip
            template={kid.journey.template}
            label={kid.journey.name}
            done={kid.journey.milestonesDone}
            total={kid.journey.milestonesTotal}
          />
          <span className="text-xs text-muted-foreground">
            {kid.journey.activitiesDone}{' '}
            {kid.journey.activitiesDone === 1 ? 'activity' : 'activities'} done ·{' '}
            {kid.journey.activitiesPlanned} planned
          </span>
        </div>
      ) : (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          No journey yet
        </p>
      )}
    </li>
  )
}

function JourneyChip({
  template,
  label,
  done,
  total,
}: {
  template: TemplateKey
  label: string
  done: number
  total: number
}) {
  const meta = useTemplate(template)
  const palette = TEMPLATE_PALETTE[template]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${palette.soft} ${palette.softText}`}
    >
      {meta ? meta.emoji : null} {label}
      <span className="tabular-nums opacity-80">
        {done}/{total}
      </span>
    </span>
  )
}

const ResetPasswordSchema = z.object({
  password: z.string().min(6, 'At least 6 characters.').max(72),
})

function ResetPasswordDialog({ kid, onClose }: { kid: AdminKid; onClose: () => void }) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: { password: '' },
    validators: {
      onChange: ResetPasswordSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await resetKidPasswordFn({
            data: { kidId: kid.id, password: value.password },
          })
          return result.ok ? null : { form: ACCOUNT_ERROR_COPY[result.error] }
        } catch {
          return { form: ACCOUNT_ERROR_COPY['action-failed'] }
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
          <DialogTitle className="font-display text-2xl">Reset password</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Set a new password for {kid.displayName}. Share it with the family directly, they won't be
          notified.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.AppField name="password">
              {(field) => <field.TextField label="New password" autoComplete="off" />}
            </form.AppField>
            <form.AppForm>
              <div className="flex flex-col gap-3">
                <form.FormError />
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="ghost" />}>
                    Cancel
                  </DialogClose>
                  <form.SubmitButton submittingLabel="Saving...">Reset password</form.SubmitButton>
                </DialogFooter>
              </div>
            </form.AppForm>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteKidDialog({ kid, onClose }: { kid: AdminKid; onClose: () => void }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    const result = await deleteKidFn({ data: { kidId: kid.id } })
    if (result.ok) {
      await router.invalidate()
      onClose()
    } else {
      setError(ACCOUNT_ERROR_COPY[result.error])
      setPending(false)
    }
  }

  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Delete {kid.displayName}?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Their account and all of their journey data will be removed. This can't be undone.
        </p>
        {error ? <p className="font-bold text-destructive text-sm">{error}</p> : null}
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="ghost" />}>Cancel</DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={confirm}>
            {pending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteFamilyDialog({ family, onClose }: { family: AdminFamily; onClose: () => void }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    const result = await deleteParentFn({ data: { parentId: family.id } })
    if (result.ok) {
      await router.navigate({ to: '/admin/accounts' })
    } else {
      setError(ACCOUNT_ERROR_COPY[result.error])
      setPending(false)
    }
  }

  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Delete family?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          "{family.displayName}" will be removed, along with{' '}
          {family.kids.length === 1
            ? 'their child account'
            : `all ${family.kids.length} child accounts`}{' '}
          and every journey. This can't be undone.
        </p>
        {error ? <p className="font-bold text-destructive text-sm">{error}</p> : null}
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="ghost" />}>Cancel</DialogClose>
          <Button type="button" variant="destructive" disabled={pending} onClick={confirm}>
            {pending ? 'Deleting...' : 'Delete family'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
