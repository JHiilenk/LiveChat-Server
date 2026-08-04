const registerMemberRoutes = ({
  app,
  sanitizeCode,
  sanitizeName,
  sanitizePassword,
  defaultTeamCode,
  defaultChannelCode,
  minPrivilegedPasswordLength,
  getUpsertRealMemberRecord,
  getRealMembersDb
}) => {
  app.get("/api/real-members", async (req, res) => {
    try {
      const teamCode = sanitizeCode(req.query?.teamCode || "", defaultTeamCode);
      const realMembersDb = getRealMembersDb();
      const docs = await realMembersDb.find({ teamCode }).sort({ lastSeenAt: -1 }).limit(500).exec();
      const members = docs
        .map((doc) => ({
          name: sanitizeName(doc.name || ""),
          teamCode: sanitizeCode(doc.teamCode || "", defaultTeamCode),
          firstSeenAt: String(doc.firstSeenAt || doc.createdAt || ""),
          lastSeenAt: String(doc.lastSeenAt || doc.updatedAt || ""),
          loginCount: Math.max(0, Number(doc.loginCount) || 0),
          registeredMember: Boolean(doc.registeredMember),
          registeredAt: String(doc.registeredAt || "")
        }))
        .filter((entry) => entry.name);

      res.status(200).json({ ok: true, members });
    } catch {
      res.status(500).json({ ok: false, message: "Gagal memuat daftar member real." });
    }
  });

  app.post("/api/real-members/register", async (req, res) => {
    try {
      const name = sanitizeName(req.body?.name || "");
      const teamCode = sanitizeCode(req.body?.teamCode || "", defaultTeamCode);
      const password = sanitizePassword(req.body?.password || "");

      if (!name) {
        res.status(400).json({ ok: false, message: "Nama member wajib diisi." });
        return;
      }

      if (!password || password.length < minPrivilegedPasswordLength) {
        res.status(400).json({ ok: false, message: `Password member minimal ${minPrivilegedPasswordLength} karakter.` });
        return;
      }

      const upsertRealMemberRecord = getUpsertRealMemberRecord();
      const member = await upsertRealMemberRecord({
        name,
        teamCode,
        channelCode: defaultChannelCode,
        register: true,
        countLogin: false,
        password
      });

      res.status(200).json({
        ok: true,
        member: {
          name: sanitizeName(member?.name || name),
          teamCode: sanitizeCode(member?.teamCode || teamCode, defaultTeamCode),
          registeredMember: Boolean(member?.registeredMember),
          registeredAt: String(member?.registeredAt || "")
        }
      });
    } catch {
      res.status(500).json({ ok: false, message: "Pendaftaran member baru gagal." });
    }
  });
};

module.exports = {
  registerMemberRoutes
};
