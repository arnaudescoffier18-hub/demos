(() => {
  document.documentElement.classList.add('has-js');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  syncHeader();
  addEventListener('scroll', syncHeader, {passive:true});

  const closeMenu = () => {
    nav?.classList.remove('open'); toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded','false'); document.body.style.overflow='';
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : '';
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    }), {threshold:.15});
    document.querySelectorAll('.image-reveal').forEach(el => io.observe(el));
  }

  const carousel = document.querySelector('.review-carousel');
  const cards = [...document.querySelectorAll('.review-card')];
  const prev = document.querySelector('.review-prev');
  const next = document.querySelector('.review-next');
  const progress = document.querySelector('.review-progress span');
  const cardStep = () => (cards[0]?.getBoundingClientRect().width || 420) + 18;
  const updateProgress = () => {
    if(!carousel || !progress) return;
    const max = carousel.scrollWidth - carousel.clientWidth;
    const pct = max ? Math.min(100, Math.max(20, (carousel.scrollLeft / max) * 100)) : 100;
    progress.style.width = pct + '%';
  };
  prev?.addEventListener('click', () => carousel.scrollBy({left:-cardStep(),behavior:'smooth'}));
  next?.addEventListener('click', () => carousel.scrollBy({left:cardStep(),behavior:'smooth'}));
  carousel?.addEventListener('scroll', updateProgress,{passive:true}); updateProgress();

  let auto;
  const startAuto = () => {
    if(reduceMotion || innerWidth < 821 || !carousel) return;
    stopAuto(); auto=setInterval(() => {
      const max = carousel.scrollWidth - carousel.clientWidth;
      if(carousel.scrollLeft >= max - 8) carousel.scrollTo({left:0,behavior:'smooth'});
      else carousel.scrollBy({left:cardStep(),behavior:'smooth'});
    }, 5200);
  };
  const stopAuto = () => auto && clearInterval(auto);
  carousel?.addEventListener('mouseenter', stopAuto); carousel?.addEventListener('mouseleave', startAuto);
  startAuto();

  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach(btn => btn.addEventListener('click', () => {
    if(!lightbox || !lightboxImg) return;
    lightboxImg.src = btn.dataset.image; lightboxImg.alt = btn.querySelector('img')?.alt || 'Photo fleuriste';
    lightbox.showModal();
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', e => { if(e.target === lightbox) lightbox.close(); });

  if(!reduceMotion && matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect(); const x=(e.clientX-r.left-r.width/2)*.09; const y=(e.clientY-r.top-r.height/2)*.12; el.style.transform=`translate(${x}px,${y}px)`; });
      el.addEventListener('mouseleave', () => el.style.transform='');
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
