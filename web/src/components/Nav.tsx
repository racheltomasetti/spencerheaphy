import Link from 'next/link'

const NAV_LINKS = [
  {href: '/#work', label: 'Selected Work'},
  {href: '/#bio', label: 'Bio'},
]

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          aria-label="Spencer Heaphy, home"
          className="font-serif text-sm font-medium uppercase tracking-[0.2em] text-foreground"
        >
          Spencer Heaphy
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.15em] text-foreground/60 transition-opacity hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
