(function () {
  const params = new URLSearchParams(window.location.search);
  const tenantCode = String(params.get("tenantCode") || document.body.dataset.defaultTenant || "JIELIVE").trim().toUpperCase();
  const isEmbedded = window.self !== window.top || params.get("embed") === "1" || params.get("livechat") === "1";
  const appName = document.body.dataset.appName || "JIELive";
  const storageKey = `JIELIVE_EMBED_CHAT_${tenantCode}`;

  document.body.dataset.embedded = isEmbedded ? "true" : "false";

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

  const submitMessage = () => {
    const text = String(inputNode?.value || "").trim();
    if (!text) {
      return;
    }

    appendMessage(state, "me", text);
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