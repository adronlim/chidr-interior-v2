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
    }),
    defineField({ name: 'role', type: 'string' }),
    defineField({
      name: 'photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'bio', type: 'text', rows: 4 }),
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
