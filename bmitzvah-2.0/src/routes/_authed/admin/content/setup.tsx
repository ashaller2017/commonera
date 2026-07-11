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
import { CONTENT_ERROR_COPY } from '@/lib/admin/content-errors'
import type { ChoiceOption } from '@/lib/content/types'
import { updateChoiceOptionFn } from '@/utils/admin-content.functions'
import { fetchQuizContentFn } from '@/utils/content.functions'

export const Route = createFileRoute('/_authed/admin/content/setup')({
  loader: () => fetchQuizContentFn(),
  component: SetupEditor,
})

type OptionTable = 'timeline_options' | 'comfort_options'

type EditingOption = {
  readonly table: OptionTable
  readonly option: ChoiceOption<string>
}

function SetupEditor() {
  const { timeline, comfort } = Route.useLoaderData()
  const [editing, setEditing] = useState<EditingOption | null>(null)

  return (
    <div className="flex flex-col gap-8">
      <OptionSection
        title="Timeline"
        description="Shown when families say how far out their celebration is."
        options={timeline}
        onEdit={(option) => setEditing({ table: 'timeline_options', option })}
      />
      <OptionSection
        title="Comfort"
        description="How families describe their relationship to tradition."
        options={comfort}
        onEdit={(option) => setEditing({ table: 'comfort_options', option })}
      />
      {editing ? <OptionDialog editing={editing} onClose={() => setEditing(null)} /> : null}
    </div>
  )
}

function OptionSection({
  title,
  description,
  options,
  onEdit,
}: {
  title: string
  description: string
  options: readonly ChoiceOption<string>[]
  onEdit: (option: ChoiceOption<string>) => void
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground text-sm">
          {description} Keys drive quiz scoring and cannot change.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {options.map((option) => (
          <li
            key={option.key}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-bold">{option.label}</p>
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
                  {option.key}
                </span>
              </div>
              <p className="truncate text-muted-foreground text-xs">{option.helper}</p>
            </div>
            <Button variant="ghost" size="sm" className="shrink-0" onClick={() => onEdit(option)}>
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

const OptionSchema = z.object({
  label: z.string().trim().min(1).max(120),
  helper: z.string().trim().min(1).max(200),
})

function OptionDialog({ editing, onClose }: { editing: EditingOption; onClose: () => void }) {
  const router = useRouter()
  const { table, option } = editing

  const form = useAppForm({
    defaultValues: {
      label: option.label,
      helper: option.helper,
    },
    validators: {
      onChange: OptionSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await updateChoiceOptionFn({
            data: { table, key: option.key, ...value },
          })
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit option</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Key{' '}
          <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">{option.key}</span>{' '}
          is tied to quiz scoring and cannot change.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <form.AppField name="label">
              {(field) => <field.TextField label="Label" />}
            </form.AppField>
            <form.AppField name="helper">
              {(field) => <field.TextField label="Helper" />}
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
