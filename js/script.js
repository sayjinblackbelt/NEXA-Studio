document.addEventListener('DOMContentLoaded',()=>{
 const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
 const header=document.querySelector('.site-header');
 const scroll=()=>header&&header.classList.toggle('is-scrolled',scrollY>30); scroll(); addEventListener('scroll',scroll,{passive:true});
 const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.12});
 document.querySelectorAll('.project,.service,.process-grid>div,.principle-copy p').forEach(e=>reveal.observe(e));
 document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
   const id=tab.dataset.tab; document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active');
   document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
   history.replaceState(null,'','#'+id);
 }));
 const hash=location.hash.slice(1); const initial=document.querySelector(`.tab[data-tab="${hash}"]`); if(initial) initial.click();
 document.querySelectorAll('.check input').forEach(input=>input.addEventListener('change',()=>{const key='nexa-'+input.id;localStorage.setItem(key,input.checked?'1':'0')}));
 document.querySelectorAll('.check input').forEach(input=>{input.checked=localStorage.getItem('nexa-'+input.id)==='1'});
 document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{const action=el.dataset.action; const out=document.getElementById('tool-output'); if(out) out.textContent=action==='briefing'?'Briefing protótipo aberto: defina problema, objetivo, público e entregáveis.':action==='diagnosis'?'Diagnóstico protótipo: contexto → problema → oportunidade → direção.':action==='proposal'?'Proposta protótipo: solução, escopo, prazo e investimento.':'Case protótipo: contexto → processo → solução → resultado.';}));
});