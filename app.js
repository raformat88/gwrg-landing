document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const mainNav = document.getElementById('main-nav');

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

  fetch('/content.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load content.json');
      return res.json();
    })
    .then((data) => renderSite(data))
    .catch((err) => {
      // Fallback for local file:// preview if fetch('/content.json') is blocked by CORS
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

function renderSite(data) {
  // Meta
  if (data.meta) {
    document.title = data.meta.title || document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.meta.description) {
      metaDesc.setAttribute('content', data.meta.description);
    }
  }

  // Header
  if (data.header) {
    setAttr('header-flag', 'src', data.header.flag_image);
    setAttr('header-emblem', 'src', data.header.emblem_image);
    setText('header-org-title', data.header.org_title);
    setText('header-org-subtitle', data.header.org_subtitle);
    setText('header-cta', data.header.cta_text);
    setAttr('header-cta', 'href', data.header.cta_href);

    if (data.header.lang_switch) {
      setText('lang-active', data.header.lang_switch.active);
      setText('lang-alt', data.header.lang_switch.alt);
      setAttr('lang-alt', 'href', data.header.lang_switch.alt_href);
    }

    const navEl = document.getElementById('main-nav');
    if (navEl && Array.isArray(data.header.nav)) {
      navEl.innerHTML = data.header.nav
        .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
        .join('');
    }
  }

  // Hero
  if (data.hero) {
    setAttr('hero-bg', 'src', data.hero.bg_image);
    setText('hero-headline', data.hero.headline);
    setText('hero-subheadline', data.hero.subheadline);

    if (data.hero.primary_btn) {
      setText('hero-btn-primary', data.hero.primary_btn.text);
      setAttr('hero-btn-primary', 'href', data.hero.primary_btn.href);
    }
    if (data.hero.secondary_btn) {
      setText('hero-btn-secondary', data.hero.secondary_btn.text);
      setAttr('hero-btn-secondary', 'href', data.hero.secondary_btn.href);
    }

    const metricsEl = document.getElementById('hero-metrics');
    if (metricsEl && Array.isArray(data.hero.metrics)) {
      metricsEl.innerHTML = data.hero.metrics
        .map(
          (m) => `
          <div class="metric-item">
            <span class="metric-value">${escapeHtml(m.value)}</span>
            <span class="metric-label">${escapeHtml(m.label)}</span>
          </div>`
        )
        .join('');
    }
  }

  // Conditions
  if (data.conditions) {
    setText('conditions-title', data.conditions.title);
    setText('conditions-subtitle', data.conditions.subtitle);
    setAttr('conditions-map-bg', 'src', data.conditions.bg_map_image);

    const gridEl = document.getElementById('conditions-grid');
    if (gridEl && Array.isArray(data.conditions.items)) {
      gridEl.innerHTML = data.conditions.items
        .map(
          (item) => `
          <article class="condition-card">
            <div class="condition-top">
              <img class="condition-icon" src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.title)}">
              <span class="condition-stamp">${escapeHtml(item.stamp)}</span>
            </div>
            <h3 class="condition-title">${escapeHtml(item.title)}</h3>
            <p class="condition-desc">${escapeHtml(item.description)}</p>
          </article>`
        )
        .join('');
    }
  }

  // Stages
  if (data.stages) {
    setText('stages-title', data.stages.title);
    const stagesEl = document.getElementById('stages-bar');
    if (stagesEl && Array.isArray(data.stages.steps)) {
      stagesEl.innerHTML = data.stages.steps
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
    setText('contracts-subtitle', data.contracts.subtitle);
    const listEl = document.getElementById('contracts-list');
    if (listEl && Array.isArray(data.contracts.items)) {
      listEl.innerHTML = data.contracts.items
        .map(
          (c) => `
          <article class="contract-card">
            <div>
              <div class="contract-header">
                <img class="contract-logo" src="${escapeHtml(c.unit_logo)}" alt="${escapeHtml(c.unit_name)}">
                <div>
                  <div class="contract-status ${c.status_open ? 'open' : 'closed'}">● ${escapeHtml(c.status)}</div>
                  <h3 class="contract-name">${escapeHtml(c.unit_name)}</h3>
                </div>
              </div>
              <div class="contract-meta" style="margin-top: 14px;">
                <span><strong>Профиль:</strong> ${escapeHtml(c.role)}</span>
                <span><strong>Требования:</strong> ${escapeHtml(c.requirements)}</span>
                <span><strong>График:</strong> ${escapeHtml(c.schedule)}</span>
              </div>
            </div>
            <a href="${escapeHtml(c.cta_href)}" class="btn ${c.status_open ? 'btn-orange' : 'btn-outline'}">${escapeHtml(c.cta_text)}</a>
          </article>`
        )
        .join('');
    }
  }

  // FAQ
  if (data.faq) {
    setText('faq-title', data.faq.title);
    const faqEl = document.getElementById('faq-grid');
    if (faqEl && Array.isArray(data.faq.items)) {
      faqEl.innerHTML = data.faq.items
        .map(
          (f, idx) => `
          <div class="faq-item ${idx > 1 ? 'collapsed' : ''}">
            <button type="button" class="faq-question" aria-expanded="${idx <= 1}">
              <span>Q: ${escapeHtml(f.question)}</span>
              <span class="faq-toggle">${idx <= 1 ? '−' : '+'}</span>
            </button>
            <div class="faq-answer">A: ${escapeHtml(f.answer)}</div>
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

  // Contacts & HQ
  if (data.contacts) {
    setText('contacts-title', data.contacts.title);
    setText('contacts-subtitle', data.contacts.subtitle);
    setText('channels-title', data.contacts.channels_title);
    setAttr('hq-map-img', 'src', data.contacts.map_image);
    setText('hq-map-caption', data.contacts.map_caption);

    const channelsEl = document.getElementById('channel-list');
    if (channelsEl && Array.isArray(data.contacts.channels)) {
      channelsEl.innerHTML = data.contacts.channels
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

    if (data.contacts.form) {
      const f = data.contacts.form;
      setText('form-title', f.title);
      setAttr('field-callsign', 'placeholder', f.callsign_placeholder);
      setAttr('field-contact', 'placeholder', f.contact_placeholder);
      setAttr('field-message', 'placeholder', f.message_placeholder);
      setText('form-consent-label', f.consent_text);
      setText('form-submit-btn', f.submit_text);

      const platSelect = document.getElementById('field-platform');
      if (platSelect && Array.isArray(f.platforms)) {
        platSelect.innerHTML = f.platforms
          .map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`)
          .join('');
      }

      const specSelect = document.getElementById('field-specialty');
      if (specSelect && Array.isArray(f.specialties)) {
        specSelect.innerHTML = f.specialties
          .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
          .join('');
      }

      const formEl = document.getElementById('recruitment-form');
      if (formEl) {
        formEl.addEventListener('submit', (e) => {
          e.preventDefault();
          const statusEl = document.getElementById('form-status');
          if (statusEl) {
            statusEl.textContent = f.success_message;
            statusEl.style.display = 'block';
          }
          formEl.reset();
        });
      }
    }
  }

  // Footer
  if (data.footer) {
    setAttr('footer-emblem', 'src', data.footer.emblem_image);
    setText('footer-brand-name', data.footer.brand_name);
    setText('footer-brand-sub', data.footer.brand_sub);
    setText('footer-disclaimer', '⚠ ' + data.footer.disclaimer);
    setText('footer-copyright', data.footer.copyright);

    const linksEl = document.getElementById('footer-links');
    if (linksEl && Array.isArray(data.footer.links)) {
      linksEl.innerHTML = data.footer.links
        .map((l) => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`)
        .join('');
    }

    const socialsEl = document.getElementById('footer-socials');
    if (socialsEl && Array.isArray(data.footer.socials)) {
      socialsEl.innerHTML = data.footer.socials
        .map(
          (s) =>
            `<a class="social-pill" href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.name)}</a>`
        )
        .join('');
    }
  }
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
