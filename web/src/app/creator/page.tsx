import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Creator — Spencer Heaphy',
  robots: {index: false, follow: false},
}

export default function CreatorPage() {
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://www.sanity.io/manage'

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center sm:px-10">
      <p className="mb-10 border border-foreground/15 bg-foreground/[0.03] px-5 py-4 text-left text-xs leading-relaxed tracking-wide text-foreground/70">
        This page is only here while we build and test the site. When Spencer Heaphy
        goes live, Creator will be hidden or gated so it is not part of the public
        navigation.
      </p>
      <h1 className="mb-4 font-serif text-2xl uppercase tracking-[0.08em]">Creator</h1>
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
