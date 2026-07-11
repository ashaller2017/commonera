import type { LinkProps } from '@tanstack/react-router'
import { Link, useRouterState } from '@tanstack/react-router'
import { FileText, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
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

type AdminNavItem = {
  readonly to: LinkProps['to']
  readonly label: string
  readonly icon: typeof Users
}

const ADMIN_NAV: readonly AdminNavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/content', label: 'Content', icon: FileText },
  { to: '/admin/accounts', label: 'Accounts', icon: Users },
  { to: '/admin/admins', label: 'Admins', icon: ShieldCheck },
]

// The dashboard is the only exact-match route; the others are section roots, so
// a nested path (e.g. /admin/content/providers) should still light up Content.
function isActive(pathname: string, to: string): boolean {
  return to === '/admin' ? pathname === '/admin' : pathname.startsWith(to)
}

export function AdminShell({ user, children }: { user: AuthUser; children: ReactNode }) {
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
            <SidebarGroupLabel>CommonEra</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_NAV.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      isActive={isActive(pathname, item.to as string)}
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
