(() => {
  const root = document.documentElement;
  root.classList.add('js-enhanced');

  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastY = window.scrollY;

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 18);
    if (window.innerWidth <= 820) {
      header?.classList.toggle('is-hidden', y > 140 && y > lastY + 6 && !mobileMenu?.classList.contains('is-open'));
      if (y < lastY - 6) header?.classList.remove('is-hidden');
    } else {
      header?.classList.remove('is-hidden');
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
    lastY = y;
  };
  window.addEventListener('scroll', updateScrollUI, {passive:true});
  window.addEventListener('resize', updateScrollUI, {passive:true});
  updateScrollUI();

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileMenu?.classList.toggle('is-open', !open);
    menuToggle.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('click', e => {
    if (!mobileMenu?.classList.contains('is-open')) return;
    if (!mobileMenu.contains(e.target) && !menuToggle?.contains(e.target)) {
      mobileMenu.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded','false');
    }
  });

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(el => el.classList.add('pre-reveal'));
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        entry.target.classList.remove('pre-reveal');
        io.unobserve(entry.target);
      }
    }), {threshold:.08, rootMargin:'0px 0px -30px'});
    revealItems.forEach(el => io.observe(el));
    setTimeout(() => revealItems.forEach(el => {el.classList.add('is-revealed'); el.classList.remove('pre-reveal');}), 1800);
  }

  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = `perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });

    const heroVisual = document.querySelector('[data-hero-visual]');
    heroVisual?.addEventListener('pointermove', e => {
      const r = heroVisual.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width-.5)*14;
      const y = ((e.clientY-r.top)/r.height-.5)*10;
      heroVisual.style.transform = `translate3d(${x*.25}px,${y*.25}px,0)`;
      heroVisual.querySelectorAll('.hero-photo-side').forEach((el,i) => el.style.translate = `${x*(i?-.35:.35)}px ${y*(i?-.35:.35)}px`);
    });
    heroVisual?.addEventListener('pointerleave', () => {
      heroVisual.style.transform='';
      heroVisual.querySelectorAll('.hero-photo-side').forEach(el => el.style.translate='');
    });
  }

  const viewport = document.getElementById('reviewsViewport');
  const track = document.getElementById('reviewsTrack');
  if (track && viewport && window.innerWidth > 900 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    [...track.children].forEach(node => track.appendChild(node.cloneNode(true)));
    track.classList.add('auto-scroll');
  }
  const scrollReviews = dir => viewport?.scrollBy({left:dir * Math.min(450, viewport.clientWidth * .84),behavior:'smooth'});
  document.getElementById('reviewPrev')?.addEventListener('click',()=>scrollReviews(-1));
  document.getElementById('reviewNext')?.addEventListener('click',()=>scrollReviews(1));

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  document.querySelectorAll('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = btn.dataset.lightbox;
    lightbox.showModal();
  }));
  document.getElementById('lightboxClose')?.addEventListener('click',()=>lightbox?.close());
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});

  // Current open/closed status based on Europe/Paris, purely additive; opening hours remain visible without JS.
  const status = document.getElementById('openStatus');
  try {
    const parts = new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    const day = parts.find(p=>p.type==='weekday')?.value.toLowerCase();
    const hour = Number(parts.find(p=>p.type==='hour')?.value || 0);
    const minute = Number(parts.find(p=>p.type==='minute')?.value || 0);
    const mins = hour*60+minute;
    const weekdays = ['lun.','mar.','mer.','jeu.','ven.'];
    let open = weekdays.includes(day) && mins >= 540 && mins < 1140;
    if (day === 'sam.') open = mins >= 540 && mins < 960;
    if (status) { status.textContent = open ? 'Ouvert actuellement' : 'Fermé actuellement'; status.style.color = open ? '#168451' : '#8b5550'; }
  } catch {}
})();
