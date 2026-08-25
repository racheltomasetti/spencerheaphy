import {client} from './client'
import {SITE_SETTINGS_QUERY} from './queries'
import type {SiteSettings} from './types'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(SITE_SETTINGS_QUERY)
  } catch {
    // Dataset unreachable or the singleton hasn't been created in Studio yet.
    return null
  }
}
