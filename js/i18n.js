// Simple i18n for static sites
class I18n {
  constructor() {
    this.locales = {};
    this.currentLocale = localStorage.getItem('language') || 'he';
    this.init();
  }

  async init() {
    try {
      const response = await fetch('/locales.json');
      this.locales = await response.json();
      this.setLanguage(this.currentLocale);
    } catch (error) {
      console.error('Failed to load locales:', error);
    }
  }

  t(key) {
    return this.locales[this.currentLocale]?.[key] || key;
  }

  setLanguage(locale) {
    if (this.locales[locale]) {
      this.currentLocale = locale;
      localStorage.setItem('language', locale);
      this.updatePage();
      this.updateDirection();
    }
  }

  updatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    // Update all inputs with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
  }

  updateDirection() {
    const html = document.documentElement;
    if (this.currentLocale === 'he') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'he');
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', this.currentLocale);
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  getLanguages() {
    return Object.keys(this.locales);
  }
}

// Initialize i18n when DOM is ready
let i18n;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
  });
} else {
  i18n = new I18n();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
