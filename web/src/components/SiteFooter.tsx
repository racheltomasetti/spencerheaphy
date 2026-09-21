import {StandaloneBoldLink} from '@/components/BoldLink'
import {FooterSocialLinks} from '@/components/FooterSocialLinks'
import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="scroll-mt-(--nav-h)">
      <div className="flex flex-col items-center gap-4 px-(--edge) py-10 text-center text-xs uppercase tracking-[0.1em] text-foreground/60 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:text-left">
        <p className="order-3 text-foreground/60 lg:order-none lg:justify-self-start lg:whitespace-nowrap">
        &copy; {year} {settings?.name || 'Spencer Heaphy'}
        </p>
        {settings?.contactEmail ? (
          <StandaloneBoldLink
            href={`mailto:${settings.contactEmail}`}
            label={settings.contactEmail}
            external
            weight={500}
            className="order-1 transition-colors hover:text-foreground lg:order-none lg:justify-self-center"
          />
        ) : (
          <span className="hidden lg:block" />
        )}
        {settings?.socialLinks && (
          <div className="order-2 lg:order-none lg:justify-self-end">
            <FooterSocialLinks links={settings.socialLinks} />
          </div>
        )}
      </div>
    </footer>
  )
}
