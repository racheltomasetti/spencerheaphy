'use client'

import {useState} from 'react'
import type {IconType} from 'react-icons'
import {FaLinkedin, FaYoutube} from 'react-icons/fa6'
import {RiInstagramFill} from 'react-icons/ri'
import {BoldLink, useRestOnReturn} from '@/components/BoldLink'
import type {SiteSettings} from '@/sanity/lib/types'

type SocialLinks = NonNullable<SiteSettings['socialLinks']>

const ICONS: Record<string, IconType> = {
  instagram: RiInstagramFill,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
}

// Words on wide screens. Below that the footer has to fit on one line, so each
// platform shrinks to its icon; one without an icon keeps its name.
export function FooterSocialLinks({links}: {links: SocialLinks}) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  useRestOnReturn(() => setActiveUrl(null))

  return (
    <>
      <div className="flex flex-nowrap items-center justify-end gap-3.5 max-[359px]:gap-2 lg:hidden">
        {links.map((link) => {
          const Icon = ICONS[link.platform.trim().toLowerCase()]
          return (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
              className="-m-1.5 p-1.5 transition-colors hover:text-foreground"
            >
              {Icon ? <Icon aria-hidden className="h-4 w-4" /> : link.platform}
            </a>
          )
        })}
      </div>
      <div
        className="hidden flex-nowrap items-center justify-end gap-6 lg:flex"
        onMouseLeave={() => setActiveUrl(null)}
        onPointerLeave={() => setActiveUrl(null)}
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
    </>
  )
}
