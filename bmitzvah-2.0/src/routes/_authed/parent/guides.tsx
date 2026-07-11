import { createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { GuideHeartChips, kidFavoritedGuides } from '@/components/kid-status'
import { type KidFavoriteRow, ProviderDirectory } from '@/components/provider-directory'
import type { Provider } from '@/lib/content/types'
import { fetchProvidersFn } from '@/utils/content.functions'
import { fetchFavoritesFn, fetchKidsFn } from '@/utils/journeys.functions'
import type { KidSummary } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/parent/guides')({
  loader: async () => {
    const [providers, kids, favorites] = await Promise.all([
      fetchProvidersFn(),
      fetchKidsFn(),
      fetchFavoritesFn(),
    ])
    return { providers, kids, favorites }
  },
  component: ParentGuidesPage,
})

function ParentGuidesPage() {
  const { providers, kids, favorites } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  return (
    <div className="flex flex-col gap-10">
      <p className="text-muted-foreground">
        A guide is a facilitator through the journey, not a finish-line reward: someone who keeps
        your kid on track, helps with meaning-making, or builds the wild idea with them. Bring one
        in whenever it helps — or don't. Going it alone is a fine plan too.
      </p>
      <KidInterestSummary kids={kids} favorites={favorites} providers={providers} />
      <ProviderDirectory
        user={user}
        providers={providers}
        viewer={{ kind: 'parent', kids, favorites }}
      />
    </div>
  )
}

// The at-a-glance answer to "what did my kid pick?" A parent lands here after a
// kid finishes; the per-guide badges below repeat this inline, but the summary
// gives the whole shortlist without scanning.
function KidInterestSummary({
  kids,
  favorites,
  providers,
}: {
  kids: readonly KidSummary[]
  favorites: readonly KidFavoriteRow[]
  providers: readonly Provider[]
}) {
  const byKid = kids
    .map((kid) => ({ kid, guides: kidFavoritedGuides(kid.id, favorites, providers) }))
    .filter((row) => row.guides.length > 0)

  return (
    <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Heart className="size-5 fill-current text-accent-deep" aria-hidden />
        <h2 className="font-display text-2xl font-semibold">Your kids' picks</h2>
      </div>
      {byKid.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          When your kids tap "I'm interested" on a guide, it shows up here so you can reach out on
          their behalf.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {byKid.map(({ kid, guides }) => (
            <li key={kid.id} className="flex flex-col gap-2">
              <p className="text-sm font-bold">{kid.displayName} is interested in</p>
              <GuideHeartChips guides={guides} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
