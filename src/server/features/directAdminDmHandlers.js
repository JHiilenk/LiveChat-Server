const createDirectAdminDmHandlers = ({
  usersBySocketId,
  io,
  messagesDb,
  typingSocketIds,
  getPublicDirectAdminConfig,
  getDmHistory,
  dmRoomKey,
  buildChatMessage,
  buildDirectAdminDmKey,
  getDirectAdminRequesterNameFromDmKey,
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

  const handleDirectAdminDmOpen = async (socket, user, payload) => {
    let peerName = String(payload?.peerName || "").trim();
    if (!peerName) {
      return false;
    }

    const supportScope = String(payload?.supportScope || "").trim().toLowerCase();
    const requestedDmKey = String(payload?.dmKey || "").trim();
    if (supportScope !== "admins" || !requestedDmKey || !isDirectAdminDmKey(requestedDmKey)) {
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
      const expectedDmKey = buildDirectAdminDmKey(user.name);
      if (requestedDmKey !== expectedDmKey) {
        socket.emit("join:error", { message: "DM admin hanya untuk percakapan akunmu sendiri." });
        return true;
      }
    }

    const directAdminConfig = await getPublicDirectAdminConfig();
    if (!directAdminConfig.enabled && isRequestingRole(user.role)) {
      socket.emit("join:error", { message: "Chat langsung ke admin sedang dinonaktifkan." });
      return true;
    }

    const dmRoom = dmRoomKey(user.teamCode, requestedDmKey);
    socket.join(dmRoom);

    if (isRequestingRole(user.role)) {
      const recipients = getOnlinePrivilegedRecipients(usersBySocketId, user.teamCode, user.id);
      recipients.forEach((recipient) => {
        const recipientSocket = io.sockets.sockets.get(recipient.id);
        if (recipientSocket) {
          recipientSocket.join(dmRoom);
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
      user.teamCode,
      requestedDmKey,
      isRequestingRole(user.role) ? "Customer Service" : requesterName
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

    if (supportScope !== "admins") {
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
      const expectedDmKey = buildDirectAdminDmKey(user.name);
      if (supportDmKey !== expectedDmKey) {
        socket.emit("join:error", { message: "DM admin hanya untuk percakapan akunmu sendiri." });
        return true;
      }

      const directAdminConfig = await getPublicDirectAdminConfig();
      if (!directAdminConfig.enabled) {
        socket.emit("join:error", { message: "Chat langsung ke admin sedang dinonaktifkan." });
        return true;
      }
    }

    const room = dmRoomKey(user.teamCode, supportDmKey);
    socket.join(room);

    const recipients = getOnlinePrivilegedRecipients(usersBySocketId, user.teamCode, user.id);
    recipients.forEach((recipient) => {
      const recipientSocket = io.sockets.sockets.get(recipient.id);
      if (recipientSocket) {
        recipientSocket.join(room);
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
        teamCode: user.teamCode,
        dmKey: supportDmKey,
        user: message.user,
        role: user.role || ROLE_MEMBER,
        text: message.text,
        timestamp: message.timestamp,
        editedAt: null,
        attachment: message.attachment,
        simulated: false,
        createdAt: nowIso()
      });
    } catch (_error) {
      // Keep direct-admin DM flow running if persistence fails.
    }

    io.to(room).emit("chat:message", message);

    const requesterSockets = Array.from(usersBySocketId.values()).filter(
      (entry) => entry?.teamCode === user.teamCode
        && !entry?.simulated
        && nameKey(entry?.name || "") === nameKey(requesterName)
    );

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

  return {
    handleDirectAdminDmOpen,
    handleDirectAdminChatMessage
  };
};

module.exports = {
  createDirectAdminDmHandlers
};
