import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="scroll-mt-[70px]">
      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center text-xs uppercase tracking-[0.1em] text-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-foreground/60">
        &copy; {year} {settings?.name || 'Spencer Heaphy'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
          {settings?.socialLinks?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
