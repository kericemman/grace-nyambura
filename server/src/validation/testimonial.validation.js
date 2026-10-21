const { z } = require('zod');

const optionalUrl = z.union([z.literal(''), z.string().url()]).default('');

const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientRole: z.string().trim().max(120).default(''),
  company: z.string().trim().min(2).max(160),
  quote: z.string().trim().min(20).max(3000),
  photo: optionalUrl,
  sourceUrl: optionalUrl,
  caseStudy: z.union([z.literal(''), z.string().regex(/^[a-f\d]{24}$/i)]).nullable().default(null),
  permissionConfirmed: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: z.enum(['submitted', 'published', 'archived']).default('submitted'),
});

const requestSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientRole: z.string().trim().max(120).default(''),
  company: z.string().trim().min(2).max(160),
  email: z.union([z.literal(''), z.string().email()]).default(''),
  expiresInDays: z.coerce.number().int().min(1).max(90).default(30),
});

const submissionSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientRole: z.string().trim().max(120).default(''),
  company: z.string().trim().min(2).max(160),
  quote: z.string().trim().min(20).max(3000),
  sourceUrl: optionalUrl,
  permissionConfirmed: z.preprocess(
    (value) => value === true || value === 'true',
    z.literal(true, { error: 'Publication permission is required' }),
  ),
});

module.exports = { requestSchema, submissionSchema, testimonialSchema };
