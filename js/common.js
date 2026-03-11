const GEO_CATALOG = {
  IN: {
    name: 'India',
    dialCode: '+91',
    states: ['Andhra Pradesh', 'Delhi', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'West Bengal']
  },
  US: {
    name: 'United States',
    dialCode: '+1',
    states: ['California', 'Florida', 'Illinois', 'New York', 'Texas', 'Washington']
  },
  CA: {
    name: 'Canada',
    dialCode: '+1',
    states: ['Alberta', 'British Columbia', 'Ontario', 'Quebec', 'Saskatchewan']
  },
  GB: {
    name: 'United Kingdom',
    dialCode: '+44',
    states: ['England', 'Northern Ireland', 'Scotland', 'Wales']
  },
  AU: {
    name: 'Australia',
    dialCode: '+61',
    states: ['New South Wales', 'Queensland', 'South Australia', 'Victoria', 'Western Australia']
  },
  SG: {
    name: 'Singapore',
    dialCode: '+65',
    states: ['Central Region', 'North-East Region', 'North Region', 'East Region', 'West Region']
  },
  AE: {
    name: 'United Arab Emirates',
    dialCode: '+971',
    states: ['Abu Dhabi', 'Ajman', 'Dubai', 'Ras Al Khaimah', 'Sharjah']
  },
  SA: {
    name: 'Saudi Arabia',
    dialCode: '+966',
    states: ['Eastern Province', 'Makkah', 'Madinah', 'Riyadh']
  },
  MY: {
    name: 'Malaysia',
    dialCode: '+60',
    states: ['Johor', 'Kedah', 'Kuala Lumpur', 'Penang', 'Selangor']
  },
  DE: {
    name: 'Germany',
    dialCode: '+49',
    states: ['Bavaria', 'Berlin', 'Hamburg', 'Hesse', 'North Rhine-Westphalia']
  }
};

const CONSENT_STORAGE_KEY = 'puravigal_consent_v1';

function supportsIntersectionObserver() {
  return 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window;
}

function throttle(fn, wait) {
  let timeout = null;
  return function throttled() {
    if (timeout) return;
    timeout = setTimeout(() => {
      fn();
      timeout = null;
    }, wait);
  };
}

function normalizePath(path) {
  return path.replace(/\/index\.html$/, '/').replace(/\.html$/, '') || '/';
}

