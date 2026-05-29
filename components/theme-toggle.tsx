'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

const toggleShell = cn(
  'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
  'border border-foreground/10 bg-background/50 backdrop-blur-xl',
  'shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--foreground)_10%,transparent),0_1px_2px_0_color-mix(in_oklch,var(--foreground)_6%,transparent)]',
)

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  if (!mounted) {
    return (
      <div
        className={cn(toggleShell, className)}
        aria-hidden
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim'}
      className={cn(
        toggleShell,
        'group transition-all duration-300 ease-out',
        'hover:border-foreground/20 hover:bg-background/70',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          'absolute h-[1.15rem] w-[1.15rem] text-foreground/90',
          'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isDark
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100 group-hover:rotate-12 group-hover:scale-110',
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          'absolute h-[1.15rem] w-[1.15rem] text-foreground/90',
          'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isDark
            ? 'scale-100 rotate-0 opacity-100 group-hover:-rotate-12 group-hover:scale-110'
            : 'scale-0 -rotate-90 opacity-0',
        )}
      />
    </button>
  )
}
