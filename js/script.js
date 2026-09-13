document.addEventListener('DOMContentLoaded',()=>{
  const header=document.querySelector('.site-header');
  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();
  const onScroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>30);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  }));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('is-visible');
  }),{threshold:.12});
  document.querySelectorAll('.project,.service,.process-grid>div,.principle-copy p').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
});
