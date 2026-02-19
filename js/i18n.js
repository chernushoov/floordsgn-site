/**
 * Simple i18n implementation for FloorDSGN
 * Supports: Hebrew (he), English (en), Russian (ru)
 * Default: Hebrew
 */

class I18n {
  constructor() {
    this.currentLocale = this.getStoredLocale() || 'he';
    this.translations = {};
    this.init();
  }

  async init() {
    // Load all locale files
    await this.loadLocale('he');
    await this.loadLocale('en');
    await this.loadLocale('ru');

    // Set initial language
    this.setLanguage(this.currentLocale);
  }

  async loadLocale(locale) {
    try {
      const response = await fetch(`/locales/${locale}.json`);
      this.translations[locale] = await response.json();
    } catch (err) {
      console.error(`Failed to load locale ${locale}:`, err);
    }
  }

  setLanguage(locale) {
    if (!this.translations[locale]) {
      console.warn(`Locale ${locale} not found, using default`);
      locale = 'he';
    }

    this.currentLocale = locale;
    localStorage.setItem('language', locale);

    // Update HTML attributes
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;

    // Update body class
    document.body.className = document.body.className.replace(/\s?(rtl|ltr)\s?/g, ' ');
    document.body.classList.add(locale === 'he' ? 'rtl' : 'ltr');

    // Trigger page update
    this.updatePage();

    // Update language switcher
    this.updateLanguageSwitcher();
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLocale];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  updatePage() {
    // Find all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update page title if data-i18n-title exists
    const titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) {
      document.title = this.t(titleEl.getAttribute('data-i18n-title'));
    }
  }

  updateLanguageSwitcher() {
    document.querySelectorAll('.language-btn').forEach((btn) => {
      const locale = btn.getAttribute('data-locale');
      btn.classList.toggle('active', locale === this.currentLocale);
    });
  }

  getStoredLocale() {
    return localStorage.getItem('language');
  }

  getCurrentLocale() {
    return this.currentLocale;
  }

  getAvailableLocales() {
    return ['he', 'en', 'ru'];
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18n();
});

// Expose globally for HTML onclick handlers
function changeLanguage(locale) {
  if (window.i18n) {
    window.i18n.setLanguage(locale);
  }
}
