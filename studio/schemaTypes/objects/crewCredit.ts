import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const crewCredit = defineType({
  name: 'crewCredit',
  title: 'Credit',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      description: 'e.g. Director of Photography',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      description: 'e.g. Jane Doe',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
