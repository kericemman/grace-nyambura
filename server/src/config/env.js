const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  HOST: z.string().default('127.0.0.1'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  PUBLIC_SITE_URL: z.string().url().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  MONGO_URI: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  UNSUBSCRIBE_SECRET: z.string().min(32).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
}).superRefine((environment, context) => {
  if (environment.NODE_ENV !== 'production') return;

  const required = [
    'MONGO_URI',
    'PUBLIC_SITE_URL',
    'COOKIE_DOMAIN',
    'UNSUBSCRIBE_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RESEND_API_KEY',
    'RESEND_FROM',
    'ADMIN_NOTIFICATION_EMAIL',
  ];

  for (const key of required) {
    if (!environment[key]) {
      context.addIssue({
        code: 'custom',
        path: [key],
        message: `${key} is required in production`,
      });
    }
  }
});

function getEnv(source = process.env) {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
  }
  return parsed.data;
}

module.exports = { getEnv };

