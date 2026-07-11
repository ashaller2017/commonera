import type { LinkProps } from '@tanstack/react-router'
import { Link, useRouterState } from '@tanstack/react-router'
import { Handshake, Lock, Map as MapIcon, PartyPopper, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavUser } from '@/components/shell/nav-user'
import { TemplateChip } from '@/components/template-chip'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Wordmark } from '@/components/wordmark'
import type { AuthUser } from '@/lib/auth/types'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import { journeyProgress } from '@/lib/journey/progress'
import { cn } from '@/lib/utils'
import type { JourneyView } from '@/utils/journeys.server'

type KidNavItem = {
  readonly to: LinkProps['to']
  readonly label: string
  readonly icon: typeof MapIcon
}

const KID_NAV: readonly KidNavItem[] = [
  { to: '/kid', label: 'My journey', icon: MapIcon },
  { to: '/kid/celebration', label: 'Celebration', icon: PartyPopper },
  { to: '/kid/card', label: 'Journey card', icon: Share2 },
]

export function KidShell({
  user,
  journey,
  children,
}: {
  user: AuthUser
  journey: JourneyView | null
  children: ReactNode
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const progress = journey ? journeyProgress(journey.milestones.map((m) => m.status)) : null
  const guidesUnlocked = progress !== null && progress.total > 0 && progress.done === progress.total
  const palette = journey ? TEMPLATE_PALETTE[journey.template] : null

  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="px-2 pt-1">
            <Wordmark />
          </div>
          {journey && palette ? (
            <Link
              to="/kid"
              className={cn('mx-1 mt-2 flex flex-col gap-2 rounded-2xl p-3', palette.soft)}
            >
              <TemplateChip template={journey.template} variant="solid" className="self-start" />
              <span
                className={cn('font-display text-lg font-semibold leading-tight', palette.softText)}
              >
                {journey.name}
              </span>
              {progress ? (
                <span className={cn('text-xs font-bold', palette.softText)}>
                  {progress.done} of {progress.total} milestones
                </span>
              ) : null}
            </Link>
          ) : null}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {KID_NAV.map((item) => (
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
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === '/kid/guides'}
                    render={<Link to="/kid/guides" />}
                  >
                    <Handshake aria-hidden />
                    Guides
                  </SidebarMenuButton>
                  {guidesUnlocked ? null : (
                    <SidebarMenuBadge aria-label="Locked until your journey is complete">
                      <Lock className="size-3.5" aria-hidden />
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
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
