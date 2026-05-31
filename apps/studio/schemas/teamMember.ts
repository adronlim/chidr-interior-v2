import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export default defineType({
  name: 'teamMember',
  type: 'document',
  title: 'Team Member',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
      placeholder: 'E.g. Chai H.',
    }),
    defineField({ name: 'role', type: 'string', placeholder: 'E.g. Principal Designer' }),
    defineField({
      name: 'photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
      placeholder: 'E.g. Fifteen years of residential and small commercial work across Penang.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      name: 'manual',
      title: 'Manual order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
