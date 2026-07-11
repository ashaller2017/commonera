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
import type { QuizQuestion, QuizWeights, TemplateKey } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { deleteQuizQuestionFn, saveQuizQuestionFn } from '@/utils/admin-content.functions'
import { fetchQuizContentFn } from '@/utils/content.functions'

export const Route = createFileRoute('/_authed/admin/content/quiz')({
  loader: async () => (await fetchQuizContentFn()).questions,
  component: QuizEditor,
})

function QuizEditor() {
  const questions = Route.useLoaderData()
  const [editing, setEditing] = useState<QuizQuestion | 'new' | null>(null)
  const [deleting, setDeleting] = useState<QuizQuestion | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Quiz questions ({questions.length})</h2>
        <Button size="sm" onClick={() => setEditing('new')}>
          New question
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {questions.map((question) => (
          <li
            key={question.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-bold">{question.prompt}</p>
              <p className="truncate text-muted-foreground text-xs">
                {question.id} · {question.options.length} options
                {question.kind === 'words' ? ` · pick ${question.pickExactly}` : null}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground text-xs">
                {question.kind}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setEditing(question)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleting(question)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <QuestionDialog
          question={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
      {deleting ? (
        <DeleteQuestionDialog question={deleting} onClose={() => setDeleting(null)} />
      ) : null}
    </div>
  )
}

const slugField = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{1,64}$/, 'Lowercase letters, numbers, and dashes.')
const QuestionSchema = z
  .object({
    id: slugField,
    kind: z.enum(['single', 'words']),
    prompt: z.string().trim().min(1).max(200),
    helper: z.string().trim().max(200),
    // NaN is the cleared-input state; the refinement below rejects it when it matters.
    pickExactly: z.union([z.number(), z.nan()]),
    options: z
      .array(
        z.object({
          id: slugField,
          label: z.string().trim().min(1).max(160),
          emoji: z.string().trim().min(1).max(8),
          weights: z.record(
            z.enum(TEMPLATE_KEYS),
            z
              .number('Between 0 and 9.')
              .int('Between 0 and 9.')
              .min(0, 'Between 0 and 9.')
              .max(9, 'Between 0 and 9.'),
          ),
        }),
      )
      .min(2, 'At least two options.')
      .max(12, 'At most twelve options.'),
  })
  .superRefine((value, ctx) => {
    if (value.kind !== 'words') return
    if (!Number.isInteger(value.pickExactly) || value.pickExactly < 1 || value.pickExactly > 6) {
      ctx.addIssue({
        code: 'custom',
        path: ['pickExactly'],
        message: 'A whole number from 1 to 6.',
      })
    }
  })

type OptionFormValue = {
  id: string
  label: string
  emoji: string
  weights: Record<TemplateKey, number>
}

function fullWeights(weights: QuizWeights): Record<TemplateKey, number> {
  const out = {} as Record<TemplateKey, number>
  for (const key of TEMPLATE_KEYS) out[key] = weights[key] ?? 0
  return out
}

function emptyOption(): OptionFormValue {
  return { id: '', label: '', emoji: '', weights: fullWeights({}) }
}

function QuestionDialog({
  question,
  onClose,
}: {
  question: QuizQuestion | null
  onClose: () => void
}) {
  const router = useRouter()
  const templates = useTemplates()
  const isNew = question === null

  const templateLabel = (key: TemplateKey) => {
    const template = templates.find((t) => t.key === key)
    return template ? `${template.emoji} ${template.name}` : key
  }

  const form = useAppForm({
    defaultValues: {
      id: question?.id ?? '',
      kind: question?.kind ?? 'single',
      prompt: question?.prompt ?? '',
      helper: question?.helper ?? '',
      pickExactly: question?.kind === 'words' ? question.pickExactly : 3,
      options: question
        ? question.options.map(
            (o): OptionFormValue => ({
              id: o.id,
              label: o.label,
              emoji: o.emoji,
              weights: fullWeights(o.weights),
            }),
          )
        : [emptyOption(), emptyOption()],
    },
    validators: {
      onChange: QuestionSchema,
      onSubmitAsync: async ({ value }) => {
        const helper = value.helper.trim()
        try {
          const result = await saveQuizQuestionFn({
            data: {
              id: value.id,
              kind: value.kind,
              prompt: value.prompt,
              helper: helper === '' ? null : helper,
              pickExactly: value.kind === 'words' ? value.pickExactly : null,
              options: value.options,
            },
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
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isNew ? 'New question' : 'Edit question'}
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
              <form.AppField name="kind">
                {(field) => (
                  <field.SelectField
                    label="Kind"
                    options={[
                      { label: 'Single choice', value: 'single' },
                      { label: 'Pick words', value: 'words' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.Subscribe selector={(state) => state.values.kind}>
                {(kind) =>
                  kind === 'words' ? (
                    <form.AppField name="pickExactly">
                      {(field) => (
                        <field.NumberField
                          label="Pick exactly"
                          description="How many words the kid must pick."
                          min={1}
                          max={6}
                        />
                      )}
                    </form.AppField>
                  ) : null
                }
              </form.Subscribe>
            </div>
            <form.AppField name="prompt">
              {(field) => <field.TextField label="Prompt" />}
            </form.AppField>
            <form.AppField name="helper">
              {(field) => (
                <field.TextField
                  label="Helper"
                  description="Optional hint shown under the prompt. Leave blank for none."
                />
              )}
            </form.AppField>
            <form.Field name="options" mode="array">
              {(optionsField) => (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                      Options
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={optionsField.state.value.length >= 12}
                      onClick={() => optionsField.pushValue(emptyOption())}
                    >
                      Add option
                    </Button>
                  </div>
                  {optionsField.state.value.map((_, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: array-field rows are positional in TanStack Form
                      key={index}
                      className="flex flex-col gap-3 rounded-2xl border border-border p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-muted-foreground text-xs uppercase tracking-wide">
                          Option {index + 1}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={optionsField.state.value.length <= 2}
                          onClick={() => optionsField.removeValue(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr]">
                        <form.AppField name={`options[${index}].id`}>
                          {(subField) => <subField.TextField label="Id" />}
                        </form.AppField>
                        <form.AppField name={`options[${index}].label`}>
                          {(subField) => <subField.TextField label="Label" />}
                        </form.AppField>
                        <form.AppField name={`options[${index}].emoji`}>
                          {(subField) => <subField.TextField label="Emoji" />}
                        </form.AppField>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-muted-foreground text-xs">
                          Template weights, 0 to 9. Higher means picking this option leans the
                          result toward that template.
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {TEMPLATE_KEYS.map((templateKey) => (
                            <form.AppField
                              key={templateKey}
                              name={`options[${index}].weights.${templateKey}`}
                            >
                              {(subField) => (
                                <subField.NumberField
                                  label={templateLabel(templateKey)}
                                  min={0}
                                  max={9}
                                />
                              )}
                            </form.AppField>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form.Field>
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

function DeleteQuestionDialog({
  question,
  onClose,
}: {
  question: QuizQuestion
  onClose: () => void
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    const result = await deleteQuizQuestionFn({ data: { id: question.id } })
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
          <DialogTitle className="font-display text-2xl">Delete question?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          "{question.prompt}" and its options will be removed from the quiz. This can't be undone.
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
