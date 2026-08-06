const apiPrefix = document.documentElement.dataset.apiPrefix || "/api";

const updateText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
};

const updateValue = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && typeof element.value !== "undefined") {
    element.value = value;
  }
};

const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[character]));

const getSelectedTenantCode = () => String(document.querySelector("[data-tenant-code-input]")?.value || "").trim();

const setSessionTokenHeader = (headers = {}) => {
  const token = sessionStorage.getItem("JIELIVE_PLATFORM_SESSION");
  return token ? { ...headers, "X-Platform-Session": token } : headers;
};

const hydrateStatus = async () => {
  try {
    const [statusResponse, bootstrapResponse] = await Promise.all([
      fetch(`${apiPrefix}/v1/status`),
      fetch(`${apiPrefix}/v1/bootstrap`)
    ]);

    if (!statusResponse.ok) {
      throw new Error(`HTTP ${statusResponse.status}`);
    }

    if (!bootstrapResponse.ok) {
      throw new Error(`HTTP ${bootstrapResponse.status}`);
    }

    const data = await statusResponse.json();
    const bootstrap = await bootstrapResponse.json();
    updateText("[data-app-name]", data.service || "JIELive Control Panel");
    updateText("[data-surface-count]", String((data.routes || []).length));
    updateText("[data-tenant-code]", data.defaultTenantCode || "JIELIVE");
    updateText("[data-team-code]", data.defaultTeamCode || "GENERAL");
    updateText("[data-channel-code]", data.defaultChannelCode || "MAIN");
    updateText("[data-hostname]", data.host || window.location.hostname);
    updateText("[data-timestamp]", new Date(data.timestamp).toLocaleString("id-ID"));
    updateText("[data-backend-url]", bootstrap?.backend?.baseUrl || "-");
    updateText("[data-backend-state]", bootstrap?.backend?.available ? "connected" : "offline");
    updateText("[data-admin-role]", bootstrap?.auth?.hasOwner ? "seeded" : "empty");
    updateText("[data-widget-url]", bootstrap?.surfaces?.embed || "-");
    updateText("[data-widget-snippet]", bootstrap?.widgetSnippet || "");
    updateText("[data-deploy-ready]", Array.isArray(bootstrap?.runtime?.warnings) && bootstrap.runtime.warnings.length === 0 ? "ready" : "needs review");
    updateText("[data-runtime-warnings]", Array.isArray(bootstrap?.runtime?.warnings) && bootstrap.runtime.warnings.length > 0 ? bootstrap.runtime.warnings.join(" • ") : "Belum ada warning runtime.");
  } catch (error) {
    updateText("[data-status]", "offline");
    console.warn("Unable to hydrate status", error);
  }
};

