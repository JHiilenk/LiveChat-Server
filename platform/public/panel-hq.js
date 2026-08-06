const apiPrefix = "/api";

const query = (selector) => document.querySelector(selector);
const setText = (selector, value) => {
  const node = query(selector);
  if (node) {
    node.textContent = String(value ?? "-");
  }
};

const setHtml = (selector, value) => {
  const node = query(selector);
  if (node) {
    node.innerHTML = String(value ?? "");
  }
};

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

let currentClientTenantCode = "";

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
    return "<tr><td colspan=\"5\">Belum ada tenant.</td></tr>";
  }

  return tenants.map((tenant) => `
    <tr>
      <td>${tenant.tenantCode}</td>
      <td>${tenant.tenantName}</td>
      <td>${tenant.plan}</td>
      <td>${tenant.status}</td>
      <td>${tenant.backendBaseUrl}</td>
    </tr>
  `).join("");
};

const renderInboxRows = (inbox = []) => {
  if (!Array.isArray(inbox) || inbox.length === 0) {
    return "<tr><td colspan=\"4\">Belum ada pesan customer.</td></tr>";
  }

  return inbox.map((entry) => {
    const createdAt = entry?.createdAt ? new Date(entry.createdAt).toLocaleString("id-ID") : "-";
    const source = String(entry?.sourceUrl || "").trim();
    const sourceCell = source
      ? `<a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a>`
      : "-";

    return `
      <tr>
        <td>${escapeHtml(createdAt)}</td>
        <td>${escapeHtml(entry?.visitorName || "Guest")}</td>
        <td>${escapeHtml(entry?.message || "")}</td>
        <td>${sourceCell}</td>
      </tr>
    `;
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
    setHtml("[data-master-tenant-rows]", renderTenantRows(data?.tenants || []));

    const warningItems = Array.isArray(data?.runtime?.warnings) && data.runtime.warnings.length > 0
      ? data.runtime.warnings.map((item) => `<li>${item}</li>`).join("")
      : "<li>Tidak ada warning runtime.</li>";
    setHtml("[data-master-warnings]", warningItems);
  } catch (error) {
    setHtml("[data-master-tenant-rows]", `<tr><td colspan=\"5\">${error.message}</td></tr>`);
    setHtml("[data-master-warnings]", `<li>${error.message}</li>`);
  }
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
    setText("[data-client-tenant-team]", data?.tenant?.defaultTeamCode || "-");
    setText("[data-client-tenant-channel]", data?.tenant?.defaultChannelCode || "-");
    setText("[data-client-backend-url]", data?.tenant?.backendBaseUrl || "-");
    setText("[data-client-backend-state]", data?.backend?.available ? "connected" : "offline");
    setText("[data-client-owner-name]", data?.auth?.ownerName || "-");
    setText("[data-client-admin-names]", (data?.auth?.adminNames || []).join(", ") || "-");
    setText("[data-client-operator-names]", (data?.auth?.operatorNames || []).join(", ") || "-");
    setText("[data-client-snippet]", data?.widget?.snippet || "-");
    currentClientTenantCode = String(data?.tenant?.tenantCode || tenantCode || "").trim().toUpperCase();
    await hydrateClientInbox(currentClientTenantCode);
  } catch (error) {
    setText("[data-client-snippet]", error.message);
  }
};

const hydrateClientInbox = async (tenantCode = "") => {
  try {
    const safeTenantCode = String(tenantCode || currentClientTenantCode || "").trim().toUpperCase();
    const suffix = safeTenantCode ? `?tenantCode=${encodeURIComponent(safeTenantCode)}&limit=80` : "?limit=80";
    const response = await authedFetch(`${apiPrefix}/v1/client/inbox${suffix}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    setHtml("[data-client-inbox-rows]", renderInboxRows(data?.inbox || []));
  } catch (error) {
    setHtml("[data-client-inbox-rows]", `<tr><td colspan=\"4\">${escapeHtml(error.message)}</td></tr>`);
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
    await hydrateClientInbox(currentClientTenantCode);
  });
};

const bootstrapPage = () => {
  const role = document.body.dataset.panelRole;
  if (role === "master") {
    bindMasterLogin();
    bindMasterRefresh();
    hydrateMasterOverview();
    return;
  }

  if (role === "client") {
    bindClientLogin();
    bindSnippetCopy();
    bindClientInboxRefresh();
    hydrateClientOverview();
  }
};

bootstrapPage();
