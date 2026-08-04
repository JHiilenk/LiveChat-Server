const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const { Server } = require("socket.io");
const multer = require("multer");
const Datastore = require("nedb-promises");
const { registerPublicSiteRoutes } = require("./routes/publicSite");
const { registerSystemRoutes } = require("./routes/systemRoutes");
const { registerMemberRoutes } = require("./routes/memberRoutes");
const { registerUploadRoutes } = require("./routes/uploadRoutes");
const { createSocketContextUtils } = require("./utils/socketContext");
const { createAuthUtils } = require("./utils/authUtils");
const { createMessageUtils } = require("./utils/messageUtils");
const { createBroadcastUtils } = require("./utils/broadcastUtils");
const { createPresenceUtils } = require("./utils/presenceUtils");
const { createChannelUtils } = require("./utils/channelUtils");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 3000;
const APP_ORIGIN = process.env.APP_ORIGIN || "*";
const SOCKET_CORS_ORIGIN = process.env.SOCKET_CORS_ORIGIN || APP_ORIGIN;
const APP_NAME = String(process.env.APP_NAME || "Jeetalk").trim() || "Jeetalk";
const APP_DESCRIPTION = String(process.env.APP_DESCRIPTION || `${APP_NAME} adalah server live chat realtime untuk banyak client.`).trim() || `${APP_NAME} adalah server live chat realtime untuk banyak client.`;

const normalizeDefaultCode = (value, fallback) => {
  const cleaned = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 20)
    .trim();

  return cleaned || fallback;
};

const MAX_MESSAGE_LENGTH = 500;
const MAX_TEAM_NOTICE_LENGTH = 180;
const MAX_NAME_LENGTH = 24;
const MAX_CODE_LENGTH = 20;
const RATE_LIMIT_WINDOW_MS = 10_000;
const RATE_LIMIT_MAX_MESSAGES = 7;
const MESSAGE_HISTORY_LIMIT = 80;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const BLOCKED_EXTENSIONS = new Set([".exe", ".msi", ".bat", ".cmd", ".ps1", ".scr", ".dll", ".com"]);
const AI_BOT_NAME = "JEE AI";
const AI_REPLY_COOLDOWN_MS = 1400;
const MIN_PRIVILEGED_PASSWORD_LENGTH = 4;
const MESSAGE_RETENTION_MS = 3 * 24 * 60 * 60 * 1000;
const JOIN_GREETING_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const DEFAULT_TEAM_CODE = normalizeDefaultCode(process.env.DEFAULT_TEAM_CODE, "LOBBY");
const DEFAULT_CHANNEL_CODE = normalizeDefaultCode(process.env.DEFAULT_CHANNEL_CODE, "GENERAL");
const DEFAULT_TEAM_NOTICE_MESSAGE = "Gunakan kode team yang sama untuk gabung grup yang sama.";
const LOGIN_CONFIG_DOC_KEY = "__LOGIN_CONFIG__";
const SIMULATION_CONFIG_DOC_KEY = "__SIMULATION_CONFIG__";
const UPLOAD_CONFIG_DOC_KEY = "__UPLOAD_CONFIG__";
const DEFAULT_LOGIN_CONFIG = {
  showTeamSelect: true,
  showChannelSelect: true,
  teamOptions: [DEFAULT_TEAM_CODE],
  channelOptions: [DEFAULT_CHANNEL_CODE]
};
const DEFAULT_SIMULATION_CONFIG = {
  enabled: true
};
const DEFAULT_UPLOAD_CONFIG = {
  imageLimitMb: 8,
  videoLimitMb: 20,
  audioLimitMb: 12,
  fileLimitMb: 10
};
const ROLE_GUEST = "guest";
const ROLE_MEMBER = "member";
const ROLE_ADMIN = "admin";
const ROLE_OWNER = "owner";
const ROLE_OPERATOR = "operator";
const AUTH_SCHEMA_VERSION = 2;
const DEFAULT_OWNER_USERNAME = String(process.env.DEFAULT_OWNER_USERNAME || "owner").trim() || "owner";
const DEFAULT_ADMIN_USERNAME = String(process.env.DEFAULT_ADMIN_USERNAME || "admin").trim() || "admin";
const DEFAULT_OWNER_PASSWORD = String(process.env.DEFAULT_OWNER_PASSWORD || "change-owner-password").trim() || "change-owner-password";
const DEFAULT_ADMIN_PASSWORD = String(process.env.DEFAULT_ADMIN_PASSWORD || "change-admin-password").trim() || "change-admin-password";

const usersBySocketId = new Map();
const typingSocketIds = new Set();
const aiCooldownByContext = new Map();
const joinHistoryByTeam = new Map();
const fingerprintHistoryByTeam = new Map();
const simulatedWelcomeNextEmitAtByChannel = new Map();

const parseOrigins = (originValue) => {
  if (!originValue || originValue.trim() === "*") {
    return true;
  }

  const origins = originValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return origins.length === 0 ? true : origins;
};

const allowedHttpOrigins = parseOrigins(APP_ORIGIN);
const allowedSocketOrigins = parseOrigins(SOCKET_CORS_ORIGIN);

const resolvePrimaryPublicUrl = () => {
  const explicitPublicBaseUrl = String(process.env.PUBLIC_BASE_URL || "").trim();
  if (explicitPublicBaseUrl) {
    return explicitPublicBaseUrl.replace(/\/$/, "");
  }

  if (Array.isArray(allowedHttpOrigins) && allowedHttpOrigins.length > 0) {
    return allowedHttpOrigins[0].replace(/\/$/, "");
  }

  if (typeof APP_ORIGIN === "string" && APP_ORIGIN.trim() && APP_ORIGIN.trim() !== "*") {
    return APP_ORIGIN.trim().replace(/\/$/, "");
  }

  return `http://localhost:${PORT}`;
};

const PUBLIC_BASE_URL = resolvePrimaryPublicUrl();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedHttpOrigins }));
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(morgan("tiny"));
const projectRoot = path.resolve(__dirname, "..", "..");
registerPublicSiteRoutes({
  app,
  projectRoot,
  publicBaseUrl: PUBLIC_BASE_URL,
  appName: APP_NAME,
  appDescription: APP_DESCRIPTION
});

registerSystemRoutes({
  app,
  getPublicLoginConfig: () => getPublicLoginConfig(),
  getPublicSimulationConfig: () => getPublicSimulationConfig(),
  getPublicUploadConfig: () => getPublicUploadConfig()
});

const io = new Server(server, {
  cors: {
    origin: allowedSocketOrigins,
    methods: ["GET", "POST"]
  }
});

const dataDirectory = path.join(projectRoot, "data");
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const uploadsDirectory = path.join(dataDirectory, "uploads");
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

