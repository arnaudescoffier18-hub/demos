(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  document.body.classList.add('js-ready');

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 28);
      if (window.innerWidth <= 820 && !document.body.classList.contains('menu-open')) {
        if (y > 150 && y > lastY + 8) header.style.transform = 'translateY(-105%)';
        else if (y < lastY - 4 || y < 100) header.style.transform = '';
      } else header.style.transform = '';
    }
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.setProperty('--progress', `${Math.min(100, (y / max) * 100)}%`);
    }
    lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile navigation
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // Hero slideshow
  const slides = [...document.querySelectorAll('.hero-slide')];
  let slideIndex = 0;
  if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      slides[slideIndex].classList.remove('is-active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('is-active');
    }, 5200);
  }

  // Hero light follows pointer, click ripple
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  }
  document.addEventListener('pointerdown', e => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = `${e.clientX - 7}px`;
    dot.style.top = `${e.clientY - 7}px`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 800);
  });

  // Scroll motion, essential content remains visible even without JS
  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

  // Subtle tilt for pool cards
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - .5) * 2;
        const y = ((e.clientY - r.top) / r.height - .5) * 2;
        card.style.transform = `perspective(900px) rotateX(${y * -2.5}deg) rotateY(${x * 2.5}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Reviews: buttons, soft auto-scroll, pause on interaction
  const track = document.querySelector('.reviews-track');
  const prev = document.querySelector('[data-review-prev]');
  const next = document.querySelector('[data-review-next]');
  let paused = false;
  const moveReviews = dir => {
    if (!track) return;
    const card = track.querySelector('.review');
    const amount = (card?.getBoundingClientRect().width || 380) + 16;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  prev?.addEventListener('click', () => moveReviews(-1));
  next?.addEventListener('click', () => moveReviews(1));
  if (track && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ['mouseenter','pointerdown','focusin'].forEach(ev => track.addEventListener(ev, () => paused = true));
    ['mouseleave','focusout'].forEach(ev => track.addEventListener(ev, () => paused = false));
    setInterval(() => {
      if (paused || window.innerWidth < 700) return;
      const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 12;
      if (end) track.scrollTo({ left: 0, behavior: 'smooth' });
      else moveReviews(1);
    }, 4700);
  }

  // FAQ accessible accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-btn');
    btn?.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Gallery lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightImg = lightbox?.querySelector('img');
  const lightClose = lightbox?.querySelector('.lightbox-close');
  const closeLightbox = () => {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.gallery figure, .masonry figure').forEach(fig => {
    fig.setAttribute('tabindex','0');
    const open = () => {
      if (!lightbox || !lightImg) return;
      const img = fig.querySelector('img');
      lightImg.src = img.currentSrc || img.src;
      lightImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      lightClose?.focus();
    };
    fig.addEventListener('click', open);
    fig.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  lightClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Smooth counters, values remain visible without JS
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const suffix = el.dataset.suffix || '';
    let started = false;
    const animate = () => {
      if (started || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      started = true;
      const start = performance.now();
      const duration = 1000;
      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target < 10 ? (target * eased).toFixed(1) : Math.round(target * eased);
        el.textContent = value + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { animate(); obs.disconnect(); } }, { threshold:.4 });
      obs.observe(el);
    }
  });
})();
