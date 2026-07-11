import { Heart, PartyPopper } from 'lucide-react'
import type { KidFavoriteRow } from '@/components/provider-directory'
import type { Provider } from '@/lib/content/types'

// At-a-glance per-kid status shared across the parent surfaces (dashboard, the
// per-kid plan page, and the guide directory): the "journey complete" badge and
// the favorited-guide chips a kid's picks resolve to. Kept in one place so the
// gold completion token and the heart chips read identically everywhere.

export function JourneyCompleteBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
      <PartyPopper className="size-3.5" aria-hidden />
      Journey complete
    </span>
  )
}

export type FavoritedGuide = { readonly key: string; readonly name: string }

// A kid's favorited guides, resolved to provider names in the order they were
// favorited. A favorite whose provider has left the catalog drops out.
export function kidFavoritedGuides(
  kidId: string,
  favorites: readonly KidFavoriteRow[],
  providers: readonly Provider[],
): readonly FavoritedGuide[] {
  const nameByKey = new Map(providers.map((p) => [p.key, p.name]))
  return favorites
    .filter((favorite) => favorite.childId === kidId)
    .map((favorite) => {
      const name = nameByKey.get(favorite.providerKey)
      return name ? { key: favorite.providerKey, name } : null
    })
    .filter((guide): guide is FavoritedGuide => guide !== null)
}

export function GuideHeartChips({ guides }: { guides: readonly FavoritedGuide[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {guides.map((guide) => (
        <span
          key={guide.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground"
        >
          <Heart className="size-3.5 fill-current text-accent-deep" aria-hidden />
          {guide.name}
        </span>
      ))}
    </div>
  )
}
