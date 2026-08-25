import {defineQuery} from 'next-sanity'

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && hidden != true] | order(order asc, year desc) {
    _id,
    title,
    client,
    category,
    year,
    status,
    coverMedia {
      mediaType,
      image {
        asset -> {
          _id,
          url,
          metadata { lqip, dimensions { width, height } }
        },
        alt,
        hotspot,
        crop
      },
      video {
        asset -> { _id, url }
      }
    }
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    name,
    tagline,
    contactEmail,
    socialLinks[] { platform, url },
    clientLogos[] {
      asset -> { _id, url },
      alt,
      hotspot,
      crop
    }
  }
`)
