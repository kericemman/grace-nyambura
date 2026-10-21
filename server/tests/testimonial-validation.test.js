const assert = require('node:assert/strict');
const test = require('node:test');
const { submissionSchema } = require('../src/validation/testimonial.validation');

const validSubmission = {
  clientName: 'Amina Kamau',
  clientRole: 'Founder',
  company: 'Example Studio',
  quote: 'Grace brought clarity and consistency to our founder visibility work.',
  sourceUrl: '',
};

test('client testimonial submission accepts multipart permission values', () => {
  const result = submissionSchema.safeParse({
    ...validSubmission,
    permissionConfirmed: 'true',
  });

  assert.equal(result.success, true);
  assert.equal(result.data.permissionConfirmed, true);
});

test('client testimonial submission still requires publication permission', () => {
  const result = submissionSchema.safeParse({
    ...validSubmission,
    permissionConfirmed: 'false',
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].message, 'Publication permission is required');
});
