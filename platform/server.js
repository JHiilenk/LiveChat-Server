const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const Datastore = require("nedb-promises");
const { resolvePublicBaseUrl, resolveLivechatBackendUrl } = require("./lib/runtime-config");
require("dotenv").config();

const app = express();
const publicDirectory = path.join(__dirname, "public");
const dataDirectory = path.join(__dirname, "data");

const PORT = Number(process.env.PORT) || 4001;
const APP_NAME = process.env.APP_NAME || "JIELive Control Panel";
const APP_TAGLINE = process.env.APP_TAGLINE || "Frontend, admin, embed, dan API untuk deployment terpisah.";
const DEFAULT_LIVECHAT_BACKEND_URL = "http://127.0.0.1:4000";
const PUBLIC_BASE_URL = resolvePublicBaseUrl(process.env, PORT).replace(/\/$/, "");
const LIVECHAT_BACKEND_URL_INPUT = String(process.env.LIVECHAT_BACKEND_URL || DEFAULT_LIVECHAT_BACKEND_URL).replace(/\/$/, "");
const DEFAULT_TENANT_CODE = process.env.DEFAULT_TENANT_CODE || "JIELIVE";
const DEFAULT_TEAM_CODE = process.env.DEFAULT_TEAM_CODE || "GENERAL";
const DEFAULT_CHANNEL_CODE = process.env.DEFAULT_CHANNEL_CODE || "MAIN";
const API_PREFIX = process.env.API_PREFIX || "/api";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const AUTH_SCHEMA_VERSION = 2;
const LOGIN_WINDOW_MS = Number(process.env.LOGIN_WINDOW_MS || 10 * 60 * 1000);
const LOGIN_MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS || 6);
const LOGIN_LOCK_MS = Number(process.env.LOGIN_LOCK_MS || 15 * 60 * 1000);
const DEFAULT_OWNER_USERNAME = process.env.DEFAULT_OWNER_USERNAME || "owner";
const DEFAULT_ADMIN_USERNAME = process.env.DEFAULT_ADMIN_USERNAME || "admin";
const DEFAULT_OWNER_PASSWORD = process.env.DEFAULT_OWNER_PASSWORD || "admin123";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
const FREE_TRIAL_DAYS = Math.max(Number(process.env.FREE_TRIAL_DAYS || 30), 1);
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const runtimeWarnings = [];

const getSafeAbsoluteUrl = (value, fallback, warningLabel) => {
  try {
    const parsed = new URL(String(value || fallback));
    return parsed.toString().replace(/\/$/, "");
  } catch {
    runtimeWarnings.push(`${warningLabel} invalid, falling back to ${fallback}`);
    return new URL(fallback).toString().replace(/\/$/, "");
  }
};

const LIVECHAT_BACKEND_URL = resolveLivechatBackendUrl(
  process.env,
  PUBLIC_BASE_URL,
  DEFAULT_LIVECHAT_BACKEND_URL
);

const buildRuntimeWarnings = () => {
  const warnings = [...runtimeWarnings];

  if (!String(process.env.PUBLIC_BASE_URL || "").trim()) {
    warnings.push("PUBLIC_BASE_URL not set; using localhost default");
  }

  if (!String(process.env.APP_NAME || "").trim()) {
    warnings.push("APP_NAME not set; using default branding");
  }

  return warnings;
};

const readTemplate = (fileName) => fs.readFileSync(path.join(publicDirectory, fileName), "utf8");

const templates = {
  web: readTemplate("web.html"),
  demo: readTemplate("demo.html"),
  register: readTemplate("register.html"),
  panelPublic: readTemplate("panel-public/panel-public.html"),
  panelMaster: readTemplate("panel-master/panel-master.html"),
  admin: readTemplate("admin.html"),
  embed: readTemplate("embed.html")
};

fs.mkdirSync(dataDirectory, { recursive: true });

const tenantsDb = Datastore.create({ filename: path.join(dataDirectory, "tenants.db"), autoload: true });
const authDb = Datastore.create({ filename: path.join(dataDirectory, "tenant-auth.db"), autoload: true });
const sessionsDb = Datastore.create({ filename: path.join(dataDirectory, "platform-sessions.db"), autoload: true });
const inboxDb = Datastore.create({ filename: path.join(dataDirectory, "inbox-messages.db"), autoload: true });
const settingsDb = Datastore.create({ filename: path.join(dataDirectory, "platform-settings.db"), autoload: true });
const loginAttemptStore = new Map();
const SUBSCRIPTION_SETTINGS_DOC_KEY = "__SUBSCRIPTION_SETTINGS__";

const sanitizeName = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 48);
const sanitizeCustomerMessage = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 1200);
const sanitizeWidgetId = (value, fallback = "") => String(value || fallback || "")
  .trim()
  .toUpperCase()
  .replace(/[^A-Z0-9_-]/g, "")
  .slice(0, 32) || fallback;
const sanitizeCode = (value, fallback) => {
  const code = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return code || fallback;
};
const DEFAULT_DEMO_TENANT_CODE = sanitizeCode(process.env.DEFAULT_DEMO_TENANT_CODE || "DEWI", "DEWI");
const nameKey = (value) => sanitizeName(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
const nowIso = () => new Date().toISOString();
const parseDateMs = (value) => {
  const time = new Date(String(value || "")).getTime();
  return Number.isFinite(time) ? time : 0;
};
const addDaysIso = (baseValue, days) => new Date((parseDateMs(baseValue) || Date.now()) + (Math.max(Number(days || 0), 0) * DAY_IN_MS)).toISOString();
const addMonthsIso = (baseValue, months) => {
  const date = new Date(parseDateMs(baseValue) || Date.now());
  date.setMonth(date.getMonth() + Math.max(Number(months || 0), 0));
  return date.toISOString();
};
const MASTER_PANEL_EMAIL = sanitizeName(process.env.MASTER_PANEL_EMAIL || "master@jielive.local");
const MASTER_PANEL_PASSWORD = String(process.env.MASTER_PANEL_PASSWORD || "admin123");
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = crypto.scryptSync(String(password || ""), salt, 32).toString("hex");
  return `${salt}:${digest}`;
};
const verifyPassword = (password, hashedValue) => {
  const raw = String(hashedValue || "");
  const [salt, digest] = raw.split(":");
  if (!salt || !digest) {
    return false;
  }

  const computed = crypto.scryptSync(String(password || ""), salt, 32).toString("hex");
  const expectedBuffer = Buffer.from(digest, "hex");
  const computedBuffer = Buffer.from(computed, "hex");

  if (expectedBuffer.length !== computedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, computedBuffer);
};

const buildTenantSubscriptionState = (record = {}) => {
  const status = sanitizeName(record.status || "active").toLowerCase() || "active";
  const subscriptionMode = sanitizeName(record.subscriptionMode || (status === "trial" ? "trial" : "active")).toLowerCase() || "active";
  const createdAt = String(record.createdAt || nowIso());
  const subscriptionStartedAt = String(record.subscriptionStartedAt || createdAt || nowIso());
  const subscriptionTrialDays = Math.max(Number(record.subscriptionTrialDays || FREE_TRIAL_DAYS), 1);
  let subscriptionExpiresAt = String(record.subscriptionExpiresAt || "");

  if (!subscriptionExpiresAt && subscriptionMode === "trial") {
    subscriptionExpiresAt = addDaysIso(subscriptionStartedAt, subscriptionTrialDays);
  }

  const expiresMs = parseDateMs(subscriptionExpiresAt);
  let effectiveStatus = status;
  if ((effectiveStatus === "trial" || effectiveStatus === "active") && expiresMs > 0 && expiresMs <= Date.now()) {
    effectiveStatus = "expired";
  }

  const subscriptionAccessEnabled = effectiveStatus === "trial" || effectiveStatus === "active";
  const subscriptionDaysLeft = expiresMs > 0 ? Math.max(0, Math.ceil((expiresMs - Date.now()) / DAY_IN_MS)) : null;

  let subscriptionLabel = effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1);
  if (effectiveStatus === "trial") {
    subscriptionLabel = subscriptionDaysLeft === null ? "Trial aktif" : `Trial aktif • ${subscriptionDaysLeft} hari tersisa`;
  } else if (effectiveStatus === "active") {
    subscriptionLabel = subscriptionDaysLeft === null ? "Aktif" : `Aktif • ${subscriptionDaysLeft} hari tersisa`;
  } else if (effectiveStatus === "expired") {
    subscriptionLabel = "Kedaluwarsa";
  } else if (effectiveStatus === "suspended") {
    subscriptionLabel = "Suspended";
  }

  return {
    status: effectiveStatus,
    subscriptionMode,
    subscriptionStartedAt,
    subscriptionExpiresAt,
    subscriptionTrialDays,
    subscriptionRenewedAt: String(record.subscriptionRenewedAt || ""),
    subscriptionAccessEnabled,
    subscriptionDaysLeft,
    subscriptionLabel
  };
};

const sanitizeSubscriptionSettings = (raw = {}) => ({
  defaultTrialDays: Math.max(Number(raw.defaultTrialDays || FREE_TRIAL_DAYS), 1)
});

const getSubscriptionSettings = async () => {
  const existing = await settingsDb.findOne({ key: SUBSCRIPTION_SETTINGS_DOC_KEY });
  return sanitizeSubscriptionSettings(existing?.value || {});
};

