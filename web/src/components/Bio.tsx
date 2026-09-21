import Image from 'next/image'
import type {SiteSettings} from '@/sanity/lib/types'

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
        <div className="col-span-12 flex flex-col items-center gap-[34px] text-center lg:col-span-6 lg:col-start-6 lg:items-start lg:text-left">
          <h2 className="text-pretty text-[clamp(22px,2.7vw,34px)] leading-[1.24] font-normal tracking-[-0.022em]">
            {name} is a director and photographer based in New York City.
          </h2>

          <p className="max-w-[56ch] text-pretty text-base leading-[1.65] text-foreground/70">
            Starting his career in the mailroom at CAA, Spencer was able to learn
            about Hollywood and apply that knowledge to his visual storytelling.
            He focuses on the emotion behind each story
            and combines it with a keen eye for what brands want.
          </p>
        </div>
      </div>
    </section>
  )
}
