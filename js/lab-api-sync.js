const NEXA_LAB_API = (() => {
  const KEY = 'nexa-lab-api-enabled';
  const stageToApi = { 'Briefing':'BRIEFING', 'Diagnóstico':'DIAGNOSIS', 'Proposta':'PROPOSAL', 'Produção':'PRODUCTION', 'QA / Entrega':'QA' };
  const stageFromApi = { BRIEFING:'Briefing', DIAGNOSIS:'Diagnóstico', PROPOSAL:'Proposta', PRODUCTION:'Produção', QA:'QA / Entrega', DELIVERY:'QA / Entrega', COMPLETED:'QA / Entrega' };
  const enabled = () => localStorage.getItem(KEY) === '1';
  const setEnabled = value => localStorage.setItem(KEY, value ? '1' : '0');
  const notice = (text, ok = false) => {
    let el = document.getElementById('api-status');
    if (!el) { el = document.createElement('div'); el.id = 'api-status'; el.className = 'note'; document.querySelector('#overview .lab-toolbar')?.after(el); }
    el.textContent = text; el.style.borderLeftColor = ok ? 'var(--acid)' : '#7657ff';
  };
  const apiToLocalProject = (p, previous = {}) => ({ ...previous, id:p.id, name:p.name, client:p.clientId, stage:stageFromApi[p.stage] || 'Briefing', status:previous.status || 'ACTIVE', type:previous.type || 'Projeto' });

  async function syncFromApi() {
    const [cr, pr] = await Promise.all([NEXA_API.clients.list(), NEXA_API.projects.list()]);
    const clients = (cr.data || []).map(c => ({ id:c.id, name:c.name, status:'ACTIVE' }));
    const previousProjects = Object.fromEntries(db.projects.map(p => [p.id, p]));
    db.clients = clients;
    db.projects = (pr.data || []).map(p => apiToLocalProject(p, previousProjects[p.id]));
    localStorage.setItem(STORE, JSON.stringify(db)); renderAll();
    notice(`API conectada · ${clients.length} clientes · ${db.projects.length} projetos`, true);
  }

  async function connect() {
    try { await NEXA_API.health(); setEnabled(true); await syncFromApi(); return true; }
    catch (error) { setEnabled(false); notice(`API indisponível: ${error.message}. O Lab continua no modo local.`); return false; }
  }

  async function saveClientToApi(form) {
    const d = Object.fromEntries(new FormData(form).entries());
    const id = form.dataset.id;
    const result = id ? await NEXA_API.clients.update(id, { name:d.name }) : await NEXA_API.clients.create({ name:d.name });
    const saved = result.data;
    const local = db.clients.find(c => c.id === (id || saved.id));
    if (local) { local.id = saved.id; local.name = saved.name; }
    localStorage.setItem(STORE, JSON.stringify(db)); renderAll();
  }

  async function saveProjectToApi(form) {
    const d = Object.fromEntries(new FormData(form).entries());
    const id = form.dataset.id;
    const local = id ? db.projects.find(p => p.id === id) : db.projects.find(p => p.name === d.name && p.client === d.client);
    const payload = { name:d.name, clientId:d.client };
    if (id) await NEXA_API.projects.update(id, payload);
    else {
      const result = await NEXA_API.projects.create({ ...payload, stage:stageToApi[d.stage] || 'BRIEFING' });
      if (local) { const old = local.id; local.id = result.data.id; if (db.qa[old]) { db.qa[local.id] = db.qa[old]; delete db.qa[old]; } }
    }
    const target = id ? local : (local || db.projects.find(p => p.id === id));
    if (id && local && stageToApi[d.stage]) {
      const remote = await NEXA_API.projects.get(id);
      if (remote.data && remote.data.stage !== stageToApi[d.stage]) await transitionProject(local, d.stage, remote.data.stage);
    }
    localStorage.setItem(STORE, JSON.stringify(db)); renderAll();
  }

  async function transitionProject(project, nextLocalStage, remoteStage) {
    const result = await NEXA_API.projects.transition(project.id, stageToApi[nextLocalStage]);
    project.stage = stageFromApi[result.data.stage] || nextLocalStage;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.querySelector('#overview .lab-toolbar'); if (!toolbar) return;
    const btn = document.createElement('button'); btn.id='api-connect'; btn.className='button button-line'; btn.textContent=enabled()?'Recarregar API':'Conectar API'; toolbar.appendChild(btn);
    btn.addEventListener('click', connect);
    if (enabled()) connect(); else notice('Modo local · API não conectada. Use “Conectar API” para sincronizar clientes e projetos.');

    document.addEventListener('submit', async e => {
      if (!enabled()) return;
      const form = e.target.closest('[data-save-form]'); if (!form || !['client','project'].includes(form.dataset.saveForm)) return;
      e.preventDefault();
      try { if (form.dataset.saveForm === 'client') await saveClientToApi(form); else await saveProjectToApi(form); closeForm(form.dataset.saveForm); notice('Alteração sincronizada com a API.', true); }
      catch (error) { notice(`Falha na API: ${error.message}`); }
    });

    document.addEventListener('change', async e => {
      if (!enabled() || !e.target.matches('[data-stage]')) return;
      const p = db.projects.find(x => x.id === e.target.dataset.stage); if (!p) return;
      const requested = e.target.value;
      try { const remote = await NEXA_API.projects.get(p.id); if (remote.data.stage === stageToApi[requested]) return; await transitionProject(p, requested, remote.data.stage); localStorage.setItem(STORE, JSON.stringify(db)); renderAll(); notice(`Workflow sincronizado · ${p.name} → ${p.stage}`, true); }
      catch (error) { notice(`Transição recusada pela API: ${error.message}`); renderAll(); }
    });
  });

  return Object.freeze({ enabled, connect, syncFromApi });
})();
window.NEXA_LAB_API = NEXA_LAB_API;
