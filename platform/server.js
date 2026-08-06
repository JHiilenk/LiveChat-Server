const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const Datastore = require("nedb-promises");
require("dotenv").config();

const app = express();
const publicDirectory = path.join(__dirname, "public");
const dataDirectory = path.join(__dirname, "data");

const PORT = Number(process.env.PORT) || 4001;
const APP_NAME = process.env.APP_NAME || "JIELive Control Panel";
const APP_TAGLINE = process.env.APP_TAGLINE || "Frontend, admin, embed, dan API untuk deployment terpisah.";
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const DEFAULT_LIVECHAT_BACKEND_URL = "http://127.0.0.1:4000";
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

const LIVECHAT_BACKEND_URL = getSafeAbsoluteUrl(LIVECHAT_BACKEND_URL_INPUT, DEFAULT_LIVECHAT_BACKEND_URL, "LIVECHAT_BACKEND_URL");

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
  admin: readTemplate("admin.html"),
  embed: readTemplate("embed.html"),
  master: readTemplate("master.html"),
  client: readTemplate("client.html")
};

fs.mkdirSync(dataDirectory, { recursive: true });

const tenantsDb = Datastore.create({ filename: path.join(dataDirectory, "tenants.db"), autoload: true });
const authDb = Datastore.create({ filename: path.join(dataDirectory, "tenant-auth.db"), autoload: true });
const sessionsDb = Datastore.create({ filename: path.join(dataDirectory, "platform-sessions.db"), autoload: true });
const inboxDb = Datastore.create({ filename: path.join(dataDirectory, "inbox-messages.db"), autoload: true });
const loginAttemptStore = new Map();

