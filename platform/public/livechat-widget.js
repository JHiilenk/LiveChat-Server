(function () {
  const currentScript = document.currentScript;
  const loader = document.createElement("script");
  loader.src = new URL("/widget.js", window.location.origin).toString();
  loader.defer = true;

  if (currentScript?.dataset) {
    Object.entries(currentScript.dataset).forEach(([key, value]) => {
      if (typeof value === "string") {
        loader.dataset[key] = value;
      }
    });
  }

  if (document.head) {
    document.head.appendChild(loader);
  } else {
    document.documentElement.appendChild(loader);
  }
})();