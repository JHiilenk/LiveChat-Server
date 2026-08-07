const apiPrefix = "/api";

const query = (selector) => document.querySelector(selector);
const queryAll = (selector) => document.querySelectorAll(selector);

const setText = (selector, value) => {
  queryAll(selector).forEach((node) => { node.textContent = String(value ?? "-"); });
};

const setHtml = (selector, value) => {
  const node = query(selector);
  if (node) {
    node.innerHTML = String(value ?? "");
  }
};

const showLoggedIn = (userName = "") => {
  document.body.dataset.loggedIn = "true";
  const userEl = query("[data-session-user]");
  if (userEl && userName) { userEl.textContent = userName; }
};

const showLoggedOut = () => {
  document.body.dataset.loggedIn = "false";
  const userEl = query("[data-session-user]");
  if (userEl) { userEl.textContent = ""; }
  queryAll("[data-client-subscription-label]").forEach((n) => { n.textContent = ""; });
  queryAll("[data-client-tenant-code]").forEach((n) => { n.textContent = ""; });
};

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("id-ID");
};

const setFormDisabled = (selector, disabled) => {
  const form = query(selector);
  if (!form) {
    return;
  }

  form.querySelectorAll("input, button, select, textarea").forEach((control) => {
    control.disabled = disabled;
  });
};

const applyClientAccessState = (tenant = {}, subscription = {}) => {
  const accessEnabled = Boolean(subscription?.accessEnabled ?? tenant?.subscriptionAccessEnabled ?? true);
  const subscriptionLabel = String(tenant?.subscriptionLabel || subscription?.label || tenant?.status || "-");
  const subscriptionExpiresAt = tenant?.subscriptionExpiresAt || subscription?.expiresAt || "";

  setText("[data-client-subscription-label]", subscriptionLabel);
  setText("[data-client-subscription-expires-at]", formatDateTime(subscriptionExpiresAt));
  setText("[data-client-access-message]", accessEnabled
    ? "Akses aktif. Login, inbox, dan snippet embed bisa dipakai normal."
    : "Langganan tenant sudah kedaluwarsa. Perpanjang dari panel master untuk mengaktifkan kembali fitur.");

  setFormDisabled("[data-client-login-form]", !accessEnabled);
  const copyButton = query("[data-client-copy-snippet]");
  if (copyButton) {
    copyButton.disabled = !accessEnabled;
  }

  const refreshButton = query("[data-client-refresh-inbox]");
  if (refreshButton) {
    refreshButton.disabled = !accessEnabled;
  }
};

let currentClientTenantCode = "";
let currentClientWidgetId = "";

const getSessionToken = () => sessionStorage.getItem("JIELIVE_PLATFORM_SESSION");
const setSessionToken = (token) => sessionStorage.setItem("JIELIVE_PLATFORM_SESSION", token);

const authedFetch = async (url, options = {}) => {
  const headers = {
    ...(options.headers || {}),
    ...(getSessionToken() ? { "X-Platform-Session": getSessionToken() } : {})
  };

  return fetch(url, { ...options, headers });
};

const renderTenantRows = (tenants = []) => {
  if (!Array.isArray(tenants) || tenants.length === 0) {
    return "<tr><td colspan=\"9\">Belum ada tenant.</td></tr>";
  }

  return tenants.map((tenant) => `
    <tr>
      <td>${tenant.tenantCode}</td>
      <td>${tenant.tenantName}</td>
      <td>${tenant.ownerName || "-"}</td>
      <td>${tenant.widgetId ? `${escapeHtml(tenant.widgetId)}${tenant.widgetNumber ? ` #${escapeHtml(tenant.widgetNumber)}` : ""}` : "-"}</td>
      <td>${tenant.plan}</td>
      <td>${tenant.status}</td>
      <td>${escapeHtml(tenant.subscriptionLabel || tenant.status || "-")}</td>
      <td>${tenant.demoUrl ? `<a href="${escapeHtml(tenant.demoUrl)}" target="_blank" rel="noopener noreferrer">Buka Demo</a>` : "-"}</td>
      <td>${tenant.backendBaseUrl}</td>
    </tr>
  `).join("");
};

