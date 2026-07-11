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
import { useTemplates } from '@/hooks/use-templates'
import { CONTENT_ERROR_COPY } from '@/lib/admin/content-errors'
import type { ActivityPrompt } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import {
  createActivityPromptFn,
  deleteActivityPromptFn,
  updateActivityPromptFn,
} from '@/utils/admin-content.functions'
import { fetchActivityPromptsFn } from '@/utils/content.functions'

export const Route = createFileRoute('/_authed/admin/content/prompts')({
  loader: () => fetchActivityPromptsFn(),
  component: PromptsEditor,
})

const KIND_OPTIONS = [
  { label: 'Do', value: 'do' },
  { label: 'Create', value: 'create' },
  { label: 'Learn', value: 'learn' },
  { label: 'Give', value: 'give' },
] as const

const KIND_LABELS: Record<ActivityPrompt['kind'], string> = {
  do: 'Do',
  create: 'Create',
  learn: 'Learn',
  give: 'Give',
}

function PromptsEditor() {
  const prompts = Route.useLoaderData()
  const templates = useTemplates()
  const [editing, setEditing] = useState<ActivityPrompt | 'new' | null>(null)
  const [deleting, setDeleting] = useState<ActivityPrompt | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Activity prompts ({prompts.length})</h2>
        <Button size="sm" onClick={() => setEditing('new')}>
          New prompt
        </Button>
      </div>

      {templates.map((template) => {
        const templatePrompts = prompts.filter((p) => p.template === template.key)
        if (templatePrompts.length === 0) return null
        return (
          <section key={template.key} className="flex flex-col gap-2">
            <h3 className="font-display font-semibold text-muted-foreground text-sm">
              {template.emoji} {template.name} ({templatePrompts.length})
            </h3>
            <ul className="flex flex-col gap-2">
              {templatePrompts.map((prompt) => (
                <li
                  key={prompt.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold">{prompt.title}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {KIND_LABELS[prompt.kind]} · {prompt.description || prompt.id}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(prompt)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(prompt)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      {editing ? (
        <PromptDialog
          prompt={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
      {deleting ? <DeletePromptDialog prompt={deleting} onClose={() => setDeleting(null)} /> : null}
    </div>
  )
}

const PromptSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]{1,64}$/, 'Lowercase letters, numbers, and dashes.'),
  template: z.enum(TEMPLATE_KEYS),
  kind: z.enum(['do', 'create', 'learn', 'give']),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
})

function PromptDialog({ prompt, onClose }: { prompt: ActivityPrompt | null; onClose: () => void }) {
  const router = useRouter()
  const templates = useTemplates()
  const isNew = prompt === null

  const form = useAppForm({
    defaultValues: {
      id: prompt?.id ?? '',
      template: prompt?.template ?? TEMPLATE_KEYS[0],
      kind: prompt?.kind ?? 'do',
      title: prompt?.title ?? '',
      description: prompt?.description ?? '',
    },
    validators: {
      onChange: PromptSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = isNew
            ? await createActivityPromptFn({ data: value })
            : await updateActivityPromptFn({ data: value })
          return result.ok ? null : { form: CONTENT_ERROR_COPY[result.error] }
        } catch {
          return { form: CONTENT_ERROR_COPY['write-failed'] }
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isNew ? 'New prompt' : 'Edit prompt'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.AppField name="id">
              {(field) => (
                <field.TextField
                  label="Id"
                  description="The permanent id. Cannot change after creating."
                  disabled={!isNew}
                />
              )}
            </form.AppField>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="template">
                {(field) => (
                  <field.SelectField
                    label="Template"
                    options={templates.map((t) => ({ label: t.name, value: t.key }))}
                  />
                )}
              </form.AppField>
              <form.AppField name="kind">
                {(field) => (
                  <field.SelectField
                    label="Kind"
                    options={KIND_OPTIONS.map((k) => ({ label: k.label, value: k.value }))}
                  />
                )}
              </form.AppField>
            </div>
            <form.AppField name="title">
              {(field) => <field.TextField label="Title" />}
            </form.AppField>
            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" rows={3} />}
            </form.AppField>
            <form.AppForm>
              <div className="flex flex-col gap-3">
                <form.FormError />
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="ghost" />}>
                    Cancel
                  </DialogClose>
                  <form.SubmitButton submittingLabel="Saving...">Save</form.SubmitButton>
                </DialogFooter>
              </div>
            </form.AppForm>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeletePromptDialog({ prompt, onClose }: { prompt: ActivityPrompt; onClose: () => void }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    const result = await deleteActivityPromptFn({ data: { id: prompt.id } })
    if (result.ok) {
      await router.invalidate()
      onClose()
    } else {
      setError(CONTENT_ERROR_COPY[result.error])
      setPending(false)
    }
  }

  return (
    <Dialog open onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Delete prompt?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          "{prompt.title}" will be removed from the activity bank. This can't be undone.
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
