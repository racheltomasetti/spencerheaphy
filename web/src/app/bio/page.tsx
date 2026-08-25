import type {Metadata} from 'next'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'

export const metadata: Metadata = {
  title: 'Bio — Spencer Heaphy',
}

export default async function BioPage() {
  const settings = await getSiteSettings()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
      <h1 className="mb-8 font-serif text-3xl uppercase tracking-[0.08em]">Bio</h1>
      {settings?.tagline && (
        <p className="mb-8 text-sm uppercase tracking-[0.15em] text-foreground/50">
          {settings.tagline}
        </p>
      )}
      <p className="text-lg leading-relaxed text-foreground/80">
        Placeholder bio copy. This is where {settings?.name || 'Spencer Heaphy'}&rsquo;s
        background, credits, and approach will live once the final copy is ready.
      </p>
    </div>
  )
}
