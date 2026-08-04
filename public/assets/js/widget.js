(function () {
  const currentScript = document.currentScript;
  const rootUrl = currentScript?.dataset?.chatUrl || "https://jeetalk.onrender.com/embed";
  const title = currentScript?.dataset?.title || "Live Chat";
  const subtitle = currentScript?.dataset?.subtitle || "Klik untuk buka popup chat";

  const host = document.createElement("div");
  host.className = "widget-root";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .widget-root { position: fixed; right: 1rem; bottom: 1.15rem; z-index: 2147483647; font-family: "Space Grotesk", "Segoe UI", sans-serif; }
      .widget-launcher { position: relative; min-width: 138px; height: 56px; border: 1px solid rgba(137, 235, 94, 0.55); border-radius: 999px; background: linear-gradient(120deg, #a4fb66 0%, #6ddd52 45%, #5fcb4d 100%); color: #081208; box-shadow: 0 16px 30px rgba(12, 26, 11, 0.42); display: inline-flex; align-items: center; justify-content: flex-start; gap: 0.52rem; cursor: pointer; transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease, opacity 140ms ease; padding: 0.52rem 0.95rem; overflow: hidden; }
      .widget-launcher::before { content: ""; position: absolute; inset: -2px; border-radius: inherit; border: 2px solid rgba(146, 240, 106, 0.35); transform: scale(0.98); opacity: 0; animation: widgetPulse 2.1s ease-out infinite; pointer-events: none; }
      .widget-launcher::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.24) 52%, rgba(255,255,255,0) 72%); transform: translateX(-140%); animation: widgetShine 3s ease-in-out infinite; pointer-events: none; }
      .widget-launcher:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 18px 34px rgba(12, 26, 11, 0.5); filter: brightness(1.03); }
      .widget-launcher-icon { width: 30px; height: 30px; border-radius: 999px; background: rgba(8, 18, 9, 0.16); display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; position: relative; top: -5px; }
      .widget-launcher svg { width: 18px; height: 18px; position: relative; top: -0.5px; }
      .widget-launcher-label { display: grid; line-height: 1.05; text-align: left; position: relative; z-index: 1; }
      .widget-launcher-label strong { font-size: 0.93rem; letter-spacing: 0.01em; font-weight: 800; }
      .widget-launcher-label span { font-size: 0.68rem; color: rgba(10, 22, 10, 0.78); font-weight: 700; }
      .widget-panel { position: fixed; right: 1rem; bottom: 5.1rem; width: min(420px, calc(100vw - 1.5rem)); height: min(640px, calc(100dvh - 6.4rem)); max-height: calc(100dvh - 6.4rem); border-radius: 22px; overflow: hidden; background: #061008; border: 1px solid rgba(137, 235, 94, 0.28); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42); display: flex; flex-direction: column; }
      .widget-panel.hidden { display: none; }
      .widget-root.widget-open .widget-launcher { opacity: 0; pointer-events: none; }
      .widget-panel.maximized { position: fixed; inset: 0; width: auto; height: auto; border-radius: 0; }
      .widget-panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 0.9rem; background: linear-gradient(180deg, rgba(14, 34, 19, 0.98) 0%, rgba(8, 22, 12, 0.98) 100%); border-bottom: 1px solid rgba(137, 235, 94, 0.18); }
      .widget-panel-title { display: grid; gap: 0.1rem; }
      .widget-panel-title strong { font-size: 0.95rem; letter-spacing: 0.02em; color: #eff7e1; }
      .widget-panel-title span { font-size: 0.72rem; color: #92a78e; }
      .widget-panel-actions { display: inline-flex; align-items: center; gap: 0.38rem; }
      .widget-panel-action { border: 1px solid rgba(137, 235, 94, 0.2); border-radius: 999px; background: rgba(8, 20, 11, 0.95); color: #eef7e4; width: 34px; height: 34px; cursor: pointer; font-size: 0.95rem; line-height: 1; display: inline-flex; align-items: center; justify-content: center; }
      .widget-panel-action:hover { filter: brightness(1.08); }
      .widget-panel-close { border: 1px solid rgba(137, 235, 94, 0.18); border-radius: 999px; background: rgba(8, 20, 11, 0.95); color: #eef7e4; width: 34px; height: 34px; cursor: pointer; }
      .widget-frame { flex: 1 1 auto; width: 100%; border: 0; background: #061008; }
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
          border-right: 1px solid rgba(137, 235, 94, 0.28);
        }
      }
    </style>
    <div class="widget-root">
      <button class="widget-launcher" type="button" aria-label="Buka ${title}">
        <span class="widget-launcher-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4.5 5.75C4.5 4.23122 5.73122 3 7.25 3H16.75C18.2688 3 19.5 4.23122 19.5 5.75V13.25C19.5 14.7688 18.2688 16 16.75 16H10.7L6.45 19.2C6.08 19.48 5.5 19.22 5.5 18.76V16H7.25C5.73122 16 4.5 14.7688 4.5 13.25V5.75Z" fill="currentColor"/>
            <path d="M8 8.25H16" stroke="#081208" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M8 11.25H13.5" stroke="#081208" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="widget-launcher-label">
          <strong>Live Chat</strong>
          <span>Online now</span>
        </span>
      </button>
      <div class="widget-panel hidden" role="dialog" aria-label="${title}">
        <div class="widget-panel-header">
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

  window.addEventListener("jeetalk:open-widget", () => {
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