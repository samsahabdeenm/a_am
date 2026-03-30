(function (window, document) {
  "use strict";

  var NODE_ID = "1003";

  function ready(callback) {
    if (window.Puravi && typeof window.Puravi.onReady === "function") {
      window.Puravi.onReady(callback);
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function init() {
    if (!document.body || document.body.getAttribute("data-node") !== NODE_ID) {
      return;
    }

    Array.prototype.slice.call(document.querySelectorAll(".policy-card")).forEach(function (element, index) {
      element.style.setProperty("--puravi-animate-delay", ((index + 1) * 60) + "ms");
    });
  }

  ready(init);
})(window, document);

