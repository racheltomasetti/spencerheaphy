import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Welcome Spencer — Spencer Heaphy',
  robots: {index: false, follow: false},
}

export default function CreatorPage() {
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://www.sanity.io/manage'

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-[70px] text-center sm:px-10">
      <h1 className="mb-4 font-serif text-2xl uppercase tracking-[0.08em]">Welcome Spencer</h1>
      <p className="mb-8 text-sm text-foreground/60">
        Manage projects, bio content, and site settings in Sanity Studio.
      </p>
      <a
        href={studioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block border border-foreground/20 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-foreground/60"
      >
        Open Sanity Studio
      </a>
    </div>
  )
}
