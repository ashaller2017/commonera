import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin/content/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin/content/templates' })
  },
})
