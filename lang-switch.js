/* ============================================================================
   Floor.DSGN — page-level language switch for the Hebrew (/he/) mirror.

   Architecture (owner-approved 2026-05-31):
   - EN/RU are client-side i18n on the SAME page (translations.js).
   - Hebrew is a SEPARATE static RTL mirror under /he/ : a page at /<path>
     has its Hebrew twin at /he/<path>.
   - The HE button must NAVIGATE to the Hebrew twin of the CURRENT page
     (page-level), NOT switch language client-side. EN/RU buttons on a
     /he/ page navigate back to the twin.

   This script runs on every page (it is loaded alongside translations.js),
   inspects the current path, and rewires the .lang-btn buttons accordingly —
   so the 350+ duplicated page headers need NO per-file edits.

   Safety: if the Hebrew twin does not exist yet (partial mirror), the HE
   button falls back to the Hebrew home /he/ — it NEVER points at a 404.
   The set of existing Hebrew pages is read from /he-manifest.json (generated
   at build time). Until it loads, HE defaults to /he/.
   ============================================================================ */
(function () {
  'use strict';

  // ---- path helpers (handle Cloudflare clean URLs: '/floors' or '/floors.html' or '/floors/') ----
  function cleanPath(p) {
    if (!p) return '/';
    // drop query/hash, collapse trailing slash (keep root)
    p = p.split('#')[0].split('?')[0];
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }
  function stripHtml(p) { return p.replace(/\.html$/i, ''); }
  function isHePath(p) { return p === '/he' || p.indexOf('/he/') === 0; }

  // path of the Hebrew twin for a given EN/RU path
  function toHe(p) {
    if (p === '/' || p === '') return '/he/';
    return '/he' + p;
  }
  // path of the EN/RU twin for a given /he/ path
  function toBase(p) {
    if (p === '/he' || p === '/he/') return '/';
    return p.replace(/^\/he/, '') || '/';
  }

  // normalize a path to a manifest key (no leading slash, no .html, no trailing slash; '' = home)
  function key(p) {
    p = stripHtml(cleanPath(p));
    p = p.replace(/^\//, '');
    return p;
  }

  var path = cleanPath(location.pathname);
  var onHe = isHePath(path);

  function btns() { return document.querySelectorAll('.lang-btn'); }
  function getBtn(lang) { return document.querySelector('.lang-btn[data-lang="' + lang + '"]'); }

  function go(url) { return function (e) { if (e) e.preventDefault(); window.location.href = url; }; }

  // Wire EN/RU/HE buttons to the correct twin URL.
  function wire(heHref) {
    var he = getBtn('he');
    var en = getBtn('en');
    var ru = getBtn('ru');

    if (onHe) {
      // We are on a Hebrew page → EN/RU navigate back to the base (EN/RU) twin.
      var baseHtml = toBase(path); // base twin always exists (he mirrors an existing page)
      if (en) { en.onclick = go(baseHtml); }
      if (ru) { ru.onclick = go(baseHtml); }
      if (he) { he.onclick = null; he.classList.add('active'); }
    } else {
      // We are on an EN/RU page → HE navigates to the Hebrew twin (or /he/ home as fallback).
      if (he) { he.onclick = go(heHref); }
      // EN/RU keep their existing client-side i18n behaviour (translations.js).
    }
  }

  function init() {
    // default: HE → Hebrew home (never a 404)
    var heHref = '/he/';

    if (!onHe) {
      // try to resolve the exact Hebrew twin from the manifest
      var want = key(path); // '' for home
      fetch('/he-manifest.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (list) {
          if (list && Array.isArray(list)) {
            // manifest stores keys like '' (home), 'floors', 'articles/epoxy-sl'
            if (list.indexOf(want) !== -1) {
              heHref = toHe(path);
            } else {
              // hide HE button on pages with no Hebrew twin yet (cleaner than dead-ending to home)
              var he = getBtn('he');
              if (he) he.style.display = 'none';
            }
          }
          wire(heHref);
        })
        .catch(function () { wire(heHref); }); // no manifest → HE → /he/ home
      // wire immediately too (covers the pre-fetch window)
      wire(heHref);
    } else {
      wire(heHref);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
