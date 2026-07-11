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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useTemplates } from '@/hooks/use-templates'
import { CONTENT_ERROR_COPY } from '@/lib/admin/content-errors'
import type { Provider, TemplateKey } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { cn } from '@/lib/utils'
import { deleteProviderFn, saveProviderFn } from '@/utils/admin-content.functions'
import { fetchProvidersFn } from '@/utils/content.functions'

export const Route = createFileRoute('/_authed/admin/content/providers')({
  loader: () => fetchProvidersFn(),
  component: ProvidersEditor,
})

const FORMAT_OPTIONS = [
  { label: 'In person', value: 'in-person' },
  { label: 'Online', value: 'virtual' },
  { label: 'In person or online', value: 'hybrid' },
] as const

const ORG_TYPE_OPTIONS = [
  { label: 'Organization', value: 'organization' },
  { label: 'Independent guide', value: 'independent' },
] as const

function formatLabel(format: Provider['format']): string {
  return FORMAT_OPTIONS.find((option) => option.value === format)?.label ?? format
}

function ProvidersEditor() {
  const providers = Route.useLoaderData()
  const [editing, setEditing] = useState<Provider | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Provider | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Providers ({providers.length})</h2>
        <Button size="sm" onClick={() => setEditing('new')}>
          New provider
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {providers.map((provider) => (
          <li
            key={provider.key}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-bold">{provider.name}</p>
                {provider.verified ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                    Verified
                  </span>
                ) : null}
              </div>
              <p className="truncate text-muted-foreground text-xs">
                {formatLabel(provider.format)} · {provider.location} · {provider.templates.length}{' '}
                {provider.templates.length === 1 ? 'template' : 'templates'}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditing(provider)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleting(provider)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <ProviderDialog
          provider={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
      {deleting ? (
        <DeleteProviderDialog provider={deleting} onClose={() => setDeleting(null)} />
      ) : null}
    </div>
  )
}

// Mirrors the server ProviderSchema so client-valid input always clears the server validator.
const slugField = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{1,64}$/, 'Lowercase letters, numbers, and dashes.')
const ProviderFormSchema = z.object({
  key: slugField,
  name: z.string().trim().min(1).max(120),
  tagline: z.string().trim().min(1).max(200),
  overview: z.string().trim().min(1).max(1500),
  approach: z.string().trim().min(1).max(1000),
  format: z.enum(['in-person', 'virtual', 'hybrid']),
  location: z.string().trim().min(1).max(120),
  priceRange: z.string().trim().min(1).max(80),
  orgType: z.enum(['organization', 'independent']),
  verified: z.boolean(),
  templates: z.array(z.enum(TEMPLATE_KEYS)).min(1, 'Pick at least one template.').max(6),
  testimonials: z
    .array(
      z.object({
        quote: z.string().trim().min(1).max(500),
        attribution: z.string().trim().min(1).max(120),
      }),
    )
    .max(6),
})

function ProviderDialog({ provider, onClose }: { provider: Provider | null; onClose: () => void }) {
  const router = useRouter()
  const templates = useTemplates()
  const isNew = provider === null

  const form = useAppForm({
    defaultValues: {
      key: provider?.key ?? '',
      name: provider?.name ?? '',
      tagline: provider?.tagline ?? '',
      overview: provider?.overview ?? '',
      approach: provider?.approach ?? '',
      format: provider?.format ?? 'in-person',
      location: provider?.location ?? '',
      priceRange: provider?.priceRange ?? '',
      orgType: provider?.orgType ?? 'organization',
      verified: provider?.verified ?? false,
      templates: provider ? [...provider.templates] : ([] as TemplateKey[]),
      testimonials: provider
        ? provider.testimonials.map((t) => ({ quote: t.quote, attribution: t.attribution }))
        : ([] as { quote: string; attribution: string }[]),
    },
    validators: {
      onChange: ProviderFormSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = await saveProviderFn({ data: value })
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isNew ? 'New provider' : 'Edit provider'}
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
            <form.AppField name="key">
              {(field) => (
                <field.TextField
                  label="Key"
                  description="The permanent id. Cannot change after creating."
                  disabled={!isNew}
                />
              )}
            </form.AppField>
            <form.AppField name="name">{(field) => <field.TextField label="Name" />}</form.AppField>
            <form.AppField name="tagline">
              {(field) => <field.TextField label="Tagline" />}
            </form.AppField>
            <form.AppField name="overview">
              {(field) => <field.TextareaField label="Overview" rows={4} />}
            </form.AppField>
            <form.AppField name="approach">
              {(field) => <field.TextareaField label="Approach" rows={3} />}
            </form.AppField>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="format">
                {(field) => <field.SelectField label="Format" options={FORMAT_OPTIONS} />}
              </form.AppField>
              <form.AppField name="location">
                {(field) => <field.TextField label="Location" />}
              </form.AppField>
              <form.AppField name="priceRange">
                {(field) => <field.TextField label="Price range" />}
              </form.AppField>
              <form.AppField name="orgType">
                {(field) => (
                  <field.SelectField label="Organization type" options={ORG_TYPE_OPTIONS} />
                )}
              </form.AppField>
            </div>
            <form.AppField name="verified">
              {(field) => (
                <field.SwitchField
                  label="Verified"
                  description="Show the verified badge on this provider."
                />
              )}
            </form.AppField>
            <form.Field name="templates">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Templates</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {templates.map((template) => {
                        const active = field.state.value.includes(template.key)
                        return (
                          <button
                            key={template.key}
                            type="button"
                            aria-pressed={active}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-sm transition-colors',
                              active
                                ? 'border-primary bg-primary/10 font-bold text-primary'
                                : 'border-border text-muted-foreground hover:bg-muted',
                            )}
                            onClick={() => {
                              field.handleChange(
                                active
                                  ? field.state.value.filter((key) => key !== template.key)
                                  : [...field.state.value, template.key],
                              )
                              field.handleBlur()
                            }}
                          >
                            {template.emoji} {template.name}
                          </button>
                        )
                      })}
                    </div>
                    <FieldDescription>
                      The journeys this provider supports. Pick at least one.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="testimonials" mode="array">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel>Testimonials</FieldLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={field.state.value.length >= 6}
                        onClick={() => void field.pushValue({ quote: '', attribution: '' })}
                      >
                        Add testimonial
                      </Button>
                    </div>
                    {field.state.value.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No testimonials yet.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {field.state.value.map((_, index) => (
                          <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional; add/remove is at the row level
                            key={index}
                            className="flex flex-col gap-3 rounded-2xl border border-border p-4"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-muted-foreground text-xs">
                                Testimonial {index + 1}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => void field.removeValue(index)}
                              >
                                Remove
                              </Button>
                            </div>
                            <form.AppField name={`testimonials[${index}].quote`}>
                              {(sub) => <sub.TextareaField label="Quote" rows={3} />}
                            </form.AppField>
                            <form.AppField name={`testimonials[${index}].attribution`}>
                              {(sub) => <sub.TextField label="Attribution" />}
                            </form.AppField>
                          </div>
                        ))}
                      </div>
                    )}
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
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

function DeleteProviderDialog({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    const result = await deleteProviderFn({ data: { key: provider.key } })
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
          <DialogTitle className="font-display text-2xl">Delete provider?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          "{provider.name}" will be removed from the directory, along with its testimonials and
          template links. This can't be undone.
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
