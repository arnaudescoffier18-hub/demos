(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const stickyCall = document.querySelector('.sticky-call');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 22);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    if (stickyCall) stickyCall.classList.toggle('is-visible', window.innerWidth > 680 || y > 260);
    if (window.innerWidth <= 980 && y > 140 && mobileMenu && !mobileMenu.classList.contains('open')) {
      if (y > lastY + 8) header.style.transform = 'translateY(-100%)';
      if (y < lastY - 8) header.style.transform = '';
    } else if (header) header.style.transform = '';
    lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    mobileMenu?.classList.toggle('open', !open);
    menuBtn.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open'); menuBtn?.setAttribute('aria-expanded','false');
  }));

  const reviewTrack = document.getElementById('reviews-track');
  const nextReview = document.querySelector('.next-review');
  const prevReview = document.querySelector('.prev-review');
  const reviewStep = () => Math.min(580, window.innerWidth * .86);
  nextReview?.addEventListener('click', () => reviewTrack?.scrollBy({left:reviewStep(),behavior:'smooth'}));
  prevReview?.addEventListener('click', () => reviewTrack?.scrollBy({left:-reviewStep(),behavior:'smooth'}));
  let reviewTimer;
  const startReviews = () => {
    if (reduceMotion || !reviewTrack) return;
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => {
      const atEnd = reviewTrack.scrollLeft + reviewTrack.clientWidth >= reviewTrack.scrollWidth - 30;
      reviewTrack.scrollTo({left: atEnd ? 0 : reviewTrack.scrollLeft + reviewStep(), behavior:'smooth'});
    }, 6000);
  };
  reviewTrack?.addEventListener('mouseenter', () => clearInterval(reviewTimer));
  reviewTrack?.addEventListener('mouseleave', startReviews);
  reviewTrack?.addEventListener('touchstart', () => clearInterval(reviewTimer), {passive:true});
  reviewTrack?.addEventListener('touchend', startReviews, {passive:true});
  startReviews();

  const galleryImages = [
    'assets/images/photo-01.jpg','assets/images/photo-02.jpg','assets/images/photo-03.jpg','assets/images/photo-04.jpg',
    'assets/images/photo-05.jpg','assets/images/photo-06.jpg','assets/images/photo-07.jpg','assets/images/photo-08.jpg',
    'assets/images/photo-09.jpg','assets/images/photo-10.jpg','assets/images/chantier-pose-carrelage.jpg','assets/images/terrasse-carrelage.jpg'
  ];
  const dialog = document.getElementById('lightbox');
  const lightboxImg = dialog?.querySelector('img');
  const lightboxCount = document.getElementById('lightbox-count');
  let currentIndex = 0;
  const showImage = (src) => {
    currentIndex = Math.max(0, galleryImages.indexOf(src));
    if (lightboxImg) lightboxImg.src = galleryImages[currentIndex];
    if (lightboxCount) lightboxCount.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    if (dialog && !dialog.open) dialog.showModal();
  };
  document.querySelectorAll('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => showImage(btn.dataset.lightbox)));
  document.querySelector('[data-open-gallery]')?.addEventListener('click', () => showImage(galleryImages[0]));
  dialog?.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
  const moveLightbox = (dir) => { currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length; showImage(galleryImages[currentIndex]); };
  dialog?.querySelector('.lightbox-next')?.addEventListener('click', () => moveLightbox(1));
  dialog?.querySelector('.lightbox-prev')?.addEventListener('click', () => moveLightbox(-1));
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (e) => { if (!dialog?.open) return; if (e.key === 'ArrowRight') moveLightbox(1); if (e.key === 'ArrowLeft') moveLightbox(-1); });

  if (!reduceMotion) {
    const hero = document.querySelector('.hero');
    const project = document.querySelector('.hero-project-card');
    window.addEventListener('pointermove', (e) => {
      if (!hero || !project || window.innerWidth < 980) return;
      const x = (e.clientX / window.innerWidth - .5) * 8;
      const y = (e.clientY / window.innerHeight - .5) * 8;
      project.style.translate = `${x}px ${y}px`;
    }, {passive:true});
  }
})();
