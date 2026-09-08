import Image from 'next/image'
import type {SiteSettings} from '@/sanity/lib/types'

const PLACEHOLDER_CLIENT_LINES = ['Client list', 'to come', '—']

export function Bio({settings}: {settings: SiteSettings | null}) {
  const name = settings?.name || 'Spencer Heaphy'

  return (
    <section
      id="bio"
      className="scroll-mt-[70px] border-t border-foreground/14 px-8 pt-[78px] pb-[90px]"
    >
      <div className="grid grid-cols-12 gap-7 lg:items-center">
        <div
          className="relative col-span-12 mx-auto mb-16 w-2/3 overflow-hidden lg:col-span-4 lg:mb-0"
          style={{aspectRatio: '4/5'}}
        >
          <Image
            src="/bio-portrait.jpg"
            alt={`${name} portrait`}
            fill
            sizes="(min-width: 1024px) 22vw, 67vw"
            className="object-cover"
          />
        </div>

        {/* Column 5 is a deliberate empty gutter between portrait and text — only
            meaningful once the two-column split is active at lg and up. */}
        <div className="col-span-12 flex flex-col gap-[34px] lg:col-span-6 lg:col-start-6">
          <h2 className="text-pretty text-[clamp(22px,2.7vw,34px)] leading-[1.24] font-normal tracking-[-0.022em]">
            {name} is a director and creator working across commercial film, music video and
            stills.
          </h2>

          <p className="max-w-[56ch] text-pretty text-base leading-[1.65] text-foreground/70">
            Bio copy to come — two or three short paragraphs on how he works, what he shoots, and
            who he shoots it for. Keep it under 150 words so it reads in one breath.
          </p>

          <div className="grid grid-cols-1 gap-7 text-[11px] leading-[2] tracking-[0.13em] uppercase sm:grid-cols-2">
            <div>
              <p className="mb-2 text-foreground/60">Clients</p>
              <p className="text-foreground/70">
                {PLACEHOLDER_CLIENT_LINES.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < PLACEHOLDER_CLIENT_LINES.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>

            <div>
              {/* <p className="mb-2 text-foreground/60">Location</p> */}
              <p className="text-foreground/70">Based in NYC</p>
              <p className="text-foreground/70">Building Community</p>
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block text-foreground/70 transition-colors hover:text-foreground"
                >
                  {settings.contactEmail}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
