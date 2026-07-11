import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { to: '/admin/content/templates', label: 'Templates' },
  { to: '/admin/content/milestones', label: 'Milestones' },
  { to: '/admin/content/prompts', label: 'Activity prompts' },
  { to: '/admin/content/providers', label: 'Providers' },
  { to: '/admin/content/quiz', label: 'Quiz' },
  { to: '/admin/content/stories', label: 'Stories' },
  { to: '/admin/content/setup', label: 'Setup options' },
] as const

export const Route = createFileRoute('/_authed/admin/content')({
  component: ContentLayout,
})

function ContentLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  return (
    <div className="mx-auto max-w-4xl">
      <header className="py-2">
        <h1 className="font-display text-3xl font-semibold">Content</h1>
        <p className="mt-1 text-muted-foreground">
          Edit the catalog. Changes go live for families immediately.
        </p>
      </header>
      <nav className="mt-4 flex flex-wrap gap-2 border-border border-b pb-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className={cn(
              'rounded-full px-3 py-1.5 font-bold text-sm',
              pathname === section.to
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
            )}
          >
            {section.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}
