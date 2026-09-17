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
          className="relative col-span-12 mx-auto mb-10 w-2/3 overflow-hidden lg:col-span-4 lg:mb-0"
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
          <h2 className="opsz-display text-pretty text-[clamp(30px,4vw,54px)] leading-[1.1] font-normal tracking-[-0.025em]">
            {name} is a director and photographer based in New York City.
          </h2>

          <p className="max-w-[56ch] text-pretty text-[17px] leading-[1.62] text-foreground/72">
            Bio copy to come, this section is still under construction. Playing around with the design, still locking down information to share. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            {/* <div>
              <p className="mb-2 text-[13px] leading-[1.5] text-foreground/72">Clients</p>
              <p className="text-[15px] leading-[1.62] text-foreground/72">
                {PLACEHOLDER_CLIENT_LINES.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < PLACEHOLDER_CLIENT_LINES.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div> */}

            <div>
              {/* <p className="mb-2 text-[13px] leading-[1.5] text-foreground/72">Location</p> */}
              {/* <p className="text-[15px] leading-[1.62] text-foreground/72">Based in NYC</p> */}
              <br />
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block text-[15px] leading-[1.62] text-foreground/72 transition-colors hover:text-foreground"
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
