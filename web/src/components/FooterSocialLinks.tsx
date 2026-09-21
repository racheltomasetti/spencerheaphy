'use client'

import {useState} from 'react'
import {BoldLink} from '@/components/BoldLink'
import type {SiteSettings} from '@/sanity/lib/types'

type SocialLinks = NonNullable<SiteSettings['socialLinks']>

export function FooterSocialLinks({links}: {links: SocialLinks}) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null)

  return (
    <div
      className="flex flex-nowrap items-center justify-center gap-6 lg:justify-end"
      onMouseLeave={() => setActiveUrl(null)}
    >
      {links.map((link) => (
        <BoldLink
          key={link.url}
          href={link.url}
          label={link.platform}
          external
          weight={500}
          className="transition-colors hover:text-foreground"
          emphasized={activeUrl === link.url}
          onActivate={() => setActiveUrl(link.url)}
          onDeactivate={() => setActiveUrl(null)}
        />
      ))}
    </div>
  )
}
