import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const crewCredit = defineType({
  name: 'crewCredit',
  title: 'Crew credit',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
