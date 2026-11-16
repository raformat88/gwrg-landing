document.addEventListener('DOMContentLoaded', () => {
    let siteData = {};
    let currentLang = 'ru';

    // Загрузка контента из content.json
    async function loadContent() {
        try {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error('Failed to load content.json');
            siteData = await response.json();
            currentLang = siteData.default_lang || 'ru';
            renderPage();
            setupLangSwitcher();
        } catch (error) {
            console.error('Error loading site content:', error);
        }
    }

    function renderPage() {
        const langData = siteData[currentLang];
        if (!langData) return;

        // Общие текстовые элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const keyPath = el.getAttribute('data-i18n').split('.');
            let val = langData;
            keyPath.forEach(key => {
                if (val) val = val[key];
            });
            if (val !== undefined) {
                el.textContent = val;
            }
        });

        // Рендер бонусов
        const bonusesGrid = document.getElementById('bonuses-grid');
        if (bonusesGrid && langData.bonuses_section && langData.bonuses_section.items) {
            bonusesGrid.innerHTML = langData.bonuses_section.items.map(item => `
                <div class="bonus-card">
                    <div class="bonus-icon">${item.icon}</div>
                    <div class="bonus-title">${item.title}</div>
                    <div class="bonus-desc">${item.desc}</div>
                </div>
            `).join('');
        }

        // Рендер специальностей
        const specialtiesGrid = document.getElementById('specialties-grid');
        if (specialtiesGrid && langData.specialties_section && langData.specialties_section.items) {
            const icons = ['🎯', '⚡', '🛡️', '📦', '🔭', '✈️', '🚜', '💻'];
            specialtiesGrid.innerHTML = langData.specialties_section.items.map((item, idx) => `
                <div class="specialty-card">
                    <div class="specialty-icon">${icons[idx % icons.length]}</div>
                    <div class="specialty-name">${item.name}</div>
                    <div class="specialty-count">${item.count}</div>
                </div>
            `).join('');
        }

        // Рендер контрактов (вакансий)
        const contractsGrid = document.getElementById('contracts-grid');
        if (contractsGrid && langData.vacancies_section && langData.vacancies_section.items) {
            contractsGrid.innerHTML = langData.vacancies_section.items.map(item => `
                <div class="contract-card">
                    <div>
                        <div class="contract-header">
                            <div class="clan-logo-box">${item.name.substring(0,2)}</div>
                            <span class="status-badge ${item.status_class || 'status-open'}">${item.status}</span>
                        </div>
                        <h3 class="contract-title">${item.name}</h3>
                        <div class="contract-details">
                            <div class="contract-tags">${item.tags}</div>
                            <div>${item.req}</div>
                            <div>${item.income}</div>
                            <div>${item.schedule}</div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-block">${item.btn || '▶ ОТКЛИКНУТЬСЯ'}</button>
                </div>
            `).join('');
        }

        // Рендер статистики доверия
        const trustStatsGrid = document.getElementById('trust-stats-grid');
        if (trustStatsGrid && langData.terms_section && langData.terms_section.stats) {
            trustStatsGrid.innerHTML = langData.terms_section.stats.map(stat => `
                <div class="trust-stat-item">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
        }

        // Рендер футер-ссылок
        const footerLinks = document.getElementById('footer-links');
        if (footerLinks && langData.footer && langData.footer.links) {
            footerLinks.innerHTML = langData.footer.links.map(linkText => `
                <a href="#contacts">${linkText}</a>
            `).join('');
        }
    }

    function setupLangSwitcher() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang && siteData[lang]) {
                    currentLang = lang;
                    langBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderPage();
                }
            });
        });
    }

    // Обработка формы
    const form = document.getElementById('application-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(currentLang === 'ru' ? 'Заявка успешно отправлена в Альянс!' : 'Application successfully submitted to the Alliance!');
            form.reset();
        });
    }

    loadContent();
});