import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    theme: z.string(),
    techStack: z.array(z.string()),
    achievements: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    links: z
      .object({
        github: z.string().optional(),
        demo: z.string().optional(),
        writeup: z.string().optional(),
      })
      .optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Full-bleed posts render their own layout/canvas instead of the .prose column.
    immersive: z.boolean().default(false),
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.string().optional(),
    summary: z.string(),
    paperUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    date: z.coerce.date().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { projects, blog, papers };
