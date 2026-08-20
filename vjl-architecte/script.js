(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.mobile-panel');
  let lastY = window.scrollY;

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      if (window.innerWidth <= 820 && y > 130 && y > lastY + 4) header.classList.add('header-hidden');
      else if (y < lastY - 4 || y < 130) header.classList.remove('header-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const revealEls = [...document.querySelectorAll('.reveal, .reveal-scale')];
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -5% 0px'});
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-in'));

  // Pointer ring on desktop
  const cursor = document.querySelector('.cursor-dot');
  if (cursor && matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion) {
    window.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }, {passive:true});
    document.querySelectorAll('a,button,.project-card,summary').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // Gentle auto-scroll for reviews; users can still swipe/drag naturally.
  document.querySelectorAll('[data-review-scroll]').forEach(wrap => {
    const track = wrap.querySelector('.reviews-track');
    if (!track || reduceMotion) return;
    let paused = false;
    let x = 0;
    let raf;
    const loop = () => {
      if (!paused && window.innerWidth > 760) {
        x += .32;
        const half = track.scrollWidth / 2;
        if (x >= half) x = 0;
        track.style.transform = `translate3d(${-x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    wrap.addEventListener('mouseenter', () => paused = true);
    wrap.addEventListener('mouseleave', () => paused = false);
    wrap.addEventListener('touchstart', () => { paused = true; track.style.transform = ''; }, {passive:true});
    raf = requestAnimationFrame(loop);
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf), {once:true});
  });

  // Architectural lightbox (progressive enhancement)
  const dialog = document.querySelector('#project-lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    const lbImg = dialog.querySelector('img');
    const lbTitle = dialog.querySelector('[data-lb-title]');
    document.querySelectorAll('.project-card[data-full]').forEach(card => {
      card.tabIndex = 0;
      const open = () => {
        lbImg.src = card.dataset.full;
        lbImg.alt = card.dataset.alt || '';
        lbTitle.textContent = card.dataset.title || '';
        dialog.showModal();
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    dialog.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  }

  // Subtle hero parallax only on precise pointers
  const heroVisual = document.querySelector('.hero-visual img');
  if (heroVisual && matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion) {
    const area = heroVisual.closest('.hero-visual');
    area.addEventListener('mousemove', e => {
      const r = area.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width - .5;
      const py = (e.clientY-r.top)/r.height - .5;
      heroVisual.style.transform = `scale(1.06) translate(${px*-7}px,${py*-7}px)`;
    });
    area.addEventListener('mouseleave', () => heroVisual.style.transform = '');
  }
})();