const saveSubscriptionSettings = async (nextSettings = {}) => {
  const value = sanitizeSubscriptionSettings(nextSettings);
  await settingsDb.update(
    { key: SUBSCRIPTION_SETTINGS_DOC_KEY },
    { $set: { key: SUBSCRIPTION_SETTINGS_DOC_KEY, value, updatedAt: nowIso() } },
    { upsert: true }
  );

  return value;
};

const getRequestIp = (req) => {
  const forwarded = String(req.headers["x-forwarded-for"] || "").trim();
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return String(req.ip || req.socket?.remoteAddress || "unknown");
};

const buildLoginAttemptKey = ({ scope, tenantCode, userName, ipAddress }) => {
  const safeScope = sanitizeName(scope || "client").toLowerCase() || "client";
  const safeTenant = sanitizeCode(tenantCode || "GLOBAL", "GLOBAL");
  const safeUser = nameKey(userName || "anonymous") || "anonymous";
  const safeIp = sanitizeName(ipAddress || "unknown").toLowerCase() || "unknown";
  return `${safeScope}:${safeTenant}:${safeUser}:${safeIp}`;
};

const checkLoginLock = (attemptKey) => {
  const attempt = loginAttemptStore.get(attemptKey);
  if (!attempt) {
    return { locked: false, retryAfterSec: 0 };
  }

  const now = Date.now();
  const lockedUntilMs = Number(attempt.lockedUntilMs || 0);
  if (lockedUntilMs > now) {
    return { locked: true, retryAfterSec: Math.ceil((lockedUntilMs - now) / 1000) };
  }

  if (now - Number(attempt.firstFailedAtMs || now) > LOGIN_WINDOW_MS) {
    loginAttemptStore.delete(attemptKey);
    return { locked: false, retryAfterSec: 0 };
  }

  return { locked: false, retryAfterSec: 0 };
};

const registerFailedAttempt = (attemptKey) => {
  const now = Date.now();
  const current = loginAttemptStore.get(attemptKey);

  if (!current || now - Number(current.firstFailedAtMs || now) > LOGIN_WINDOW_MS) {
    const lockedUntilMs = LOGIN_MAX_ATTEMPTS <= 1 ? now + LOGIN_LOCK_MS : 0;
    loginAttemptStore.set(attemptKey, {
      firstFailedAtMs: now,
      failureCount: 1,
      lockedUntilMs
    });

    return {
      locked: lockedUntilMs > now,
      retryAfterSec: lockedUntilMs > now ? Math.ceil((lockedUntilMs - now) / 1000) : 0
    };
  }

  const nextFailureCount = Number(current.failureCount || 0) + 1;
  const shouldLock = nextFailureCount >= LOGIN_MAX_ATTEMPTS;
  const lockedUntilMs = shouldLock ? now + LOGIN_LOCK_MS : Number(current.lockedUntilMs || 0);
  loginAttemptStore.set(attemptKey, {
    firstFailedAtMs: Number(current.firstFailedAtMs || now),
    failureCount: nextFailureCount,
    lockedUntilMs
  });

  return {
    locked: shouldLock,
    retryAfterSec: shouldLock ? Math.ceil(LOGIN_LOCK_MS / 1000) : 0
  };
};

const clearFailedAttempts = (attemptKey) => {
  if (loginAttemptStore.has(attemptKey)) {
    loginAttemptStore.delete(attemptKey);
  }
};

