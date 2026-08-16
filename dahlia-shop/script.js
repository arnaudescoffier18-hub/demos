document.documentElement.classList.add('js');

(() => {
  const header = document.getElementById('siteHeader');
  const progress = document.querySelector('.scroll-progress span');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobileNav');
  const callBar = document.querySelector('.mobile-call-bar');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle('scrolled', y > 30);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    if (callBar) callBar.style.transform = y < 130 ? 'translateY(120%)' : 'translateY(0)';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
    mobileNav.classList.remove('open');
    header?.classList.remove('menu-active');
    document.body.classList.remove('menu-open');
  };
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    if (open) return closeMenu();
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Fermer le menu');
    mobileNav?.classList.add('open');
    header?.classList.add('menu-active');
    document.body.classList.add('menu-open');
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });

  // Progressive reveal: content stays readable before/without JS.
  const revealTargets = document.querySelectorAll('.reveal-photo, .reveal-line');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .18, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // Pointer tilt, intentionally restrained so text is never affected.
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const strength = Number(card.dataset.tilt || 3);
      let frame;
      card.addEventListener('pointermove', e => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5;
          const y = (e.clientY - r.top) / r.height - .5;
          card.style.transform = `perspective(900px) rotateX(${(-y * strength).toFixed(2)}deg) rotateY(${(x * strength).toFixed(2)}deg) translateZ(0)`;
        });
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    const bloom = document.querySelector('.cursor-bloom');
    if (bloom) {
      window.addEventListener('pointermove', e => {
        bloom.style.left = `${e.clientX}px`;
        bloom.style.top = `${e.clientY}px`;
        bloom.classList.add('visible');
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', () => bloom.classList.remove('visible'));
    }

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * .08}px, ${y * .1}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // Reviews: gentle auto-drift on desktop, pause when user interacts.
  const scroller = document.getElementById('reviewsScroller');
  if (scroller && !reduceMotion && window.innerWidth > 820) {
    let paused = false;
    let last = performance.now();
    const drift = now => {
      const dt = now - last; last = now;
      if (!paused) {
        scroller.scrollLeft += dt * .012;
        const max = scroller.scrollWidth - scroller.clientWidth;
        if (scroller.scrollLeft >= max - 2) scroller.scrollTo({ left: 0, behavior: 'smooth' });
      }
      requestAnimationFrame(drift);
    };
    ['pointerenter','focusin','pointerdown','wheel'].forEach(evt => scroller.addEventListener(evt, () => paused = true, { passive: true }));
    ['pointerleave','focusout'].forEach(evt => scroller.addEventListener(evt, () => paused = false, { passive: true }));
    requestAnimationFrame(drift);
  }

  // Gallery lightbox.
  const dialog = document.getElementById('lightbox');
  const dialogImg = dialog?.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!dialog || !dialogImg || typeof dialog.showModal !== 'function') return;
      dialogImg.src = btn.dataset.lightbox;
      dialogImg.alt = btn.querySelector('img')?.alt || 'Photo agrandie de Dahlia Shop';
      dialog.showModal();
    });
  });
  dialog?.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });
})();
