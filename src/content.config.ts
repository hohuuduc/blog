import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().optional().default(new Date()),
    navGroup: z.enum(['docs', 'information', 'playground', 'other']).default('docs'),
    order: z.number().optional(),
    tags: z.array(z.string()).default([]),
    sidebarGroup: z.string().optional()
  })
});

export const collections = { pages };
