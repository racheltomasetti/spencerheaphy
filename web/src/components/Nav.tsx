'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

const NAV_LINKS = [
  {href: '/selected-work', label: 'Selected Work'},
  {href: '/bio', label: 'Bio'},
  {href: '/creator', label: 'Creator'},
]

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          aria-label="Spencer Heaphy, home"
          aria-current={pathname === '/' ? 'page' : undefined}
          className="font-serif text-sm font-medium uppercase tracking-[0.2em] text-foreground"
        >
          Spencer Heaphy
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-100 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
