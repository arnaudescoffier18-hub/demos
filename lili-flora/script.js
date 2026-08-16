(() => {
  document.documentElement.classList.add('js');
  const header = document.getElementById('siteHeader');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mobileCall = document.querySelector('.mobile-call');
  const setHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 36);
    mobileCall?.classList.toggle('show', window.scrollY > Math.min(420, innerHeight * .45));
  };
  setHeader();
  addEventListener('scroll', setHeader, {passive:true});

  if (menuBtn && mobileMenu) {
    const closeMenu = () => { menuBtn.setAttribute('aria-expanded','false'); mobileMenu.classList.remove('open'); };
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('open', !open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){ entry.target.classList.add('inview'); io.unobserve(entry.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -45px'});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  if (!reduceMotion) {
    const medias = [...document.querySelectorAll('.parallax-media img')];
    let ticking = false;
    const parallax = () => {
      const vh = innerHeight;
      medias.forEach(img => {
        const box = img.parentElement.getBoundingClientRect();
        if(box.bottom < 0 || box.top > vh) return;
        const progress = (box.top + box.height/2 - vh/2) / vh;
        img.style.transform = `translate3d(0, ${progress * -32}px, 0) scale(1.025)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if(!ticking){ requestAnimationFrame(parallax); ticking = true; } }, {passive:true});
    parallax();
  }

  const reviewTrack = document.getElementById('reviewsTrack');
  if (reviewTrack) {
    const step = () => Math.min(580, reviewTrack.clientWidth * .9);
    document.querySelector('.review-nav.prev')?.addEventListener('click', () => reviewTrack.scrollBy({left:-step(),behavior:'smooth'}));
    document.querySelector('.review-nav.next')?.addEventListener('click', () => reviewTrack.scrollBy({left:step(),behavior:'smooth'}));
    if (!reduceMotion) {
      let timer;
      const start = () => {
        stop();
        timer = setInterval(() => {
          const atEnd = reviewTrack.scrollLeft + reviewTrack.clientWidth >= reviewTrack.scrollWidth - 12;
          reviewTrack.scrollTo({left: atEnd ? 0 : reviewTrack.scrollLeft + step(), behavior:'smooth'});
        }, 5400);
      };
      const stop = () => clearInterval(timer);
      reviewTrack.addEventListener('mouseenter', stop);
      reviewTrack.addEventListener('mouseleave', start);
      reviewTrack.addEventListener('focusin', stop);
      reviewTrack.addEventListener('focusout', start);
      reviewTrack.addEventListener('touchstart', stop, {passive:true});
      reviewTrack.addEventListener('touchend', () => setTimeout(start, 1800), {passive:true});
      start();
    }
  }

  const gallery = document.querySelector('.gallery-marquee');
  if (gallery) {
    let down=false,startX=0,startScroll=0;
    gallery.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;startScroll=gallery.scrollLeft;gallery.setPointerCapture(e.pointerId)});
    gallery.addEventListener('pointermove',e=>{if(down)gallery.scrollLeft=startScroll-(e.clientX-startX)});
    gallery.addEventListener('pointerup',()=>down=false); gallery.addEventListener('pointercancel',()=>down=false);
  }

  if (!reduceMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*-5;
        const ry=((e.clientX-r.left)/r.width-.5)*6;
        card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r=el.getBoundingClientRect();
        el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`;
      });
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
    const glow=document.querySelector('.cursor-glow');
    if(glow) addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
  }
})();
