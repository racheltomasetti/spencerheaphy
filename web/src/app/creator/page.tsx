import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Welcome Spencer Heaphy',
  robots: {index: false, follow: false},
}

export default function CreatorPage() {
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://www.sanity.io/manage'

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-[70px] text-center sm:px-10">
      <h1 className="mb-4 text-[clamp(26px,3.2vw,40px)] leading-[1.08] tracking-[-0.022em]">Welcome Spencer</h1>
      <p className="mb-8 text-[17px] leading-[1.62] text-foreground/72">
        Manage projects, bio content, and site settings in Sanity Studio.
      </p>
      <a
        href={studioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-foreground/20 px-6 py-3 text-[13px] leading-[1.5] hover:border-foreground/72"
      >
        Open Sanity Studio
      </a>
    </div>
  )
}
