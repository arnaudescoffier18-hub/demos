(() => {
  const header = document.getElementById('header');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && menu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Ouvrir le menu');
      menu.hidden = true;
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      menu.hidden = false;
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Fermer le menu');
      document.body.style.overflow = 'hidden';
    };
    menuButton.addEventListener('click', () => {
      menuButton.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 1000) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 });
    revealItems.forEach(item => io.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const viewport = document.querySelector('.reviews-viewport');
  if (viewport) {
    let pressed = false, startX = 0, startScroll = 0;
    viewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') {
        pressed = true;
        startX = e.clientX;
        startScroll = viewport.scrollLeft;
        viewport.setPointerCapture?.(e.pointerId);
      }
    });
    viewport.addEventListener('pointermove', e => {
      if (!pressed) return;
      viewport.scrollLeft = startScroll - (e.clientX - startX);
    });
    ['pointerup','pointercancel','pointerleave'].forEach(type => viewport.addEventListener(type, () => pressed = false));
  }

  document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('details[open]').forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });
})();