app.use("/uploads", express.static(uploadsDirectory));

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDirectory),
  filename: (_req, file, cb) => {
    const originalExt = path.extname(file.originalname || "").toLowerCase();
    const safeExt = originalExt.replace(/[^a-z0-9.]/g, "") || ".bin";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`;
    cb(null, uniqueName);
  }
});

const createUploadSingle = (uploadConfig) => {
  const safeConfig = sanitizeUploadConfig(uploadConfig);
  const maxBytes = Math.max(
    safeConfig.imageLimitMb,
    safeConfig.videoLimitMb,
    safeConfig.audioLimitMb,
    safeConfig.fileLimitMb
  ) * 1024 * 1024;

  return multer({
    storage: uploadStorage,
    limits: { fileSize: Math.min(MAX_FILE_SIZE_BYTES, maxBytes) },
    fileFilter: (_req, file, cb) => {
      const extension = path.extname(file.originalname || "").toLowerCase();
      if (BLOCKED_EXTENSIONS.has(extension)) {
        cb(new Error("Tipe file ini tidak diizinkan."));
        return;
      }

      cb(null, true);
    }
  }).single("file");
};

const messagesDb = Datastore.create({
  filename: path.join(dataDirectory, "chat-messages.db"),
  autoload: true,
  timestampData: true
});

const teamsDb = Datastore.create({
  filename: path.join(dataDirectory, "teams.db"),
  autoload: true,
  timestampData: true
});

const channelsDb = Datastore.create({
  filename: path.join(dataDirectory, "channels.db"),
  autoload: true,
  timestampData: true
});

const teamAuthDb = Datastore.create({
  filename: path.join(dataDirectory, "team-auth.db"),
  autoload: true,
  timestampData: true
});

const realMembersDb = Datastore.create({
  filename: path.join(dataDirectory, "real-members.db"),
  autoload: true,
  timestampData: true
});

const memberBroadcastInboxDb = Datastore.create({
  filename: path.join(dataDirectory, "member-broadcast-inbox.db"),
  autoload: true
});

const sanitizeSimulationConfig = (rawConfig) => {
  void rawConfig;
  return { enabled: false };
};

const sanitizeUploadConfig = (rawConfig) => {
  const config = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
  const clampLimit = (value, fallback) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }

    return Math.min(250, Math.max(1, Math.round(numeric)));
  };

  return {
    imageLimitMb: clampLimit(config.imageLimitMb, DEFAULT_UPLOAD_CONFIG.imageLimitMb),
    videoLimitMb: clampLimit(config.videoLimitMb, DEFAULT_UPLOAD_CONFIG.videoLimitMb),
    audioLimitMb: clampLimit(config.audioLimitMb, DEFAULT_UPLOAD_CONFIG.audioLimitMb),
    fileLimitMb: clampLimit(config.fileLimitMb, DEFAULT_UPLOAD_CONFIG.fileLimitMb)
  };
};

const getPublicLoginConfig = async () => {
  const doc = await teamsDb.findOne({ teamCode: LOGIN_CONFIG_DOC_KEY });
  return sanitizeLoginConfig(doc?.loginConfig || DEFAULT_LOGIN_CONFIG);
};

const getPublicSimulationConfig = async () => {
  const doc = await teamsDb.findOne({ teamCode: SIMULATION_CONFIG_DOC_KEY });
  return sanitizeSimulationConfig(doc?.simulationConfig || DEFAULT_SIMULATION_CONFIG);
};

const getPublicUploadConfig = async () => {
  const doc = await teamsDb.findOne({ teamCode: UPLOAD_CONFIG_DOC_KEY });
  return sanitizeUploadConfig(doc?.uploadConfig || DEFAULT_UPLOAD_CONFIG);
};

const appendPublicLoginConfigOption = async (kind, code) => {
  const safeCode = sanitizeCode(code || "", kind === "team" ? DEFAULT_TEAM_CODE : DEFAULT_CHANNEL_CODE);
  if (!safeCode) {
    return;
  }

  const loginConfig = await getPublicLoginConfig();
  const key = kind === "team" ? "teamOptions" : "channelOptions";
  const currentOptions = Array.isArray(loginConfig[key]) ? loginConfig[key] : [];
  if (currentOptions.includes(safeCode)) {
    return;
  }

  const nextOptions = Array.from(new Set([...(currentOptions || []), safeCode]));

  const savedConfig = await savePublicLoginConfig({
    ...loginConfig,
    [key]: nextOptions
  }, "system");

  io.emit("login:config:updated", {
    config: savedConfig,
    updatedBy: "system",
    updatedAt: nowIso()
  });
};

const savePublicLoginConfig = async (nextConfig, updatedBy = "system") => {
  const loginConfig = sanitizeLoginConfig(nextConfig);
  const timestamp = nowIso();

  await teamsDb.update(
    { teamCode: LOGIN_CONFIG_DOC_KEY },
    {
      $set: {
        teamCode: LOGIN_CONFIG_DOC_KEY,
        loginConfig,
        updatedBy: sanitizeName(updatedBy) || "system",
        updatedAt: timestamp
      }
    },
    { upsert: true }
  );

  return loginConfig;
};

const savePublicSimulationConfig = async (nextConfig, updatedBy = "system") => {
  void nextConfig;
  const simulationConfig = sanitizeSimulationConfig();
  const timestamp = nowIso();

  await teamsDb.update(
    { teamCode: SIMULATION_CONFIG_DOC_KEY },
    {
      $set: {
        teamCode: SIMULATION_CONFIG_DOC_KEY,
        simulationConfig,
        updatedBy: sanitizeName(updatedBy) || "system",
        updatedAt: timestamp
      }
    },
    { upsert: true }
  );

  return simulationConfig;
};

const savePublicUploadConfig = async (nextConfig, updatedBy = "system") => {
  const uploadConfig = sanitizeUploadConfig(nextConfig);
  const timestamp = nowIso();

  await teamsDb.update(
    { teamCode: UPLOAD_CONFIG_DOC_KEY },
    {
      $set: {
        teamCode: UPLOAD_CONFIG_DOC_KEY,
        uploadConfig,
        updatedBy: sanitizeName(updatedBy) || "system",
        updatedAt: timestamp
      }
    },
    { upsert: true }
  );

  return uploadConfig;
};

const upsertRealMemberRecord = async ({ name, teamCode, channelCode = DEFAULT_CHANNEL_CODE, register = false, countLogin = true, password = "" }) => {
  const safeName = sanitizeName(name || "");
  const safeTeamCode = sanitizeCode(teamCode || "", DEFAULT_TEAM_CODE);
  const safeChannelCode = sanitizeCode(channelCode || "", DEFAULT_CHANNEL_CODE);
  const safePassword = sanitizePassword(password);
  if (!safeName) {
    return null;
  }

  const memberKey = `${safeTeamCode}::${nameKey(safeName)}`;
  const now = nowIso();
  const existing = await realMembersDb.findOne({ memberKey });

  if (existing) {
    const nextRegisteredMember = Boolean(existing.registeredMember) || Boolean(register);
    const updateDoc = {
      $set: {
        name: safeName,
        teamCode: safeTeamCode,
        lastChannelCode: safeChannelCode,
        lastSeenAt: now,
        registeredMember: nextRegisteredMember
      }
    };

    if (register && !existing.registeredAt) {
      updateDoc.$set.registeredAt = now;
    }

    if (register && safePassword) {
      updateDoc.$set.memberPasswordHash = hashPassword(safePassword);
    }

    if (countLogin) {
      updateDoc.$inc = {
        loginCount: 1
      };
    }

    await realMembersDb.update(
      { _id: existing._id },
      updateDoc
    );

    return {
      ...existing,
      name: safeName,
      teamCode: safeTeamCode,
      lastChannelCode: safeChannelCode,
      lastSeenAt: now,
      registeredMember: nextRegisteredMember,
      registeredAt: existing.registeredAt || (register ? now : ""),
      memberPasswordHash: register && safePassword ? hashPassword(safePassword) : existing.memberPasswordHash,
      loginCount: countLogin ? (Math.max(0, Number(existing.loginCount) || 0) + 1) : Math.max(0, Number(existing.loginCount) || 0)
    };
  }

  const newDoc = {
    memberKey,
    name: safeName,
    teamCode: safeTeamCode,
    lastChannelCode: safeChannelCode,
    firstSeenAt: now,
    lastSeenAt: now,
    loginCount: countLogin ? 1 : 0,
    registeredMember: Boolean(register),
    registeredAt: register ? now : "",
    memberPasswordHash: register && safePassword ? hashPassword(safePassword) : ""
  };

  await realMembersDb.insert(newDoc);
  return newDoc;
};

const nowIso = () => new Date().toISOString();

const getMessageRetentionCutoff = () => new Date(Date.now() - MESSAGE_RETENTION_MS);

const cleanupExpiredMessages = async () => {
  const cutoff = getMessageRetentionCutoff();
  try {
    await messagesDb.remove({ createdAt: { $lt: cutoff } }, { multi: true });
  } catch (_error) {
    // Keep the server running if cleanup fails temporarily.
  }
};

const compactMessageStore = async () => {
  if (typeof messagesDb.compactDatafile !== "function") {
    return;
  }

  try {
    await messagesDb.compactDatafile();
  } catch (_error) {
    // Keep the server running if compaction fails temporarily.
  }
};

const scheduleMessageRetentionCleanup = () => {
  cleanupExpiredMessages().then(() => compactMessageStore());
  setInterval(() => {
    cleanupExpiredMessages().then(() => compactMessageStore());
  }, 60 * 60 * 1000);
};

const sanitizeName = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH);
};

const sanitizeMessage = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, MAX_MESSAGE_LENGTH);
};

const sanitizeTeamNotice = (value, fallback = DEFAULT_TEAM_NOTICE_MESSAGE) => {
  const cleaned = String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEAM_NOTICE_LENGTH);

  return cleaned || fallback;
};

const sanitizeCode = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, MAX_CODE_LENGTH)
    .trim();

  return cleaned || fallback;
};

const sanitizeLoginCodeOptions = (values, fallback) => {
  const source = Array.isArray(values)
    ? values
    : String(values || "").split(",");

  const cleaned = source
    .map((entry) => sanitizeCode(String(entry || ""), ""))
    .filter(Boolean);

  const unique = Array.from(new Set(cleaned));
  return unique.length ? unique : [fallback];
};

const sanitizeLoginConfig = (rawConfig) => {
  const config = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
  return {
    showTeamSelect: config.showTeamSelect !== false,
    showChannelSelect: config.showChannelSelect !== false,
    teamOptions: sanitizeLoginCodeOptions(config.teamOptions, DEFAULT_TEAM_CODE),
    channelOptions: sanitizeLoginCodeOptions(config.channelOptions, DEFAULT_CHANNEL_CODE)
  };
};

const sanitizeRole = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === ROLE_GUEST) {
    return ROLE_GUEST;
  }

  if (normalized === ROLE_OWNER) {
    return ROLE_OWNER;
  }

  if (normalized === ROLE_ADMIN) {
    return ROLE_ADMIN;
  }

  if (normalized === ROLE_OPERATOR) {
    return ROLE_OPERATOR;
  }

  return ROLE_MEMBER;
};

const sanitizePassword = (value) => {
  return String(value || "").trim().slice(0, 120);
};

registerMemberRoutes({
  app,
  sanitizeCode,
  sanitizeName,
  sanitizePassword,
  defaultTeamCode: DEFAULT_TEAM_CODE,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
  minPrivilegedPasswordLength: MIN_PRIVILEGED_PASSWORD_LENGTH,
  getUpsertRealMemberRecord: () => upsertRealMemberRecord,
  getRealMembersDb: () => realMembersDb
});

registerUploadRoutes({
  app,
  multer,
  createUploadSingle,
  getPublicUploadConfig,
  unlinkFile: fs.unlinkSync
});

const {
  sanitizeAttachment,
  buildSystemMessage,
  buildChatMessage,
  sanitizePinnedMessage,
  shouldAiReply,
  buildAiReplyText
} = createMessageUtils({
  nowIso,
  sanitizeName,
  sanitizeMessage,
  sanitizeRole,
  sanitizeCode,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
  roleMember: ROLE_MEMBER
});

const {
  nameKey,
  buildDmKey,
  getHistoryStoreForTeam,
  sanitizeIpAddress,
  extractClientIpAddress,
  detectBrowserLabel,
  buildClientFingerprint,
  teamRoomKey,
  channelRoomKey,
  dmRoomKey
} = createSocketContextUtils({ sanitizeName });

const isGreetingOnCooldown = (historyEntry) => {
  if (!historyEntry?.lastSeenAt) {
    return false;
  }

  const lastSeenMs = Date.parse(historyEntry.lastSeenAt);
  if (Number.isNaN(lastSeenMs)) {
    return false;
  }

  return (Date.now() - lastSeenMs) < JOIN_GREETING_COOLDOWN_MS;
};

const clearJoinGreetingHistoryForUser = (teamCode, requestedName, fingerprintKey = "") => {
  const teamJoinHistory = getHistoryStoreForTeam(joinHistoryByTeam, teamCode);
  const teamFingerprintHistory = getHistoryStoreForTeam(fingerprintHistoryByTeam, teamCode);
  const normalizedNameKey = nameKey(requestedName);

  if (normalizedNameKey) {
    teamJoinHistory.delete(normalizedNameKey);
  }

  if (fingerprintKey) {
    teamFingerprintHistory.delete(fingerprintKey);
  }
};

const buildJoinGreetingMessage = ({ teamCode, requestedName, fingerprint }) => {
  void teamCode;
  void requestedName;
  void fingerprint;
  return greetingText;
};

const emitSystemChannelMessage = async ({ teamCode, channelCode, text }) => {
  const message = buildSystemMessage(text, {
    type: "channel",
    channelCode
  });

  try {
    await messagesDb.insert({
      scope: "channel",
      messageId: message.id,
      type: message.type,
      teamCode,
      channelCode,
      user: message.user,
      role: message.role,
      text: message.text,
      timestamp: message.timestamp,
      editedAt: null,
      attachment: null,
      simulated: false,
      createdAt: nowIso()
    });
  } catch (_error) {
    // Keep broadcast flow running even if persistence fails.
  }

  io.to(channelRoomKey(teamCode, channelCode)).emit("system:message", message);
};

const emitBroadcastChannelMessage = async ({ teamCode, channelCode, senderName, senderRole, text, durationSeconds }) => {
  const message = buildChatMessage(
    senderName,
    text,
    {
      type: "channel",
      channelCode,
      isBroadcast: true
    },
    null,
    senderRole,
    false
  );

  try {
    await messagesDb.insert({
      scope: "channel",
      messageId: message.id,
      type: message.type,
      teamCode,
      channelCode,
      user: message.user,
      role: message.role,
      text: message.text,
      timestamp: message.timestamp,
      editedAt: null,
      attachment: null,
      simulated: false,
      createdAt: nowIso()
    });
  } catch (_error) {
    // Keep broadcast flow running even if persistence fails.
  }

  const room = channelRoomKey(teamCode, channelCode);
  io.to(room).emit("chat:message", message);
  io.to(room).emit("broadcast:notice", {
    scope: "channel",
    text,
    senderName,
    senderRole,
    durationMs: Math.max(5000, Math.min(180000, (Number(durationSeconds) || 18) * 1000)),
    teamCode,
    channelCode
  });
};

const emitSimulatedWelcomeSequentially = ({ teamCode, channelCode, announcementText }) => {
  void teamCode;
  void channelCode;
  void announcementText;
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${digest}`;
};

