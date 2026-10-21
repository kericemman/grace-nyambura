const { z } = require('zod');
const { isValidPhoneNumber } = require('libphonenumber-js');

const optionalUrl = z.union([
  z.literal(''),
  z.string().url('Enter a valid LinkedIn URL'),
]);

const publicPartnershipApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(120),
  email: z.string().trim().email('Enter a valid business email').max(180),
  phone: z.string().trim().refine(isValidPhoneNumber, 'Enter a valid phone number'),
  company: z.string().trim().min(2, 'Enter your company name').max(160),
  professionalRole: z.string().trim().min(2, 'Enter your professional role').max(140),
  linkedInUrl: optionalUrl.default(''),
  primaryGoal: z.string().trim().min(2, 'Choose your primary goal').max(180),
  currentPostingRhythm: z.string().trim().min(2, 'Choose your current posting rhythm').max(120),
  desiredStart: z.string().trim().min(2, 'Choose when you would like to start').max(120),
  additionalContext: z.string().trim().max(3000).default(''),
  consent: z.literal(true, { error: 'Consent is required before submitting' }),
  website: z.string().max(0).optional().default(''),
  startedAt: z.coerce.number().int().positive(),
});

const adminPartnershipApplicationSchema = z.object({
  status: z.enum(['new', 'reviewing', 'qualified', 'accepted', 'declined']),
  internalNotes: z.string().trim().max(5000).default(''),
});

module.exports = {
  adminPartnershipApplicationSchema,
  publicPartnershipApplicationSchema,
};
