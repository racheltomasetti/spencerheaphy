import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'heroVideoDesktop',
      title: 'Hero video — desktop (horizontal)',
      description:
        'Short, tightly compressed looping clip (H.264 .mp4). Shown on larger screens; scrubs with scroll.',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'heroVideoMobile',
      title: 'Hero video — mobile (vertical)',
      description:
        'Short, tightly compressed looping clip (H.264 .mp4). Shown in place of the desktop video on narrow screens.',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'clientLogos',
      title: 'Client logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'tagline'},
  },
})
