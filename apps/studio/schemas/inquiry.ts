import { defineType, defineField } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export default defineType({
  name: 'inquiry',
  type: 'document',
  title: 'Inquiry',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'projectInterest', type: 'string', readOnly: true }),
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Replied', value: 'replied' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes — only the team sees these',
    }),
  ],
  orderings: [
    {
      name: 'newest',
      title: 'Newest first',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', status: 'status' },
    prepare({ title, subtitle, status }) {
      return {
        title: title ?? '(no name)',
        subtitle: `${subtitle ?? ''} · ${status ?? 'new'}`,
      };
    },
  },
});
