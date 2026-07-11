import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { AuthUser } from '@/lib/auth/types'
import { logoutFn } from '@/utils/auth.functions'

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function NavUser({ user }: { user: AuthUser }) {
  const router = useRouter()
  const logoutMutation = useMutation({
    mutationFn: () => logoutFn(),
    onSuccess: async () => {
      await router.invalidate()
      await router.navigate({ to: '/' })
    },
  })

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
          {initialsOf(user.displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{user.displayName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {user.role === 'admin'
            ? 'CommonEra admin'
            : user.role === 'parent'
              ? 'Parent'
              : `@${user.username ?? ''}`}
        </p>
      </div>
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Log out"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
      >
        <LogOut aria-hidden />
      </Button>
    </div>
  )
}