function fillSelect(select, values, placeholderText) {
  if (!select) return;
  select.innerHTML = '';
  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.textContent = placeholderText;
  select.appendChild(firstOption);

  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function getSortedCountries() {
  return Object.entries(GEO_CATALOG)
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function inferCountryCode() {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
  const localeCode = locale.split('-')[1];
  if (localeCode && GEO_CATALOG[localeCode]) return localeCode;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const zoneMap = {
    'Asia/Kolkata': 'IN',
    'Asia/Dubai': 'AE',
    'America/New_York': 'US',
    'Europe/London': 'GB',
    'Australia/Sydney': 'AU'
  };

  return zoneMap[tz] || '';
}

async function includePartials() {
  const targets = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(targets).map(async (target) => {
    const path = target.getAttribute('data-include');
    if (!path) return;

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Include failed: ${path}`);
      target.innerHTML = await response.text();
    } catch (error) {
      target.innerHTML = '<p class="small">Unable to load section.</p>';
      console.error(error);
    }
  }));
}

function initNavigationExperience() {
  const siteHeader = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const primaryNav = document.querySelector('[data-primary-nav]');

  if (primaryNav) {
    const currentPath = normalizePath(window.location.pathname);
    primaryNav.querySelectorAll('a').forEach((link) => {
      const href = new URL(link.href, window.location.origin);
      if (normalizePath(href.pathname) === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (!siteHeader || !menuToggle || !primaryNav) return;

  const closeMenu = () => {
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!siteHeader.classList.contains('menu-open')) return;
    if (siteHeader.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function initRevealAnimations() {
  const nodes = document.querySelectorAll('.reveal');
  if (!nodes.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((node) => node.classList.add('visible'));
    return;
  }

  if (supportsIntersectionObserver()) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    nodes.forEach((node) => observer.observe(node));
    return;
  }

  const onScroll = throttle(() => {
    const triggerLine = window.innerHeight * 0.9;
    nodes.forEach((node) => {
      if (node.classList.contains('visible')) return;
      if (node.getBoundingClientRect().top <= triggerLine) {
        node.classList.add('visible');
      }
    });
  }, 80);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function hydrateLazyMediaElement(element) {
  if (element.dataset.src) {
    element.src = element.dataset.src;
    delete element.dataset.src;
  }
  if (element.dataset.srcset) {
    element.srcset = element.dataset.srcset;
    delete element.dataset.srcset;
  }
  element.classList.add('media-ready');
}

function initLazyMedia() {
  const mediaNodes = document.querySelectorAll('img[data-src], source[data-srcset]');
  if (!mediaNodes.length) return;

  if (supportsIntersectionObserver()) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateLazyMediaElement(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '150px 0px' });

    mediaNodes.forEach((node) => observer.observe(node));
    return;
  }

  const onScroll = throttle(() => {
    const triggerLine = window.innerHeight + 150;
    mediaNodes.forEach((node) => {
      if (!node.dataset.src && !node.dataset.srcset) return;
      if (node.getBoundingClientRect().top <= triggerLine) {
        hydrateLazyMediaElement(node);
      }
    });
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setGeoValues(form, selectedCode) {
  const stateSelect = form.querySelector('[data-geo="state"]');
  const dialCodeInput = form.querySelector('[data-geo="dial-code"]');
  const selectedCountry = GEO_CATALOG[selectedCode];

  if (!selectedCountry) {
    fillSelect(stateSelect, [], 'Select state');
    if (dialCodeInput) dialCodeInput.value = '';
    return;
  }

  fillSelect(stateSelect, selectedCountry.states, 'Select state');
  if (dialCodeInput) dialCodeInput.value = selectedCountry.dialCode;
}

function initGeoFields() {
  const forms = document.querySelectorAll('.js-reusable-form');
  const countries = getSortedCountries();
  const defaultCountry = inferCountryCode();

  forms.forEach((form) => {
    const countrySelect = form.querySelector('[data-geo="country"]');
    const stateSelect = form.querySelector('[data-geo="state"]');
    if (!countrySelect || !stateSelect) return;

    countrySelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select country';
    countrySelect.appendChild(placeholder);

    countries.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = `${country.name} (${country.dialCode})`;
      countrySelect.appendChild(option);
    });

    countrySelect.value = countrySelect.dataset.defaultCountry || defaultCountry || '';
    setGeoValues(form, countrySelect.value);

    countrySelect.addEventListener('change', () => {
      setGeoValues(form, countrySelect.value);
    });
  });
}

function initReusableForms() {
  document.querySelectorAll('.js-reusable-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const msg = form.querySelector('.js-form-message');
      if (msg) {
        msg.textContent = 'Thanks! We will contact you shortly.';
      }
      form.reset();
      initGeoFields();
    });
  });
}

function getStoredConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveConsent(consent) {
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
    ...consent,
    updatedAt: new Date().toISOString()
  }));
}

function applyConsentState(consent) {
  document.documentElement.dataset.analyticsConsent = String(Boolean(consent.analytics));
  document.documentElement.dataset.marketingConsent = String(Boolean(consent.marketing));
}

function removeConsentBanner() {
  const existing = document.querySelector('.cookie-banner');
  if (existing) existing.remove();
}

function showConsentBanner() {
  if (document.querySelector('.cookie-banner')) return;

  const banner = document.createElement('aside');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = `
    <div>
      <p class="cookie-banner-title">Privacy settings</p>
      <p class="small">We use essential cookies for core functionality. Optional analytics and marketing cookies are used only with your consent.</p>
    </div>
    <div class="cookie-banner-actions">
      <button class="btn secondary" type="button" data-consent="necessary">Necessary only</button>
      <button class="btn secondary" type="button" data-consent="customize">Customize</button>
      <button class="btn" type="button" data-consent="all">Accept all</button>
    </div>
  `;

  document.body.appendChild(banner);

  banner.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-consent]');
    if (!trigger) return;

    if (trigger.dataset.consent === 'all') {
      const consent = { necessary: true, analytics: true, marketing: true };
      saveConsent(consent);
      applyConsentState(consent);
      removeConsentBanner();
      return;
    }

    if (trigger.dataset.consent === 'necessary') {
      const consent = { necessary: true, analytics: false, marketing: false };
      saveConsent(consent);
      applyConsentState(consent);
      removeConsentBanner();
      return;
    }

    const consent = { necessary: true, analytics: true, marketing: false };
    saveConsent(consent);
    applyConsentState(consent);
    removeConsentBanner();
  });
}

function initConsentManagement() {
  const saved = getStoredConsent();
  if (saved) {
    applyConsentState(saved);
  } else {
    applyConsentState({ necessary: true, analytics: false, marketing: false });
    showConsentBanner();
  }

  document.querySelectorAll('[data-open-consent]').forEach((button) => {
    button.addEventListener('click', () => {
      showConsentBanner();
    });
  });
}

function injectSeoSchema() {
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) return;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://puravigal.com/#organization',
        name: 'Puravigal',
        url: 'https://puravigal.com',
        logo: 'https://puravigal.com/images/puravigal-logo.svg'
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalEl.href}#webpage`,
        name: document.title,
        url: canonicalEl.href,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://puravigal.com/#website'
        }
      }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

function initCurrentYear() {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

window.PuravigalCommon = {
  GEO_CATALOG,
  fillSelect,
  initGeoFields,
  getStoredConsent,
  showConsentBanner
};

document.addEventListener('DOMContentLoaded', async () => {
  await includePartials();
  initCurrentYear();
  initNavigationExperience();
  initRevealAnimations();
  initLazyMedia();
  initGeoFields();
  initReusableForms();
  initConsentManagement();
  injectSeoSchema();
});
