/*!
 * Puravi Lazy Utilities
 * Reusable lazy loading and visibility helpers for images, media, and animation targets.
 */
(function (window, document) {
  "use strict";

  if (!window || !document) {
    return;
  }

  var DEFAULTS = {
    root: null,
    rootMargin: "0px 0px 120px 0px",
    threshold: 0.01,
    loadedClass: "is-lazy-loaded",
    loadingClass: "is-lazy-loading",
    revealedClass: "is-visible",
    lazySelector: "[data-lazy-src], [data-lazy-srcset], [data-lazy-bg], [data-lazy-load]",
    animationSelector: "[data-lazy-animate], [data-animate], .animate-card, .animate-on-view"
  };

  var supportsObserver = "IntersectionObserver" in window && "IntersectionObserverEntry" in window;
  var supportsRAF = typeof window.requestAnimationFrame === "function";
  var slice = Array.prototype.slice;
  var fallbackItems = [];
  var fallbackBound = false;
  var fallbackTicking = false;
  var activeObservers = [];

  function merge() {
    var output = {};
    var index;
    var source;
    var key;

    for (index = 0; index < arguments.length; index += 1) {
      source = arguments[index] || {};

      for (key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          output[key] = source[key];
        }
      }
    }

    return output;
  }

  function toArray(value) {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.slice();
    }

    if (typeof value.length === "number" && typeof value !== "string") {
      return slice.call(value);
    }

    return [value];
  }

  function select(target) {
    if (!target) {
      return [];
    }

    if (typeof target === "string") {
      return toArray(document.querySelectorAll(target));
    }

    return toArray(target);
  }

  function isIntersectionVisible(entry) {
    return !!(entry && (entry.isIntersecting || entry.intersectionRatio > 0));
  }

  function getBooleanAttribute(element, name, fallbackValue) {
    var rawValue = element.getAttribute(name);

    if (rawValue === null) {
      return fallbackValue;
    }

    return rawValue !== "false";
  }

  function setState(element, value) {
    element.setAttribute("data-lazy-state", value);
  }

  function dispatch(name, element, detail) {
    var event;

    if (typeof window.CustomEvent === "function") {
      event = new CustomEvent("puravi:" + name, {
        bubbles: true,
        detail: detail || {}
      });
    } else {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("puravi:" + name, true, false, detail || {});
    }

    element.dispatchEvent(event);
  }

  function applyClassTokens(element, tokens) {
    var className = tokens || element.getAttribute("data-lazy-class");

    if (!className) {
      return;
    }

    className.split(/\s+/).forEach(function (token) {
      if (token) {
        element.classList.add(token);
      }
    });
  }

  function markLoaded(element, options) {
    element.classList.remove(options.loadingClass);
    element.classList.add(options.loadedClass);
    element.setAttribute("data-lazy-loaded", "true");
    setState(element, "loaded");
    applyClassTokens(element);
    dispatch("lazyloaded", element, { element: element });
  }

  function markError(element, options) {
    element.classList.remove(options.loadingClass);
    element.classList.add("has-lazy-error");
    setState(element, "error");
    dispatch("lazyerror", element, { element: element });
  }

  function setBackgroundImage(element, value) {
    if (!value) {
      return false;
    }

    element.style.backgroundImage = "url(\"" + value + "\")";
    return true;
  }

  function applySourceAttributes(element) {
    var applied = false;
    var src = element.getAttribute("data-lazy-src");
    var srcset = element.getAttribute("data-lazy-srcset");
    var sizes = element.getAttribute("data-lazy-sizes");
    var background = element.getAttribute("data-lazy-bg");

    if (src) {
      element.setAttribute("src", src);
      applied = true;
    }

    if (srcset) {
      element.setAttribute("srcset", srcset);
      applied = true;
    }

    if (sizes) {
      element.setAttribute("sizes", sizes);
      applied = true;
    }

    if (background) {
      applied = setBackgroundImage(element, background) || applied;
    }

    return applied;
  }

  function finalizeLoad(element, options) {
    if (element.getAttribute("data-lazy-loaded") === "true") {
      return;
    }

    markLoaded(element, options);
  }

  function loadElement(element, options) {
    var tagName;
    var completed = false;
    var handleLoad;
    var handleError;

    if (!element || element.getAttribute("data-lazy-loaded") === "true") {
      return element;
    }

    element.classList.add(options.loadingClass);
    setState(element, "loading");

    if (!applySourceAttributes(element)) {
      finalizeLoad(element, options);
      return element;
    }

    tagName = (element.tagName || "").toUpperCase();

    if (tagName === "IMG" || tagName === "IFRAME") {
      handleLoad = function () {
        if (completed) {
          return;
        }

        completed = true;
        element.removeEventListener("load", handleLoad);
        element.removeEventListener("error", handleError);
        finalizeLoad(element, options);
      };

      handleError = function () {
        if (completed) {
          return;
        }

        completed = true;
        element.removeEventListener("load", handleLoad);
        element.removeEventListener("error", handleError);
        markError(element, options);
      };

      element.addEventListener("load", handleLoad);
      element.addEventListener("error", handleError);

      if (tagName === "IMG" && element.complete) {
        finalizeLoad(element, options);
      }
    } else {
      finalizeLoad(element, options);
    }

    return element;
  }

  function revealElement(element, options) {
    var once = getBooleanAttribute(element, "data-animate-once", true);
    var revealClass = element.getAttribute("data-animate-class") || options.revealedClass;
    var delay = element.getAttribute("data-animate-delay");

    if (!element || (once && element.getAttribute("data-animate-complete") === "true")) {
      return element;
    }

    if (delay) {
      element.style.setProperty("--puravi-animate-delay", delay);
    }

    applyClassTokens(element, revealClass);
    element.setAttribute("data-animate-complete", "true");
    dispatch("reveal", element, { element: element });
    return element;
  }

  function getFallbackMargin(options, element) {
    var margin = element.getAttribute("data-lazy-margin") || options.rootMargin || "0px";
    var parts = margin.trim().split(/\s+/);
    var lastValue = parts[parts.length - 1] || "0";
    var numericValue = parseInt(lastValue, 10);

    return isNaN(numericValue) ? 0 : numericValue;
  }

  function isInViewport(element, margin) {
    var rect;
    var viewportHeight;
    var viewportWidth;

    if (!element || !element.getBoundingClientRect) {
      return false;
    }

    rect = element.getBoundingClientRect();
    viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.bottom >= -margin &&
      rect.top <= viewportHeight + margin &&
      rect.right >= -margin &&
      rect.left <= viewportWidth + margin
    );
  }

  function bindFallback() {
    if (fallbackBound) {
      return;
    }

    fallbackBound = true;
    window.addEventListener("scroll", queueFallbackCheck);
    window.addEventListener("resize", queueFallbackCheck);
    window.addEventListener("orientationchange", queueFallbackCheck);
  }

  function queueFallbackCheck() {
    if (fallbackTicking) {
      return;
    }

    fallbackTicking = true;

    if (supportsRAF) {
      window.requestAnimationFrame(runFallback);
      return;
    }

    window.setTimeout(runFallback, 16);
  }

  function runFallback() {
    var remaining = [];

    fallbackTicking = false;

    fallbackItems.forEach(function (item) {
      var margin = getFallbackMargin(item.options, item.element);
      var once = getBooleanAttribute(item.element, item.options.onceAttribute, true);

      if (isInViewport(item.element, margin)) {
        item.handler(item.element, item.options);

        if (!once) {
          remaining.push(item);
        }
      } else {
        remaining.push(item);
      }
    });

    fallbackItems = remaining;
  }

  function addFallbackItem(element, handler, options) {
    fallbackItems.push({
      element: element,
      handler: handler,
      options: options
    });

    bindFallback();
    queueFallbackCheck();
  }

  function disconnectObserver(observer) {
    if (!observer) {
      return;
    }

    observer.disconnect();
    activeObservers = activeObservers.filter(function (item) {
      return item !== observer;
    });
  }

  function createObserver(callback, options) {
    var observer;

    if (!supportsObserver) {
      return null;
    }

    observer = new IntersectionObserver(function (entries, instance) {
      entries.forEach(function (entry) {
        if (!isIntersectionVisible(entry)) {
          return;
        }

        callback(entry.target, options, entry, instance);

        if (getBooleanAttribute(entry.target, options.onceAttribute, true)) {
          instance.unobserve(entry.target);
        }
      });
    }, {
      root: options.root,
      rootMargin: options.rootMargin,
      threshold: options.threshold
    });

    activeObservers.push(observer);
    return observer;
  }

  function observe(targets, handler, userOptions) {
    var options = merge(DEFAULTS, {
      onceAttribute: "data-lazy-once"
    }, userOptions);
    var elements = select(targets);
    var observer = createObserver(handler, options);
    var trackedElements = [];

    elements.forEach(function (element) {
      if (!element) {
        return;
      }

      trackedElements.push(element);

      if (observer) {
        observer.observe(element);
      } else {
        addFallbackItem(element, handler, options);
      }
    });

    return {
      observer: observer,
      disconnect: function () {
        if (observer) {
          disconnectObserver(observer);
          return;
        }

        fallbackItems = fallbackItems.filter(function (item) {
          return trackedElements.indexOf(item.element) === -1;
        });
      }
    };
  }

  function observeLazy(targets, options) {
    return observe(targets || DEFAULTS.lazySelector, function (element, localOptions) {
      loadElement(element, localOptions);
    }, merge({
      onceAttribute: "data-lazy-once"
    }, options));
  }

  function observeAnimations(targets, options) {
    return observe(targets || DEFAULTS.animationSelector, function (element, localOptions) {
      revealElement(element, localOptions);
    }, merge({
      onceAttribute: "data-animate-once"
    }, options));
  }

  function loadNow(targets, options) {
    var localOptions = merge(DEFAULTS, options);
    return select(targets).map(function (element) {
      return loadElement(element, localOptions);
    });
  }

  function revealNow(targets, options) {
    var localOptions = merge(DEFAULTS, options);
    return select(targets).map(function (element) {
      return revealElement(element, localOptions);
    });
  }

  function init(options) {
    var settings = merge(DEFAULTS, options);
    var lazyController = observeLazy(settings.lazySelector, settings);
    var animationController = observeAnimations(settings.animationSelector, settings);

    return {
      lazyController: lazyController,
      animationController: animationController,
      refresh: refresh,
      destroy: function () {
        if (lazyController) {
          lazyController.disconnect();
        }

        if (animationController) {
          animationController.disconnect();
        }
      }
    };
  }

  function refresh() {
    if (!supportsObserver) {
      queueFallbackCheck();
    }
  }

  function destroy() {
    activeObservers.slice().forEach(disconnectObserver);
    fallbackItems = [];

    if (fallbackBound) {
      window.removeEventListener("scroll", queueFallbackCheck);
      window.removeEventListener("resize", queueFallbackCheck);
      window.removeEventListener("orientationchange", queueFallbackCheck);
      fallbackBound = false;
    }
  }

  window.PuraviLazy = {
    version: "1.0.0",
    defaults: merge({}, DEFAULTS),
    selectors: {
      lazy: DEFAULTS.lazySelector,
      animation: DEFAULTS.animationSelector
    },
    init: init,
    observe: observe,
    observeLazy: observeLazy,
    observeAnimations: observeAnimations,
    load: loadNow,
    reveal: revealNow,
    refresh: refresh,
    destroy: destroy,
    isInViewport: isInViewport
  };
})(window, document);
