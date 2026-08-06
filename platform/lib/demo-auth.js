const sanitizeName = (value) => String(value || '').trim().replace(/\s+/g, ' ').slice(0, 48);
const sanitizeCode = (value, fallback) => {
  const code = String(value || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  return code || fallback;
};
const nameKey = (value) => sanitizeName(value).toLowerCase().replace(/[^a-z0-9]+/g, '');

const resolveDemoAuthDefaults = (tenantCode, existingAuth = null, overrides = {}) => {
  const safeTenantCode = sanitizeCode(tenantCode || 'DEWI', 'DEWI');
  const demoTenantCode = sanitizeCode(overrides.demoTenantCode || safeTenantCode, safeTenantCode);
  const ownerName = sanitizeName(overrides.ownerName || (demoTenantCode === 'DEWI' ? 'dewi' : 'owner'));
  const ownerPassword = String(overrides.ownerPassword || 'admin123');
  const adminName = sanitizeName(overrides.adminName || 'admin');
  const adminPassword = String(overrides.adminPassword || 'admin123');
  const hashPassword = overrides.hashPassword || ((value) => value);

  return {
    teamCode: demoTenantCode,
    ownerName,
    ownerPasswordHash: hashPassword(ownerPassword),
    adminPasswordHash: hashPassword(adminPassword),
    admins: [
      { key: nameKey(adminName), name: adminName }
    ],
    operators: [],
    ownerKey: nameKey(ownerName),
    authVersion: 2,
    createdAt: existingAuth?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

module.exports = {
  resolveDemoAuthDefaults
};
