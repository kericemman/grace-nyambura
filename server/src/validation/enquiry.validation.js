const { z } = require('zod');
const { isValidPhoneNumber } = require('libphonenumber-js');

const optionalUrl = z.union([z.literal(''), z.string().url('Enter a valid website or LinkedIn URL')]);

const publicEnquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(120),
  email: z.string().trim().email('Enter a valid business email').max(180),
  phone: z.string().trim().refine(isValidPhoneNumber, 'Enter a valid phone number'),
  company: z.string().trim().min(2, 'Enter your company name').max(160),
  websiteUrl: optionalUrl.default(''),
  professionalRole: z.string().trim().min(2, 'Enter your professional role').max(140),
  primaryChallenge: z.string().trim().min(2, 'Select your primary LinkedIn challenge').max(180),
  projectDescription: z.string().trim().min(20, 'Tell me a little more about what you need').max(4000),
  preferredContactMethod: z.enum(['email', 'phone', 'linkedin'], { error: 'Choose a preferred contact method' }),
  consent: z.literal(true, { error: 'Consent is required before submitting' }),
  website: z.string().max(0).optional().default(''),
  startedAt: z.coerce.number().int().positive(),
});

const adminEnquirySchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']),
  internalNotes: z.string().trim().max(5000).default(''),
});

module.exports = { adminEnquirySchema, publicEnquirySchema };
