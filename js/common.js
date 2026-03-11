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
      target.innerHTML = `<p class="small">Unable to load section.</p>`;
      console.error(error);
    }
  }));
}

function initRevealAnimations() {
  const nodes = document.querySelectorAll('.reveal');
  if (!nodes.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  nodes.forEach((node) => observer.observe(node));
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
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await includePartials();
  initRevealAnimations();
  initReusableForms();
});
