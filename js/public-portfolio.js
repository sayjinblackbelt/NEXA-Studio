(() => {
  const root = document.querySelector('#public-portfolio');
  if (!root) return;
  const filters = document.querySelector('#portfolio-filters');
  const dataUrl = new URL('./data/portfolio.json', window.location.href).href;
  let projects = [];
  let active = 'Todos';
  const imageFor = p => `assets/mockups/${encodeURIComponent(p.id)}.svg`;
  const materialImageFor = (p, file) => `assets/mockups/${encodeURIComponent(file)}`;
  const style = document.createElement('style');
  style.textContent = `
    .hero{background:radial-gradient(circle at 78% 42%,rgba(34,211,238,.13),transparent 18%),radial-gradient(circle at 68% 55%,rgba(139,92,246,.34),transparent 28%),var(--ink)}
    .hero-art{perspective:1000px}.hero-art:before{content:'';position:absolute;width:520px;height:520px;border:1px solid rgba(34,211,238,.2);border-radius:50%;transform:rotateX(62deg) rotateZ(18deg);animation:heroOrbit 18s linear infinite}.hero-art:after{content:'NEXA / CREATIVE SYSTEM';position:absolute;right:4%;top:10%;font:500 .62rem 'Space Grotesk';letter-spacing:.18em;color:rgba(242,239,232,.45)}
    .orb{background:radial-gradient(circle at 32% 25%,#fff 0 2%,#d9ff00 8%,#8b5cf6 45%,#22d3ee 72%,#08080a 100%);box-shadow:0 0 90px rgba(139,92,246,.45),0 0 160px rgba(34,211,238,.18);animation:float 6s ease-in-out infinite,orbPulse 4s ease-in-out infinite}
    .ring-a{border-color:rgba(34,211,238,.55)}.ring-b{border-color:rgba(217,255,0,.38)}
    .public-case-grid{align-items:start}.case-card{position:relative;background:#0d0e11;border-color:#292b30;transform-style:preserve-3d;will-change:transform}.case-card:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.07) 45%,transparent 65%);transform:translateX(-120%);transition:transform .65s ease}.case-card:hover:after{transform:translateX(120%)}
    .case-art{height:360px;background:#111;isolation:isolate;overflow:hidden}.case-art img{width:100%;height:100%;object-fit:contain;display:block;transition:transform .8s cubic-bezier(.2,.7,.2,1),filter .5s;filter:saturate(.9)}.case-card:hover .case-art img{transform:scale(1.035);filter:saturate(1.15)}.case-art:after{content:'CONCEPT / NEXA';position:absolute;right:15px;bottom:14px;z-index:2;font-size:.56rem;letter-spacing:.14em;color:rgba(255,255,255,.65);mix-blend-mode:difference}.case-art small{z-index:3}.case-body{position:relative;z-index:2}.case-body h3{font-size:clamp(2rem,3.5vw,3.1rem)}.case-link{transition:letter-spacing .25s}.case-link:hover{letter-spacing:.16em}
    .case-dialog>.case-art{height:390px}.case-dialog>.case-art img{object-fit:contain}.case-dialog{box-shadow:0 30px 100px rgba(0,0,0,.55)}
    .case-materials{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:26px}.case-material{display:block;position:relative;overflow:hidden;background:#101114;border:1px solid #292b30;min-height:150px}.case-material img{width:100%;height:100%;min-height:150px;object-fit:cover;display:block;transition:transform .55s ease,filter .4s}.case-material:hover img{transform:scale(1.045);filter:brightness(1.08)}.case-material span{position:absolute;left:12px;bottom:10px;padding:6px 8px;background:rgba(5,5,5,.78);color:#f2f2ee;font-size:.62rem;letter-spacing:.08em;text-transform:uppercase}.case-materials-title{margin-top:28px;color:#8f939b;font-size:.7rem;letter-spacing:.16em}
    @keyframes heroOrbit{to{transform:rotateX(62deg) rotateZ(378deg)}}@keyframes orbPulse{50%{filter:brightness(1.15)}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.case-card{transform:none!important}}
    @media(max-width:800px){.hero-art:before{width:360px;height:360px}.hero-art:after{right:0;top:4%;font-size:.5rem}.case-art{height:300px;padding:10px}.case-art img{object-fit:contain}.case-dialog>.case-art{height:250px;padding:8px}.case-materials{grid-template-columns:1fr}.case-material,.case-material img{min-height:190px}}
  `;
  document.head.appendChild(style);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const categories = () => ['Todos', ...new Set(projects.map(p => p.category))];
  const art = p => `<div class="case-art art-${esc(p.accent)}"><img src="${imageFor(p)}" alt="Mockup conceitual do projeto ${esc(p.name)}" loading="lazy"><small>NEXA / ${esc(p.category)}</small></div>`;
  const materials = p => Array.isArray(p.materials) && p.materials.length ? `<div class="case-materials-title">VISUAL MATERIALS / ${p.materials.length}</div><div class="case-materials">${p.materials.map(m => `<a class="case-material" href="${materialImageFor(p,m.file)}" target="_blank" rel="noopener" aria-label="Abrir ${esc(m.label)}"><img src="${materialImageFor(p,m.file)}" alt="${esc(m.label)} — ${esc(p.name)}" loading="lazy"><span>${esc(m.label)}</span></a>`).join('')}</div>` : '';
  const renderFilters = () => { filters.innerHTML = categories().map(c => `<button class="case-filter ${c===active?'active':''}" data-case-filter="${esc(c)}">${esc(c)}</button>`).join(''); };
  const render = () => {
    const list = active === 'Todos' ? projects : projects.filter(p => p.category === active);
    root.innerHTML = list.map(p => `<article class="case-card ${p.featured?'featured':''}" data-tilt>${art(p)}<div class="case-body"><div class="case-meta"><span>${esc(p.category)}</span><span>${p.featured?'FEATURED':'CONCEPT'}</span></div><h3>${esc(p.name)}</h3><p class="case-type">${esc(p.type)}</p><p>${esc(p.description)}</p><div class="case-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><button class="case-link" data-case="${esc(p.id)}">Explorar projeto <span>↗</span></button></div></article>`).join('');
    bindTilt();
  };
  const open = p => {
    const modal=document.createElement('div'); modal.className='case-modal';
    modal.innerHTML=`<div class="case-modal-backdrop"></div><div class="case-dialog" role="dialog" aria-modal="true" aria-label="${esc(p.name)}"><button class="case-close" aria-label="Fechar">×</button>${art(p)}<div class="case-dialog-content"><p class="kicker">${esc(p.category)} / CONCEPT CASE</p><h2>${esc(p.name)}</h2><p class="dialog-lead">${esc(p.description)}</p><div class="dialog-grid"><div><small>DISCIPLINA</small><strong>${esc(p.type)}</strong></div><div><small>DIREÇÃO</small><strong>Estratégia + design + tecnologia</strong></div><div><small>STATUS</small><strong>Projeto conceitual</strong></div></div><div class="case-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>${materials(p)}</div></div>`;
    document.body.appendChild(modal); requestAnimationFrame(()=>modal.classList.add('is-open'));
    const close=()=>{modal.classList.remove('is-open');setTimeout(()=>modal.remove(),220)};
    modal.querySelector('.case-close').addEventListener('click',close); modal.querySelector('.case-modal-backdrop').addEventListener('click',close);
    document.addEventListener('keydown',function key(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',key)}});
  };
  const bindTilt = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer:coarse)').matches) return;
    root.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; card.style.transform=`perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-6px)`; });
      card.addEventListener('pointerleave', () => { card.style.transform=''; });
    });
  };
  filters.addEventListener('click',e=>{const b=e.target.closest('[data-case-filter]');if(!b)return;active=b.dataset.caseFilter;renderFilters();render()});
  root.addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b){const p=projects.find(x=>x.id===b.dataset.case);if(p)open(p)}});
  fetch(dataUrl,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{projects=data;renderFilters();render()}).catch(()=>{root.innerHTML='<div class="case-empty">Portfolio conceitual indisponível no momento.</div>'});
})();