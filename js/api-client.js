const NEXA_API = (() => {
  const DEFAULT_BASE = 'http://localhost:3000';
  const STORAGE_KEY = 'nexa-api-base-url';

  function getBaseUrl() {
    const configured = localStorage.getItem(STORAGE_KEY);
    return (configured || DEFAULT_BASE).replace(/\/$/, '');
  }

  function setBaseUrl(url) {
    const value = String(url || '').trim().replace(/\/$/, '');
    if (!value) throw new Error('URL da API não pode ser vazia.');
    localStorage.setItem(STORAGE_KEY, value);
    return value;
  }

  async function request(path, options = {}) {
    const headers = { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
    const response = await fetch(`${getBaseUrl()}${path}`, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const message = data && typeof data === 'object' && data.error ? data.error.message : `Erro HTTP ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  const clients = {
    list: () => request('/api/v1/clients'),
    get: id => request(`/api/v1/clients/${encodeURIComponent(id)}`),
    create: payload => request('/api/v1/clients', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/api/v1/clients/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) })
  };

  const projects = {
    list: () => request('/api/v1/projects'),
    get: id => request(`/api/v1/projects/${encodeURIComponent(id)}`),
    create: payload => request('/api/v1/projects', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/api/v1/projects/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    transition: (id, nextStage) => request(`/api/v1/projects/${encodeURIComponent(id)}/transition`, { method: 'POST', body: JSON.stringify({ nextStage }) })
  };

  const health = () => request('/health');

  return Object.freeze({ getBaseUrl, setBaseUrl, request, health, clients, projects });
})();

window.NEXA_API = NEXA_API;
