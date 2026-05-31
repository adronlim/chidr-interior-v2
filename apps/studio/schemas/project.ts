import { defineType, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';
import { GalleryInput } from '../components/gallery-input';

export default defineType({
  name: 'project',
  type: 'document',
  title: 'Project',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
      placeholder: 'Marina Bay Penthouse',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'projectCategory' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) =>
        rule
          .integer()
          .min(1990)
          .max(new Date().getFullYear() + 1),
      placeholder: '2024',
    }),
    defineField({
      name: 'location',
      type: 'string',
      placeholder: 'George Town, Penang',
    }),
    defineField({
      name: 'areaSqft',
      type: 'number',
      title: 'Area (sqft)',
      placeholder: '1200',
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
      description:
        'Required to publish. Without a cover image the project cannot be published and stays a draft — it will not appear on the website.',
      validation: (rule) =>
        rule.required().error('A cover image is required before this project can be published.'),
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      description:
        'Click "Upload multiple photos" to select several files at once, or drag a batch of photos onto the grid. Each uploads as its own gallery image.',
      options: { layout: 'grid' },
      components: { input: GalleryInput },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              type: 'string',
              placeholder: 'Living room, north light',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'YouTube video URL (optional)',
      description:
        'Walkthrough video. Paste a YouTube link — youtube.com/watch?v=… or youtu.be/… both work.',
      placeholder: 'https://youtu.be/dQw4w9WgXcQ',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).custom((value) => {
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
