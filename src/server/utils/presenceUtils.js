const createPresenceUtils = ({
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
  getPublicDirectAdminConfig,
  teamRoomKey,
  channelRoomKey,
  roleMember,
  roleAdmin,
  roleOwner,
  loginConfigDocKey,
  simulationConfigDocKey,
  uploadConfigDocKey,
  directAdminConfigDocKey,
  defaultTeamNoticeMessage
}) => {
  const getTeamMembers = (teamCode) => {
    return Array.from(usersBySocketId.values())
      .filter((user) => user.teamCode === teamCode)
      .map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role || roleMember,
        channelCode: user.channelCode,
        joinedAt: user.joinedAt,
        simulated: Boolean(user.simulated),
        registeredMember: Boolean(user.registeredMember)
      }));
  };

  const emitPresence = (teamCode, channelCode) => {
    const channelUsers = Array.from(usersBySocketId.values())
      .filter((user) => user.teamCode === teamCode && user.channelCode === channelCode)
      .map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role || roleMember,
        joinedAt: user.joinedAt,
        simulated: Boolean(user.simulated),
        registeredMember: Boolean(user.registeredMember)
      }));

    const typingUsers = Array.from(typingSocketIds)
      .map((socketId) => usersBySocketId.get(socketId))
      .filter(Boolean)
      .filter((user) => user.teamCode === teamCode && user.channelCode === channelCode)
      .map((user) => user.name);

    io.to(channelRoomKey(teamCode, channelCode)).emit("presence:update", {
      teamCode,
      channelCode,
      users: channelUsers,
      typingUsers,
      onlineCount: channelUsers.length
    });
  };

  const emitTeamState = async (teamCode) => {
    const teamDoc = await teamsDb.findOne({ teamCode });
    const channels = await getTeamChannels(teamCode);
    const allTeamDocs = await teamsDb.find({}).exec();
    const availableTeamCodes = Array.from(
      new Set(
        (Array.isArray(allTeamDocs) ? allTeamDocs : [])
          .map((doc) => sanitizeCode(doc?.teamCode || "", ""))
          .filter((code) => code
            && code !== loginConfigDocKey
            && code !== simulationConfigDocKey
            && code !== uploadConfigDocKey
            && code !== directAdminConfigDocKey)
      )
    );
    const availableTeams = [];

    for (const availableTeamCode of availableTeamCodes) {
      const teamChannels = await getTeamChannels(availableTeamCode);
      availableTeams.push({
        teamCode: availableTeamCode,
        channels: teamChannels
      });
    }

    const members = getTeamMembers(teamCode);
    const authDoc = await teamAuthDb.findOne({ teamCode });
    const loginConfig = await getPublicLoginConfig();
    const simulationConfig = await getPublicSimulationConfig();
    const uploadConfig = await getPublicUploadConfig();
    const directAdminConfig = await getPublicDirectAdminConfig();

    io.to(teamRoomKey(teamCode)).emit("team:state", {
      teamCode,
      noticeMessage: sanitizeTeamNotice(teamDoc?.noticeMessage, defaultTeamNoticeMessage),
      channels,
      availableTeams,
      members,
      auth: buildTeamAuthState(authDoc),
      loginConfig,
      simulationConfig,
      uploadConfig,
      directAdminConfig
    });
  };

  const findPreferredAdminDmTarget = (teamCode, requesterId = "") => {
    const teamUsers = Array.from(usersBySocketId.values())
      .filter((entry) => entry.teamCode === teamCode && entry.id !== requesterId && !entry.simulated);

    const firstAdmin = teamUsers.find((entry) => entry.role === roleAdmin);
    if (firstAdmin) {
      return {
        id: firstAdmin.id,
        name: firstAdmin.name,
        role: firstAdmin.role,
        teamCode: firstAdmin.teamCode
      };
    }

    const firstOwner = teamUsers.find((entry) => entry.role === roleOwner);
    if (firstOwner) {
      return {
        id: firstOwner.id,
        name: firstOwner.name,
        role: firstOwner.role,
        teamCode: firstOwner.teamCode
      };
    }

    return null;
  };

  const isSimulatedMemberNameInTeam = (teamCode, memberName) => {
    const targetName = sanitizeName(memberName || "");
    if (!targetName) {
      return false;
    }

    return Array.from(usersBySocketId.values())
      .some((entry) => entry.teamCode === teamCode && entry.simulated && entry.name === targetName);
  };

  return {
    emitPresence,
    emitTeamState,
    findPreferredAdminDmTarget,
    isSimulatedMemberNameInTeam
  };
};

module.exports = {
  createPresenceUtils
};
