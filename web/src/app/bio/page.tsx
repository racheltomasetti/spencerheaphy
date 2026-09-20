import type {Metadata} from 'next'
import {Bio} from '@/components/Bio'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'

export const metadata: Metadata = {
  title: 'Bio — Spencer Heaphy',
}

export default async function BioPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex w-full flex-1 flex-col justify-center px-(--edge) pt-[calc(var(--nav-h)+1rem)] pb-12">
      <Bio settings={settings} standalone />
    </div>
  )
}
