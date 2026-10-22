import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'

/**
 * Same shape as `mediaItem`, but with no required fields anywhere — for
 * fields that are themselves optional (e.g. an override that falls back to
 * another field when left empty). `mediaItem`'s internal requiredness is
 * correct there, but here it caused Studio to demand media the moment the
 * field became visible, before the editor had touched it.
 */
export const optionalMediaItem = defineType({
  name: 'optionalMediaItem',
  title: 'Media (optional)',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Image or video?',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description',
          description: 'A short description of the image, for screen readers and search engines.',
          type: 'string',
        }),
      ],
      hidden: ({parent}) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      description: 'Upload an MP4. Keep it short (a looping clip) and under about 20 MB so the site stays fast.',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.mediaType !== 'video',
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
    },
    prepare({mediaType, image}) {
      return {
        title: mediaType === 'video' ? 'Video' : mediaType === 'image' ? 'Image' : 'Not set',
        media: mediaType === 'video' ? PlayIcon : image,
      }
    },
  },
})
