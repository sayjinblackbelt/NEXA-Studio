/* NEXA Studio — reusable public visitor counter for static GitHub Pages.
   LibreCounter provides the count server-side without requiring a project backend.
   The referrer identifies the page being counted. */
(function(){
  const els = document.querySelectorAll('[data-nexa-visitor-count]');
  if (!els.length) return;
  els.forEach(el => {
    const img = document.createElement('img');
    img.src = 'https://librecounter.org/counter.svg';
    img.alt = 'Contador de visitantes';
    img.referrerPolicy = 'unsafe-url';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'nexa-visitor-counter__image';
    el.replaceWith(img);
  });
})();
