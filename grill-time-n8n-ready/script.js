(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu: no body scroll locking, so scrolling can never get stuck.
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeNav = () => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    mobileNav.classList.remove('open');
  };
  toggle?.addEventListener('click', () => {
    const next = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? 'Fermer le menu' : 'Ouvrir le menu');
    mobileNav?.classList.toggle('open', next);
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  addEventListener('resize', () => { if (innerWidth > 1024) closeNav(); }, {passive:true});

  // Lightweight reveal: transform only, text stays visible at all times.
  const motions = [...document.querySelectorAll('.motion')];
  if (!reduced && 'IntersectionObserver' in window) {
    motions.forEach(el => el.dataset.motion = 'pending');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          entry.target.dataset.motion = 'done';
          io.unobserve(entry.target);
        }
      });
    }, {threshold: .06, rootMargin: '0px 0px -20px'});
    motions.forEach(el => io.observe(el));
  } else motions.forEach(el => el.classList.add('is-in'));

  // Hero parallax with one rAF per frame. It never changes document flow.
  const heroImg = document.querySelector('.hero-photo img');
  if (heroImg && !reduced && matchMedia('(min-width:761px)').matches) {
    let ticking = false;
    const update = () => {
      const y = Math.min(scrollY, innerHeight);
      heroImg.style.transform = `translate3d(0,${y * 0.045}px,0) scale(1.035)`;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, {passive:true});
  }

  // Small decorative sparks — isolated from layout.
  const sparkField = document.querySelector('.hero-spark-field');
  if (sparkField && !reduced) {
    const amount = innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < amount; i++) {
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.setProperty('--x', `${42 + Math.random() * 56}%`);
      s.style.setProperty('--d', `${6 + Math.random() * 6}s`);
      s.style.setProperty('--delay', `${-Math.random() * 9}s`);
      s.style.setProperty('--drift', `${-35 + Math.random() * 70}px`);
      sparkField.appendChild(s);
    }
  }

  // Reviews use native scrolling (no transform track), for fluid touch scrolling.
  const scroller = document.querySelector('.review-scroller');
  const cards = [...document.querySelectorAll('.review')];
  const prev = document.querySelector('.review-prev');
  const next = document.querySelector('.review-next');
  if (scroller && cards.length) {
    let index = 0;
    let timer = null;
    const gap = 14;
    const step = () => cards[0].getBoundingClientRect().width + gap;
    const go = (dir) => {
      const max = cards.length - 1;
      index = dir > 0 ? (index >= max ? 0 : index + 1) : (index <= 0 ? max : index - 1);
      scroller.scrollTo({left:index * step(), behavior: reduced ? 'auto' : 'smooth'});
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => { stop(); if (!reduced) timer = setInterval(() => go(1), 5200); };
    prev?.addEventListener('click', () => { go(-1); start(); });
    next?.addEventListener('click', () => { go(1); start(); });
    scroller.addEventListener('pointerdown', stop, {passive:true});
    scroller.addEventListener('pointerup', start, {passive:true});
    scroller.addEventListener('mouseenter', stop);
    scroller.addEventListener('mouseleave', start);
    scroller.addEventListener('focusin', stop);
    scroller.addEventListener('focusout', start);
    start();
  }
})();
