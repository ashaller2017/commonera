import { BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

// The vetting badge from the PRD. Unverified providers get an honest
// "vetting in progress" state so the badge reads as a real system.
export function VerifiedBadge({ verified, className }: { verified: boolean; className?: string }) {
  if (!verified) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.5 text-xs font-bold text-muted-foreground',
          className,
        )}
      >
        Vetting in progress
      </span>
    )
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary',
        className,
      )}
    >
      <BadgeCheck className="size-3.5" aria-hidden />
      Verified guide
    </span>
  )
}
