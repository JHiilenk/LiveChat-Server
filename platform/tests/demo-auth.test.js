const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveDemoAuthDefaults } = require('../lib/demo-auth');

test('resolveDemoAuthDefaults seeds DEWI credentials for the demo tenant', () => {
  const resolved = resolveDemoAuthDefaults('DEWI', null, {
    demoTenantCode: 'DEWI',
    ownerName: 'dewi',
    ownerPassword: 'admin123',
    adminName: 'admin',
    adminPassword: 'admin123',
    hashPassword: (value) => `hash:${value}`
  });

  assert.ok(resolved);
  assert.equal(resolved.ownerName, 'dewi');
  assert.equal(resolved.ownerPasswordHash, 'hash:admin123');
  assert.equal(resolved.adminPasswordHash, 'hash:admin123');
  assert.equal(resolved.admins[0].name, 'admin');
});