const renderInboxCards = (inbox = []) => {
  if (!Array.isArray(inbox) || inbox.length === 0) {
    return `<div class="crm-empty"><span class="crm-empty-icon">📭</span><span>Belum ada pesan</span></div>`;
  }

  return inbox.map((entry) => {
    const name = escapeHtml(entry?.visitorName || "Guest");
    const initials = (entry?.visitorName || "G").slice(0, 2).toUpperCase();
    const time = entry?.createdAt ? new Date(entry.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "";
    const preview = escapeHtml(String(entry?.message || "").slice(0, 80));
    const widget = entry?.widgetId ? `${escapeHtml(entry.widgetId)}${entry.widgetNumber ? " #" + escapeHtml(String(entry.widgetNumber)) : ""}` : "";
    return `<div class="crm-conv-item">
      <div class="crm-conv-avatar">${escapeHtml(initials)}</div>
      <div class="crm-conv-body">
        <div class="crm-conv-top"><span class="crm-conv-name">${name}</span><span class="crm-conv-time">${time}</span></div>
        <div class="crm-conv-preview">${preview}</div>
        ${widget ? `<div class="crm-conv-badges"><span class="crm-badge">${widget}</span></div>` : ""}
      </div>
    </div>`;
  }).join("");
};

const renderTenantCards = (tenants = []) => {
  if (!Array.isArray(tenants) || tenants.length === 0) {
    return `<div class="crm-empty"><span class="crm-empty-icon">🏢</span><span>Belum ada tenant</span></div>`;
  }

  return tenants.map((tenant) => {
    const initials = (tenant.tenantCode || "T").slice(0, 2).toUpperCase();
    const statusClass = tenant.status === "expired" ? "crm-badge-err" : tenant.status === "active" ? "crm-badge-ok" : "crm-badge-warn";
    return `<div class="crm-conv-item">
      <div class="crm-conv-avatar" style="background:linear-gradient(135deg,#0ea5e9,#6366f1)">${escapeHtml(initials)}</div>
      <div class="crm-conv-body">
        <div class="crm-conv-top"><span class="crm-conv-name">${escapeHtml(tenant.tenantCode || "-")}</span></div>
        <div class="crm-conv-preview">${escapeHtml(tenant.tenantName || "-")}</div>
        <div class="crm-conv-badges"><span class="crm-badge ${statusClass}">${escapeHtml(tenant.status || "-")}</span>${tenant.subscriptionDaysLeft != null ? `<span class="crm-badge">${tenant.subscriptionDaysLeft}h</span>` : ""}</div>
      </div>
    </div>`;
  }).join("");
};

const hydrateMasterOverview = async () => {
  try {
    const response = await authedFetch(`${apiPrefix}/v1/master/overview`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    setText("[data-master-tenant-count]", data?.stats?.tenantCount || 0);
    setText("[data-master-active-tenant-count]", data?.stats?.activeTenantCount || 0);
    setText("[data-master-client-sessions]", data?.stats?.clientSessions || 0);
    setText("[data-master-backend-state]", Array.isArray(data?.runtime?.warnings) && data.runtime.warnings.length === 0 ? "ready" : "warning");
    setText("[data-master-trial-days]", data?.settings?.subscription?.defaultTrialDays || 30);
    const trialInput = query("[data-master-trial-settings-form] input[name=\"defaultTrialDays\"]");
    if (trialInput && document.activeElement !== trialInput) {
      trialInput.value = String(data?.settings?.subscription?.defaultTrialDays || 30);
    }
    setHtml("[data-master-tenant-rows]", renderTenantRows(data?.tenants || []));
    setHtml("[data-master-tenant-list]", renderTenantCards(data?.tenants || []));

    const warningItems = Array.isArray(data?.runtime?.warnings) && data.runtime.warnings.length > 0
      ? data.runtime.warnings.map((item) => `<li>${item}</li>`).join("")
      : "<li>Tidak ada warning runtime.</li>";
    setHtml("[data-master-warnings]", warningItems);
  } catch (error) {
    setHtml("[data-master-tenant-rows]", `<tr><td colspan=\"9\">${error.message}</td></tr>`);
    setHtml("[data-master-warnings]", `<li>${error.message}</li>`);
  }
};

const bindMasterClientRegister = () => {
  const form = query("[data-master-client-register-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = query("[data-master-client-register-status]");
    if (status) {
      status.textContent = "Memproses registrasi client...";
    }

    try {
      const formData = new FormData(form);
      const payload = {
        tenantName: String(formData.get("tenantName") || ""),
        userName: String(formData.get("userName") || ""),
        password: String(formData.get("password") || "")
      };

      const response = await authedFetch(`${apiPrefix}/v1/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      form.reset();
      if (status) {
        status.textContent = `Client ${data?.tenant?.tenantName || payload.tenantName} terdaftar dengan kode ${data?.tenant?.tenantCode || "-"}, widget ${data?.tenant?.widgetId || "-"}, dan trial ${data?.tenant?.subscriptionTrialDays || data?.subscriptionSettings?.defaultTrialDays || 30} hari.`;
      }

      await hydrateMasterOverview();
    } catch (error) {
      if (status) {
        status.textContent = `Registrasi gagal: ${error.message}`;
      }
    }
  });
};

const bindMasterLogin = () => {
  const form = query("[data-master-login-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = query("[data-master-login-status]");
    if (status) {
      status.textContent = "Memproses login master...";
    }

    try {
      const formData = new FormData(form);
      const payload = {
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || "")
      };

      const response = await fetch(`${apiPrefix}/v1/master/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      setSessionToken(data?.session?.token || "");
      showLoggedIn(data?.profile?.email || "master");
      if (status) {
        status.textContent = `Login berhasil sebagai ${data?.profile?.email || "master"}.`;
      }

      await hydrateMasterOverview();
    } catch (error) {
      if (status) {
        status.textContent = `Login gagal: ${error.message}`;
      }
    }
  });
};

const bindMasterRefresh = () => {
  const button = query("[data-master-refresh]");
  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    await hydrateMasterOverview();
  });
};

