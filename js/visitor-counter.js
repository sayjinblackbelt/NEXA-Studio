/* NEXA Studio — lightweight public visitor counter.
   Uses CountAPI-compatible endpoint. Replace API_BASE if the provider changes. */
(function(){
  const API_BASE = 'https://api.countapi.xyz';
  const namespace = 'nexa-studio-github-pages';
  const key = 'homepage-visits';
  const els = document.querySelectorAll('[data-nexa-visitor-count]');
  if (!els.length) return;
  const set = value => els.forEach(el => { el.textContent = Number(value || 0).toLocaleString('pt-BR'); });
  fetch(`${API_BASE}/hit/${namespace}/${key}`, { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error('visitor counter unavailable'); return r.json(); })
    .then(data => set(data.value))
    .catch(() => set('—'));
})();
