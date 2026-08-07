(function () {
  const params = new URLSearchParams(window.location.search);
  const tenantCode = String(params.get("tenantCode") || document.body.dataset.defaultTenant || "JIELIVE").trim().toUpperCase();
  const isEmbedded = window.self !== window.top || params.get("embed") === "1" || params.get("livechat") === "1";
  const appName = document.body.dataset.appName || "JIELive";
  const widgetId = String(params.get("widgetId") || document.body.dataset.widgetId || tenantCode).trim().toUpperCase();
  const widgetNumber = String(params.get("widgetNumber") || document.body.dataset.widgetNumber || "1").trim();
  const storageKey = `JIELIVE_EMBED_CHAT_${tenantCode}`;
  const visitorNameKey = `JIELIVE_EMBED_VISITOR_${tenantCode}`;

  document.body.dataset.embedded = isEmbedded ? "true" : "false";
  document.body.dataset.widgetId = widgetId;
  document.body.dataset.widgetNumber = widgetNumber;

  const titleNode = document.querySelector("[data-chat-title]");
  const subtitleNode = document.querySelector("[data-chat-subtitle]");
  const tenantChipNode = document.querySelector("[data-tenant-chip]");
  const listNode = document.getElementById("messageList");
  const formNode = document.getElementById("messageForm");
  const inputNode = document.getElementById("messageInput");

  if (titleNode) {
    titleNode.textContent = `${appName} Live Support`;
  }

  if (subtitleNode) {
    subtitleNode.textContent = `Tenant ${tenantCode} • Tim support online sekarang`;
  }

  if (tenantChipNode) {
    tenantChipNode.textContent = `Tenant ${tenantCode}`;
  }

  const nowClock = () => new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const getVisitorName = () => {
    try {
      const saved = String(localStorage.getItem(visitorNameKey) || "").trim();
      if (saved) {
        return saved;
      }
    } catch {
      // Ignore storage read failures.
    }

    const generated = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      localStorage.setItem(visitorNameKey, generated);
    } catch {
      // Ignore storage write failures.
    }
    return generated;
  };

  const visitorName = getVisitorName();

  const loadMessages = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveMessages = (messages) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-70)));
    } catch {
      // ignore storage errors in restricted browsers
    }
  };

  const addBubble = (entry) => {
    if (!listNode) {
      return;
    }

    const bubble = document.createElement("article");
    bubble.className = `bubble ${entry.role === "me" ? "me" : "bot"}`;
    bubble.innerHTML = `${entry.text}<small>${entry.label} • ${entry.time}</small>`;
    listNode.appendChild(bubble);
    listNode.scrollTop = listNode.scrollHeight;
  };

  const appendMessage = (state, role, text) => {
    const cleanText = String(text || "").trim();
    if (!cleanText) {
      return;
    }

    const entry = {
      role,
      text: cleanText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;"),
      label: role === "me" ? "Anda" : "Support",
      time: nowClock()
    };

    state.messages.push(entry);
    saveMessages(state.messages);
    addBubble(entry);
  };

  const cannedReplies = [
    "Terima kasih, pesan kamu sudah masuk. Tim kami akan membalas secepatnya.",
    "Untuk pemasangan widget, kamu bisa pakai snippet dari halaman utama atau panel client.",
    "Jika butuh tenant/panel setup, tulis kebutuhanmu, nanti kami bantu konfigurasi.",
    "Mode development aktif: data chat disimpan lokal di browser ini."
  ];

  const state = {
    messages: loadMessages(),
    replyIndex: 0
  };

  if (state.messages.length === 0) {
    appendMessage(state, "bot", `Halo! Selamat datang di ${appName}. Ada yang bisa kami bantu untuk tenant ${tenantCode}?`);
  } else {
    state.messages.forEach((entry) => addBubble(entry));
  }

  const queueReply = () => {
    const reply = cannedReplies[state.replyIndex % cannedReplies.length];
    state.replyIndex += 1;
    window.setTimeout(() => {
      appendMessage(state, "bot", reply);
    }, 480);
  };

  // Polling for replies sent from client panel (support) so widget can show outbound messages
  const lastSeenKey = `JIELIVE_EMBED_LAST_${tenantCode}`;
  const loadLastSeen = () => {
    try { return String(localStorage.getItem(lastSeenKey) || ""); } catch { return ""; }
  };
  const saveLastSeen = (val) => {
    try { if (val) localStorage.setItem(lastSeenKey, String(val)); } catch { /* ignore */ }
  };

  const pollReplies = async () => {
    try {
      const since = loadLastSeen();
      const url = `/api/v1/inbox/poll?tenantCode=${encodeURIComponent(tenantCode)}&widgetId=${encodeURIComponent(widgetId)}&limit=20${since ? `&since=${encodeURIComponent(since)}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) { return; }
      const data = await response.json().catch(() => ({}));
      const items = Array.isArray(data?.inbox) ? data.inbox : [];
      let newest = since;
      for (const item of items) {
        if (!item || !item.messageId || !item.message) { continue; }
        appendMessage(state, "bot", item.message);
        if (item.createdAt) {
          newest = newest && newest > item.createdAt ? newest : item.createdAt;
        }
      }
      if (newest && newest !== since) {
        saveLastSeen(newest);
      }
    } catch (e) {
      // ignore polling errors for now
    }
  };

  // Start polling for replies every 3s
  window.setTimeout(() => {
    pollReplies();
    setInterval(pollReplies, 3000);
  }, 800);

  const sendInboxMessage = async (text) => {
    const payload = {
      tenantCode,
      widgetId,
      widgetNumber,
      visitorName,
      message: text,
      sourceUrl: window.location.href
    };

    try {
      const response = await fetch("/api/v1/inbox/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn("Inbox message failed", await response.text());
      }
    } catch (error) {
      console.warn("Inbox message failed", error);
    }
  };

  const submitMessage = () => {
    const text = String(inputNode?.value || "").trim();
    if (!text) {
      return;
    }

    appendMessage(state, "me", text);
    sendInboxMessage(text);
    if (inputNode) {
      inputNode.value = "";
      inputNode.focus();
    }

    queueReply();
  };

  if (formNode) {
    formNode.addEventListener("submit", (event) => {
      event.preventDefault();
      submitMessage();
    });
  }

  document.querySelectorAll("[data-quick-message]").forEach((button) => {
    button.addEventListener("click", () => {
      const quickText = button.getAttribute("data-quick-message") || "";
      if (inputNode) {
        inputNode.value = quickText;
      }
      submitMessage();
    });
  });

  document.querySelectorAll("[data-chat-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-chat-action") || "";
      if (action === "maximize") {
        document.body.dataset.expanded = "true";
      }

      if (action === "minimize") {
        document.body.dataset.expanded = "false";
      }

      if ((action === "maximize" || action === "minimize") && (!window.parent || window.parent === window)) {
        return;
      }

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: `liveteams:widget-${action}` }, "*");
      }
    });
  });
})();