
(()=>{
  const q=(s,p=document)=>p.querySelector(s), qa=(s,p=document)=>[...p.querySelectorAll(s)];
  // Add JS-enhanced state only after script successfully started.
  document.documentElement.classList.add('js');
  const menu=q('.menu-btn'), mobile=q('.mobile-nav');
  if(menu&&mobile){menu.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰'});qa('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));}
  qa('.faq-item').forEach(item=>{const b=q('.faq-q',item);if(!b)return;b.addEventListener('click',()=>{const open=item.classList.toggle('open');b.setAttribute('aria-expanded',String(open));});});
  // Pointer tilt, desktop only.
  if(matchMedia('(pointer:fine)').matches){qa('[data-tilt]').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*2.2}deg) rotateY(${x*2.8}deg) translateY(-3px)`});card.addEventListener('mouseleave',()=>card.style.transform='');});}
  // Review drag support.
  qa('.review-row').forEach(row=>{let down=false,startX=0,sl=0;row.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;sl=row.scrollLeft;row.setPointerCapture(e.pointerId)});row.addEventListener('pointermove',e=>{if(down)row.scrollLeft=sl-(e.clientX-startX)});row.addEventListener('pointerup',()=>down=false);});
  // Quote wizard progressive enhancement.
  const wizard=q('[data-wizard]');
  if(wizard){const steps=qa('.wizard-step',wizard), bar=q('.progress span',wizard);let idx=0;const state={};
    const show=()=>{steps.forEach((s,i)=>s.classList.toggle('active',i===idx));if(bar)bar.style.width=`${((idx+1)/steps.length)*100}%`;q('[data-step-label]',wizard)?.replaceChildren(document.createTextNode(`Étape ${idx+1} / ${steps.length}`));window.scrollTo({top:wizard.getBoundingClientRect().top+window.scrollY-110,behavior:'smooth'});};
    const val=(name)=>{const el=q(`[name="${name}"]`,wizard);return el?el.value:''};
    qa('[data-next]',wizard).forEach(btn=>btn.addEventListener('click',()=>{const step=steps[idx];let valid=true;qa('[required]',step).forEach(el=>{if(!el.value){el.reportValidity();valid=false}});if(!valid)return; idx=Math.min(idx+1,steps.length-1); if(idx===steps.length-1){const formula=q('[name="formula"]',wizard);const list=q('.summary-list',wizard);if(list){list.innerHTML=`<li><span>Départ</span><strong>${esc(val('depart'))||'—'}</strong></li><li><span>Arrivée</span><strong>${esc(val('arrivee'))||'—'}</strong></li><li><span>Date</span><strong>${esc(val('date'))||'—'}</strong></li><li><span>Volume estimé</span><strong>${esc(val('volume'))||'À préciser'}</strong></li><li><span>Formule</span><strong>${formula?esc(formula.value):'À définir'}</strong></li>`;}} show();}));
    qa('[data-prev]',wizard).forEach(btn=>btn.addEventListener('click',()=>{idx=Math.max(0,idx-1);show()}));
    qa('[data-formula]',wizard).forEach(btn=>btn.addEventListener('click',()=>{qa('[data-formula]',wizard).forEach(b=>b.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');q('[name="formula"]',wizard).value=btn.dataset.formula;}));
    const form=q('form',wizard);if(form)form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form);const rows=[...fd.entries()].filter(([,v])=>String(v).trim()).map(([k,v])=>`${k}: ${v}`);const subject=encodeURIComponent('Demande de devis déménagement - '+(fd.get('nom')||''));const body=encodeURIComponent('Bonjour TDS Déménagement,\n\nVoici ma demande :\n\n'+rows.join('\n')+'\n\nMerci.');location.href=`mailto:contact@tds-toulouse.fr?subject=${subject}&body=${body}`;toast('Votre demande est prête à être envoyée par e-mail.');});show();}
  // Generic contact forms use mailto but still work without a backend.
  qa('form[data-mailto]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form);const rows=[...fd.entries()].map(([k,v])=>`${k}: ${v}`);location.href=`mailto:contact@tds-toulouse.fr?subject=${encodeURIComponent('Contact site TDS Déménagement')}&body=${encodeURIComponent(rows.join('\n'))}`;toast('Ouverture de votre messagerie…');}));
  function toast(t){let el=q('.status-toast');if(!el){el=document.createElement('div');el.className='status-toast';el.setAttribute('role','status');document.body.appendChild(el)}el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3500)}
  function esc(s){return String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
})();