const verifyPassword = (password, hashedValue) => {
  const raw = String(hashedValue || "");
  const [salt, digest] = raw.split(":");
  if (!salt || !digest) {
    return false;
  }

  const computed = crypto.scryptSync(password, salt, 32).toString("hex");
  const expectedBuffer = Buffer.from(digest, "hex");
  const computedBuffer = Buffer.from(computed, "hex");

  if (expectedBuffer.length !== computedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, computedBuffer);
};

const {
  ensureAuthDocShape,
  buildDefaultAuthPayload,
  normalizeOperators,
  isAdminNameKey,
  isOperatorNameKey,
  deriveRoleForName,
  deriveRuntimeRoleForEntry,
  buildTeamAuthState
} = createAuthUtils({
  sanitizeName,
  nameKey,
  sanitizeRole,
  hashPassword,
  nowIso,
  roleGuest: ROLE_GUEST,
  roleMember: ROLE_MEMBER,
  roleAdmin: ROLE_ADMIN,
  roleOwner: ROLE_OWNER,
  roleOperator: ROLE_OPERATOR,
  defaultOwnerUsername: DEFAULT_OWNER_USERNAME,
  defaultAdminUsername: DEFAULT_ADMIN_USERNAME,
  defaultOwnerPassword: DEFAULT_OWNER_PASSWORD,
  defaultAdminPassword: DEFAULT_ADMIN_PASSWORD,
  authSchemaVersion: AUTH_SCHEMA_VERSION
});

const migrateLegacyAuthDocs = async () => {
  const docs = await teamAuthDb.find({}).exec();
  if (!Array.isArray(docs) || docs.length === 0) {
    return;
  }

  const now = nowIso();
  for (const doc of docs) {
    const currentVersion = Number(doc?.authVersion || 0);
    if (currentVersion >= AUTH_SCHEMA_VERSION) {
      continue;
    }

    await teamAuthDb.update(
      { _id: doc._id },
      {
        $set: {
          ownerName: DEFAULT_OWNER_USERNAME,
          ownerPasswordHash: hashPassword(DEFAULT_OWNER_PASSWORD),
          adminPasswordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
          admins: [{
            key: nameKey(DEFAULT_ADMIN_USERNAME),
            name: DEFAULT_ADMIN_USERNAME
          }],
          operators: normalizeOperators(doc.operators),
          authVersion: AUTH_SCHEMA_VERSION,
          migratedAt: now,
          updatedAt: now
        }
      }
    );
  }
};

const resetDefaultAdminPassword = async () => {
  const docs = await teamAuthDb.find({}).exec();
  if (!Array.isArray(docs) || docs.length === 0) {
    return;
  }

  const defaultAdminKey = nameKey(DEFAULT_ADMIN_USERNAME);
  const now = nowIso();

  for (const doc of docs) {
    const safeDoc = ensureAuthDocShape(doc);
    if (!safeDoc) {
      continue;
    }

    const hasDefaultAdmin = (safeDoc.admins || []).some((entry) => entry.key === defaultAdminKey);
    if (!hasDefaultAdmin) {
      continue;
    }

    if (verifyPassword(DEFAULT_ADMIN_PASSWORD, safeDoc.adminPasswordHash)) {
      continue;
    }

    await teamAuthDb.update(
      { _id: safeDoc._id },
      {
        $set: {
          adminPasswordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
          updatedAt: now
        }
      }
    );
  }
};