const sanitizeName = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 48);
const sanitizeCustomerMessage = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 1200);
const sanitizeCode = (value, fallback) => {
  const code = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return code || fallback;
};
const nameKey = (value) => sanitizeName(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
const nowIso = () => new Date().toISOString();
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

const buildDefaultTenantRecord = (tenantCode = DEFAULT_TENANT_CODE) => ({
  tenantCode,
  tenantName: APP_NAME,
  plan: "launch",
  status: "active",
  publicBaseUrl: PUBLIC_BASE_URL,
  backendBaseUrl: LIVECHAT_BACKEND_URL,
  defaultTeamCode: DEFAULT_TEAM_CODE,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
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

  return {
    tenantCode,
    tenantName: sanitizeName(record?.tenantName || APP_NAME) || APP_NAME,
    plan: sanitizeName(record?.plan || "launch") || "launch",
    status: sanitizeName(record?.status || "active") || "active",
    publicBaseUrl: String(record?.publicBaseUrl || PUBLIC_BASE_URL).replace(/\/$/, ""),
    backendBaseUrl: String(record?.backendBaseUrl || LIVECHAT_BACKEND_URL).replace(/\/$/, ""),
    defaultTeamCode: sanitizeCode(record?.defaultTeamCode || DEFAULT_TEAM_CODE, DEFAULT_TEAM_CODE),
    defaultChannelCode: sanitizeCode(record?.defaultChannelCode || DEFAULT_CHANNEL_CODE, DEFAULT_CHANNEL_CODE),
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

  const created = sanitizeTenantRecord(buildDefaultTenantRecord(safeTenantCode), safeTenantCode);
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
  const updated = sanitizeTenantRecord({ ...current, ...nextRecord, tenantCode: safeTenantCode }, safeTenantCode);

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

const buildMasterOverview = async () => {
  const tenants = await getTenantSummaryList();
  const authDocs = await authDb.find({}).exec();
  const sessions = await sessionsDb.find({}).exec();
  const activeSessions = sessions.filter((entry) => entry?.expiresAt && new Date(entry.expiresAt).getTime() > Date.now());

  return {
    ok: true,
    runtime: getRuntimeDeploymentState(),
    stats: {
      tenantCount: tenants.length,
      activeTenantCount: tenants.filter((entry) => entry.status.toLowerCase() === "active").length,
      authProfiles: authDocs.length,
      activeSessions: activeSessions.length,
      clientSessions: activeSessions.filter((entry) => sanitizeName(entry.scope || "client") === "client").length,
      masterSessions: activeSessions.filter((entry) => sanitizeName(entry.scope || "client") === "master").length
    },
    tenants: tenants.map((tenant) => ({
      tenantCode: tenant.tenantCode,
      tenantName: tenant.tenantName,
      plan: tenant.plan,
      status: tenant.status,
      backendBaseUrl: tenant.backendBaseUrl,
      publicBaseUrl: tenant.publicBaseUrl,
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
        plan: tenant.plan,
        status: tenant.status,
        publicBaseUrl: tenant.publicBaseUrl,
        backendBaseUrl: tenant.backendBaseUrl,
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
    const widgetChatUrl = `${publicBaseUrl}/embed?livechat=1&tenantCode=${encodeURIComponent(bootstrap.tenant.tenantCode)}`;
    const widgetScriptUrl = `${publicBaseUrl}/widget.js`;

    res.json({
      ok: true,
      tenant: bootstrap.tenant,
      auth: buildTeamAuthState(auth),
      backend: bootstrap.backend,
      widget: {
        chatUrl: widgetChatUrl,
        scriptUrl: widgetScriptUrl,
        snippet: `<script src="${widgetScriptUrl}" data-chat-url="${widgetChatUrl}" data-title="${bootstrap.tenant.tenantName}" data-subtitle="${bootstrap.tenant.defaultTeamCode} • ${bootstrap.tenant.defaultChannelCode}"></script>`
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat client overview: ${error.message}` });
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
    const widgetChatUrl = `${publicBaseUrl}/embed?livechat=1&tenantCode=${encodeURIComponent(bootstrap.tenant.tenantCode)}`;
    const widgetScriptUrl = `${publicBaseUrl}/widget.js`;

    res.json({
      ok: true,
      tenantCode: bootstrap.tenant.tenantCode,
      widgetScriptUrl,
      widgetChatUrl,
      snippet: `<script src="${widgetScriptUrl}" data-chat-url="${widgetChatUrl}" data-title="${bootstrap.tenant.tenantName}" data-subtitle="${bootstrap.tenant.defaultTeamCode} • ${bootstrap.tenant.defaultChannelCode}" data-apk-url=""></script>`,
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
    const visitorName = sanitizeName(req.body?.visitorName || "Guest") || "Guest";
    const message = sanitizeCustomerMessage(req.body?.message || "");
    const sourceUrl = String(req.body?.sourceUrl || "").trim().slice(0, 500);

    if (!message) {
      res.status(400).json({ ok: false, message: "Pesan customer tidak boleh kosong." });
      return;
    }

    const tenant = await getTenantRecord(tenantCode);
    const messageId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
    const now = nowIso();

    const saved = await inboxDb.insert({
      messageId,
      tenantCode: tenant.tenantCode,
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
    const limit = Math.min(Math.max(Number(req.query?.limit || 50), 1), 200);
    const docs = await inboxDb.find({ tenantCode }).sort({ createdAt: -1 }).limit(limit).exec();

    res.json({
      ok: true,
      tenantCode,
      inbox: docs.map((doc) => ({
        messageId: doc.messageId,
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
    routes: ["/", "/admin", "/panel/master", "/panel/client", "/embed", "/healthz", "/api/v1/status", "/api/v1/bootstrap", "/api/v1/tenants", "/api/v1/tenants/:tenantCode", "/api/v1/deploy-check", "/api/v1/master/overview", "/api/v1/client/overview"],
    defaultTenantCode: DEFAULT_TENANT_CODE,
    defaultTeamCode: DEFAULT_TEAM_CODE,
    defaultChannelCode: DEFAULT_CHANNEL_CODE,
    timestamp: new Date().toISOString(),
    warnings: buildRuntimeWarnings()
  });
});

app.get("/api/v1/tenants/demo", async (_req, res) => {
  try {
    const bootstrap = await getTenantBootstrap(DEFAULT_TENANT_CODE);
    res.json({ ok: true, tenant: bootstrap.tenant, auth: bootstrap.auth, backend: bootstrap.backend });
  } catch (error) {
    res.status(500).json({ ok: false, message: `Gagal memuat tenant demo: ${error.message}` });
  }
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

app.get("/panel/master", (_req, res) => {
  res.type("html").send(renderTemplate(templates.master));
});

app.get("/panel/client", (_req, res) => {
  res.type("html").send(renderTemplate(templates.client));
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