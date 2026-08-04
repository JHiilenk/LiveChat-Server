const createBroadcastUtils = ({
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
  roleMember,
  roleGuest,
  roleAdmin,
  defaultChannelCode
}) => {
  const emitBroadcastMembersMessage = async ({
    teamCode,
    senderName,
    senderRole,
    text,
    durationSeconds,
    targetRoles = [roleMember, roleGuest],
    targetChannelCodes = []
  }) => {
    const roleSet = new Set(
      (Array.isArray(targetRoles) ? targetRoles : [roleMember, roleGuest])
        .map((role) => sanitizeRole(role || roleMember))
        .filter((role) => role === roleMember || role === roleGuest)
    );
    const channelSet = new Set(
      (Array.isArray(targetChannelCodes) ? targetChannelCodes : [])
        .map((channelCode) => sanitizeCode(channelCode || "", ""))
        .filter(Boolean)
    );

    const recipients = Array.from(usersBySocketId.values()).filter(
      (entry) => entry?.teamCode === teamCode
        && roleSet.has(sanitizeRole(entry?.role || roleMember))
        && (channelSet.size === 0 || channelSet.has(sanitizeCode(entry?.channelCode || "", defaultChannelCode)))
        && !entry?.simulated
    );

    const deliveredRecipients = [];

    for (const recipient of recipients) {
      const dmKey = buildDmKey(senderName, recipient.name);
      const message = buildChatMessage(
        senderName,
        text,
        {
          type: "dm",
          dmKey,
          peerName: senderName,
          isBroadcast: true,
          broadcastScope: "members"
        },
        null,
        senderRole,
        false
      );

      try {
        await messagesDb.insert({
          scope: "dm",
          messageId: message.id,
          type: message.type,
          teamCode,
          dmKey,
          targetUserId: recipient.id,
          targetUserName: recipient.name,
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
        // Keep member broadcast flow running if persistence fails.
      }

      io.to(recipient.id).emit("chat:message", message);
      io.to(recipient.id).emit("dm:available", {
        dmKey,
        peerName: senderName
      });
      io.to(recipient.id).emit("broadcast:received", {
        scope: "members",
        teamCode,
        senderName,
        senderRole,
        text
      });

      deliveredRecipients.push(recipient.name);
    }

    return Array.from(new Set(deliveredRecipients.map((name) => sanitizeName(name || "")).filter(Boolean)));
  };

  const queueMemberBroadcastForOfflineMembers = async ({
    teamCode,
    senderName,
    senderRole,
    text,
    durationSeconds,
    targetRoles = [roleMember],
    targetChannelCodes = []
  }) => {
    const roleSet = new Set(
      (Array.isArray(targetRoles) ? targetRoles : [roleMember])
        .map((role) => sanitizeRole(role || roleMember))
        .filter((role) => role === roleMember || role === roleGuest)
    );
    if (!roleSet.has(roleMember)) {
      return [];
    }

    const channelSet = new Set(
      (Array.isArray(targetChannelCodes) ? targetChannelCodes : [])
        .map((channelCode) => sanitizeCode(channelCode || "", ""))
        .filter(Boolean)
    );

    const docs = await realMembersDb.find({ teamCode, registeredMember: true }).exec();
    const authDoc = ensureAuthDocShape(await teamAuthDb.findOne({ teamCode }));
    const privilegedNameKeys = new Set([
      nameKey(authDoc?.ownerName || ""),
      ...((Array.isArray(authDoc?.admins) ? authDoc.admins : []).map((entry) => nameKey(entry?.name || ""))),
      ...((Array.isArray(authDoc?.operators) ? authDoc.operators : []).map((entry) => nameKey(entry?.name || "")))
    ].filter(Boolean));
    const onlineMemberKeys = new Set(
      Array.from(usersBySocketId.values())
        .filter((entry) => entry?.teamCode === teamCode && entry?.role === roleMember && !entry?.simulated)
        .map((entry) => nameKey(entry?.name || ""))
        .filter(Boolean)
    );

    const queuedRecipients = [];
    for (const doc of docs) {
      const memberName = sanitizeName(doc?.name || "");
      const memberNameKey = nameKey(memberName);
      const memberLastChannelCode = sanitizeCode(doc?.lastChannelCode || "", defaultChannelCode);
      if (!memberName || !memberNameKey || onlineMemberKeys.has(memberNameKey) || privilegedNameKeys.has(memberNameKey)) {
        continue;
      }

      if (channelSet.size > 0 && !channelSet.has(memberLastChannelCode)) {
        continue;
      }

      const memberKey = `${teamCode}::${memberNameKey}`;
      await memberBroadcastInboxDb.insert({
        scope: "members",
        memberKey,
        teamCode,
        targetMemberName: memberName,
        senderName: sanitizeName(senderName || "") || "Admin",
        senderRole: sanitizeRole(senderRole || roleAdmin),
        text: sanitizeMessage(text || ""),
        durationSeconds: Math.max(5, Math.min(180, Number.parseInt(durationSeconds, 10) || 18)),
        targetChannelCode: memberLastChannelCode,
        createdAt: nowIso()
      });

      queuedRecipients.push(memberName);
    }

    return Array.from(new Set(queuedRecipients.map((name) => sanitizeName(name || "")).filter(Boolean)));
  };

  const deliverOfflineMemberBroadcastInbox = async ({ socket, user }) => {
    if (!socket || !user || user.role !== roleMember || user.simulated) {
      return 0;
    }

    const memberKey = `${user.teamCode}::${nameKey(user.name || "")}`;
    const pendingDocs = await memberBroadcastInboxDb.find({ memberKey }).sort({ createdAt: 1 }).limit(200).exec();
    if (!Array.isArray(pendingDocs) || pendingDocs.length === 0) {
      return 0;
    }

    let deliveredCount = 0;
    for (const pending of pendingDocs) {
      const senderName = sanitizeName(pending?.senderName || "") || "Admin";
      const senderRole = sanitizeRole(pending?.senderRole || roleAdmin);
      const text = sanitizeMessage(pending?.text || "");
      if (!text) {
        if (pending?._id) {
          await memberBroadcastInboxDb.remove({ _id: pending._id }, {});
        }
        continue;
      }

      const dmKey = buildDmKey(senderName, user.name);
      const message = buildChatMessage(
        senderName,
        text,
        {
          type: "dm",
          dmKey,
          peerName: senderName,
          isBroadcast: true,
          broadcastScope: "members"
        },
        null,
        senderRole,
        false
      );

      if (pending?.createdAt) {
        message.timestamp = String(pending.createdAt);
      }

      try {
        await messagesDb.insert({
          scope: "dm",
          messageId: message.id,
          type: message.type,
          teamCode: user.teamCode,
          dmKey,
          targetUserId: user.id,
          targetUserName: user.name,
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
        // Keep inbox delivery flow running if persistence fails.
      }

      socket.emit("chat:message", message);
      socket.emit("dm:available", {
        dmKey,
        peerName: senderName
      });
      socket.emit("broadcast:received", {
        scope: "members",
        teamCode: user.teamCode,
        senderName,
        senderRole,
        text
      });
      socket.emit("broadcast:notice", {
        scope: "members",
        text,
        senderName,
        senderRole,
        durationMs: Math.max(5000, Math.min(180000, (Number(pending?.durationSeconds) || 18) * 1000)),
        teamCode: user.teamCode,
        channelCode: sanitizeCode(pending?.targetChannelCode || user.channelCode || "", defaultChannelCode)
      });

      if (pending?._id) {
        await memberBroadcastInboxDb.remove({ _id: pending._id }, {});
      }
      deliveredCount += 1;
    }

    return deliveredCount;
  };

  return {
    emitBroadcastMembersMessage,
    queueMemberBroadcastForOfflineMembers,
    deliverOfflineMemberBroadcastInbox
  };
};

module.exports = {
  createBroadcastUtils
};
