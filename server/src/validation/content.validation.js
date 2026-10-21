const { z } = require('zod');

const status = z.enum(['draft', 'published', 'archived']);
const optionalUrl = z.union([z.literal(''), z.string().url()]).default('');

const articleSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  excerpt: z
    .string()
    .trim()
    .min(10, 'The excerpt needs at least 10 characters')
    .max(500, 'Keep the excerpt at 500 characters or fewer'),
  content: z.string().min(1),
  coverImage: optionalUrl,
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  author: z.string().trim().min(2).max(100).default('Grace Nyambura'),
  authorImage: optionalUrl,
  status: status.default('draft'),
  featured: z.boolean().default(false),
  seoTitle: z.string().trim().max(70).default(''),
  seoDescription: z
    .string()
    .trim()
    .max(170, 'Keep the SEO description at 170 characters or fewer')
    .default(''),
  canonicalUrl: optionalUrl,
});

const caseStudySchema = z.object({
  clientName: z.string().trim().max(120).default(''),
  company: z.string().trim().min(2).max(120),
  industry: z.string().trim().min(2).max(100),
  projectTitle: z.string().trim().min(3).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  summary: z.string().trim().min(10).max(600),
  challenge: z.string().min(10),
  objectives: z.string().default(''),
  approach: z.string().min(10),
  contribution: z.string().default(''),
  results: z.string().default(''),
  metrics: z.array(z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1), evidenceUrl: optionalUrl })).max(20).default([]),
  evidenceLinks: z.array(z.object({ label: z.string().trim().min(1), url: z.string().url() })).max(20).default([]),
  testimonial: z.string().default(''),
  clientLogo: optionalUrl,
  coverImage: optionalUrl,
  gallery: z.array(z.string().url()).max(20).default([]),
  publicationApproved: z.boolean().default(false),
  status: status.default('draft'),
  featured: z.boolean().default(false),
  seoTitle: z.string().trim().max(70).default(''),
  seoDescription: z.string().trim().max(170).default(''),
});

module.exports = { articleSchema, caseStudySchema };
