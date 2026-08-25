(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const dialog = document.querySelector('[data-menu-dialog]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive:true});

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuToggle?.setAttribute('aria-expanded','false');
  }));

  document.querySelectorAll('[data-open-menu]').forEach(btn => btn.addEventListener('click', () => {
    if (dialog?.showModal) { dialog.showModal(); document.body.classList.add('no-scroll'); }
  }));
  document.querySelector('[data-close-menu]')?.addEventListener('click', () => dialog.close());

  // Zoom de la carte illustrée dans la fenêtre plein écran.
  const menuImage = document.querySelector('[data-menu-image]');
  const menuScroll = document.querySelector('[data-menu-scroll]');
  const zoomLevel = document.querySelector('[data-menu-zoom-reset]');
  let menuZoom = 1;
  const applyMenuZoom = () => {
    if (!menuImage) return;
    menuImage.style.width = `${menuZoom * 100}%`;
    menuImage.classList.toggle('is-zoomed', menuZoom > 1);
    if (zoomLevel) zoomLevel.textContent = `${Math.round(menuZoom * 100)}%`;
  };
  document.querySelector('[data-menu-zoom-in]')?.addEventListener('click', () => {
    menuZoom = Math.min(2.2, +(menuZoom + .2).toFixed(1));
    applyMenuZoom();
  });
  document.querySelector('[data-menu-zoom-out]')?.addEventListener('click', () => {
    menuZoom = Math.max(.8, +(menuZoom - .2).toFixed(1));
    applyMenuZoom();
  });
  zoomLevel?.addEventListener('click', () => { menuZoom = 1; applyMenuZoom(); menuScroll?.scrollTo({top:0,left:0,behavior:'smooth'}); });
  menuImage?.addEventListener('click', () => { menuZoom = menuZoom > 1 ? 1 : 1.6; applyMenuZoom(); });

  dialog?.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('no-scroll');
    menuZoom = 1;
    applyMenuZoom();
    menuScroll?.scrollTo({top:0,left:0});
  });

  // Effet de profondeur léger sur la carte visible dans la page.
  const tiltMenu = document.querySelector('[data-menu-tilt]');
  if (tiltMenu && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const tiltImg = tiltMenu.querySelector('img');
    tiltMenu.addEventListener('pointermove', e => {
      const r = tiltMenu.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * 5;
      const ry = (x - 0.5) * 6;
      tiltMenu.style.setProperty('--gx', `${x * 100}%`);
      tiltMenu.style.setProperty('--gy', `${y * 100}%`);
      tiltMenu.style.setProperty('--rx', `${rx}deg`);
      tiltMenu.style.setProperty('--ry', `${ry}deg`);
    });
    tiltMenu.addEventListener('pointerleave', () => {
      tiltMenu.style.setProperty('--rx', '0deg');
      tiltMenu.style.setProperty('--ry', '0deg');
    });
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    }), {threshold:.08, rootMargin:'0px 0px -30px'});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  if (!reduceMotion) {
    const photos = [...document.querySelectorAll('.hero-photo')];
    let photoIndex = 0;
    setInterval(() => {
      photos[photoIndex].classList.remove('active');
      photoIndex = (photoIndex + 1) % photos.length;
      photos[photoIndex].classList.add('active');
    }, 5200);
  }

  const strip = document.querySelector('[data-drag-scroll]');
  if (strip) {
    let down = false, startX = 0, startLeft = 0;
    strip.addEventListener('pointerdown', e => { down = true; startX = e.clientX; startLeft = strip.scrollLeft; strip.classList.add('dragging'); strip.setPointerCapture(e.pointerId); });
    strip.addEventListener('pointermove', e => { if (!down) return; strip.scrollLeft = startLeft - (e.clientX - startX); });
    const end = () => { down = false; strip.classList.remove('dragging'); };
    strip.addEventListener('pointerup', end); strip.addEventListener('pointercancel', end); strip.addEventListener('pointerleave', end);
  }


  // Avis : défilement horizontal vers la droite, contrôles et glisser-déposer.
  const reviewScroller = document.querySelector('[data-review-scroll]');
  const reviewPrev = document.querySelector('[data-review-prev]');
  const reviewNext = document.querySelector('[data-review-next]');
  if (reviewScroller) {
    const reviewCards = [...reviewScroller.querySelectorAll('.review-slide')];
    let reviewIndex = 0;
    let reviewTimer = null;
    let reviewDown = false, reviewStartX = 0, reviewStartLeft = 0;
    const gap = 18;
    const cardStep = () => (reviewCards[0]?.getBoundingClientRect().width || 0) + gap;
    const goReview = (index, behavior = 'smooth') => {
      if (!reviewCards.length) return;
      reviewIndex = (index + reviewCards.length) % reviewCards.length;
      reviewScroller.scrollTo({left: reviewIndex * cardStep(), behavior});
    };
    const stopReviews = () => { if (reviewTimer) clearInterval(reviewTimer); reviewTimer = null; };
    const startReviews = () => {
      stopReviews();
      if (reduceMotion || reviewCards.length < 2) return;
      reviewTimer = setInterval(() => goReview(reviewIndex + 1), 5200);
    };
    reviewPrev?.addEventListener('click', () => { goReview(reviewIndex - 1); startReviews(); });
    reviewNext?.addEventListener('click', () => { goReview(reviewIndex + 1); startReviews(); });
    reviewScroller.addEventListener('pointerdown', e => {
      reviewDown = true; reviewStartX = e.clientX; reviewStartLeft = reviewScroller.scrollLeft;
      reviewScroller.classList.add('dragging'); stopReviews();
      if (e.pointerType === 'mouse') reviewScroller.setPointerCapture(e.pointerId);
    });
    reviewScroller.addEventListener('pointermove', e => {
      if (!reviewDown || e.pointerType !== 'mouse') return;
      reviewScroller.scrollLeft = reviewStartLeft - (e.clientX - reviewStartX);
    });
    const endReviews = () => {
      if (!reviewDown) return;
      reviewDown = false; reviewScroller.classList.remove('dragging');
      reviewIndex = Math.round(reviewScroller.scrollLeft / Math.max(1, cardStep()));
      startReviews();
    };
    reviewScroller.addEventListener('pointerup', endReviews);
    reviewScroller.addEventListener('pointercancel', endReviews);
    reviewScroller.addEventListener('mouseenter', stopReviews);
    reviewScroller.addEventListener('mouseleave', startReviews);
    reviewScroller.addEventListener('focusin', stopReviews);
    reviewScroller.addEventListener('focusout', startReviews);
    reviewScroller.addEventListener('scroll', () => {
      if (!reviewDown) reviewIndex = Math.round(reviewScroller.scrollLeft / Math.max(1, cardStep()));
    }, {passive:true});
    startReviews();
  }

  document.querySelectorAll('.faq-item').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item[open]').forEach(other => { if (other !== item) other.removeAttribute('open'); });
  }));

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