const buildWidgetIdentity = (tenantCode, widgetNumber) => {
  const safeTenantCode = sanitizeCode(tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  const safeNumber = Math.max(Number(widgetNumber || 1), 1);
  return {
    widgetNumber: safeNumber,
    widgetId: `WIDGET-${String(safeNumber).padStart(4, "0")}-${safeTenantCode}`
  };
};

const getNextWidgetNumber = async () => {
  const docs = await tenantsDb.find({}).exec();
  const maxExisting = docs.reduce((maxValue, doc) => {
    const number = Number(doc?.widgetNumber || 0);
    return Number.isFinite(number) && number > maxValue ? number : maxValue;
  }, 0);

  return maxExisting + 1;
};

const buildDefaultTenantRecord = (tenantCode = DEFAULT_TENANT_CODE) => ({
  tenantCode,
  tenantName: APP_NAME,
  plan: "launch",
  status: "trial",
  publicBaseUrl: PUBLIC_BASE_URL,
  backendBaseUrl: LIVECHAT_BACKEND_URL,
  defaultTeamCode: DEFAULT_TEAM_CODE,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
  subscriptionMode: "trial",
  subscriptionStartedAt: nowIso(),
  subscriptionExpiresAt: addDaysIso(nowIso(), FREE_TRIAL_DAYS),
  subscriptionTrialDays: FREE_TRIAL_DAYS,
  widgetNumber: 1,
  widgetId: buildWidgetIdentity(tenantCode, 1).widgetId,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const buildDefaultAuthRecord = (tenantCode = DEFAULT_TENANT_CODE) => ({
  teamCode: tenantCode,
  ownerName: DEFAULT_OWNER_USERNAME,
  ownerPasswordHash: hashPassword(DEFAULT_OWNER_PASSWORD),
  adminPasswordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
  admins: [{ key: nameKey(DEFAULT_ADMIN_USERNAME), name: DEFAULT_ADMIN_USERNAME }],
  operators: [],
  authVersion: AUTH_SCHEMA_VERSION,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const normalizeCommaList = (value) => {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((entry) => sanitizeName(entry))
    .filter(Boolean);
};

const ensureAuthDocShape = (authDoc) => {
  if (!authDoc) {
    return null;
  }

  const admins = Array.isArray(authDoc.admins)
    ? authDoc.admins.filter((entry) => entry && entry.key && entry.name)
    : [];

  const operators = Array.isArray(authDoc.operators)
    ? authDoc.operators.filter((entry) => entry && entry.key && entry.name)
    : [];

  return {
    ...authDoc,
    admins,
    operators,
    adminPasswordHash: String(authDoc.adminPasswordHash || authDoc.ownerPasswordHash || ""),
    ownerName: sanitizeName(authDoc.ownerName || ""),
    ownerKey: nameKey(authDoc.ownerName || "")
  };
};

const buildTeamAuthState = (authDoc) => {
  const safeDoc = ensureAuthDocShape(authDoc);
  if (!safeDoc) {
    return { hasOwner: false, ownerName: "", adminNames: [], operatorNames: [] };
  }

  return {
    hasOwner: true,
    ownerName: safeDoc.ownerName,
    adminNames: (safeDoc.admins || []).map((entry) => entry.name),
    operatorNames: (safeDoc.operators || []).map((entry) => entry.name)
  };
};

const isLocalBackend = () => {
  try {
    const url = new URL(LIVECHAT_BACKEND_URL);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
};

const sanitizeTenantRecord = (record, fallbackCode = DEFAULT_TENANT_CODE) => {
  const tenantCode = sanitizeCode(record?.tenantCode || fallbackCode, fallbackCode);
  const now = nowIso();
  const subscription = buildTenantSubscriptionState({
    ...record,
    tenantCode,
    createdAt: String(record?.createdAt || now)
  });

  return {
    tenantCode,
    tenantName: sanitizeName(record?.tenantName || APP_NAME) || APP_NAME,
    plan: sanitizeName(record?.plan || "launch") || "launch",
    status: subscription.status,
    publicBaseUrl: String(record?.publicBaseUrl || PUBLIC_BASE_URL).replace(/\/$/, ""),
    backendBaseUrl: String(record?.backendBaseUrl || LIVECHAT_BACKEND_URL).replace(/\/$/, ""),
    defaultTeamCode: sanitizeCode(record?.defaultTeamCode || DEFAULT_TEAM_CODE, DEFAULT_TEAM_CODE),
    defaultChannelCode: sanitizeCode(record?.defaultChannelCode || DEFAULT_CHANNEL_CODE, DEFAULT_CHANNEL_CODE),
    subscriptionMode: subscription.subscriptionMode,
    subscriptionStartedAt: subscription.subscriptionStartedAt,
    subscriptionExpiresAt: subscription.subscriptionExpiresAt,
    subscriptionTrialDays: subscription.subscriptionTrialDays,
    subscriptionRenewedAt: subscription.subscriptionRenewedAt,
    subscriptionAccessEnabled: subscription.subscriptionAccessEnabled,
    subscriptionDaysLeft: subscription.subscriptionDaysLeft,
    subscriptionLabel: subscription.subscriptionLabel,
    widgetNumber: Math.max(Number(record?.widgetNumber || 1), 1),
    widgetId: sanitizeWidgetId(record?.widgetId || buildWidgetIdentity(tenantCode, record?.widgetNumber || 1).widgetId, buildWidgetIdentity(tenantCode, record?.widgetNumber || 1).widgetId),
    createdAt: String(record?.createdAt || now),
    updatedAt: now
  };
};

const getRuntimeDeploymentState = () => ({
  appName: APP_NAME,
  appTagline: APP_TAGLINE,
  port: PORT,
  publicBaseUrl: PUBLIC_BASE_URL,
  livechatBackendUrl: LIVECHAT_BACKEND_URL,
  defaultTenantCode: DEFAULT_TENANT_CODE,
  defaultTeamCode: DEFAULT_TEAM_CODE,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
  warnings: buildRuntimeWarnings()
});

const proxyBackendRequest = async (pathname, { method = "GET", body, headers = {}, contentType = "application/json" } = {}) => {
  const targetUrl = new URL(pathname, LIVECHAT_BACKEND_URL);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        ...(body ? { "Content-Type": contentType } : {}),
        ...headers
      },
      body: body ? (contentType === "application/json" ? JSON.stringify(body) : body) : undefined,
      signal: controller.signal
    });

    const text = await response.text();
    const responseContentType = response.headers.get("content-type") || contentType;
    return { ok: response.ok, status: response.status, body: text, contentType: responseContentType };
  } finally {
    clearTimeout(timeoutId);
  }
};

const proxyBackendJson = async (pathname, res) => {
  try {
    const proxied = await proxyBackendRequest(pathname);
    res.status(proxied.status).type(proxied.contentType).send(proxied.body);
  } catch (error) {
    res.status(502).json({ ok: false, message: `Backend livechat tidak terjangkau: ${error.message}` });
  }
};

const proxyBackendScript = async (pathname, res) => {
  try {
    const proxied = await proxyBackendRequest(pathname, { contentType: "application/javascript" });
    res.status(proxied.status).type("application/javascript").send(proxied.body);
  } catch (error) {
    res.status(502).type("application/javascript").send(`console.error(${JSON.stringify(`Backend livechat tidak terjangkau: ${error.message}`)});`);
  }
};

const fetchBackendJson = async (pathname) => {
  const proxied = await proxyBackendRequest(pathname);
  if (!proxied.ok) {
    throw new Error(`Backend returned HTTP ${proxied.status}`);
  }

  return JSON.parse(proxied.body || "{}");
};

const ensureSeedData = async () => {
  const defaultTenant = await tenantsDb.findOne({ tenantCode: DEFAULT_TENANT_CODE });
  if (!defaultTenant) {
    await tenantsDb.insert(buildDefaultTenantRecord(DEFAULT_TENANT_CODE));
  }

  const defaultAuth = await authDb.findOne({ teamCode: DEFAULT_TENANT_CODE });
  if (!defaultAuth) {
    await authDb.insert(buildDefaultAuthRecord(DEFAULT_TENANT_CODE));
  }

  const existingSettings = await settingsDb.findOne({ key: SUBSCRIPTION_SETTINGS_DOC_KEY });
  if (!existingSettings) {
    await saveSubscriptionSettings({ defaultTrialDays: FREE_TRIAL_DAYS });
  }
};

const getTenantSummaryList = async () => {
  const docs = await tenantsDb.find({}).sort({ updatedAt: -1 }).exec();
  return docs.map((doc) => sanitizeTenantRecord(doc, doc?.tenantCode || DEFAULT_TENANT_CODE));
};

const getTenantBootstrap = async (tenantCode) => {
  const tenant = await getTenantRecord(tenantCode);
  const auth = await getAuthRecord(tenant.tenantCode);

  let backendConfigs = {
    loginConfig: null,
    simulationConfig: null,
    uploadConfig: null,
    directAdminConfig: null,
    realMembers: []
  };

  if (isLocalBackend()) {
    try {
      const [loginConfig, simulationConfig, uploadConfig, directAdminConfig, realMembers] = await Promise.all([
        fetchBackendJson("/api/login-config"),
        fetchBackendJson("/api/simulation-config"),
        fetchBackendJson("/api/upload-config"),
        fetchBackendJson("/api/direct-admin-config"),
        fetchBackendJson(`/api/real-members?teamCode=${encodeURIComponent(tenant.defaultTeamCode)}`)
      ]);

      backendConfigs = {
        loginConfig,
        simulationConfig,
        uploadConfig,
        directAdminConfig,
        realMembers: Array.isArray(realMembers?.members) ? realMembers.members : []
      };
    } catch {
      backendConfigs = {
        loginConfig: null,
        simulationConfig: null,
        uploadConfig: null,
        directAdminConfig: null,
        realMembers: []
      };
    }
  }

  return {
    ok: true,
    tenant,
    subscription: {
      status: tenant.status,
      accessEnabled: tenant.subscriptionAccessEnabled,
      startedAt: tenant.subscriptionStartedAt,
      expiresAt: tenant.subscriptionExpiresAt,
      trialDays: tenant.subscriptionTrialDays,
      daysLeft: tenant.subscriptionDaysLeft,
      label: tenant.subscriptionLabel
    },
    auth: buildTeamAuthState(auth),
    backend: {
      baseUrl: LIVECHAT_BACKEND_URL,
      available: isLocalBackend(),
      ...backendConfigs
    },
    surfaces: {
      web: PUBLIC_BASE_URL,
      admin: `${PUBLIC_BASE_URL}/admin`,
      embed: `${PUBLIC_BASE_URL}/embed`,
      api: `${PUBLIC_BASE_URL}/api/v1/status`
    }
  };
};

const getTenantRecord = async (tenantCode) => {
  const safeTenantCode = sanitizeCode(tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  const existing = await tenantsDb.findOne({ tenantCode: safeTenantCode });
  if (existing) {
    return sanitizeTenantRecord(existing, safeTenantCode);
  }

  const widgetNumber = await getNextWidgetNumber();
  const created = sanitizeTenantRecord({
    ...buildDefaultTenantRecord(safeTenantCode),
    widgetNumber,
    widgetId: buildWidgetIdentity(safeTenantCode, widgetNumber).widgetId
  }, safeTenantCode);
  await tenantsDb.insert(created);
  return created;
};

const getAuthRecord = async (tenantCode) => {
  const safeTenantCode = sanitizeCode(tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  const existing = await authDb.findOne({ teamCode: safeTenantCode });
  if (existing) {
    return ensureAuthDocShape(existing);
  }

  const created = ensureAuthDocShape(buildDefaultAuthRecord(safeTenantCode));
  await authDb.insert(created);
  return created;
};

const saveTenantRecord = async (tenantCode, nextRecord) => {
  const safeTenantCode = sanitizeCode(tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  const current = await getTenantRecord(safeTenantCode);
  const currentWidgetNumber = Math.max(Number(current.widgetNumber || 1), 1);
  const currentWidgetIdentity = buildWidgetIdentity(safeTenantCode, currentWidgetNumber);
  const updated = sanitizeTenantRecord({
    ...current,
    ...nextRecord,
    tenantCode: safeTenantCode,
    widgetNumber: currentWidgetIdentity.widgetNumber,
    widgetId: sanitizeWidgetId(current.widgetId || currentWidgetIdentity.widgetId, currentWidgetIdentity.widgetId)
  }, safeTenantCode);

  await tenantsDb.update(
    { tenantCode: safeTenantCode },
    { $set: updated },
    { upsert: true }
  );

  return updated;
};

const saveAuthRecord = async (tenantCode, nextRecord) => {
  const safeTenantCode = sanitizeCode(tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  const current = await getAuthRecord(safeTenantCode);
  const nextAdmins = Array.isArray(nextRecord.admins)
    ? nextRecord.admins
    : normalizeCommaList(nextRecord.adminNames).map((name) => ({ key: nameKey(name), name }));

  const nextOperators = Array.isArray(nextRecord.operators)
    ? nextRecord.operators
    : normalizeCommaList(nextRecord.operatorNames).map((name) => ({ key: nameKey(name), name }));

  const updated = ensureAuthDocShape({
    ...current,
    ...nextRecord,
    teamCode: safeTenantCode,
    ownerName: sanitizeName(nextRecord.ownerName || current.ownerName || DEFAULT_OWNER_USERNAME),
    ownerPasswordHash: nextRecord.ownerPassword ? hashPassword(String(nextRecord.ownerPassword)) : current.ownerPasswordHash,
    adminPasswordHash: nextRecord.adminPassword ? hashPassword(String(nextRecord.adminPassword)) : current.adminPasswordHash,
    admins: nextAdmins,
    operators: nextOperators,
    updatedAt: nowIso()
  });

  await authDb.update(
    { teamCode: safeTenantCode },
    { $set: updated },
    { upsert: true }
  );

  return updated;
};

const getSessionFromRequest = async (req) => {
  const bearer = String(req.headers.authorization || "").trim();
  const sessionToken = String(req.headers["x-platform-session"] || "").trim() || (bearer.toLowerCase().startsWith("bearer ") ? bearer.slice(7).trim() : "");
  if (!sessionToken) {
    return null;
  }

  const session = await sessionsDb.findOne({ token: sessionToken });
  if (!session) {
    return null;
  }

  if (session.expiresAt && Date.now() > new Date(session.expiresAt).getTime()) {
    await sessionsDb.remove({ token: sessionToken }, { multi: true });
    return null;
  }

  return session;
};

const createSession = async ({ tenantCode, userName, role }) => {
  const token = crypto.randomBytes(24).toString("hex");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  await sessionsDb.insert({ token, tenantCode, userName, role, createdAt, expiresAt });
  return { token, createdAt, expiresAt };
};

const createScopedSession = async ({ tenantCode, userName, role, scope }) => {
  const safeScope = sanitizeName(scope || "client") || "client";
  const safeTenantCode = sanitizeCode(tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  const safeUserName = sanitizeName(userName || "") || "system";

  await sessionsDb.remove({
    tenantCode: safeTenantCode,
    userName: safeUserName,
    scope: safeScope
  }, { multi: true });

  const session = await createSession({ tenantCode, userName, role });
  await sessionsDb.update(
    { token: session.token },
    { $set: { scope: safeScope } },
    { upsert: false }
  );

  return { ...session, scope: safeScope };
};

const requireAdminSession = async (req, res, next) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ ok: false, message: "Sesi admin tidak valid." });
      return;
    }

    req.platformSession = session;
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memeriksa sesi admin: ${error.message}` });
  }
};

const requireScopedSession = (expectedScopes = []) => async (req, res, next) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ ok: false, message: "Sesi tidak valid." });
      return;
    }

    const scope = sanitizeName(session.scope || "client") || "client";
    if (Array.isArray(expectedScopes) && expectedScopes.length > 0 && !expectedScopes.includes(scope)) {
      res.status(403).json({ ok: false, message: "Akses tidak diizinkan untuk sesi ini." });
      return;
    }

    req.platformSession = { ...session, scope };
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memeriksa sesi: ${error.message}` });
  }
};

