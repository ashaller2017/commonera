import { createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { LockedDirectory } from '@/components/locked-directory'
import { type KidFavoriteRow, ProviderDirectory } from '@/components/provider-directory'
import type { Provider } from '@/lib/content/types'
import { fetchProvidersFn } from '@/utils/content.functions'
import { fetchDirectoryAccessFn, fetchFavoritesFn, fetchKidsFn } from '@/utils/journeys.functions'
import type { KidSummary } from '@/utils/journeys.server'

export const Route = createFileRoute('/_authed/parent/guides')({
  loader: async () => {
    const [access, providers, kids, favorites] = await Promise.all([
      fetchDirectoryAccessFn(),
      fetchProvidersFn(),
      fetchKidsFn(),
      fetchFavoritesFn(),
    ])
    return { access, providers, kids, favorites }
  },
  component: ParentGuidesPage,
})

function ParentGuidesPage() {
  const { access, providers, kids, favorites } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  if (!access.unlocked) return <LockedDirectory access={access} viewer="parent" />
  return (
    <div className="flex flex-col gap-10">
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
  const nameByKey = new Map(providers.map((p) => [p.key, p.name]))
  const byKid = kids
    .map((kid) => ({
      kid,
      guides: favorites
        .filter((f) => f.childId === kid.id)
        .map((f) => nameByKey.get(f.providerKey))
        .filter((name): name is string => Boolean(name)),
    }))
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
              <div className="flex flex-wrap gap-2">
                {guides.map((guide) => (
                  <span
                    key={guide}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground"
                  >
                    <Heart className="size-3.5 fill-current text-accent-deep" aria-hidden />
                    {guide}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