const ensureAuthDocByTeamCode = async (teamCode) => {
  const existing = await teamAuthDb.findOne({ teamCode });
  if (existing) {
    return ensureAuthDocShape(existing);
  }

  const created = await teamAuthDb.insert(buildDefaultAuthPayload(teamCode));
  return ensureAuthDocShape(created);
};

const {
  emitBroadcastMembersMessage,
  queueMemberBroadcastForOfflineMembers,
  deliverOfflineMemberBroadcastInbox
} = createBroadcastUtils({
  io,
  usersBySocketId,
  messagesDb,
  realMembersDb,
  teamAuthDb,
  memberBroadcastInboxDb,
  sanitizeRole,
  sanitizeCode,
  sanitizeName,
  sanitizeMessage,
  ensureAuthDocShape,
  nameKey,
  buildDmKey,
  buildChatMessage,
  nowIso,
  roleMember: ROLE_MEMBER,
  roleGuest: ROLE_GUEST,
  roleAdmin: ROLE_ADMIN,
  defaultChannelCode: DEFAULT_CHANNEL_CODE
});

const resolveJoinRole = async ({ teamCode, requestedName, requestedRole, password }) => {
  const safeRole = sanitizeRole(requestedRole);
  const safePassword = sanitizePassword(password);
  const shouldInitializeAuth = safeRole !== ROLE_MEMBER && safeRole !== ROLE_GUEST;
  const authDoc = shouldInitializeAuth
    ? await ensureAuthDocByTeamCode(teamCode)
    : ensureAuthDocShape(await teamAuthDb.findOne({ teamCode }));
  const candidateKey = nameKey(requestedName);
  const memberKey = `${teamCode}::${candidateKey}`;
  const realMemberRecord = await realMembersDb.findOne({ memberKey });

  if (safeRole === ROLE_GUEST) {
    if (realMemberRecord?.registeredMember) {
      return {
        ok: false,
        message: "Nama ini sudah terdaftar sebagai member. Pilih role Member dan masukkan password."
      };
    }

    if (authDoc && (authDoc.ownerKey === candidateKey || isAdminNameKey(authDoc, candidateKey) || isOperatorNameKey(authDoc, candidateKey))) {
      return {
        ok: false,
        message: "Nama ini akun owner/admin/operator. Gunakan portal login yang sesuai."
      };
    }

    return {
      ok: true,
      role: ROLE_GUEST,
      authDoc,
      realMemberRecord
    };
  }

  if (safeRole === ROLE_MEMBER) {
    if (!safePassword) {
      return {
        ok: false,
        message: "Password member wajib diisi. Yang bisa masuk langsung hanya Guest."
      };
    }

    if (!realMemberRecord?.registeredMember || !realMemberRecord.memberPasswordHash) {
      return {
        ok: false,
        message: "Nama ini belum terdaftar sebagai member. Silakan daftar member baru dulu."
      };
    }

    if (!verifyPassword(safePassword, realMemberRecord.memberPasswordHash)) {
      return {
        ok: false,
        message: "Password member salah."
      };
    }

    return {
      ok: true,
      role: ROLE_MEMBER,
      authDoc,
      realMemberRecord
    };
  }

  if (safeRole === ROLE_OWNER) {
    if (!safePassword || safePassword.length < MIN_PRIVILEGED_PASSWORD_LENGTH) {
      return {
        ok: false,
        message: `Password owner minimal ${MIN_PRIVILEGED_PASSWORD_LENGTH} karakter.`
      };
    }

    if (!authDoc || authDoc.ownerKey !== candidateKey) {
      return {
        ok: false,
        message: `Username owner harus ${DEFAULT_OWNER_USERNAME}.`
      };
    }

    if (!verifyPassword(safePassword, authDoc.ownerPasswordHash)) {
      return {
        ok: false,
        message: "Password owner salah."
      };
    }

    return {
      ok: true,
      role: ROLE_OWNER,
      authDoc
    };
  }

  if (safeRole === ROLE_ADMIN) {
    if (!authDoc) {
      return {
        ok: false,
        message: "Owner belum dibuat untuk team ini. Buat akun owner dulu."
      };
    }

    if (!safePassword) {
      return {
        ok: false,
        message: "Password admin wajib diisi."
      };
    }

    if (!isAdminNameKey(authDoc, candidateKey)) {
      return {
        ok: false,
        message: `Username admin harus ${DEFAULT_ADMIN_USERNAME} atau akun yang sudah ditandai admin.`
      };
    }

    if (!verifyPassword(safePassword, authDoc.adminPasswordHash)) {
      return {
        ok: false,
        message: "Password admin salah."
      };
    }

    return {
      ok: true,
      role: ROLE_ADMIN,
      authDoc
    };
  }

  if (safeRole === ROLE_OPERATOR) {
    if (!authDoc) {
      return {
        ok: false,
        message: "Owner belum dibuat untuk team ini. Buat akun owner dulu."
      };
    }

    if (!safePassword) {
      return {
        ok: false,
        message: "Password operator wajib diisi."
      };
    }

    if (!isOperatorNameKey(authDoc, candidateKey)) {
      return {
        ok: false,
        message: "Nama ini belum ditandai sebagai operator oleh owner/admin."
      };
    }

    if (!verifyPassword(safePassword, authDoc.adminPasswordHash)) {
      return {
        ok: false,
        message: "Password operator salah."
      };
    }

    return {
      ok: true,
      role: ROLE_OPERATOR,
      authDoc
    };
  }

  if (authDoc && (authDoc.ownerKey === candidateKey || isAdminNameKey(authDoc, candidateKey) || isOperatorNameKey(authDoc, candidateKey))) {
    return {
      ok: false,
      message: "Nama ini akun owner/admin/operator. Pilih role yang sesuai dan masukkan password."
    };
  }

  return {
    ok: true,
    role: ROLE_MEMBER,
    authDoc,
    realMemberRecord
  };
};

const emitAiReply = async ({ teamCode, channelCode, dmKey, peerName, mode, triggerText, triggerUser }) => {
  void teamCode;
  void channelCode;
  void dmKey;
  void peerName;
  void mode;
  void triggerText;
  void triggerUser;
};

const {
  ensureTeam,
  ensureChannel,
  getTeamChannels,
  getChannelHistory,
  getDmHistory
} = createChannelUtils({
  teamsDb,
  channelsDb,
  messagesDb,
  appendPublicLoginConfigOption,
  nowIso,
  getMessageRetentionCutoff,
  defaultChannelCode: DEFAULT_CHANNEL_CODE,
  defaultTeamNoticeMessage: DEFAULT_TEAM_NOTICE_MESSAGE,
  messageHistoryLimit: MESSAGE_HISTORY_LIMIT,
  aiBotName: AI_BOT_NAME,
  roleMember: ROLE_MEMBER
});

const {
  emitPresence,
  emitTeamState,
  findPreferredAdminDmTarget,
  isSimulatedMemberNameInTeam
} = createPresenceUtils({
  io,
  usersBySocketId,
  typingSocketIds,
  teamsDb,
  teamAuthDb,
  sanitizeCode,
  sanitizeName,
  sanitizeTeamNotice,
  buildTeamAuthState,
  getTeamChannels,
  getPublicLoginConfig,
  getPublicSimulationConfig,
  getPublicUploadConfig,
  teamRoomKey,
  channelRoomKey,
  roleMember: ROLE_MEMBER,
  roleAdmin: ROLE_ADMIN,
  roleOwner: ROLE_OWNER,
  loginConfigDocKey: LOGIN_CONFIG_DOC_KEY,
  simulationConfigDocKey: SIMULATION_CONFIG_DOC_KEY,
  uploadConfigDocKey: UPLOAD_CONFIG_DOC_KEY,
  defaultTeamNoticeMessage: DEFAULT_TEAM_NOTICE_MESSAGE
});

