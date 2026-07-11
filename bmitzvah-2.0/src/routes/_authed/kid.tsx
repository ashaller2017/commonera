import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { KidShell } from '@/components/shell/kid-shell'
import { homePathForRole } from '@/lib/auth/home-path'
import { fetchOwnJourneyFn } from '@/utils/journeys.functions'

export const Route = createFileRoute('/_authed/kid')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'child') throw redirect({ to: homePathForRole(context.user.role) })
  },
  loader: () => fetchOwnJourneyFn(),
  component: KidLayout,
})

function KidLayout() {
  const { user } = Route.useRouteContext()
  const journey = Route.useLoaderData()
  return (
    <KidShell user={user} journey={journey}>
      <Outlet />
    </KidShell>
  )
}