const renderTemplate = (template, extraValues = {}) => {
  const replacements = {
    __APP_NAME__: APP_NAME,
    __APP_TAGLINE__: APP_TAGLINE,
    __PUBLIC_BASE_URL__: PUBLIC_BASE_URL,
    __API_PREFIX__: API_PREFIX,
    __DEFAULT_TENANT_CODE__: DEFAULT_TENANT_CODE,
    __DEFAULT_TEAM_CODE__: DEFAULT_TEAM_CODE,
    __DEFAULT_CHANNEL_CODE__: DEFAULT_CHANNEL_CODE,
    ...extraValues
  };

  return Object.entries(replacements).reduce((html, [key, value]) => {
    return html.replaceAll(key, String(value));
  }, template);
};

const getRequestPublicBaseUrl = (req) => {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const forwardedHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim();
  const host = String(req.headers.host || "").trim();
  const protocol = forwardedProto || (req.protocol || "https");
  const targetHost = forwardedHost || host;

  if (!targetHost) {
    return PUBLIC_BASE_URL;
  }

  return `${protocol}://${targetHost}`.replace(/\/$/, "");
};

const apiSurface = {
  appName: APP_NAME,
  appTagline: APP_TAGLINE,
  publicBaseUrl: PUBLIC_BASE_URL,
  defaultTenantCode: DEFAULT_TENANT_CODE,
  defaultTeamCode: DEFAULT_TEAM_CODE,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
  surfaces: ["web", "admin", "embed", "api"]
};

const buildClientPanelTemplateValues = (panelAlias = "client") => {
  const safeAlias = sanitizeName(panelAlias || "client") || "client";
  const prettyAlias = safeAlias.replace(/^client/i, "Client ").replace(/\s+/g, " ").trim();

  return {
    __PANEL_ALIAS__: safeAlias,
    __PANEL_TITLE__: `${prettyAlias} Panel`,
    __PANEL_SUBTITLE__: `Panel operasional tenant livechat untuk ${prettyAlias.toLowerCase()}`,
    __PANEL_HINT__: `Login ${prettyAlias.toLowerCase()} memakai username masing-masing. ID dan number sistem dibuat otomatis.`
  };
};

const buildPanelPublicContent = (panelRole = "client", panelAlias = "client") => {
  if (panelRole === "master") {
    return `
      <section class="hq-grid">
        <article class="hq-card hq-card-hero">
          <span class="hq-chip">Provider Control</span>
          <h2>Kontrol penuh semua panel client dari satu dashboard.</h2>
          <p>Master Internal dipisahkan dari panel group lama. Di sini kamu bisa lihat tenant, backend status, sesi aktif, serta kesiapan deploy per client.</p>
          <form class="hq-form" data-master-login-form>
            <label>Email Master
              <input type="email" name="email" placeholder="master@jielive.local" required />
            </label>
            <label>Password Master
              <input type="password" name="password" placeholder="••••••••" required />
            </label>
            <button type="submit">Masuk Master Internal</button>
          </form>
          <p class="hq-note" data-master-login-status>Belum login.</p>
        </article>

        <article class="hq-card">
          <h3>Perpanjang Langganan</h3>
          <form class="hq-form" data-master-renew-form>
            <label>Tenant Code
              <input type="text" name="tenantCode" placeholder="JIELIVE" required />
            </label>
            <label>Durasi (bulan)
              <input type="number" name="months" min="1" step="1" value="1" required />
            </label>
            <button type="submit">Perpanjang Akses</button>
          </form>
          <p class="hq-note" data-master-renew-status>Belum ada perpanjangan.</p>
        </article>

        <article class="hq-card">
          <h3>Trial Gratis Awal</h3>
          <form class="hq-form" data-master-trial-settings-form>
            <label>Durasi trial default (hari)
              <input type="number" name="defaultTrialDays" min="1" step="1" value="30" required />
            </label>
            <button type="submit">Simpan Pengaturan Trial</button>
          </form>
          <p class="hq-note">Default trial aktif saat ini: <strong data-master-trial-days>30</strong> hari.</p>
          <p class="hq-note" data-master-trial-settings-status>Belum ada perubahan pengaturan trial.</p>
        </article>

        <article class="hq-card">
          <h3>Registrasi Client</h3>
          <form class="hq-form" data-master-client-register-form>
            <label>Nama Client
              <input type="text" name="tenantName" placeholder="Client A" required />
            </label>
            <label>Username Client
              <input type="text" name="userName" placeholder="clienta" required />
            </label>
            <label>Password Client
              <input type="password" name="password" placeholder="••••••••" required />
            </label>
            <button type="submit">Daftarkan Client</button>
          </form>
          <p class="hq-note">Tenant baru otomatis mendapat trial gratis sesuai pengaturan master.</p>
          <p class="hq-note" data-master-client-register-status>Belum ada registrasi baru.</p>
        </article>

        <article class="hq-card">
          <h3>Global Stats</h3>
          <div class="hq-stats">
            <div><strong data-master-tenant-count>0</strong><span>Tenant</span></div>
            <div><strong data-master-active-tenant-count>0</strong><span>Tenant Aktif</span></div>
            <div><strong data-master-client-sessions>0</strong><span>Sesi Client</span></div>
            <div><strong data-master-backend-state>unknown</strong><span>Backend State</span></div>
          </div>
        </article>

        <article class="hq-card hq-card-wide">
          <div class="hq-row-head">
            <h3>Daftar Client Tenant</h3>
            <button type="button" data-master-refresh>Refresh</button>
          </div>
          <div class="hq-table-wrap">
            <table class="hq-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Widget</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Langganan</th>
                  <th>Demo</th>
                  <th>Backend</th>
                </tr>
              </thead>
              <tbody data-master-tenant-rows>
                <tr><td colspan="9">Login master untuk melihat tenant.</td></tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="hq-card">
          <h3>Deploy Warnings</h3>
          <ul class="hq-list" data-master-warnings>
            <li>Belum ada data warning.</li>
          </ul>
        </article>
      </section>
    `;
  }

  const safeAlias = sanitizeName(panelAlias || "client") || "client";
  const prettyAlias = safeAlias.replace(/^client/i, "Client ").replace(/\s+/g, " ").trim();

  return `
      <section class="hq-grid">
        <article class="hq-card hq-card-hero">
          <span class="hq-chip">Tenant Control</span>
          <h2>Panel client berbeda dari panel group lama.</h2>
          <p>Client Panel fokus untuk tenant: status backend, identitas channel default, status langganan, dan snippet embed siap tempel.</p>
          <form class="hq-form" data-client-login-form>
            <label>Tenant Code
              <input type="text" name="tenantCode" placeholder="JIELIVE" required />
            </label>
            <label>Username Client
              <input type="text" name="userName" placeholder="admin" required />
            </label>
            <label>Password
              <input type="password" name="password" placeholder="••••••••" required />
            </label>
            <button type="submit">Masuk Client Panel</button>
          </form>
          <p class="hq-note">Login ${prettyAlias.toLowerCase()} memakai username masing-masing. ID dan number sistem dibuat otomatis, dan akses fitur mengikuti status langganan tenant.</p>
          <p class="hq-note" data-client-login-status>Belum login.</p>
        </article>

        <article class="hq-card">
          <h3>Tenant Summary</h3>
          <div class="hq-summary">
            <p><strong>Kode:</strong> <span data-client-tenant-code>-</span></p>
            <p><strong>Nama:</strong> <span data-client-tenant-name>-</span></p>
            <p><strong>Plan:</strong> <span data-client-tenant-plan>-</span></p>
            <p><strong>Status:</strong> <span data-client-tenant-status>-</span></p>
            <p><strong>Langganan:</strong> <span data-client-subscription-label>-</span></p>
            <p><strong>Berakhir:</strong> <span data-client-subscription-expires-at>-</span></p>
            <p><strong>ID Sistem:</strong> <span data-client-widget-id>-</span></p>
            <p><strong>Nomor Sistem:</strong> <span data-client-widget-number>-</span></p>
            <p><strong>Team default:</strong> <span data-client-tenant-team>-</span></p>
            <p><strong>Channel default:</strong> <span data-client-tenant-channel>-</span></p>
          </div>
        </article>

        <article class="hq-card">
          <h3>Status Akses</h3>
          <p class="hq-note" data-client-access-message>Memuat status akses...</p>
        </article>

        <article class="hq-card hq-card-wide">
          <div class="hq-row-head">
            <h3>Snippet Embed Client</h3>
            <button type="button" data-client-copy-snippet>Copy Snippet</button>
          </div>
          <pre class="hq-code" data-client-snippet>// Login client dulu untuk mendapatkan snippet embed</pre>
        </article>

        <article class="hq-card">
          <h3>Backend & Auth</h3>
          <ul class="hq-list">
            <li>Backend: <span data-client-backend-url>-</span></li>
            <li>Backend state: <span data-client-backend-state>-</span></li>
            <li>Owner: <span data-client-owner-name>-</span></li>
            <li>Admin names: <span data-client-admin-names>-</span></li>
            <li>Operator names: <span data-client-operator-names>-</span></li>
          </ul>
        </article>

        <article class="hq-card hq-card-wide">
          <div class="hq-row-head">
            <h3>Kotak Masuk Customer</h3>
            <button type="button" data-client-refresh-inbox>Refresh Inbox</button>
          </div>
          <div class="hq-table-wrap">
            <table class="hq-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Nama</th>
                  <th>Widget</th>
                  <th>Pesan</th>
                  <th>Sumber</th>
                </tr>
              </thead>
              <tbody data-client-inbox-rows>
                <tr><td colspan="5">Login client dulu untuk melihat inbox customer.</td></tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `;
};

