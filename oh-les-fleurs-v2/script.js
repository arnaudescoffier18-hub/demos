(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  const onScroll = () => {
    const y = window.scrollY || 0;
    header?.classList.toggle('scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      header?.classList.toggle('menu-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded','false');
      nav.classList.remove('open');
      header?.classList.remove('menu-open');
      document.body.style.overflow = '';
    }));
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        menuBtn.setAttribute('aria-expanded','false'); nav.classList.remove('open'); header?.classList.remove('menu-open'); document.body.style.overflow=''; menuBtn.focus();
      }
    });
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -5%'});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  if (!reduceMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const cursor = document.querySelector('.flower-cursor');
    if (cursor) {
      let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
      document.addEventListener('mousemove', e => {tx=e.clientX; ty=e.clientY;}, {passive:true});
      const tick = () => {cx += (tx-cx)*.22; cy += (ty-cy)*.22; cursor.style.left=cx+'px'; cursor.style.top=cy+'px'; requestAnimationFrame(tick)};
      tick();
      document.querySelectorAll('a,button,summary,.gallery-item').forEach(el => {
        el.addEventListener('mouseenter',()=>cursor.classList.add('active'));
        el.addEventListener('mouseleave',()=>cursor.classList.remove('active'));
      });
    }

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        const img = card.querySelector('.service-photo');
        if (img) img.style.transform = `perspective(1000px) rotateY(${x*1.5}deg) rotateX(${-y*1.5}deg)`;
      });
      card.addEventListener('mouseleave',()=>{const img=card.querySelector('.service-photo'); if(img) img.style.transform='';});
    });

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px, ${(e.clientY-r.top-r.height/2)*.08}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave',()=>btn.style.transform='');
    });
  }

  // Smooth accordion behavior while remaining fully usable without JS.
  document.querySelectorAll('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach(other => {
        if (other !== detail) other.removeAttribute('open');
      });
    });
  });

  // Enable enhanced CSS states only after the interaction layer was initialized.
  document.documentElement.classList.add('js');
})();
