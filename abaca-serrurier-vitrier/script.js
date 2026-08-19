(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  let lastY = window.scrollY;

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  window.addEventListener('scroll', () => {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 12);
    if (window.innerWidth <= 760 && y > 120) {
      header.classList.toggle('mobile-hidden', y > lastY + 8);
    } else {
      header.classList.remove('mobile-hidden');
    }
    if (y < lastY - 8) header.classList.remove('mobile-hidden');
    lastY = y;
  }, { passive: true });

  const animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    animated.forEach(el => io.observe(el));
  } else {
    animated.forEach(el => el.classList.add('is-in'));
  }

  const track = document.querySelector('.review-track');
  const prev = document.querySelector('[data-review-prev]');
  const next = document.querySelector('[data-review-next]');
  if (track) {
    const slide = direction => track.scrollBy({ left: direction * Math.min(450, track.clientWidth * .86), behavior: 'smooth' });
    prev?.addEventListener('click', () => slide(-1));
    next?.addEventListener('click', () => slide(1));
    let auto;
    const start = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(auto);
      auto = setInterval(() => {
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft > max - 30) track.scrollTo({ left: 0, behavior: 'smooth' });
        else slide(1);
      }, 5600);
    };
    const stop = () => clearInterval(auto);
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    track.addEventListener('touchstart', stop, { passive: true });
    track.addEventListener('touchend', start, { passive: true });
    start();
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
