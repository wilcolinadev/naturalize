'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export const navItems = [
  {
    href: '/protected',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/protected/practice',
    label: 'Practice',
    icon: BookOpen,
  },
  {
    href: '/protected/settings',
    label: 'Settings',
    icon: Settings,
  },
]

export function ProtectedNav() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
} 