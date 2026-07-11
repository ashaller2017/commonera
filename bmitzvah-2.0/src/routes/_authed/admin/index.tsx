import { createFileRoute } from '@tanstack/react-router'
import { useTemplate } from '@/hooks/use-templates'
import type { TemplateKey } from '@/lib/content/types'
import { fetchAdminStatsFn } from '@/utils/admin.functions'

export const Route = createFileRoute('/_authed/admin/')({
  loader: () => fetchAdminStatsFn(),
  component: AdminDashboard,
})

function AdminDashboard() {
  const stats = Route.useLoaderData()

  if (!stats) {
    return <p className="text-muted-foreground">Couldn't load the dashboard. Try again.</p>
  }

  const tiles = [
    { label: 'Families', value: stats.families },
    { label: 'Children', value: stats.kids },
    { label: 'Journeys started', value: stats.journeys },
    { label: 'Journeys completed', value: stats.completedJourneys },
    { label: 'Interest leads', value: stats.interestLeads },
  ]
  const maxCount = Math.max(1, ...stats.templatePopularity.map((t) => t.count))

  return (
    <div className="mx-auto max-w-4xl">
      <header className="py-2">
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">How families are using the platform right now.</p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-display text-3xl font-semibold tabular-nums">{tile.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{tile.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Popular paths</h2>
        {stats.templatePopularity.length === 0 ? (
          <p className="mt-2 text-muted-foreground">No journeys yet.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {stats.templatePopularity.map((row) => (
              <TemplatePopularityRow
                key={row.template}
                template={row.template}
                count={row.count}
                max={maxCount}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function TemplatePopularityRow({
  template,
  count,
  max,
}: {
  template: TemplateKey
  count: number
  max: number
}) {
  const meta = useTemplate(template)
  return (
    <li className="flex items-center gap-3">
      <span className="w-40 shrink-0 truncate text-sm font-bold">
        {meta ? `${meta.emoji} ${meta.name}` : template}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.round((count / max) * 100)}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
        {count}
      </span>
    </li>
  )
}
