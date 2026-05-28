import { defineType, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export default defineType({
  name: 'project',
  type: 'document',
  title: 'Project',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'projectCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (r) =>
        r.integer().min(1990).max(new Date().getFullYear() + 1),
    }),
    defineField({ name: 'location', type: 'string' }),
    defineField({
      name: 'areaSqft',
      type: 'number',
      title: 'Area (sqft)',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Show on the homepage featured grid',
      initialValue: false,
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'caption', type: 'string' })],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'YouTube video URL (optional)',
      description:
        'Walkthrough video. Paste a YouTube link — youtube.com/watch?v=… or youtu.be/… both work.',
      validation: (r) =>
        r.uri({ scheme: ['http', 'https'] }).custom((value) => {
          if (!value) return true;
          const ok =
            /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/.test(
              value,
            );
          return ok || 'Must be a YouTube link';
        }),
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
      title: 'Description (rich text)',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      name: 'manual',
      title: 'Manual order',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      name: 'yearDesc',
      title: 'Year (newest first)',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'coverImage',
    },
  },
});
