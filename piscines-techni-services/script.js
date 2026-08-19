(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuBtn = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 24);
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    if (progress) progress.style.width = `${Math.min(100, y / max * 100)}%`;
    if (innerWidth <= 860 && y > 120 && y > lastY + 8 && !menu?.classList.contains('is-open')) header.style.transform = 'translateY(-110%)';
    else if (y < lastY - 8 || y < 120) header.style.transform = '';
    lastY = y;
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const closeMenu = () => {
    menuBtn?.classList.remove('is-open'); menu?.classList.remove('is-open');
    menuBtn?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  };
  menuBtn?.addEventListener('click', () => {
    const open = !menu?.classList.contains('is-open');
    menuBtn.classList.toggle('is-open', open); menu?.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open)); menu?.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const reveals = [...document.querySelectorAll('.reveal')];
    reveals.forEach(el => el.classList.add('will-animate'));
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}
    }), {threshold:.12, rootMargin:'0px 0px -35px'});
    reveals.forEach(el => io.observe(el));
    setTimeout(() => reveals.forEach(el => el.classList.add('is-visible')), 2200);
  }

  const viewport = document.querySelector('.reviews-viewport');
  const step = () => Math.min(485, innerWidth * .82);
  document.querySelector('.review-btn.next')?.addEventListener('click',()=>viewport?.scrollBy({left:step(),behavior:'smooth'}));
  document.querySelector('.review-btn.prev')?.addEventListener('click',()=>viewport?.scrollBy({left:-step(),behavior:'smooth'}));
  let reviewTimer;
  const startReviews = () => {
    if(reduced || !viewport || innerWidth < 700) return;
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => {
      const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 20;
      viewport.scrollTo({left:atEnd ? 0 : viewport.scrollLeft + step(),behavior:'smooth'});
    }, 5000);
  };
  viewport?.addEventListener('mouseenter',()=>clearInterval(reviewTimer));
  viewport?.addEventListener('mouseleave',startReviews); startReviews();

  document.querySelectorAll('.faq-list details').forEach(d => d.addEventListener('toggle', () => {
    if(d.open) document.querySelectorAll('.faq-list details').forEach(other => { if(other !== d) other.open = false; });
  }));

  const hero = document.querySelector('.hero');
  const heroMedia = document.querySelector('.hero-media');
  const heroTurbulence = document.getElementById('hero-turbulence');
  const heroDisplacement = document.getElementById('hero-displacement');
  if(hero && heroMedia && heroTurbulence && heroDisplacement && !reduced && matchMedia('(pointer:fine)').matches){
    let currentX = .5, currentY = .42, targetX = .5, targetY = .42;
    let currentScale = 0, targetScale = 0, raf = null;

    const loop = () => {
      currentX += (targetX - currentX) * .08;
      currentY += (targetY - currentY) * .08;
      currentScale += (targetScale - currentScale) * .09;
      heroMedia.style.setProperty('--pointer-x', `${(currentX * 100).toFixed(2)}%`);
      heroMedia.style.setProperty('--pointer-y', `${(currentY * 100).toFixed(2)}%`);
      heroMedia.style.setProperty('--hero-shift-x', `${((currentX - .5) * 18).toFixed(2)}px`);
      heroMedia.style.setProperty('--hero-shift-y', `${((currentY - .45) * 14).toFixed(2)}px`);
      heroTurbulence.setAttribute('baseFrequency', `${(0.01 + currentX * 0.007).toFixed(4)} ${(0.022 + currentY * 0.01).toFixed(4)}`);
      heroDisplacement.setAttribute('scale', currentScale.toFixed(2));
      if(Math.abs(targetX - currentX) < .001 && Math.abs(targetY - currentY) < .001 && Math.abs(targetScale - currentScale) < .08 && targetScale === 0){
        heroMedia.style.setProperty('--hero-shift-x', '0px');
        heroMedia.style.setProperty('--hero-shift-y', '0px');
        heroDisplacement.setAttribute('scale', '0');
        raf = null;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => { if(!raf) raf = requestAnimationFrame(loop); };
    hero.addEventListener('pointerenter', () => { targetScale = 18; start(); });
    hero.addEventListener('pointermove', e => {
      const rect = heroMedia.getBoundingClientRect();
      targetX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      targetY = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      targetScale = 22;
      start();
    });
    hero.addEventListener('pointerleave', () => {
      targetX = .5; targetY = .42; targetScale = 0; start();
    });
  }
})();
