document.documentElement.classList.add('js');
function bertonInit(){
const header=document.querySelector('.site-header');
let lastY=window.scrollY;
window.addEventListener('scroll',()=>{const y=window.scrollY; header?.classList.toggle('scrolled',y>16); if(innerWidth<=720 && y>120){header.style.transform=(y>lastY && y-lastY>3)?'translateY(-110%)':'translateY(0)'}else if(header){header.style.transform=''} lastY=y;},{passive:true});
const menuBtn=document.querySelector('.menu-btn'),mobileNav=document.querySelector('.mobile-nav');
menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const truckHolder=document.createElement('div');truckHolder.className='scroll-truck-track';truckHolder.setAttribute('aria-hidden','true');
const truck=document.createElement('div');truck.className='scroll-truck';truck.setAttribute('aria-hidden','true');
truck.innerHTML=`<svg viewBox="0 0 120 78" role="presentation"><g class="scroll-truck-bounce"><rect class="truck-body truck-outline" x="10" y="22" width="62" height="29" rx="8"></rect><path class="truck-cabin truck-outline" d="M72 30h20l18 14v7H72z"></path><rect class="truck-window" x="84" y="34" width="12" height="8" rx="2"></rect><rect class="truck-accent" x="18" y="29" width="34" height="5" rx="2.5"></rect><circle class="truck-wheel scroll-truck-wheel" cx="32" cy="57" r="10"></circle><circle class="truck-wheel scroll-truck-wheel" cx="84" cy="57" r="10"></circle><circle class="truck-wheel-inner" cx="32" cy="57" r="4.2"></circle><circle class="truck-wheel-inner" cx="84" cy="57" r="4.2"></circle></g></svg>`;
document.body.append(truckHolder,truck);
const updateTruck=()=>{if(!truck||!truckHolder)return;const doc=Math.max(document.documentElement.scrollHeight-window.innerHeight,1);const progress=Math.min(1,Math.max(0,window.scrollY/doc));const trackRect=truckHolder.getBoundingClientRect();const truckHeight=truck.getBoundingClientRect().height||44;const minY=trackRect.top;const maxY=Math.max(minY,trackRect.bottom-truckHeight);const y=minY+(maxY-minY)*progress;truck.style.transform=`translate3d(0,${Math.round(y)}px,0)`;};
let truckTicking=false;const onTruckScroll=()=>{if(truckTicking)return;truckTicking=true;requestAnimationFrame(()=>{updateTruck();truckTicking=false;});};
window.addEventListener('scroll',onTruckScroll,{passive:true});window.addEventListener('resize',updateTruck);updateTruck();
// Reviews: progressive enhancement; all cards remain readable without JS.
const reviews=document.querySelector('.reviews');
document.querySelector('[data-next]')?.addEventListener('click',()=>reviews?.scrollBy({left:470,behavior:'smooth'}));
document.querySelector('[data-prev]')?.addEventListener('click',()=>reviews?.scrollBy({left:-470,behavior:'smooth'}));
let reviewTimer;if(reviews && matchMedia('(prefers-reduced-motion: no-preference)').matches){const start=()=>reviewTimer=setInterval(()=>{if(reviews.scrollLeft+reviews.clientWidth>=reviews.scrollWidth-40)reviews.scrollTo({left:0,behavior:'smooth'});else reviews.scrollBy({left:470,behavior:'smooth'});},6500);start();reviews.addEventListener('mouseenter',()=>clearInterval(reviewTimer));reviews.addEventListener('mouseleave',start);}
// Decorative parallax only on images; no essential content is hidden.
if(!reduceMotion){const pics=[...document.querySelectorAll('[data-parallax]')];window.addEventListener('scroll',()=>{for(const el of pics){const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){el.style.transform=`translateY(${(r.top-innerHeight/2)*-.025}px)`}}},{passive:true});}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',bertonInit,{once:true});}else{bertonInit();}
