const createChannelUtils = ({
  teamsDb,
  channelsDb,
  messagesDb,
  appendPublicLoginConfigOption,
  nameKey,
  nowIso,
  getMessageRetentionCutoff,
  defaultChannelCode,
  defaultTeamNoticeMessage,
  messageHistoryLimit,
  aiBotName,
  roleMember
}) => {
  const ensureTeam = async (teamCode, createdBy) => {
    const existing = await teamsDb.findOne({ teamCode });
    if (existing) {
      await appendPublicLoginConfigOption("team", teamCode);
      return existing;
    }

    const created = await teamsDb.insert({
      teamCode,
      createdBy,
      createdAt: nowIso(),
      noticeMessage: defaultTeamNoticeMessage
    });

    await appendPublicLoginConfigOption("team", teamCode);
    return created;
  };

  const ensureChannel = async (teamCode, channelCode, createdBy) => {
    const existing = await channelsDb.findOne({ teamCode, channelCode });
    if (existing) {
      await appendPublicLoginConfigOption("channel", channelCode);
      return existing;
    }

    const created = await channelsDb.insert({
      teamCode,
      channelCode,
      createdBy,
      createdAt: nowIso()
    });

    await appendPublicLoginConfigOption("channel", channelCode);
    return created;
  };

  const getTeamChannels = async (teamCode) => {
    const docs = await channelsDb.find({ teamCode }).sort({ channelCode: 1 }).exec();
    const codes = docs.map((doc) => doc.channelCode);

    if (!codes.includes(defaultChannelCode)) {
      codes.unshift(defaultChannelCode);
    }

    return Array.from(new Set(codes));
  };

  const getChannelHistory = async (teamCode, channelCode) => {
    const cutoff = getMessageRetentionCutoff();
    const docs = await messagesDb
      .find({ scope: "channel", teamCode, channelCode, createdAt: { $gte: cutoff } })
      .sort({ createdAt: -1 })
      .limit(messageHistoryLimit)
      .exec();

    return docs.reverse().map((doc) => ({
      id: doc.messageId || doc._id,
      type: doc.type || "chat",
      user: doc.user,
      role: doc.role || (doc.user === aiBotName ? "ai" : roleMember),
      text: doc.text,
      timestamp: doc.timestamp,
      editedAt: doc.editedAt || null,
      attachment: doc.attachment || null,
      simulated: Boolean(doc.simulated),
      context: {
        type: "channel",
        channelCode
      }
    }));
  };

  const getDmHistory = async (teamCode, dmKey, peerName, viewerName = "") => {
    const cutoff = getMessageRetentionCutoff();
    const cutoffMs = cutoff.getTime();
    const viewerKey = nameKey(viewerName || "");
    const docs = await messagesDb
      .find({ scope: "dm", teamCode, dmKey })
      .sort({ createdAt: -1 })
      .limit(Math.max(messageHistoryLimit * 8, messageHistoryLimit))
      .exec();

    const retainedDocs = docs.filter((doc) => {
      const createdAtValue = doc?.createdAt;
      const timestampValue = doc?.timestamp;
      let eventMs = Number.NaN;

      if (createdAtValue instanceof Date) {
        eventMs = createdAtValue.getTime();
      } else {
        const parsedCreatedAt = Date.parse(String(createdAtValue || ""));
        if (Number.isFinite(parsedCreatedAt)) {
          eventMs = parsedCreatedAt;
        } else {
          const parsedTimestamp = Date.parse(String(timestampValue || ""));
          if (Number.isFinite(parsedTimestamp)) {
            eventMs = parsedTimestamp;
          }
        }
      }

      if (!Number.isFinite(eventMs)) {
        return true;
      }

      return eventMs >= cutoffMs;
    });

    const visibleDocs = viewerKey
      ? retainedDocs.filter((doc) => {
        const hiddenForUsers = Array.isArray(doc?.hiddenForUsers) ? doc.hiddenForUsers : [];
        return !hiddenForUsers.includes(viewerKey);
      })
      : retainedDocs;

    const limitedVisibleDocs = visibleDocs.slice(0, messageHistoryLimit);

    return limitedVisibleDocs.reverse().map((doc) => ({
      id: doc.messageId || doc._id,
      type: doc.type || "chat",
      user: doc.user,
      role: doc.role || (doc.user === aiBotName ? "ai" : roleMember),
      text: doc.text,
      timestamp: doc.timestamp,
      editedAt: doc.editedAt || null,
      attachment: doc.attachment || null,
      context: {
        type: "dm",
        dmKey,
        peerName
      }
    }));
  };

  return {
    ensureTeam,
    ensureChannel,
    getTeamChannels,
    getChannelHistory,
    getDmHistory
  };
};

module.exports = {
  createChannelUtils
};
