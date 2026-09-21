import {StandaloneBoldLink} from '@/components/BoldLink'
import {FooterSocialLinks} from '@/components/FooterSocialLinks'
import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="scroll-mt-(--nav-h)">
      <div className="flex flex-col-reverse items-center gap-4 px-(--edge) py-10 text-center text-xs uppercase tracking-[0.1em] text-foreground/60 lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <p className="text-foreground/60 lg:whitespace-nowrap">
        &copy; {year} {settings?.name || 'Spencer Heaphy'}
        </p>
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6">
          {settings?.contactEmail && (
            <StandaloneBoldLink
              href={`mailto:${settings.contactEmail}`}
              label={settings.contactEmail}
              external
              weight={500}
              className="transition-colors hover:text-foreground"
            />
          )}
          {settings?.socialLinks && <FooterSocialLinks links={settings.socialLinks} />}
        </div>
      </div>
    </footer>
  )
}