const hydrateWidgetConfig = async () => {
  const snippetNode = document.querySelector("[data-widget-snippet]");
  if (!snippetNode) {
    return;
  }

  try {
    const response = await fetch(`${apiPrefix}/v1/widget-config`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    if (typeof data?.snippet === "string") {
      snippetNode.textContent = data.snippet;
    }

    updateText("[data-widget-url]", data?.widgetChatUrl || "-");
    updateText("[data-tenant-code]", data?.tenantCode || "JIELIVE");
  } catch (error) {
    console.warn("Unable to hydrate widget config", error);
  }
};

const hydrateAdminTenantEditor = async () => {
  const tenantField = document.querySelector("[data-tenant-editor]");
  if (!tenantField) {
    return;
  }

  try {
    const response = await fetch(`${apiPrefix}/v1/bootstrap`, { headers: setSessionTokenHeader() });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    updateValue("[data-tenant-code-input]", data?.tenant?.tenantCode || "");
    updateValue("[data-tenant-name-input]", data?.tenant?.tenantName || "");
    updateValue("[data-tenant-plan-input]", data?.tenant?.plan || "launch");
    updateValue("[data-tenant-status-input]", data?.tenant?.status || "active");
    updateValue("[data-tenant-public-url-input]", data?.tenant?.publicBaseUrl || window.location.origin);
    updateValue("[data-tenant-backend-url-input]", data?.tenant?.backendBaseUrl || window.location.origin);
    updateValue("[data-tenant-team-input]", data?.tenant?.defaultTeamCode || "GENERAL");
    updateValue("[data-tenant-channel-input]", data?.tenant?.defaultChannelCode || "MAIN");
    updateText("[data-widget-url]", data?.tenant?.backendBaseUrl ? `${data.tenant.backendBaseUrl}/embed?livechat=1&tenantCode=${encodeURIComponent(data.tenant.tenantCode || "")}` : "-");
    updateText("[data-deploy-ready]", Array.isArray(data?.runtime?.warnings) && data.runtime.warnings.length === 0 ? "ready" : "needs review");
    updateText("[data-runtime-warnings]", Array.isArray(data?.runtime?.warnings) && data.runtime.warnings.length > 0 ? data.runtime.warnings.join(" • ") : "Belum ada warning runtime.");
  } catch (error) {
    console.warn("Unable to hydrate tenant editor", error);
  }
};

const hydrateAdminAuthEditor = async () => {
  const authField = document.querySelector("[data-auth-editor]");
  if (!authField) {
    return;
  }

  try {
    const tenantCode = getSelectedTenantCode() || "JIELIVE";
    const response = await fetch(`${apiPrefix}/v1/auth/${encodeURIComponent(tenantCode)}`, { headers: setSessionTokenHeader() });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    updateValue("[data-auth-owner-input]", data?.auth?.ownerName || "");
    updateValue("[data-auth-admins-input]", Array.isArray(data?.auth?.admins) ? data.auth.admins.join(", ") : "");
    updateValue("[data-auth-operators-input]", Array.isArray(data?.auth?.operators) ? data.auth.operators.join(", ") : "");
    updateText("[data-owner-name]", data?.auth?.ownerName || "-");
  } catch (error) {
    console.warn("Unable to hydrate auth editor", error);
  }
};

const renderTenantList = (tenants) => {
  const listNode = document.querySelector("[data-tenant-list]");
  if (!listNode) {
    return;
  }

  if (!Array.isArray(tenants) || tenants.length === 0) {
    listNode.innerHTML = "<span class=\"meta\">Belum ada tenant lain.</span>";
    return;
  }

  listNode.innerHTML = tenants.map((tenant) => `
    <button class="surface-switch-item" type="button" data-tenant-pick="${escapeHtml(tenant.tenantCode)}" style="padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:inherit;cursor:pointer;">
      ${escapeHtml(tenant.tenantCode)}
    </button>
  `).join("");

  listNode.querySelectorAll("[data-tenant-pick]").forEach((button) => {
    button.addEventListener("click", async () => {
      const tenantCode = button.getAttribute("data-tenant-pick") || "";
      updateValue("[data-login-tenant]", tenantCode);
      updateValue("[data-tenant-code-input]", tenantCode);
      await hydrateAdminTenantEditor();
      await hydrateAdminAuthEditor();
    });
  });
};

const hydrateTenantList = async () => {
  try {
    const response = await fetch(`${apiPrefix}/v1/tenants`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    renderTenantList(data?.tenants || []);
  } catch (error) {
    console.warn("Unable to hydrate tenant list", error);
  }
};

const syncCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(currentYear);
  });
};

