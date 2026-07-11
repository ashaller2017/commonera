import { createFileRoute, redirect } from '@tanstack/react-router'

// Legacy path: the directory now lives inside each role's shell.
export const Route = createFileRoute('/_authed/providers')({
  beforeLoad: ({ context }) => {
    throw redirect({
      to:
        context.user.role === 'admin'
          ? '/admin'
          : context.user.role === 'parent'
            ? '/parent/guides'
            : '/kid/guides',
    })
  },
})
