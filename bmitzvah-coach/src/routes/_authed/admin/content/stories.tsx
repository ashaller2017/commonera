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
import type { InspirationStory } from '@/lib/content/types'
import { TEMPLATE_KEYS } from '@/lib/content/types'
import { createStoryFn, deleteStoryFn, updateStoryFn } from '@/utils/admin-content.functions'
import { fetchStoriesFn } from '@/utils/content.functions'

export const Route = createFileRoute('/_authed/admin/content/stories')({
  loader: () => fetchStoriesFn(),
  component: StoriesEditor,
})

function StoriesEditor() {
  const stories = Route.useLoaderData()
  const [editing, setEditing] = useState<InspirationStory | 'new' | null>(null)
  const [deleting, setDeleting] = useState<InspirationStory | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Stories ({stories.length})</h2>
        <Button size="sm" onClick={() => setEditing('new')}>
          New story
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {stories.map((story) => (
          <li
            key={story.slug}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-bold">{story.journeyName}</p>
              <p className="truncate text-muted-foreground text-xs">
                {story.childName}, {story.age} · {story.template}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditing(story)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleting(story)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <StoryDialog story={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      ) : null}
      {deleting ? <DeleteStoryDialog story={deleting} onClose={() => setDeleting(null)} /> : null}
    </div>
  )
}

const slugField = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{1,64}$/, 'Lowercase letters, numbers, and dashes.')
const StorySchema = z.object({
  slug: slugField,
  childName: z.string().trim().min(1).max(80),
  age: z.number().int().min(9).max(14),
  template: z.enum(TEMPLATE_KEYS),
  journeyName: z.string().trim().min(1).max(120),
  story: z.string().trim().min(1).max(2000),
  quote: z.string().trim().min(1).max(400),
  celebration: z.string().trim().min(1).max(2000),
})

function StoryDialog({ story, onClose }: { story: InspirationStory | null; onClose: () => void }) {
  const router = useRouter()
  const templates = useTemplates()
  const isNew = story === null

  const form = useAppForm({
    defaultValues: {
      slug: story?.slug ?? '',
      childName: story?.childName ?? '',
      age: story?.age ?? 12,
      template: story?.template ?? TEMPLATE_KEYS[0],
      journeyName: story?.journeyName ?? '',
      story: story?.story ?? '',
      quote: story?.quote ?? '',
      celebration: story?.celebration ?? '',
    },
    validators: {
      onChange: StorySchema,
      onSubmitAsync: async ({ value }) => {
        try {
          const result = isNew
            ? await createStoryFn({ data: value })
            : await updateStoryFn({ data: value })
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
            {isNew ? 'New story' : 'Edit story'}
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
            <form.AppField name="slug">
              {(field) => (
                <field.TextField
                  label="Slug"
                  description="The permanent id. Cannot change after creating."
                  disabled={!isNew}
                />
              )}
            </form.AppField>
            <form.AppField name="journeyName">
              {(field) => <field.TextField label="Journey name" />}
            </form.AppField>
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="childName">
                {(field) => <field.TextField label="Child name" />}
              </form.AppField>
              <form.AppField name="age">
                {(field) => <field.NumberField label="Age" />}
              </form.AppField>
            </div>
            <form.AppField name="template">
              {(field) => (
                <field.SelectField
                  label="Template"
                  options={templates.map((t) => ({ label: t.name, value: t.key }))}
                />
              )}
            </form.AppField>
            <form.AppField name="story">
              {(field) => <field.TextareaField label="Story" rows={5} />}
            </form.AppField>
            <form.AppField name="quote">
              {(field) => <field.TextareaField label="Pull quote" rows={2} />}
            </form.AppField>
            <form.AppField name="celebration">
              {(field) => <field.TextareaField label="Celebration" rows={4} />}
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

function DeleteStoryDialog({ story, onClose }: { story: InspirationStory; onClose: () => void }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setPending(true)
    setError(null)
    const result = await deleteStoryFn({ data: { slug: story.slug } })
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
          <DialogTitle className="font-display text-2xl">Delete story?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          "{story.journeyName}" will be removed from the site. This can't be undone.
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
