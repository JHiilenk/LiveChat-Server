const path = require("path");
const fs = require("fs");
const express = require("express");

const registerPublicSiteRoutes = ({
  app,
  projectRoot,
  publicBaseUrl,
  appName = "Jeetalk",
  appDescription = "Server live chat realtime untuk banyak client."
}) => {
  const publicDirectory = path.join(projectRoot, "public");
  const pageDirectory = path.join(publicDirectory, "pages");
  const assetDirectory = path.join(publicDirectory, "assets");

  const indexTemplatePath = path.join(pageDirectory, "index.html");
  const indexTemplate = fs.readFileSync(indexTemplatePath, "utf8");

  const buildSeoJsonLd = ({ title, description, canonicalUrl, schemas = [] }) => JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: appName,
        description,
        applicationCategory: "CommunicationApplication",
        operatingSystem: "Web",
        url: canonicalUrl,
        inLanguage: "id-ID",
        publisher: {
          "@type": "Organization",
          name: appName,
          url: publicBaseUrl
        }
      },
      ...schemas
    ]
  });

  const renderSeoPage = (res, meta, options = {}) => {
    const title = String(meta.title || `${appName} Live Chat`);
    const description = String(meta.description || appDescription);
    const canonicalUrl = String(meta.canonicalUrl || publicBaseUrl);
    const robots = String(meta.robots || "index,follow");
    const ogImage = String(meta.ogImage || `${publicBaseUrl}/social-preview.svg`);
    const bodyClass = String(meta.bodyClass || "route-app");
    const schemas = Array.isArray(meta.schemas) ? meta.schemas : [];
    const html = indexTemplate
      .replaceAll("__SEO_TITLE__", title)
      .replaceAll("__SEO_DESCRIPTION__", description)
      .replaceAll("__SEO_ROBOTS__", robots)
      .replaceAll("__SEO_CANONICAL__", canonicalUrl)
      .replaceAll("__SEO_OG_TITLE__", title)
      .replaceAll("__SEO_OG_DESCRIPTION__", description)
      .replaceAll("__SEO_OG_IMAGE__", ogImage)
      .replaceAll("__SEO_BODY_CLASS__", bodyClass)
      .replaceAll("__DEFAULT_TEAM_CODE__", process.env.DEFAULT_TEAM_CODE || "LOBBY")
      .replaceAll("__DEFAULT_CHANNEL_CODE__", process.env.DEFAULT_CHANNEL_CODE || "GENERAL")
      .replace("__SEO_JSON_LD__", buildSeoJsonLd({ title, description, canonicalUrl, schemas }));

    if (options.allowEmbed) {
      res.removeHeader("X-Frame-Options");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    }

    res.type("html");
    res.send(html);
  };

  app.use(express.static(publicDirectory, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(`${path.sep}widget.js`)) {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
      }
    }
  }));

  app.get("/app.js", (_req, res) => {
    res.type("application/javascript");
    res.sendFile(path.join(assetDirectory, "js", "app.js"));
  });

  app.get("/styles.css", (_req, res) => {
    res.type("text/css");
    res.sendFile(path.join(assetDirectory, "css", "styles.css"));
  });

  app.get("/widget.js", (_req, res) => {
    res.type("application/javascript");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.sendFile(path.join(assetDirectory, "js", "widget.js"));
  });

  app.get("/embed", (_req, res) => {
    renderSeoPage(res, {
      title: `${appName} Embed | Live Chat Widget`,
      description: `${appName} widget live chat untuk integrasi realtime chat di situs web.`,
      canonicalUrl: `${publicBaseUrl}/embed`,
      robots: "noindex,nofollow",
      bodyClass: "route-embed"
    }, { allowEmbed: true });
  });

  app.get(["/", "/index.html"], (_req, res) => {
    renderSeoPage(res, {
      title: `${appName} | Live Chat Server`,
      description: appDescription,
      canonicalUrl: `${publicBaseUrl}/`,
      bodyClass: "route-app",
      schemas: [
        {
          "@type": "Organization",
          name: appName,
          url: publicBaseUrl,
          logo: `${publicBaseUrl}/favicon.svg`,
          sameAs: [publicBaseUrl]
        },
      ]
    });
  });

  app.get(["/app", "/app/"], (_req, res) => {
    renderSeoPage(res, {
      title: `${appName} App | Dashboard Live Chat`,
      description: appDescription,
      canonicalUrl: `${publicBaseUrl}/app`,
      robots: "noindex,nofollow",
      bodyClass: "route-app"
    });
  });

  app.get(["/admin", "/admin/login", "/admin/panel", "/admin/dashboard"], (_req, res) => {
    renderSeoPage(res, {
      title: `${appName} Admin Panel`,
      description: `${appName} admin panel untuk pengaturan live chat, role, dan manajemen aplikasi.`,
      canonicalUrl: `${publicBaseUrl}/admin`,
      robots: "noindex,nofollow",
      bodyClass: "portal-admin"
    });
  });

  app.get(["/daftar", "/daftar/"], (_req, res) => {
    renderSeoPage(res, {
      title: `Daftar Member ${appName}`,
      description: `Daftar akun member baru di ${appName} untuk masuk ke live chat komunitas dengan team dan channel yang dipilih.`,
      canonicalUrl: `${publicBaseUrl}/daftar`,
      bodyClass: "portal-registration"
    });
  });

  app.get(["/login", "/login/"], (_req, res) => {
    renderSeoPage(res, {
      title: `Login Member ${appName}`,
      description: `Masuk ke akun member ${appName} untuk bergabung ke live chat realtime, team, channel, dan percakapan komunitas.`,
      canonicalUrl: `${publicBaseUrl}/login`,
      bodyClass: "portal-login"
    });
  });
};

module.exports = {
  registerPublicSiteRoutes
};
