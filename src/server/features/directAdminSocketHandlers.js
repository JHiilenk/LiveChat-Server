const registerDirectAdminSocketHandlers = ({
  socket,
  io,
  usersBySocketId,
  getPublicDirectAdminConfig,
  savePublicDirectAdminConfig,
  nowIso,
  dmRoomKey,
  getDmHistory,
  getOnlinePrivilegedRecipients,
  buildDirectAdminDmKey,
  isRequesterRole,
  roleOwner,
  roleAdmin
}) => {
  socket.on("direct-admin:config:update", async (payload) => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum mengubah pengaturan chat admin." });
      return;
    }

    if (![roleOwner, roleAdmin].includes(user.role)) {
      socket.emit("join:error", { message: "Hanya owner/admin yang bisa ubah chat langsung ke admin." });
      return;
    }

    const savedConfig = await savePublicDirectAdminConfig(payload?.config || {}, user.name);
    io.emit("direct-admin:config:updated", {
      config: savedConfig,
      updatedBy: user.name,
      updatedAt: nowIso()
    });
  });

  socket.on("dm:direct-admin:start", async () => {
    const user = usersBySocketId.get(socket.id);
    if (!user) {
      socket.emit("join:error", { message: "Join team dulu sebelum chat langsung ke admin." });
      return;
    }

    if (!isRequesterRole(user.role)) {
      socket.emit("join:error", { message: "Fitur ini khusus akses member/guest." });
      return;
    }

    const directAdminConfig = await getPublicDirectAdminConfig();
    if (!directAdminConfig.enabled) {
      socket.emit("join:error", { message: "Chat langsung ke admin sedang dinonaktifkan oleh admin." });
      return;
    }

    const recipients = getOnlinePrivilegedRecipients(usersBySocketId, user.teamCode, user.id);
    if (recipients.length === 0) {
      socket.emit("join:error", { message: "Admin/owner belum online. Coba beberapa saat lagi." });
      return;
    }

    const dmKey = buildDirectAdminDmKey(user.name);
    if (!dmKey) {
      socket.emit("join:error", { message: "Gagal membuat DM admin. Nama user tidak valid." });
      return;
    }

    const room = dmRoomKey(user.teamCode, dmKey);
    socket.join(room);
    recipients.forEach((recipient) => {
      const recipientSocket = io.sockets.sockets.get(recipient.id);
      if (recipientSocket) {
        recipientSocket.join(room);
      }
    });

    user.activeMode = "dm";
    user.activeDmKey = dmKey;
    user.activeDmPeerName = "Customer Service";
    user.activeDmProxyTargetName = null;
    user.activeDmProxyAliasName = null;
    usersBySocketId.set(socket.id, user);

    const history = await getDmHistory(user.teamCode, dmKey, "Customer Service");
    socket.emit("dm:ready", {
      dmKey,
      peerName: "Customer Service",
      supportScope: "admins",
      history
    });

    recipients.forEach((recipient) => {
      io.to(recipient.id).emit("dm:available", {
        dmKey,
        peerName: user.name,
        supportScope: "admins"
      });
    });
  });
};

module.exports = {
  registerDirectAdminSocketHandlers
};