const bindMasterRenew = () => {
  const form = query("[data-master-renew-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = query("[data-master-renew-status]");
    if (status) {
      status.textContent = "Memproses perpanjangan langganan...";
    }

    try {
      const formData = new FormData(form);
      const tenantCode = String(formData.get("tenantCode") || "").trim().toUpperCase();
      const months = Math.max(Number(formData.get("months") || 1), 1);

      if (!tenantCode) {
        throw new Error("Tenant code wajib diisi.");
      }

      const response = await authedFetch(`${apiPrefix}/v1/tenants/${encodeURIComponent(tenantCode)}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      if (status) {
        status.textContent = `Langganan ${data?.tenant?.tenantCode || tenantCode} diperpanjang sampai ${formatDateTime(data?.tenant?.subscriptionExpiresAt)}.`;
      }

      await hydrateMasterOverview();
    } catch (error) {
      if (status) {
        status.textContent = `Perpanjangan gagal: ${error.message}`;
      }
    }
  });
};

const bindMasterTrialSettings = () => {
  const form = query("[data-master-trial-settings-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = query("[data-master-trial-settings-status]");
    if (status) {
      status.textContent = "Menyimpan pengaturan trial...";
    }

    try {
      const formData = new FormData(form);
      const defaultTrialDays = Math.max(Number(formData.get("defaultTrialDays") || 30), 1);
      const response = await authedFetch(`${apiPrefix}/v1/settings/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultTrialDays })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      setText("[data-master-trial-days]", data?.settings?.defaultTrialDays || defaultTrialDays);
      if (status) {
        status.textContent = `Trial gratis awal disimpan: ${data?.settings?.defaultTrialDays || defaultTrialDays} hari.`;
      }

      await hydrateMasterOverview();
    } catch (error) {
      if (status) {
        status.textContent = `Simpan pengaturan gagal: ${error.message}`;
      }
    }
  });
};

