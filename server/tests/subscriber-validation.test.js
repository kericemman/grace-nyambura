const assert = require('node:assert/strict');
const test = require('node:test');
const { subscriberSchema } = require('../src/validation/subscriber.validation');

test('mailing-list subscription accepts a name and valid email', () => {
  const result = subscriberSchema.safeParse({
    name: 'Amina Kamau',
    email: 'AMINA@example.com',
    website: '',
    startedAt: Date.now() - 3000,
  });

  assert.equal(result.success, true);
});

test('mailing-list subscription rejects invalid email addresses', () => {
  const result = subscriberSchema.safeParse({
    name: 'Amina Kamau',
    email: 'not-an-email',
    website: '',
    startedAt: Date.now() - 3000,
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].path[0], 'email');
});
