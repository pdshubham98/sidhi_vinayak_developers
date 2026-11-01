import { defineField, defineType } from 'sanity';

export const propertyType = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Vatika Green Farm House" or "Residential plot, Neelbad"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (auto-filled)',
      type: 'slug',
      description: 'Click "Generate" to fill automatically from the title. Do not change after the listing is live.',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Property type',
      type: 'string',
      options: {
        list: [
          { title: 'Farm house plot', value: 'farm-house-plot' },
          { title: 'Residential plot', value: 'plot' },
          { title: 'House', value: 'house' },
          { title: 'Flat', value: 'flat' },
          { title: 'Commercial', value: 'commercial' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Available', value: 'available' },
          { title: '🟡 Booked', value: 'booked' },
          { title: '🔴 Sold', value: 'sold' },
          { title: '🔵 Coming soon', value: 'upcoming' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Vatika Green Parisar, Khuraniya, near Bilkisganj"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      description: 'In rupees. Leave empty to show "Price on request" on the website.',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g. "1,200 sq ft" or "1,000 to 5,000 sq ft"',
    }),
    defineField({
      name: 'offer',
      title: 'Special offer or note',
      type: 'string',
      description: 'Optional. e.g. "Early bird discount available". Shown as a badge on the card.',
    }),
    defineField({
      name: 'featured',
      title: 'Show on home page as featured project',
      type: 'boolean',
      description: 'Turn on for the main Vatika Green listing only.',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Short description',
      type: 'text',
      rows: 2,
      description: 'Shown on listing cards. Keep it to 1–2 lines.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Full description',
      type: 'text',
      rows: 5,
      description: 'Shown on the property detail page. You can include plot sizes, facilities, anything useful.',
    }),
    defineField({
      name: 'highlights',
      title: 'Key highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points shown on the detail page. e.g. "Gated community", "24-hour water supply", "Near highway".',
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Photo description',
              type: 'string',
              description: 'Describe what is in the photo. e.g. "Front view of plot 12 at Vatika Green". Required for accessibility.',
              validation: Rule => Rule.required(),
            }),
          ],
        },
      ],
      description: 'Upload photos from your phone or computer. The first photo is the main one shown on cards.',
      validation: Rule => Rule.min(1).error('Add at least one photo.'),
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps link',
      type: 'url',
      description: 'Optional. In Google Maps, tap Share → Copy link, and paste it here.',
    }),
    defineField({
      name: 'listedOn',
      title: 'Listed on',
      type: 'date',
      description: 'Newer listings appear first on the website.',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      media: 'images.0',
    },
    prepare({ title, status, media }: { title: string; status: string; media: unknown }) {
      const dot: Record<string, string> = {
        available: '🟢',
        booked: '🟡',
        sold: '🔴',
        upcoming: '🔵',
      };
      return { title: `${dot[status] ?? ''} ${title}`, media };
    },
  },
});
