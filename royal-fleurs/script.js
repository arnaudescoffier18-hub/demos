(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const progress = document.querySelector('#scrollProgress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 24);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  const closeMenu = () => {
    menuButton?.classList.remove('active');
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  };
  menuButton?.addEventListener('click', () => {
    const open = !mobileMenu?.classList.contains('open');
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu?.classList.toggle('open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item[open]').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });

  const track = document.querySelector('.reviews-track');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const line = document.querySelector('.carousel-line span');
  const cards = track ? [...track.querySelectorAll('.review-card')] : [];
  let reviewIndex = 0;
  let autoTimer;

  const goToReview = (index) => {
    if (!track || !cards.length) return;
    reviewIndex = (index + cards.length) % cards.length;
    const card = cards[reviewIndex];
    track.scrollTo({left: card.offsetLeft - track.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth'});
    if (line) line.style.transform = `translateX(${reviewIndex * 100}%)`;
  };
  prev?.addEventListener('click', () => goToReview(reviewIndex - 1));
  next?.addEventListener('click', () => goToReview(reviewIndex + 1));

  if (track && !reducedMotion) {
    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goToReview(reviewIndex + 1), 6500);
    };
    const stopAuto = () => clearInterval(autoTimer);
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    track.addEventListener('touchstart', stopAuto, {passive:true});
    track.addEventListener('touchend', startAuto, {passive:true});
    track.addEventListener('scroll', () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, dist = Infinity;
      cards.forEach((card, i) => {
        const d = Math.abs(card.offsetLeft + card.clientWidth/2 - center);
        if (d < dist) {dist = d; best = i;}
      });
      reviewIndex = best;
      if (line) line.style.transform = `translateX(${reviewIndex * 100}%)`;
    }, {passive:true});
    startAuto();
  }

  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .12;
        const y = (e.clientY - r.top - r.height/2) * .12;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });

    const tilt = document.querySelector('.tilt-card');
    tilt?.addEventListener('mousemove', e => {
      const r = tilt.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5)*-6;
      const ry = ((e.clientX-r.left)/r.width-.5)*8;
      tilt.style.animationPlayState = 'paused';
      tilt.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(2deg)`;
    });
    tilt?.addEventListener('mouseleave', () => {
      tilt.style.animationPlayState = '';
      tilt.style.transform = '';
    });
  }
})();
