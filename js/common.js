const GEO_CATALOG = {
  IN: {
    name: 'India',
    dialCode: '+91',
    states: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Telangana', 'Delhi']
  },
  US: {
    name: 'United States',
    dialCode: '+1',
    states: ['California', 'Texas', 'New York', 'Florida', 'Washington', 'Illinois']
  },
  AE: {
    name: 'United Arab Emirates',
    dialCode: '+971',
    states: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah']
  },
  SG: {
    name: 'Singapore',
    dialCode: '+65',
    states: ['Central', 'North East', 'North West', 'South East', 'South West']
  }
};

async function includePartials() {
  const targets = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(targets).map(async (target) => {
    const path = target.getAttribute('data-include');
    if (!path) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Include failed: ${path}`);
      target.innerHTML = await res.text();
    } catch (error) {
      target.innerHTML = '<p class="small">Unable to load section.</p>';
      console.error(error);
    }
  }));
}

function normalizePath(path) {
  const clean = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return clean.endsWith('/') ? clean : `${clean}`;
}

function initNavigationExperience() {
  const siteHeader = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const primaryNav = document.querySelector('[data-primary-nav]');

  if (primaryNav) {
    const currentPath = normalizePath(window.location.pathname);
    primaryNav.querySelectorAll('a').forEach((link) => {
      const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
      const isCurrent = currentPath === linkPath;
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (!siteHeader || !menuToggle || !primaryNav) return;

  function closeMenu() {
    siteHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    const open = siteHeader.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
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
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    nodes.forEach((node) => observer.observe(node));
    return;
  }

  const fallbackScrollHandler = throttle(() => {
    const trigger = window.innerHeight * 0.9;
    nodes.forEach((node) => {
      if (node.classList.contains('visible')) return;
      const rect = node.getBoundingClientRect();
      if (rect.top <= trigger) node.classList.add('visible');
    });
  }, 80);

  window.addEventListener('scroll', fallbackScrollHandler, { passive: true });
  fallbackScrollHandler();
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
    const mediaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateLazyMediaElement(entry.target);
        mediaObserver.unobserve(entry.target);
      });
    }, { rootMargin: '150px 0px' });

    mediaNodes.forEach((node) => mediaObserver.observe(node));
    return;
  }

  const fallbackLoad = throttle(() => {
    const trigger = window.innerHeight + 150;
    mediaNodes.forEach((node) => {
      if (!node.dataset.src && !node.dataset.srcset) return;
      const rect = node.getBoundingClientRect();
      if (rect.top <= trigger) hydrateLazyMediaElement(node);
    });
  }, 100);

  window.addEventListener('scroll', fallbackLoad, { passive: true });
  fallbackLoad();
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

function initGeoFields() {
  const forms = document.querySelectorAll('.js-reusable-form');
  forms.forEach((form) => {
    const countrySelect = form.querySelector('[data-geo="country"]');
    const stateSelect = form.querySelector('[data-geo="state"]');
    const dialCodeInput = form.querySelector('[data-geo="dial-code"]');

    if (!countrySelect || !stateSelect) return;

    const countries = Object.entries(GEO_CATALOG)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(([code, value]) => ({ code, ...value }));

    countrySelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select country';
    countrySelect.appendChild(placeholder);

    countries.forEach((country) => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = `${country.name} (${country.code})`;
      countrySelect.appendChild(option);
    });

    function syncStateAndCode() {
      const selectedCode = countrySelect.value;
      const selectedCountry = GEO_CATALOG[selectedCode];
      if (!selectedCountry) {
        fillSelect(stateSelect, [], 'Select state');
        if (dialCodeInput) dialCodeInput.value = '';
        return;
      }
      fillSelect(stateSelect, selectedCountry.states, 'Select state');
      if (dialCodeInput) dialCodeInput.value = selectedCountry.dialCode;
    }

    countrySelect.addEventListener('change', syncStateAndCode);
    syncStateAndCode();
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

document.addEventListener('DOMContentLoaded', async () => {
  await includePartials();
  initNavigationExperience();
  initRevealAnimations();
  initLazyMedia();
  initGeoFields();
  initReusableForms();
  injectSeoSchema();
});