const registerClientTenant = async (input = {}) => {
  const ownerName = sanitizeName(input.ownerName || input.userName || input.tenantName || "") || "client";
  const ownerPassword = String(input.ownerPassword || input.password || "").trim();
  const tenantName = sanitizeName(input.tenantName || ownerName) || ownerName;
  const baseTenantCode = sanitizeCode(input.tenantCode || ownerName || tenantName, DEFAULT_TENANT_CODE);
  const subscriptionSettings = await getSubscriptionSettings();
  const trialDays = Math.max(Number(input.subscriptionTrialDays || subscriptionSettings.defaultTrialDays || FREE_TRIAL_DAYS), 1);

  if (!ownerName || !ownerPassword) {
    const error = new Error("Username client dan password wajib diisi.");
    error.statusCode = 400;
    throw error;
  }

  const tenantCode = await buildUniqueTenantCode(baseTenantCode);
  const tenant = await saveTenantRecord(tenantCode, {
    tenantName,
    plan: sanitizeName(input.plan || "launch") || "launch",
    status: "trial",
    subscriptionMode: "trial",
    subscriptionStartedAt: nowIso(),
    subscriptionExpiresAt: addDaysIso(nowIso(), trialDays),
    subscriptionTrialDays: trialDays,
    defaultTeamCode: sanitizeCode(input.defaultTeamCode || tenantCode, tenantCode),
    defaultChannelCode: sanitizeCode(input.defaultChannelCode || DEFAULT_CHANNEL_CODE, DEFAULT_CHANNEL_CODE)
  });

  const auth = await saveAuthRecord(tenant.tenantCode, {
    ownerName,
    ownerPassword,
    adminNames: Array.isArray(input.adminNames) ? input.adminNames : [],
    operatorNames: Array.isArray(input.operatorNames) ? input.operatorNames : []
  });

  const session = await createScopedSession({
    tenantCode: tenant.tenantCode,
    userName: ownerName,
    role: "owner",
    scope: "client"
  });

  return {
    tenant,
    auth: buildTeamAuthState(auth),
    session,
    subscriptionSettings,
    widget: {
      chatUrl: `${PUBLIC_BASE_URL}/embed?livechat=1&tenantCode=${encodeURIComponent(tenant.tenantCode)}&widgetId=${encodeURIComponent(tenant.widgetId)}&widgetNumber=${encodeURIComponent(tenant.widgetNumber)}`,
      scriptUrl: `${PUBLIC_BASE_URL}/widget.js`,
      widgetId: tenant.widgetId,
      widgetNumber: tenant.widgetNumber,
      snippet: `<script src="${PUBLIC_BASE_URL}/widget.js" data-chat-url="${PUBLIC_BASE_URL}/embed?livechat=1&tenantCode=${encodeURIComponent(tenant.tenantCode)}&widgetId=${encodeURIComponent(tenant.widgetId)}&widgetNumber=${encodeURIComponent(tenant.widgetNumber)}" data-title="${tenant.tenantName}" data-subtitle="${tenant.defaultTeamCode} • ${tenant.defaultChannelCode}" data-widget-id="${tenant.widgetId}" data-widget-number="${tenant.widgetNumber}"></script>`
    }
  };
};

const buildPanelPublicTemplateValues = (panelRole = "client", panelAlias = "client") => {
  const safeRole = sanitizeName(panelRole || "client") || "client";
  const safeAlias = sanitizeName(panelAlias || safeRole) || safeRole;
  const prettyAlias = safeAlias.replace(/^client/i, "Client ").replace(/\s+/g, " ").trim();
  const panelTitle = safeRole === "master"
    ? "Master Internal"
    : `${prettyAlias} Panel`;

  return {
    __PANEL_ROLE__: safeRole,
    __PANEL_ALIAS__: safeAlias,
    __PANEL_TITLE__: panelTitle,
    __PANEL_SUBTITLE__: safeRole === "master"
      ? "Pusat kontrol provider livechat"
      : `Panel operasional tenant livechat untuk ${prettyAlias.toLowerCase()}`,
    __PANEL_HINT__: safeRole === "master"
      ? "Master hanya untuk internal agent. Registrasi client dilakukan dari sini dan otomatis tampil di daftar tenant."
      : `Login ${prettyAlias.toLowerCase()} memakai username masing-masing. ID dan number sistem dibuat otomatis.`,
    __PANEL_BODY__: buildPanelPublicContent(safeRole, safeAlias)
  };
};

const buildDemoTemplateValues = async (requestedTenantCode = "") => {
  const desiredTenantCode = sanitizeCode(requestedTenantCode || DEFAULT_DEMO_TENANT_CODE, DEFAULT_DEMO_TENANT_CODE);
  const hasDesiredTenant = await tenantsDb.findOne({ tenantCode: desiredTenantCode });
  const tenantCode = hasDesiredTenant ? desiredTenantCode : DEFAULT_TENANT_CODE;
  const tenant = await getTenantRecord(tenantCode);
  const brandName = tenant.tenantCode === DEFAULT_DEMO_TENANT_CODE
    ? `${tenant.tenantName} Fashion`
    : "Distro Tangerang Murah";
  const isDewiDemo = tenant.tenantCode === DEFAULT_DEMO_TENANT_CODE;

  return {
    __DEMO_CLIENT_NAME__: tenant.tenantName,
    __DEMO_BRAND_NAME__: brandName,
    __DEMO_TENANT_CODE__: tenant.tenantCode,
    __DEMO_WIDGET_TITLE__: brandName,
    __DEMO_WIDGET_SUBTITLE__: "Tanya stok, size, dan reseller",
    __DEMO_WIDGET_CHAT_URL__: `/embed?livechat=1&tenantCode=${encodeURIComponent(tenant.tenantCode)}&widgetId=${encodeURIComponent(tenant.widgetId)}&widgetNumber=${encodeURIComponent(tenant.widgetNumber)}`,
    __DEMO_HEADLINE__: isDewiDemo
      ? "Dewi Langit jual baju distro murah Tangerang dengan chat order yang langsung nyambung"
      : "Baju distro murah Tangerang untuk stok harian cepat jalan",
    __DEMO_INTRO__: isDewiDemo
      ? "Dewi Langit Fashion fokus ke kaos casual, hoodie trend, dan paket reseller lokal Tangerang. Landing ini langsung terhubung ke widget live chat supaya calon pembeli bisa tanya stok, ukuran, dan ongkir tanpa pindah aplikasi."
      : "Koleksi kaos oversize, hoodie, celana cargo, dan paket reseller untuk pasar lokal Tangerang. Landing ini dibuat sebagai demo client yang langsung terhubung ke live chat widget supaya calon pembeli bisa tanya stok, ukuran, dan ongkir tanpa pindah aplikasi.",
    __DEMO_SUPPORT_COPY__: isDewiDemo
      ? "Gunakan widget di pojok kanan bawah untuk simulasi pertanyaan buyer seperti stok size L, warna ready, paket reseller, atau ongkir area Tangerang."
      : "Gunakan widget di pojok kanan bawah untuk simulasi pertanyaan seperti stok size L, paket reseller, atau ongkir area Tangerang.",
    __DEMO_PRICE_1_TITLE__: isDewiDemo ? "Kaos Sky Basic" : "Kaos Harian",
    __DEMO_PRICE_1_COPY__: isDewiDemo ? "Kaos combed harian untuk buyer yang cari model simpel, adem, dan cepat repeat order." : "Kaos combed 24s, ukuran M sampai XXL, cocok untuk jual cepat marketplace.",
    __DEMO_PRICE_2_TITLE__: isDewiDemo ? "Paket Reseller Dewi" : "Paket Reseller",
    __DEMO_PRICE_2_COPY__: isDewiDemo ? "Paket 3 pcs mix warna netral, cocok untuk reseller pemula di area Tangerang dan sekitarnya." : "3 pcs mix model, dapat foto katalog, siap jual ulang untuk area Tangerang.",
    __DEMO_PRICE_3_TITLE__: isDewiDemo ? "Hoodie Langit Street" : "Hoodie Street",
    __DEMO_PRICE_3_COPY__: isDewiDemo ? "Hoodie ringan dengan potongan longgar untuk pembeli yang suka look santai tapi tetap rapi." : "Fleece halus, potongan longgar, salah satu produk yang sering dicari pembeli muda.",
    __DEMO_PRICE_4_TITLE__: isDewiDemo ? "Chat Order Grosir" : "Drop Grosir",
    __DEMO_PRICE_4_COPY__: isDewiDemo ? "Semua permintaan partai, restock warna, dan sizing besar diarahkan langsung ke live chat admin Dewi Langit." : "Konsultasi langsung via live chat untuk stok partai, warna, dan jadwal restock.",
    __DEMO_CONTACT_COPY__: isDewiDemo ? "Landing ini menunjukkan bagaimana brand Dewi Langit bisa punya halaman promosi sendiri, tetap memakai widget sistem, dan semua chat masuk otomatis ke panel client tenant DEWI." : "Halaman ini mencontohkan bagaimana client fashion bisa punya landing sendiri, tetap memakai widget yang disediakan sistem, dan semua chat masuk otomatis ke panel client sesuai tenant."
  };
};

