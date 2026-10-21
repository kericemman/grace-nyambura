const assert = require('node:assert/strict');
const test = require('node:test');
const {
  adminPartnershipApplicationSchema,
  publicPartnershipApplicationSchema,
} = require('../src/validation/partnershipApplication.validation');

const validApplication = {
  fullName: 'Amina Kamau',
  email: 'amina@example.com',
  phone: '+254712345678',
  company: 'Example Studio',
  professionalRole: 'Founder',
  linkedInUrl: 'https://www.linkedin.com/in/amina',
  primaryGoal: 'Build founder authority',
  currentPostingRhythm: 'Occasionally',
  desiredStart: 'Within one month',
  additionalContext: 'I want a consistent point of view across my content.',
  consent: true,
  website: '',
  startedAt: Date.now() - 5000,
};

test('partnership application accepts complete client details', () => {
  const result = publicPartnershipApplicationSchema.safeParse(validApplication);
  assert.equal(result.success, true);
});

test('partnership application requires a valid phone and consent', () => {
  const result = publicPartnershipApplicationSchema.safeParse({
    ...validApplication,
    phone: '123',
    consent: false,
  });
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map((issue) => issue.path[0]), ['phone', 'consent']);
});

test('admin partnership status is restricted to the review workflow', () => {
  const result = adminPartnershipApplicationSchema.safeParse({
    status: 'published',
    internalNotes: '',
  });
  assert.equal(result.success, false);
});