const joinChannelForSocket = async ({ socket, user, channelCode, announce, joinAnnouncementText = "" }) => {
  const nextChannelCode = sanitizeCode(channelCode, DEFAULT_CHANNEL_CODE);
  const channelDoc = await ensureChannel(user.teamCode, nextChannelCode, user.name);

  const previousChannelCode = user.channelCode;
  if (previousChannelCode && previousChannelCode !== nextChannelCode) {
    socket.leave(channelRoomKey(user.teamCode, previousChannelCode));
    typingSocketIds.delete(socket.id);

    if (announce) {
      io.to(channelRoomKey(user.teamCode, previousChannelCode)).emit(
        "system:message",
        buildSystemMessage(`${user.name} moved to #${nextChannelCode}.`, {
          type: "channel",
          channelCode: previousChannelCode
        })
      );
    }

    emitPresence(user.teamCode, previousChannelCode);
  }

  user.channelCode = nextChannelCode;
  user.activeMode = "channel";
  user.activeDmKey = null;
  user.activeDmPeerName = null;
  user.activeDmProxyTargetName = null;
  user.activeDmProxyAliasName = null;
  usersBySocketId.set(socket.id, user);

  socket.join(channelRoomKey(user.teamCode, nextChannelCode));

  const history = await getChannelHistory(user.teamCode, nextChannelCode);
  socket.emit("chat:history", history);
  socket.emit("channel:joined", {
    teamCode: user.teamCode,
    channelCode: nextChannelCode,
    role: user.role || ROLE_MEMBER,
    registeredMember: Boolean(user.registeredMember)
  });
  socket.emit("channel:pinned", {
    teamCode: user.teamCode,
    channelCode: nextChannelCode,
    pinnedMessage: sanitizePinnedMessage(channelDoc?.pinnedMessage)
  });

  if (announce) {
    if (joinAnnouncementText !== null) {
      const announcementText = String(joinAnnouncementText || "").trim() || `${user.name} joined #${nextChannelCode}.`;

      if (user.simulated) {
        emitSimulatedWelcomeSequentially({
          teamCode: user.teamCode,
          channelCode: nextChannelCode,
          announcementText
        });
      } else {
        // Send real-member join announcement shortly after history to avoid reset race.
        setTimeout(() => {
          io.to(channelRoomKey(user.teamCode, nextChannelCode)).emit(
            "system:message",
            buildSystemMessage(announcementText, {
              type: "channel",
              channelCode: nextChannelCode
            })
          );
        }, 40);
      }
    }
  }

  emitPresence(user.teamCode, nextChannelCode);
  await emitTeamState(user.teamCode);
};