const buildUniqueTenantCode = async (rawValue) => {
  const baseCode = sanitizeCode(rawValue || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
  let candidate = baseCode;
  let counter = 1;

  while (await tenantsDb.findOne({ tenantCode: candidate })) {
    counter += 1;
    candidate = sanitizeCode(`${baseCode}-${counter}`, baseCode);
    if (candidate === baseCode && counter > 2) {
      candidate = sanitizeCode(`${baseCode}${counter}`, baseCode);
    }

    if (counter > 1000) {
      throw new Error("Gagal membuat tenant code unik.");
    }
  }

  return candidate;
};

const buildMasterOverview = async () => {
  const tenants = await getTenantSummaryList();
  const authDocs = await authDb.find({}).exec();
  const sessions = await sessionsDb.find({}).exec();
  const activeSessions = sessions.filter((entry) => entry?.expiresAt && new Date(entry.expiresAt).getTime() > Date.now());
  const authByTeamCode = new Map(authDocs.map((doc) => [doc.teamCode, ensureAuthDocShape(doc)]));
  const subscriptionSettings = await getSubscriptionSettings();

  return {
    ok: true,
    runtime: getRuntimeDeploymentState(),
    settings: {
      subscription: subscriptionSettings
    },
    stats: {
      tenantCount: tenants.length,
      activeTenantCount: tenants.filter((entry) => entry.subscriptionAccessEnabled).length,
      authProfiles: authDocs.length,
      activeSessions: activeSessions.length,
      clientSessions: activeSessions.filter((entry) => sanitizeName(entry.scope || "client") === "client").length,
      masterSessions: activeSessions.filter((entry) => sanitizeName(entry.scope || "client") === "master").length
    },
    tenants: tenants.map((tenant) => ({
      tenantCode: tenant.tenantCode,
      tenantName: tenant.tenantName,
      ownerName: authByTeamCode.get(tenant.tenantCode)?.ownerName || "",
      plan: tenant.plan,
      status: tenant.status,
      subscriptionMode: tenant.subscriptionMode,
      subscriptionStartedAt: tenant.subscriptionStartedAt,
      subscriptionExpiresAt: tenant.subscriptionExpiresAt,
      subscriptionTrialDays: tenant.subscriptionTrialDays,
      subscriptionRenewedAt: tenant.subscriptionRenewedAt,
      subscriptionAccessEnabled: tenant.subscriptionAccessEnabled,
      subscriptionDaysLeft: tenant.subscriptionDaysLeft,
      subscriptionLabel: tenant.subscriptionLabel,
      demoUrl: `${tenant.publicBaseUrl || PUBLIC_BASE_URL}/demo?tenantCode=${encodeURIComponent(tenant.tenantCode)}`,
      backendBaseUrl: tenant.backendBaseUrl,
      publicBaseUrl: tenant.publicBaseUrl,
      widgetId: tenant.widgetId,
      widgetNumber: tenant.widgetNumber,
      defaultTeamCode: tenant.defaultTeamCode,
      defaultChannelCode: tenant.defaultChannelCode,
      updatedAt: tenant.updatedAt
    }))
  };
};

const resolveSurfaceFromHost = (hostname = "") => {
  const host = hostname.split(":")[0].toLowerCase();

  if (host.startsWith("admin.")) {
    return "admin";
  }

  if (host.startsWith("panel.")) {
    return "admin";
  }

  if (host.startsWith("embed.") || host.startsWith("widget.")) {
    return "embed";
  }

  if (host.startsWith("api.")) {
    return "api";
  }

  return "web";
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "200kb" }));
app.use(morgan("tiny"));
app.use(express.static(publicDirectory, { index: false }));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, service: APP_NAME, mode: "split-scaffold", timestamp: new Date().toISOString(), warnings: buildRuntimeWarnings() });
});

app.get("/api/v1/deploy-check", async (_req, res) => {
  try {
    const backendOk = await proxyBackendRequest("/healthz")
      .then((response) => response.ok)
      .catch(() => false);

    res.json({
      ok: true,
      runtime: getRuntimeDeploymentState(),
      backendOk,
      readyForDeploy: backendOk || LIVECHAT_BACKEND_URL.includes("localhost") || LIVECHAT_BACKEND_URL.includes("127.0.0.1")
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Deploy check gagal: ${error.message}` });
  }
});

app.get("/api/v1/bootstrap", async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.query?.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const bootstrap = await getTenantBootstrap(tenantCode);
    res.json({ ...bootstrap, runtime: getRuntimeDeploymentState() });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat bootstrap: ${error.message}` });
  }
});

app.get("/api/v1/tenants", async (_req, res) => {
  try {
    const tenants = await getTenantSummaryList();
    res.json({
      ok: true,
      tenants: tenants.map((tenant) => ({
        tenantCode: tenant.tenantCode,
        tenantName: tenant.tenantName,
        ownerName: tenant.ownerName || "",
        plan: tenant.plan,
        status: tenant.status,
        subscriptionMode: tenant.subscriptionMode,
        subscriptionStartedAt: tenant.subscriptionStartedAt,
        subscriptionExpiresAt: tenant.subscriptionExpiresAt,
        subscriptionTrialDays: tenant.subscriptionTrialDays,
        subscriptionRenewedAt: tenant.subscriptionRenewedAt,
        subscriptionAccessEnabled: tenant.subscriptionAccessEnabled,
        subscriptionDaysLeft: tenant.subscriptionDaysLeft,
        subscriptionLabel: tenant.subscriptionLabel,
        publicBaseUrl: tenant.publicBaseUrl,
        backendBaseUrl: tenant.backendBaseUrl,
        widgetId: tenant.widgetId,
        widgetNumber: tenant.widgetNumber,
        defaultTeamCode: tenant.defaultTeamCode,
        defaultChannelCode: tenant.defaultChannelCode,
        updatedAt: tenant.updatedAt
      })),
      runtime: getRuntimeDeploymentState()
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat daftar tenant: ${error.message}` });
  }
});

app.post("/api/v1/tenants", requireScopedSession(["master"]), async (req, res) => {
  try {
    const registered = await registerClientTenant(req.body || {});
    res.status(201).json({ ok: true, tenant: registered.tenant, auth: registered.auth, widget: registered.widget, session: registered.session });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal registrasi client: ${error.message}` });
  }
});

app.post("/api/v1/register", async (req, res) => {
  try {
    const registered = await registerClientTenant(req.body || {});
    res.status(201).json({ ok: true, tenant: registered.tenant, auth: registered.auth, widget: registered.widget, session: registered.session });
  } catch (error) {
    const statusCode = Number(error?.statusCode || 500);
    res.status(statusCode).json({ ok: false, message: `Gagal registrasi client: ${error.message}` });
  }
});

app.post("/api/v1/master/login", async (req, res) => {
  try {
    const email = sanitizeName(req.body?.email || "");
    const password = String(req.body?.password || "");
    const ipAddress = getRequestIp(req);
    const attemptKey = buildLoginAttemptKey({ scope: "master", tenantCode: "MASTER", userName: email || "master", ipAddress });

    const lockCheck = checkLoginLock(attemptKey);
    if (lockCheck.locked) {
      res.status(429).json({ ok: false, message: `Login master dikunci sementara. Coba lagi dalam ${lockCheck.retryAfterSec} detik.` });
      return;
    }

    if (!email || !password) {
      res.status(400).json({ ok: false, message: "Email dan password master wajib diisi." });
      return;
    }

    if (email.toLowerCase() !== MASTER_PANEL_EMAIL.toLowerCase() || password !== MASTER_PANEL_PASSWORD) {
      registerFailedAttempt(attemptKey);
      res.status(401).json({ ok: false, message: "Login master gagal." });
      return;
    }

    clearFailedAttempts(attemptKey);

    const session = await createScopedSession({
      tenantCode: "MASTER",
      userName: MASTER_PANEL_EMAIL,
      role: "master",
      scope: "master"
    });

    res.json({ ok: true, session, profile: { email: MASTER_PANEL_EMAIL, role: "master" } });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Login master gagal: ${error.message}` });
  }
});

app.post("/api/v1/tenants/:tenantCode/renew", requireScopedSession(["master"]), async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.params.tenantCode, DEFAULT_TENANT_CODE);
    const months = Math.max(Number(req.body?.months || 1), 1);
    const current = await getTenantRecord(tenantCode);
    const baseDate = current.subscriptionExpiresAt && parseDateMs(current.subscriptionExpiresAt) > Date.now()
      ? current.subscriptionExpiresAt
      : nowIso();

    const updated = await saveTenantRecord(tenantCode, {
      status: "active",
      subscriptionMode: "active",
      subscriptionStartedAt: current.subscriptionStartedAt || nowIso(),
      subscriptionExpiresAt: addMonthsIso(baseDate, months),
      subscriptionRenewedAt: nowIso()
    });

    res.json({ ok: true, tenant: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memperpanjang langganan: ${error.message}` });
  }
});

app.get("/api/v1/settings/subscription", requireScopedSession(["master"]), async (_req, res) => {
  try {
    res.json({ ok: true, settings: await getSubscriptionSettings() });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat pengaturan trial: ${error.message}` });
  }
});

app.put("/api/v1/settings/subscription", requireScopedSession(["master"]), async (req, res) => {
  try {
    const settings = await saveSubscriptionSettings({ defaultTrialDays: req.body?.defaultTrialDays });
    res.json({ ok: true, settings });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal menyimpan pengaturan trial: ${error.message}` });
  }
});

