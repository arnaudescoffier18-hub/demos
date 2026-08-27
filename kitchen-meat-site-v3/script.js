(() => {
  const root = document.documentElement;
  root.classList.add('motion-ready');

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-panel');
  const glow = document.querySelector('.cursor-glow');
  const menuButton = document.querySelector('.menu-poster-wrap');
  const dialog = document.querySelector('.menu-dialog');
  const dialogClose = document.querySelector('.dialog-close');
  const reviews = document.querySelector('.reviews-scroller');

  const closeNav = () => {
    nav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  navToggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -4% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  if (matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches && glow) {
    addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .12;
        const y = (e.clientY - r.top - r.height / 2) * .12;
        btn.style.transform = `translate(${x}px,${y}px)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }

  const openDialog = () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('dialog-open');
  };
  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('dialog-open');
  };
  menuButton?.addEventListener('click', openDialog);
  dialogClose?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });
  dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

  if (reviews && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    let paused = false;
    let touched = false;
    let last = performance.now();
    reviews.addEventListener('pointerenter', () => paused = true);
    reviews.addEventListener('pointerleave', () => paused = false);
    reviews.addEventListener('pointerdown', () => { touched = true; paused = true; });
    reviews.addEventListener('pointerup', () => { setTimeout(() => { touched = false; paused = false; }, 900); });
    reviews.addEventListener('wheel', () => { paused = true; clearTimeout(reviews._resume); reviews._resume = setTimeout(() => paused = false, 1600); }, { passive: true });

    const step = (now) => {
      const dt = Math.min(40, now - last);
      last = now;
      if (!paused && !touched && reviews.scrollWidth > reviews.clientWidth) {
        reviews.scrollLeft += dt * 0.025;
        if (reviews.scrollLeft >= reviews.scrollWidth - reviews.clientWidth - 2) reviews.scrollLeft = 0;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
})();
