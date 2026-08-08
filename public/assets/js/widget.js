(function () {
  const currentScript = document.currentScript;
  const rootUrl = currentScript?.dataset?.chatUrl || `${window.location.origin}/embed?livechat=1`;
  const title = currentScript?.dataset?.title || "Live Chat";
  const subtitle = currentScript?.dataset?.subtitle || "Online now";
  const apkUrl = String(currentScript?.dataset?.apkUrl || "").trim();
  const apkCardHiddenClass = apkUrl ? "" : " hidden";

  const host = document.createElement("div");
  host.className = "widget-root";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .widget-root { position: fixed; right: 1rem; bottom: 1rem; z-index: 2147483647; font-family: "Space Grotesk", "Segoe UI", sans-serif; }
      .widget-launcher { position: relative; min-width: 168px; height: 74px; border: 1px solid rgba(106, 162, 255, 0.4); border-radius: 999px; background: linear-gradient(120deg, #69adff 0%, #4f95ff 56%, #3879dd 100%); color: #f5f9ff; box-shadow: 0 16px 30px rgba(6, 16, 34, 0.46); display: inline-flex; align-items: center; justify-content: flex-start; gap: 0.8rem; cursor: pointer; transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease, opacity 140ms ease; padding: 0.85rem 1.2rem; overflow: hidden; font-size: 1.02rem; }
      .widget-launcher::before { content: ""; position: absolute; left: 22px; top: 50%; width: 14px; height: 14px; margin-top: -7px; border-radius: 999px; background: rgba(255, 255, 255, 0.92); box-shadow: 0 0 0 9px rgba(255, 255, 255, 0.16); }
      .widget-launcher:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 20px 40px rgba(12, 26, 11, 0.55); filter: brightness(1.04); }
      .widget-launcher-icon { display: none; }
      .widget-launcher svg { width: 18px; height: 18px; position: relative; top: -0.5px; }
      .widget-launcher-label { display: grid; line-height: 1.03; text-align: left; position: relative; z-index: 1; padding-left: 1.25rem; }
      .widget-launcher-label strong { font-size: 1rem; letter-spacing: 0.01em; font-weight: 800; }
      .widget-launcher-label span { font-size: 0.9rem; color: rgba(235, 245, 255, 0.92); font-weight: 700; }
      .widget-panel { position: fixed; right: 1rem; bottom: 1rem; width: min(336px, calc(100vw - 1.5rem)); height: min(700px, calc(100dvh - 2rem)); max-height: calc(100dvh - 2rem); border-radius: 22px; overflow: hidden; background: #081a34; border: 1px solid rgba(106, 162, 255, 0.28); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42); display: flex; flex-direction: column; }
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
      .widget-panel-options { border: 1px solid rgba(106, 162, 255, 0.25); border-radius: 999px; background: rgba(255, 255, 255, 0.08); color: #eef5ff; width: 34px; height: 34px; cursor: pointer; font-size: 1.15rem; line-height: 1; display: inline-flex; align-items: center; justify-content: center; }
      .widget-panel-options:hover { filter: brightness(1.06); }
      .widget-panel-close { border: 1px solid rgba(255, 159, 88, 0.24); border-radius: 999px; background: rgba(49, 31, 17, 0.95); color: #ffddc4; width: 34px; height: 34px; cursor: pointer; }
      .widget-frame { flex: 1 1 auto; width: 100%; border: 0; background: #081a34; }
      @keyframes widgetPulse { 0% { opacity: 0; transform: scale(0.98); } 22% { opacity: 1; } 100% { opacity: 0; transform: scale(1.1); } }
      @keyframes widgetShine { 0% { transform: translateX(-140%); } 48% { transform: translateX(150%); } 100% { transform: translateX(150%); } }
      @media (max-width: 520px) { .widget-root { right: 0.65rem; bottom: calc(3.4rem + env(safe-area-inset-bottom)); } .widget-panel { left: max(0.75rem, env(safe-area-inset-left)); right: max(0.75rem, env(safe-area-inset-right)); top: max(0px, env(safe-area-inset-top)); bottom: max(0.75rem, env(safe-area-inset-bottom)); width: auto; height: auto; max-height: none; } .widget-launcher { min-width: 122px; height: 48px; padding: 0.42rem 0.76rem; } .widget-launcher-icon { position: relative; top: -7px; } .widget-launcher-label { padding-left: 1rem; } .widget-launcher-label strong { font-size: 0.8rem; } .widget-launcher-label span { font-size: 0.8rem; } }
      @media (min-width: 640px) {
        .widget-panel.maximized {
          left: auto;
          right: 0;
          top: 0;
          bottom: 0;
          width: min(336px, calc(100vw - 1rem));
          height: auto;
          border-radius: 0 0 20px 20px;
          border-right: 1px solid rgba(106, 162, 255, 0.28);
        }
      }
    </style>
    <div class="widget-root">
      <button class="widget-launcher" type="button" aria-label="Buka ${title}">
        <span class="widget-launcher-label">
          <strong>Live Chat</strong>
          <span>Online now</span>
        </span>
      </button>
      <div class="widget-panel hidden" role="dialog" aria-label="${title}">        <div class="widget-apk-card${apkCardHiddenClass}">
          <div class="widget-apk-card-title">
            <strong>Unduh Aplikasi Android</strong>
            <span class="widget-apk-pill">Lebih cepat & offline ready</span>
          </div>
          <p class="widget-apk-card-subtitle">Pasang JIELive di ponsel untuk akses chat cepat tanpa buka browser berulang.</p>
          <div class="widget-apk-card-actions">
            <a class="widget-apk-button" href="${apkUrl}" target="_blank" rel="noopener noreferrer" aria-label="Download APK JIELive">Download APK</a>
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
            <button class="widget-panel-options" type="button" aria-label="Options" title="Options">⋯</button>
            <button class="widget-panel-close" type="button" aria-label="Tutup ${title}">✕</button>
          </div>
        </div>
        <iframe class="widget-frame" src="${rootUrl}${rootUrl.includes("?") ? "&" : "?"}embed=1&livechat=1" title="${title}" loading="lazy" allow="clipboard-write"></iframe>
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
  const optionsButton = shadow.querySelector(".widget-panel-options");
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

  window.addEventListener("message", (event) => {
    if (event?.data?.type === "liveteams:widget-close") {
      closePanel();
      return;
    }

    if (event?.data?.type === "liveteams:widget-minimize") {
      closePanel();
      return;
    }

    if (event?.data?.type === "liveteams:widget-maximize") {
      if (panel.classList.contains("hidden")) {
        openPanel({ maximize: true });
        return;
      }

      setMaximized(true);
    }
  });

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

    const frameSrc = String(frame.getAttribute("src") || "");
    const isLiveChatEmbedFrame = /(?:\?|&)livechat=1(?:&|$)/i.test(frameSrc);

    const syncLatest = () => {
      requestAnimationFrame(() => {
        messageList.scrollTop = messageList.scrollHeight;
      });
    };

    const syncTop = () => {
      requestAnimationFrame(() => {
        messageList.scrollTop = 0;
      });
    };

    const onFocus = () => {
      if (!isLiveChatEmbedFrame) {
        syncLatest();
      }
    };
    const onInput = () => {
      if (!isLiveChatEmbedFrame) {
        syncLatest();
      }
    };
    const onResize = () => {
      if (!isLiveChatEmbedFrame && doc.activeElement === messageInput) {
        syncLatest();
      }
    };

    messageInput.addEventListener("focus", onFocus);
    messageInput.addEventListener("input", onInput);

    const frameWindow = doc.defaultView;
    frameWindow?.addEventListener("resize", onResize);
    frameWindow?.visualViewport?.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
      if (!isLiveChatEmbedFrame && doc.activeElement === messageInput) {
        syncLatest();
      }
    });
    observer.observe(messageList, { childList: true });

    if (isLiveChatEmbedFrame) {
      syncTop();
    } else {
      syncLatest();
    }

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
      openPanel();
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
        openPanel();
        return;
      }

      setMaximized(!panel.classList.contains("maximized"));
    });
  }

  if (optionsButton) {
    optionsButton.addEventListener("click", () => {
      optionsButton.blur();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  window.addEventListener("liveteams:open-widget", () => {
    openPanel();
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