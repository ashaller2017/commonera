import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useAppForm } from '@/components/form'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useTemplates } from '@/hooks/use-templates'
import { CONTENT_ERROR_COPY } from '@/lib/admin/content-errors'
import type { JourneyTemplate, TemplateKey } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { replaceTemplateMilestonesFn } from '@/utils/admin-content.functions'

export const Route = createFileRoute('/_authed/admin/content/milestones')({
  component: MilestonesEditor,
})

function MilestonesEditor() {
  const templates = useTemplates()
  const [selected, setSelected] = useState<TemplateKey>(TEMPLATE_KEYS[0])
  const template = templates.find((t) => t.key === selected)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-semibold">Milestones</h2>
        <p className="text-muted-foreground text-sm">
          Pick a template, then edit its ordered milestone list. Saving replaces the whole list.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {templates.map((t) => (
          <Button
            key={t.key}
            type="button"
            size="sm"
            variant={t.key === selected ? 'default' : 'outline'}
            onClick={() => setSelected(t.key)}
          >
            {t.emoji} {t.name}
          </Button>
        ))}
      </div>

      {template ? <MilestonesForm key={template.key} template={template} /> : null}
    </div>
  )
}

const MilestonesSchema = z.object({
  milestones: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(120),
        description: z.string().trim().max(500),
      }),
    )
    .max(12),
})

function MilestonesForm({ template }: { template: JourneyTemplate }) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      milestones: template.milestones.map((m) => ({
        title: m.title,
        description: m.description,
      })),
    },
    validators: {
      onChange: MilestonesSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await replaceTemplateMilestonesFn({
            data: { template: template.key, milestones: value.milestones },
          })
          return result.ok ? null : { form: CONTENT_ERROR_COPY[result.error] }
        } catch {
          return { form: CONTENT_ERROR_COPY['write-failed'] }
        }
      },
    },
    onSubmit: async () => {
      await router.invalidate()
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup className="gap-4">
        <form.Field name="milestones" mode="array">
          {(field) => (
            <div className="flex flex-col gap-3">
              {field.state.value.length === 0 ? (
                <p className="rounded-2xl border border-border border-dashed p-4 text-muted-foreground text-sm">
                  No milestones yet. Add the first one below.
                </p>
              ) : null}
              {field.state.value.map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: array-field rows are positional in TanStack Form
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                      Milestone {index + 1}
                    </p>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => field.moveValue(index, index - 1)}
                      >
                        Up
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={index === field.state.value.length - 1}
                        onClick={() => field.moveValue(index, index + 1)}
                      >
                        Down
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => field.removeValue(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <form.AppField name={`milestones[${index}].title`}>
                    {(subField) => <subField.TextField label="Title" />}
                  </form.AppField>
                  <form.AppField name={`milestones[${index}].description`}>
                    {(subField) => <subField.TextareaField label="Description" rows={2} />}
                  </form.AppField>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                disabled={field.state.value.length >= 12}
                onClick={() => field.pushValue({ title: '', description: '' })}
              >
                Add milestone
              </Button>
            </div>
          )}
        </form.Field>
        <form.AppForm>
          <div className="flex flex-col gap-3">
            <form.FormError />
            <div className="flex justify-end">
              <form.SubmitButton submittingLabel="Saving...">Save milestones</form.SubmitButton>
            </div>
          </div>
        </form.AppForm>
      </FieldGroup>
    </form>
  )
}
