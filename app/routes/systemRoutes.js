const registerSystemRoutes = ({
  app,
  getPublicLoginConfig,
  getPublicSimulationConfig,
  getPublicUploadConfig,
  getPublicDirectAdminConfig
}) => {
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      build: "owner-admin-access-v2",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/login-config", async (_req, res) => {
    try {
      const config = await getPublicLoginConfig();
      res.status(200).json({ ok: true, config });
    } catch {
      res.status(500).json({ ok: false, message: "Gagal memuat pengaturan login member." });
    }
  });

  app.get("/api/simulation-config", async (_req, res) => {
    try {
      const config = await getPublicSimulationConfig();
      res.status(200).json({ ok: true, config });
    } catch {
      res.status(500).json({ ok: false, message: "Gagal memuat pengaturan simulasi chat." });
    }
  });

  app.get("/api/upload-config", async (_req, res) => {
    try {
      const config = await getPublicUploadConfig();
      res.status(200).json({ ok: true, config });
    } catch {
      res.status(500).json({ ok: false, message: "Gagal memuat pengaturan batas upload." });
    }
  });

  app.get("/api/direct-admin-config", async (_req, res) => {
    try {
      const config = await getPublicDirectAdminConfig();
      res.status(200).json({ ok: true, config });
    } catch {
      res.status(500).json({ ok: false, message: "Gagal memuat pengaturan chat langsung ke admin." });
    }
  });
};

module.exports = {
  registerSystemRoutes
};
