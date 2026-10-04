import {StandaloneBoldLink} from '@/components/BoldLink'
import {FooterSocialLinks} from '@/components/FooterSocialLinks'
import type {SiteSettings} from '@/sanity/lib/types'

export function SiteFooter({settings}: {settings: SiteSettings | null}) {
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="scroll-mt-(--nav-h)">
      <div className="flex flex-nowrap items-center justify-between gap-3 whitespace-nowrap px-(--edge) pt-10 pb-6 text-[10px] uppercase tracking-[0.08em] text-foreground/60 max-[359px]:gap-2 max-[359px]:text-[9px] max-[359px]:tracking-normal sm:text-xs sm:tracking-[0.1em] md:grid md:grid-cols-[1fr_auto_1fr]">
        <p className="hidden text-foreground/60 md:block md:justify-self-start">
          &copy; {year}
          <span className="hidden sm:inline"> {settings?.name || 'Spencer Heaphy'}</span>
        </p>
        {settings?.contactEmail ? (
          <StandaloneBoldLink
            href={`mailto:${settings.contactEmail}`}
            label={settings.contactEmail}
            external
            weight={500}
            className="transition-colors hover:text-foreground md:justify-self-center"
          />
        ) : (
          <span />
        )}
        {settings?.socialLinks && (
          <div className="md:justify-self-end">
            <FooterSocialLinks links={settings.socialLinks} />
          </div>
        )}
      </div>
    </footer>
  )
}
