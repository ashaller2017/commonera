import { useMutation } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { TemplateChip } from '@/components/template-chip'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { VerifiedBadge } from '@/components/verified-badge'
import { useTemplates } from '@/hooks/use-templates'
import type { AuthUser } from '@/lib/auth/types'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { Provider, ProviderFormat, TemplateKey } from '@/lib/content/types'
import { cn } from '@/lib/utils'
import { expressInterestFn } from '@/utils/journeys.functions'

const FORMAT_LABEL: Record<ProviderFormat, string> = {
  'in-person': 'In person',
  virtual: 'Online',
  hybrid: 'In person or online',
}

const ORG_LABEL: Record<Provider['orgType'], string> = {
  independent: 'Independent guide',
  organization: 'Organization',
}

const PILL_BASE =
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

export function ProviderDirectory({
  user,
  providers,
}: {
  user: AuthUser
  providers: readonly Provider[]
}) {
  const templates = useTemplates()
  const [filter, setFilter] = useState<TemplateKey | null>(null)
  const visible = filter ? providers.filter((p) => p.templates.includes(filter)) : providers

  return (
    <div className="flex flex-col gap-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Guides who get it</h1>
        <p className="text-muted-foreground">
          Real people, educators, artists, mentors, and tradition-keepers, matched to the shape of
          your journey. Every guide is vetted before they join, so you can reach out knowing someone
          already checked.
        </p>
      </header>

      <section className="flex flex-col gap-3" aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="text-sm font-bold text-muted-foreground">
          Filter by path
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filter === null}
            onClick={() => setFilter(null)}
            className={cn(
              PILL_BASE,
              filter === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
            )}
          >
            All paths
          </button>
          {templates.map((template) => {
            const palette = TEMPLATE_PALETTE[template.key]
            const selected = filter === template.key
            return (
              <button
                key={template.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(selected ? null : template.key)}
                className={cn(
                  PILL_BASE,
                  selected ? palette.solid : cn(palette.soft, palette.softText, 'hover:opacity-80'),
                )}
              >
                <span aria-hidden>{template.emoji}</span>
                {template.name}
              </button>
            )
          })}
        </div>
      </section>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-secondary/60 px-5 py-6 text-sm text-muted-foreground">
          No guides on this path yet. More are joining the network, try another path for now.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {visible.map((provider) => (
            <ProviderPanel key={provider.key} provider={provider} user={user} />
          ))}
        </div>
      )}

      <footer className="border-t pt-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          These profiles are simulated for this prototype. The vetting network behind them is what
          Common Era is building for real.
        </p>
      </footer>
    </div>
  )
}

function ProviderPanel({ provider, user }: { provider: Provider; user: AuthUser }) {
  const primary = provider.templates[0]
  const palette = primary ? TEMPLATE_PALETTE[primary] : null
  const tint = palette?.soft ?? 'bg-secondary'
  const textClass = palette?.softText ?? 'text-secondary-foreground'

  return (
    <article className="overflow-hidden rounded-3xl border">
      <div className="grid lg:grid-cols-[2fr_3fr]">
        <div className={cn('flex flex-col gap-5 p-6 sm:p-8', tint)}>
          <div className="flex flex-col gap-2">
            <h2 className={cn('font-display text-2xl font-semibold sm:text-3xl', textClass)}>
              {provider.name}
            </h2>
            <p className={cn('text-sm opacity-90', textClass)}>{provider.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <VerifiedBadge verified={provider.verified} />
            <span className={cn('text-xs font-bold opacity-80', textClass)}>
              {ORG_LABEL[provider.orgType]}
            </span>
          </div>
          <dl className="flex flex-col gap-2">
            <Fact label="Format" value={FORMAT_LABEL[provider.format]} textClass={textClass} />
            <Fact label="Where" value={provider.location} textClass={textClass} />
            {/* Pricing is stripped server-side for kids; only render it when present. */}
            {provider.priceRange ? (
              <Fact label="Range" value={provider.priceRange} textClass={textClass} />
            ) : null}
          </dl>
          <div className="flex flex-wrap gap-2">
            {provider.templates.map((template) => (
              <TemplateChip key={template} template={template} variant="solid" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <p className="text-sm">{provider.overview}</p>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              How they work
            </p>
            <p className="text-sm">{provider.approach}</p>
          </div>
          <div className="flex flex-col gap-3">
            {provider.testimonials.map((testimonial) => (
              <figure
                key={testimonial.attribution}
                className="rounded-2xl bg-secondary/50 px-4 py-3"
              >
                <blockquote className="text-sm italic">"{testimonial.quote}"</blockquote>
                <figcaption className="mt-1.5 text-xs font-bold text-muted-foreground">
                  {testimonial.attribution}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-auto pt-1">
            <ExpressInterestDialog provider={provider} user={user} />
          </div>
        </div>
      </div>
    </article>
  )
}

function Fact({ label, value, textClass }: { label: string; value: string; textClass: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn('text-xs font-bold uppercase tracking-wide opacity-70', textClass)}>
        {label}
      </dt>
      <dd className={cn('text-right text-sm font-bold', textClass)}>{value}</dd>
    </div>
  )
}

function ExpressInterestDialog({ provider, user }: { provider: Provider; user: AuthUser }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.displayName)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const nameId = useId()
  const emailId = useId()
  const emailHelpId = useId()
  const noteId = useId()

  const mutation = useMutation({
    mutationFn: (input: { providerKey: string; name: string; email: string; note: string }) =>
      expressInterestFn({ data: input }),
  })

  const submitted = mutation.data?.ok === true

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      mutation.reset()
      setName(user.displayName)
      setEmail('')
      setNote('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>Express interest</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">You're on the list</DialogTitle>
              <DialogDescription>
                You're on {provider.name}'s list. They'll reach out by email.
              </DialogDescription>
            </DialogHeader>
            <DialogClose render={<Button variant="secondary" />}>Done</DialogClose>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Reach out to {provider.name}
              </DialogTitle>
              <DialogDescription>
                Tell them a little about you and they'll follow up by email. No commitment yet.
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (name.trim().length === 0 || email.trim().length === 0) return
                mutation.mutate({
                  providerKey: provider.key,
                  name: name.trim(),
                  email: email.trim(),
                  note: note.trim(),
                })
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={nameId}>Your name</Label>
                <Input
                  id={nameId}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={80}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={emailId}>Email to reach you</Label>
                <Input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  aria-describedby={emailHelpId}
                  placeholder="you@example.com"
                />
                <p id={emailHelpId} className="text-xs text-muted-foreground">
                  A grown-up's email works great here.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={noteId}>Anything you want them to know? (optional)</Label>
                <Textarea
                  id={noteId}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="What you're hoping to do, questions you have, anything."
                />
              </div>
              {mutation.data && !mutation.data.ok ? (
                <p className="text-sm font-bold text-destructive">
                  {mutation.data.error === 'locked'
                    ? 'Guides open up once the journey is complete.'
                    : "That didn't go through. Give it another try in a moment."}
                </p>
              ) : null}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Send my interest'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
