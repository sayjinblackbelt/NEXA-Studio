(() => {
  function loadSelectedModel() {
    let raw;
    try { raw = localStorage.getItem('nexa-selected-model'); } catch (_) { return; }
    if (!raw) return;
    try {
      const model = JSON.parse(raw);
      const output = document.getElementById('tool-output');
      if (output && model.content) {
        output.textContent = model.content;
        output.dataset.modelId = model.modelId || '';
      }
      try {
        localStorage.setItem('nexa-workflow-context', JSON.stringify({
          sourceModelId: model.modelId || '',
          sourceModelName: model.name || '',
          sourceCategory: model.category || '',
          sourcePurpose: model.purpose || '',
          content: model.content || '',
          updatedAt: new Date().toISOString()
        }));
      } catch (_) {}
      document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === 'tools'));
      document.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('active', panel.id === 'tools'));
      history.replaceState(null, '', '#tools');
      const note = document.querySelector('#tools .tool-output');
      if (note) note.setAttribute('aria-label', `Modelo carregado: ${model.name || 'modelo'}`);
    } catch (_) {}
    try { localStorage.removeItem('nexa-selected-model'); } catch (_) {}
  }
  document.addEventListener('DOMContentLoaded', loadSelectedModel);
})();
