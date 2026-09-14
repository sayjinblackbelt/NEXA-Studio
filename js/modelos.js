(() => {
  const state = { models: [], category: 'Todos', search: '', sort: 'featured' };
  const grid = document.querySelector('#models-grid');
  const filters = document.querySelector('#model-filters');
  const search = document.querySelector('#model-search');
  const sort = document.querySelector('#model-sort');
  const modalRoot = document.querySelector('#model-modal-root');

  const escapeHtml = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const categories = () => ['Todos', ...new Set(state.models.map(model => model.category))];

  function renderFilters() {
    filters.innerHTML = categories().map(category => `<button class="filter ${category === state.category ? 'active' : ''}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
  }

  function visibleModels() {
    const query = state.search.toLowerCase();
    return state.models.filter(model => {
      const categoryOk = state.category === 'Todos' || model.category === state.category;
      const text = [model.name, model.category, model.description, ...(model.tags || [])].join(' ').toLowerCase();
      return categoryOk && text.includes(query);
    }).sort((a,b) => state.sort === 'name' ? a.name.localeCompare(b.name) : state.sort === 'category' ? a.category.localeCompare(b.category) : Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }

  function render() {
    const models = visibleModels();
    grid.innerHTML = models.length ? models.map(model => `<article class="model-card"><div><div class="model-top"><span class="model-category">${escapeHtml(model.category)}</span><span>${model.featured ? '★' : '—'}</span></div><h2>${escapeHtml(model.name)}</h2><p>${escapeHtml(model.description)}</p><div class="model-tags">${(model.tags || []).map(tag => `<span class="model-tag">${escapeHtml(tag)}</span>`).join('')}</div></div><div class="model-actions"><button data-view="${escapeHtml(model.id)}">Visualizar</button><button class="secondary" data-use="${escapeHtml(model.id)}">Usar modelo</button></div></article>`).join('') : '<div class="empty-models">Nenhum modelo encontrado.</div>';
  }

  function openModal(model) {
    modalRoot.innerHTML = `<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal"><div class="modal-head"><div><p class="kicker dark">${escapeHtml(model.category)}</p><h2>${escapeHtml(model.name)}</h2></div><button class="modal-close" aria-label="Fechar">×</button></div><p>${escapeHtml(model.description)}</p><pre>${escapeHtml(model.content)}</pre><div class="model-actions"><button data-copy="${escapeHtml(model.id)}">Copiar modelo</button><button class="secondary" data-use="${escapeHtml(model.id)}">Usar modelo</button></div></div></div>`;
  }

  function useModel(model) {
    const payload = JSON.stringify({ source: 'nexa-model-library', modelId: model.id, name: model.name, category: model.category, content: model.content });
    try { localStorage.setItem('nexa-selected-model', payload); } catch (_) {}
    window.location.href = `studio.html#tools?model=${encodeURIComponent(model.id)}`;
  }

  async function copyModel(model) {
    try { await navigator.clipboard.writeText(model.content); } catch (_) {}
  }

  document.addEventListener('click', event => {
    const filter = event.target.closest('[data-category]');
    if (filter) { state.category = filter.dataset.category; renderFilters(); render(); return; }
    const view = event.target.closest('[data-view]');
    if (view) { const model = state.models.find(item => item.id === view.dataset.view); if (model) openModal(model); return; }
    const use = event.target.closest('[data-use]');
    if (use) { const model = state.models.find(item => item.id === use.dataset.use); if (model) useModel(model); return; }
    const copy = event.target.closest('[data-copy]');
    if (copy) { const model = state.models.find(item => item.id === copy.dataset.copy); if (model) copyModel(model); return; }
    if (event.target.classList.contains('modal-backdrop') || event.target.closest('.modal-close')) modalRoot.innerHTML = '';
  });
  search.addEventListener('input', event => { state.search = event.target.value; render(); });
  sort.addEventListener('change', event => { state.sort = event.target.value; render(); });

  fetch('data/modelos.json', { cache: 'no-store' }).then(response => { if (!response.ok) throw new Error('model data unavailable'); return response.json(); }).then(models => { state.models = Array.isArray(models) ? models : []; renderFilters(); render(); }).catch(() => { grid.innerHTML = '<div class="empty-models">Não foi possível carregar a biblioteca de modelos.</div>'; });
})();
