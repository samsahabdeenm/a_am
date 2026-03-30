/*!
 * Puravi Common Utilities
 * Global reusable helpers, scroll handling, sticky header behavior, and site-wide bootstrap.
 */
(function (window, document) {
  "use strict";

  if (!window || !document) {
    return;
  }

  var docElement = document.documentElement;
  var DEFAULTS = {
    stickySelector: "[data-sticky-header], .js-sticky-header, .site-header",
    stickyOffset: 24,
    animationSelector: "[data-animate], [data-lazy-animate], .animate-card, .animate-on-view",
    lazySelector: "[data-lazy-src], [data-lazy-srcset], [data-lazy-bg], [data-lazy-load]",
    navToggleSelector: "[data-nav-toggle]",
    navPanelSelector: "[data-nav-panel]",
    dropdownSelector: "[data-dropdown]",
    dropdownToggleSelector: "[data-dropdown-toggle]",
    dropdownMenuSelector: "[data-dropdown-menu]",
    navLinkSelector: "[data-nav-link], [data-footer-link]",
    formRootSelector: "[data-puravi-form], .puravi-form-contact, .puravi-form-signup, .puravi-form-demo, .puravi-form-callback, .form-contact, .form-signup, .form-demo, .form-callback",
    resizeDebounce: 120
  };

  var COUNTRY_ROWS = [
    ["Algeria", "DZ", "+213"], ["Argentina", "AR", "+54"],
    ["Australia", "AU", "+61"], ["Austria", "AT", "+43"],
    ["Bahrain", "BH", "+973"], ["Bangladesh", "BD", "+880"],
    ["Belgium", "BE", "+32"], ["Bhutan", "BT", "+975"],
    ["Brazil", "BR", "+55"], ["Brunei", "BN", "+673"],
    ["Bulgaria", "BG", "+359"], ["Cambodia", "KH", "+855"],
    ["Canada", "CA", "+1"], ["Chile", "CL", "+56"],
    ["China", "CN", "+86"], ["Colombia", "CO", "+57"],
    ["Croatia", "HR", "+385"], ["Cyprus", "CY", "+357"],
    ["Czech Republic", "CZ", "+420"], ["Denmark", "DK", "+45"],
    ["Egypt", "EG", "+20"], ["Estonia", "EE", "+372"],
    ["Ethiopia", "ET", "+251"], ["Finland", "FI", "+358"],
    ["France", "FR", "+33"], ["Germany", "DE", "+49"],
    ["Ghana", "GH", "+233"], ["Greece", "GR", "+30"],
    ["Hong Kong", "HK", "+852"], ["Hungary", "HU", "+36"],
    ["Iceland", "IS", "+354"], ["India", "IN", "+91"],
    ["Indonesia", "ID", "+62"], ["Iran", "IR", "+98"],
    ["Iraq", "IQ", "+964"], ["Ireland", "IE", "+353"],
    ["Israel", "IL", "+972"], ["Italy", "IT", "+39"],
    ["Japan", "JP", "+81"], ["Jordan", "JO", "+962"],
    ["Kenya", "KE", "+254"], ["Kuwait", "KW", "+965"],
    ["Laos", "LA", "+856"], ["Latvia", "LV", "+371"],
    ["Lebanon", "LB", "+961"], ["Lithuania", "LT", "+370"],
    ["Luxembourg", "LU", "+352"], ["Malaysia", "MY", "+60"],
    ["Maldives", "MV", "+960"], ["Malta", "MT", "+356"],
    ["Mexico", "MX", "+52"], ["Mongolia", "MN", "+976"],
    ["Morocco", "MA", "+212"], ["Myanmar", "MM", "+95"],
    ["Nepal", "NP", "+977"], ["Netherlands", "NL", "+31"],
    ["New Zealand", "NZ", "+64"], ["Nigeria", "NG", "+234"],
    ["Norway", "NO", "+47"], ["Oman", "OM", "+968"],
    ["Pakistan", "PK", "+92"], ["Peru", "PE", "+51"],
    ["Philippines", "PH", "+63"], ["Poland", "PL", "+48"],
    ["Portugal", "PT", "+351"], ["Qatar", "QA", "+974"],
    ["Romania", "RO", "+40"], ["Saudi Arabia", "SA", "+966"],
    ["Serbia", "RS", "+381"], ["Singapore", "SG", "+65"],
    ["Slovakia", "SK", "+421"], ["Slovenia", "SI", "+386"],
    ["South Africa", "ZA", "+27"], ["South Korea", "KR", "+82"],
    ["Spain", "ES", "+34"], ["Sri Lanka", "LK", "+94"],
    ["Sweden", "SE", "+46"], ["Switzerland", "CH", "+41"],
    ["Taiwan", "TW", "+886"], ["Thailand", "TH", "+66"],
    ["Tunisia", "TN", "+216"], ["Turkey", "TR", "+90"],
    ["Ukraine", "UA", "+380"], ["United Arab Emirates", "AE", "+971"],
    ["United Kingdom", "GB", "+44"], ["United States", "US", "+1"],
    ["Vietnam", "VN", "+84"], ["Yemen", "YE", "+967"]
  ];

  var REGION_CODES = {
    eu: [
      "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
      "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
      "PL", "PT", "RO", "SK", "SI", "ES", "SE"
    ],
    apac: [
      "AU", "BD", "BN", "BT", "CN", "HK", "ID", "IN", "JP", "KH",
      "KR", "LA", "LK", "MM", "MN", "MV", "MY", "NP", "NZ", "PH",
      "PK", "SG", "TH", "TW", "VN"
    ],
    middleEast: [
      "AE", "BH", "IL", "IQ", "IR", "JO", "KW", "LB", "OM", "QA",
      "SA", "TR", "YE"
    ]
  };

  var INDIA_STATE_ROWS = [
    ["AN", "Andaman and Nicobar Islands"], ["AP", "Andhra Pradesh"],
    ["AR", "Arunachal Pradesh"], ["AS", "Assam"],
    ["BR", "Bihar"], ["CG", "Chhattisgarh"],
    ["CH", "Chandigarh"], ["DN", "Dadra and Nagar Haveli and Daman and Diu"],
    ["DL", "Delhi"], ["GA", "Goa"],
    ["GJ", "Gujarat"], ["HP", "Himachal Pradesh"],
    ["HR", "Haryana"], ["JH", "Jharkhand"],
    ["JK", "Jammu and Kashmir"], ["KA", "Karnataka"],
    ["KL", "Kerala"], ["LA", "Ladakh"],
    ["LD", "Lakshadweep"], ["MH", "Maharashtra"],
    ["ML", "Meghalaya"], ["MN", "Manipur"],
    ["MP", "Madhya Pradesh"], ["MZ", "Mizoram"],
    ["NL", "Nagaland"], ["OD", "Odisha"],
    ["PB", "Punjab"], ["PY", "Puducherry"],
    ["RJ", "Rajasthan"], ["SK", "Sikkim"],
    ["TN", "Tamil Nadu"], ["TR", "Tripura"],
    ["TS", "Telangana"], ["UK", "Uttarakhand"],
    ["UP", "Uttar Pradesh"], ["WB", "West Bengal"]
  ];

  var US_STATE_ROWS = [
    ["AL", "Alabama"], ["AK", "Alaska"],
    ["AZ", "Arizona"], ["AR", "Arkansas"],
    ["CA", "California"], ["CO", "Colorado"],
    ["CT", "Connecticut"], ["DE", "Delaware"],
    ["DC", "District of Columbia"], ["FL", "Florida"],
    ["GA", "Georgia"], ["HI", "Hawaii"],
    ["ID", "Idaho"], ["IL", "Illinois"],
    ["IN", "Indiana"], ["IA", "Iowa"],
    ["KS", "Kansas"], ["KY", "Kentucky"],
    ["LA", "Louisiana"], ["ME", "Maine"],
    ["MD", "Maryland"], ["MA", "Massachusetts"],
    ["MI", "Michigan"], ["MN", "Minnesota"],
    ["MS", "Mississippi"], ["MO", "Missouri"],
    ["MT", "Montana"], ["NE", "Nebraska"],
    ["NV", "Nevada"], ["NH", "New Hampshire"],
    ["NJ", "New Jersey"], ["NM", "New Mexico"],
    ["NY", "New York"], ["NC", "North Carolina"],
    ["ND", "North Dakota"], ["OH", "Ohio"],
    ["OK", "Oklahoma"], ["OR", "Oregon"],
    ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
    ["SC", "South Carolina"], ["SD", "South Dakota"],
    ["TN", "Tennessee"], ["TX", "Texas"],
    ["UT", "Utah"], ["VT", "Vermont"],
    ["VA", "Virginia"], ["WA", "Washington"],
    ["WV", "West Virginia"], ["WI", "Wisconsin"],
    ["WY", "Wyoming"]
  ];

  var state = {
    booted: false,
    ticking: false,
    options: merge(DEFAULTS),
    scrollTop: 0,
    lastScrollTop: 0,
    scrollDirection: "down",
    viewportWidth: 0,
    viewportHeight: 0,
    stickyHeaders: [],
    device: null,
    browser: null,
    body: null,
    lazyController: null,
    animationController: null,
    navToggle: null,
    navPanel: null,
    dropdowns: [],
    events: {
      scroll: [],
      resize: [],
      ready: []
    },
    bound: {
      scroll: null,
      resize: null,
      orientationchange: null,
      documentClick: null,
      documentKeydown: null
    }
  };

  var COUNTRY_DATA = mapCountryRows(COUNTRY_ROWS);
  var COUNTRY_INDEX = createIndex(COUNTRY_DATA, "countryCode");
  var DIAL_INDEX = createDialIndex(COUNTRY_DATA);
  var STATE_DATA = {
    IN: mapStateRows(INDIA_STATE_ROWS),
    US: mapStateRows(US_STATE_ROWS)
  };
  var STATE_INDEX = {
    IN: createIndex(STATE_DATA.IN, "stateCode"),
    US: createIndex(STATE_DATA.US, "stateCode")
  };
  var FORM_DEFINITIONS = {
    contact: {
      title: "Contact Puravigal",
      intro: "Tell us what you are building and we will get back to you.",
      submitLabel: "Send Message",
      fields: [
        { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
        { name: "email", label: "Email", type: "email", autocomplete: "email", required: true },
        { name: "message", label: "Message", type: "textarea", rows: 5, required: true }
      ]
    },
    signup: {
      title: "Signup for Early Access",
      intro: "Join the next wave of Puravigal products and updates.",
      submitLabel: "Request Access",
      fields: [
        { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
        { name: "email", label: "Email", type: "email", autocomplete: "email", required: true },
        { name: "company", label: "Company", type: "text", autocomplete: "organization", required: false }
      ]
    },
    demo: {
      title: "Request a Demo",
      intro: "Share a few details and we will schedule a walkthrough.",
      submitLabel: "Request Demo",
      fields: [
        { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
        { name: "email", label: "Email", type: "email", autocomplete: "email", required: true },
        { name: "company", label: "Company", type: "text", autocomplete: "organization", required: true },
        { name: "message", label: "What do you want to see?", type: "textarea", rows: 4, required: true }
      ]
    },
    callback: {
      title: "Request a Callback",
      intro: "Leave your details and our team will contact you.",
      submitLabel: "Request Callback",
      fields: [
        { name: "name", label: "Name", type: "text", autocomplete: "name", required: true },
        { name: "email", label: "Email", type: "email", autocomplete: "email", required: true },
        { name: "phone", label: "Phone", type: "tel", autocomplete: "tel", required: true }
      ]
    }
  };
  var formInstanceCount = 0;

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
      return Array.prototype.slice.call(value);
    }

    return [value];
  }

  function debounce(callback, wait) {
    var timeoutId;

    return function debounced() {
      var context = this;
      var args = arguments;

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(function () {
        callback.apply(context, args);
      }, wait || 0);
    };
  }

  function rafThrottle(callback) {
    var queued = false;
    var latestArgs;
    var latestContext;

    return function throttled() {
      latestArgs = arguments;
      latestContext = this;

      if (queued) {
        return;
      }

      queued = true;
      requestFrame(function () {
        queued = false;
        callback.apply(latestContext, latestArgs);
      });
    };
  }

  function idle(callback, timeout) {
    if (typeof window.requestIdleCallback === "function") {
      return window.requestIdleCallback(callback, { timeout: timeout || 200 });
    }

    return window.setTimeout(function () {
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return 0;
        }
      });
    }, timeout || 1);
  }

  function requestFrame(callback) {
    if (typeof window.requestAnimationFrame === "function") {
      return window.requestAnimationFrame(callback);
    }

    return window.setTimeout(callback, 16);
  }

  function supportsPassiveEvents() {
    var supported = false;

    try {
      var options = Object.defineProperty({}, "passive", {
        get: function () {
          supported = true;
          return true;
        }
      });

      window.addEventListener("test-passive", null, options);
      window.removeEventListener("test-passive", null, options);
    } catch (error) {
      supported = false;
    }

    return supported;
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function cloneObject(value) {
    return merge({}, value);
  }

  function cloneArray(list) {
    return toArray(list).map(function (item) {
      return typeof item === "object" ? cloneObject(item) : item;
    });
  }

  function mapCountryRows(rows) {
    return rows.map(function (row) {
      return {
        countryName: row[0],
        countryCode: row[1],
        dialCode: row[2]
      };
    });
  }

  function mapStateRows(rows) {
    return rows.map(function (row) {
      return {
        stateCode: row[0],
        stateName: row[1]
      };
    });
  }

  function createIndex(rows, keyName) {
    var index = {};

    rows.forEach(function (row) {
      index[row[keyName]] = row;
    });

    return index;
  }

  function createDialIndex(rows) {
    var index = {};

    rows.forEach(function (row) {
      if (!index[row.dialCode]) {
        index[row.dialCode] = [];
      }

      index[row.dialCode].push(row);
    });

    return index;
  }

  function normalizeCountryCode(code) {
    return String(code || "").trim().toUpperCase();
  }

  function normalizeRegionName(name) {
    return String(name || "")
      .replace(/[\s_-]+/g, "")
      .toLowerCase();
  }

  function normalizeRegionKey(name) {
    var normalized = normalizeRegionName(name);

    if (normalized === "eu") {
      return "eu";
    }

    if (normalized === "apac") {
      return "apac";
    }

    if (normalized === "middleeast") {
      return "middleEast";
    }

    return "";
  }

  function getCurrentBody() {
    return document.body || state.body || null;
  }

  function emit(name, detail) {
    var event;
    var eventName = "puravi:" + name;

    if (typeof window.CustomEvent === "function") {
      event = new CustomEvent(eventName, {
        bubbles: true,
        detail: detail || {}
      });
    } else {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventName, true, false, detail || {});
    }

    document.dispatchEvent(event);
  }

  function runCallbacks(bucket, payload) {
    state.events[bucket].slice().forEach(function (callback) {
      if (typeof callback === "function") {
        callback(payload);
      }
    });
  }

  function subscribe(bucket, callback) {
    if (typeof callback !== "function") {
      return function noop() {};
    }

    state.events[bucket].push(callback);

    return function unsubscribe() {
      state.events[bucket] = state.events[bucket].filter(function (handler) {
        return handler !== callback;
      });
    };
  }

  function getScrollTop() {
    return window.pageYOffset || docElement.scrollTop || 0;
  }

  function updateViewport() {
    state.viewportWidth = window.innerWidth || docElement.clientWidth || 0;
    state.viewportHeight = window.innerHeight || docElement.clientHeight || 0;
  }

  function getViewportSize() {
    return {
      width: state.viewportWidth,
      height: state.viewportHeight
    };
  }

  function getScreenWidth() {
    return window.screen && window.screen.width ? window.screen.width : state.viewportWidth;
  }

  function getScreenHeight() {
    return window.screen && window.screen.height ? window.screen.height : state.viewportHeight;
  }

  function detectDevice() {
    var userAgent = window.navigator.userAgent || "";
    var width = state.viewportWidth || window.innerWidth || 0;
    var isIOS = /iPad|iPhone|iPod/.test(userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    var isAndroid = /Android/.test(userAgent);
    var isTablet = /iPad|Tablet|PlayBook|Silk/.test(userAgent) ||
      (isAndroid && !/Mobile/.test(userAgent)) ||
      (!isIOS && width >= 768 && width <= 1024 && window.navigator.maxTouchPoints > 0);
    var isMobile = !isTablet && (isIOS || /Mobile|Android|IEMobile|Opera Mini/i.test(userAgent) || width < 768);

    return {
      mobile: isMobile,
      tablet: isTablet,
      desktop: !isMobile && !isTablet,
      iOS: isIOS,
      android: isAndroid
    };
  }

  function detectBrowser() {
    var userAgent = window.navigator.userAgent || "";
    var match = null;
    var name = "Unknown";
    var version = "0";

    if (/Edg\//.test(userAgent)) {
      match = userAgent.match(/Edg\/([\d.]+)/);
      name = "Edge";
    } else if (/OPR\//.test(userAgent)) {
      match = userAgent.match(/OPR\/([\d.]+)/);
      name = "Opera";
    } else if (/Chrome\//.test(userAgent)) {
      match = userAgent.match(/Chrome\/([\d.]+)/);
      name = "Chrome";
    } else if (/Safari\//.test(userAgent) && /Version\//.test(userAgent)) {
      match = userAgent.match(/Version\/([\d.]+)/);
      name = "Safari";
    } else if (/Firefox\//.test(userAgent)) {
      match = userAgent.match(/Firefox\/([\d.]+)/);
      name = "Firefox";
    } else if (/MSIE |Trident\//.test(userAgent)) {
      match = userAgent.match(/(?:MSIE |rv:)([\d.]+)/);
      name = "Internet Explorer";
    }

    if (match && match[1]) {
      version = match[1];
    }

    return {
      browserName: name,
      browserVersion: version
    };
  }

  function updateEnvironment() {
    var body = getCurrentBody();
    var deviceClassList;
    var browserSlug;
    var currentClassName;

    state.device = detectDevice();

    if (!state.browser) {
      state.browser = detectBrowser();
    }

    deviceClassList = ["is-mobile", "is-tablet", "is-desktop", "is-ios", "is-android"];
    deviceClassList.forEach(function (className) {
      docElement.classList.remove(className);
    });

    if (state.device.mobile) {
      docElement.classList.add("is-mobile");
    }

    if (state.device.tablet) {
      docElement.classList.add("is-tablet");
    }

    if (state.device.desktop) {
      docElement.classList.add("is-desktop");
    }

    if (state.device.iOS) {
      docElement.classList.add("is-ios");
    }

    if (state.device.android) {
      docElement.classList.add("is-android");
    }

    browserSlug = "browser-" + state.browser.browserName.toLowerCase().replace(/\s+/g, "-");
    docElement.setAttribute("data-browser-name", state.browser.browserName);
    docElement.setAttribute("data-browser-version", state.browser.browserVersion);
    currentClassName = docElement.className.replace(/\bbrowser-[^\s]+\b/g, " ");
    docElement.className = currentClassName.replace(/\s+/g, " ").trim();
    docElement.classList.add(browserSlug);

    if (body) {
      body.setAttribute("data-device", state.device.mobile ? "mobile" : state.device.tablet ? "tablet" : "desktop");
    }
  }

  function setCookie(name, value, days, options) {
    var settings = merge({
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:"
    }, options);
    var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    var expiresDate;

    if (typeof days === "number") {
      expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + (days * 24 * 60 * 60 * 1000));
      cookie += "; expires=" + expiresDate.toUTCString();
    }

    cookie += "; path=" + settings.path;
    cookie += "; SameSite=" + settings.sameSite;

    if (settings.secure) {
      cookie += "; Secure";
    }

    document.cookie = cookie;
    return true;
  }

  function getCookie(name) {
    var encodedName = encodeURIComponent(name) + "=";
    var cookies = document.cookie ? document.cookie.split("; ") : [];
    var index;

    for (index = 0; index < cookies.length; index += 1) {
      if (cookies[index].indexOf(encodedName) === 0) {
        return decodeURIComponent(cookies[index].substring(encodedName.length));
      }
    }

    return null;
  }

  function removeCookie(name, options) {
    return setCookie(name, "", -1, options);
  }

  function getQueryParam(name, inputUrl) {
    var url = inputUrl || window.location.href;
    var searchParams = new URL(url, window.location.origin).searchParams;
    return searchParams.get(name);
  }

  function getCurrentPath() {
    return window.location.pathname;
  }

  function getCurrentUrl() {
    return window.location.href;
  }

  function encodeHTML(value) {
    var element = document.createElement("textarea");
    element.textContent = value == null ? "" : String(value);
    return element.innerHTML;
  }

  function decodeHTML(value) {
    var element = document.createElement("textarea");
    element.innerHTML = value == null ? "" : String(value);
    return element.value;
  }

  function getCountries() {
    return cloneArray(COUNTRY_DATA);
  }

  function getCountry(code) {
    var result = COUNTRY_INDEX[normalizeCountryCode(code)];
    return result ? cloneObject(result) : null;
  }

  function getCountriesByDialCode(dialCode) {
    return cloneArray(DIAL_INDEX[String(dialCode || "").trim()] || []);
  }

  function getRegionCountries(regionName) {
    var regionKey = normalizeRegionKey(regionName);
    var regionCodes = REGION_CODES[regionKey] || [];

    return regionCodes.map(function (countryCode) {
      return getCountry(countryCode);
    }).filter(Boolean);
  }

  function isCountryInRegion(countryCode, regionName) {
    var regionKey = normalizeRegionKey(regionName);
    var regionCodes = REGION_CODES[regionKey] || [];
    return regionCodes.indexOf(normalizeCountryCode(countryCode)) > -1;
  }

  function getCountryRegion(countryCode) {
    var normalized = normalizeCountryCode(countryCode);

    if (isCountryInRegion(normalized, "eu")) {
      return "eu";
    }

    if (isCountryInRegion(normalized, "apac")) {
      return "apac";
    }

    if (isCountryInRegion(normalized, "middleEast")) {
      return "middleEast";
    }

    return "";
  }

  function getStates(countryCode) {
    var normalized = normalizeCountryCode(countryCode);
    return cloneArray(STATE_DATA[normalized] || []);
  }

  function getState(countryCode, stateCode) {
    var normalizedCountry = normalizeCountryCode(countryCode);
    var normalizedState = String(stateCode || "").trim().toUpperCase();
    var result = STATE_INDEX[normalizedCountry] && STATE_INDEX[normalizedCountry][normalizedState];

    return result ? cloneObject(result) : null;
  }

  function getStickyOffset(element) {
    var offset = parseInt(element.getAttribute("data-sticky-offset"), 10);
    return isNaN(offset) ? state.options.stickyOffset : offset;
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === "string") {
      element.textContent = text;
    }

    return element;
  }

  function normalizePath(path) {
    var resolved = "/";

    if (!path) {
      return resolved;
    }

    try {
      resolved = new URL(path, window.location.origin).pathname;
    } catch (error) {
      resolved = String(path);
    }

    resolved = resolved.replace(/\\/g, "/");
    resolved = resolved.replace(/\/index\.html$/i, "/");
    resolved = resolved.replace(/index\.html$/i, "/");
    resolved = resolved.replace(/\/+/g, "/");

    if (resolved.length > 1) {
      resolved = resolved.replace(/\/$/, "");
    }

    return resolved || "/";
  }

  function setNavOpen(shouldOpen) {
    var body = getCurrentBody();

    if (!state.navToggle || !state.navPanel) {
      return;
    }

    state.navToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    state.navPanel.setAttribute("data-open", shouldOpen ? "true" : "false");
    docElement.classList.toggle("nav-is-open", shouldOpen);

    if (body) {
      body.classList.toggle("nav-is-open", shouldOpen);
    }
  }

  function setDropdownState(dropdown, shouldOpen) {
    var toggle = dropdown.querySelector(state.options.dropdownToggleSelector);
    var menu = dropdown.querySelector(state.options.dropdownMenuSelector);

    if (!toggle || !menu) {
      return;
    }

    dropdown.classList.toggle("is-open", shouldOpen);
    toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    menu.hidden = !shouldOpen;
  }

  function closeDropdowns(exceptDropdown) {
    state.dropdowns.forEach(function (dropdown) {
      if (dropdown !== exceptDropdown) {
        setDropdownState(dropdown, false);
      }
    });
  }

  function setActiveLinks() {
    var currentPath = normalizePath(window.location.pathname);

    toArray(document.querySelectorAll(state.options.navLinkSelector)).forEach(function (link) {
      var href = link.getAttribute("href");
      var targetPath;
      var isActive;

      if (!href || href.indexOf("http") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) {
        return;
      }

      targetPath = normalizePath(href);
      isActive = targetPath === "/" ? currentPath === "/" : currentPath === targetPath || currentPath.indexOf(targetPath + "/") === 0;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function bindNavigation() {
    state.navToggle = document.querySelector(state.options.navToggleSelector);
    state.navPanel = document.querySelector(state.options.navPanelSelector);
    state.dropdowns = toArray(document.querySelectorAll(state.options.dropdownSelector));

    if (state.navToggle && !state.navToggle.getAttribute("data-nav-bound")) {
      state.navToggle.setAttribute("data-nav-bound", "true");
      state.navToggle.addEventListener("click", function () {
        var isOpen = state.navToggle.getAttribute("aria-expanded") === "true";
        setNavOpen(!isOpen);
      });
    }

    state.dropdowns.forEach(function (dropdown) {
      var toggle = dropdown.querySelector(state.options.dropdownToggleSelector);
      var menu = dropdown.querySelector(state.options.dropdownMenuSelector);

      if (!toggle || !menu) {
        return;
      }

      menu.hidden = !dropdown.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", dropdown.classList.contains("is-open") ? "true" : "false");

      if (!toggle.getAttribute("data-dropdown-bound")) {
        toggle.setAttribute("data-dropdown-bound", "true");
        toggle.addEventListener("click", function () {
          var nextState = !dropdown.classList.contains("is-open");
          closeDropdowns(dropdown);
          setDropdownState(dropdown, nextState);
        });
      }
    });

    if (!state.bound.documentClick) {
      state.bound.documentClick = function (event) {
        var clickedToggle = state.navToggle && state.navToggle.contains(event.target);
        var clickedPanel = state.navPanel && state.navPanel.contains(event.target);
        var clickedDropdown = state.dropdowns.some(function (dropdown) {
          return dropdown.contains(event.target);
        });

        if (!clickedDropdown) {
          closeDropdowns();
        }

        if (state.navPanel && state.navToggle && !clickedToggle && !clickedPanel) {
          setNavOpen(false);
        }
      };

      document.addEventListener("click", state.bound.documentClick);
    }

    if (!state.bound.documentKeydown) {
      state.bound.documentKeydown = function (event) {
        if (event.key === "Escape") {
          closeDropdowns();
          setNavOpen(false);
        }
      };

      document.addEventListener("keydown", state.bound.documentKeydown);
    }

    setActiveLinks();
  }

  function getFormType(container) {
    var explicitType = String(container.getAttribute("data-puravi-form") || "").trim().toLowerCase();

    if (FORM_DEFINITIONS[explicitType]) {
      return explicitType;
    }

    if (container.classList.contains("puravi-form-contact") || container.classList.contains("form-contact")) {
      return "contact";
    }

    if (container.classList.contains("puravi-form-signup") || container.classList.contains("form-signup")) {
      return "signup";
    }

    if (container.classList.contains("puravi-form-demo") || container.classList.contains("form-demo")) {
      return "demo";
    }

    if (container.classList.contains("puravi-form-callback") || container.classList.contains("form-callback")) {
      return "callback";
    }

    return "";
  }

  function buildField(type, field) {
    var fieldWrap = createElement("div", "puravi-field");
    var label = createElement("label", "puravi-label", field.label);
    var input;
    var inputId;

    formInstanceCount += 1;
    inputId = "puravi-" + type + "-" + field.name + "-" + formInstanceCount;

    label.setAttribute("for", inputId);

    if (field.type === "textarea") {
      input = createElement("textarea", "puravi-input puravi-textarea");
      input.setAttribute("rows", String(field.rows || 4));
    } else {
      input = createElement("input", "puravi-input");
      input.setAttribute("type", field.type || "text");
    }

    input.id = inputId;
    input.name = field.name;

    if (field.autocomplete) {
      input.setAttribute("autocomplete", field.autocomplete);
    }

    if (field.required) {
      input.required = true;
    }

    fieldWrap.appendChild(label);
    fieldWrap.appendChild(input);
    return fieldWrap;
  }

  function buildForm(type) {
    var definition = FORM_DEFINITIONS[type];
    var shell;
    var head;
    var eyebrow;
    var title;
    var intro;
    var form;
    var grid;
    var actions;
    var submit;
    var status;

    if (!definition) {
      return null;
    }

    shell = createElement("section", "puravi-form-shell");
    head = createElement("div", "puravi-form-head");
    eyebrow = createElement("p", "eyebrow", "Puravigal Form");
    title = createElement("h2", "puravi-form-title", definition.title);
    intro = createElement("p", "puravi-form-copy", definition.intro);
    form = createElement("form", "puravi-form");
    grid = createElement("div", "puravi-form-grid");
    actions = createElement("div", "puravi-form-actions");
    submit = createElement("button", "button button--primary", definition.submitLabel);
    status = createElement("p", "puravi-form-status");

    form.setAttribute("action", "#");
    form.setAttribute("method", "post");
    form.setAttribute("data-puravi-rendered-form", "true");
    form.setAttribute("data-puravi-form-type", type);

    definition.fields.forEach(function (field) {
      grid.appendChild(buildField(type, field));
    });

    submit.setAttribute("type", "submit");
    status.setAttribute("aria-live", "polite");

    head.appendChild(eyebrow);
    head.appendChild(title);
    head.appendChild(intro);
    actions.appendChild(submit);
    actions.appendChild(status);
    form.appendChild(grid);
    form.appendChild(actions);
    shell.appendChild(head);
    shell.appendChild(form);

    return shell;
  }

  function handleInjectedFormSubmit(event) {
    var form = event.currentTarget;
    var status = form.querySelector(".puravi-form-status");

    if (!form.checkValidity()) {
      return;
    }

    event.preventDefault();

    if (status) {
      status.textContent = "Thanks. Your request has been captured for the Puravigal team.";
      status.classList.add("is-success");
    }

    form.reset();
  }

  function bindInjectedForms(root) {
    toArray((root || document).querySelectorAll("[data-puravi-rendered-form='true']")).forEach(function (form) {
      if (form.getAttribute("data-form-bound") === "true") {
        return;
      }

      form.setAttribute("data-form-bound", "true");
      form.addEventListener("submit", handleInjectedFormSubmit);
    });
  }

  function injectForms(root) {
    var scope = root && root.querySelectorAll ? root : document;

    toArray(scope.querySelectorAll(state.options.formRootSelector)).forEach(function (container) {
      var type = getFormType(container);
      var renderedForm;

      if (!type || container.getAttribute("data-form-rendered") === "true") {
        return;
      }

      renderedForm = buildForm(type);

      if (!renderedForm) {
        return;
      }

      container.innerHTML = "";
      container.appendChild(renderedForm);
      container.setAttribute("data-form-rendered", "true");
    });

    bindInjectedForms(scope);
  }

  function collectStickyHeaders() {
    var seen = [];

    state.stickyHeaders = toArray(document.querySelectorAll(state.options.stickySelector)).filter(function (element) {
      if (!element || seen.indexOf(element) > -1) {
        return false;
      }

      seen.push(element);
      return true;
    });
  }

  function updateDirectionClasses() {
    var body = getCurrentBody();
    var isScrollingDown = state.scrollDirection === "down" && state.scrollTop > 0;
    var isScrollingUp = state.scrollDirection === "up";

    docElement.classList.toggle("is-scrolling-down", isScrollingDown);
    docElement.classList.toggle("is-scrolling-up", isScrollingUp);

    if (body) {
      body.classList.toggle("is-scrolling-down", isScrollingDown);
      body.classList.toggle("is-scrolling-up", isScrollingUp);
    }
  }

  function updateStickyHeaders() {
    state.stickyHeaders.forEach(function (element) {
      var stickyOffset = getStickyOffset(element);
      var active = state.scrollTop > stickyOffset;

      element.classList.toggle("is-sticky", active);
      element.setAttribute("data-sticky-active", active ? "true" : "false");
      element.classList.toggle("is-scroll-down", active && state.scrollDirection === "down");
      element.classList.toggle("is-scroll-up", active && state.scrollDirection === "up");
    });
  }

  function bindLazyModules(rebind) {
    var lazyApi = window.PuraviLazy;
    var lazyTargets;
    var animationTargets;

    if (!lazyApi) {
      return;
    }

    if (rebind && state.lazyController && typeof state.lazyController.disconnect === "function") {
      state.lazyController.disconnect();
    }

    if (rebind && state.animationController && typeof state.animationController.disconnect === "function") {
      state.animationController.disconnect();
    }

    lazyTargets = document.querySelectorAll(state.options.lazySelector);
    animationTargets = document.querySelectorAll(state.options.animationSelector);

    toArray(animationTargets).forEach(function (element) {
      var delay = element.getAttribute("data-animate-delay");

      if (delay) {
        element.style.setProperty("--puravi-animate-delay", delay);
      }
    });

    state.lazyController = lazyApi.observeLazy(lazyTargets, {
      rootMargin: "0px 0px 120px 0px",
      threshold: 0.01
    });

    state.animationController = lazyApi.observeAnimations(animationTargets, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
      revealedClass: "is-visible"
    });
  }

  function refresh(rebind) {
    updateViewport();
    updateEnvironment();
    collectStickyHeaders();
    updateStickyHeaders();
    bindNavigation();
    injectForms(document);

    if (rebind) {
      bindLazyModules(true);
    } else if (window.PuraviLazy && typeof window.PuraviLazy.refresh === "function") {
      window.PuraviLazy.refresh();
    }

    emit("refresh", {
      viewport: getViewportSize(),
      device: cloneObject(state.device)
    });
  }

  function buildScrollPayload() {
    return {
      scrollTop: state.scrollTop,
      lastScrollTop: state.lastScrollTop,
      direction: state.scrollDirection,
      viewport: getViewportSize(),
      device: cloneObject(state.device)
    };
  }

  function runScrollFrame() {
    var previousTop = state.scrollTop;
    var payload;

    state.ticking = false;
    state.lastScrollTop = previousTop;
    state.scrollTop = getScrollTop();

    if (state.scrollTop > previousTop) {
      state.scrollDirection = "down";
    } else if (state.scrollTop < previousTop) {
      state.scrollDirection = "up";
    }

    updateDirectionClasses();
    updateStickyHeaders();

    if (window.PuraviLazy && typeof window.PuraviLazy.refresh === "function") {
      window.PuraviLazy.refresh();
    }

    payload = buildScrollPayload();
    runCallbacks("scroll", payload);
    emit("scroll", payload);
  }

  function requestScrollFrame() {
    if (state.ticking) {
      return;
    }

    state.ticking = true;
    requestFrame(runScrollFrame);
  }

  function handleResize() {
    refresh(false);

    runCallbacks("resize", {
      viewport: getViewportSize(),
      device: cloneObject(state.device)
    });

    emit("resize", {
      viewport: getViewportSize(),
      device: cloneObject(state.device)
    });

    requestScrollFrame();
  }

  function bindEvents() {
    var passiveOption = supportsPassiveEvents() ? { passive: true } : false;

    if (state.bound.scroll) {
      return;
    }

    state.bound.scroll = requestScrollFrame;
    state.bound.resize = debounce(handleResize, state.options.resizeDebounce);
    state.bound.orientationchange = state.bound.resize;

    window.addEventListener("scroll", state.bound.scroll, passiveOption);
    window.addEventListener("resize", state.bound.resize);
    window.addEventListener("orientationchange", state.bound.orientationchange);
  }

  function destroy() {
    if (!state.booted) {
      return;
    }

    if (state.bound.scroll) {
      window.removeEventListener("scroll", state.bound.scroll);
    }

    if (state.bound.resize) {
      window.removeEventListener("resize", state.bound.resize);
    }

    if (state.bound.orientationchange) {
      window.removeEventListener("orientationchange", state.bound.orientationchange);
    }

    if (state.bound.documentClick) {
      document.removeEventListener("click", state.bound.documentClick);
    }

    if (state.bound.documentKeydown) {
      document.removeEventListener("keydown", state.bound.documentKeydown);
    }

    if (state.lazyController && typeof state.lazyController.disconnect === "function") {
      state.lazyController.disconnect();
    }

    if (state.animationController && typeof state.animationController.disconnect === "function") {
      state.animationController.disconnect();
    }

    state.bound.scroll = null;
    state.bound.resize = null;
    state.bound.orientationchange = null;
    state.bound.documentClick = null;
    state.bound.documentKeydown = null;
    state.booted = false;
  }

  function boot() {
    var payload;

    if (state.booted) {
      return Puravi;
    }

    state.body = document.body || null;
    updateViewport();
    updateEnvironment();
    collectStickyHeaders();
    bindLazyModules(true);
    bindNavigation();
    injectForms(document);
    bindEvents();

    state.scrollTop = getScrollTop();
    state.lastScrollTop = state.scrollTop;
    updateDirectionClasses();
    updateStickyHeaders();
    state.booted = true;

    payload = {
      viewport: getViewportSize(),
      device: cloneObject(state.device),
      browser: cloneObject(state.browser)
    };

    runCallbacks("ready", payload);
    emit("ready", payload);
    return Puravi;
  }

  function init(options) {
    state.options = merge(DEFAULTS, state.options, options);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
      return Puravi;
    }

    return boot();
  }

  var Puravi = {
    version: "1.0.0",
    init: init,
    refresh: function () {
      refresh(true);
      return Puravi;
    },
    destroy: destroy,
    onReady: function (callback) {
      if (state.booted) {
        callback({
          viewport: getViewportSize(),
          device: cloneObject(state.device),
          browser: cloneObject(state.browser)
        });
        return function noop() {};
      }

      return subscribe("ready", callback);
    },
    onScroll: function (callback) {
      return subscribe("scroll", callback);
    },
    onResize: function (callback) {
      return subscribe("resize", callback);
    },
    performance: {
      debounce: debounce,
      rafThrottle: rafThrottle,
      idle: idle,
      prefersReducedMotion: prefersReducedMotion,
      supportsPassiveEvents: supportsPassiveEvents
    },
    viewport: {
      getScreenWidth: getScreenWidth,
      getScreenHeight: getScreenHeight,
      getViewportSize: getViewportSize
    },
    device: {
      get: function () {
        return cloneObject(state.device || detectDevice());
      },
      isMobile: function () {
        var device = state.device || detectDevice();
        return !!device.mobile;
      },
      isTablet: function () {
        var device = state.device || detectDevice();
        return !!device.tablet;
      },
      isDesktop: function () {
        var device = state.device || detectDevice();
        return !!device.desktop;
      },
      isIOS: function () {
        var device = state.device || detectDevice();
        return !!device.iOS;
      },
      isAndroid: function () {
        var device = state.device || detectDevice();
        return !!device.android;
      }
    },
    browser: {
      get: function () {
        return cloneObject(state.browser || detectBrowser());
      },
      getName: function () {
        return (state.browser || detectBrowser()).browserName;
      },
      getVersion: function () {
        return (state.browser || detectBrowser()).browserVersion;
      }
    },
    cookies: {
      set: setCookie,
      get: getCookie,
      remove: removeCookie
    },
    url: {
      getQueryParam: getQueryParam,
      getCurrentPath: getCurrentPath,
      getCurrentUrl: getCurrentUrl
    },
    html: {
      encode: encodeHTML,
      decode: decodeHTML
    },
    forms: {
      inject: function (root) {
        injectForms(root || document);
        return Puravi;
      },
      getDefinitions: function () {
        return cloneObject(FORM_DEFINITIONS);
      }
    },
    country: {
      getAll: getCountries,
      getByCode: getCountry,
      getByDialCode: getCountriesByDialCode,
      getRegionCountries: getRegionCountries,
      getRegionByCountry: getCountryRegion,
      getRegionKey: getCountryRegion,
      isInRegion: isCountryInRegion
    },
    state: {
      getAll: getStates,
      getByCode: getState
    }
  };

  window.Puravi = Puravi;
  init();
})(window, document);
