import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ProviderDirectory } from '@/components/provider-directory'
import { fetchProvidersFn } from '@/utils/content.functions'
import { fetchFavoritesFn } from '@/utils/journeys.functions'

export const Route = createFileRoute('/_authed/kid/guides')({
  loader: async () => {
    const [providers, favorites] = await Promise.all([fetchProvidersFn(), fetchFavoritesFn()])
    return { providers, favorites }
  },
  component: KidGuidesPage,
})

function KidGuidesPage() {
  const { providers, favorites } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  // The chosen path drives the recommendation; it is already loaded by the kid
  // layout, so read it from there rather than refetching the whole journey.
  // Before the quiz there is no path yet and the directory just shows everyone.
  const journey = useLoaderData({ from: '/_authed/kid' })
  return (
    <ProviderDirectory
      user={user}
      providers={providers}
      viewer={{
        kind: 'kid',
        template: journey?.template ?? null,
        favoriteKeys: favorites.map((f) => f.providerKey),
      }}
    />
  )
}
