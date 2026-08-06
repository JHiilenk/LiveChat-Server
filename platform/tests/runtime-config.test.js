const test = require('node:test');
const assert = require('node:assert/strict');
const { resolvePublicBaseUrl, resolveLivechatBackendUrl } = require('../lib/runtime-config');

test('resolvePublicBaseUrl uses Railway public domain when PUBLIC_BASE_URL is absent', () => {
  const env = { PORT: '4001', RAILWAY_PUBLIC_DOMAIN: 'jiechat.up.railway.app' };
  assert.equal(resolvePublicBaseUrl(env, 4001), 'https://jiechat.up.railway.app');
});

test('resolveLivechatBackendUrl falls back to the public base when no explicit backend URL is set', () => {
  const env = { PUBLIC_BASE_URL: 'https://jiechat.up.railway.app' };
  assert.equal(resolveLivechatBackendUrl(env, 'https://jiechat.up.railway.app', 'http://127.0.0.1:4000'), 'https://jiechat.up.railway.app');
});

test('resolvePublicBaseUrl keeps localhost fallback when no hosted env is available', () => {
  const env = { PORT: '4001' };
  assert.equal(resolvePublicBaseUrl(env, 4001), 'http://localhost:4001');
});
