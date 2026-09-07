import {sanityFetch} from './live'
import {SITE_SETTINGS_QUERY} from './queries'
import type {SiteSettings} from './types'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})
    return data as SiteSettings | null
  } catch {
    // Dataset unreachable or the singleton hasn't been created in Studio yet.
    return null
  }
}