const hydrateClientOverview = async (tenantCode = "") => {
  try {
    const suffix = tenantCode ? `?tenantCode=${encodeURIComponent(tenantCode)}` : "";
    const response = await authedFetch(`${apiPrefix}/v1/client/overview${suffix}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    setText("[data-client-tenant-code]", data?.tenant?.tenantCode || "-");
    setText("[data-client-tenant-name]", data?.tenant?.tenantName || "-");
    setText("[data-client-tenant-plan]", data?.tenant?.plan || "-");
    setText("[data-client-tenant-status]", data?.tenant?.status || "-");
    setText("[data-client-subscription-label]", data?.tenant?.subscriptionLabel || data?.subscription?.label || data?.tenant?.status || "-");
    setText("[data-client-subscription-expires-at]", formatDateTime(data?.tenant?.subscriptionExpiresAt || data?.subscription?.expiresAt));
    setText("[data-client-widget-id]", data?.tenant?.widgetId || data?.widget?.widgetId || "-");
    setText("[data-client-widget-number]", data?.tenant?.widgetNumber || data?.widget?.widgetNumber || "-");
    setText("[data-client-tenant-team]", data?.tenant?.defaultTeamCode || "-");
    setText("[data-client-tenant-channel]", data?.tenant?.defaultChannelCode || "-");
    setText("[data-client-backend-url]", data?.tenant?.backendBaseUrl || "-");
    setText("[data-client-backend-state]", data?.backend?.available ? "connected" : "offline");
    setText("[data-client-owner-name]", data?.auth?.ownerName || "-");
    setText("[data-client-admin-names]", (data?.auth?.adminNames || []).join(", ") || "-");
    setText("[data-client-operator-names]", (data?.auth?.operatorNames || []).join(", ") || "-");
    setText("[data-client-snippet]", data?.widget?.snippet || "-");
    applyClientAccessState(data?.tenant || {}, data?.subscription || {});
    currentClientTenantCode = String(data?.tenant?.tenantCode || tenantCode || "").trim().toUpperCase();
    currentClientWidgetId = String(data?.tenant?.widgetId || data?.widget?.widgetId || "").trim().toUpperCase();
    if (data?.tenant?.subscriptionAccessEnabled ?? data?.subscription?.accessEnabled ?? true) {
      await hydrateClientInbox(currentClientTenantCode, currentClientWidgetId);
    } else {
      setHtml("[data-client-inbox-rows]", "<tr><td colspan=\"5\">Langganan kedaluwarsa. Inbox dinonaktifkan sampai perpanjangan dilakukan.</td></tr>");
    }
  } catch (error) {
    setText("[data-client-snippet]", error.message);
    setText("[data-client-access-message]", error.message);
  }
};

const hydrateClientInbox = async (tenantCode = "", widgetId = "") => {
  try {
    const safeTenantCode = String(tenantCode || currentClientTenantCode || "").trim().toUpperCase();
    const safeWidgetId = String(widgetId || currentClientWidgetId || "").trim().toUpperCase();
    const suffix = [
      safeTenantCode ? `tenantCode=${encodeURIComponent(safeTenantCode)}` : "",
      safeWidgetId ? `widgetId=${encodeURIComponent(safeWidgetId)}` : "",
      "limit=80"
    ].filter(Boolean).join("&");
    const response = await authedFetch(`${apiPrefix}/v1/client/inbox${suffix}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    setHtml("[data-inbox-list]", renderInboxCards(data?.inbox || []));
  } catch (error) {
    setHtml("[data-inbox-list]", `<div class="crm-empty"><span class="crm-empty-icon">⚠️</span><span>${escapeHtml(error.message)}</span></div>`);
  }
};

const bindClientLogin = () => {
  const form = query("[data-client-login-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = query("[data-client-login-status]");
    if (status) {
      status.textContent = "Memproses login client...";
    }

    try {
      const formData = new FormData(form);
      const payload = {
        tenantCode: String(formData.get("tenantCode") || ""),
        userName: String(formData.get("userName") || ""),
        password: String(formData.get("password") || "")
      };

      const response = await fetch(`${apiPrefix}/v1/client/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      setSessionToken(data?.session?.token || "");
      showLoggedIn(data?.role ? `${payload.userName} (${data.role})` : payload.userName);
      if (status) {
        status.textContent = `Login berhasil untuk tenant ${data?.tenantCode || payload.tenantCode}.`;
      }

      await hydrateClientOverview(data?.tenantCode || payload.tenantCode);
    } catch (error) {
      if (status) {
        status.textContent = `Login gagal: ${error.message}`;
      }
    }
  });
};

const bindSnippetCopy = () => {
  const button = query("[data-client-copy-snippet]");
  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    const snippet = query("[data-client-snippet]")?.textContent || "";
    if (!snippet || snippet.startsWith("//")) {
      return;
    }

    await navigator.clipboard.writeText(snippet);
    const original = button.textContent;
    button.textContent = "Disalin";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  });
};

const bindClientInboxRefresh = () => {
  const button = query("[data-client-refresh-inbox]");
  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    await hydrateClientInbox(currentClientTenantCode, currentClientWidgetId);
  });
};

const bindLogout = () => {
  const btn = query("[data-logout-btn]");
  if (!btn) { return; }
  btn.addEventListener("click", () => {
    setSessionToken("");
    showLoggedOut();
  });
};

const restoreSession = async () => {
  const token = getSessionToken();
  if (!token) { return; }
  const role = document.body.dataset.panelRole;
  try {
    if (role === "master") {
      const res = await authedFetch(`${apiPrefix}/v1/master/overview`);
      if (res.ok) { showLoggedIn("master"); await hydrateMasterOverview(); }
    } else {
      const res = await authedFetch(`${apiPrefix}/v1/client/overview`);
      if (res.ok) {
        const data = await res.json();
        showLoggedIn(data?.auth?.ownerName || "client");
        await hydrateClientOverview(data?.tenant?.tenantCode || "");
      }
    }
  } catch { /* session expired – stay on login */ }
};

const bootstrapPage = () => {
  const role = document.body.dataset.panelRole;
  if (role === "master") {
    bindMasterLogin();
    bindMasterRefresh();
    bindMasterRenew();
    bindMasterTrialSettings();
    bindMasterClientRegister();
    bindLogout();
    restoreSession();
    return;
  }

  if (role === "client") {
    bindClientLogin();
    bindSnippetCopy();
    bindClientInboxRefresh();
    bindLogout();
    restoreSession();
  }
};

bootstrapPage();
