import { createFileRoute, Link } from '@tanstack/react-router'
import { useTemplate } from '@/hooks/use-templates'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { TemplateKey } from '@/lib/content/types'
import { fetchAllAccountsFn } from '@/utils/admin.functions'
import type { AdminFamily, AdminKid } from '@/utils/admin.server'

export const Route = createFileRoute('/_authed/admin/accounts/')({
  loader: () => fetchAllAccountsFn(),
  component: AdminAccounts,
})

function AdminAccounts() {
  const families = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-4xl">
      <header className="py-2">
        <h1 className="font-display text-3xl font-semibold">Accounts</h1>
        <p className="mt-1 text-muted-foreground">
          {families.length} {families.length === 1 ? 'family' : 'families'} on the platform.
        </p>
      </header>

      {families.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No families have signed up yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {families.map((family) => (
            <FamilyRow key={family.id} family={family} />
          ))}
        </ul>
      )}
    </div>
  )
}

function FamilyRow({ family }: { family: AdminFamily }) {
  return (
    <li className="rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold">{family.displayName}</p>
          <p className="text-xs text-muted-foreground">
            {family.kids.length} {family.kids.length === 1 ? 'child' : 'children'}
          </p>
        </div>
        <Link
          to="/admin/accounts/$parentId"
          params={{ parentId: family.id }}
          className="shrink-0 text-sm font-bold text-primary underline-offset-4 hover:underline"
        >
          Manage
        </Link>
      </div>
      {family.kids.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
          {family.kids.map((kid) => (
            <KidRow key={kid.id} kid={kid} />
          ))}
        </ul>
      )}
    </li>
  )
}

function KidRow({ kid }: { kid: AdminKid }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-sm font-bold">{kid.displayName}</span>
        {kid.username ? (
          <span className="ml-2 text-xs text-muted-foreground">@{kid.username}</span>
        ) : null}
      </div>
      {kid.journey ? (
        <JourneyChip
          template={kid.journey.template}
          label={kid.journey.name}
          done={kid.journey.milestonesDone}
          total={kid.journey.milestonesTotal}
        />
      ) : (
        <span className="shrink-0 text-xs text-muted-foreground">No journey yet</span>
      )}
    </li>
  )
}

function JourneyChip({
  template,
  label,
  done,
  total,
}: {
  template: TemplateKey
  label: string
  done: number
  total: number
}) {
  const meta = useTemplate(template)
  const palette = TEMPLATE_PALETTE[template]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${palette.soft} ${palette.softText}`}
    >
      {meta ? meta.emoji : null} {label}
      <span className="tabular-nums opacity-80">
        {done}/{total}
      </span>
    </span>
  )
}
