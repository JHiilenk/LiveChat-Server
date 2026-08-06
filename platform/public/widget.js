(function () {
  const currentScript = document.currentScript;
  const scriptOrigin = (() => {
    try {
      return new URL(currentScript?.src || window.location.href, window.location.href).origin;
    } catch {
      return window.location.origin;
    }
  })();

  const isLocalHostName = (hostName) => {
    const host = String(hostName || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "[::1]";
  };

  const buildDefaultChatUrl = (tenantCode = "JIELIVE") => {
    const url = new URL("/embed", scriptOrigin);
    url.searchParams.set("livechat", "1");
    url.searchParams.set("tenantCode", tenantCode);
    return url.toString();
  };

  const normalizeChatUrl = (rawUrl) => {
    const configuredUrl = String(rawUrl || "").trim();
    if (!configuredUrl) {
      return buildDefaultChatUrl();
    }

    try {
      const candidate = new URL(configuredUrl, scriptOrigin);
      const scriptHostIsLocal = isLocalHostName(new URL(scriptOrigin).hostname);
      const candidateHostIsLocal = isLocalHostName(candidate.hostname);

      if (candidateHostIsLocal && !scriptHostIsLocal) {
        const tenantCode = String(candidate.searchParams.get("tenantCode") || "JIELIVE").trim().toUpperCase() || "JIELIVE";
        return buildDefaultChatUrl(tenantCode);
      }

      return candidate.toString();
    } catch {
      return buildDefaultChatUrl();
    }
  };

  const chatUrl = normalizeChatUrl(currentScript?.dataset?.chatUrl);
  const title = String(currentScript?.dataset?.title || "JIELive Live Chat");
  const subtitle = String(currentScript?.dataset?.subtitle || "Tim support siap membantu");

  const host = document.createElement("div");
  host.className = "jielive-widget-host";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .root {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2147483647;
        font-family: "Segoe UI", Tahoma, sans-serif;
      }
      .launcher {
        border: 0;
        border-radius: 999px;
        padding: 12px 15px;
        min-width: 144px;
        color: #eff7ff;
        cursor: pointer;
        font-weight: 700;
        background: linear-gradient(130deg, #58a9ff, #2a74d4);
        box-shadow: 0 18px 36px rgba(6, 23, 53, 0.42);
        display: inline-flex;
        align-items: center;
        gap: 9px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #6ef0b5;
        box-shadow: 0 0 0 7px rgba(110, 240, 181, 0.22);
      }
      .panel {
        position: fixed;
        right: 16px;
        bottom: 16px;
        width: min(380px, calc(100vw - 20px));
        height: min(620px, calc(100dvh - 24px));
        border-radius: 26px;
        overflow: hidden;
        border: 1px solid rgba(102, 166, 255, 0.45);
        box-shadow: 0 24px 64px rgba(5, 18, 42, 0.45);
        background: #091a34;
        display: grid;
        grid-template-rows: auto 1fr;
      }
      .panel.expanded {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        width: min(960px, calc(100vw - 24px));
        height: min(900px, calc(100dvh - 24px));
        border-radius: 18px;
      }
      .panel.hidden { display: none; }
      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(102, 166, 255, 0.32);
        background: linear-gradient(180deg, #112b56, #0d2243);
      }
      .head-copy {
        display: grid;
        gap: 3px;
      }
      .head-copy strong {
        color: #f4f8ff;
        font-size: 0.96rem;
      }
      .head-copy span {
        color: #a9bfde;
        font-size: 0.75rem;
      }
      .head-actions {
        display: flex;
        gap: 7px;
      }
      .head-btn {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        border: 1px solid rgba(120, 176, 255, 0.34);
        background: rgba(10, 25, 52, 0.86);
        color: #eaf2ff;
        cursor: pointer;
      }
      .frame {
        border: 0;
        width: 100%;
        height: 100%;
      }
      @media (max-width: 560px) {
        .root {
          right: 10px;
          bottom: calc(12px + env(safe-area-inset-bottom));
        }
        .panel {
          right: 10px;
          left: 10px;
          width: auto;
          bottom: calc(12px + env(safe-area-inset-bottom));
          height: calc(100dvh - 24px - env(safe-area-inset-bottom));
        }
        .panel.expanded {
          left: 10px;
          right: 10px;
          transform: none;
          width: auto;
        }
      }
    </style>
    <div class="root">
      <button class="launcher" type="button" aria-label="Buka live chat">
        <span class="dot"></span>
        <span>Live Chat</span>
      </button>
      <section class="panel hidden" role="dialog" aria-label="${title}">
        <header class="panel-head">
          <div class="head-copy">
            <strong>${title}</strong>
            <span>${subtitle}</span>
          </div>
          <div class="head-actions">
            <button class="head-btn" type="button" data-widget-action="minimize" title="Minimize">&minus;</button>
            <button class="head-btn" type="button" data-widget-action="maximize" title="Maximize">&#9723;</button>
            <button class="head-btn" type="button" data-widget-action="close" title="Tutup">&times;</button>
          </div>
        </header>
        <iframe class="frame" src="${chatUrl}${chatUrl.includes("?") ? "&" : "?"}embed=1" title="${title}" loading="lazy"></iframe>
      </section>
    </div>
  `;

  const launcher = shadow.querySelector(".launcher");
  const panel = shadow.querySelector(".panel");
  const maximizeButton = shadow.querySelector('[data-widget-action="maximize"]');

  const openPanel = () => {
    panel.classList.remove("hidden");
  };

  const closePanel = () => {
    panel.classList.add("hidden");
  };

  const setExpanded = (expanded) => {
    panel.classList.toggle("expanded", Boolean(expanded));
    if (maximizeButton) {
      maximizeButton.innerHTML = expanded ? "&#9633;" : "&#9723;";
      maximizeButton.title = expanded ? "Kembalikan ukuran" : "Maximize";
    }
  };

  const toggleExpanded = () => {
    setExpanded(!panel.classList.contains("expanded"));
  };

  launcher?.addEventListener("click", () => {
    if (panel.classList.contains("hidden")) {
      openPanel();
      return;
    }

    closePanel();
  });

  shadow.querySelectorAll("[data-widget-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = String(button.getAttribute("data-widget-action") || "").trim().toLowerCase();
      if (action === "maximize") {
        toggleExpanded();
        return;
      }

      closePanel();
    });
  });

  window.addEventListener("message", (event) => {
    if (!event?.data?.type) {
      return;
    }

    if (event.data.type === "liveteams:widget-close" || event.data.type === "liveteams:widget-minimize") {
      closePanel();
    }

    if (event.data.type === "liveteams:widget-maximize") {
      toggleExpanded();
    }
  });

  if (document.body) {
    document.body.appendChild(host);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(host);
    }, { once: true });
  }
})();