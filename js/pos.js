document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('[data-billing-toggle]');
  const monthly = document.querySelectorAll('[data-price-monthly]');
  const yearly = document.querySelectorAll('[data-price-yearly]');

  toggles.forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const showYearly = toggle.checked;
      monthly.forEach((el) => (el.hidden = showYearly));
      yearly.forEach((el) => (el.hidden = !showYearly));
    });
  });
});
