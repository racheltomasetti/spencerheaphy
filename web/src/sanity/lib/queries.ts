import {defineQuery} from 'next-sanity'

const MEDIA_ITEM_PROJECTION = `{
  _key,
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
}`

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && hidden != true] | order(order asc, year desc) {
    _id,
    "slug": slug.current,
    title,
    year,
    role,
    status,
    description,
    featured,
    featuredOrder,
    orientation,
    coverMedia ${MEDIA_ITEM_PROJECTION},
    heroMedia ${MEDIA_ITEM_PROJECTION},
    heroMediaMobile ${MEDIA_ITEM_PROJECTION},
    gallery[] ${MEDIA_ITEM_PROJECTION}
  }
`)

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    name,
    contactEmail,
    socialLinks[] { platform, url }
  }
`)
