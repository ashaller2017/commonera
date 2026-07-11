import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { LockedDirectory } from '@/components/locked-directory'
import { ProviderDirectory } from '@/components/provider-directory'
import { fetchProvidersFn } from '@/utils/content.functions'
import { fetchDirectoryAccessFn, fetchFavoritesFn } from '@/utils/journeys.functions'

export const Route = createFileRoute('/_authed/kid/guides')({
  loader: async () => {
    const [access, providers, favorites] = await Promise.all([
      fetchDirectoryAccessFn(),
      fetchProvidersFn(),
      fetchFavoritesFn(),
    ])
    return { access, providers, favorites }
  },
  component: KidGuidesPage,
})

function KidGuidesPage() {
  const { access, providers, favorites } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  // The chosen path drives the recommendation; it is already loaded by the kid
  // layout, so read it from there rather than refetching the whole journey.
  const journey = useLoaderData({ from: '/_authed/kid' })
  if (!access.unlocked) return <LockedDirectory access={access} viewer="child" />
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
