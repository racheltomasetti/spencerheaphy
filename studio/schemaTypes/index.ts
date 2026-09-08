import {project} from './documents/project'
import {siteSettings} from './documents/siteSettings'
import {mediaItem} from './objects/mediaItem'
import {optionalMediaItem} from './objects/optionalMediaItem'
import {socialLink} from './objects/socialLink'

export const schemaTypes = [
  // documents
  project,
  siteSettings,
  // objects
  mediaItem,
  optionalMediaItem,
  socialLink,
]
