const createDirectAdminDmHandlers = ({
  usersBySocketId,
  io,
  messagesDb,
  typingSocketIds,
  getPublicDirectAdminConfig,
  getDmHistory,
  dmRoomKey,
  buildChatMessage,
  getDirectAdminRequesterNameFromDmKey,
  getDirectAdminDmKeyDetails,
  doesDirectAdminDmBelongToRequester,
  isDirectAdminDmKey,
  getOnlinePrivilegedRecipients,
  isAllowedSupportRole,
  isRequesterRole,
  nameKey,
  nowIso,
  ROLE_MEMBER,
  ROLE_GUEST,
  ROLE_ADMIN,
  ROLE_OWNER
}) => {
  const isRequestingRole = (role) => isRequesterRole(role);
  const isPrivilegedSupportRole = (role) => role === ROLE_ADMIN || role === ROLE_OWNER;

  const findRequesterEntriesByDmKey = (supportDmKey, requesterNameInput = "") => {
    const dmKeyDetails = getDirectAdminDmKeyDetails(supportDmKey);
    const requesterName = requesterNameInput || dmKeyDetails?.requesterName || getDirectAdminRequesterNameFromDmKey(supportDmKey);
    if (!requesterName) {
      return [];
    }

    return Array.from(usersBySocketId.values()).filter(
      (entry) => !entry?.simulated
        && isRequestingRole(entry?.role)
        && nameKey(entry?.name || "") === nameKey(requesterName)
        && (dmKeyDetails?.isLegacy
          ? true
          : doesDirectAdminDmBelongToRequester(supportDmKey, {
            name: entry?.name || "",
            teamCode: entry?.teamCode || "",
            fingerprintKey: entry?.fingerprintKey || ""
          }))
    );
  };

  const resolveSupportTeamCodes = async (supportDmKey, requesterNameInput = "", fallbackTeamCode = "") => {
    const dmKeyDetails = getDirectAdminDmKeyDetails(supportDmKey);
    const entries = findRequesterEntriesByDmKey(supportDmKey, requesterNameInput);
    const teamCodes = new Set(
      entries
        .map((entry) => String(entry?.teamCode || "").trim())
        .filter((teamCode) => teamCode || teamCode === "")
    );

    if (dmKeyDetails && !dmKeyDetails.isLegacy) {
      teamCodes.add(String(dmKeyDetails.teamCode || "").trim());
    }

    let latestPersistedTeamCode = "";
    let hasLatestPersistedTeamCode = false;
    try {
      const persistedDocs = await messagesDb
        .find({ scope: "dm", dmKey: supportDmKey })
        .sort({ createdAt: -1 })
        .limit(250)
        .exec();

      persistedDocs.forEach((doc, index) => {
        const docTeamCode = String(doc?.teamCode || "").trim();
        if (index === 0) {
          latestPersistedTeamCode = docTeamCode;
          hasLatestPersistedTeamCode = true;
        }
        if (docTeamCode || docTeamCode === "") {
          teamCodes.add(docTeamCode);
        }
      });
    } catch (_error) {
      // Keep runtime flow alive when DB read fails.
    }

    const safeFallback = String(fallbackTeamCode || "").trim();
    if (safeFallback || safeFallback === "") {
      teamCodes.add(safeFallback);
    }

    const normalizedTeamCodes = Array.from(teamCodes);
    const hasLatestLiveTeamCode = entries.length > 0;
    const latestLiveTeamCode = hasLatestLiveTeamCode
      ? String(entries[0]?.teamCode || "").trim()
      : "";
    const keyTeamCode = dmKeyDetails && !dmKeyDetails.isLegacy
      ? String(dmKeyDetails.teamCode || "").trim()
      : "";
    const primaryTeamCode = hasLatestLiveTeamCode
      ? latestLiveTeamCode
      : (keyTeamCode || (hasLatestPersistedTeamCode ? latestPersistedTeamCode : safeFallback));

    return {
      requesterEntries: entries,
      teamCodes: normalizedTeamCodes,
      primaryTeamCode
    };
  };

  const handleDirectAdminDmOpen = async (socket, user, payload) => {
    let peerName = String(payload?.peerName || "").trim();
    if (!peerName) {
      return false;
    }

    const requestedDmKey = String(payload?.dmKey || "").trim();
    if (!requestedDmKey || !isDirectAdminDmKey(requestedDmKey)) {
      return false;
    }

    const requesterName = getDirectAdminRequesterNameFromDmKey(requestedDmKey);
    if (!requesterName) {
      socket.emit("join:error", { message: "DM admin tidak valid." });
      return true;
    }

    if (!isAllowedSupportRole(user.role)) {
      socket.emit("join:error", { message: "Role ini tidak punya akses DM admin." });
      return true;
    }

    if (isRequestingRole(user.role)) {
      if (!doesDirectAdminDmBelongToRequester(requestedDmKey, user)) {
        socket.emit("join:error", { message: "DM admin hanya untuk percakapan akunmu sendiri." });
        return true;
      }
    }

    const directAdminConfig = await getPublicDirectAdminConfig();
    if (!directAdminConfig.enabled && isRequestingRole(user.role)) {
      socket.emit("join:error", { message: "Chat langsung ke admin sedang dinonaktifkan." });
      return true;
    }

    const supportRouting = await resolveSupportTeamCodes(requestedDmKey, requesterName, user.teamCode);
    const dmRooms = supportRouting.teamCodes.map((teamCode) => dmRoomKey(teamCode, requestedDmKey));
    dmRooms.forEach((room) => {
      socket.join(room);
    });

    if (isRequestingRole(user.role)) {
      const recipients = getOnlinePrivilegedRecipients(usersBySocketId, user.teamCode, user.id);
      recipients.forEach((recipient) => {
        const recipientSocket = io.sockets.sockets.get(recipient.id);
        if (recipientSocket) {
          dmRooms.forEach((room) => {
            recipientSocket.join(room);
          });
        }
        io.to(recipient.id).emit("dm:available", {
          dmKey: requestedDmKey,
          peerName: requesterName,
          supportScope: "admins"
        });
      });
    }

    user.activeMode = "dm";
    user.activeDmKey = requestedDmKey;
    user.activeDmPeerName = isRequestingRole(user.role) ? "Customer Service" : requesterName;
    user.activeDmProxyTargetName = null;
    user.activeDmProxyAliasName = null;
    usersBySocketId.set(socket.id, user);

    const history = await getDmHistory(
      supportRouting.primaryTeamCode,
      requestedDmKey,
      isRequestingRole(user.role) ? "Customer Service" : requesterName,
      user.name
    );

    socket.emit("dm:ready", {
      dmKey: requestedDmKey,
      peerName: isRequestingRole(user.role) ? "Customer Service" : requesterName,
      supportScope: "admins",
      history
    });

    return true;
  };

  const handleDirectAdminChatMessage = async (socket, user, payload, messageText, attachment) => {
    const supportScope = String(payload?.supportScope || "").trim().toLowerCase();
    const supportDmKey = String(payload?.dmKey || "").trim();

    if (supportScope !== "admins" && !isDirectAdminDmKey(supportDmKey)) {
      return false;
    }

    if (!isDirectAdminDmKey(supportDmKey)) {
      socket.emit("join:error", { message: "DM admin tidak valid." });
      return true;
    }

    const requesterName = getDirectAdminRequesterNameFromDmKey(supportDmKey);
    if (!requesterName) {
      socket.emit("join:error", { message: "Requester DM admin tidak valid." });
      return true;
    }

    if (!isAllowedSupportRole(user.role)) {
      socket.emit("join:error", { message: "Role ini tidak punya akses DM admin." });
      return true;
    }

    if (isRequestingRole(user.role)) {
      if (!doesDirectAdminDmBelongToRequester(supportDmKey, user)) {
        socket.emit("join:error", { message: "DM admin hanya untuk percakapan akunmu sendiri." });
        return true;
      }

      const directAdminConfig = await getPublicDirectAdminConfig();
      if (!directAdminConfig.enabled) {
        socket.emit("join:error", { message: "Chat langsung ke admin sedang dinonaktifkan." });
        return true;
      }
    }

    const supportRouting = await resolveSupportTeamCodes(supportDmKey, requesterName, user.teamCode);
    const dmRooms = supportRouting.teamCodes.map((teamCode) => dmRoomKey(teamCode, supportDmKey));
    dmRooms.forEach((room) => {
      socket.join(room);
    });

    const recipients = getOnlinePrivilegedRecipients(usersBySocketId, user.teamCode, user.id);
    recipients.forEach((recipient) => {
      const recipientSocket = io.sockets.sockets.get(recipient.id);
      if (recipientSocket) {
        dmRooms.forEach((room) => {
          recipientSocket.join(room);
        });
      }
    });

    const contextPeerName = isRequestingRole(user.role)
      ? "Customer Service"
      : requesterName;

    const message = buildChatMessage(
      user.name,
      messageText,
      {
        type: "dm",
        dmKey: supportDmKey,
        peerName: contextPeerName,
        supportScope: "admins"
      },
      attachment,
      user.role || ROLE_MEMBER
    );

    typingSocketIds.delete(socket.id);

    try {
      await messagesDb.insert({
        scope: "dm",
        messageId: message.id,
        type: message.type,
        teamCode: supportRouting.primaryTeamCode,
        dmKey: supportDmKey,
        user: message.user,
        role: user.role || ROLE_MEMBER,
        text: message.text,
        timestamp: message.timestamp,
        editedAt: null,
        attachment: message.attachment,
        simulated: false
      });
    } catch (_error) {
      // Keep direct-admin DM flow running if persistence fails.
    }

    const uniqueRooms = Array.from(new Set(dmRooms.filter(Boolean)));
    if (uniqueRooms.length === 1) {
      io.to(uniqueRooms[0]).emit("chat:message", message);
    } else if (uniqueRooms.length > 1) {
      let broadcast = io.to(uniqueRooms[0]);
      for (let i = 1; i < uniqueRooms.length; i += 1) {
        broadcast = broadcast.to(uniqueRooms[i]);
      }
      broadcast.emit("chat:message", message);
    }

    const requesterSockets = supportRouting.requesterEntries;

    requesterSockets.forEach((entry) => {
      io.to(entry.id).emit("dm:available", {
        dmKey: supportDmKey,
        peerName: "Customer Service",
        supportScope: "admins"
      });
    });

    recipients.forEach((recipient) => {
      io.to(recipient.id).emit("dm:available", {
        dmKey: supportDmKey,
        peerName: requesterName,
        supportScope: "admins"
      });
    });

    return true;
  };

  const emitSupportDmAvailabilityForPrivilegedUser = async (socket, user) => {
    if (!socket || !user || !isPrivilegedSupportRole(user.role)) {
      return;
    }

    const viewerNameKey = nameKey(user.name || "");
    const conversationsByDmKey = new Map();
    const conversationMetaByDmKey = new Map();

    const getDocTimeMs = (doc) => {
      const createdAtValue = doc?.createdAt;
      if (createdAtValue instanceof Date) {
        return createdAtValue.getTime();
      }

      const createdAtMs = Date.parse(String(createdAtValue || ""));
      if (Number.isFinite(createdAtMs)) {
        return createdAtMs;
      }

      const timestampMs = Date.parse(String(doc?.timestamp || ""));
      if (Number.isFinite(timestampMs)) {
        return timestampMs;
      }

      return 0;
    };

    const upsertConversationMeta = (dmKeyInput, doc) => {
      const dmKey = String(dmKeyInput || "").trim();
      if (!dmKey || !isDirectAdminDmKey(dmKey) || !doc) {
        return;
      }

      if (viewerNameKey) {
        const hiddenForUsers = Array.isArray(doc?.hiddenForUsers) ? doc.hiddenForUsers : [];
        if (hiddenForUsers.includes(viewerNameKey)) {
          return;
        }
      }

      const nextTimeMs = getDocTimeMs(doc);
      const existing = conversationMetaByDmKey.get(dmKey);
      if (existing && nextTimeMs <= existing.timeMs) {
        return;
      }

      const previewText = String(doc?.text || "").trim() || "Belum ada pesan";
      const timestampRaw = String(doc?.timestamp || "").trim();
      const role = String(doc?.role || "").trim().toLowerCase();
      const hasUnread = role === ROLE_MEMBER || role === ROLE_GUEST;

      conversationMetaByDmKey.set(dmKey, {
        timeMs: nextTimeMs,
        previewText,
        timestamp: timestampRaw,
        hasUnread
      });
    };

    const addConversation = (dmKeyInput, peerNameInput) => {
      const dmKey = String(dmKeyInput || "").trim();
      const peerName = String(peerNameInput || "").trim();
      if (!dmKey || !peerName || !isDirectAdminDmKey(dmKey)) {
        return;
      }

      if (!conversationsByDmKey.has(dmKey)) {
        conversationsByDmKey.set(dmKey, peerName);
      }
    };

    let recentDmDocs = [];
    try {
      recentDmDocs = await messagesDb
        .find({ scope: "dm" })
        .sort({ createdAt: -1 })
        .limit(400)
        .exec();
    } catch (_error) {
      recentDmDocs = [];
    }

    recentDmDocs.forEach((doc) => {
      const dmKey = String(doc?.dmKey || "").trim();
      if (!isDirectAdminDmKey(dmKey)) {
        return;
      }

      addConversation(dmKey, getDirectAdminRequesterNameFromDmKey(dmKey));
      upsertConversationMeta(dmKey, doc);
    });

    conversationsByDmKey.forEach((peerName, dmKey) => {
      const meta = conversationMetaByDmKey.get(dmKey) || null;
      io.to(socket.id).emit("dm:available", {
        dmKey,
        peerName,
        supportScope: "admins",
        previewText: meta?.previewText || "",
        timestamp: meta?.timestamp || "",
        hasUnread: Boolean(meta?.hasUnread)
      });
    });
  };

  return {
    handleDirectAdminDmOpen,
    handleDirectAdminChatMessage,
    emitSupportDmAvailabilityForPrivilegedUser
  };
};

module.exports = {
  createDirectAdminDmHandlers
};
