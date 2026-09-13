/* NEXA Studio — localStorage → canonical v1 migration adapter.
 * Intentionally not loaded by the MVP yet. Use only during an explicit migration.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.NexaMigrationV1 = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const STAGES = { Briefing:'BRIEFING', Diagnóstico:'DIAGNOSIS', Proposta:'PROPOSAL', Produção:'PRODUCTION', 'QA / Entrega':'QA', Entrega:'DELIVERY', Concluído:'COMPLETED' };
  const STATUS = { ACTIVE:'ACTIVE', LEAD:'LEAD', DONE:'DONE', ARCHIVED:'ARCHIVED' };
  const QA_KEYS = ['strategy','visual','functional','technical','license','delivery'];

  function id(prefix, legacyId) { return `${prefix}-${legacyId}`; }
  function iso(now) { return (now || new Date()).toISOString(); }
  function required(value, field) { if (value == null || String(value).trim() === '') throw new Error(`Missing required field: ${field}`); }

  function migrate(legacy, options = {}) {
    if (!legacy || !Array.isArray(legacy.clients) || !Array.isArray(legacy.projects)) throw new Error('Invalid NEXA MVP export');
    const now = options.now || new Date();
    const stamp = iso(now);
    const clientIds = new Set(legacy.clients.map(c => c.id));

    const clients = legacy.clients.map(c => {
      required(c.id, 'client.id'); required(c.name, 'client.name');
      return { id:id('client', c.id), legacyId:c.id, name:c.name, status:c.status || 'LEAD', notes:null, createdAt:stamp, updatedAt:stamp };
    });

    const projects = legacy.projects.map(p => {
      required(p.id, 'project.id'); required(p.name, 'project.name'); required(p.client, 'project.client');
      if (!clientIds.has(p.client)) throw new Error(`Project ${p.id} references missing client ${p.client}`);
      return { id:id('project', p.id), legacyId:p.id, clientId:id('client', p.client), name:p.name, type:p.type || 'Unspecified', stage:STAGES[p.stage] || p.stage || 'BRIEFING', health:'ON_TRACK', status:STATUS[p.status] || 'ACTIVE', ownerUserId:null, startDate:null, dueDate:null, summary:null, createdAt:stamp, updatedAt:stamp };
    });

    const portfolio = (legacy.portfolio || []).map(c => ({ id:id('portfolio', c.id), legacyId:c.id, projectId:null, slug:String(c.name || c.id).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''), name:c.name, type:c.type || 'Unspecified', summary:'Migrated from MVP portfolio record.', featured:Boolean(c.featured), publicationStatus:'DRAFT', publishedAt:null, createdAt:stamp, updatedAt:stamp }));

    const qaResults = [];
    Object.entries(legacy.qa || {}).forEach(([legacyProjectId, state], index) => {
      if (!clientIds.size || !legacy.projects.some(p => p.id === legacyProjectId)) return;
      const criteria = Object.fromEntries(QA_KEYS.map(k => [k, Boolean(state && state[k])]));
      const passed = QA_KEYS.every(k => criteria[k]);
      qaResults.push({ id:id('qa', `${legacyProjectId}-${index+1}`), projectId:id('project', legacyProjectId), version:1, criteria, overallStatus:passed ? 'PASSED' : 'PENDING', notes:null, reviewedBy:null, reviewedAt:null, createdAt:stamp });
    });

    return { version:'canonical-v1', migratedAt:stamp, clients, contacts:[], projects, briefings:[], diagnoses:[], proposals:[], tasks:[], milestones:[], deliverables:[], qaResults, portfolioCases:portfolio, assets:[], decisions:[], notes:[], users:[], auditEvents:[] };
  }

  function migrateFromStorage(storage, key='nexa-studio-v1') {
    const raw = storage.getItem(key);
    if (!raw) throw new Error(`No legacy data found at ${key}`);
    return migrate(JSON.parse(raw));
  }

  return { migrate, migrateFromStorage, STAGES, QA_KEYS };
});
