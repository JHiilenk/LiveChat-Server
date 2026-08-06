(function () {
  const currentScript = document.currentScript;
  const loginUrl = currentScript?.dataset?.loginUrl || "/login";
  const registerUrl = currentScript?.dataset?.registerUrl || "/daftar";
  const title = currentScript?.dataset?.title || "Join Group";
  const subtitle = currentScript?.dataset?.subtitle || "Login atau daftar";

  const host = document.createElement("div");
  host.className = "group-widget-host";

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .group-widget-root {
        position: fixed;
        right: 1rem;
        bottom: 6.15rem;
        z-index: 2147483646;
        font-family: "Space Grotesk", "Segoe UI", sans-serif;
      }
      .group-launcher {
        position: relative;
        min-width: 168px;
        height: 56px;
        border: 1px solid rgba(255, 214, 122, 0.5);
        border-radius: 999px;
        background: linear-gradient(120deg, #f8d153 0%, #f2a63b 52%, #e07c21 100%);
        color: #1f2937;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.62rem;
        padding: 0.58rem 0.9rem;
        box-shadow: 0 16px 34px rgba(20, 12, 2, 0.34);
        cursor: pointer;
        transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
        overflow: hidden;
      }
      .group-launcher:hover {
        transform: translateY(-1px) scale(1.01);
        box-shadow: 0 18px 36px rgba(20, 12, 2, 0.38);
        filter: brightness(1.02);
      }
      .group-launcher::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.32) 52%, rgba(255,255,255,0) 72%);
        transform: translateX(-140%);
        animation: groupShine 3s ease-in-out infinite;
        pointer-events: none;
      }
      .group-launcher-badge {
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.38);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.98rem;
        font-weight: 800;
        animation: groupPulse 1.8s ease-in-out infinite;
      }
      .group-launcher-copy {
        display: grid;
        line-height: 1.02;
        text-align: left;
      }
      .group-launcher-copy strong {
        font-size: 0.96rem;
        font-weight: 900;
        letter-spacing: 0.01em;
      }
      .group-launcher-copy span {
        font-size: 0.78rem;
        color: rgba(36, 25, 9, 0.86);
        font-weight: 700;
      }
      .group-panel {
        position: absolute;
        right: 0;
        bottom: calc(100% + 0.62rem);
        width: min(254px, calc(100vw - 2rem));
        border-radius: 1rem;
        padding: 0.8rem;
        background: linear-gradient(180deg, rgba(14, 24, 44, 0.98), rgba(12, 17, 32, 0.98));
        border: 1px solid rgba(118, 168, 255, 0.32);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.34);
        display: grid;
        gap: 0.65rem;
      }
      .group-panel.hidden {
        display: none;
      }
      .group-panel-title {
        margin: 0;
        font-size: 0.95rem;
        color: #f3f7ff;
        font-weight: 800;
      }
      .group-panel-subtitle {
        margin: 0;
        font-size: 0.79rem;
        color: #b8c6e2;
        line-height: 1.45;
      }
      .group-panel-actions {
        display: grid;
        gap: 0.45rem;
      }
      .group-panel-link {
        min-height: 2.35rem;
        border-radius: 0.74rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 0.84rem;
        font-weight: 800;
        transition: transform 140ms ease, filter 140ms ease;
      }
      .group-panel-link:hover {
        transform: translateY(-1px);
        filter: brightness(1.03);
      }
      .group-panel-link.primary {
        background: linear-gradient(100deg, #69adff 0%, #3f82e4 100%);
        color: #f6fbff;
      }
      .group-panel-link.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #eef4ff;
        border: 1px solid rgba(197, 217, 255, 0.3);
      }
      @keyframes groupPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      @keyframes groupShine {
        0% { transform: translateX(-140%); }
        46% { transform: translateX(145%); }
        100% { transform: translateX(145%); }
      }
      @media (max-width: 520px) {
        .group-widget-root {
          right: 0.65rem;
          bottom: calc(7.05rem + env(safe-area-inset-bottom));
        }
        .group-launcher {
          min-width: 142px;
          height: 48px;
          padding: 0.46rem 0.78rem;
        }
        .group-launcher-badge {
          width: 30px;
          height: 30px;
        }
        .group-launcher-copy strong {
          font-size: 0.88rem;
        }
        .group-launcher-copy span {
          font-size: 0.75rem;
        }
      }
    </style>
    <div class="group-widget-root">
      <button class="group-launcher" type="button" aria-label="Buka ${title}">
        <span class="group-launcher-badge" aria-hidden="true">◉</span>
        <span class="group-launcher-copy">
          <strong>${title}</strong>
          <span>${subtitle}</span>
        </span>
      </button>
      <div class="group-panel hidden" role="dialog" aria-label="${title}">
        <p class="group-panel-title">Masuk Ke Grup</p>
        <p class="group-panel-subtitle">Pilih login jika sudah punya akun, atau daftar gratis untuk gabung komunitas.</p>
        <div class="group-panel-actions">
          <a class="group-panel-link primary" href="${loginUrl}">Login Member</a>
          <a class="group-panel-link secondary" href="${registerUrl}">Daftar Member Baru</a>
        </div>
      </div>
    </div>
  `;

  const root = shadow.querySelector(".group-widget-root");
  const launcher = shadow.querySelector(".group-launcher");
  const panel = shadow.querySelector(".group-panel");

  const closePanel = () => {
    panel?.classList.add("hidden");
  };

  const openPanel = () => {
    panel?.classList.remove("hidden");
  };

  launcher?.addEventListener("click", () => {
    if (panel?.classList.contains("hidden")) {
      openPanel();
      return;
    }

    closePanel();
  });

  window.addEventListener("pointerdown", (event) => {
    if (!panel || panel.classList.contains("hidden")) {
      return;
    }

    const path = event.composedPath();
    if (path.includes(host) || path.includes(root)) {
      return;
    }

    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
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
