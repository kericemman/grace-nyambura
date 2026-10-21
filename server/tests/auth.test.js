process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

test('POST /api/v1/auth/login rejects malformed credentials before database access', async () => {
  const response = await request(createApp()).post('/api/v1/auth/login').send({ email: 'invalid', password: '' });
  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
});

test('GET /api/v1/auth/session rejects requests without a session cookie', async () => {
  const response = await request(createApp()).get('/api/v1/auth/session');
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHENTICATED');
});

test('POST /api/v1/auth/refresh requires a CSRF token', async () => {
  const response = await request(createApp()).post('/api/v1/auth/refresh');
  assert.equal(response.status, 403);
  assert.equal(response.body.error.code, 'CSRF_INVALID');
});

test('POST /api/v1/auth/logout requires a CSRF token', async () => {
  const response = await request(createApp()).post('/api/v1/auth/logout');
  assert.equal(response.status, 403);
  assert.equal(response.body.error.code, 'CSRF_INVALID');
});
