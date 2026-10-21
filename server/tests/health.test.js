process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

test('GET /api/v1/health returns the standard success shape', async () => {
  const response = await request(createApp()).get('/api/v1/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { data: { status: 'ok', service: 'grace-api' } });
});

test('unknown routes return the standard error shape', async () => {
  const response = await request(createApp()).get('/api/v1/missing');
  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'NOT_FOUND');
});

