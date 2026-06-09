/* Floor.DSGN Knowledge Library engine (LIBRARY_ARCHITECTURE LIB-2..6).
 * Renders role cards, pillar sections + card grid, recent feed from
 * library-manifest.json; instant pillar×role×text filter; RU/EN chrome. */
(function () {
  'use strict';
  var M = null, state = { pillar: 0, role: '', text: '' };

  var I18N = {
    ru: { eyebrow: 'Floor.DSGN · Инженерная библиотека', h1: 'Инженерная библиотека полов',
      sub: 'Один источник правды по промышленным и дизайнерским полам Израиля: выбор системы, тендер и BOQ, стандарты, основание, сравнения, бренды, энциклопедия. Вход по роли или по теме.',
      search: 'Поиск по библиотеке — система, стандарт, бренд…',
      roles_title: 'С чего начать — по роли', roles_hint: '4 маршрута чтения', path_lbl: 'Маршрут',
      topic_title: 'По теме — 8 разделов', articles_word: 'статей', recent_title: 'Свежее', recent_hint: 'Из блога',
      empty: 'Ничего не найдено — сбросьте фильтры.', all: 'Все',
      cta_h: 'Соберём маршрут под ваш проект за 48 часов',
      cta_p: 'Расскажите задачу — пришлём подобранную подборку статей, спеку и образцы под ваш объект и роль.',
      cta_btn: 'Получить маршрут', min: 'мин', clear: 'Сбросить' },
    en: { eyebrow: 'Floor.DSGN · Knowledge Library', h1: 'The Engineering Floor Library',
      sub: 'One source of truth for industrial and design floors in Israel: system selection, tender & BOQ, standards, substrate, comparisons, brands, encyclopedia. Enter by role or by topic.',
      search: 'Search the library — system, standard, brand…',
      roles_title: 'Start here — by role', roles_hint: '4 reading paths', path_lbl: 'Path',
      topic_title: 'By topic — 8 pillars', articles_word: 'articles', recent_title: 'Recent', recent_hint: 'From the blog',
      empty: 'Nothing found — clear the filters.', all: 'All',
      cta_h: 'A curated reading path for your project in 48h',
      cta_p: 'Tell us the brief — we send a tailored set of articles, the spec and samples for your site and role.',
      cta_btn: 'Get my path', min: 'min', clear: 'Clear' }
  };

  var ROLES = [
    { key: 'Owner', ru: 'Владелец', en: 'Owner', sru: 'Выбор, цены, ошибки, гарантия', sen: 'Selection, cost, mistakes, warranty',
      icon: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/>' },
    { key: 'Designer', ru: 'Дизайнер / Архитектор', en: 'Designer / Architect', sru: 'Спека, сравнения, бренды, BOQ', sen: 'Spec, comparisons, brands, BOQ',
      icon: '<circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>' },
    { key: 'Contractor', ru: 'Подрядчик', en: 'Contractor', sru: 'Расход, монтаж, приёмка, оценка', sen: 'Quantities, install, handover, scope',
      icon: '<path d="M4 18h16v3H4z"/><path d="M12 3a6 6 0 0 0-6 6v3h12V9a6 6 0 0 0-6-6z"/><path d="M6 12v3M18 12v3"/>' },
    { key: 'Builder', ru: 'Девелопер / Снабжение', en: 'Builder / Procurement', sru: 'Стандарты, HACCP, нормы, объекты', sen: 'Standards, HACCP, compliance, use-cases',
      icon: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h6M9 11h6M9 15h4"/>' }
  ];

  var PICON = {
    1: '<path d="M6 3v6a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v6"/><circle cx="6" cy="3" r="0"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="20" r="2"/>',
    2: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
    3: '<path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    4: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    5: '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/>',
    6: '<path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 3 13h4zM19 7l-2 6h4z"/>',
    7: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 3v18"/>',
    8: '<path d="M3 7.5 11 3l8 4.5v9L11 21l-8-4.5z"/><circle cx="11" cy="9" r="2"/>'
  };

  function lang() { try { return (localStorage.getItem('lang') || document.documentElement.lang || 'ru').slice(0, 2); } catch (e) { return 'ru'; } }
  function t() { return I18N[lang()] || I18N.ru; }
  function svg(inner, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>'; }
  function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function roleName(k) { var r = ROLES.find(function (x) { return x.key === k; }); return r ? r[lang()] || r.en : k; }
  function pillarName(p) { var P = M.pillars[p]; return P ? (P[lang()] || P.en) : ''; }

  function applyChrome() {
    var d = t();
    document.querySelectorAll('[data-lk]').forEach(function (el) { var k = el.getAttribute('data-lk'); if (d[k]) el.textContent = d[k]; });
    document.querySelectorAll('[data-lk-ph]').forEach(function (el) { var k = el.getAttribute('data-lk-ph'); if (d[k]) el.setAttribute('placeholder', d[k]); });
  }

  function card(a) {
    var metaIcon = svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 'meta');
    var personaBadges = a.personas.slice(0, 2).map(function (p) { return '<span class="lib-badge lib-badge--persona">' + esc(roleName(p)) + '</span>'; }).join('');
    return '<a class="lib-card" href="' + esc(a.url) + '" data-pillar="' + a.pillar + '" data-personas="' + esc(a.personas.join(',')) + '" data-search="' + esc((a.title + ' ' + a.gist).toLowerCase()) + '">'
      + '<div class="lib-card__imgwrap"><img class="lib-card__img" src="' + esc(a.photo) + '" alt="" loading="lazy"></div>'
      + '<div class="lib-card__body">'
      + '<div class="lib-card__badges"><span class="lib-badge lib-badge--pillar">' + esc(pillarName(a.pillar)) + '</span>' + personaBadges
      + '<span class="lib-badge lib-badge--lang">' + a.lang.toUpperCase() + '</span></div>'
      + '<h3 class="lib-card__title">' + esc(a.title) + '</h3>'
      + (a.gist ? '<p class="lib-card__gist">' + esc(a.gist) + '</p>' : '')
      + '<div class="lib-card__meta">' + metaIcon + '<span>' + a.readMin + ' ' + t().min + '</span></div>'
      + '</div></a>';
  }

  function renderRoles() {
    var counts = {}; M.articles.forEach(function (a) { a.personas.forEach(function (p) { counts[p] = (counts[p] || 0) + 1; }); });
    document.getElementById('libRoles').innerHTML = ROLES.map(function (r) {
      return '<button class="lib-role" data-role="' + r.key + '">' + svg(r.icon, 'lib-role__icon')
        + '<span class="lib-role__name">' + esc(r[lang()] || r.en) + '</span>'
        + '<span class="lib-role__sub">' + esc(r['s' + lang()] || r.sen) + '</span>'
        + '<span class="lib-role__count">' + (counts[r.key] || 0) + ' ' + t().articles_word + ' →</span></button>';
    }).join('');
    document.querySelectorAll('.lib-role').forEach(function (el) {
      el.addEventListener('click', function () { setRole(el.getAttribute('data-role')); });
    });
  }

  function renderChips() {
    var d = t(), chips = ['<button class="lib-chip' + (state.pillar === 0 ? ' on' : '') + '" data-pillar="0">' + d.all + '</button>'];
    for (var p = 1; p <= 8; p++) chips.push('<button class="lib-chip' + (state.pillar === p ? ' on' : '') + '" data-pillar="' + p + '">' + esc(pillarName(p)) + '</button>');
    chips.push('<button class="lib-chip lib-chip--clear" id="libClear">' + d.clear + '</button>');
    var row = document.getElementById('libPillarChips'); row.innerHTML = chips.join('');
    row.querySelectorAll('.lib-chip[data-pillar]').forEach(function (el) {
      el.addEventListener('click', function () { state.pillar = +el.getAttribute('data-pillar'); renderChips(); apply(); });
    });
    document.getElementById('libClear').addEventListener('click', clearAll);
  }

  function renderPillars() {
    var host = document.getElementById('libPillars'), html = '';
    for (var p = 1; p <= 8; p++) {
      var arts = M.articles.filter(function (a) { return a.pillar === p; });
      if (!arts.length) continue;
      var P = M.pillars[p];
      html += '<section class="lib-pillar" data-pillar-sec="' + p + '">'
        + '<div class="lib-pillar__cover"><img src="' + esc(P.cover) + '" alt="" loading="lazy">'
        + '<div class="lib-pillar__coverbody">' + svg(PICON[p] || '', 'lib-pillar__icon')
        + '<span class="lib-pillar__name">' + esc(pillarName(p)) + '</span>'
        + '<span class="lib-pillar__n">' + arts.length + ' ' + t().articles_word + '</span></div></div>'
        + '<div class="lib-grid">' + arts.map(card).join('') + '</div></section>';
    }
    host.innerHTML = html;
  }

  function renderFeed() {
    var feed = M.articles.filter(function (a) { return a.blogDup; });
    if (!feed.length) feed = M.articles.slice(0, 6);
    document.getElementById('libFeed').innerHTML = feed.slice(0, 6).map(card).join('');
  }

  function renderPath() {
    var box = document.getElementById('libPath'), items = document.getElementById('libPathItems');
    if (!state.role) { box.classList.remove('on'); return; }
    var path = (M.readingPaths[state.role] || []);
    var html = '';
    path.forEach(function (slug, i) {
      var a = M.articles.find(function (x) { return x.id === slug || x.slug === slug || x.id === slug.replace(/^.*\//, ''); });
      var url = a ? a.url : '/articles/' + slug + '.html';
      var label = a ? a.title : slug.replace(/^.*\//, '').replace(/-/g, ' ');
      html += (i ? '<span class="lib-path__arrow">→</span>' : '') + '<a href="' + esc(url) + '"><b>' + (i + 1) + '</b>' + esc(label.length > 38 ? label.slice(0, 36) + '…' : label) + '</a>';
    });
    items.innerHTML = html; box.classList.add('on');
  }

  function apply() {
    var n = 0, sections = document.querySelectorAll('[data-pillar-sec]');
    sections.forEach(function (sec) {
      var p = +sec.getAttribute('data-pillar-sec'), shown = 0;
      if (state.pillar && state.pillar !== p) { sec.style.display = 'none'; return; }
      sec.querySelectorAll('.lib-card').forEach(function (c) {
        var okR = !state.role || (',' + c.getAttribute('data-personas') + ',').indexOf(',' + state.role + ',') >= 0;
        var okT = !state.text || c.getAttribute('data-search').indexOf(state.text) >= 0;
        var ok = okR && okT; c.style.display = ok ? '' : 'none'; if (ok) shown++;
      });
      sec.style.display = shown ? '' : 'none'; n += shown;
    });
    document.getElementById('libVisibleCount').textContent = n;
    document.getElementById('libEmpty').style.display = n ? 'none' : 'block';
  }

  function setRole(r) {
    state.role = (state.role === r) ? '' : r;
    document.querySelectorAll('.lib-role').forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-role') === state.role); });
    renderPath(); apply();
  }
  function clearAll() {
    state = { pillar: 0, role: '', text: '' };
    document.getElementById('libSearch').value = '';
    document.querySelectorAll('.lib-role').forEach(function (el) { el.classList.remove('on'); });
    renderChips(); renderPath(); apply();
  }

  function boot() {
    fetch('/library-manifest.json').then(function (r) { return r.json(); }).then(function (data) {
      M = data;
      applyChrome(); renderRoles(); renderChips(); renderPillars(); renderFeed(); apply();
      var s = document.getElementById('libSearch');
      s.addEventListener('input', function () { state.text = s.value.trim().toLowerCase(); apply(); });
      // re-render on language switch (lang buttons live in the header)
      document.querySelectorAll('.lang-btn').forEach(function (b) {
        b.addEventListener('click', function () { setTimeout(function () { applyChrome(); renderRoles(); renderChips(); renderPillars(); renderFeed(); renderPath(); apply(); }, 60); });
      });
    }).catch(function (e) { console.error('library manifest load failed', e); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
