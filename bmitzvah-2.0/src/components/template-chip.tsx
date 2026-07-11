import { useTemplate } from '@/hooks/use-templates'
import { TEMPLATE_PALETTE } from '@/lib/content/palette'
import type { TemplateKey } from '@/lib/content/types'
import { cn } from '@/lib/utils'

export function TemplateChip({
  template,
  variant = 'soft',
  className,
}: {
  template: TemplateKey
  variant?: 'soft' | 'solid'
  className?: string
}) {
  const meta = useTemplate(template)
  const palette = TEMPLATE_PALETTE[template]
  if (!meta) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold',
        variant === 'solid' ? palette.solid : cn(palette.soft, palette.softText),
        className,
      )}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.name}
    </span>
  )
}