const bindAdminLogin = () => {
  const loginButton = document.querySelector("[data-login-button]");
  if (!loginButton) {
    return;
  }

  const tenantInput = document.querySelector("[data-login-tenant]");
  const usernameInput = document.querySelector("[data-login-username]");
  const passwordInput = document.querySelector("[data-login-password]");
  const statusNode = document.querySelector("[data-login-status]");

  const setStatus = (message) => {
    if (statusNode) {
      statusNode.textContent = message;
    }
  };

  loginButton.addEventListener("click", async () => {
    try {
      setStatus("Memproses login...");
      const response = await fetch(`${apiPrefix}/v1/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantCode: tenantInput?.value || "",
          userName: usernameInput?.value || "",
          password: passwordInput?.value || ""
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      if (data?.session?.token) {
        sessionStorage.setItem("JIELIVE_PLATFORM_SESSION", data.session.token);
      }

      setStatus(`Login berhasil sebagai ${data.role || "member"}.`);
    } catch (error) {
      setStatus(`Login gagal: ${error.message}`);
    }
  });
};

const bindTenantSave = () => {
  const saveButton = document.querySelector("[data-tenant-save]");
  if (!saveButton) {
    return;
  }

  const statusNode = document.querySelector("[data-tenant-save-status]");
  const tenantCodeInput = document.querySelector("[data-tenant-code-input]");
  const tenantNameInput = document.querySelector("[data-tenant-name-input]");
  const planInput = document.querySelector("[data-tenant-plan-input]");
  const statusInput = document.querySelector("[data-tenant-status-input]");
  const publicUrlInput = document.querySelector("[data-tenant-public-url-input]");
  const backendUrlInput = document.querySelector("[data-tenant-backend-url-input]");
  const teamInput = document.querySelector("[data-tenant-team-input]");
  const channelInput = document.querySelector("[data-tenant-channel-input]");

  const setStatus = (message) => {
    if (statusNode) {
      statusNode.textContent = message;
    }
  };

  saveButton.addEventListener("click", async () => {
    try {
      const tenantCode = String(tenantCodeInput?.value || "").trim();
      if (!tenantCode) {
        throw new Error("Tenant code wajib diisi.");
      }

      setStatus("Menyimpan tenant...");
      const response = await fetch(`${apiPrefix}/v1/tenants/${encodeURIComponent(tenantCode)}`, {
        method: "PUT",
        headers: setSessionTokenHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          tenantName: tenantNameInput?.value || "",
          plan: planInput?.value || "launch",
          status: statusInput?.value || "active",
          publicBaseUrl: publicUrlInput?.value || "",
          backendBaseUrl: backendUrlInput?.value || "",
          defaultTeamCode: teamInput?.value || "",
          defaultChannelCode: channelInput?.value || ""
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      setStatus(`Tenant ${data?.tenant?.tenantCode || tenantCode} tersimpan.`);
      updateText("[data-backend-url]", data?.tenant?.backendBaseUrl || "-");
      updateText("[data-widget-url]", data?.tenant?.backendBaseUrl ? `${data.tenant.backendBaseUrl}/embed?livechat=1&tenantCode=${encodeURIComponent(data.tenant.tenantCode || tenantCode)}` : "-");
      await hydrateTenantList();
    } catch (error) {
      setStatus(`Gagal menyimpan tenant: ${error.message}`);
    }
  });
};

const bindAuthSave = () => {
  const saveButton = document.querySelector("[data-auth-save]");
  if (!saveButton) {
    return;
  }

  const statusNode = document.querySelector("[data-auth-save-status]");
  const ownerInput = document.querySelector("[data-auth-owner-input]");
  const ownerPasswordInput = document.querySelector("[data-auth-owner-password-input]");
  const adminPasswordInput = document.querySelector("[data-auth-admin-password-input]");
  const adminsInput = document.querySelector("[data-auth-admins-input]");
  const operatorsInput = document.querySelector("[data-auth-operators-input]");

  const setStatus = (message) => {
    if (statusNode) {
      statusNode.textContent = message;
    }
  };

  saveButton.addEventListener("click", async () => {
    try {
      const tenantCode = String(document.querySelector("[data-tenant-code-input]")?.value || "").trim();
      if (!tenantCode) {
        throw new Error("Tenant code wajib diisi.");
      }

      setStatus("Menyimpan auth...");
      const response = await fetch(`${apiPrefix}/v1/auth/${encodeURIComponent(tenantCode)}`, {
        method: "PUT",
        headers: setSessionTokenHeader({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          ownerName: ownerInput?.value || "",
          ownerPassword: ownerPasswordInput?.value || "",
          adminPassword: adminPasswordInput?.value || "",
          adminNames: adminsInput?.value || "",
          operatorNames: operatorsInput?.value || ""
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      setStatus(`Auth ${data?.auth?.teamCode || tenantCode} tersimpan.`);
      updateText("[data-admin-role]", Array.isArray(data?.auth?.admins) && data.auth.admins.length > 0 ? "configured" : "empty");
      updateText("[data-owner-name]", data?.auth?.ownerName || "-");
    } catch (error) {
      setStatus(`Gagal menyimpan auth: ${error.message}`);
    }
  });
};

const bindWidgetSnippetCopy = () => {
  const copyButton = document.querySelector("[data-copy-widget-snippet]");
  const snippetNode = document.querySelector("[data-widget-snippet]");
  if (!copyButton || !snippetNode) {
    return;
  }

  copyButton.addEventListener("click", async () => {
    const snippet = String(snippetNode.textContent || "").trim();
    if (!snippet) {
      return;
    }

    await navigator.clipboard.writeText(snippet);
    copyButton.textContent = "Disalin";
    window.setTimeout(() => {
      copyButton.textContent = "Copy snippet";
    }, 1500);
  });
};

hydrateStatus();
hydrateWidgetConfig();
syncCurrentYear();
bindAdminLogin();
hydrateAdminTenantEditor();
hydrateAdminAuthEditor();
hydrateTenantList();
bindTenantSave();
bindAuthSave();
bindWidgetSnippetCopy();