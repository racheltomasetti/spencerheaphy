import {FooterSocialLinks} from '@/components/FooterSocialLinks'
import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="scroll-mt-(--nav-h)">
      <div className="flex flex-col-reverse items-center gap-4 px-(--edge) py-10 text-center text-xs uppercase tracking-[0.1em] text-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-foreground/60">
        &copy; {year} {settings?.name || 'Spencer Heaphy'}
        </p>
        {settings?.socialLinks && <FooterSocialLinks links={settings.socialLinks} />}
        {settings?.contactEmail && (
          <a
            href={`mailto:${settings.contactEmail}`}
            className="transition-colors hover:text-foreground sm:hidden"
          >
            {settings.contactEmail}
          </a>
        )}
      </div>
    </footer>
  )
}
