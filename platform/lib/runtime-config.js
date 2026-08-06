const getEnvValue = (env, key) => String(env?.[key] || "").trim();

const normalizeBaseUrl = (value, fallback) => {
  if (!value) return fallback;
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

const resolvePublicBaseUrl = (env = process.env, fallbackPort = 4001) => {
  const explicitValue = getEnvValue(env, 'PUBLIC_BASE_URL');
  if (explicitValue) {
    return normalizeBaseUrl(explicitValue, `http://localhost:${fallbackPort}`);
  }

  const railwayDomain = getEnvValue(env, 'RAILWAY_PUBLIC_DOMAIN');
  const railwayUrl = getEnvValue(env, 'RAILWAY_STATIC_URL');
  if (railwayDomain) {
    return normalizeBaseUrl(`https://${railwayDomain}`, `http://localhost:${fallbackPort}`);
  }
  if (railwayUrl) {
    return normalizeBaseUrl(railwayUrl, `http://localhost:${fallbackPort}`);
  }

  return `http://localhost:${fallbackPort}`;
};

const resolveLivechatBackendUrl = (env = process.env, publicBaseUrl, fallbackValue = 'http://127.0.0.1:4000') => {
  const explicitValue = getEnvValue(env, 'LIVECHAT_BACKEND_URL');
  if (explicitValue) {
    return normalizeBaseUrl(explicitValue, fallbackValue);
  }

  if (publicBaseUrl) {
    return normalizeBaseUrl(publicBaseUrl, fallbackValue);
  }

  return fallbackValue;
};

module.exports = {
  resolvePublicBaseUrl,
  resolveLivechatBackendUrl
};
