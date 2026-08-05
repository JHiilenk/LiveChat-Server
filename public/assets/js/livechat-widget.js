(function () {
  const currentScript = document.currentScript;
  const rootUrl = currentScript?.dataset?.chatUrl || `${window.location.origin}/embed?livechat=1`;
  const title = currentScript?.dataset?.title || "Live Chat";
  const subtitle = currentScript?.dataset?.subtitle || "Langsung kirim pesan tanpa login.";
  const accent = currentScript?.dataset?.accentColor || "#5eb3ff";
  const softAccent = currentScript?.dataset?.accentSoftColor || "rgba(94, 179, 255, 0.18)";
  const panelBottom = Number(currentScript?.dataset?.panelBottom || 12.4);

  const host = document.createElement("div");
  host.className = "livechat-widget-root";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .livechat-widget-root { position: fixed; right: 1rem; bottom: 8.8rem; z-index: 2147483647; font-family: "Space Grotesk", "Segoe UI", sans-serif; }
      .livechat-widget-launcher { position: relative; min-width: 142px; height: 56px; border: 1px solid rgba(94, 179, 255, 0.55); border-radius: 999px; background: linear-gradient(120deg, #4c97ff 0%, #2f78d8 57%, #2665c1 100%); color: #fff; box-shadow: 0 16px 32px rgba(7, 17, 49, 0.42); display: inline-flex; align-items: center; justify-content: flex-start; gap: 0.6rem; cursor: pointer; transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease; padding: 0.65rem 1rem; overflow: hidden; }
      .livechat-widget-launcher:hover { transform: translateY(-1px) scale(1.01); }
      .livechat-widget-launcher-icon { width: 34px; height: 34px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; }
      .livechat-widget-launcher-icon svg { width: 18px; height: 18px; }
      .livechat-widget-launcher-label { display: grid; line-height: 1.05; }
      .livechat-widget-launcher-label strong { font-size: 0.95rem; letter-spacing: 0.02em; font-weight: 800; }
      .livechat-widget-launcher-label span { font-size: 0.72rem; color: rgba(235, 245, 255, 0.88); }
      .livechat-widget-panel { position: fixed; right: 1rem; bottom: ${panelBottom}rem; width: min(440px, calc(100vw - 1.5rem)); height: min(700px, calc(100dvh - 6.2rem)); max-height: calc(100dvh - 6.2rem); border-radius: 24px; overflow: hidden; background: #081a34; border: 1px solid rgba(94, 179, 255, 0.24); box-shadow: 0 32px 72px rgba(5, 13, 42, 0.46); display: flex; flex-direction: column; }
      .livechat-widget-panel.hidden { display: none; }
      .livechat-widget-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 1rem 1rem 0.95rem; background: linear-gradient(180deg, rgba(9, 26, 57, 0.98) 0%, rgba(7, 18, 40, 0.98) 100%); border-bottom: 1px solid rgba(94, 179, 255, 0.14); }
      .livechat-widget-panel-title { display: grid; gap: 0.15rem; }
      .livechat-widget-panel-title strong { font-size: 1rem; letter-spacing: 0.01em; color: #f4fbff; }
      .livechat-widget-panel-title span { font-size: 0.78rem; color: rgba(206, 227, 255, 0.8); }
      .livechat-widget-panel-actions { display: flex; align-items: center; gap: 0.5rem; }
      .livechat-widget-panel-action { width: 34px; height: 34px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 999px; background: rgba(12, 24, 47, 0.92); color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; }
      .livechat-widget-panel-action:hover { filter: brightness(1.08); }
      .livechat-widget-toolbar { padding: 1rem; background: linear-gradient(180deg, rgba(9, 26, 57, 0.96) 0%, rgba(6, 15, 33, 0.96) 100%); border-bottom: 1px solid rgba(94, 179, 255, 0.12); }
      .livechat-widget-toolbar-text { font-size: 0.92rem; color: rgba(232, 244, 255, 0.9); line-height: 1.55; }
      .livechat-widget-toolbar-flag { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.75rem; padding: 0.45rem 0.8rem; border-radius: 999px; background: ${softAccent}; border: 1px solid rgba(94, 179, 255, 0.24); color: #eaf6ff; font-size: 0.75rem; }
      .livechat-widget-frame { flex: 1 1 auto; width: 100%; min-height: 0; border: 0; background: #081a34; }
      @media (max-width: 520px) {
        .livechat-widget-root { right: 0.75rem; bottom: 8.2rem; }
        .livechat-widget-panel { left: max(0.75rem, env(safe-area-inset-left)); right: max(0.75rem, env(safe-area-inset-right)); bottom: 4.35rem; width: auto; height: auto; max-height: none; }
      }
    </style>
    <div class="livechat-widget-root">
      <button class="livechat-widget-launcher" type="button" aria-label="Buka ${title}">
        <span class="livechat-widget-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3C7.03 3 3 6.69 3 11.25C3 13.85 4.28 16.12 6.5 17.65V21L10.3 18.3C10.87 18.42 11.44 18.5 12 18.5C16.97 18.5 21 14.81 21 10.25C21 5.69 16.97 3 12 3Z" fill="currentColor"/>
            <path d="M9.5 9.75H14.5" stroke="#081a34" stroke-width="1.7" stroke-linecap="round"/>
            <path d="M9.5 12.75H13" stroke="#081a34" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="livechat-widget-launcher-label">
          <strong>Live Chat</strong>
          <span>Langsung chat sekarang</span>
        </span>
      </button>
      <div class="livechat-widget-panel hidden" role="dialog" aria-label="${title}">
        <div class="livechat-widget-panel-header">
          <div class="livechat-widget-panel-title">
            <strong>${title}</strong>
            <span>${subtitle}</span>
          </div>
          <div class="livechat-widget-panel-actions">
            <button class="livechat-widget-panel-action livechat-widget-panel-close" type="button" aria-label="Tutup ${title}">✕</button>
          </div>
        </div>
        <div class="livechat-widget-toolbar">
          <div class="livechat-widget-toolbar-text">Langsung terhubung ke jalur Live Chat tanpa perlu login member atau guest.</div>
          <div class="livechat-widget-toolbar-flag">Live Chat</div>
        </div>
        <iframe class="livechat-widget-frame" src="${rootUrl}${rootUrl.includes("?") ? "&" : "?"}embed=1&livechat=1" title="${title}" loading="lazy" allow="clipboard-write"></iframe>
      </div>
    </div>
  `;

  const launcher = shadow.querySelector(".livechat-widget-launcher");
  const panel = shadow.querySelector(".livechat-widget-panel");
  const closeButton = shadow.querySelector(".livechat-widget-panel-close");
  const widgetRoot = shadow.querySelector(".livechat-widget-root");

  const openPanel = () => {
    panel.classList.remove("hidden");
    widgetRoot.classList.add("livechat-widget-open");
  };

  const closePanel = () => {
    panel.classList.add("hidden");
    widgetRoot.classList.remove("livechat-widget-open");
  };

  launcher.addEventListener("click", () => {
    if (panel.classList.contains("hidden")) {
      openPanel();
      return;
    }

    closePanel();
  });

  if (closeButton) {
    closeButton.addEventListener("click", closePanel);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  document.body.appendChild(host);
})();
