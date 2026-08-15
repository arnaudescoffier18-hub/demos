(() => {
  const root = document.documentElement;
  root.classList.add('js-enhanced');

  const header = document.querySelector('.site-header');
  const heroImg = document.querySelector('.hero-photo img');
  const parallaxCards = [...document.querySelectorAll('[data-parallax]')];

  let ticking = false;
  const updateScrollEffects = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle('scrolled', y > 28);
    if (heroImg && y < window.innerHeight * 1.15) {
      heroImg.style.transform = `scale(${1.04 + Math.min(y / 7000, .045)}) translateY(${Math.min(y * .035, 26)}px)`;
    }
    parallaxCards.forEach(card => {
      const rect = card.parentElement.getBoundingClientRect();
      const speed = Number(card.dataset.parallax || 0);
      const delta = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
      card.style.transform = `translate3d(0, ${Math.max(-18, Math.min(18, delta))}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScrollEffects); ticking = true; }
  }, { passive: true });
  updateScrollEffects();

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -40px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  const menu = document.querySelector('.mobile-menu');
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.removeAttribute('open')));
  document.addEventListener('click', (event) => {
    if (menu?.open && !menu.contains(event.target)) menu.removeAttribute('open');
  });

  const viewport = document.querySelector('[data-carousel]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  if (viewport) {
    const step = () => Math.min(536, viewport.clientWidth * .88);
    prev?.addEventListener('click', () => viewport.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => viewport.scrollBy({ left: step(), behavior: 'smooth' }));

    let autoTimer;
    const start = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 8;
        viewport.scrollTo({ left: atEnd ? 0 : viewport.scrollLeft + step(), behavior: 'smooth' });
      }, 5200);
    };
    const stop = () => clearInterval(autoTimer);
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    viewport.addEventListener('touchstart', stop, { passive: true });
    viewport.addEventListener('touchend', start, { passive: true });
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', start);
    start();
  }
})();
