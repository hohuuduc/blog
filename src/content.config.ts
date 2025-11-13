import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional(),
    order: z.number().optional(),
    allowDiscussion: z.boolean().optional().default(true),
  })
});


export const collections = { blog: blogCollection };
