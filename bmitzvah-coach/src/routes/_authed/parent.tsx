import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ParentShell } from '@/components/shell/parent-shell'
import { homePathForRole } from '@/lib/auth/home-path'
import { fetchDirectoryAccessFn } from '@/utils/journeys.functions'

export const Route = createFileRoute('/_authed/parent')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'parent') throw redirect({ to: homePathForRole(context.user.role) })
  },
  loader: () => fetchDirectoryAccessFn(),
  component: ParentLayout,
})

function ParentLayout() {
  const { user } = Route.useRouteContext()
  const access = Route.useLoaderData()
  return (
    <ParentShell user={user} access={access}>
      <Outlet />
    </ParentShell>
  )
}
