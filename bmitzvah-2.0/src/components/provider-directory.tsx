import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Heart, Sparkles } from 'lucide-react'
import { type ReactNode, useId, useState } from 'react'
import { TEMPLATE_SCENES } from '@/components/quiz/scenes'
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
import { splitByRecommendation } from '@/lib/providers/recommend'
import { cn } from '@/lib/utils'
import { expressInterestFn, setFavoriteFn } from '@/utils/journeys.functions'
import type { KidSummary } from '@/utils/journeys.server'

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

// A kid taps a heart ("I'm interested") on a guide; a parent sees those picks
// and reaches out. Both render the same catalog with a different panel footer.
export type KidFavoriteRow = { readonly childId: string; readonly providerKey: string }

type DirectoryViewer =
  | {
      readonly kind: 'kid'
      readonly template: TemplateKey | null
      readonly favoriteKeys: readonly string[]
    }
  | {
      readonly kind: 'parent'
      readonly kids: readonly KidSummary[]
      readonly favorites: readonly KidFavoriteRow[]
    }

export function ProviderDirectory({
  user,
  providers,
  viewer,
}: {
  user: AuthUser
  providers: readonly Provider[]
  viewer: DirectoryViewer
}) {
  const templates = useTemplates()
  const [filter, setFilter] = useState<TemplateKey | null>(null)

  // Recommendation is driven by the journey path(s): the kid's own, or the union
  // of the parent's kids' paths.
  const recommendedTemplates =
    viewer.kind === 'kid'
      ? viewer.template
        ? [viewer.template]
        : []
      : [...new Set(viewer.kids.flatMap((k) => (k.journey ? [k.journey.template] : [])))]

  // Parent only: the names of the kids who favorited each guide, in pick order.
  const interestedNames = new Map<string, string[]>()
  if (viewer.kind === 'parent') {
    for (const fav of viewer.favorites) {
      const kid = viewer.kids.find((k) => k.id === fav.childId)
      if (!kid) continue
      const names = interestedNames.get(fav.providerKey) ?? []
      if (!names.includes(kid.displayName)) names.push(kid.displayName)
      interestedNames.set(fav.providerKey, names)
    }
  }

  const footerFor = (provider: Provider): ReactNode => {
    if (viewer.kind === 'kid') {
      return (
        <FavoriteButton
          providerKey={provider.key}
          favorited={viewer.favoriteKeys.includes(provider.key)}
        />
      )
    }
    return (
      <div className="flex flex-col gap-3">
        <InterestedBy names={interestedNames.get(provider.key) ?? []} />
        <ExpressInterestDialog provider={provider} user={user} />
      </div>
    )
  }

  const visible = filter ? providers.filter((p) => p.templates.includes(filter)) : providers
  // Section into recommended + rest only on the unfiltered view; an active filter
  // shows a single flat list.
  const { recommended, rest } =
    filter === null
      ? splitByRecommendation(visible, recommendedTemplates)
      : { recommended: [] as readonly Provider[], rest: visible }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Guides who get it</h1>
        <p className="text-muted-foreground">
          {viewer.kind === 'kid'
            ? 'Real people, educators, artists, mentors, and tradition-keepers, matched to the shape of your journey. Tap the heart on any you like: your parent sees your picks and takes it from there.'
            : "Real people, educators, artists, mentors, and tradition-keepers, matched to your kid's journey. See what they're drawn to, then reach out to anyone you like. Every guide is vetted before they join."}
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
      ) : recommended.length > 0 ? (
        <div className="flex flex-col gap-10">
          <ProviderGroup
            title={
              viewer.kind === 'kid' ? 'Recommended for your path' : 'Recommended for your family'
            }
            hint="Guides who work in the shape of this journey."
          >
            {recommended.map((provider) => (
              <ProviderPanel
                key={provider.key}
                provider={provider}
                recommended
                showArt={viewer.kind === 'kid'}
                footer={footerFor(provider)}
              />
            ))}
          </ProviderGroup>
          {rest.length > 0 ? (
            <ProviderGroup title="More guides">
              {rest.map((provider) => (
                <ProviderPanel
                  key={provider.key}
                  provider={provider}
                  showArt={viewer.kind === 'kid'}
                  footer={footerFor(provider)}
                />
              ))}
            </ProviderGroup>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {rest.map((provider) => (
            <ProviderPanel
              key={provider.key}
              provider={provider}
              showArt={viewer.kind === 'kid'}
              footer={footerFor(provider)}
            />
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

function ProviderGroup({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function ProviderPanel({
  provider,
  recommended,
  footer,
  showArt,
}: {
  provider: Provider
  recommended?: boolean
  footer: ReactNode
  // Kid mode only: the primary-path scene as a patch/badge above the name
  // (the tested "Wilderness Torah" capsule look). Parent rendering stays as-is.
  showArt?: boolean
}) {
  const primary = provider.templates[0]
  const palette = primary ? TEMPLATE_PALETTE[primary] : null
  const tint = palette?.soft ?? 'bg-secondary'
  const textClass = palette?.softText ?? 'text-secondary-foreground'
  const PatchArt = showArt && primary ? TEMPLATE_SCENES[primary] : null

  return (
    <article className="overflow-hidden rounded-3xl border">
      <div className="grid lg:grid-cols-[2fr_3fr]">
        <div className={cn('flex flex-col gap-5 p-6 sm:p-8', tint)}>
          {recommended ? (
            <span className="inline-flex items-center gap-1 self-start rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
              <Sparkles className="size-3" aria-hidden />
              Recommended
            </span>
          ) : null}
          {PatchArt ? <PatchArt className="size-20" /> : null}
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
          <div className="mt-auto pt-1">{footer}</div>
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

// The kid's whole footer: a heart toggle, no contact form. Toggling invalidates
// the route so the loader re-reads favorites (matching the milestone-toggle
// pattern elsewhere).
function FavoriteButton({ providerKey, favorited }: { providerKey: string; favorited: boolean }) {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: (next: boolean) => setFavoriteFn({ data: { providerKey, favorited: next } }),
    onSuccess: async (result) => {
      if (result.ok) await router.invalidate()
    },
  })
  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant={favorited ? 'default' : 'outline'}
        aria-pressed={favorited}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(!favorited)}
        className="self-start"
      >
        <Heart className={cn('size-4', favorited && 'fill-current')} aria-hidden />
        {favorited ? 'Interested' : "I'm interested"}
      </Button>
      {mutation.data && !mutation.data.ok ? (
        <p className="text-xs font-bold text-destructive">
          That didn't save. Give it another try in a moment.
        </p>
      ) : null}
    </div>
  )
}

// Shown to the parent on a guide their kid favorited.
function InterestedBy({ names }: { names: readonly string[] }) {
  if (names.length === 0) return null
  const label =
    names.length === 1
      ? `${names[0]} is interested`
      : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} are interested`
  return (
    <div className="flex items-center gap-1.5 text-sm font-bold text-accent-deep">
      <Heart className="size-4 fill-current" aria-hidden />
      <span>{label}</span>
    </div>
  )
}

// The lead form is the parent's to send. Server + RLS both require a parent, so
// this dialog only ever renders on the parent side of the directory.
function ExpressInterestDialog({ provider, user }: { provider: Provider; user: AuthUser }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.displayName)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const nameId = useId()
  const emailId = useId()
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
      <DialogTrigger render={<Button />}>Reach out</DialogTrigger>
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
                Tell them a little about your family and they'll follow up by email. No commitment
                yet.
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
                  placeholder="you@example.com"
                />
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
                  That didn't go through. Give it another try in a moment.
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
