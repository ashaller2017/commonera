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
import type { JourneyTemplate } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { updateTemplateFn } from '@/utils/admin-content.functions'

export const Route = createFileRoute('/_authed/admin/content/templates')({
  component: TemplatesEditor,
})

function TemplatesEditor() {
  const templates = useTemplates()
  const [editing, setEditing] = useState<JourneyTemplate | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-semibold">Templates ({templates.length})</h2>

      <ul className="flex flex-col gap-2">
        {templates.map((template) => (
          <li
            key={template.key}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-bold">
                {template.emoji} {template.name}
              </p>
              <p className="truncate text-muted-foreground text-xs">{template.tagline}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditing(template)}>
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? <TemplateDialog template={editing} onClose={() => setEditing(null)} /> : null}
    </div>
  )
}

const text = z.string().trim().min(1)
const textList = z.array(z.string().trim().min(1)).max(24)
const TemplateSchema = z.object({
  key: z.enum(TEMPLATE_KEYS),
  name: text.max(80),
  emoji: z.string().trim().min(1).max(8),
  tagline: text.max(160),
  description: text.max(1200),
  jewishLens: text.max(1200),
  themes: textList,
  celebrationIdeas: textList,
  gettingStarted: textList,
  providerTypes: textList,
})

function TemplateDialog({ template, onClose }: { template: JourneyTemplate; onClose: () => void }) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      key: template.key,
      name: template.name,
      emoji: template.emoji,
      tagline: template.tagline,
      description: template.description,
      jewishLens: template.jewishLens,
      themes: [...template.themes],
      celebrationIdeas: [...template.celebrationIdeas],
      gettingStarted: [...template.gettingStarted],
      providerTypes: [...template.providerTypes],
    },
    validators: {
      onChange: TemplateSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await updateTemplateFn({ data: value })
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit template</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="name">
                {(field) => <field.TextField label="Name" />}
              </form.AppField>
              <form.AppField name="emoji">
                {(field) => <field.TextField label="Emoji" />}
              </form.AppField>
            </div>
            <form.AppField name="tagline">
              {(field) => <field.TextField label="Tagline" />}
            </form.AppField>
            <form.AppField name="description">
              {(field) => <field.TextareaField label="Description" rows={5} />}
            </form.AppField>
            <form.AppField name="jewishLens">
              {(field) => <field.TextareaField label="Jewish lens" rows={5} />}
            </form.AppField>
            <form.AppField name="themes">
              {(field) => <field.StringListField label="Themes" addLabel="Add theme" />}
            </form.AppField>
            <form.AppField name="celebrationIdeas">
              {(field) => <field.StringListField label="Celebration ideas" addLabel="Add idea" />}
            </form.AppField>
            <form.AppField name="gettingStarted">
              {(field) => <field.StringListField label="Getting started" addLabel="Add step" />}
            </form.AppField>
            <form.AppField name="providerTypes">
              {(field) => <field.StringListField label="Provider types" addLabel="Add type" />}
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
