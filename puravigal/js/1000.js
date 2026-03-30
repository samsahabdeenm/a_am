(function (window, document) {
  "use strict";

  var NODE_ID = "1000";

  function onReady(callback) {
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

  function applySequence(selector) {
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (element, index) {
      element.style.setProperty("--puravi-animate-delay", ((index + 1) * 90) + "ms");
    });
  }

  function init() {
    if (!document.body || document.body.getAttribute("data-node") !== NODE_ID) {
      return;
    }

    document.body.classList.add("node-1000-ready");
    applySequence("[data-home-sequence]");
  }

  onReady(init);
})(window, document);

