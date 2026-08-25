import Link from 'next/link'
import {VideoHero} from '@/components/VideoHero'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'

export const revalidate = 60

export default async function Home() {
  const settings = await getSiteSettings()

  return (
    <>
      <VideoHero caption={settings?.tagline} />
      <div className="mx-auto flex max-w-6xl justify-end px-6 py-10 sm:px-10">
        <Link
          href="/selected-work"
          className="text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-70"
        >
          View selected work &rarr;
        </Link>
      </div>
    </>
  )
}
