const DIRECT_ADMIN_DM_KEY_PREFIX = "ADMINSUPPORT::";
const DIRECT_ADMIN_DM_KEY_VERSION = "v2";
const DIRECT_ADMIN_DM_KEY_EMPTY_TEAM_TOKEN = "_";
const DIRECT_ADMIN_DM_KEY_ANON_TOKEN = "anon";

const createDirectAdminSupport = ({ sanitizeName, roleOwner, roleAdmin, roleMember, roleGuest }) => {
  const isPrivilegedRecipientRole = (role) => role === roleOwner || role === roleAdmin;

  const normalizeSupportTeamCode = (value) => {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, 20);
  };

  const normalizeRequesterName = (value) => {
    return sanitizeName(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 64);
  };

  const normalizeRequesterNameKey = (value) => {
    return normalizeRequesterName(value)
      .toLowerCase()
      .replace(/\s+/g, "_");
  };

  const normalizeIdentityToken = (value) => {
    const cleaned = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24);

    return cleaned || DIRECT_ADMIN_DM_KEY_ANON_TOKEN;
  };

  const normalizeFingerprint = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9:.]/g, "")
      .slice(0, 180);
  };

  const stableHash = (value) => {
    const input = String(value || "");
    let hash = 5381;
    for (let index = 0; index < input.length; index += 1) {
      hash = ((hash << 5) + hash) ^ input.charCodeAt(index);
    }

    return (hash >>> 0).toString(36);
  };

  const buildDirectAdminIdentityToken = ({ requesterName = "", teamCode = "", fingerprintKey = "" } = {}) => {
    const safeRequesterName = normalizeRequesterName(requesterName);
    const safeTeamCode = normalizeSupportTeamCode(teamCode);
    const safeFingerprint = normalizeFingerprint(fingerprintKey);
    if (!safeFingerprint) {
      return DIRECT_ADMIN_DM_KEY_ANON_TOKEN;
    }

    return normalizeIdentityToken(stableHash(`${safeTeamCode}|${safeRequesterName.toLowerCase()}|${safeFingerprint}`));
  };

  const getDirectAdminDmKeyDetails = (dmKey) => {
    const rawKey = String(dmKey || "").trim();
    if (!rawKey.startsWith(DIRECT_ADMIN_DM_KEY_PREFIX)) {
      return null;
    }

    const rawBody = rawKey.slice(DIRECT_ADMIN_DM_KEY_PREFIX.length);
    if (rawBody.startsWith(`${DIRECT_ADMIN_DM_KEY_VERSION}::`)) {
      const segments = rawBody.split("::");
      if (segments.length < 4) {
        return null;
      }

      const teamToken = String(segments[1] || "").trim();
      const requesterToken = String(segments[2] || "").trim();
      const identityToken = normalizeIdentityToken(segments[3]);

      let decodedRequesterName = "";
      try {
        decodedRequesterName = decodeURIComponent(requesterToken);
      } catch {
        decodedRequesterName = requesterToken;
      }

      const requesterName = normalizeRequesterName(decodedRequesterName);
      if (!requesterName) {
        return null;
      }

      const teamCode = teamToken === DIRECT_ADMIN_DM_KEY_EMPTY_TEAM_TOKEN
        ? ""
        : normalizeSupportTeamCode(teamToken);

      return {
        key: rawKey,
        version: DIRECT_ADMIN_DM_KEY_VERSION,
        requesterName,
        requesterNameKey: normalizeRequesterNameKey(requesterName),
        teamCode,
        identityToken,
        isLegacy: false
      };
    }

    const requesterName = normalizeRequesterName(rawBody);
    if (!requesterName) {
      return null;
    }

    return {
      key: rawKey,
      version: "legacy",
      requesterName,
      requesterNameKey: normalizeRequesterNameKey(requesterName),
      teamCode: "",
      identityToken: DIRECT_ADMIN_DM_KEY_ANON_TOKEN,
      isLegacy: true
    };
  };

  const isAllowedSupportRole = (role) => {
    return role === roleMember
      || role === roleGuest
      || role === roleAdmin
      || role === roleOwner;
  };

  const isRequesterRole = (role) => role === roleMember || role === roleGuest;

  const buildDirectAdminDmKey = (requesterInput, teamCodeInput = "", fingerprintInput = "") => {
    const requesterNameRaw = typeof requesterInput === "object" && requesterInput !== null
      ? (requesterInput.requesterName || requesterInput.name || "")
      : requesterInput;
    const teamCodeRaw = typeof requesterInput === "object" && requesterInput !== null
      ? (requesterInput.teamCode || "")
      : teamCodeInput;
    const fingerprintRaw = typeof requesterInput === "object" && requesterInput !== null
      ? (requesterInput.fingerprintKey || requesterInput.identityFingerprint || "")
      : fingerprintInput;
    const manualIdentityToken = typeof requesterInput === "object" && requesterInput !== null
      ? String(requesterInput.identityToken || "")
      : "";

    const safeRequesterName = normalizeRequesterName(requesterNameRaw);
    if (!safeRequesterName) {
      return "";
    }

    const safeTeamCode = normalizeSupportTeamCode(teamCodeRaw);
    const encodedRequesterName = encodeURIComponent(safeRequesterName);
    const identityToken = manualIdentityToken
      ? normalizeIdentityToken(manualIdentityToken)
      : buildDirectAdminIdentityToken({
        requesterName: safeRequesterName,
        teamCode: safeTeamCode,
        fingerprintKey: fingerprintRaw
      });

    return `${DIRECT_ADMIN_DM_KEY_PREFIX}${DIRECT_ADMIN_DM_KEY_VERSION}::${safeTeamCode || DIRECT_ADMIN_DM_KEY_EMPTY_TEAM_TOKEN}::${encodedRequesterName}::${identityToken}`;
  };

  const getDirectAdminRequesterNameFromDmKey = (dmKey) => {
    return getDirectAdminDmKeyDetails(dmKey)?.requesterName || "";
  };

  const doesDirectAdminDmBelongToRequester = (dmKey, requesterInput = {}) => {
    const dmKeyDetails = getDirectAdminDmKeyDetails(dmKey);
    if (!dmKeyDetails) {
      return false;
    }

    const requesterName = normalizeRequesterName(requesterInput?.name || requesterInput?.requesterName || "");
    if (!requesterName) {
      return false;
    }

    if (normalizeRequesterNameKey(requesterName) !== dmKeyDetails.requesterNameKey) {
      return false;
    }

    if (dmKeyDetails.isLegacy) {
      return true;
    }

    const requesterTeamCode = normalizeSupportTeamCode(requesterInput?.teamCode || "");
    if (dmKeyDetails.teamCode !== requesterTeamCode) {
      return false;
    }

    if (dmKeyDetails.identityToken === DIRECT_ADMIN_DM_KEY_ANON_TOKEN) {
      return true;
    }

    const requesterIdentityToken = buildDirectAdminIdentityToken({
      requesterName,
      teamCode: requesterTeamCode,
      fingerprintKey: requesterInput?.fingerprintKey || requesterInput?.identityFingerprint || ""
    });

    return requesterIdentityToken === dmKeyDetails.identityToken;
  };

  const isDirectAdminDmKey = (dmKey) => Boolean(getDirectAdminDmKeyDetails(dmKey));

  const getOnlinePrivilegedRecipients = (usersBySocketId, teamCode, requesterId = "") => {
    return Array.from(usersBySocketId.values())
      .filter((entry) => !teamCode || entry?.teamCode === teamCode)
      .filter((entry) => entry?.id && entry.id !== requesterId)
      .filter((entry) => !entry?.simulated)
      .filter((entry) => isPrivilegedRecipientRole(entry.role));
  };

  return {
    buildDirectAdminDmKey,
    getDirectAdminRequesterNameFromDmKey,
    getDirectAdminDmKeyDetails,
    doesDirectAdminDmBelongToRequester,
    buildDirectAdminIdentityToken,
    isDirectAdminDmKey,
    getOnlinePrivilegedRecipients,
    isAllowedSupportRole,
    isRequesterRole
  };
};

module.exports = {
  DIRECT_ADMIN_DM_KEY_PREFIX,
  DIRECT_ADMIN_DM_KEY_VERSION,
  createDirectAdminSupport
};
