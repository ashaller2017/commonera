import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('font-display text-xl font-semibold tracking-tight', className)}
      aria-label="B'Mitzvah 2.0 home"
    >
      B'Mitzvah <span className="text-accent-deep">2.0</span>
    </Link>
  )
}
