(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('nexa-motion-ready');
  if (reduce) return;

  const reveal = document.querySelectorAll('.manifesto, .work .section-head, .case-toolbar, .featured-wrap, .nexa-brand-showcase__head, .nexa-brand-showcase__card, .services .kicker, .service, .process-grid > div, .principles-grid, .contact-inner');
  reveal.forEach((el, i) => {
    el.classList.add('nexa-reveal');
    el.style.setProperty('--reveal-delay', Math.min(i * 35, 280) + 'ms');
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveal.forEach(el => io.observe(el));
  } else {
    reveal.forEach(el => el.classList.add('is-visible'));
  }

  const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    }), { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    sections.forEach(s => navIO.observe(s));
  }
})();
