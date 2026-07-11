import { createFileRoute, Outlet } from '@tanstack/react-router'

// Layout for the accounts section: the list lives in accounts.index.tsx and the
// family detail in accounts.$parentId.tsx, both rendered through this Outlet.
export const Route = createFileRoute('/_authed/admin/accounts')({
  component: () => <Outlet />,
})
