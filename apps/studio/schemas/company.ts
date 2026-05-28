import { defineType, defineField } from 'sanity';
import { HomeIcon } from '@sanity/icons';

export default defineType({
  name: 'company',
  type: 'document',
  title: 'Company info',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required(),
      initialValue: 'CH iDesign & Renovation',
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'Used on the homepage hero subtitle',
    }),
    defineField({
      name: 'logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoDark',
      type: 'image',
      description: 'Optional — used on dark backgrounds (footer)',
    }),
    defineField({
      name: 'address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'mapEmbedUrl',
      type: 'url',
      description: 'Google Maps embed URL for the Contact page',
    }),
    defineField({
      name: 'socials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'LinkedIn', value: 'linkedin' },
                ],
              },
            }),
            defineField({ name: 'url', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({
              name: 'icon',
              type: 'string',
              description: 'lucide-react icon name, e.g. "hammer"',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Company info' }),
  },
});
