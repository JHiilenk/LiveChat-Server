const registerUploadRoutes = ({
  app,
  multer,
  createUploadSingle,
  getPublicUploadConfig,
  unlinkFile
}) => {
  app.post("/api/upload", async (req, res) => {
    const uploadConfig = await getPublicUploadConfig();
    const uploadSingle = createUploadSingle(uploadConfig);

    uploadSingle(req, res, (error) => {
      if (error) {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
          const biggestLimitMb = Math.max(
            uploadConfig.imageLimitMb,
            uploadConfig.videoLimitMb,
            uploadConfig.audioLimitMb,
            uploadConfig.fileLimitMb
          );
          res.status(400).json({ ok: false, message: `Ukuran file melebihi batas upload maksimum ${biggestLimitMb}MB.` });
          return;
        }

        res.status(400).json({ ok: false, message: error.message || "Upload gagal." });
        return;
      }

      if (!req.file) {
        res.status(400).json({ ok: false, message: "File belum dipilih." });
        return;
      }

      const kind = req.file.mimetype.startsWith("image/")
        ? "image"
        : req.file.mimetype.startsWith("video/")
          ? "video"
          : req.file.mimetype.startsWith("audio/")
            ? "audio"
            : "file";

      const kindLimitMb = kind === "image"
        ? uploadConfig.imageLimitMb
        : kind === "video"
          ? uploadConfig.videoLimitMb
          : kind === "audio"
            ? uploadConfig.audioLimitMb
            : uploadConfig.fileLimitMb;
      const kindLimitBytes = kindLimitMb * 1024 * 1024;

      if (req.file.size > kindLimitBytes) {
        try {
          unlinkFile(req.file.path);
        } catch {
          // Ignore cleanup failures for oversized upload rejection.
        }

        const label = kind === "image"
          ? "Gambar"
          : kind === "video"
            ? "Video"
            : kind === "audio"
              ? "Audio"
              : "File";
        res.status(400).json({ ok: false, message: `${label} melebihi batas ${kindLimitMb}MB.` });
        return;
      }

      res.status(200).json({
        ok: true,
        file: {
          name: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
          kind,
          url: `/uploads/${req.file.filename}`
        }
      });
    });
  });
};

module.exports = {
  registerUploadRoutes
};
