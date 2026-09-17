import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: 'film',
      title: 'Director film page',
      description:
        'For Projects. Leave blank on Social clips. Full Vimeo link, crew, and stills show when someone opens the project.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'placement',
      title: 'Site placement',
      options: {collapsible: true, collapsed: false},
    },
  ],
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
      name: 'role',
      title: 'Role',
      description:
        'Director & Editor → Projects (16:9 film). Social → Social tab (9:16 / Instagram). Same document either way — fill the media that matches. Featured works for both.',
      type: 'string',
      options: {
        list: [
          {title: 'Director & Editor', value: 'director-editor'},
          {title: 'Social', value: 'social'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'Month and year as shown on the site, e.g. June 2026. Falls back to Year if empty.',
      type: 'date',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'coverMedia',
      title: 'Cover media',
      description:
        'Director: 16:9 still or loop for the Projects grid (and home, unless you add hero media). Social: 9:16 vertical clip — this is the piece.',
      type: 'mediaItem',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orientation',
      title: 'Orientation',
      description: 'What was shot. Director tiles are shown at 16:9. Social is shown at 9:16.',
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
      name: 'vimeoUrl',
      title: 'Full video link',
      description: 'Vimeo share URL for the film (not the embed HTML). Plays at the top of the project page.',
      type: 'url',
      fieldset: 'film',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'crew',
      title: 'Crew',
      type: 'array',
      fieldset: 'film',
      of: [{type: 'crewCredit'}],
    }),
    defineField({
      name: 'gallery',
      title: 'Stills',
      description: 'Still frames under the film on the project page. Add as they come in.',
      type: 'array',
      fieldset: 'film',
      of: [defineArrayMember({type: 'mediaItem'})],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      fieldset: 'placement',
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
      description: 'Lower numbers appear first.',
      type: 'number',
      fieldset: 'placement',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on home',
      description: 'Any featured project — director or social — shows in the home hero and Selected Work.',
      type: 'boolean',
      fieldset: 'placement',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Featured order',
      description: 'Lower numbers appear first in the hero carousel.',
      type: 'number',
      fieldset: 'placement',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'heroMedia',
      title: 'Hero media',
      description:
        'Optional landscape loop for the home hero. Especially useful for Social, where the cover is 9:16 and should not be cropped into 16:9.',
      type: 'optionalMediaItem',
      fieldset: 'placement',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'heroMediaMobile',
      title: 'Hero media — mobile (vertical)',
      description:
        'Optional vertical cut on narrow screens. Falls back to hero media (or cover media) if empty.',
      type: 'optionalMediaItem',
      fieldset: 'placement',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      description: 'Hide this project from the public site without deleting it.',
      type: 'boolean',
      fieldset: 'placement',
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
      role: 'role',
      status: 'status',
      hidden: 'hidden',
      media: 'coverMedia.image',
    },
    prepare({title, role, status, hidden, media}) {
      const roleLabel =
        role === 'director-editor' ? 'Director & Editor' : role === 'social' || role === 'creator' ? 'Social' : null
      const subtitle = [roleLabel, status, hidden ? 'Hidden' : null].filter(Boolean).join(' · ')
      return {title, subtitle, media}
    },
  },
})
