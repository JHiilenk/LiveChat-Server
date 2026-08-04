const createAuthUtils = ({
  sanitizeName,
  nameKey,
  sanitizeRole,
  hashPassword,
  nowIso,
  roleGuest,
  roleMember,
  roleAdmin,
  roleOwner,
  roleOperator,
  defaultOwnerUsername,
  defaultAdminUsername,
  defaultOwnerPassword,
  defaultAdminPassword,
  authSchemaVersion
}) => {
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

  const buildDefaultAuthPayload = (teamCode) => ({
    teamCode,
    ownerName: defaultOwnerUsername,
    ownerPasswordHash: hashPassword(defaultOwnerPassword),
    adminPasswordHash: hashPassword(defaultAdminPassword),
    admins: [{
      key: nameKey(defaultAdminUsername),
      name: defaultAdminUsername
    }],
    operators: [],
    authVersion: authSchemaVersion,
    createdAt: nowIso()
  });

  const normalizeOperators = (operators) => {
    if (!Array.isArray(operators)) {
      return [];
    }

    return operators
      .map((entry) => {
        const safeName = sanitizeName(entry?.name || "");
        if (!safeName) {
          return null;
        }

        return {
          key: nameKey(safeName),
          name: safeName
        };
      })
      .filter(Boolean);
  };

  const isAdminNameKey = (authDoc, lookupKey) => {
    if (!authDoc || !lookupKey) {
      return false;
    }

    return (authDoc.admins || []).some((entry) => entry.key === lookupKey);
  };

  const isOperatorNameKey = (authDoc, lookupKey) => {
    if (!authDoc || !lookupKey) {
      return false;
    }

    return (authDoc.operators || []).some((entry) => entry.key === lookupKey);
  };

  const deriveRoleForName = (authDoc, userName) => {
    const key = nameKey(userName);
    const ownerKey = nameKey(authDoc?.ownerName || "");
    if (!authDoc || !key) {
      return roleMember;
    }

    if (ownerKey === key) {
      return roleOwner;
    }

    if (isAdminNameKey(authDoc, key)) {
      return roleAdmin;
    }

    if (isOperatorNameKey(authDoc, key)) {
      return roleOperator;
    }

    return roleMember;
  };

  const deriveRuntimeRoleForEntry = (authDoc, entry) => {
    const privilegedRole = deriveRoleForName(authDoc, entry?.name || "");
    if (privilegedRole === roleOwner || privilegedRole === roleAdmin || privilegedRole === roleOperator) {
      return privilegedRole;
    }

    const previousRole = sanitizeRole(entry?.role || roleMember);
    if (previousRole === roleGuest && !entry?.registeredMember) {
      return roleGuest;
    }

    return roleMember;
  };

  const buildTeamAuthState = (authDoc) => {
    const safeDoc = ensureAuthDocShape(authDoc);
    if (!safeDoc) {
      return {
        hasOwner: false,
        ownerName: "",
        adminNames: [],
        operatorNames: []
      };
    }

    return {
      hasOwner: true,
      ownerName: safeDoc.ownerName,
      adminNames: (safeDoc.admins || []).map((entry) => entry.name),
      operatorNames: (safeDoc.operators || []).map((entry) => entry.name)
    };
  };

  return {
    ensureAuthDocShape,
    buildDefaultAuthPayload,
    normalizeOperators,
    isAdminNameKey,
    isOperatorNameKey,
    deriveRoleForName,
    deriveRuntimeRoleForEntry,
    buildTeamAuthState
  };
};

module.exports = {
  createAuthUtils
};
