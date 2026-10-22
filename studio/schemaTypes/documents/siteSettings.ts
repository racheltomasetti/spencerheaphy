import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Bio',
  type: 'document',
  icon: UserIcon,
  fieldsets: [
    {
      name: 'bio',
      title: 'Bio page',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'footer',
      title: 'Footer (shown at the bottom of every page)',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'bioHeadline',
      title: 'Headline',
      description: 'The large line at the top of the bio, e.g. “Spencer is a 27 year-old Director and Creator in NYC.”',
      type: 'string',
      fieldset: 'bio',
    }),
    defineField({
      name: 'bioText',
      title: 'Paragraph',
      description: 'The paragraph under the headline.',
      type: 'text',
      rows: 6,
      fieldset: 'bio',
    }),
    defineField({
      name: 'bioMedia',
      title: 'Photo or video',
      description: 'Shown next to the text. If left empty, the current portrait stays.',
      type: 'optionalMediaItem',
      fieldset: 'bio',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Shown in the footer and used to describe the bio photo. Defaults to Spencer Heaphy.',
      type: 'string',
      fieldset: 'footer',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      description: 'Shown in the footer as a link that opens a new email.',
      type: 'string',
      fieldset: 'footer',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      description: 'Links shown in the footer, in this order. Drag to reorder.',
      type: 'array',
      fieldset: 'footer',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Bio'}),
  },
})
