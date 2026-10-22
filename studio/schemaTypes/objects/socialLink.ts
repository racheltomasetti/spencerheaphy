import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Footer link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      description: 'The name shown in the footer.',
      type: 'string',
      options: {
        list: ['Instagram', 'TikTok', 'YouTube', 'Vimeo', 'LinkedIn', 'X', 'Email'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      description: 'The full web address, starting with https://',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({scheme: ['http', 'https', 'mailto']}),
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
  },
})
