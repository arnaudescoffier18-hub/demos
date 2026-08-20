
document.documentElement.classList.add('js-enhanced');

const header=document.querySelector('.site-header');
const progress=document.querySelector('.top-progress');
let lastY=window.scrollY;
function onScroll(){
  const y=window.scrollY;
  header?.classList.toggle('scrolled',y>20);
  if(innerWidth<680 && y>140){
    header.style.transform=(y>lastY && y-lastY>2)?'translateY(-110%)':'translateY(0)';
  } else if(header){header.style.transform='translateY(0)'}
  lastY=y;
  const h=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.width=(h>0?Math.min(100,(y/h)*100):0)+'%';
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();

const menuBtn=document.querySelector('.menu-btn');
const panel=document.querySelector('.mobile-panel');
menuBtn?.addEventListener('click',()=>{
  const open=panel.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
});
panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{panel.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));

document.querySelectorAll('.faq-button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const willOpen=!item.classList.contains('open');
    item.classList.toggle('open',willOpen);
    btn.setAttribute('aria-expanded',String(willOpen));
  })
});

const observed=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('inview');io.unobserve(e.target)}})
  },{threshold:.12});
  observed.forEach(el=>io.observe(el));
}else{observed.forEach(el=>el.classList.add('inview'))}

document.querySelectorAll('.before-after').forEach(box=>{
  const after=box.querySelector('.after'), line=box.querySelector('.ba-line'), handle=box.querySelector('.ba-handle');
  const set=(clientX)=>{
    const r=box.getBoundingClientRect();
    const pct=Math.max(5,Math.min(95,((clientX-r.left)/r.width)*100));
    after.style.clipPath=`inset(0 ${100-pct}% 0 0)`;
    line.style.left=pct+'%'; handle.style.left=pct+'%';
  };
  let down=false;
  box.addEventListener('pointerdown',e=>{down=true;box.setPointerCapture(e.pointerId);set(e.clientX)});
  box.addEventListener('pointermove',e=>{if(down)set(e.clientX)});
  box.addEventListener('pointerup',()=>down=false); box.addEventListener('pointercancel',()=>down=false);
});

const heroVisual=document.querySelector('.hero-visual');
if(heroVisual && matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
  heroVisual.addEventListener('pointermove',e=>{
    const r=heroVisual.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    const main=heroVisual.querySelector('.hero-photo-main'), small=heroVisual.querySelector('.hero-photo-small');
    if(main) main.style.transform=`rotate(${2.2+x*1.2}deg) translate(${x*8}px,${y*8}px)`;
    if(small) small.style.transform=`rotate(${-4-x}deg) translate(${-x*8}px,${-y*8}px)`;
  });
  heroVisual.addEventListener('pointerleave',()=>{
    const main=heroVisual.querySelector('.hero-photo-main'), small=heroVisual.querySelector('.hero-photo-small');
    if(main) main.style.transform='rotate(2.2deg)';
    if(small) small.style.transform='rotate(-4deg)';
  });
}

const mailForm=document.querySelector('#contact-form');
mailForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(mailForm);
  const subject=encodeURIComponent('Demande depuis le site — '+(d.get('objet')||'Projet'));
  const body=encodeURIComponent(`Nom : ${d.get('nom')||''}\nTéléphone : ${d.get('telephone')||''}\nE-mail : ${d.get('email')||''}\n\n${d.get('message')||''}`);
  location.href=`mailto:techniquefacade@icloud.com?subject=${subject}&body=${body}`;
});
