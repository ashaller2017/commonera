import type { LinkProps } from '@tanstack/react-router'
import { Link, useRouterState } from '@tanstack/react-router'
import { BookOpen, Handshake, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavUser } from '@/components/shell/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Wordmark } from '@/components/wordmark'
import type { AuthUser } from '@/lib/auth/types'

type ParentNavItem = {
  readonly to: LinkProps['to']
  readonly label: string
  readonly icon: typeof Users
}

const PARENT_NAV: readonly ParentNavItem[] = [
  { to: '/parent', label: 'Family', icon: Users },
  { to: '/parent/guides', label: 'Guides', icon: Handshake },
  { to: '/stories', label: 'Stories', icon: BookOpen },
]

export function ParentShell({ user, children }: { user: AuthUser; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="px-2 pt-1">
            <Wordmark />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your family</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {PARENT_NAV.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={pathname === item.to}
                      render={<Link to={item.to} />}
                    >
                      <item.icon aria-hidden />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 px-4 pb-12 sm:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
