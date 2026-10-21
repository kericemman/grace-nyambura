const { z } = require('zod');

const subscriberSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  email: z.string().trim().email('Enter a valid email address').max(180),
  website: z.string().max(0).optional().default(''),
  startedAt: z.coerce.number().int().positive(),
});

module.exports = { subscriberSchema };
