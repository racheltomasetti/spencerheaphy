import Link from 'next/link'
import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-xs uppercase tracking-[0.1em] text-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>
          <Link href="/creator" className="text-inherit no-underline">
            &copy; {year} {settings?.name || 'Spencer Heaphy'}
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-6">
          {settings?.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`} className="hover:opacity-70">
              {settings.contactEmail}
            </a>
          )}
          {settings?.socialLinks?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