app.get("/api/v1/master/overview", requireScopedSession(["master"]), async (_req, res) => {
  try {
    res.json(await buildMasterOverview());
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat master overview: ${error.message}` });
  }
});

app.post("/api/v1/client/login", async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.body?.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const userName = sanitizeName(req.body?.userName || "");
    const password = String(req.body?.password || "");
    const ipAddress = getRequestIp(req);
    const attemptKey = buildLoginAttemptKey({ scope: "client", tenantCode, userName, ipAddress });

    const lockCheck = checkLoginLock(attemptKey);
    if (lockCheck.locked) {
      res.status(429).json({ ok: false, message: `Login client dikunci sementara. Coba lagi dalam ${lockCheck.retryAfterSec} detik.` });
      return;
    }

    if (!tenantCode || !userName || !password) {
      res.status(400).json({ ok: false, message: "Tenant, username, dan password wajib diisi." });
      return;
    }

    const authDoc = await getAuthRecord(tenantCode);
    const tenant = await getTenantRecord(tenantCode);
    if (!tenant.subscriptionAccessEnabled) {
      res.status(403).json({ ok: false, message: "Langganan tenant sudah kedaluwarsa. Perpanjang dari panel master." });
      return;
    }
    const userKey = nameKey(userName);
    let role = "denied";

    if (authDoc.ownerKey === userKey && verifyPassword(password, authDoc.ownerPasswordHash)) {
      role = "owner";
    } else if (authDoc.admins.some((entry) => entry.key === userKey) && verifyPassword(password, authDoc.adminPasswordHash)) {
      role = "admin";
    } else if (authDoc.operators.some((entry) => entry.key === userKey) && verifyPassword(password, authDoc.adminPasswordHash)) {
      role = "operator";
    }

    if (role === "denied") {
      registerFailedAttempt(attemptKey);
      res.status(401).json({ ok: false, message: "Login client gagal." });
      return;
    }

    clearFailedAttempts(attemptKey);

    const session = await createScopedSession({ tenantCode, userName, role, scope: "client" });
    res.json({ ok: true, session, role, tenantCode });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Login client gagal: ${error.message}` });
  }
});

app.get("/api/v1/client/overview", requireScopedSession(["client", "master"]), async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.query?.tenantCode || req.platformSession.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const bootstrap = await getTenantBootstrap(tenantCode);
    const auth = await getAuthRecord(tenantCode);
    const publicBaseUrl = getRequestPublicBaseUrl(req);
    const widgetChatUrl = `${publicBaseUrl}/embed?livechat=1&tenantCode=${encodeURIComponent(bootstrap.tenant.tenantCode)}&widgetId=${encodeURIComponent(bootstrap.tenant.widgetId)}&widgetNumber=${encodeURIComponent(bootstrap.tenant.widgetNumber)}`;
    const widgetScriptUrl = `${publicBaseUrl}/widget.js`;

    res.json({
      ok: true,
      tenant: bootstrap.tenant,
      subscription: bootstrap.subscription,
      auth: buildTeamAuthState(auth),
      backend: bootstrap.backend,
      widget: {
        chatUrl: widgetChatUrl,
        scriptUrl: widgetScriptUrl,
        widgetId: bootstrap.tenant.widgetId,
        widgetNumber: bootstrap.tenant.widgetNumber,
        snippet: `<script src="${widgetScriptUrl}" data-chat-url="${widgetChatUrl}" data-title="${bootstrap.tenant.tenantName}" data-subtitle="${bootstrap.tenant.defaultTeamCode} • ${bootstrap.tenant.defaultChannelCode}" data-widget-id="${bootstrap.tenant.widgetId}" data-widget-number="${bootstrap.tenant.widgetNumber}"></script>`
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat client overview: ${error.message}` });
  }
});

app.get("/api/v1/tenants/demo", async (req, res) => {
  try {
    const requestedTenantCode = sanitizeCode(req.query?.tenantCode || DEFAULT_DEMO_TENANT_CODE, DEFAULT_DEMO_TENANT_CODE);
    const hasRequestedTenant = await tenantsDb.findOne({ tenantCode: requestedTenantCode });
    const bootstrap = await getTenantBootstrap(hasRequestedTenant ? requestedTenantCode : DEFAULT_TENANT_CODE);
    res.json({ ok: true, tenant: bootstrap.tenant, auth: bootstrap.auth, backend: bootstrap.backend });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat tenant demo: ${error.message}` });
  }
});

app.get("/api/v1/tenants/:tenantCode", async (req, res) => {
  try {
    const tenant = await getTenantRecord(req.params.tenantCode);
    const auth = await getAuthRecord(tenant.tenantCode);
    res.json({ ok: true, tenant, auth: buildTeamAuthState(auth) });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat tenant: ${error.message}` });
  }
});

app.post("/api/v1/tenants/:tenantCode", async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.tenantCode !== sanitizeCode(req.params.tenantCode, DEFAULT_TENANT_CODE)) {
      res.status(401).json({ ok: false, message: "Sesi admin dibutuhkan untuk update tenant." });
      return;
    }

    const updated = await saveTenantRecord(req.params.tenantCode, req.body || {});
    res.json({ ok: true, tenant: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal menyimpan tenant: ${error.message}` });
  }
});

app.post("/api/v1/admin/login", async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.body?.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const userName = sanitizeName(req.body?.userName || "");
    const password = String(req.body?.password || "");
    const ipAddress = getRequestIp(req);
    const attemptKey = buildLoginAttemptKey({ scope: "admin", tenantCode, userName, ipAddress });

    const lockCheck = checkLoginLock(attemptKey);
    if (lockCheck.locked) {
      res.status(429).json({ ok: false, message: `Login admin dikunci sementara. Coba lagi dalam ${lockCheck.retryAfterSec} detik.` });
      return;
    }

    if (!userName || !password) {
      res.status(400).json({ ok: false, message: "Nama pengguna dan password wajib diisi." });
      return;
    }

    const authDoc = await getAuthRecord(tenantCode);
    const userKey = nameKey(userName);
    let role = "member";

    if (authDoc.ownerKey === userKey) {
      role = verifyPassword(password, authDoc.ownerPasswordHash) ? "owner" : "denied";
    } else if (authDoc.admins.some((entry) => entry.key === userKey)) {
      role = verifyPassword(password, authDoc.adminPasswordHash) ? "admin" : "denied";
    } else if (authDoc.operators.some((entry) => entry.key === userKey)) {
      role = verifyPassword(password, authDoc.adminPasswordHash) ? "operator" : "denied";
    } else {
      role = "denied";
    }

    if (role === "denied") {
      registerFailedAttempt(attemptKey);
      res.status(401).json({ ok: false, message: "Login admin gagal." });
      return;
    }

    clearFailedAttempts(attemptKey);

    const session = await createScopedSession({ tenantCode, userName, role, scope: "client" });
    res.json({ ok: true, session, role, auth: buildTeamAuthState(authDoc) });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Login admin gagal: ${error.message}` });
  }
});

app.get("/api/v1/widget-config", async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.query?.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const bootstrap = await getTenantBootstrap(tenantCode);
    const publicBaseUrl = getRequestPublicBaseUrl(req);
    const widgetChatUrl = `${publicBaseUrl}/embed?livechat=1&tenantCode=${encodeURIComponent(bootstrap.tenant.tenantCode)}&widgetId=${encodeURIComponent(bootstrap.tenant.widgetId)}&widgetNumber=${encodeURIComponent(bootstrap.tenant.widgetNumber)}`;
    const widgetScriptUrl = `${publicBaseUrl}/widget.js`;

    res.json({
      ok: true,
      tenantCode: bootstrap.tenant.tenantCode,
      widgetScriptUrl,
      widgetChatUrl,
      snippet: `<script src="${widgetScriptUrl}" data-chat-url="${widgetChatUrl}" data-title="${bootstrap.tenant.tenantName}" data-subtitle="${bootstrap.tenant.defaultTeamCode} • ${bootstrap.tenant.defaultChannelCode}" data-widget-id="${bootstrap.tenant.widgetId}" data-widget-number="${bootstrap.tenant.widgetNumber}" data-apk-url=""></script>`,
      tenant: bootstrap.tenant,
      backend: bootstrap.backend
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat widget config: ${error.message}` });
  }
});

