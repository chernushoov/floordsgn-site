# FloorDSGN i18n Implementation Guide

## Overview

FloorDSGN now supports 3 languages:
- **Hebrew (עברית)** — Default, RTL
- **English** — LTR
- **Russian (Русский)** — LTR

## File Structure

```
floordsgn-site-new/
├── locales/
│   ├── he.json       (Hebrew translations)
│   ├── en.json       (English translations)
│   └── ru.json       (Russian translations)
├── js/
│   └── i18n.js       (i18n logic & language switching)
├── css/
│   └── i18n.css      (RTL support + language switcher styles)
└── (HTML files with data-i18n attributes)
```

## How to Use

### 1. Add Scripts to HTML

Add these to your HTML `<head>` section:

```html
<!-- i18n styles -->
<link rel="stylesheet" href="/css/i18n.css">

<!-- i18n script -->
<script src="/js/i18n.js"></script>
```

### 2. Mark Text for Translation

Use `data-i18n` attribute on any element:

```html
<!-- Text content -->
<h1 data-i18n="hero_title">Amazing Floor Design</h1>

<!-- Input placeholders -->
<input type="email" data-i18n="email" placeholder="Email">

<!-- Page title -->
<title data-i18n-title="title">FloorDSGN</title>
```

### 3. Create Language Switcher

Add this HTML where you want the language switcher:

```html
<div class="language-switcher">
  <button class="language-btn active" data-locale="he" onclick="changeLanguage('he')">
    🇮🇱 עברית
  </button>
  <button class="language-btn" data-locale="en" onclick="changeLanguage('en')">
    🇺🇸 English
  </button>
  <button class="language-btn" data-locale="ru" onclick="changeLanguage('ru')">
    🇷🇺 Русский
  </button>
</div>
```

## Example HTML Page

```html
<!DOCTYPE html>
<html lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-i18n-title="title">FloorDSGN</title>
  <link rel="stylesheet" href="/css/i18n.css">
</head>
<body class="rtl">
  <header>
    <!-- Language Switcher -->
    <div class="language-switcher">
      <button class="language-btn active" data-locale="he" onclick="changeLanguage('he')">
        🇮🇱 עברית
      </button>
      <button class="language-btn" data-locale="en" onclick="changeLanguage('en')">
        🇺🇸 English
      </button>
      <button class="language-btn" data-locale="ru" onclick="changeLanguage('ru')">
        🇷🇺 Русский
      </button>
    </div>

    <nav>
      <a href="#" data-i18n="home">בית</a>
      <a href="#" data-i18n="about">אודות</a>
      <a href="#" data-i18n="portfolio">תיק עבודות</a>
      <a href="#" data-i18n="contact">צור קשר</a>
    </nav>
  </header>

  <main>
    <section>
      <h1 data-i18n="hero_title">עיצוב רצפות מדהים</h1>
      <p data-i18n="hero_subtitle">יצירת מרחבים יפים דרך חומרים ועיצוב חדשניים</p>
      <button data-i18n="cta">בואו נתחיל</button>
    </section>
  </main>

  <script src="/js/i18n.js"></script>
</body>
</html>
```

## Translation Keys

Available translation keys from locale files:

### Navigation & UI
- `home` — Home
- `about` — About
- `portfolio` — Portfolio
- `contact` — Contact
- `language` — Language
- `selectLanguage` — Select Language

### Pages
- `title` — Page title
- `description` — Meta description
- `hero_title` — Hero section title
- `hero_subtitle` — Hero section subtitle
- `cta` — Call-to-action button

### Services
- `services` — Services heading
- `flooring_solutions` — Flooring Solutions
- `luxury_floors` — Luxury Floors
- `industrial_design` — Industrial Design
- `modern_design` — Modern Design

### Portfolio
- `portfolio_title` — Portfolio heading
- `portfolio_subtitle` — Portfolio subtitle

### About
- `about_title` — About page title
- `about_description` — About page description

### Forms
- `name` — Name field
- `email` — Email field
- `phone` — Phone field
- `message` — Message field
- `subject` — Subject field
- `send` — Send button

## RTL Support

### Automatic RTL
- Hebrew (`he`) → RTL automatically applied
- English (`en`) → LTR automatically applied
- Russian (`ru`) → LTR automatically applied

### CSS Classes
- `.rtl` — RTL wrapper class
- `.ltr` — LTR wrapper class
- `html[lang="he"]` — Hebrew-specific styles

### Manual RTL Adjustments
If you need special RTL handling:

```css
/* Align right for Hebrew */
html[lang="he"] .sidebar {
  float: right;
  margin-left: 1rem;
  margin-right: 0;
}

/* Align left for other languages */
html[lang="en"] .sidebar,
html[lang="ru"] .sidebar {
  float: left;
  margin-right: 1rem;
  margin-left: 0;
}
```

## Adding New Translations

### Step 1: Add to locale files

Update `locales/he.json`, `locales/en.json`, `locales/ru.json`:

```json
{
  "new_key": "Translation text",
  "another_key": "More text"
}
```

### Step 2: Use in HTML

```html
<p data-i18n="new_key">Default text</p>
```

### Step 3: Access in JavaScript

```javascript
const text = window.i18n.t('new_key');
console.log(text); // "Translation text"
```

## Browser Support

- **Current Language Storage:** localStorage (`language` key)
- **Fallback:** Default to Hebrew if no language set
- **Auto-detection:** Manual (no automatic locale detection from browser)

## Troubleshooting

### Translations not showing?

1. Check that `data-i18n` attributes match key names in locale files
2. Verify locale files are in `/locales/` directory
3. Check browser console for errors
4. Ensure i18n.js is loaded after DOM

### RTL not working?

1. Verify CSS file is included: `<link rel="stylesheet" href="/css/i18n.css">`
2. Check that HTML `dir` attribute is set (automatic)
3. Confirm language is set to Hebrew (`he`)
4. Check for conflicting CSS styles

### Language switcher not working?

1. Verify buttons have `data-locale` attribute
2. Check that `changeLanguage()` function is accessible globally
3. Ensure i18n.js is fully loaded

## Testing

### Test Checklist

- [ ] Language switcher appears
- [ ] Click Hebrew button → page RTL, text Hebrew
- [ ] Click English button → page LTR, text English
- [ ] Click Russian button → page LTR, text Russian
- [ ] All text translates correctly
- [ ] Form placeholders translate
- [ ] Page title changes with language
- [ ] Language persists on refresh (localStorage)
- [ ] No console errors

## Performance

- **Lazy loading:** Locale files loaded on page load
- **Caching:** Translations cached in memory
- **Storage:** Current language saved to localStorage
- **Bundle size:** i18n.js is ~3KB uncompressed

## Future Enhancements

- [ ] Auto-detect language from browser settings
- [ ] Add more languages
- [ ] Namespace translations by page
- [ ] Add date/number localization
- [ ] Add pluralization support
- [ ] Add context-specific translations

## Support

For questions or issues, check:
1. Locale file syntax (must be valid JSON)
2. HTML data-i18n attribute names match keys exactly
3. Console for JavaScript errors
4. Network tab for locale file loading

---

**Created:** 2026-02-19 22:00 UTC  
**Status:** Ready for implementation  
**Test Date:** 2026-02-20
