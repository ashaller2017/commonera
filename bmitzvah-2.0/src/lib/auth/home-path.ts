import type { AppRole } from '@/lib/auth/types'

// The app "home" for each role: where post-auth redirects land and where
// "open my app" links point. Kept in one place so adding a role updates every
// redirect at once.
export function homePathForRole(role: AppRole): '/admin' | '/parent' | '/kid' {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'parent':
      return '/parent'
    case 'child':
      return '/kid'
  }
}
