(() => {
  document.documentElement.classList.add('js-ready');

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (menuToggle && mobileMenu) {
    const setMenu = (open) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
    };
    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const glow = document.querySelector('.cursor-glow');
  if (glow && !reduceMotion) {
    window.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse') {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    }, { passive: true });
  }

  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.10;
        const y = (e.clientY - r.top - r.height / 2) * 0.10;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  const depthEls = [...document.querySelectorAll('[data-depth]')];
  const paraImgs = [...document.querySelectorAll('.parallax-image img')];
  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    depthEls.forEach(el => {
      const d = Number(el.dataset.depth || 0);
      el.style.transform = `translate3d(0, ${y * d}px, 0)${el.classList.contains('hero-photo-secondary') ? ' rotate(-3deg)' : ''}`;
    });
    paraImgs.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(-1, Math.min(1, (r.top + r.height/2 - vh/2) / vh));
      img.style.transform = `translateY(${(-7 - progress * 5)}%) scale(1.03)`;
    });
    ticking = false;
  };
  if (!reduceMotion) {
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  const slider = document.querySelector('.reviews-slider');
  if (slider) {
    let down = false, startX = 0, startScroll = 0;
    slider.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') {
        down = true; startX = e.clientX; startScroll = slider.scrollLeft; slider.setPointerCapture(e.pointerId);
      }
    });
    slider.addEventListener('pointermove', e => { if (down) slider.scrollLeft = startScroll - (e.clientX - startX); });
    const up = () => { down = false; };
    slider.addEventListener('pointerup', up); slider.addEventListener('pointercancel', up); slider.addEventListener('pointerleave', up);
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item[open]').forEach(other => { if (other !== item) other.removeAttribute('open'); });
    });
  });
})();
