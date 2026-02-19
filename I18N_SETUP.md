# FloorDSGN i18n Setup
_How to add Hebrew/English/Russian translations to your HTML site_

## Files Provided

### 1. locales.json (1.7 KB)
Central translation file with all strings for 3 languages:
- **Hebrew (he)** — Default, RTL
- **English (en)** — LTR
- **Russian (ru)** — LTR

Contains keys for:
- Navigation (home, about, portfolio, contact)
- Forms (name, email, message)
- Common phrases (welcome, description, footer)
- Status messages (success, error)

### 2. js/i18n.js (2.1 KB)
JavaScript i18n library that handles:
- Loading translations from locales.json
- Language switching (with localStorage persistence)
- DOM updates (data-i18n attributes)
- RTL/LTR direction management
- Language button styling

### 3. language-switcher.html (2.3 KB)
Ready-to-use language switcher component with:
- Hebrew/English/Russian buttons
- Auto-highlights current language
- Styled with inline CSS
- Copy-paste into your navbar

---

## Implementation Steps

### Step 1: Add Script to All Pages

In the `<head>` of every HTML file, add:

```html
<script src="/js/i18n.js"></script>
<link rel="stylesheet" href="/css/i18n.css"> <!-- Optional, see below -->
```

Example (in `index.html`):
```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... existing head content ... -->
  <script src="/js/i18n.js"></script>
</head>
```

### Step 2: Add Language Switcher to Navbar

In your main navbar (before closing `</nav>`), add:

```html
<!-- Copy the entire content of language-switcher.html here -->
```

Or use an iframe:
```html
<iframe src="/language-switcher.html" style="border: none; width: 300px; height: 40px;"></iframe>
```

### Step 3: Mark Strings for Translation

Replace hardcoded text with `data-i18n` attributes:

**Before:**
```html
<h1>Welcome to FloorDSGN</h1>
<a href="#home">Home</a>
<a href="#contact">Contact</a>
```

**After:**
```html
<h1 data-i18n="welcome"></h1>
<a href="#home" data-i18n="home"></a>
<a href="#contact" data-i18n="contact"></a>
```

### Step 4: Handle Form Inputs

For input placeholders, use `data-i18n-placeholder`:

**Before:**
```html
<input type="text" placeholder="Enter your name">
<input type="email" placeholder="Enter your email">
```

**After:**
```html
<input type="text" data-i18n-placeholder="name">
<input type="email" data-i18n-placeholder="email">
```

### Step 5: Optional CSS Styling

Create `css/i18n.css`:

```css
/* RTL Support for Hebrew */
html[dir="rtl"] {
  text-align: right;
}

html[dir="rtl"] h1,
html[dir="rtl"] h2,
html[dir="rtl"] h3,
html[dir="rtl"] p,
html[dir="rtl"] nav {
  text-align: right;
}

html[dir="rtl"] ul,
html[dir="rtl"] ol {
  margin-right: 2rem;
  margin-left: 0;
}

html[dir="ltr"] ul,
html[dir="ltr"] ol {
  margin-left: 2rem;
  margin-right: 0;
}

/* Language Switcher Styles */
.language-switcher {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.lang-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background-color: #ddd;
  color: #1f2937;
  transition: all 0.2s;
}

.lang-btn.active {
  background-color: #2563eb;
  color: white;
}

.lang-btn:hover {
  opacity: 0.8;
}
```

---

## Available Translation Keys

All keys available in `locales.json`:

| Key | Usage | Example |
|-----|-------|---------|
| `siteName` | Site title | FloorDSGN |
| `tagline` | Site tagline | Modern Floor Designs |
| `home` | Home link | Home |
| `about` | About link | About |
| `portfolio` | Portfolio link | Portfolio |
| `contact` | Contact link | Contact |
| `language` | Language label | Language |
| `welcome` | Welcome message | Welcome to FloorDSGN |
| `description` | Site description | Professional floor solutions... |
| `contactTitle` | Contact page title | Contact Us |
| `name` | Name field | Name |
| `email` | Email field | Email |
| `message` | Message field | Message |
| `send` | Send button | Send |
| `success` | Success message | Thank you for your message! |
| `error` | Error message | Something went wrong... |
| `footer` | Footer text | © 2026 FloorDSGN |

