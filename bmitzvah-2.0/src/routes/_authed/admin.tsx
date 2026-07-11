import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AdminShell } from '@/components/shell/admin-shell'
import { homePathForRole } from '@/lib/auth/home-path'

export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'admin') throw redirect({ to: homePathForRole(context.user.role) })
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { user } = Route.useRouteContext()
  return (
    <AdminShell user={user}>
      <Outlet />
    </AdminShell>
  )
}
