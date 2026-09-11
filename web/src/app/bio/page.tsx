import type {Metadata} from 'next'
import {Bio} from '@/components/Bio'
import {getSiteSettings} from '@/sanity/lib/get-site-settings'

export const metadata: Metadata = {
  title: 'Bio — Spencer Heaphy',
}

export default async function BioPage() {
  const settings = await getSiteSettings()

  return <Bio settings={settings} />
}
