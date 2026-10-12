(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const stored = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing can disable storage. */ } };
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionReduced = stored('isha-motion') === 'reduced' || systemMotion.matches;
  function setMotion(reduced, persist = false) {
    motionReduced = reduced;
    root.classList.toggle('reduce-motion', reduced);
    $('.motion-setting')?.setAttribute('aria-pressed', String(reduced));
    if (persist) save('isha-motion', reduced ? 'reduced' : 'full');
  }
  function setTheme(theme) {
    root.dataset.theme = theme;
    $$('[data-theme]').filter(el => el.tagName === 'BUTTON').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.theme === theme)));
    $('meta[name="theme-color"]')?.setAttribute('content', theme === 'night' ? '#1b2428' : '#edf0ee');
    save('isha-theme', theme);
  }
  setTheme(stored('isha-theme') === 'night' ? 'night' : 'day');
  setMotion(motionReduced);
  systemMotion.addEventListener('change', e => setMotion(e.matches || stored('isha-motion') === 'reduced'));
  const menu = $('#environment-menu');
  const menuButton = $('.environment-button');
  const closeMenu = () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton?.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuButton.setAttribute('aria-expanded', String(!menu.hidden));
  });
  $$('button[data-theme]').forEach(button => button.addEventListener('click', () => setTheme(button.dataset.theme)));
  $('.motion-setting')?.addEventListener('click', () => setMotion(!motionReduced, true));
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !menuButton.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); } });

  // Reveal only after IntersectionObserver is available, so content remains readable without JavaScript.
  if ('IntersectionObserver' in window) {
    root.classList.add('js-ready');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach(el => revealObserver.observe(el));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.dock [data-section]').forEach(a => { const active = a.dataset.section === entry.target.id; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    $$('main>section[id]').forEach(el => sectionObserver.observe(el));
  }
  const stage = $('.spatial-stage');
  let stageFrame = 0;
  stage?.addEventListener('pointermove', e => {
    if (motionReduced || e.pointerType !== 'mouse') return;
    const box = stage.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width * 2 - 1;
    const y = (e.clientY - box.top) / box.height * 2 - 1;
    if (stageFrame) cancelAnimationFrame(stageFrame);
    stageFrame = requestAnimationFrame(() => { stage.style.setProperty('--mx', x.toFixed(3)); stage.style.setProperty('--my', y.toFixed(3)); stageFrame = 0; });
  });
  stage?.addEventListener('pointerleave', () => { if (stageFrame) cancelAnimationFrame(stageFrame); stage.style.setProperty('--mx', '0'); stage.style.setProperty('--my', '0'); });

  const cards = $$('.project-card');
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; card.classList.add('visible'); });
    $('.project-grid')?.classList.toggle('filtered', filter !== 'all');
    $('.filter-status').textContent = `Showing ${cards.filter(c => !c.hidden).length} ${filter === 'all' ? '' : filter + ' '}project${filter === 'all' ? 's' : ''}`;
  }));
  const lab = $('.material-lab');
  const panel = $('.lab-panel');
  const materials = { sage: '#91b4a2', blue: '#92b5d1', rose: '#d1a1a2' };
  $$('[data-material]').forEach(button => button.addEventListener('click', () => {
    lab.style.setProperty('--material', materials[button.dataset.material]);
    $$('[data-material]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  lab?.addEventListener('pointermove', e => {
    if (motionReduced || e.pointerType !== 'mouse') return;
    const box = lab.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - .5;
    const y = (e.clientY - box.top) / box.height - .5;
    panel.style.transform = `rotateY(${x * 32}deg) rotateX(${-y * 24}deg) rotate(-4deg)`;
  });
  lab?.addEventListener('pointerleave', () => { panel.style.transform = ''; });

  // Every case study is a real static page. The dialog is a progressive enhancement.
  const dialog = $('.case-dialog');
  if (!dialog || !dialog.showModal) return;
  const content = $('.dialog-content');
  const fullPage = $('.dialog-full-page');
  const cache = new Map();
  const slugs = ['bmw', 'chemistry', 'bloom'];
  const names = { bmw: 'BMW × Apple Vision Pro', chemistry: 'Chemistry on Myntra', bloom: 'Bloom' };
  let requestId = 0;
  let previousHash = '#work';
  let opener = null;
  async function openCase(slug, href, updateHistory = true) {
    if (!slugs.includes(slug)) return;
    const id = ++requestId;
    const url = new URL(href || `./projects/${slug}/`, document.baseURI);
    if (!location.hash.startsWith('#case-')) previousHash = location.hash || '#work';
    fullPage.href = url.href;
    $('#dialog-title').textContent = names[slug];
    content.innerHTML = '<div class="dialog-error"><p>Opening case study…</p></div>';
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    closeMenu();
    content.scrollTop = 0;
    if (updateHistory) history.pushState({ case: slug }, '', `#case-${slug}`);
    try {
      if (!cache.has(slug)) {
        const response = await fetch(url.href);
        if (!response.ok) throw new Error('Case study unavailable');
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        const article = doc.querySelector('.case-article');
        if (!article) throw new Error('Missing case study');
        article.querySelectorAll('[src]').forEach(el => el.setAttribute('src', new URL(el.getAttribute('src'), url).href));
        article.querySelectorAll('a[href]').forEach(el => el.setAttribute('href', new URL(el.getAttribute('href'), url).href));
        cache.set(slug, article.outerHTML);
      }
      if (id !== requestId || !dialog.open) return;
      content.innerHTML = cache.get(slug);
      content.scrollTop = 0;
    } catch {
      if (id !== requestId || !dialog.open) return;
      content.innerHTML = '<div class="dialog-error"><h2>Let’s open the full story.</h2><p>The preview couldn’t load. The full case study is still available.</p><a class="button primary" href="' + url.href + '">Open case study ↗</a></div>';
    }
  }
  function closeCase(updateHistory = true) {
    requestId++;
    if (dialog.open) dialog.close();
    document.body.classList.remove('modal-open');
    if (updateHistory && location.hash.startsWith('#case-')) history.replaceState(null, '', previousHash);
    opener?.focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-case]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (!dialog.open) opener = link;
    openCase(link.dataset.case, link.href);
  });
  $('.dialog-close').addEventListener('click', () => closeCase());
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeCase(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeCase(); } });
  window.addEventListener('popstate', () => { const slug = location.hash.replace('#case-', ''); if (location.hash.startsWith('#case-') && slugs.includes(slug)) openCase(slug, null, false); else closeCase(false); });
  if (location.hash.startsWith('#case-')) openCase(location.hash.replace('#case-', ''), null, false);
})();
