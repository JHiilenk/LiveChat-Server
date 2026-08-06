const createSocketContextUtils = ({ sanitizeName }) => {
  const nameKey = (name) => {
    return sanitizeName(name)
      .toLowerCase()
      .replace(/\s+/g, "_");
  };

  const buildDmKey = (nameA, nameB) => {
    return [nameKey(nameA), nameKey(nameB)].sort().join("::");
  };

  const getHistoryStoreForTeam = (storeByTeam, teamCode) => {
    if (!storeByTeam.has(teamCode)) {
      storeByTeam.set(teamCode, new Map());
    }

    return storeByTeam.get(teamCode);
  };

  const sanitizeIpAddress = (value) => {
    const raw = String(value || "").trim();
    if (!raw) {
      return "unknown";
    }

    const normalized = raw.replace(/^::ffff:/i, "").replace(/[^0-9a-fA-F:.]/g, "");
    return normalized || "unknown";
  };

  const extractClientIpAddress = (socket) => {
    const xForwardedFor = String(socket?.handshake?.headers?.["x-forwarded-for"] || "").trim();
    if (xForwardedFor) {
      const firstAddress = xForwardedFor.split(",")[0];
      return sanitizeIpAddress(firstAddress);
    }

    return sanitizeIpAddress(socket?.handshake?.address);
  };

  const detectBrowserLabel = (userAgent) => {
    const ua = String(userAgent || "").toLowerCase();
    if (!ua) {
      return "Unknown browser";
    }

    if (ua.includes("edg/")) {
      return "Edge";
    }

    if (ua.includes("opr/") || ua.includes("opera")) {
      return "Opera";
    }

    if (ua.includes("firefox/")) {
      return "Firefox";
    }

    if (ua.includes("chrome/")) {
      return "Chrome";
    }

    if (ua.includes("safari/") && !ua.includes("chrome/")) {
      return "Safari";
    }

    return "Other browser";
  };

  const buildClientFingerprint = ({ socket }) => {
    const ipAddress = extractClientIpAddress(socket);
    const userAgent = String(socket?.handshake?.headers?.["user-agent"] || "").trim().slice(0, 180);
    const browserLabel = detectBrowserLabel(userAgent);
    const fingerprintKey = `${ipAddress}::${browserLabel.toLowerCase()}`;

    return {
      ipAddress,
      browserLabel,
      fingerprintKey
    };
  };

  const teamRoomKey = (teamCode) => `team:${teamCode}`;
  const channelRoomKey = (teamCode, channelCode) => `team:${teamCode}:channel:${channelCode}`;
  const dmRoomKey = (teamCode, dmKey) => `team:${teamCode}:dm:${dmKey}`;

  return {
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
  };
};

module.exports = {
  createSocketContextUtils
};
