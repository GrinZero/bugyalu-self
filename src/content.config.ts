import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    icon: z.string().default("🧪"),
    kind: z.enum(["open-source", "internal", "experiment"]).default("experiment"),
    period: z.string().optional(),
    accent: z.enum(["mint", "amber", "coral"]).default("mint"),
    tags: z.array(z.string()).default([]),
    order: z.number().default(99),
    link: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, projects };
