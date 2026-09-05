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

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    source: z.object({
      title: z.string(),
      url: z.string().optional(),
      kind: z.string().default('article'),
    }),
    tags: z.array(z.string()).default([]),
    related: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    draft: z.boolean().default(false),
    // Notes render full-bleed as an interactive embed (mind map + flashcards).
    immersive: z.boolean().default(true),
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

export const collections = { projects, blog, notes, papers };
