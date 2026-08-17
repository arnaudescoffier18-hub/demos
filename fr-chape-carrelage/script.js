(() => {
  const doc = document.documentElement;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileCallbar = document.querySelector('.mobile-callbar');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setScrollState = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle('scrolled', y > 22);
    if (progress) {
      const max = Math.max(1, doc.scrollHeight - innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    }
    if (mobileCallbar) {
      const nearFooter = y + innerHeight > doc.scrollHeight - 260;
      mobileCallbar.classList.toggle('is-hidden', nearFooter);
    }
  };
  setScrollState();
  addEventListener('scroll', setScrollState, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    header?.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
  }));

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 55}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const viewport = document.querySelector('.reviews-viewport');
  const next = document.querySelector('.review-next');
  const prev = document.querySelector('.review-prev');
  const scrollReview = dir => {
    if (!viewport) return;
    const card = viewport.querySelector('.review-card');
    const amount = (card?.getBoundingClientRect().width || 420) + 16;
    viewport.scrollBy({ left: dir * amount, behavior: reduced ? 'auto' : 'smooth' });
  };
  next?.addEventListener('click', () => scrollReview(1));
  prev?.addEventListener('click', () => scrollReview(-1));

  // Gentle auto-advance; stops while the visitor is interacting.
  let reviewTimer;
  const startReviewAuto = () => {
    if (reduced || !viewport || innerWidth < 700) return;
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft > max - 30) viewport.scrollTo({ left: 0, behavior: 'smooth' });
      else scrollReview(1);
    }, 6200);
  };
  startReviewAuto();
  viewport?.addEventListener('mouseenter', () => clearInterval(reviewTimer));
  viewport?.addEventListener('mouseleave', startReviewAuto);
  viewport?.addEventListener('pointerdown', () => clearInterval(reviewTimer), { passive: true });

  // Keep only one FAQ open at a time for a compact mobile experience.
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item[open]').forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  if (!reduced && innerWidth > 900) {
    const medias = [...document.querySelectorAll('[data-parallax] img')];
    let ticking = false;
    const parallax = () => {
      const center = innerHeight / 2;
      medias.forEach(img => {
        const box = img.parentElement.getBoundingClientRect();
        const delta = (box.top + box.height / 2 - center) * -0.025;
        img.style.transform = `scale(1.045) translate3d(0,${delta}px,0)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  // Cursor accent only on precise pointing devices.
  if (matchMedia('(pointer:fine)').matches && innerWidth >= 1000 && !reduced) {
    const ring = document.querySelector('.cursor-ring');
    let tx = -100, ty = -100, x = -100, y = -100;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const loop = () => {
      x += (tx - x) * .18; y += (ty - y) * .18;
      ring.style.transform = `translate3d(${x - 18}px,${y - 18}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a,button,summary,.gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  // Subtle magnetic buttons on desktop; disabled on touch/reduced motion.
  if (matchMedia('(pointer:fine)').matches && !reduced) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .08;
        const y = (e.clientY - r.top - r.height/2) * .12;
        btn.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }
})();