io.on("connection", (socket) => {
  socket.data.messageTimestamps = [];
  socket.data.explicitLogout = false;

  socket.on("session:logout", () => {
    socket.data.explicitLogout = true;
  });

  socket.on("join:request", async (payload) => {
    const requestedName = sanitizeName(payload?.name || "");
    const teamCode = sanitizeCode(payload?.teamCode || "", DEFAULT_TEAM_CODE);
    const channelCode = sanitizeCode(payload?.channelCode || "", DEFAULT_CHANNEL_CODE);
    const requestedRole = sanitizeRole(payload?.role || ROLE_MEMBER);
    const password = sanitizePassword(payload?.password || "");
    const clientFingerprint = buildClientFingerprint({ socket });
    const isSimulated = Boolean(payload?.simulated);

    if (!requestedName) {
      socket.emit("join:error", { message: "Nama tidak valid." });
      return;
    }

    const previousUser = usersBySocketId.get(socket.id);
    if (previousUser && previousUser.teamCode !== teamCode) {
      socket.leave(teamRoomKey(previousUser.teamCode));
      socket.leave(channelRoomKey(previousUser.teamCode, previousUser.channelCode));
      typingSocketIds.delete(socket.id);
      await emitTeamState(previousUser.teamCode);
      emitPresence(previousUser.teamCode, previousUser.channelCode);
    }

    await ensureTeam(teamCode, requestedName);
    await ensureChannel(teamCode, DEFAULT_CHANNEL_CODE, requestedName);

    const roleResolution = await resolveJoinRole({
      teamCode,
      requestedName,
      requestedRole,
      password
    });

    if (!roleResolution.ok) {
      socket.emit("join:error", { message: roleResolution.message || "Akses ditolak." });
      return;
    }

    let realMemberRecord = roleResolution.realMemberRecord || null;
    if (!isSimulated && realMemberRecord?.registeredMember) {
      realMemberRecord = await upsertRealMemberRecord({
        name: requestedName,
        teamCode,
        channelCode
      });
    }

    const user = {
      id: socket.id,
      name: requestedName,
      role: roleResolution.role,
      teamCode,
      channelCode,
      activeMode: "channel",
      activeDmKey: null,
      activeDmPeerName: null,
      activeDmProxyTargetName: null,
      activeDmProxyAliasName: null,
      joinedAt: nowIso(),
      simulated: isSimulated,
      registeredMember: Boolean(realMemberRecord?.registeredMember),
      fingerprintKey: clientFingerprint.fingerprintKey
    };

    usersBySocketId.set(socket.id, user);
    socket.join(teamRoomKey(teamCode));
    socket.data.explicitLogout = false;

    const effectiveFingerprint = isSimulated
      ? {
        ...clientFingerprint,
        fingerprintKey: `sim:${nameKey(requestedName)}`
      }
      : clientFingerprint;

    await joinChannelForSocket({
      socket,
      user,
      channelCode,
      announce: false,
      joinAnnouncementText: null
    });

    await deliverOfflineMemberBroadcastInbox({ socket, user });
  });

  socket.on("channel:create", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum create channel." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN, ROLE_OPERATOR].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin/operator yang bisa membuat channel." });
      return;
    }

    const channelCode = sanitizeCode(payload?.channelCode || "", DEFAULT_CHANNEL_CODE);
    await ensureChannel(user.teamCode, channelCode, user.name);
    await emitTeamState(user.teamCode);
  });

  socket.on("team:create", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum buat team baru." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN, ROLE_OPERATOR].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin/operator yang bisa membuat team." });
      return;
    }

    const teamCode = sanitizeCode(payload?.teamCode || "", "");
    if (!teamCode) {
      socket.emit("join:error", { message: "Kode team baru tidak valid." });
      return;
    }

    await ensureTeam(teamCode, user.name);
    await ensureChannel(teamCode, DEFAULT_CHANNEL_CODE, user.name);
    socket.emit("team:created", { teamCode });
    await emitTeamState(user.teamCode);
  });

  socket.on("role:update", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum kelola role." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa mengelola role." });
      return;
    }

    const targetUserId = String(payload?.targetUserId || "").trim();
    const nextRole = sanitizeRole(payload?.nextRole || ROLE_MEMBER);
    const targetUser = usersBySocketId.get(targetUserId);

    if (!targetUser || targetUser.teamCode !== user.teamCode) {
      socket.emit("join:error", { message: "Target user tidak valid." });
      return;
    }

    if (targetUser.role === ROLE_OWNER || targetUser.id === user.id) {
      socket.emit("join:error", { message: "Role owner tidak bisa diubah dan kamu tidak bisa mengubah role diri sendiri." });
      return;
    }

    const authDocRaw = await teamAuthDb.findOne({ teamCode: user.teamCode });
    const authDoc = ensureAuthDocShape(authDocRaw);
    if (!authDoc) {
      socket.emit("join:error", { message: "Data role team belum siap." });
      return;
    }

    const nextAdmins = [...(authDoc.admins || [])];
    const nextOperators = [...(authDoc.operators || [])];
    const targetKey = nameKey(targetUser.name);
    const adminIndex = nextAdmins.findIndex((entry) => entry.key === targetKey);
    const operatorIndex = nextOperators.findIndex((entry) => entry.key === targetKey);

    if (adminIndex >= 0) {
      nextAdmins.splice(adminIndex, 1);
    }

    if (operatorIndex >= 0) {
      nextOperators.splice(operatorIndex, 1);
    }

    if (nextRole === ROLE_ADMIN) {
      nextAdmins.push({ key: targetKey, name: targetUser.name });
    }

    if (nextRole === ROLE_OPERATOR) {
      nextOperators.push({ key: targetKey, name: targetUser.name });
    }

    await teamAuthDb.update(
      { _id: authDoc._id },
      {
        $set: {
          admins: nextAdmins,
          operators: nextOperators,
          updatedAt: nowIso()
        }
      }
    );

    Array.from(usersBySocketId.values())
      .filter((entry) => entry.teamCode === user.teamCode)
      .forEach((entry) => {
        entry.role = deriveRuntimeRoleForEntry(
          {
            ...authDoc,
            admins: nextAdmins,
            operators: nextOperators
          },
          entry
        );
        usersBySocketId.set(entry.id, entry);
      });

    await emitTeamState(user.teamCode);
    const channelsInTeam = new Set(
      Array.from(usersBySocketId.values())
        .filter((entry) => entry.teamCode === user.teamCode)
        .map((entry) => entry.channelCode)
    );

    channelsInTeam.forEach((channelCode) => {
      emitPresence(user.teamCode, channelCode);
    });
  });

  socket.on("broadcast:send", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum kirim broadcast." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa kirim broadcast." });
      return;
    }

    const messageText = sanitizeMessage(payload?.text || "");
    const targetTeamCode = sanitizeCode(payload?.targetTeamCode || "", user.teamCode || DEFAULT_TEAM_CODE);
    const requestedMode = String(payload?.targetMode || "active").trim().toLowerCase();
    const targetMode = requestedMode === "all" || requestedMode === "channel" || requestedMode === "members"
      ? requestedMode
      : "active";
    const durationSeconds = Math.max(5, Math.min(180, Number.parseInt(payload?.durationSeconds, 10) || 18));

    if (!messageText) {
      socket.emit("join:error", { message: "Pesan broadcast tidak boleh kosong." });
      return;
    }

    if (targetMode === "members") {
      const targetTeamCodes = Array.from(
        new Set(
          (Array.isArray(payload?.targetTeamCodes) ? payload.targetTeamCodes : [targetTeamCode])
            .map((teamCode) => sanitizeCode(teamCode || "", ""))
            .filter(Boolean)
        )
      );

      const targetChannelCodes = Array.from(
        new Set(
          (Array.isArray(payload?.targetChannelCodes) ? payload.targetChannelCodes : [])
            .map((channelCode) => sanitizeCode(channelCode || "", ""))
            .filter(Boolean)
        )
      );

      const targetRoles = Array.from(
        new Set(
          (Array.isArray(payload?.targetRoles) ? payload.targetRoles : [ROLE_MEMBER, ROLE_GUEST])
            .map((role) => sanitizeRole(role || ROLE_MEMBER))
            .filter((role) => role === ROLE_MEMBER || role === ROLE_GUEST)
        )
      );

      if (targetTeamCodes.length === 0 && targetChannelCodes.length === 0 && targetRoles.length === 0) {
        socket.emit("join:error", { message: "Checklist target broadcast dulu (team/channel/member/guest)." });
        return;
      }

      const effectiveTeamCodes = targetTeamCodes.length > 0
        ? targetTeamCodes
        : [targetTeamCode];

      const deliveredChannelKeys = new Set();
      const teamBroadcastTeams = [];
      const channelBroadcastTargets = [];
      const deliveredRecipients = [];
      const queuedRecipients = [];

      // Team checklist: kirim global ke seluruh channel pada team terpilih.
      for (const teamCode of targetTeamCodes) {
        await ensureTeam(teamCode, user.name);
        const channelsInTeam = await getTeamChannels(teamCode);
        for (const channelCode of channelsInTeam) {
          const safeChannelCode = sanitizeCode(channelCode || "", "");
          if (!safeChannelCode) {
            continue;
          }

          const routeKey = `${teamCode}::${safeChannelCode}`;
          if (deliveredChannelKeys.has(routeKey)) {
            continue;
          }

          await emitBroadcastChannelMessage({
            teamCode,
            channelCode: safeChannelCode,
            senderName: user.name,
            senderRole: user.role,
            text: messageText,
            durationSeconds
          });

          deliveredChannelKeys.add(routeKey);
        }

        teamBroadcastTeams.push(teamCode);
      }

      // Channel checklist: kirim global hanya ke channel terpilih.
      for (const teamCode of effectiveTeamCodes) {
        await ensureTeam(teamCode, user.name);
        const channelsInTeam = new Set(
          (await getTeamChannels(teamCode))
            .map((channelCode) => sanitizeCode(channelCode || "", ""))
            .filter(Boolean)
        );

        for (const channelCode of targetChannelCodes) {
          if (!channelsInTeam.has(channelCode)) {
            continue;
          }

          const routeKey = `${teamCode}::${channelCode}`;
          if (deliveredChannelKeys.has(routeKey)) {
            continue;
          }

          await emitBroadcastChannelMessage({
            teamCode,
            channelCode,
            senderName: user.name,
            senderRole: user.role,
            text: messageText,
            durationSeconds
          });

          deliveredChannelKeys.add(routeKey);
          channelBroadcastTargets.push(`${teamCode}::${channelCode}`);
        }
      }

      // Member/Guest checklist: kirim DM privat sesuai role terpilih.
      if (targetRoles.length > 0) {
        for (const teamCode of effectiveTeamCodes) {
          await ensureTeam(teamCode, user.name);

          const delivered = await emitBroadcastMembersMessage({
            teamCode,
            senderName: user.name,
            senderRole: user.role,
            text: messageText,
            durationSeconds,
            targetRoles,
            targetChannelCodes: []
          });
          delivered.forEach((name) => deliveredRecipients.push(name));

          const queued = await queueMemberBroadcastForOfflineMembers({
            teamCode,
            senderName: user.name,
            senderRole: user.role,
            text: messageText,
            durationSeconds,
            targetRoles,
            targetChannelCodes: []
          });
          queued.forEach((name) => queuedRecipients.push(name));
        }
      }

      socket.emit("broadcast:sent", {
        scope: "independent",
        targetTeamCode: effectiveTeamCodes[0] || targetTeamCode,
        targetTeamCodes: effectiveTeamCodes,
        targetChannelCodes,
        targetRoles,
        durationSeconds,
        teamBroadcastTeams: Array.from(new Set(teamBroadcastTeams)),
        channelBroadcastTargets: Array.from(new Set(channelBroadcastTargets)),
        deliveredChannels: Array.from(deliveredChannelKeys),
        deliveredRecipients: Array.from(new Set(deliveredRecipients)),
        queuedRecipients: Array.from(new Set(queuedRecipients))
      });
      return;
    }

    await ensureTeam(targetTeamCode, user.name);

    const deliveredChannels = [];

    if (targetMode === "channel") {
      const targetChannelCode = sanitizeCode(payload?.channelCode || "", user.channelCode || DEFAULT_CHANNEL_CODE);
      await ensureChannel(targetTeamCode, targetChannelCode, user.name);
      await emitBroadcastChannelMessage({
        teamCode: targetTeamCode,
        channelCode: targetChannelCode,
        senderName: user.name,
        senderRole: user.role,
        text: messageText,
        durationSeconds
      });
      deliveredChannels.push(targetChannelCode);

      socket.emit("broadcast:sent", {
        scope: "channel",
        targetTeamCode,
        channelCode: targetChannelCode,
        durationSeconds,
        deliveredChannels
      });
      return;
    }

    let channels = [];
    if (targetMode === "all") {
      channels = await getTeamChannels(targetTeamCode);
    } else {
      channels = Array.from(
        new Set(
          Array.from(usersBySocketId.values())
            .filter((member) => member?.teamCode === targetTeamCode)
            .map((member) => sanitizeCode(member?.channelCode || "", ""))
            .filter(Boolean)
        )
      );
      if (channels.length === 0) {
        channels = await getTeamChannels(targetTeamCode);
      }
    }

    for (const channelCode of channels) {
      await ensureChannel(targetTeamCode, channelCode, user.name);
      await emitBroadcastChannelMessage({
        teamCode: targetTeamCode,
        channelCode,
        senderName: user.name,
        senderRole: user.role,
        text: messageText,
        durationSeconds
      });
      deliveredChannels.push(channelCode);
    }

    socket.emit("broadcast:sent", {
      scope: targetMode,
      targetTeamCode,
      durationSeconds,
      deliveredChannels
    });
  });

  socket.on("login:config:update", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum ubah login member." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa ubah login member." });
      return;
    }

    const savedConfig = await savePublicLoginConfig(payload?.config || {}, user.name);
    io.emit("login:config:updated", {
      config: savedConfig,
      updatedBy: user.name,
      updatedAt: nowIso()
    });
  });

  socket.on("simulation:config:update", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum ubah simulasi chat." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa ubah simulasi chat." });
      return;
    }

    const savedConfig = await savePublicSimulationConfig(payload?.config || {}, user.name);
    io.emit("simulation:config:updated", {
      config: savedConfig,
      updatedBy: user.name,
      updatedAt: nowIso()
    });
  });

  socket.on("upload:config:update", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum ubah batas upload." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa ubah batas upload." });
      return;
    }

    const savedConfig = await savePublicUploadConfig(payload?.config || {}, user.name);
    io.emit("upload:config:updated", {
      config: savedConfig,
      updatedBy: user.name,
      updatedAt: nowIso()
    });
  });

  socket.on("auth:update-self", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum ubah akun." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa mengubah akun login." });
      return;
    }

    const nextName = sanitizeName(payload?.username || "");
    const nextPassword = sanitizePassword(payload?.password || "");
    if (!nextName && !nextPassword) {
      socket.emit("join:error", { message: "Isi username atau password baru dulu." });
      return;
    }

    if (nextPassword && nextPassword.length < MIN_PRIVILEGED_PASSWORD_LENGTH) {
      socket.emit("join:error", { message: `Password minimal ${MIN_PRIVILEGED_PASSWORD_LENGTH} karakter.` });
      return;
    }

    const authDoc = ensureAuthDocShape(await teamAuthDb.findOne({ teamCode: user.teamCode }));
    if (!authDoc) {
      socket.emit("join:error", { message: "Data akun tidak ditemukan." });
      return;
    }

    let ownerName = authDoc.ownerName;
    let ownerPasswordHash = authDoc.ownerPasswordHash;
    let adminPasswordHash = authDoc.adminPasswordHash;
    const admins = [...(authDoc.admins || [])];
    const operators = [...(authDoc.operators || [])];

    const currentKey = nameKey(user.name);
    let updatedName = user.name;

    if (user.role === ROLE_OWNER) {
      if (nextName) {
        const nextKey = nameKey(nextName);
        const isConflict = isAdminNameKey({ ...authDoc, admins }, nextKey) || isOperatorNameKey({ ...authDoc, operators }, nextKey);
        if (isConflict) {
          socket.emit("join:error", { message: "Username owner bentrok dengan akun admin/operator." });
          return;
        }

        ownerName = nextName;
        updatedName = nextName;
      }

      if (nextPassword) {
        ownerPasswordHash = hashPassword(nextPassword);
      }
    }

    if (user.role === ROLE_ADMIN) {
      const adminIndex = admins.findIndex((entry) => entry.key === currentKey);
      if (adminIndex < 0) {
        socket.emit("join:error", { message: "Akun admin kamu tidak terdaftar." });
        return;
      }

      if (nextName) {
        const nextKey = nameKey(nextName);
        const clashOwner = nameKey(ownerName) === nextKey;
        const clashAdmin = admins.some((entry, index) => index !== adminIndex && entry.key === nextKey);
        const clashOperator = operators.some((entry) => entry.key === nextKey);
        if (clashOwner || clashAdmin || clashOperator) {
          socket.emit("join:error", { message: "Username admin bentrok dengan akun lain." });
          return;
        }

        admins[adminIndex] = { key: nextKey, name: nextName };
        updatedName = nextName;
      }

      if (nextPassword) {
        adminPasswordHash = hashPassword(nextPassword);
      }
    }

    await teamAuthDb.update(
      { _id: authDoc._id },
      {
        $set: {
          ownerName,
          ownerPasswordHash,
          adminPasswordHash,
          admins,
          operators,
          authVersion: AUTH_SCHEMA_VERSION,
          updatedAt: nowIso()
        }
      }
    );

    Array.from(usersBySocketId.values())
      .filter((entry) => entry.teamCode === user.teamCode)
      .forEach((entry) => {
        if (entry.id === user.id) {
          entry.name = updatedName;
        }

        entry.role = deriveRuntimeRoleForEntry(
          {
            ...authDoc,
            ownerName,
            admins,
            operators
          },
          entry
        );
        usersBySocketId.set(entry.id, entry);
      });

    const updatedUser = usersBySocketId.get(socket.id);
    socket.emit("auth:self-updated", {
      name: updatedUser?.name || updatedName,
      role: updatedUser?.role || user.role
    });

    await emitTeamState(user.teamCode);
    const channelsInTeam = new Set(
      Array.from(usersBySocketId.values())
        .filter((entry) => entry.teamCode === user.teamCode)
        .map((entry) => entry.channelCode)
    );

    channelsInTeam.forEach((channelCode) => {
      emitPresence(user.teamCode, channelCode);
    });
  });

  socket.on("channel:switch", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum pindah channel." });
      return;
    }

    const channelCode = sanitizeCode(payload?.channelCode || "", DEFAULT_CHANNEL_CODE);
    if (channelCode === user.channelCode && user.activeMode === "channel") {
      user.activeMode = "channel";
      user.activeDmKey = null;
      user.activeDmPeerName = null;
      user.activeDmProxyTargetName = null;
      user.activeDmProxyAliasName = null;
      usersBySocketId.set(socket.id, user);
      return;
    }

    await joinChannelForSocket({
      socket,
      user,
      channelCode,
      announce: true
    });
  });

  socket.on("dm:start", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum chat privat." });
      return;
    }

    const targetUserId = String(payload?.targetUserId || "");
    const targetUser = usersBySocketId.get(targetUserId);

    const isPublicSender = user.role === ROLE_MEMBER;
    const shouldRedirectToAdmin = isPublicSender && Boolean(targetUser?.simulated);
    const redirectedTarget = shouldRedirectToAdmin
      ? findPreferredAdminDmTarget(user.teamCode, user.id)
      : null;

    const dmTarget = redirectedTarget || targetUser;

    if (!dmTarget || dmTarget.teamCode !== user.teamCode) {
      if (shouldRedirectToAdmin) {
        socket.emit("join:error", { message: "Admin belum online. DM untuk member simulasi diarahkan ke admin." });
        return;
      }

      socket.emit("join:error", { message: "User target tidak tersedia di team yang sama." });
      return;
    }

    if (dmTarget.id === user.id) {
      socket.emit("join:error", { message: "Tidak bisa memulai DM ke diri sendiri." });
      return;
    }

    const targetDisplayName = shouldRedirectToAdmin ? targetUser.name : dmTarget.name;
    const dmKey = buildDmKey(user.name, dmTarget.name);
    const room = dmRoomKey(user.teamCode, dmKey);

    socket.join(room);
    const targetSocket = io.sockets.sockets.get(dmTarget.id);
    if (targetSocket) {
      targetSocket.join(room);
    }

    user.activeMode = "dm";
    user.activeDmKey = dmKey;
    user.activeDmPeerName = targetDisplayName;
    user.activeDmProxyTargetName = shouldRedirectToAdmin ? dmTarget.name : null;
    user.activeDmProxyAliasName = shouldRedirectToAdmin ? targetDisplayName : null;
    usersBySocketId.set(socket.id, user);

    const history = await getDmHistory(user.teamCode, dmKey, targetDisplayName);
    socket.emit("dm:ready", {
      dmKey,
      peerName: targetDisplayName,
      history
    });

    io.to(dmTarget.id).emit("dm:available", {
      dmKey,
      peerName: user.name
    });
  });

  socket.on("dm:open", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum buka DM." });
      return;
    }

    let peerName = sanitizeName(payload?.peerName || "");
    if (!peerName) {
      return;
    }

    const shouldProxyToAdmin = user.role === ROLE_MEMBER && isSimulatedMemberNameInTeam(user.teamCode, peerName);
    let proxyTargetName = null;
    let displayPeerName = peerName;

    if (shouldProxyToAdmin) {
      const redirectedTarget = findPreferredAdminDmTarget(user.teamCode, user.id);
      if (!redirectedTarget) {
        socket.emit("join:error", { message: "Admin belum online. DM untuk member simulasi diarahkan ke admin." });
        return;
      }

      proxyTargetName = redirectedTarget.name;
    }

    const dmPeerForKey = proxyTargetName || peerName;
    const dmKey = buildDmKey(user.name, dmPeerForKey);
    const dmRoom = dmRoomKey(user.teamCode, dmKey);
    socket.join(dmRoom);

    if (proxyTargetName) {
      const proxyTargetUser = Array.from(usersBySocketId.values()).find(
        (entry) => entry.teamCode === user.teamCode && entry.name === proxyTargetName && entry.id !== user.id
      );
      const proxyTargetSocket = proxyTargetUser ? io.sockets.sockets.get(proxyTargetUser.id) : null;
      if (proxyTargetSocket) {
        proxyTargetSocket.join(dmRoom);
      }

      if (proxyTargetUser) {
        io.to(proxyTargetUser.id).emit("dm:available", {
          dmKey,
          peerName: user.name
        });
      }
    }

    user.activeMode = "dm";
    user.activeDmKey = dmKey;
    user.activeDmPeerName = displayPeerName;
    user.activeDmProxyTargetName = proxyTargetName;
    user.activeDmProxyAliasName = proxyTargetName ? displayPeerName : null;
    usersBySocketId.set(socket.id, user);

    const history = await getDmHistory(user.teamCode, dmKey, displayPeerName);
    socket.emit("dm:ready", {
      dmKey,
      peerName: displayPeerName,
      history
    });
  });

  socket.on("chat:message", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Silakan join dulu sebelum kirim pesan." });
      return;
    }

    const messageText = sanitizeMessage(payload?.text || "");
    const attachment = sanitizeAttachment(payload?.attachment);

    if (!messageText && !attachment) {
      return;
    }

    const currentTime = Date.now();
    const timestamps = socket.data.messageTimestamps.filter(
      (time) => currentTime - time <= RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= RATE_LIMIT_MAX_MESSAGES) {
      socket.emit("chat:throttled", {
        message: "Terlalu cepat mengirim pesan. Coba lagi beberapa detik lagi."
      });
      socket.data.messageTimestamps = timestamps;
      return;
    }

    timestamps.push(currentTime);
    socket.data.messageTimestamps = timestamps;

    const mode = payload?.mode === "dm" ? "dm" : "channel";

    if (mode === "dm") {
      const peerName = sanitizeName(payload?.peerName || "");
      const dmKey = String(payload?.dmKey || "");
      const proxyAlias = sanitizeName(user.activeDmProxyAliasName || "");
      const proxyTarget = sanitizeName(user.activeDmProxyTargetName || "");
      const isProxyDm = Boolean(proxyTarget)
        && String(user.activeDmKey || "") === dmKey
        && peerName === proxyAlias;
      const validatedPeerName = isProxyDm ? proxyTarget : peerName;
      const expectedKey = buildDmKey(user.name, validatedPeerName);

      if (!peerName || !dmKey || expectedKey !== dmKey) {
        socket.emit("join:error", { message: "DM context tidak valid." });
        return;
      }

      const room = dmRoomKey(user.teamCode, dmKey);
      socket.join(room);

      const context = {
        type: "dm",
        dmKey,
        peerName
      };

      const message = buildChatMessage(user.name, messageText, context, attachment, user.role || ROLE_MEMBER);
      typingSocketIds.delete(socket.id);

      try {
        await messagesDb.insert({
          scope: "dm",
          messageId: message.id,
          type: message.type,
          teamCode: user.teamCode,
          dmKey,
          user: message.user,
          role: user.role || ROLE_MEMBER,
          text: message.text,
          timestamp: message.timestamp,
          editedAt: null,
          attachment: message.attachment
        });
      } catch (_error) {
        // Keep DM flow running if persistence fails.
      }

      io.to(room).emit("chat:message", message);
      io.to(user.id).emit("dm:available", { dmKey, peerName });

      const peerSockets = Array.from(usersBySocketId.values()).filter(
        (entry) => entry.teamCode === user.teamCode && nameKey(entry.name) === nameKey(peerName)
      );

      peerSockets.forEach((entry) => {
        io.to(entry.id).emit("dm:available", {
          dmKey,
          peerName: user.name
        });
      });

      emitAiReply({
        teamCode: user.teamCode,
        dmKey,
        mode: "dm",
        peerName,
        triggerText: messageText,
        triggerUser: user.name
      });

      return;
    }

    const context = {
      type: "channel",
      channelCode: user.channelCode
    };

    const message = buildChatMessage(user.name, messageText, context, attachment, user.role || ROLE_MEMBER, user.simulated);
    typingSocketIds.delete(socket.id);

    try {
      await messagesDb.insert({
        scope: "channel",
        messageId: message.id,
        type: message.type,
        teamCode: user.teamCode,
        channelCode: user.channelCode,
        user: message.user,
        role: user.role || ROLE_MEMBER,
        text: message.text,
        timestamp: message.timestamp,
        editedAt: null,
        attachment: message.attachment,
        simulated: Boolean(user.simulated)
      });
    } catch (_error) {
      // Keep channel flow running if persistence fails.
    }

    io.to(channelRoomKey(user.teamCode, user.channelCode)).emit("chat:message", message);
    emitPresence(user.teamCode, user.channelCode);

    emitAiReply({
      teamCode: user.teamCode,
      channelCode: user.channelCode,
      mode: "channel",
      triggerText: messageText,
      triggerUser: user.name
    });
  });

  socket.on("chat:pin", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Silakan join dulu sebelum pin pesan." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa pin pesan." });
      return;
    }

    const channelCode = sanitizeCode(payload?.channelCode || "", user.channelCode || DEFAULT_CHANNEL_CODE);
    const pinnedMessage = sanitizePinnedMessage({
      sourceMessageId: payload?.messageId,
      text: payload?.text,
      user: payload?.user,
      role: payload?.role,
      channelCode,
      pinnedBy: user.name,
      pinnedAt: nowIso()
    });

    if (!pinnedMessage) {
      socket.emit("join:error", { message: "Pesan pin tidak valid." });
      return;
    }

    await ensureChannel(user.teamCode, channelCode, user.name);
    await channelsDb.update(
      { teamCode: user.teamCode, channelCode },
      {
        $set: {
          pinnedMessage,
          updatedAt: nowIso()
        }
      }
    );

    io.to(channelRoomKey(user.teamCode, channelCode)).emit("channel:pinned", {
      teamCode: user.teamCode,
      channelCode,
      pinnedMessage
    });
  });

  socket.on("chat:unpin", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Silakan join dulu sebelum unpin pesan." });
      return;
    }

    if (![ROLE_OWNER, ROLE_ADMIN].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa unpin pesan." });
      return;
    }

    const channelCode = sanitizeCode(payload?.channelCode || "", user.channelCode || DEFAULT_CHANNEL_CODE);
    await ensureChannel(user.teamCode, channelCode, user.name);
    await channelsDb.update(
      { teamCode: user.teamCode, channelCode },
      {
        $set: {
          pinnedMessage: null,
          updatedAt: nowIso()
        }
      }
    );

    io.to(channelRoomKey(user.teamCode, channelCode)).emit("channel:pinned", {
      teamCode: user.teamCode,
      channelCode,
      pinnedMessage: null
    });
  });

  socket.on("chat:edit", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Silakan join dulu sebelum edit pesan." });
      return;
    }

    const messageId = String(payload?.messageId || "").trim();
    const nextText = sanitizeMessage(payload?.text || "");
    if (!messageId || !nextText) {
      return;
    }

    const editedAt = nowIso();
    const mode = payload?.mode === "dm" ? "dm" : "channel";

    if (mode === "dm") {
      const peerName = sanitizeName(payload?.peerName || "");
      const dmKey = String(payload?.dmKey || "").trim();
      if (!peerName || !dmKey || buildDmKey(user.name, peerName) !== dmKey) {
        socket.emit("join:error", { message: "DM context tidak valid untuk edit pesan." });
        return;
      }

      const existing = await messagesDb.findOne({
        scope: "dm",
        teamCode: user.teamCode,
        dmKey,
        messageId,
        user: user.name,
        type: "chat"
      });

      if (!existing) {
        return;
      }

      await messagesDb.update(
        { _id: existing._id },
        { $set: { text: nextText, editedAt } }
      );

      io.to(dmRoomKey(user.teamCode, dmKey)).emit("chat:edited", {
        id: messageId,
        text: nextText,
        editedAt,
        context: {
          type: "dm",
          dmKey,
          peerName
        }
      });

      return;
    }

    const channelCode = sanitizeCode(payload?.channelCode || "", user.channelCode || DEFAULT_CHANNEL_CODE);
    const existing = await messagesDb.findOne({
      scope: "channel",
      teamCode: user.teamCode,
      channelCode,
      messageId,
      user: user.name,
      type: "chat"
    });

    if (!existing) {
      return;
    }

    await messagesDb.update(
      { _id: existing._id },
      { $set: { text: nextText, editedAt } }
    );

    io.to(channelRoomKey(user.teamCode, channelCode)).emit("chat:edited", {
      id: messageId,
      text: nextText,
      editedAt,
      context: {
        type: "channel",
        channelCode
      }
    });
  });

  socket.on("typing:start", () => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      return;
    }

    typingSocketIds.add(socket.id);
    emitPresence(user.teamCode, user.channelCode);
  });

  socket.on("typing:stop", () => {
    const user = usersBySocketId.get(socket.id);
    typingSocketIds.delete(socket.id);

    if (user) {
      emitPresence(user.teamCode, user.channelCode);
    }
  });

  socket.on("disconnect", async () => {
    const user = usersBySocketId.get(socket.id);
    const shouldAnnounceLeave = socket.data.explicitLogout === true;
    usersBySocketId.delete(socket.id);
    typingSocketIds.delete(socket.id);

    if (!user) {
      return;
    }

    if (shouldAnnounceLeave) {
      clearJoinGreetingHistoryForUser(user.teamCode, user.name, user.fingerprintKey || "");
      io.to(channelRoomKey(user.teamCode, user.channelCode)).emit(
        "system:message",
        buildSystemMessage(`${user.name} left #${user.channelCode}.`, {
          type: "channel",
          channelCode: user.channelCode
        })
      );
    }

    emitPresence(user.teamCode, user.channelCode);
    await emitTeamState(user.teamCode);
  });
});

const startServer = async () => {
  await migrateLegacyAuthDocs();
  await resetDefaultAdminPassword();
  await cleanupExpiredMessages();
  await compactMessageStore();
  scheduleMessageRetentionCleanup();

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Live chat running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});
