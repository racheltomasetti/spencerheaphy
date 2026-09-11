import type {Metadata} from 'next'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'

export const metadata: Metadata = {
  title: 'Connect — Spencer Heaphy',
}

export default async function ConnectPage() {
  const settings = await getSiteSettings()

  return (
    <section className="flex flex-1 flex-col justify-center gap-7 px-8 pt-[78px] pb-[90px]">
      <h2 className="text-[clamp(26px,3.4vw,46px)] leading-none font-normal tracking-[-0.025em]">
        Connect
      </h2>
      <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/70">
        {settings?.contactEmail && (
          <a
            href={`mailto:${settings.contactEmail}`}
            className="w-fit transition-colors hover:text-foreground"
          >
            {settings.contactEmail}
          </a>
        )}
        {settings?.socialLinks?.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit transition-colors hover:text-foreground"
          >
            {link.platform}
          </a>
        ))}
      </div>
    </section>
  )
}
