const test = require("node:test");
const assert = require("node:assert/strict");
const { buildInboxReplyDocument } = require("../lib/inboxThread");

test("builds a reply document with conversation reference and outbound status", () => {
  const reply = buildInboxReplyDocument({
    tenantCode: "JIELIVE",
    widgetId: "W-100",
    widgetNumber: 2,
    visitorName: "Budi",
    message: "Halo support",
    replyToMessageId: "msg-001",
    createdAt: "2026-08-08T00:00:00.000Z",
    updatedAt: "2026-08-08T00:00:00.000Z"
  });

  assert.equal(reply.kind, "out");
  assert.equal(reply.status, "replied");
  assert.equal(reply.replyToMessageId, "msg-001");
  assert.equal(reply.tenantCode, "JIELIVE");
  assert.equal(reply.widgetId, "W-100");
  assert.equal(reply.widgetNumber, 2);
  assert.equal(reply.visitorName, "Budi");
  assert.equal(reply.message, "Halo support");
  assert.ok(reply.messageId);
});
