const { z } = require('zod');

const optionalUrl = z.union([z.literal(''), z.string().url()]);
const settingsSchema = z.object({
  businessEmail: z.string().email(),
  phone: z.string().trim().min(7).max(30),
  linkedInUrl: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  calendlyUrl: optionalUrl,
  homepageCta: z.string().trim().min(2).max(80),
  serviceStartingPrice: z.string().trim().min(1).max(80),
  minimumEngagement: z.string().trim().min(1).max(80),
  footerText: z.string().trim().min(2).max(180),
  defaultMetaDescription: z.string().trim().max(170),
  openGraphImage: optionalUrl,
});

const profileSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().transform((value) => value.toLowerCase()) });
const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(12).max(200) }).refine((data) => data.currentPassword !== data.newPassword, { path: ['newPassword'], message: 'Choose a password you have not already used' });

module.exports = { passwordSchema, profileSchema, settingsSchema };
