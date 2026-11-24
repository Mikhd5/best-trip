(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  <div class="motion-loader" id="siteLoader" role="status" aria-label="Завантаження BEST TRIP">
    <div class="motion-loader__grain" aria-hidden="true"></div>
    <button class="motion-loader__skip" id="skipLoader" type="button" aria-label="Пропустити анімацію">Пропустити <span aria-hidden="true">↗</span></button>
    <div class="motion-loader__content">
      <div class="motion-loader__eyebrow"><span></span> UKRAINE <i>→</i> EUROPE</div>
      <div class="motion-loader__logo-wrap">
        <span class="motion-loader__halo" aria-hidden="true"></span>
        <img class="motion-loader__logo" src="A7E82CFB-D3FE-42FB-9A13-950F53F0CD64.png" alt="BEST TRIP — пасажирські перевезення" width="760" height="220" fetchpriority="high" decoding="sync">
      </div>
      <div class="motion-loader__route-meta">
        <span><b class="motion-loader__pin motion-loader__pin--start"></b> УКРАЇНА</span>
        <span class="motion-loader__route-caption">ВАШ МАРШРУТ ДО ЄВРОПИ</span>
        <span>ЄВРОПА <b class="motion-loader__pin motion-loader__pin--end"></b></span>
      </div>
      <svg class="motion-loader__route" viewBox="0 0 720 150" role="presentation" aria-hidden="true">
        <defs>
          <linearGradient id="routeGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#8e6728"/>
            <stop offset=".48" stop-color="#f7d986"/>
            <stop offset="1" stop-color="#bd8733"/>
          </linearGradient>
          <filter id="routeGlow" x="-30%" y="-150%" width="160%" height="400%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path class="motion-loader__route-base" d="M42 112 C184 16 291 24 372 79 S536 137 678 35"/>
        <path class="motion-loader__route-draw" d="M42 112 C184 16 291 24 372 79 S536 137 678 35"/>
        <circle class="motion-loader__route-node motion-loader__route-node--start" cx="42" cy="112" r="6"/>
        <circle class="motion-loader__route-node motion-loader__route-node--end" cx="678" cy="35" r="7"/>
        <g class="motion-loader__van" filter="url(#routeGlow)">
          <path d="M-24-9h28l10 9v9h-43v-10q0-8 5-8Z" fill="#15191b" stroke="#f4cf79" stroke-width="1.5"/>
          <path d="M-18-6h16v8h-20v-4q0-4 4-4ZM1-6h3l8 8H1Z" fill="#566167" stroke="#d9dfe0" stroke-width=".8"/>
          <circle cx="-20" cy="10" r="3.4" fill="#080a0b" stroke="#f4cf79" stroke-width="1.5"/>
          <circle cx="9" cy="10" r="3.4" fill="#080a0b" stroke="#f4cf79" stroke-width="1.5"/>
          <animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto" path="M42 112 C184 16 291 24 372 79 S536 137 678 35"/>
        </g>
        <circle class="motion-loader__route-pulse" cx="678" cy="35" r="14"/>
      </svg>
      <div class="motion-loader__status">
        <span class="motion-loader__status-dot"></span>
        <span>ПОДОРОЖ ПОЧИНАЄТЬСЯ З ДОВІРИ</span>
        <span class="motion-loader__status-line"></span>
      </div>
    </div>
    <div class="motion-loader__footer"><span>BEST TRIP</span><span>КОМФОРТНО • НАДІЙНО • ВЧАСНО</span></div>
  </div>

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


  const mobileCall = $('.mobile-call');
  const bookingSection = $('#booking');
  if (mobileCall && bookingSection && 'IntersectionObserver' in window) {
    const bookingObserver = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      mobileCall.classList.toggle('is-hidden', visible);
    }, { threshold: 0.08 });
    bookingObserver.observe(bookingSection);
  }
  if (mobileCall) {
    $('#bookingForm input, #bookingForm select, #bookingForm textarea').forEach(field => {
      field.addEventListener('focus', () => mobileCall.classList.add('is-hidden'));
      field.addEventListener('blur', () => {
        if (!bookingSection || !('IntersectionObserver' in window)) mobileCall.classList.remove('is-hidden');
      });
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
