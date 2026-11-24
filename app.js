document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const burgerBtn = document.getElementById('burger-btn');
  const mainNav = document.getElementById('main-nav');
  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
  }
  document.addEventListener('click', (e) => {
    if (mainNav && mainNav.classList.contains('open') && !burgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('open');
    }
  });

  // Determine current page from URL path
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const pageName = path.replace('.html', '');

  fetch('/content.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load content.json');
      return res.json();
    })
    .then((data) => renderPage(data, pageName))
    .catch((err) => {
      fetch('content.json')
        .then((res) => res.json())
        .then((data) => renderPage(data, pageName))
        .catch(() => console.error('Content load error:', err));
    });
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.textContent = value;
}
function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.setAttribute(attr, value);
}
function escapeHtml(str) {
  if (typeof str !== 'string') return str ?? '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderNav(data) {
  const navList = document.getElementById('nav-list');
  if (!navList || !Array.isArray(data.nav)) return;
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navList.innerHTML = data.nav
    .map((item) => {
      const active = item.href === current ? 'class="active"' : '';
      return `<li><a href="${escapeHtml(item.href)}" ${active}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('');
}

function renderPage(data, page) {
  // Site-wide
  if (data.site) {
    const titleEl = document.querySelector('title');
    if (titleEl && data.site.full_name) titleEl.textContent = data.site.full_name + ' | ' + data.site.name;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.site.description) metaDesc.setAttribute('content', data.site.description);
    setText('brand-title', data.site.full_name);
    setText('brand-subtitle', data.site.tagline);
    setText('status-chip', data.site.status);
  }
  renderNav(data);

  // Footer everywhere
  if (data.footer) {
    setText('footer-brand', data.footer.brand);
    setText('footer-brand-sub', data.footer.brand_sub);
    setText('footer-disclaimer', data.footer.disclaimer);
    setText('footer-copyright', data.footer.copyright);

    const footerNav = document.getElementById('footer-nav');
    if (footerNav && Array.isArray(data.footer.links)) {
      footerNav.innerHTML = data.footer.links
        .map((l) => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`)
        .join('');
    }
    const footerSocials = document.getElementById('footer-socials');
    if (footerSocials && Array.isArray(data.footer.socials)) {
      footerSocials.innerHTML = data.footer.socials
        .map((s) => `<a class="social-pill" href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.name)}</a>`)
        .join('');
    }
  }

  // ---- Page-specific rendering ----
  if (page === 'index') {
    renderHero(data.hero);
    renderBenefits(data.benefits);
    renderStages(data.stages);
    renderVacanciesPreview(data.vacancies);
  } else if (page === 'vacancies') {
    renderPageHeader(data.vacancies.title, data.vacancies.subtitle);
    renderVacancyFilters(data.vacancies.filters);
    renderVacancies(data.vacancies.items);
  } else if (page === 'conditions') {
    renderPageHeader(data.conditions.title, data.conditions.subtitle);
    setText('conditions-intro', data.conditions.intro);
    renderConditions(data.conditions.items);
    renderStages(data.stages);
  } else if (page === 'faq') {
    renderPageHeader(data.faq.title, data.faq.subtitle);
    renderFAQ(data.faq.items);
  } else if (page === 'contacts') {
    renderPageHeader(data.contacts.title, data.contacts.subtitle);
    renderChannels(data.contacts.channels);
    renderForm(data.contacts.form);
  }
}

// ---- Components ----
function renderHero(hero) {
  if (!hero) return;
  setText('hero-title', hero.title);
  setText('hero-sub', hero.subtitle);
  setAttr('hero-btn-primary', 'href', hero.button_link);
  setText('hero-btn-primary', hero.button_text);
  setAttr('hero-btn-secondary', 'href', hero.secondary_link);
  setText('hero-btn-secondary', hero.secondary_text);

  const stats = document.getElementById('hero-stats');
  if (stats && Array.isArray(hero.stats)) {
    stats.innerHTML = hero.stats
      .map((s) => `<div class="stat-box"><span class="stat-value">${escapeHtml(s.value)}</span><span class="stat-label">${escapeHtml(s.label)}</span></div>`)
      .join('');
  }
}

function renderBenefits(benefits) {
  if (!benefits) return;
  setText('benefits-title', benefits.title);
  setText('benefits-desc', benefits.subtitle);
  const grid = document.getElementById('benefits-grid');
  if (!grid || !Array.isArray(benefits.items)) return;
  grid.innerHTML = benefits.items
    .map((it) => `<article class="benefit-card"><div class="benefit-icon">${escapeHtml(it.icon || '🛡️')}</div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.text)}</p></article>`)
    .join('');
}

function renderStages(stages) {
  if (!stages) return;
  const track = document.getElementById('stages-track');
  const stagesTitle = document.getElementById('stages-title');
  const stagesDesc = document.getElementById('stages-desc');
  if (stagesTitle) setText('stages-title', stages.title);
  if (stagesDesc) setText('stages-desc', stages.subtitle);
  if (!track || !Array.isArray(stages.steps)) return;
  track.innerHTML = stages.steps
    .map((s) => `<div class="stage-step"><div class="stage-head"><span>${escapeHtml(s.number)}</span>${escapeHtml(s.title)}</div><div class="stage-detail">${escapeHtml(s.text)}</div></div>`)
    .join('');
}

