(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      mainNav.classList.toggle('open', !isOpen);
    });
    $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
    }));
    document.addEventListener('click', event => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
      }
    });
  }

  const progress = $('#scrollProgress');
  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach(item => {
      if (!item.classList.contains('is-visible')) observer.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const form = $('#bookingForm');
  const status = $('#formStatus');
  if (form) {
    const dateInput = $('input[name="date"]', form);
    if (dateInput) {
      const today = new Date();
      const localISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateInput.min = localISO;
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const from = String(data.get('from') || '').trim();
      const destination = String(data.get('destination') || '').trim();
      const date = String(data.get('date') || '').trim();
      const passengers = String(data.get('passengers') || '1').trim();
      const comment = String(data.get('comment') || '').trim();

      const lines = [
        'Вітаю! Хочу уточнити поїздку з BEST TRIP.',
        '',
        `Ім'я: ${name}`,
        `Телефон: ${phone}`,
        `Звідки: ${from}`,
        `Куди: ${destination}`,
        `Дата: ${date || 'Потрібно узгодити'}`,
        `Пасажирів: ${passengers}`
      ];
      if (comment) lines.push(`Додаткова інформація: ${comment}`);
      lines.push('', 'Будь ласка, повідомте деталі рейсу. Дякую!');

      const whatsappUrl = `https://wa.me/380969990799?text=${encodeURIComponent(lines.join('\n'))}`;
      if (status) status.textContent = 'Відкриваємо WhatsApp із підготовленою заявкою…';
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
