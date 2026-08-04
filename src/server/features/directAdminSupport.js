const DIRECT_ADMIN_DM_KEY_PREFIX = "ADMINSUPPORT::";

const createDirectAdminSupport = ({ sanitizeName, roleOwner, roleAdmin, roleMember, roleGuest }) => {
  const isPrivilegedRecipientRole = (role) => role === roleOwner || role === roleAdmin;

  const isAllowedSupportRole = (role) => {
    return role === roleMember
      || role === roleGuest
      || role === roleAdmin
      || role === roleOwner;
  };

  const isRequesterRole = (role) => role === roleMember || role === roleGuest;

  const buildDirectAdminDmKey = (requesterName) => {
    const safeRequesterName = sanitizeName(requesterName || "");
    if (!safeRequesterName) {
      return "";
    }

    return `${DIRECT_ADMIN_DM_KEY_PREFIX}${safeRequesterName}`;
  };

  const getDirectAdminRequesterNameFromDmKey = (dmKey) => {
    const rawKey = String(dmKey || "").trim();
    if (!rawKey.startsWith(DIRECT_ADMIN_DM_KEY_PREFIX)) {
      return "";
    }

    return sanitizeName(rawKey.slice(DIRECT_ADMIN_DM_KEY_PREFIX.length));
  };

  const isDirectAdminDmKey = (dmKey) => Boolean(getDirectAdminRequesterNameFromDmKey(dmKey));

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
    isDirectAdminDmKey,
    getOnlinePrivilegedRecipients,
    isAllowedSupportRole,
    isRequesterRole
  };
};

module.exports = {
  DIRECT_ADMIN_DM_KEY_PREFIX,
  createDirectAdminSupport
};
