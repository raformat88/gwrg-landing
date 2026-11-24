document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const mainNav = document.getElementById('main-nav');

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  // Close mobile menu on nav link click
  document.addEventListener('click', (e) => {
    if (mainNav && mainNav.classList.contains('open') && !burgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('open');
    }
  });

  fetch('/content.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load content.json');
      return res.json();
    })
    .then((data) => renderSite(data))
    .catch((err) => {
      fetch('content.json')
        .then((res) => res.json())
        .then((data) => renderSite(data))
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

function renderSite(data) {
  // Meta
  if (data.meta) {
    const titleEl = document.getElementById('meta-title');
    if (titleEl && data.meta.title) titleEl.textContent = data.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.meta.description) metaDesc.setAttribute('content', data.meta.description);
  }

  // Top strip
  if (data.top_strip) {
    setText('top-status-text', data.top_strip.status_text);
    setText('top-lang-active', data.top_strip.lang_active);
    setText('top-lang-alt', data.top_strip.lang_alt);
    setAttr('top-lang-alt', 'href', data.top_strip.lang_alt_href);
  }

  // Header
  if (data.header) {
    setAttr('header-flag', 'src', data.header.flag_image);
    setAttr('header-emblem', 'src', data.header.emblem_image);
    setText('header-org-title', data.header.org_title);
    setText('header-org-subtitle', data.header.org_subtitle);
    setText('header-cta', data.header.cta_text);
    setAttr('header-cta', 'href', data.header.cta_href);

    const navList = document.getElementById('nav-list');
    if (navList && Array.isArray(data.header.nav)) {
      navList.innerHTML = data.header.nav
        .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
        .join('');
    }
  }

  // Hero
  if (data.hero) {
    setAttr('hero-bg', 'src', data.hero.bg_image);
    setText('hero-kicker', data.hero.kicker);
    setText('hero-title', data.hero.title);
    setText('hero-sub', data.hero.subtitle);
    if (data.hero.primary_btn) {
      setText('hero-btn-primary', data.hero.primary_btn.text);
      setAttr('hero-btn-primary', 'href', data.hero.primary_btn.href);
    }
    if (data.hero.secondary_btn) {
      setText('hero-btn-secondary', data.hero.secondary_btn.text);
      setAttr('hero-btn-secondary', 'href', data.hero.secondary_btn.href);
    }
    const statsEl = document.getElementById('hero-stats');
    if (statsEl && Array.isArray(data.hero.stats)) {
      statsEl.innerHTML = data.hero.stats
        .map(
          (m) => `
          <div class="stat-item">
            <span class="stat-value">${escapeHtml(m.value)}</span>
            <span class="stat-label">${escapeHtml(m.label)}</span>
          </div>`
        )
        .join('');
    }
  }

  // Benefits
  if (data.benefits) {
    setText('benefits-title', data.benefits.title);
    setText('benefits-desc', data.benefits.desc);
    const grid = document.getElementById('benefits-grid');
    if (grid && Array.isArray(data.benefits.items)) {
      grid.innerHTML = data.benefits.items
        .map(
          (item) => `
          <article class="benefit-card">
            <div class="benefit-icon">${escapeHtml(item.icon || '🛡️')}</div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
          </article>`
        )
        .join('');
    }
  }

  // Conditions
  if (data.conditions) {
    setText('conditions-title', data.conditions.title);
    setText('conditions-desc', data.conditions.subtitle);
    const grid = document.getElementById('conditions-grid');
    if (grid && Array.isArray(data.conditions.items)) {
      grid.innerHTML = data.conditions.items
        .map(
          (item) => `
          <article class="condition-card">
            <div class="condition-top">
              <img class="condition-icon" src="${escapeHtml(item.icon || '')}" alt="${escapeHtml(item.title)}">
              <span class="condition-stamp">${escapeHtml(item.stamp || '')}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>`
        )
        .join('');
    }
  }

  // Stages
  if (data.stages) {
    setText('stages-title', data.stages.title);
    setText('stages-desc', data.stages.desc);
    const track = document.getElementById('stages-track');
    if (track && Array.isArray(data.stages.steps)) {
      track.innerHTML = data.stages.steps
        .map(
          (step) => `
          <div class="stage-step">
            <div class="stage-head"><span>${escapeHtml(step.number)}</span>${escapeHtml(step.title)}</div>
            <div class="stage-detail">${escapeHtml(step.detail)}</div>
          </div>`
        )
        .join('');
    }
  }

  // Contracts
  if (data.contracts) {
    setText('contracts-title', data.contracts.title);
    setText('contracts-desc', data.contracts.desc);
    const filtersEl = document.getElementById('contract-filters');
    if (filtersEl && Array.isArray(data.contracts.filters)) {
      filtersEl.innerHTML = data.contracts.filters
        .map((f, i) => `<button class="filter-chip${i === 0 ? ' active' : ''}">${escapeHtml(f)}</button>`)
        .join('');
      filtersEl.querySelectorAll('.filter-chip').forEach((btn) => {
        btn.addEventListener('click', () => {
          filtersEl.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }
    const grid = document.getElementById('contracts-grid');
    if (grid && Array.isArray(data.contracts.items)) {
      grid.innerHTML = data.contracts.items
        .map(
          (c) => `
          <article class="contract-card">
            <div class="contract-header">
              <img class="contract-logo" src="${escapeHtml(c.unit_logo || '')}" alt="${escapeHtml(c.unit_name)}">
              <div class="contract-info">
                <div class="contract-status ${c.status_open ? 'open' : 'closed'}">${escapeHtml(c.status)}</div>
                <div class="contract-name">${escapeHtml(c.unit_name)}</div>
              </div>
            </div>
            <div class="contract-meta">
              <span><strong>Профиль:</strong> ${escapeHtml(c.role || '')}</span>
              <span><strong>Требования:</strong> ${escapeHtml(c.requirements || '')}</span>
              <span><strong>График:</strong> ${escapeHtml(c.schedule || '')}</span>
            </div>
            <a href="${escapeHtml(c.cta_href || '#apply')}" class="btn ${c.status_open ? 'btn-primary' : 'btn-ghost'}" style="width:100%; margin-top:8px;">${escapeHtml(c.cta_text || 'ОТКЛИКНУТЬСЯ')}</a>
          </article>`
        )
        .join('');
    }
  }

  // FAQ
  if (data.faq) {
    setText('faq-title', data.faq.title);
    setText('faq-desc', data.faq.desc);
    const faqEl = document.getElementById('faq-grid');
    if (faqEl && Array.isArray(data.faq.items)) {
      faqEl.innerHTML = data.faq.items
        .map(
          (f, idx) => `
          <div class="faq-item ${idx > 1 ? 'collapsed' : ''}">
            <button type="button" class="faq-question" aria-expanded="${idx <= 1}">
              <span>${escapeHtml(f.question)}</span>
              <span class="faq-toggle">${idx <= 1 ? '−' : '+'}</span>
            </button>
            <div class="faq-answer">${escapeHtml(f.answer)}</div>
          </div>`
        )
        .join('');
      faqEl.querySelectorAll('.faq-question').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const isCollapsed = item.classList.toggle('collapsed');
          btn.setAttribute('aria-expanded', String(!isCollapsed));
          btn.querySelector('.faq-toggle').textContent = isCollapsed ? '+' : '−';
        });
      });
    }
  }

  // Apply / Contacts
  if (data.apply) {
    setText('apply-title', data.apply.title);
    setText('apply-desc', data.apply.desc);
    setText('apply-map-caption', data.apply.map_caption);
    setAttr('apply-map', 'src', data.apply.map_image);

    const channelsEl = document.getElementById('apply-channels');
    if (channelsEl && Array.isArray(data.apply.channels)) {
      channelsEl.innerHTML = data.apply.channels
        .map(
          (ch) => `
          <a class="channel-item" href="${escapeHtml(ch.href)}" target="_blank" rel="noopener noreferrer">
            <div class="channel-badge">${escapeHtml(ch.platform.slice(0, 2).toUpperCase())}</div>
            <div class="channel-text">
              <small>${escapeHtml(ch.label)}</small>
              <strong>${escapeHtml(ch.value)}</strong>
            </div>
          </a>`
        )
        .join('');
    }

    if (data.apply.form) {
      const f = data.apply.form;
      setAttr('field-callsign', 'placeholder', f.callsign_placeholder);
      setAttr('field-contact', 'placeholder', f.contact_placeholder);
      setAttr('field-message', 'placeholder', f.message_placeholder);
      setText('form-submit-btn', f.submit_text);

      const platSelect = document.getElementById('field-platform');
      if (platSelect && Array.isArray(f.platforms)) {
        platSelect.innerHTML = f.platforms.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
      }

      const specSelect = document.getElementById('field-specialty');
      if (specSelect && Array.isArray(f.specialties)) {
        specSelect.innerHTML = f.specialties.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
      }

      const formEl = document.getElementById('recruitment-form');
      if (formEl) {
        formEl.addEventListener('submit', (e) => {
          e.preventDefault();
          const statusEl = document.getElementById('form-status');
          if (statusEl) {
            statusEl.textContent = f.success_message;
            statusEl.style.display = 'block';
            statusEl.style.color = 'var(--status-open)';
          }
          formEl.reset();
          setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
        });
      }
    }
  }

  // Footer
  if (data.footer) {
    setAttr('footer-emblem', 'src', data.footer.emblem_image);
    setText('footer-brand-name', data.footer.brand_name);
    setText('footer-brand-sub', data.footer.brand_sub);
    setText('footer-disclaimer', data.footer.disclaimer);
    setText('footer-copyright', data.footer.copyright);

    const navEl = document.getElementById('footer-nav');
    if (navEl && Array.isArray(data.footer.links)) {
      navEl.innerHTML = data.footer.links
        .map((l) => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`)
        .join('');
    }

    const socialsEl = document.getElementById('footer-socials');
    if (socialsEl && Array.isArray(data.footer.socials)) {
      socialsEl.innerHTML = data.footer.socials
        .map((s) => `<a class="social-pill" href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.name)}</a>`)
        .join('');
    }
  }
}
