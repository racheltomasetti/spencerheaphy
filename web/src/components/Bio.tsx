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
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-center md:gap-x-12 lg:gap-x-16">
        <div className="relative aspect-[4/5] w-[clamp(13.75rem,62vw,20rem)] shrink-0 overflow-hidden md:w-[clamp(14rem,22vw,20rem)]">
          <Image
            src="/bio-portrait.jpg"
            alt={`${name} portrait`}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col items-center gap-[34px] text-center md:items-start md:text-left">
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
