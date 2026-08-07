const buildInboxQueryString = ({ tenantCode = "", widgetId = "", limit = 80 } = {}) => {
  const params = [];

  if (tenantCode) {
    params.push(`tenantCode=${encodeURIComponent(String(tenantCode))}`);
  }

  if (widgetId) {
    params.push(`widgetId=${encodeURIComponent(String(widgetId))}`);
  }

  if (limit != null) {
    params.push(`limit=${encodeURIComponent(String(limit))}`);
  }

  return params.length ? `?${params.join("&")}` : "";
};

module.exports = {
  buildInboxQueryString
};
