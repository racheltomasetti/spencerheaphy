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
      title: 'Film page',
      description: 'What opens when someone clicks this project: the video, credits and stills.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'placement',
      title: 'Where it appears on the site',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The project name, shown on the site.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Link name',
      description: 'The project’s web address, e.g. spencerheaphy.com/?project=kiehls. Click Generate and leave it.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Type',
      description:
        'Director & Editor projects appear on the Work page. Social projects appear on the Social page. This decides which fields below you need to fill in.',
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
      name: 'subheader',
      title: 'Subheader',
      description: 'A short line shown under the title, e.g. Summer Road Trip.',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'Shown on the site as month and year, e.g. June 2026.',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A few sentences about the project, shown when someone opens it.',
      type: 'text',
    }),
    defineField({
      name: 'coverMedia',
      title: 'Cover image or clip',
      description:
        'The picture or short looping clip shown on the site. Director & Editor: horizontal (16:9), shown in the Work grid. Social: vertical (9:16), shown on the Social page.',
      type: 'mediaItem',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postUrl',
      title: 'Link to the post',
      description:
        'Paste the link to this post on Instagram, TikTok, etc. Clicking the project on the Social page opens it in a new tab. Until a link is added, the project shows on the Social page but isn’t clickable.',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
      hidden: ({document}) => document?.role !== 'social',
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Video link',
      description: 'The Vimeo link to the film (the normal share link, not the embed code). It plays at the top of the project.',
      type: 'url',
      fieldset: 'film',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
      hidden: ({document}) => document?.role !== 'director-editor',
    }),
    defineField({
      name: 'crew',
      title: 'Crew',
      description: 'Add one row per person, e.g. Role: Director, Name: Spencer Heaphy.',
      type: 'array',
      fieldset: 'film',
      of: [{type: 'crewCredit'}],
      hidden: ({document}) => document?.role !== 'director-editor',
    }),
    defineField({
      name: 'gallery',
      title: 'Stills',
      description: 'Still frames shown below the film.',
      type: 'array',
      fieldset: 'film',
      of: [defineArrayMember({type: 'mediaItem'})],
      hidden: ({document}) => document?.role !== 'director-editor',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      description:
        'Leave on Published to show the project normally. Choose Undisclosed to show a blank “Undisclosed / Coming soon” tile at the end of the Work page, with no title or image and no way to open it.',
      type: 'string',
      fieldset: 'placement',
      options: {
        list: [
          {title: 'Published', value: 'published'},
          {title: 'Undisclosed', value: 'undisclosed'},
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      validation: (rule) => rule.required(),
      hidden: ({document}) => document?.role === 'social',
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      description: 'Controls the order on the Work or Social page. 1 comes first and so on.',
      type: 'number',
      fieldset: 'placement',
    }),
    defineField({
      name: 'featured',
      title: 'Show on the home page',
      description: 'Turn on to feature this project in the home page slideshow.',
      type: 'boolean',
      fieldset: 'placement',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Position on the home page',
      description: 'Order in the home page slideshow. 1 comes first.',
      type: 'number',
      fieldset: 'placement',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'heroMedia',
      title: 'Home page slideshow image or clip',
      description:
        'Optional. A horizontal (16:9) image or clip for the home page slideshow. If left empty, the cover is used, which for Social projects means a vertical clip cropped to fit.',
      type: 'optionalMediaItem',
      fieldset: 'placement',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'heroMediaMobile',
      title: 'Home page slideshow — phone version',
      description:
        'Optional. A vertical image or clip used on phones. If left empty, the slideshow image above is used.',
      type: 'optionalMediaItem',
      fieldset: 'placement',
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'hidden',
      title: 'Hide from the site',
      description: 'Turn on to take this project off the website without deleting it.',
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
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
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
        role === 'director-editor' ? 'Director & Editor' : role === 'social' ? 'Social' : null
      const subtitle = [roleLabel, status, hidden ? 'Hidden' : null].filter(Boolean).join(' · ')
      return {title, subtitle, media}
    },
  },
})
