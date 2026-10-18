(() => {
  'use strict';
  const conf = window.YUGEN_SITE || {};
  const safeHttps = value => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:' ? parsed.href : null;
    } catch { return null; }
  };
  const releaseURL = safeHttps(conf.releaseUrl) || safeHttps(document.querySelector("[data-release-link]")?.getAttribute("href"));
  const repositoryURL = safeHttps(conf.repositoryUrl);
  const version = typeof conf.version === 'string' ? conf.version.trim().slice(0, 40) : '16.6.1-dev';
  document.querySelectorAll('[data-version]').forEach(el => { el.textContent = version; });
  document.querySelectorAll('[data-release-link]').forEach(el => {
    if(releaseURL){el.href=releaseURL;el.removeAttribute("aria-disabled");el.removeAttribute("title");return;}
    el.removeAttribute('href');el.setAttribute('aria-disabled','true');
    el.setAttribute('title','Download ainda não publicado: aguardando validação da versão beta.');
    el.addEventListener('click',e=>e.preventDefault());
  });
  if (repositoryURL) document.querySelectorAll('[data-repo-link]').forEach(el => { el.href = repositoryURL; });
  document.getElementById('copyright-year').textContent = String(new Date().getFullYear());

  // A navegação continua funcional em celular, teclado e GitHub Pages sem rotas de servidor.
  const mobileMenu = document.getElementById('primary-navigation');
  const toggle = document.getElementById('mobile-toggle');
  const closeMenu = () => { mobileMenu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); };
  toggle.addEventListener('click', () => {
    const willOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
  });

  // Controles da demonstração: não alteram o jogo, apenas os módulos da ilustração.
  document.querySelectorAll('[data-demo-target]').forEach(control => {
    const target = document.getElementById(control.dataset.demoTarget);
    if (!target) return;
    const apply = () => target.classList.toggle('is-hidden', !control.checked);
    control.addEventListener('change', apply);
    apply();
  });

  // Galeria real do Launcher. O conteúdo essencial permanece visível sem JavaScript.
  const screenshots = Array.isArray(conf.screenshots) ? conf.screenshots : [];
  const galleryCards = [...document.querySelectorAll('.shot-card')];
  const filters = [...document.querySelectorAll('.gallery-filter')];
  const galleryDialog = document.getElementById('shot-dialog');
  let activeIndex = 0;
  const displayedIndices = () => galleryCards.filter(card => !card.hidden).map(card => Number(card.dataset.galleryIndex));
  const renderDialog = () => {
    const selected = screenshots[activeIndex];
    if (!selected) return;
    const image = document.getElementById('dialog-image');
    image.src = selected.image;
    image.alt = `Captura real: ${selected.title} do YugenYumi Launcher`;
    document.getElementById('dialog-title').textContent = selected.title;
    document.getElementById('dialog-description').textContent = selected.description;
    const sequence = displayedIndices();
    const position = Math.max(0, sequence.indexOf(activeIndex)) + 1;
    document.getElementById('dialog-count').textContent = `${String(position).padStart(2,'0')} / ${String(sequence.length).padStart(2,'0')}`;
  };
  const openShot = index => {
    if (!screenshots[index]) return;
    activeIndex = index;
    renderDialog();
    if (galleryDialog && typeof galleryDialog.showModal === 'function') galleryDialog.showModal();
    else window.open(screenshots[index].image, '_blank', 'noopener');
  };
  const stepShot = direction => {
    const sequence = displayedIndices();
    if (!sequence.length) return;
    const idx = sequence.indexOf(activeIndex);
    activeIndex = sequence[(idx + direction + sequence.length) % sequence.length];
    renderDialog();
  };
  galleryCards.forEach(card => card.addEventListener('click', event => {
    if (!galleryDialog || typeof galleryDialog.showModal !== 'function') return;
    event.preventDefault();
    openShot(Number(card.dataset.galleryIndex));
  }));
  filters.forEach(button => button.addEventListener('click', () => {
    const active = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    galleryCards.forEach(card => { card.hidden = active !== 'todos' && card.dataset.category !== active; });
  }));
  if (galleryDialog) {
    document.getElementById('dialog-close').addEventListener('click', () => galleryDialog.close());
    document.getElementById('dialog-prev').addEventListener('click', () => stepShot(-1));
    document.getElementById('dialog-next').addEventListener('click', () => stepShot(1));
    galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) galleryDialog.close(); });
    galleryDialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); stepShot(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); stepShot(-1); }
    });
    let downX = null;
    galleryDialog.addEventListener('touchstart', event => { downX = event.touches[0]?.clientX ?? null; }, { passive:true });
    galleryDialog.addEventListener('touchend', event => {
      if (downX === null) return;
      const delta = (event.changedTouches[0]?.clientX ?? downX) - downX;
      if (Math.abs(delta) > 60) stepShot(delta < 0 ? 1 : -1);
      downX = null;
    }, { passive:true });
  }
  // O hero alterna entre três capturas reais, sem criar versões artificiais.
  const heroImage = document.getElementById('hero-capture-image');
  const heroOpen = document.getElementById('hero-capture-open');
  let heroIndex = 0;
  document.querySelectorAll('[data-hero-shot]').forEach(button => button.addEventListener('click', () => {
    const idx = Number(button.dataset.heroShot);
    const selected = screenshots[idx];
    if (!selected) return;
    heroIndex = idx;
    heroImage.src = selected.image;
    heroImage.alt = `Captura real da tela ${selected.title} do YugenYumi Launcher`;
    heroOpen.setAttribute('aria-label', `Ampliar captura de ${selected.title}`);
    document.querySelectorAll('[data-hero-shot]').forEach(tab => {
      const on = tab === button;
      tab.classList.toggle('active', on);
      tab.setAttribute('aria-pressed', String(on));
    });
  }));
  if (heroOpen) heroOpen.addEventListener('click', () => openShot(heroIndex));

  // Revelações sutis respeitando preferências de acessibilidade.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-animations');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.04 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
