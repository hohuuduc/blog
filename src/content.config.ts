import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().default(new Date()),
    order: z.number().optional(),
    sidebarGroup: z.string().optional()
  })
});


export const collections = { blog: blogCollection };
