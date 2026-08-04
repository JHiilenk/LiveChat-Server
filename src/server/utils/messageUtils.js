const createMessageUtils = ({
  nowIso,
  sanitizeName,
  sanitizeMessage,
  sanitizeRole,
  sanitizeCode,
  defaultChannelCode,
  roleMember
}) => {
  const isAllowedRemoteAttachmentUrl = (value) => {
    try {
      const parsed = new URL(String(value || ""));
      if (parsed.protocol !== "https:") {
        return false;
      }

      const host = parsed.hostname.toLowerCase();
      return host.endsWith(".tenor.com")
        || host === "tenor.com"
        || host.endsWith(".giphy.com")
        || host === "giphy.com";
    } catch {
      return false;
    }
  };

  const sanitizeAttachment = (attachment) => {
    if (!attachment || typeof attachment !== "object") {
      return null;
    }

    const name = String(attachment.name || "").trim().slice(0, 140);
    const url = String(attachment.url || "").trim();
    const mimeType = String(attachment.mimeType || "application/octet-stream").trim().slice(0, 120);
    const size = Number(attachment.size) || 0;
    const kind = ["image", "video", "audio", "file"].includes(attachment.kind) ? attachment.kind : "file";

    const isLocalUpload = url.startsWith("/uploads/") && size > 0;
    const isRemoteGif = kind === "image" && /gif/i.test(mimeType) && isAllowedRemoteAttachmentUrl(url);

    if (!name || (!isLocalUpload && !isRemoteGif)) {
      return null;
    }

    return {
      name,
      url,
      mimeType,
      size: Math.max(1, size),
      kind
    };
  };

  const buildSystemMessage = (text, context = null) => ({
    id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "system",
    user: "System",
    role: "system",
    text,
    timestamp: nowIso(),
    context
  });

  const buildChatMessage = (user, text, context = null, attachment = null, role = roleMember, simulated = false) => ({
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "chat",
    user,
    role,
    text,
    timestamp: nowIso(),
    editedAt: null,
    context,
    attachment,
    simulated: Boolean(simulated)
  });

  const sanitizePinnedMessage = (value) => {
    if (!value || typeof value !== "object") {
      return null;
    }

    const text = sanitizeMessage(value.text || "");
    if (!text) {
      return null;
    }

    return {
      sourceMessageId: String(value.sourceMessageId || "").trim().slice(0, 120),
      text,
      user: sanitizeName(value.user || "") || "Unknown",
      role: sanitizeRole(value.role || roleMember),
      channelCode: sanitizeCode(value.channelCode || "", defaultChannelCode),
      pinnedBy: sanitizeName(value.pinnedBy || "") || "Unknown",
      pinnedAt: String(value.pinnedAt || nowIso()).trim() || nowIso()
    };
  };

  const shouldAiReply = (text) => {
    const clean = String(text || "").trim().toLowerCase();
    if (!clean) {
      return false;
    }

    if (clean.startsWith("/ai")) {
      return true;
    }

    if (clean.includes(" ai") || clean.startsWith("ai") || clean.includes("@ai")) {
      return true;
    }

    if (clean.includes("tolong") || clean.includes("bantu") || clean.includes("help")) {
      return true;
    }

    return clean.endsWith("?");
  };

  const buildAiReplyText = (text, senderName) => {
    const clean = String(text || "").trim();
    const lower = clean.toLowerCase();

    if (lower.includes("halo") || lower.includes("hai") || lower.includes("hi")) {
      return `Halo ${senderName}, siap bantu. Kamu bisa tanya apa saja tentang project ini.`;
    }

    if (lower.includes("deploy") || lower.includes("online")) {
      return "Untuk online, deploy pakai Render atau Railway lalu set APP_ORIGIN dan SOCKET_CORS_ORIGIN ke domain final.";
    }

    if (lower.includes("error") || lower.includes("bug")) {
      return "Kalau ada error, kirim log singkatnya di chat ini. Aku bantu breakdown penyebab dan langkah fix-nya.";
    }

    if (lower.includes("channel") || lower.includes("team")) {
      return "Tips cepat: pakai team code yang sama untuk satu grup, lalu pisahkan topik lewat channel per divisi.";
    }

    if (lower.includes("dm") || lower.includes("privat")) {
      return "DM aktif: klik nama member di panel Members, lalu chat privat bisa langsung dimulai.";
    }

    if (clean.endsWith("?")) {
      return `Pertanyaan bagus, ${senderName}. Aku sarankan mulai dari langkah paling kecil dulu, lalu validasi hasilnya satu per satu.`;
    }

    return `Noted ${senderName}. Kalau mau, tulis pertanyaan lebih spesifik dan aku jawab lebih detail.`;
  };

  return {
    isAllowedRemoteAttachmentUrl,
    sanitizeAttachment,
    buildSystemMessage,
    buildChatMessage,
    sanitizePinnedMessage,
    shouldAiReply,
    buildAiReplyText
  };
};

module.exports = {
  createMessageUtils
};
