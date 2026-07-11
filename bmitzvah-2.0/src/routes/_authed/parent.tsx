import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ParentShell } from '@/components/shell/parent-shell'
import { homePathForRole } from '@/lib/auth/home-path'

export const Route = createFileRoute('/_authed/parent')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'parent') throw redirect({ to: homePathForRole(context.user.role) })
  },
  component: ParentLayout,
})

function ParentLayout() {
  const { user } = Route.useRouteContext()
  return (
    <ParentShell user={user}>
      <Outlet />
    </ParentShell>
  )
}
