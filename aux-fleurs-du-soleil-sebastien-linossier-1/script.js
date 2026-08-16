(() => {
  document.documentElement.classList.add('js-enhanced');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const revealEls = [...document.querySelectorAll('.reveal')];
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const cursor = document.querySelector('.petal-cursor');
  const carousel = document.querySelector('.review-carousel');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 70);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : '0%';
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if ('IntersectionObserver' in window && !reduced) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -4% 0px'});
    revealEls.forEach(el => obs.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  const closeMenu = () => {
    menuBtn?.setAttribute('aria-expanded','false');
    menuBtn?.setAttribute('aria-label','Ouvrir le menu');
    if (mobileMenu) mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu(); else {
      menuBtn.setAttribute('aria-expanded','true'); menuBtn.setAttribute('aria-label','Fermer le menu');
      mobileMenu.hidden = false; document.body.classList.add('menu-open');
    }
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  document.querySelectorAll('.faq-item').forEach(d => d.addEventListener('toggle', () => {
    if (!d.open) return;
    document.querySelectorAll('.faq-item').forEach(other => { if (other !== d) other.open = false; });
  }));

  if (carousel) {
    let down=false, startX=0, startLeft=0;
    carousel.addEventListener('pointerdown', e => { down=true; startX=e.clientX; startLeft=carousel.scrollLeft; carousel.setPointerCapture?.(e.pointerId); });
    carousel.addEventListener('pointermove', e => { if(down) carousel.scrollLeft = startLeft - (e.clientX-startX); });
    ['pointerup','pointercancel','pointerleave'].forEach(ev => carousel.addEventListener(ev, () => down=false));
    if (!reduced) {
      let autoDir=1, paused=false;
      const auto = () => {
        if (!paused && !down && innerWidth > 760) {
          carousel.scrollLeft += .35 * autoDir;
          if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4) autoDir=-1;
          if (carousel.scrollLeft <= 1) autoDir=1;
        }
        requestAnimationFrame(auto);
      };
      carousel.addEventListener('mouseenter',()=>paused=true); carousel.addEventListener('mouseleave',()=>paused=false); auto();
    }
  }

  if (!reduced && matchMedia('(pointer:fine)').matches) {
    let cx=-100,cy=-100,tx=-100,ty=-100,rot=0;
    addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; cursor.style.opacity='.8'; }, {passive:true});
    addEventListener('mouseleave',()=>cursor.style.opacity='0');
    const tick=()=>{cx += (tx-cx)*.16; cy += (ty-cy)*.16; rot += .7; cursor.style.transform=`translate(${cx-6}px,${cy-11}px) rotate(${rot}deg)`; requestAnimationFrame(tick)}; tick();
    document.querySelectorAll('a,button,summary').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cursor.style.width='20px';cursor.style.height='34px'});
      el.addEventListener('mouseleave',()=>{cursor.style.width='12px';cursor.style.height='22px'});
    });
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect(); const x=(e.clientX-r.left-r.width/2)*.12; const y=(e.clientY-r.top-r.height/2)*.12; el.style.transform=`translate(${x}px,${y}px)`; });
      el.addEventListener('mouseleave',()=>el.style.transform='');
    });
  }

  if (!reduced) {
    addEventListener('scroll', () => {
      const y = scrollY;
      document.querySelectorAll('.hero-sun').forEach(el => el.style.transform=`translate(-50%, calc(-50% + ${y*.05}px))`);
      document.querySelectorAll('.gallery-card').forEach((el,i)=>{
        if(innerWidth>760 && el.classList.contains('is-visible')) el.style.translate=`0 ${Math.sin((y+i*180)/700)*10}px`;
      });
    }, {passive:true});
  }
})();