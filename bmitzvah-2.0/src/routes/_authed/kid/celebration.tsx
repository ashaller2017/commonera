import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { TemplateChip } from '@/components/template-chip'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTemplate } from '@/hooks/use-templates'
import { fetchOwnJourneyFn, upsertCelebrationFn } from '@/utils/journeys.functions'
import type { JourneyView } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/kid/celebration')({
  loader: () => fetchOwnJourneyFn(),
  component: CelebrationPage,
})

function CelebrationPage() {
  const journey = Route.useLoaderData()
  if (!journey) return <EmptyCelebration />
  return <CelebrationPlanner journey={journey} />
}

function EmptyCelebration() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-6 py-20 text-center">
      <span className="text-5xl" aria-hidden>
        🎉
      </span>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        Your celebration gets planned once you have a journey
      </h1>
      <p className="text-muted-foreground">
        Take the quiz first, name your path, and this is where you will sketch the day it all builds
        toward.
      </p>
      <Button size="lg" render={<Link to="/kid/quiz" />}>
        Take the quiz
      </Button>
    </section>
  )
}

function CelebrationPlanner({ journey }: { journey: JourneyView }) {
  const router = useRouter()
  const template = useTemplate(journey.template)
  const [what, setWhat] = useState(journey.celebration?.what ?? '')
  const [whoWith, setWhoWith] = useState(journey.celebration?.whoWith ?? '')
  const [whereAt, setWhereAt] = useState(journey.celebration?.whereAt ?? '')
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: (input: { what: string; whoWith: string; whereAt: string }) =>
      upsertCelebrationFn({ data: input }),
    onSuccess: async (result) => {
      if (result.ok) {
        setSaved(true)
        await router.invalidate()
      }
    },
  })

  const result = mutation.data
  const failed = mutation.isError || (result !== undefined && !result.ok)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-4">
        <TemplateChip template={journey.template} variant="solid" />
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{journey.name}</h1>
      </header>

      <div className="flex flex-col gap-4 rounded-3xl bg-accent p-6 text-accent-foreground">
        <div className="flex items-start gap-4">
          <PartyPopper className="mt-0.5 size-6 shrink-0" aria-hidden />
          <p className="text-sm leading-relaxed sm:text-base">
            Celebration is the destination. Sketch it early, change it often. Nothing here is locked
            in, so put down whatever you can picture today.
          </p>
        </div>
        {template && template.celebrationIdeas.length > 0 ? (
          <div className="flex flex-col gap-2 border-t border-accent-foreground/15 pt-4">
            <p className="text-xs font-bold uppercase tracking-wide opacity-80">
              Ideas from your path
            </p>
            <ul className="flex flex-col gap-1.5">
              {template.celebrationIdeas.map((idea) => (
                <li key={idea} className="text-sm leading-relaxed">
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(false)
          mutation.mutate({ what, whoWith, whereAt })
        }}
      >
        <Field
          id="celebration-what"
          label="What happens?"
          value={what}
          placeholder="A showcase of the mural, then tacos in the park with everyone who helped"
          onChange={(value) => {
            setWhat(value)
            setSaved(false)
          }}
        />
        <Field
          id="celebration-who"
          label="Who's there?"
          value={whoWith}
          placeholder="The friends who showed up on the hard days, both sets of grandparents, my whole team"
          onChange={(value) => {
            setWhoWith(value)
            setSaved(false)
          }}
        />
        <Field
          id="celebration-where"
          label="Where does it happen?"
          value={whereAt}
          placeholder="The rooftop where we practiced, right at golden hour"
          onChange={(value) => {
            setWhereAt(value)
            setSaved(false)
          }}
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            Save the plan
          </Button>
          {saved ? (
            <p className="text-sm font-bold text-primary" role="status">
              Saved. Future you says thanks.
            </p>
          ) : null}
          {failed ? (
            <p className="text-sm font-bold text-destructive" role="status">
              That did not save. Give it another try in a moment.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="font-display text-lg font-semibold">
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={500}
        className="rounded-2xl"
      />
    </div>
  )
}