app.post("/api/v1/inbox/message", async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.body?.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const widgetId = sanitizeWidgetId(req.body?.widgetId || "", "");
    const widgetNumber = Math.max(Number(req.body?.widgetNumber || 1), 1);
    const visitorName = sanitizeName(req.body?.visitorName || "Guest") || "Guest";
    const message = sanitizeCustomerMessage(req.body?.message || "");
    const sourceUrl = String(req.body?.sourceUrl || "").trim().slice(0, 500);

    if (!message) {
      res.status(400).json({ ok: false, message: "Pesan customer tidak boleh kosong." });
      return;
    }

    const tenant = await getTenantRecord(tenantCode);
    if (!tenant.subscriptionAccessEnabled) {
      res.status(403).json({ ok: false, message: "Langganan tenant sudah kedaluwarsa. Pesan baru dinonaktifkan." });
      return;
    }

    const messageId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
    const now = nowIso();

    const saved = await inboxDb.insert({
      messageId,
      tenantCode: tenant.tenantCode,
      widgetId: widgetId || tenant.widgetId,
      widgetNumber: widgetId ? widgetNumber : tenant.widgetNumber,
      visitorName,
      message,
      sourceUrl,
      status: "new",
      createdAt: now,
      updatedAt: now
    });

    res.json({
      ok: true,
      inbox: {
        messageId: saved.messageId,
        tenantCode: saved.tenantCode,
        widgetId: saved.widgetId,
        widgetNumber: saved.widgetNumber,
        visitorName: saved.visitorName,
        message: saved.message,
        sourceUrl: saved.sourceUrl,
        status: saved.status,
        createdAt: saved.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal menyimpan pesan inbox: ${error.message}` });
  }
});

app.get("/api/v1/client/inbox", requireScopedSession(["client", "master"]), async (req, res) => {
  try {
    const tenantCode = sanitizeCode(req.query?.tenantCode || req.platformSession.tenantCode || DEFAULT_TENANT_CODE, DEFAULT_TENANT_CODE);
    const tenant = await getTenantRecord(tenantCode);
    if (req.platformSession.scope !== "master" && !tenant.subscriptionAccessEnabled) {
      res.status(403).json({ ok: false, message: "Langganan tenant sudah kedaluwarsa. Inbox client dinonaktifkan." });
      return;
    }

    const widgetId = sanitizeWidgetId(req.query?.widgetId || "", "");
    const limit = Math.min(Math.max(Number(req.query?.limit || 50), 1), 200);
    const docs = await inboxDb.find(widgetId ? { tenantCode, widgetId } : { tenantCode }).sort({ createdAt: -1 }).limit(limit).exec();

    res.json({
      ok: true,
      tenantCode,
      inbox: docs.map((doc) => ({
        messageId: doc.messageId,
        widgetId: doc.widgetId,
        widgetNumber: doc.widgetNumber,
        visitorName: doc.visitorName,
        message: doc.message,
        sourceUrl: doc.sourceUrl,
        status: doc.status,
        createdAt: doc.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat inbox client: ${error.message}` });
  }
});

app.put("/api/v1/tenants/:tenantCode", async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.tenantCode !== sanitizeCode(req.params.tenantCode, DEFAULT_TENANT_CODE)) {
      res.status(401).json({ ok: false, message: "Sesi admin dibutuhkan untuk update tenant." });
      return;
    }

    const updated = await saveTenantRecord(req.params.tenantCode, {
      tenantName: req.body?.tenantName,
      plan: req.body?.plan,
      status: req.body?.status,
      subscriptionMode: req.body?.subscriptionMode,
      subscriptionStartedAt: req.body?.subscriptionStartedAt,
      subscriptionExpiresAt: req.body?.subscriptionExpiresAt,
      subscriptionTrialDays: req.body?.subscriptionTrialDays,
      subscriptionRenewedAt: req.body?.subscriptionRenewedAt,
      publicBaseUrl: req.body?.publicBaseUrl,
      backendBaseUrl: req.body?.backendBaseUrl,
      defaultTeamCode: req.body?.defaultTeamCode,
      defaultChannelCode: req.body?.defaultChannelCode
    });

    res.json({ ok: true, tenant: updated });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal menyimpan tenant: ${error.message}` });
  }
});

app.get("/api/v1/admin/me", requireAdminSession, async (req, res) => {
  try {
    const tenant = await getTenantRecord(req.platformSession.tenantCode);
    const authDoc = await getAuthRecord(req.platformSession.tenantCode);
    res.json({ ok: true, session: req.platformSession, tenant, auth: buildTeamAuthState(authDoc) });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat sesi admin: ${error.message}` });
  }
});

app.post("/api/v1/admin/logout", requireAdminSession, async (req, res) => {
  try {
    await sessionsDb.remove({ token: req.platformSession.token }, { multi: true });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Logout gagal: ${error.message}` });
  }
});

app.get("/api/v1/auth/:tenantCode", async (req, res) => {
  try {
    const auth = await getAuthRecord(req.params.tenantCode);
    res.json({
      ok: true,
      auth: {
        teamCode: auth.teamCode,
        ownerName: auth.ownerName,
        admins: (auth.admins || []).map((entry) => entry.name),
        operators: (auth.operators || []).map((entry) => entry.name),
        authVersion: auth.authVersion,
        createdAt: auth.createdAt,
        updatedAt: auth.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat auth tenant: ${error.message}` });
  }
});

app.put("/api/v1/auth/:tenantCode", async (req, res) => {
  try {
    const session = await getSessionFromRequest(req);
    if (!session || session.tenantCode !== sanitizeCode(req.params.tenantCode, DEFAULT_TENANT_CODE)) {
      res.status(401).json({ ok: false, message: "Sesi admin dibutuhkan untuk update auth." });
      return;
    }

    const updated = await saveAuthRecord(req.params.tenantCode, {
      ownerName: req.body?.ownerName,
      ownerPassword: req.body?.ownerPassword,
      adminPassword: req.body?.adminPassword,
      adminNames: req.body?.adminNames,
      operatorNames: req.body?.operatorNames
    });

    res.json({
      ok: true,
      auth: {
        teamCode: updated.teamCode,
        ownerName: updated.ownerName,
        admins: (updated.admins || []).map((entry) => entry.name),
        operators: (updated.operators || []).map((entry) => entry.name),
        authVersion: updated.authVersion,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal menyimpan auth tenant: ${error.message}` });
  }
});

app.get("/api/login-config", async (_req, res) => proxyBackendJson("/api/login-config", res));
app.get("/api/simulation-config", async (_req, res) => proxyBackendJson("/api/simulation-config", res));
app.get("/api/upload-config", async (_req, res) => proxyBackendJson("/api/upload-config", res));
app.get("/api/direct-admin-config", async (_req, res) => proxyBackendJson("/api/direct-admin-config", res));
app.get("/api/real-members", async (req, res) => proxyBackendJson(`/api/real-members${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`, res));
app.get("/widget.js", async (_req, res) => proxyBackendScript("/widget.js", res));
app.get("/livechat-widget.js", async (_req, res) => proxyBackendScript("/livechat-widget.js", res));
app.get("/chat/embed", async (_req, res) => proxyBackendJson("/embed", res));

app.get("/api", (_req, res) => {
  res.json({ ok: true, prefix: API_PREFIX, version: "v1" });
});

app.get("/api/v1/status", (req, res) => {
  res.json({
    ok: true,
    service: APP_NAME,
    surface: resolveSurfaceFromHost(req.hostname),
    host: req.hostname,
    routes: ["/", "/demo", "/register", "/admin", "/panel/master", "/panel/client", "/panel/client1", "/panel/client2", "/embed", "/healthz", "/api/v1/status", "/api/v1/bootstrap", "/api/v1/tenants", "/api/v1/tenants/:tenantCode", "/api/v1/tenants/:tenantCode/renew", "/api/v1/settings/subscription", "/api/v1/deploy-check", "/api/v1/master/overview", "/api/v1/client/overview", "/api/v1/client/inbox", "/api/v1/inbox/message", "/api/v1/register"],
    defaultTenantCode: DEFAULT_TENANT_CODE,
    defaultTeamCode: DEFAULT_TEAM_CODE,
    defaultChannelCode: DEFAULT_CHANNEL_CODE,
    timestamp: new Date().toISOString(),
    warnings: buildRuntimeWarnings()
  });
});

app.get("/", (req, res) => {
  const surface = resolveSurfaceFromHost(req.hostname);

  if (surface === "admin") {
    return res.type("html").send(renderTemplate(templates.admin));
  }

  if (surface === "embed") {
    return res.type("html").send(renderTemplate(templates.embed));
  }

  if (surface === "api") {
    return res.json({ ok: true, ...apiSurface });
  }

  return res.type("html").send(renderTemplate(templates.web));
});

app.get("/admin", (_req, res) => {
  res.type("html").send(renderTemplate(templates.admin));
});

app.get("/register", (_req, res) => {
  res.type("html").send(renderTemplate(templates.register));
});

app.get("/demo", async (req, res) => {
  const demoValues = await buildDemoTemplateValues(req.query?.tenantCode || DEFAULT_DEMO_TENANT_CODE);
  res.type("html").send(renderTemplate(templates.demo, demoValues));
});

app.get("/panel/master", (_req, res) => {
  res.type("html").send(renderTemplate(templates.panelMaster, buildPanelPublicTemplateValues("master", "master")));
});

app.get("/panel/client", (_req, res) => {
  res.type("html").send(renderTemplate(templates.panelPublic, buildPanelPublicTemplateValues("client", "client")));
});

app.get(["/panel/client1", "/panel/client2", "/panel/client/:panelAlias"], (req, res) => {
  const panelAlias = sanitizeName(req.params?.panelAlias || req.path.split("/").pop() || "client") || "client";
  res.type("html").send(renderTemplate(templates.panelPublic, buildPanelPublicTemplateValues("client", panelAlias)));
});

app.get("/embed", (_req, res) => {
  res.type("html").send(renderTemplate(templates.embed));
});

app.get(["/web", "/home"], (_req, res) => {
  res.type("html").send(renderTemplate(templates.web));
});

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ ok: false, error: "Not Found" });
  }

  res.status(404).type("html").send(renderTemplate(templates.web, {
    __PAGE_TITLE__: "Page not found",
    __PAGE_MESSAGE__: "Halaman tidak ditemukan di scaffold split ini."
  }));
});

const startServer = async () => {
  await ensureSeedData();
  app.listen(PORT, () => {
    console.log(`${APP_NAME} ready on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`Failed to start ${APP_NAME}:`, error);
  process.exit(1);
});