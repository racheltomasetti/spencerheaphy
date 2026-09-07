export type ProjectStatus = 'published' | 'in production' | 'undisclosed'

interface SanityImageAsset {
  _id: string
  url: string
  metadata?: {
    lqip?: string
    dimensions?: {width: number; height: number}
  }
}

export interface SanityImageValue {
  asset: SanityImageAsset
  alt?: string
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export interface MediaItem {
  _key?: string
  mediaType: 'image' | 'video'
  image?: SanityImageValue
  video?: {
    asset?: {_id: string; url: string}
  }
}

export interface Project {
  _id: string
  slug: string
  title: string
  client?: string
  category?: string
  year?: number
  status: ProjectStatus
  description?: string
  coverMedia?: MediaItem
  gallery?: MediaItem[]
}

export interface SocialLink {
  platform: string
  url: string
}

export interface SiteSettings {
  name?: string
  tagline?: string
  contactEmail?: string
  socialLinks?: SocialLink[]
  clientLogos?: SanityImageValue[]
}
