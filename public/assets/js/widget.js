(function () {
  const currentScript = document.currentScript;
  const rootUrl = currentScript?.dataset?.chatUrl || `${window.location.origin}/embed`;
  const title = currentScript?.dataset?.title || "LiveTeams Chat";
  const subtitle = currentScript?.dataset?.subtitle || "Klik untuk buka popup chat";
  const apkUrl = String(currentScript?.dataset?.apkUrl || "").trim();
  const apkCardHiddenClass = apkUrl ? "" : " hidden";

  const host = document.createElement("div");
  host.className = "widget-root";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .widget-root { position: fixed; right: 1rem; bottom: 1.15rem; z-index: 2147483647; font-family: "Space Grotesk", "Segoe UI", sans-serif; }
      .widget-launcher { position: relative; min-width: 138px; height: 56px; border: 1px solid rgba(106, 162, 255, 0.55); border-radius: 999px; background: linear-gradient(120deg, #63a0ff 0%, #3473d8 58%, #2a61be 100%); color: #f5f9ff; box-shadow: 0 16px 30px rgba(6, 16, 34, 0.48); display: inline-flex; align-items: center; justify-content: flex-start; gap: 0.52rem; cursor: pointer; transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease, opacity 140ms ease; padding: 0.52rem 0.95rem; overflow: hidden; }
      .widget-launcher::before { content: ""; position: absolute; inset: -2px; border-radius: inherit; border: 2px solid rgba(255, 163, 94, 0.34); transform: scale(0.98); opacity: 0; animation: widgetPulse 2.1s ease-out infinite; pointer-events: none; }
      .widget-launcher::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.24) 52%, rgba(255,255,255,0) 72%); transform: translateX(-140%); animation: widgetShine 3s ease-in-out infinite; pointer-events: none; }
      .widget-launcher:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 18px 34px rgba(12, 26, 11, 0.5); filter: brightness(1.03); }
      .widget-launcher-icon { width: 30px; height: 30px; border-radius: 999px; background: rgba(255, 165, 92, 0.24); display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; position: relative; top: -5px; }
      .widget-launcher svg { width: 18px; height: 18px; position: relative; top: -0.5px; }
      .widget-launcher-label { display: grid; line-height: 1.05; text-align: left; position: relative; z-index: 1; }
      .widget-launcher-label strong { font-size: 0.93rem; letter-spacing: 0.01em; font-weight: 800; }
      .widget-launcher-label span { font-size: 0.68rem; color: rgba(230, 241, 255, 0.88); font-weight: 700; }
      .widget-panel { position: fixed; right: 1rem; bottom: 5.1rem; width: min(420px, calc(100vw - 1.5rem)); height: min(680px, calc(100dvh - 5.8rem)); max-height: calc(100dvh - 5.8rem); border-radius: 22px; overflow: hidden; background: #081a34; border: 1px solid rgba(106, 162, 255, 0.28); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42); display: flex; flex-direction: column; }
      .widget-panel.hidden { display: none; }
      .widget-root.widget-open .widget-launcher { opacity: 0; pointer-events: none; }
      .widget-panel.maximized { position: fixed; inset: 0; width: auto; height: auto; border-radius: 0; }
      .widget-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 0.9rem; background: linear-gradient(180deg, rgba(12, 34, 70, 0.98) 0%, rgba(8, 23, 46, 0.98) 100%); border-bottom: 1px solid rgba(106, 162, 255, 0.22); }
      .widget-apk-card { position: relative; display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; background: linear-gradient(180deg, rgba(7, 23, 47, 0.98), rgba(10, 36, 76, 0.94)); border-bottom: 1px solid rgba(86, 150, 255, 0.24); }
      .widget-apk-card.hidden { display: none; }
      .widget-apk-card-title { display: flex; align-items: center; gap: 0.65rem; }
      .widget-apk-card-title strong { font-size: 0.95rem; letter-spacing: 0.03em; color: #fff; }
      .widget-apk-card-subtitle { font-size: 0.79rem; color: rgba(229, 242, 255, 0.8); line-height: 1.35; }
      .widget-apk-card-actions { display: flex; flex-wrap: wrap; gap: 0.65rem; }
      .widget-apk-button { min-width: 120px; border: 1px solid rgba(94, 173, 255, 0.44); border-radius: 999px; padding: 0.72rem 1rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; background: linear-gradient(120deg, #58a5ff 0%, #2c6ddb 100%); color: #fff; text-decoration: none; font-weight: 700; transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease; }
      .widget-apk-button:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(29, 88, 215, 0.22); }
      .widget-apk-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.22rem 0.55rem; border-radius: 999px; background: rgba(52, 128, 255, 0.12); border: 1px solid rgba(94, 173, 255, 0.22); color: #b7d7ff; font-size: 0.72rem; }
      .widget-apk-card-note { color: rgba(226, 236, 255, 0.75); font-size: 0.74rem; line-height: 1.45; }
      .widget-panel-title { display: grid; gap: 0.1rem; }
      .widget-panel-title strong { font-size: 0.95rem; letter-spacing: 0.02em; color: #eff7e1; }
      .widget-panel-title span { font-size: 0.72rem; color: #a5bbdb; }
      .widget-panel-actions { display: inline-flex; align-items: center; gap: 0.38rem; }
      .widget-panel-action { border: 1px solid rgba(106, 162, 255, 0.25); border-radius: 999px; background: rgba(10, 30, 59, 0.95); color: #eef5ff; width: 34px; height: 34px; cursor: pointer; font-size: 0.95rem; line-height: 1; display: inline-flex; align-items: center; justify-content: center; }
      .widget-panel-action:hover { filter: brightness(1.08); }
      .widget-panel-close { border: 1px solid rgba(255, 159, 88, 0.24); border-radius: 999px; background: rgba(49, 31, 17, 0.95); color: #ffddc4; width: 34px; height: 34px; cursor: pointer; }
      .widget-frame { flex: 1 1 auto; width: 100%; border: 0; background: #081a34; }
      @keyframes widgetPulse { 0% { opacity: 0; transform: scale(0.98); } 22% { opacity: 1; } 100% { opacity: 0; transform: scale(1.1); } }
      @keyframes widgetShine { 0% { transform: translateX(-140%); } 48% { transform: translateX(150%); } 100% { transform: translateX(150%); } }
      @media (max-width: 520px) { .widget-root { right: 0.75rem; bottom: 4.2rem; } .widget-panel { left: max(0.75rem, env(safe-area-inset-left)); right: max(0.75rem, env(safe-area-inset-right)); top: max(0px, env(safe-area-inset-top)); bottom: max(0.75rem, env(safe-area-inset-bottom)); width: auto; height: auto; max-height: none; } .widget-launcher { min-width: 130px; height: 52px; padding: 0.46rem 0.82rem; } .widget-launcher-icon { position: relative; top: -7px; } .widget-launcher-label strong { font-size: 0.84rem; } }
      @media (min-width: 640px) {
        .widget-panel.maximized {
          left: auto;
          right: 0;
          top: 0;
          bottom: 0;
          width: min(460px, calc(100vw - 1rem));
          height: auto;
          border-radius: 0 0 20px 20px;
          border-right: 1px solid rgba(106, 162, 255, 0.28);
        }
      }
    </style>
    <div class="widget-root">
      <button class="widget-launcher" type="button" aria-label="Buka ${title}">
        <span class="widget-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4.5 5.75C4.5 4.23122 5.73122 3 7.25 3H16.75C18.2688 3 19.5 4.23122 19.5 5.75V13.25C19.5 14.7688 18.2688 16 16.75 16H10.7L6.45 19.2C6.08 19.48 5.5 19.22 5.5 18.76V16H7.25C5.73122 16 4.5 14.7688 4.5 13.25V5.75Z" fill="currentColor"/>
            <path d="M8 8.25H16" stroke="#eff5ff" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M8 11.25H13.5" stroke="#eff5ff" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="widget-launcher-label">
          <strong>LiveTeams</strong>
          <span>Online now</span>
        </span>
      </button>
      <div class="widget-panel hidden" role="dialog" aria-label="${title}">        <div class="widget-apk-card${apkCardHiddenClass}">
          <div class="widget-apk-card-title">
            <strong>Unduh Aplikasi Android</strong>
            <span class="widget-apk-pill">Lebih cepat & offline ready</span>
          </div>
          <p class="widget-apk-card-subtitle">Pasang LiveTeams di ponsel untuk akses chat cepat tanpa buka browser berulang.</p>
          <div class="widget-apk-card-actions">
            <a class="widget-apk-button" href="${apkUrl}" target="_blank" rel="noopener noreferrer" aria-label="Download APK LiveTeams">Download APK</a>
            <button class="widget-apk-button widget-apk-later" type="button">Nanti Saja</button>
          </div>
          <p class="widget-apk-card-note">Aplikasi mandiri ini memberikan pengalaman chat yang lebih lancar dan mudah dibuka kembali.</p>
        </div>        <div class="widget-panel-header">
          <div class="widget-panel-title">
            <strong>${title}</strong>
            <span>${subtitle}</span>
          </div>
          <div class="widget-panel-actions">
            <button class="widget-panel-action widget-panel-minimize" type="button" aria-label="Minimize ${title}" title="Minimize">&#8722;</button>
            <button class="widget-panel-action widget-panel-maximize" type="button" aria-label="Maximize ${title}" title="Maximize">&#9723;</button>
            <button class="widget-panel-close" type="button" aria-label="Tutup ${title}">✕</button>
          </div>
        </div>
        <iframe class="widget-frame" src="${rootUrl}${rootUrl.includes("?") ? "&" : "?"}embed=1" title="${title}" loading="lazy" allow="clipboard-write"></iframe>
      </div>
    </div>
  `;

  const launcher = shadow.querySelector(".widget-launcher");
  const panel = shadow.querySelector(".widget-panel");
  const widgetRoot = shadow.querySelector(".widget-root");
  const frame = shadow.querySelector(".widget-frame");
  const closeButton = shadow.querySelector(".widget-panel-close");
  const minimizeButton = shadow.querySelector(".widget-panel-minimize");
  const maximizeButton = shadow.querySelector(".widget-panel-maximize");
  const apkLaterButton = shadow.querySelector(".widget-apk-later");
  let detachFrameVisibilitySync = null;

  const isDesktopViewport = () => window.matchMedia("(min-width: 640px)").matches;

  const setMaximized = (value) => {
    const isMaximized = Boolean(value);
    panel.classList.toggle("maximized", isMaximized);
    if (maximizeButton) {
      maximizeButton.innerHTML = isMaximized ? "&#11123;" : "&#9723;";
      maximizeButton.setAttribute("aria-label", isMaximized ? `Kecilkan ${title}` : `Buka penuh ${title}`);
      maximizeButton.setAttribute("title", isMaximized ? "Kecilkan" : "Buka penuh");
    }
  };

  const openPanel = ({ maximize = false } = {}) => {
    panel.classList.remove("hidden");
    widgetRoot?.classList.add("widget-open");
    setMaximized(maximize);
  };

  const closePanel = () => {
    panel.classList.add("hidden");
    widgetRoot?.classList.remove("widget-open");
    setMaximized(false);
  };

  const bindFrameVisibilitySync = () => {
    if (!frame) {
      return;
    }

    if (typeof detachFrameVisibilitySync === "function") {
      detachFrameVisibilitySync();
      detachFrameVisibilitySync = null;
    }

    let doc;
    try {
      doc = frame.contentDocument;
    } catch {
      return;
    }

    if (!doc) {
      return;
    }

    const messageList = doc.getElementById("messageList");
    const messageInput = doc.getElementById("messageInput");
    if (!messageList || !messageInput) {
      return;
    }

    const syncLatest = () => {
      requestAnimationFrame(() => {
        messageList.scrollTop = messageList.scrollHeight;
      });
    };

    const onFocus = () => syncLatest();
    const onInput = () => syncLatest();
    const onResize = () => {
      if (doc.activeElement === messageInput) {
        syncLatest();
      }
    };

    messageInput.addEventListener("focus", onFocus);
    messageInput.addEventListener("input", onInput);

    const frameWindow = doc.defaultView;
    frameWindow?.addEventListener("resize", onResize);
    frameWindow?.visualViewport?.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
      if (doc.activeElement === messageInput) {
        syncLatest();
      }
    });
    observer.observe(messageList, { childList: true });

    syncLatest();

    detachFrameVisibilitySync = () => {
      messageInput.removeEventListener("focus", onFocus);
      messageInput.removeEventListener("input", onInput);
      frameWindow?.removeEventListener("resize", onResize);
      frameWindow?.visualViewport?.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  };

  launcher.addEventListener("click", () => {
    if (panel.classList.contains("hidden")) {
      openPanel({ maximize: isDesktopViewport() });
      return;
    }

    closePanel();
  });

  closeButton.addEventListener("click", closePanel);

  if (apkLaterButton) {
    apkLaterButton.addEventListener("click", () => {
      const apkCard = shadow.querySelector(".widget-apk-card");
      if (apkCard) {
        apkCard.classList.add("hidden");
      }
    });
  }

  if (minimizeButton) {
    minimizeButton.addEventListener("click", () => {
      closePanel();
    });
  }

  if (maximizeButton) {
    maximizeButton.addEventListener("click", () => {
      if (panel.classList.contains("hidden")) {
        openPanel({ maximize: isDesktopViewport() });
        return;
      }

      setMaximized(!panel.classList.contains("maximized"));
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  window.addEventListener("liveteams:open-widget", () => {
    openPanel({ maximize: isDesktopViewport() });
  });

  frame?.addEventListener("load", bindFrameVisibilitySync);
  window.setTimeout(bindFrameVisibilitySync, 250);

  if (maximizeButton) {
    maximizeButton.innerHTML = "&#9723;";
    maximizeButton.setAttribute("aria-label", `Buka penuh ${title}`);
    maximizeButton.setAttribute("title", "Buka penuh");
  }

  const mountWidget = () => {
    document.body.appendChild(host);
  };

  if (document.body) {
    mountWidget();
  } else {
    document.addEventListener("DOMContentLoaded", mountWidget, { once: true });
  }
})();