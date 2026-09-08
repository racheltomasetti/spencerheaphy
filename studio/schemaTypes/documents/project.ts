import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used in the project link (e.g. spencerheaphy.com/?project=kiehls). Generate from the title.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'coverMedia',
      title: 'Cover media',
      type: 'mediaItem',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation',
      description: 'Drives the aspect ratio used for this project’s tile in the Selected Work grid.',
      type: 'string',
      options: {
        list: [
          {title: 'Landscape', value: 'landscape'},
          {title: 'Portrait', value: 'portrait'},
          {title: 'Square', value: 'square'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'landscape',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'mediaItem'})],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Published', value: 'published'},
          {title: 'In production', value: 'in production'},
          {title: 'Undisclosed', value: 'undisclosed'},
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'Lower numbers appear first in the grid.',
      type: 'number',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on home',
      description: 'Show this project in the hero carousel.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured order',
      description: 'Lower numbers appear first in the hero carousel.',
      type: 'number',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'heroMedia',
      title: 'Hero media',
      description:
        'Optional override for the hero carousel. Falls back to cover media. A cover still is often not the right hero clip — use a landscape loop here.',
      type: 'optionalMediaItem',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'heroMediaMobile',
      title: 'Hero media — mobile (vertical)',
      description:
        'Optional vertical cut shown in place of hero media on narrow screens. Falls back to hero media (or cover media), object-cover cropped, if not supplied.',
      type: 'optionalMediaItem',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      description: 'Hide this project from the public site without deleting it.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Year, newest first',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      status: 'status',
      hidden: 'hidden',
      media: 'coverMedia.image',
    },
    prepare({title, client, status, hidden, media}) {
      const subtitle = [client, status, hidden ? 'Hidden' : null].filter(Boolean).join(' · ')
      return {title, subtitle, media}
    },
  },
})
