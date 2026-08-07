const crypto = require("crypto");

const buildInboxReplyDocument = (input = {}) => {
  const now = input.createdAt || new Date().toISOString();
  const messageId = input.messageId || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  return {
    messageId,
    kind: "out",
    tenantCode: input.tenantCode || "",
    widgetId: input.widgetId || "",
    widgetNumber: Number(input.widgetNumber || 1),
    visitorName: input.visitorName || "Guest",
    serviceType: input.serviceType || "",
    message: input.message || "",
    replyToMessageId: input.replyToMessageId || "",
    sourceUrl: input.sourceUrl || "",
    status: "replied",
    createdAt: now,
    updatedAt: input.updatedAt || now,
  };
};

module.exports = {
  buildInboxReplyDocument,
};
