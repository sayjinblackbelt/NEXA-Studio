(() => {
  const root = document.querySelector('#public-portfolio');
  if (!root) return;
  const filters = document.querySelector('#portfolio-filters');
  const dataUrl = new URL('./data/portfolio.json', window.location.href).href;
  let projects = [];
  let active = 'Todos';

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const categories = () => ['Todos', ...new Set(projects.map(p => p.category))];
  const art = p => `<div class="case-art art-${esc(p.accent)}"><span>${esc(p.name.slice(0,1))}</span><small>NEXA / ${esc(p.category)}</small><i></i></div>`;
  const renderFilters = () => { filters.innerHTML = categories().map(c => `<button class="case-filter ${c===active?'active':''}" data-case-filter="${esc(c)}">${esc(c)}</button>`).join(''); };
  const render = () => {
    const list = active === 'Todos' ? projects : projects.filter(p => p.category === active);
    root.innerHTML = list.map(p => `<article class="case-card ${p.featured?'featured':''}">${art(p)}<div class="case-body"><div class="case-meta"><span>${esc(p.category)}</span><span>${p.featured?'01 / 08':'—'}</span></div><h3>${esc(p.name)}</h3><p class="case-type">${esc(p.type)}</p><p>${esc(p.description)}</p><div class="case-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><button class="case-link" data-case="${esc(p.id)}">Ver projeto <span>↗</span></button></div></article>`).join('');
  };
  const open = p => {
    const modal = document.createElement('div');
    modal.className = 'case-modal';
    modal.innerHTML = `<div class="case-modal-backdrop"></div><div class="case-dialog" role="dialog" aria-modal="true" aria-label="${esc(p.name)}"><button class="case-close" aria-label="Fechar">×</button>${art(p)}<div class="case-dialog-content"><p class="kicker">${esc(p.category)} / CONCEPT CASE</p><h2>${esc(p.name)}</h2><p class="dialog-lead">${esc(p.description)}</p><div class="dialog-grid"><div><small>DISCIPLINA</small><strong>${esc(p.type)}</strong></div><div><small>DIREÇÃO</small><strong>Estratégia + design + tecnologia</strong></div><div><small>STATUS</small><strong>Projeto conceitual</strong></div></div><div class="case-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></div>`;
    document.body.appendChild(modal); requestAnimationFrame(() => modal.classList.add('is-open'));
    const close = () => { modal.classList.remove('is-open'); setTimeout(() => modal.remove(), 220); };
    modal.querySelector('.case-close').addEventListener('click', close); modal.querySelector('.case-modal-backdrop').addEventListener('click', close); document.addEventListener('keydown', function escKey(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',escKey)}});
  };
  filters.addEventListener('click', e => { const b=e.target.closest('[data-case-filter]'); if(!b)return; active=b.dataset.caseFilter; renderFilters(); render(); });
  root.addEventListener('click', e => { const b=e.target.closest('[data-case]'); if(b){const p=projects.find(x=>x.id===b.dataset.case);if(p)open(p);} });
  fetch(dataUrl,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{projects=data;renderFilters();render()}).catch(()=>{root.innerHTML='<div class="case-empty">Portfolio conceitual indisponível no momento.</div>';});
})();
