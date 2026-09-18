import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="scroll-mt-[70px] border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center text-[13px] leading-[1.5] text-foreground/72 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:text-left">
        <p>
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
