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

test('API responses include hardened browser headers', async () => {
  const response = await request(createApp()).get('/api/v1/health');

  assert.equal(response.headers['x-powered-by'], undefined);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-frame-options'], 'SAMEORIGIN');
  assert.match(response.headers['content-security-policy'], /default-src 'none'/);
  assert.equal(
    response.headers['permissions-policy'],
    'camera=(), microphone=(), geolocation=()',
  );
});

test('CORS permits only the configured website origin with credentials', async () => {
  const app = createApp({ clientOrigin: 'https://gracenyambura.com' });
  const allowed = await request(app)
    .get('/api/v1/health')
    .set('Origin', 'https://gracenyambura.com');
  const rejected = await request(app)
    .get('/api/v1/health')
    .set('Origin', 'https://example.com');

  assert.equal(allowed.headers['access-control-allow-origin'], 'https://gracenyambura.com');
  assert.equal(allowed.headers['access-control-allow-credentials'], 'true');
  assert.equal(rejected.headers['access-control-allow-origin'], undefined);
});

