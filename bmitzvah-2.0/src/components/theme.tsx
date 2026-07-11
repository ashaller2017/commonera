import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Switch between light and dark mode"
      className={className}
      onClick={() =>
        setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
      }
    >
      <Sun className="dark:hidden" aria-hidden />
      <Moon className="hidden dark:block" aria-hidden />
    </Button>
  )
}