function renderVacanciesPreview(vacancies) {
  if (!vacancies) return;
  const grid = document.getElementById('vacancies-preview');
  if (!grid || !Array.isArray(vacancies.items)) return;
  grid.innerHTML = vacancies.items
    .map((c) => `<article class="vacancy-card"><div class="vacancy-header"><div class="vacancy-icon">🎖️</div><div class="vacancy-info"><div class="vacancy-status ${c.status_open ? 'open' : 'closed'}">${escapeHtml(c.status)}</div><div class="vacancy-name">${escapeHtml(c.unit)}</div></div></div><div class="vacancy-meta"><span><strong>Профиль:</strong> ${escapeHtml(c.role)}</span><span><strong>Требования:</strong> ${escapeHtml(c.requirements)}</span><span><strong>График:</strong> ${escapeHtml(c.schedule)}</span></div><div class="vacancy-action"><a href="contacts.html" class="btn btn-primary btn-sm">${escapeHtml(c.button)}</a></div></article>`)
    .join('');
}

function renderPageHeader(title, desc) {
  const titleEl = document.getElementById('page-title');
  const subEl = document.getElementById('page-sub');
  if (titleEl) setText('page-title', title);
  if (subEl) setText('page-sub', desc);
}

function renderVacancyFilters(filters) {
  const el = document.getElementById('vacancy-filters');
  if (!el || !Array.isArray(filters)) return;
  el.innerHTML = filters
    .map((f, i) => `<button class="filter-chip${i === 0 ? ' active' : ''}">${escapeHtml(f)}</button>`)
    .join('');
  el.querySelectorAll('.filter-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function renderVacancies(items) {
  const grid = document.getElementById('vacancies-grid');
  if (!grid || !Array.isArray(items)) return;
  grid.innerHTML = items
    .map((c) => `<article class="vacancy-card"><div class="vacancy-header"><div class="vacancy-icon">🎖️</div><div class="vacancy-info"><div class="vacancy-status ${c.status_open ? 'open' : 'closed'}">${escapeHtml(c.status)}</div><div class="vacancy-name">${escapeHtml(c.unit)}</div></div></div><div class="vacancy-meta"><span><strong>Профиль:</strong> ${escapeHtml(c.role)}</span><span><strong>Требования:</strong> ${escapeHtml(c.requirements)}</span><span><strong>График:</strong> ${escapeHtml(c.schedule)}</span></div><div class="vacancy-action"><a href="contacts.html" class="btn btn-primary btn-sm">${escapeHtml(c.button)}</a></div></article>`)
    .join('');
}

function renderConditions(items) {
  const grid = document.getElementById('conditions-grid');
  if (!grid || !Array.isArray(items)) return;
  grid.innerHTML = items
    .map((it) => `<article class="condition-card"><div class="condition-code">${escapeHtml(it.code)}</div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.text)}</p></article>`)
    .join('');
}

function renderFAQ(items) {
  const grid = document.getElementById('faq-grid');
  if (!grid || !Array.isArray(items)) return;
  grid.innerHTML = items
    .map((f, idx) => `<div class="faq-item${idx === 0 ? ' open' : ''}"><button type="button" class="faq-question"><span>${escapeHtml(f.q)}</span><span class="faq-toggle">${idx === 0 ? '−' : '+'}</span></button><div class="faq-answer">${escapeHtml(f.a)}</div></div>`)
    .join('');
  grid.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      btn.querySelector('.faq-toggle').textContent = isOpen ? '−' : '+';
    });
  });
}

function renderChannels(channels) {
  const el = document.getElementById('channels-list');
  if (!el || !Array.isArray(channels)) return;
  el.innerHTML = channels
    .map((ch) => `<a class="channel-item" href="${escapeHtml(ch.href)}" target="_blank" rel="noopener noreferrer"><div class="channel-badge">${escapeHtml(ch.platform.slice(0, 2).toUpperCase())}</div><div class="channel-text"><small>${escapeHtml(ch.label)}</small><strong>${escapeHtml(ch.value)}</strong></div></a>`)
    .join('');
}

function renderForm(form) {
  if (!form) return;
  setText('form-title', form.title);
  setText('form-subtitle', form.desc || 'Оставьте заявку и наш штаб свяжется с вами');
  setAttr('field-callsign', 'placeholder', form.callsign_placeholder);
  setAttr('field-contact', 'placeholder', form.contact_placeholder);
  setAttr('field-message', 'placeholder', form.message_placeholder);
  setText('form-submit-btn', form.submit_text);

  const plat = document.getElementById('field-platform');
  if (plat && Array.isArray(form.platforms)) {
    plat.innerHTML = form.platforms.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  }
  const spec = document.getElementById('field-specialty');
  if (spec && Array.isArray(form.specialties)) {
    spec.innerHTML = form.specialties.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  }

  const formEl = document.getElementById('recruitment-form');
  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent = form.success_message;
        status.style.display = 'block';
      }
      formEl.reset();
      setTimeout(() => { if (status) status.style.display = 'none'; }, 6000);
    });
  }
}
