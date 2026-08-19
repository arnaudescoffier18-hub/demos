document.documentElement.classList.add('js');
function bertonInit(){
const header=document.querySelector('.site-header');
let lastY=window.scrollY;
window.addEventListener('scroll',()=>{const y=window.scrollY; header?.classList.toggle('scrolled',y>16); if(innerWidth<=720 && y>120){header.style.transform=(y>lastY && y-lastY>3)?'translateY(-110%)':'translateY(0)'}else if(header){header.style.transform=''} lastY=y;},{passive:true});
const menuBtn=document.querySelector('.menu-btn'),mobileNav=document.querySelector('.mobile-nav');
menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
// Reviews: progressive enhancement; all cards remain readable without JS.
const reviews=document.querySelector('.reviews');
document.querySelector('[data-next]')?.addEventListener('click',()=>reviews?.scrollBy({left:470,behavior:'smooth'}));
document.querySelector('[data-prev]')?.addEventListener('click',()=>reviews?.scrollBy({left:-470,behavior:'smooth'}));
let reviewTimer;if(reviews && matchMedia('(prefers-reduced-motion: no-preference)').matches){const start=()=>reviewTimer=setInterval(()=>{if(reviews.scrollLeft+reviews.clientWidth>=reviews.scrollWidth-40)reviews.scrollTo({left:0,behavior:'smooth'});else reviews.scrollBy({left:470,behavior:'smooth'});},6500);start();reviews.addEventListener('mouseenter',()=>clearInterval(reviewTimer));reviews.addEventListener('mouseleave',start);}
// Decorative parallax only on images; no essential content is hidden.
if(matchMedia('(prefers-reduced-motion: no-preference)').matches){const pics=[...document.querySelectorAll('[data-parallax]')];window.addEventListener('scroll',()=>{for(const el of pics){const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){el.style.transform=`translateY(${(r.top-innerHeight/2)*-.025}px)`}}},{passive:true});}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',bertonInit,{once:true});}else{bertonInit();}
