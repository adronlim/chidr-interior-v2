import { defineType, defineField } from 'sanity';
import { StarIcon } from '@sanity/icons';

export default defineType({
  name: 'hero',
  type: 'document',
  title: 'Homepage hero',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Spaces that quietly endure.',
    }),
    defineField({
      name: 'subheading',
      type: 'text',
      rows: 2,
      placeholder: 'Residential, commercial and office interiors based in Penang.',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      initialValue: 'View projects',
    }),
    defineField({
      name: 'ctaHref',
      type: 'string',
      initialValue: '/projects',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage hero' }),
  },
});
