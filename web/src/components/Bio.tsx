import Image from 'next/image'
import type {SiteSettings} from '@/sanity/lib/types'

const PLACEHOLDER_CLIENT_LINES = ['Client list', 'to come', '—']

export function Bio({
  settings,
  standalone = false,
}: {
  settings: SiteSettings | null
  standalone?: boolean
}) {
  const name = settings?.name || 'Spencer Heaphy'

  return (
    <section
      id="bio"
      className={
        standalone
          ? 'w-full'
          : 'scroll-mt-(--nav-h) px-(--edge) pt-[calc(var(--nav-h)+2.5rem)] pb-[90px]'
      }
    >
      <div className="grid grid-cols-12 gap-x-7 gap-y-10 lg:items-center lg:gap-7">
        <div
          className="relative col-span-12 mx-auto w-2/3 overflow-hidden lg:col-span-4"
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
            {name} is a director and photographer based in New York City.
          </h2>

          <p className="max-w-[56ch] text-pretty text-base leading-[1.65] text-foreground/70">
            Starting his career in the mailroom at CAA, Spencer was able to learn
            about Hollywood and apply that knowledge to his visual storytelling.
            He focuses on the emotion behind each story
            and combines it with a keen eye for what brands want.
          </p>

          <div className="grid grid-cols-1 gap-7 text-[11px] leading-[2] tracking-[0.13em] uppercase sm:grid-cols-2">
            {/* <div>
              <p className="mb-2 text-foreground/60">Clients</p>
              <p className="text-foreground/70">
                {PLACEHOLDER_CLIENT_LINES.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < PLACEHOLDER_CLIENT_LINES.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div> */}

            <div>
              {/* <p className="mb-2 text-foreground/60">Location</p> */}
              {/* <p className="text-foreground/70">Based in NYC</p> */}
              <br />
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block text-xs uppercase tracking-[0.1em] text-foreground/60 transition-colors hover:text-foreground"
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
