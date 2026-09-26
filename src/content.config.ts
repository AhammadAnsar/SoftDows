import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const workCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    client: z.string().optional(),
    industry: z.string(),
    projectSummary: z.string(),
    featured: z.boolean().default(false),
    isDraft: z.boolean().default(false),
    completionDate: z.date().optional(),
    projectUrl: z.string().url().optional(),
    
    // Arrays for structured lists
    servicesUsed: z.array(z.string()).optional(),
    deliverables: z.array(z.string()).optional(),
    
    // Text blocks
    challenge: z.string().optional(),
    objectives: z.string().optional(),
    solution: z.string().optional(),
    approach: z.string().optional(),
    results: z.array(z.string()).optional(),
    
    // Testimonial
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional()
    }).optional(),

    // Visuals
    featuredImage: image().optional(),
    imageAlt: z.string().optional()
  })
});

const insightsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    author: z.string().default('Ansar Ahammad'),
    description: z.string(),
    isDraft: z.boolean().default(false),
  })
});

export const collections = {
  'work': workCollection,
  'insights': insightsCollection,
};