---

## Adding New Translations

To add new languages or keys:

1. Edit `locales.json`
2. Add new key to all 3 languages:
   ```json
   {
     "he": { "newKey": "תרגום בעברית" },
     "en": { "newKey": "English translation" },
     "ru": { "newKey": "Русский перевод" }
   }
   ```
3. Use in HTML:
   ```html
   <p data-i18n="newKey"></p>
   ```

---

## Testing

### Local Testing
1. Open any HTML file in browser
2. Look for language buttons in navbar
3. Click Hebrew, English, or Russian
4. Verify:
   - Text changes
   - Direction changes (RTL for Hebrew)
   - Language persists on page reload

### Browser Console
Test in DevTools console:
```javascript
// Check current language
console.log(i18n.currentLocale);

// Change language programmatically
i18n.setLanguage('he');
i18n.setLanguage('en');
i18n.setLanguage('ru');

// Get a translation
console.log(i18n.t('welcome'));
```

---

## Deployment Notes

### Vercel
No special configuration needed. Just:
1. Ensure `locales.json` and `js/i18n.js` are in public folder
2. Deploy as usual
3. All i18n works client-side

### Other Platforms
- Ensure `/locales.json` is accessible
- Ensure `/js/i18n.js` is accessible
- No build step required (pure client-side)

### CDN Support
Can serve from CDN:
```html
<script src="https://cdn.example.com/js/i18n.js"></script>
```

---

## Limitations & Future Improvements

### Current (Simple Implementation)
✓ Works offline
✓ No build step
✓ Client-side only
✓ Small footprint (4.4 KB total)
✗ Not SEO optimized for multiple languages

### Future Enhancements
- Server-side rendering for SEO
- Dynamic language loading
- Fallback language support
- Pluralization support
- Date/time formatting

---

## Troubleshooting

**Translations not showing?**
- Check browser console for errors
- Verify locales.json path is correct
- Check `data-i18n` attributes match keys

**Direction not changing?**
- Ensure i18n.js is loaded before HTML renders
- Check browser's DevTools > Elements > look for `dir="rtl"`

**Language not persisting?**
- Check browser allows localStorage
- Check incognito/private mode (localStorage disabled)

---

## Files Summary

| File | Size | Purpose |
|------|------|---------|
| locales.json | 1.7 KB | All translations |
| js/i18n.js | 2.1 KB | i18n engine |
| language-switcher.html | 2.3 KB | UI component |
| css/i18n.css | ~0.5 KB | RTL/styling (optional) |
| **TOTAL** | **~6.6 KB** | Complete system |

---

## Quick Start Template

Copy-paste this into any HTML page:

```html
<!DOCTYPE html>
<html lang="he">
<head>
  <meta charset="UTF-8">
  <title data-i18n="siteName">FloorDSGN</title>
  <script src="/js/i18n.js"></script>
</head>
<body>
  <nav>
    <h1 data-i18n="siteName"></h1>
    <div id="language-switcher" style="display: flex; gap: 0.5rem;">
      <button onclick="i18n.setLanguage('he')">עברית</button>
      <button onclick="i18n.setLanguage('en')">English</button>
      <button onclick="i18n.setLanguage('ru')">Русский</button>
    </div>
  </nav>

  <main>
    <h2 data-i18n="welcome"></h2>
    <p data-i18n="description"></p>
  </main>

  <footer>
    <p data-i18n="footer"></p>
  </footer>
</body>
</html>
```

---

**Ready to add translations!** 🌍

Questions? Check the code in `js/i18n.js` — it's well-commented.
