import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'

export const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Media',
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
      initialValue: 'image',
      validation: (rule) => rule.required(),
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
          validation: (rule) => rule.required().warning('Alt text is important for SEO and accessibility'),
        }),
      ],
      hidden: ({parent}) => parent?.mediaType !== 'image',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string} | undefined
          if (parent?.mediaType === 'image' && !value) return 'Required when media type is Image'
          return true
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      description: 'Upload an MP4. Keep it short (a looping clip) and under about 20 MB so the site stays fast.',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.mediaType !== 'video',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string} | undefined
          if (parent?.mediaType === 'video' && !value) return 'Required when media type is Video'
          return true
        }),
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
    },
    prepare({mediaType, image}) {
      return {
        title: mediaType === 'video' ? 'Video' : 'Image',
        media: mediaType === 'video' ? PlayIcon : image,
      }
    },
  },
})
