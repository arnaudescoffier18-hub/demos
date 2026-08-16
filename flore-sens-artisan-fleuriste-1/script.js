document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const progress = document.querySelector('.page-progress span');
const menuBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
  if (!menuBtn || !menu) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  menu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = [...document.querySelectorAll('.reveal')];
if (!reduceMotion && 'IntersectionObserver' in window) {
  reveals.forEach(el => el.classList.add('reveal-ready'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
  reveals.forEach(el => io.observe(el));

} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

const carousel = document.querySelector('[data-carousel]');
const prev = document.querySelector('[data-prev]');
const next = document.querySelector('[data-next]');
const cardWidth = () => carousel?.querySelector('.review-card')?.getBoundingClientRect().width || 420;
prev?.addEventListener('click', () => carousel.scrollBy({ left: -(cardWidth() + 16), behavior: 'smooth' }));
next?.addEventListener('click', () => carousel.scrollBy({ left: cardWidth() + 16, behavior: 'smooth' }));

let autoTimer;
const startAuto = () => {
  if (!carousel || reduceMotion || window.innerWidth < 760) return;
  stopAuto();
  autoTimer = setInterval(() => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= max - 10) carousel.scrollTo({ left: 0, behavior: 'smooth' });
    else carousel.scrollBy({ left: cardWidth() + 16, behavior: 'smooth' });
  }, 5200);
};
const stopAuto = () => autoTimer && clearInterval(autoTimer);
carousel?.addEventListener('mouseenter', stopAuto);
carousel?.addEventListener('mouseleave', startAuto);
carousel?.addEventListener('touchstart', stopAuto, { passive: true });
startAuto();

if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .12;
      const y = (e.clientY - r.top - r.height / 2) * .12;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}
