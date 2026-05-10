/* ============================================================
   enhance.js — isolated additive layer over existing site.
   IIFE-namespaced as window.fx. Does not modify script.js.
   ============================================================ */
(function () {
  'use strict';
  const fx = window.fx = window.fx || {};
  const isEnglishPage = () => (
    document.body?.dataset.fxLang === 'en'
    || window.location.pathname.startsWith('/en/')
  );
  const text = (ru, en) => (isEnglishPage() ? en : ru);
  const EN_DYNAMIC = {
    'терраццо': 'terrazzo',
    'тёмный · charcoal': 'dark · charcoal',
    'светлый · multicolor': 'light · multicolor',
    'венецианское · цементное': 'Venetian · cement-based',
    'эпокси SL': 'epoxy SL',
    'светлый · RAL 7044': 'light · RAL 7044',
    'микротопинг': 'microtopping',
    'минеральная база': 'mineral base',
    'бетон': 'concrete',
    'полированный · densify-only': 'polished · densify-only',
    '0 мм наращивания': '0 mm build-up',
    'существующая плита': 'existing slab',
    'полиуретан + цемент': 'polyurethane + cement',
    'MMA смола': 'MMA resin',
    'эпоксидная смола': 'epoxy resin',
    'белый цемент + мраморная крошка': 'white cement + marble chips',
    'Топ-герметик · 2 слоя': 'Top sealer · 2 coats',
    'Терраццо-масса': 'Terrazzo matrix',
    'Праймер + кварц': 'Primer + quartz',
    'Подложка': 'Substrate',
    'PU-топ · 2 слоя': 'PU topcoat · 2 coats',
    'Воск + ProSeal · 2 слоя': 'Wax + ProSeal · 2 coats',
    'Цементно-мраморная масса': 'Cement-marble matrix',
    'Цементный контакт': 'Cement bonding bridge',
    'Self-levelling эпоксид': 'Self-leveling epoxy',
    'PU защита · 2 слоя': 'PU protection · 2 coats',
    'Финиш-микротопинг · 2 прохода': 'Finish microtopping · 2 passes',
    'База + стеклосетка 4×4 мм': 'Base + 4×4 mm fiberglass mesh',
    'Адгезионный праймер': 'Adhesion primer',
    'Бетон / стяжка C20/25': 'Concrete / screed C20/25',
    'Олеофоб + полировка · 2 слоя': 'Oleophobic sealer + polish · 2 coats',
    'Полировка 400 → 3000 grit': 'Polishing 400 → 3000 grit',
    'механика без наращивания': 'mechanical process, no build-up',
    'Литий-силикатный упрочнитель': 'Lithium-silicate densifier',
    'Бетонная плита': 'Concrete slab',
    'существующая плита, шлифовка 50–100 grit': 'existing slab, 50–100 grit grinding',
    'PU-cement seal · 2 слоя': 'PU-cement seal · 2 coats',
    'PurCem основной слой': 'PurCem body layer',
    'Без праймера (на влажный бетон)': 'No primer (on damp concrete)',
    '— · опц. Sika Concrete Primer': '— · optional Sika Concrete Primer',
    'Бетон с насечкой': 'Mechanically keyed concrete',
    'MMA seal · 2 слоя': 'MMA seal · 2 coats',
    'MMA праймер + кварц': 'MMA primer + quartz',
    'Топкоат': 'Topcoat',
    'Тело системы': 'System body',
    'Праймер': 'Primer',
    'Шлифовка + sealer': 'Grinding + sealer',
    'Терраццо матрица': 'Terrazzo matrix',
    'Микро 2 слоя': 'Micro layer · 2 coats',
    'Финиш HACCP': 'HACCP finish',
    'Скрэтч-кот': 'Scratch coat',
    'Праймер MMA': 'MMA primer',
    'самовыравнивающийся эпокси': 'self-leveling epoxy',
    'эпокси HBS 6–9 мм': 'epoxy HBS 6–9 mm',
    'эпокси HBS': 'epoxy HBS',
    'венецианское терраццо': 'Venetian terrazzo',
    'эпокси декоративный': 'decorative epoxy',
    'Сравнить': 'Compare',
    'Расчёт': 'Estimate',
    'Звонок': 'Call',
  };
  function localize(value) {
    if (!isEnglishPage() || typeof value !== 'string') return value;
    if (EN_DYNAMIC[value]) return EN_DYNAMIC[value];
    return value
      .replace(/мм/g, 'mm')
      .replace(/МПа/g, 'MPa')
      .replace(/кварц/g, 'quartz')
      .replace(/чипсы/g, 'chips')
      .replace(/слоя/g, 'coats')
      .replace(/слой/g, 'layer')
      .replace(/дней/g, 'days')
      .replace(/дня/g, 'days')
      .replace(/ч\b/g, 'h')
      .replace(/Бетон/g, 'Concrete')
      .replace(/бетон/g, 'concrete')
      .replace(/Терраццо/g, 'Terrazzo')
      .replace(/терраццо/g, 'terrazzo')
      .replace(/эпокси/g, 'epoxy')
      .replace(/микротопинг/g, 'microtopping')
      .replace(/праймер/g, 'primer')
      .replace(/Праймер/g, 'Primer');
  }
  function assetPath(value) {
    if (!value || !isEnglishPage() || /^(?:[a-z]+:|\/|#)/i.test(value)) return value;
    return value.startsWith('images/') ? `../${value}` : value;
  }

  /* ---------------- terrazzo pattern (from /v2/) ---------- */
  const PALETTES = {
    'terrazzo-dark': {
      base: '#1c1c1e', label: 'терраццо', sub: 'тёмный · charcoal',
      thick: '12 мм', base_: 'эпоксидная смола',
      bodyColor: '#2c2c2e',
      top: 'images/terrazzo/dark-mosaic-textured-background.jpg',
      mesh: false,
      buildup: {
        topcoat:   { name: 'Топ-герметик · 2 слоя', sku: 'Sikafloor‑304 W · 2 × 0.1 мм' },
        body:      { name: 'Терраццо-масса',        sku: 'Sikafloor‑263 SL + Decodur basalt · 8 мм' },
        primer:    { name: 'Праймер + кварц',       sku: 'Sikafloor‑156 + кварц 0.4–0.7 · 0.8 мм' },
        substrate: { name: 'Подложка',              sku: 'Бетон C25/30 · ≥ 25 МПа' }
      },
      chips: [
        { c: '#0a0a0a', w: .35 }, { c: '#9a9a9d', w: .15 },
        { c: '#6a6a6d', w: .15 }, { c: '#cfcfcf', w: .10 },
        { c: '#3a3a3c', w: .15 }, { c: '#fafafa', w: .10 }
      ]
    },
    'terrazzo-light': {
      base: '#f0ece2', label: 'терраццо', sub: 'светлый · multicolor',
      thick: '12 мм', base_: 'эпоксидная смола',
      bodyColor: '#e8e3d4',
      top: 'images/terrazzo/1671671129_kalix-club-p-tekstura-terratstso-krasivo-29.jpg',
      mesh: false,
      buildup: {
        topcoat:   { name: 'PU-топ · 2 слоя',   sku: 'Sikafloor‑304 W · 2 × 0.1 мм' },
        body:      { name: 'Терраццо-масса',    sku: 'Sikafloor‑264 white + multicolor chips · 8 мм' },
        primer:    { name: 'Праймер + кварц',   sku: 'Sikafloor‑156 + кварц · 0.8 мм' },
        substrate: { name: 'Подложка',          sku: 'Бетон C25/30 · ≥ 25 МПа' }
      },
      chips: [
        { c: '#2c5e88', w: .10 }, { c: '#d8a82e', w: .08 },
        { c: '#c66a3a', w: .07 }, { c: '#7a8a78', w: .07 },
        { c: '#9a9594', w: .15 }, { c: '#1d1d1f', w: .08 },
        { c: '#d6d2c8', w: .25 }, { c: '#c4a878', w: .10 },
        { c: '#fff', w: .10 }
      ]
    },
    terrazzo: {
      base: '#efe7d6', label: 'терраццо', sub: 'венецианское · цементное',
      thick: '15–20 мм', base_: 'белый цемент + мраморная крошка',
      bodyColor: '#e8dec8',
      top: 'images/terrazzo/macrophotography-terrazzo-slab-texture.jpg',
      mesh: false,
      buildup: {
        topcoat:   { name: 'Воск + ProSeal · 2 слоя', sku: 'Sikafloor ProSeal-22 + Sikagard wax · 2 × 0.05 мм' },
        body:      { name: 'Цементно-мраморная масса', sku: 'White cement + Carrara/Verona chips · 15–20 мм' },
        primer:    { name: 'Цементный контакт',        sku: 'SikaTop‑77 D · 1 мм' },
        substrate: { name: 'Подложка',                  sku: 'Бетон C25/30 · ≥ 25 МПа' }
      },
      chips: [
        { c: '#d9c39a', w: .18 }, { c: '#1c1916', w: .12 },
        { c: '#7d6f54', w: .18 }, { c: '#c2603e', w: .06 },
        { c: '#5a6a4f', w: .05 }, { c: '#b9a98a', w: .20 },
        { c: '#fff', w: .08 }
      ]
    },
    epoxy: {
      base: '#2a2620', label: 'эпокси SL', sub: 'self-leveling · RAL 9005',
      thick: '2.5 мм', base_: 'эпоксидная смола',
      bodyColor: '#3a342c',
      top: 'images/microtopping/gray-old-scratched-textured-surface-background.jpg',
      filter: 'brightness(.45) contrast(1.15) saturate(.6) hue-rotate(-8deg)',
      mesh: false,
      buildup: {
        topcoat:   { name: 'PU-топ · 2 слоя', sku: 'Sikafloor‑304 W · 2 × 0.1 мм' },
        body:      { name: 'Self-levelling эпоксид', sku: 'Sikafloor‑263 SL · 2 мм (RAL 9005)' },
        primer:    { name: 'Праймер + кварц',  sku: 'Sikafloor‑156 + кварц · 0.8 мм' },
        substrate: { name: 'Подложка',          sku: 'Бетон C25/30 · ≥ 25 МПа · CM ≤ 4%' }
      },
      chips: [
        { c: '#3a342c', w: .5 }, { c: '#5d5448', w: .25 },
        { c: '#1c1916', w: .25 }
      ]
    },
    'epoxy-light': {
      base: '#c2bcb0', label: 'эпокси SL', sub: 'светлый · RAL 7044',
      thick: '2.5 мм', base_: 'эпоксидная смола',
      bodyColor: '#bab4a8',
      top: 'images/terrazzo/cement-concrete-texture-copy-space.jpg',
      filter: 'brightness(1.18) contrast(.85) saturate(.4)',
      mesh: false,
      buildup: {
        topcoat:   { name: 'PU-топ · 2 слоя', sku: 'Sikafloor‑304 W · 2 × 0.1 мм' },
        body:      { name: 'Self-levelling эпоксид', sku: 'Sikafloor‑263 SL · 2 мм (RAL 7044)' },
        primer:    { name: 'Праймер + кварц',  sku: 'Sikafloor‑156 + кварц · 0.8 мм' },
        substrate: { name: 'Подложка',          sku: 'Бетон C25/30 · ≥ 25 МПа · CM ≤ 4%' }
      },
      chips: [
        { c: '#bab4a8', w: .55 }, { c: '#a8a298', w: .25 },
        { c: '#d4cec0', w: .20 }
      ]
    },
    micro: {
      base: '#cfc4b3', label: 'микротопинг', sub: 'satin · cream',
      thick: '2.5–3 мм', base_: 'минеральная база',
      bodyColor: '#cfc4b3',
      top: 'images/microtopping/gray-old-scratched-textured-surface-background.jpg',
      mesh: true,
      buildup: {
        topcoat:   { name: 'PU защита · 2 слоя', sku: 'Sikafloor‑304 W · 2 × 0.075 мм' },
        body:      { name: 'Финиш-микротопинг · 2 прохода', sku: 'Sika MonoTop decorative finish · 1 мм' },
        mesh:      { name: 'База + стеклосетка 4×4 мм', sku: 'Sika MonoTop base + fibreglass mesh · 1.5 мм' },
        primer:    { name: 'Адгезионный праймер', sku: 'Sikafloor‑161 / Concrete Primer · 0.2 мм' },
        substrate: { name: 'Подложка',            sku: 'Бетон / стяжка C20/25' }
      },
      chips: [
        { c: '#b9a98a', w: .4 }, { c: '#9a8e7b', w: .3 },
        { c: '#dccaa9', w: .3 }
      ]
    },
    concrete: {
      base: '#7a7468', label: 'бетон', sub: 'полированный · densify-only',
      thick: '0 мм наращивания', base_: 'существующая плита',
      bodyColor: '#7a7468',
      top: 'images/terrazzo/cement-concrete-texture-copy-space.jpg',
      mesh: false,
      buildup: {
        topcoat:   { name: 'Олеофоб + полировка · 2 слоя', sku: 'Sikagard‑705 L · 2 × 0.02 мм' },
        body:      { name: 'Полировка 400 → 3000 grit',     sku: 'механика без наращивания' },
        primer:    { name: 'Литий-силикатный упрочнитель',   sku: 'Sikafloor ProSeal-22 (Li densifier) · 0.05 мм' },
        substrate: { name: 'Бетонная плита',                  sku: 'существующая плита, шлифовка 50–100 grit' }
      },
      chips: [
        { c: '#5d5448', w: .3 }, { c: '#3a342c', w: .2 },
        { c: '#9a9286', w: .3 }, { c: '#a8a298', w: .2 }
      ]
    },
    purcem: {
      base: '#9a9690', label: 'PU-cement', sub: 'food / pharma · HACCP',
      thick: '6–9 мм', base_: 'полиуретан + цемент',
      bodyColor: '#9a9690',
      top: 'images/microtopping/gray-old-scratched-textured-surface-background.jpg',
      filter: 'brightness(.92) saturate(.4) hue-rotate(155deg)',
      mesh: false,
      buildup: {
        topcoat:   { name: 'PU-cement seal · 2 слоя', sku: 'Sikafloor PurCem HM-Top · 2 × 0.15 мм' },
        body:      { name: 'PurCem основной слой',     sku: 'Sikafloor PurCem HM-21N · 6–9 мм' },
        primer:    { name: 'Без праймера (на влажный бетон)', sku: '— · опц. Sika Concrete Primer' },
        substrate: { name: 'Бетон с насечкой',          sku: 'Бетон C25/30, mechanically prepared' }
      },
      chips: [
        { c: '#7a7670', w: .35 }, { c: '#a8a49e', w: .35 },
        { c: '#5a564f', w: .15 }, { c: '#bab6b0', w: .15 }
      ]
    },
    mma: {
      base: '#3c3a35', label: 'MMA Pronto', sub: 'fast-cure · cold storage',
      thick: '3 мм', base_: 'MMA смола',
      bodyColor: '#3c3a35',
      top: 'images/terrazzo/macrophotography-terrazzo-slab-texture.jpg',
      filter: 'brightness(.55) contrast(1.3) saturate(.7) hue-rotate(15deg)',
      mesh: false,
      buildup: {
        topcoat:   { name: 'MMA seal · 2 слоя', sku: 'Sikafloor‑18 Pronto · 2 × 0.1 мм' },
        body:      { name: 'MMA body',           sku: 'Sikafloor‑24 Pronto SL · 2 мм' },
        primer:    { name: 'MMA праймер + кварц', sku: 'Sikafloor‑13 Pronto + кварц · 0.8 мм' },
        substrate: { name: 'Подложка',             sku: 'Бетон C25/30 · ≥ 25 МПа' }
      },
      chips: [
        { c: '#4a4640', w: .50 }, { c: '#5e5a50', w: .25 },
        { c: '#28261f', w: .25 }
      ]
    },
    rubber: {
      base: '#2a2a2a', label: 'резина', sub: 'sport / playground · poured',
      thick: '6 мм', base_: 'EPDM-гранулят + PU-связующее',
      bodyColor: '#2a2a2a',
      top: null,
      mesh: false,
      buildup: {
        topcoat:   { name: 'EPDM-finish · 2 мм', sku: 'Цветной EPDM 1–4 мм + PU 1K · 2 мм' },
        body:      { name: 'SBR-base',           sku: 'SBR-гранулят 1–4 мм + PU-связующее · 4–6 мм' },
        primer:    { name: 'PU-праймер',         sku: 'Sika ComfortFloor primer (PS-65) · 0.2 мм' },
        substrate: { name: 'Подложка',           sku: 'Бетон C20/25 / асфальт' }
      },
      chips: [
        { c: '#1a1a1a', w: .55 }, { c: '#3a3a3a', w: .30 },
        { c: '#cf3a3a', w: .05 }, { c: '#1d4f8a', w: .05 },
        { c: '#dca858', w: .05 }
      ]
    }
  };

  /* ---------- per-material control schemas (right panel) ---------- */
  // Each schema: array of groups. group.id maps to PALETTES.controls state key.
  // option.id is encoded in URL params; option.label rendered (passes through localize()).
  // option.swatch (optional) renders a colored circle on the button.
  // option.hex (optional) is the body/base color override applied when picked.
  // CONTROL_SCHEMAS is *populated* from materials.config.json by buildSchemasFromConfig().
  // Fallback inline schemas live below — used when fetch fails.
  const CONTROL_LABELS = {
    color: 'Цвет',
    aggregate: 'Агрегат',
    accents: 'Акценты',
    strips: 'Саргелим',
    finish: 'Финиш',
    flecks: 'Флеки',
    broadcast: 'Кварц-broadcast',
    aggregateExposure: 'Степень обнажения · CPC class',
    trowelPattern: 'Затирка · Pandomo',
    pattern: 'Узор',
    broadcastMedia: 'Broadcast media',
    cureMode: 'Режим отверждения',
    roughness: 'Текстура · R-класс',
    marking: 'Дорожная разметка',
    thickness: 'Толщина',
    coveBase: 'Cove-base (плинтус-галтель)',
    drain: 'Водоотвод',
    certification: 'Сертификация'
  };
  const CONTROL_SCHEMAS = {
    /* terrazzo-dark — populated below from buildSchemasFromConfig or fallback */
  };

  // Aggregate id → chip palette (overrides PALETTES[mat].chips when active)
  // Spec-aligned realistic chip palettes per aggregate option (each must be visibly different).
  const AGGREGATE_CHIPS = {
    basalt:  [
      { c: '#0a0a0a', w: .35 }, { c: '#3a3a3c', w: .25 },
      { c: '#6a6a6d', w: .20 }, { c: '#cfcfcf', w: .12 },
      { c: '#fafafa', w: .08 }
    ],
    carrara: [
      { c: '#fafafa', w: .50 }, { c: '#cfcfcf', w: .25 },
      { c: '#9a9a9d', w: .15 }, { c: '#3a3a3c', w: .10 }
    ],
    verona:  [
      { c: '#a8584a', w: .28 }, { c: '#c89a55', w: .22 },
      { c: '#e8dec8', w: .25 }, { c: '#5a2820', w: .15 },
      { c: '#dcc8a0', w: .10 }
    ],
    mirror:  [
      { c: '#a8d0e0', w: .25 }, { c: '#c8cdd0', w: .25 },
      { c: '#3a7050', w: .15 }, { c: '#2c4a78', w: .15 },
      { c: '#c89030', w: .10 }, { c: '#ffffff', w: .10 }
    ],
    brass:   [
      { c: '#b8902a', w: .35 }, { c: '#6a4d12', w: .25 },
      { c: '#a0681c', w: .20 }, { c: '#d4b048', w: .12 },
      { c: '#28200c', w: .08 }
    ],
    // v7 — 11 new aggregates from industry taxonomy (R1 of taxonomy doc)
    'nero-marquina':       [{c:'#161616',w:.55},{c:'#3a3a3a',w:.20},{c:'#ffffff',w:.20},{c:'#7a7a7a',w:.05}],
    'travertino-romano':   [{c:'#d8c2a0',w:.35},{c:'#b59874',w:.30},{c:'#7a5d40',w:.20},{c:'#e8d8b8',w:.15}],
    'giallo-siena':        [{c:'#d8b572',w:.35},{c:'#b08a40',w:.25},{c:'#5e4520',w:.20},{c:'#e8c878',w:.20}],
    'granite-sardo':       [{c:'#7c7c80',w:.35},{c:'#a8a8ac',w:.25},{c:'#3e3e42',w:.25},{c:'#5a5a5e',w:.15}],
    'quartz-clear':        [{c:'#f5f5f0',w:.50},{c:'#dcdcd4',w:.25},{c:'#a9a9a3',w:.15},{c:'#ffffff',w:.10}],
    'recycled-glass-cyan': [{c:'#5fb8c4',w:.35},{c:'#2c7a85',w:.20},{c:'#cfeef2',w:.25},{c:'#1d4a55',w:.10},{c:'#88d0d8',w:.10}],
    'mop-iridescent':      [{c:'#f0e8df',w:.30},{c:'#c8b8d4',w:.25},{c:'#a9d4d0',w:.25},{c:'#fafafa',w:.20}],
    'brass-dust':          [{c:'#c9a24a',w:.50},{c:'#8a6a20',w:.30},{c:'#f0d480',w:.20}],
    'copper-flake':        [{c:'#b87333',w:.45},{c:'#7a3f1a',w:.30},{c:'#e0a070',w:.25}],
    'palladiana-mix':      [{c:'#e8e3da',w:.35},{c:'#a89880',w:.25},{c:'#3a3530',w:.20},{c:'#bca890',w:.20}],
    'antique-coin':        [{c:'#b8923a',w:.50},{c:'#7a5a20',w:.30},{c:'#e8c060',w:.20}]
  };

  // Inline fallback config — keeps lab functional if materials.config.json fetch fails.
  const INLINE_CONFIG_FALLBACK = {
    version: 1,
    materials: [
      { id: 'terrazzo-dark',  group: 'decor',      label: 'Терраццо тёмный',     swatch: '#1c1c1e', controls: ['color','aggregate','strips','roughness','finish'], defaults: { color:'charcoal', aggregate:'basalt', strips:'off', roughness:'smooth', finish:'matte' } },
      { id: 'terrazzo-light', group: 'decor',      label: 'Терраццо светлый',    swatch: '#f0ece2', controls: ['color','aggregate','strips','roughness','finish'], defaults: { color:'white',    aggregate:'carrara', strips:'off', roughness:'smooth', finish:'matte' } },
      { id: 'terrazzo',       group: 'decor',      label: 'Терраццо венецианский', swatch: '#efe7d6', controls: ['color','aggregate','strips','roughness','finish'], defaults: { color:'white', aggregate:'carrara', strips:'off', roughness:'smooth', finish:'matte' } },
      { id: 'epoxy-light',    group: 'decor',      label: 'Эпоксид',             swatch: '#c2bcb0', controls: ['color','flecks','strips','roughness','finish','marking'], defaults: { color:'7044', flecks:'off', strips:'off', roughness:'smooth', finish:'matte', marking:'off' } },
      { id: 'micro',          group: 'decor',      label: 'Микротопинг',         swatch: '#cfc4b3', controls: ['color','strips','roughness','finish'], defaults: { color:'cream', strips:'off', roughness:'smooth', finish:'satin' } },
      { id: 'mma',            group: 'decor',      label: 'MMA Pronto',          swatch: '#3c3a35', controls: ['color','flecks','strips','roughness','finish','marking'], defaults: { color:'9005', flecks:'off', strips:'off', roughness:'smooth', finish:'satin', marking:'off' } },
      { id: 'concrete',       group: 'industrial', label: 'Полированный цемент', swatch: '#7a7468', controls: ['color','strips','roughness','finish','marking'], defaults: { color:'salt', strips:'off', roughness:'smooth', finish:'polished', marking:'off' } },
      { id: 'purcem',         group: 'industrial', label: 'PU-cement / ПУ-цемент', swatch: '#9a9690', controls: ['color','roughness','finish','marking'], defaults: { color:'7037', roughness:'smooth', finish:'satin', marking:'off' } },
      { id: 'rubber',         group: 'industrial', label: 'Резиновое покрытие',  swatch: '#2a2a2a', controls: ['color','roughness','marking'], defaults: { color:'black', roughness:'smooth', marking:'off' } },
      { id: 'epoxy',          group: 'industrial', label: 'Эпоксидная заливка',  swatch: '#2a2620', controls: ['color','roughness','finish','marking'], defaults: { color:'9005', roughness:'smooth', finish:'satin', marking:'off' } }
    ],
    controlOptions: {
      color: {
        'terrazzo-dark':  [{id:'charcoal',label:'Charcoal',hex:'#1c1c1e',swatch:'#1c1c1e'},{id:'anthracite',label:'Anthracite',hex:'#2c2c2e',swatch:'#2c2c2e'},{id:'graphite',label:'Graphite',hex:'#3a3a3c',swatch:'#3a3a3c'},{id:'stone',label:'Stone',hex:'#5a5a5c',swatch:'#5a5a5c'}],
        'terrazzo-light': [{id:'white',label:'White',hex:'#f0ece2',swatch:'#f0ece2'},{id:'offwhite',label:'Off-white',hex:'#e8e3d4',swatch:'#e8e3d4'},{id:'sand',label:'Sand',hex:'#dfd4ba',swatch:'#dfd4ba'},{id:'pearl',label:'Pearl',hex:'#ebe6db',swatch:'#ebe6db'}],
        'terrazzo':       [{id:'white',label:'White',hex:'#efe7d6',swatch:'#efe7d6'},{id:'cream',label:'Cream',hex:'#e8dec8',swatch:'#e8dec8'},{id:'sand',label:'Sand',hex:'#dfd4ba',swatch:'#dfd4ba'},{id:'grey',label:'Grey',hex:'#bdb6a8',swatch:'#bdb6a8'}],
        'epoxy':          [{id:'9005',label:'RAL 9005',hex:'#0a0a0a',swatch:'#0a0a0a'},{id:'7016',label:'RAL 7016',hex:'#293133',swatch:'#293133'},{id:'7044',label:'RAL 7044',hex:'#b3aea1',swatch:'#b3aea1'},{id:'1001',label:'RAL 1001',hex:'#c2b078',swatch:'#c2b078'},{id:'5024',label:'RAL 5024',hex:'#5d9b9b',swatch:'#5d9b9b'},{id:'6011',label:'RAL 6011',hex:'#587246',swatch:'#587246'}],
        'epoxy-light':    [{id:'7044',label:'RAL 7044',hex:'#b3aea1',swatch:'#b3aea1'},{id:'9001',label:'RAL 9001',hex:'#e9e0d2',swatch:'#e9e0d2'},{id:'9010',label:'RAL 9010',hex:'#f1ece1',swatch:'#f1ece1'},{id:'1015',label:'RAL 1015',hex:'#e6d2b5',swatch:'#e6d2b5'},{id:'7035',label:'RAL 7035',hex:'#cbd0cc',swatch:'#cbd0cc'},{id:'5024',label:'RAL 5024',hex:'#5d9b9b',swatch:'#5d9b9b'}],
        'micro':          [{id:'cream',label:'Cream',hex:'#cfc4b3',swatch:'#cfc4b3'},{id:'sand',label:'Sand',hex:'#c4b698',swatch:'#c4b698'},{id:'olive',label:'Olive',hex:'#9a9272',swatch:'#9a9272'},{id:'cement',label:'Cement-grey',hex:'#9d9b96',swatch:'#9d9b96'},{id:'charcoal',label:'Charcoal',hex:'#3a3a3c',swatch:'#3a3a3c'}],
        'purcem':         [{id:'7037',label:'RAL 7037',hex:'#7d7f7d',swatch:'#7d7f7d'},{id:'1015',label:'RAL 1015',hex:'#e6d2b5',swatch:'#e6d2b5'},{id:'8004',label:'RAL 8004',hex:'#a04125',swatch:'#a04125'},{id:'6011',label:'RAL 6011',hex:'#587246',swatch:'#587246'},{id:'7035',label:'RAL 7035',hex:'#cbd0cc',swatch:'#cbd0cc'}],
        'mma':            [{id:'9005',label:'RAL 9005',hex:'#0a0a0a',swatch:'#0a0a0a'},{id:'7044',label:'RAL 7044',hex:'#b3aea1',swatch:'#b3aea1'},{id:'1001',label:'RAL 1001',hex:'#c2b078',swatch:'#c2b078'},{id:'5024',label:'RAL 5024',hex:'#5d9b9b',swatch:'#5d9b9b'},{id:'clear',label:'Clear pigmented',hex:'#3c3a35',swatch:'#3c3a35'}],
        'concrete':       [{id:'salt',label:'Salt-pepper',hex:'#7a7468',swatch:'#7a7468'},{id:'cream',label:'Cream',hex:'#9a9286',swatch:'#9a9286'},{id:'full',label:'Full-aggregate',hex:'#5d5448',swatch:'#5d5448'}],
        'rubber':         [{id:'black',label:'Black',hex:'#1a1a1a',swatch:'#1a1a1a'},{id:'red',label:'Red',hex:'#a82a28',swatch:'#a82a28'},{id:'blue',label:'Blue',hex:'#1d4f8a',swatch:'#1d4f8a'},{id:'sand',label:'Sand',hex:'#bca27a',swatch:'#bca27a'},{id:'multicolor',label:'Multicolor',hex:'#3a3a3a',swatch:'#5a5a5a'}]
      },
      aggregate: {
        'terrazzo-dark':  [{id:'basalt',label:'Basalt'},{id:'carrara',label:'Carrara'},{id:'verona',label:'Verona'},{id:'mirror',label:'Glass-mirror'},{id:'brass',label:'Brass-flake'}],
        'terrazzo-light': [{id:'carrara',label:'Carrara'},{id:'verona',label:'Verona'},{id:'basalt',label:'Basalt'},{id:'mirror',label:'Glass-mirror'},{id:'brass',label:'Brass-flake'}],
        'terrazzo':       [{id:'carrara',label:'Carrara'},{id:'verona',label:'Verona'},{id:'basalt',label:'Basalt'},{id:'mirror',label:'Glass-mirror'},{id:'brass',label:'Brass-flake'}]
      },
      strips: [{id:'off',label:'Без полос'},{id:'brass4',label:'Латунь 4мм',hex:'#b8902a'},{id:'alu4',label:'Алюминий 4мм',hex:'#cdd0d4'},{id:'black6',label:'Чёрный 6мм',hex:'#0a0a0a'},{id:'mixed',label:'Смешанные',hex:'#7a5a18'}],
      finish: [{id:'matte',label:'Matte'},{id:'satin',label:'Satin'},{id:'polished',label:'Polished'},{id:'glossy',label:'Glossy'},{id:'wetlook',label:'Wet-look'}],
      flecks: [{id:'off',label:'Без флеков'},{id:'fine',label:'Vinyl chips'},{id:'coarse',label:'Coarse 1/8″'},{id:'mica',label:'Mica'},{id:'metallic',label:'Metallic FX'}],
      roughness: [{id:'smooth',label:'Smooth'},{id:'fine',label:'Fine grit'},{id:'coarse',label:'Coarse anti-slip'}],
      marking: [{id:'off',label:'Без разметки'},{id:'yellow-zone',label:'Жёлтая зона'},{id:'white-grid',label:'Белая сетка'},{id:'red-safety',label:'Красная зона'},{id:'pedestrian',label:'Зебра'}]
    }
  };

  // Build CONTROL_SCHEMAS dynamically from a config (incl. fallback structure).
  function buildSchemasFromConfig(config) {
    const opts = config.controlOptions || {};
    config.materials.forEach(mat => {
      const matId = mat.id;
      const groups = (mat.controls || []).map(ctrlId => {
        let options;
        if (opts[ctrlId] && Array.isArray(opts[ctrlId])) {
          // shared list (strips/finish/flecks/roughness/marking/coveBase/drain/certification)
          options = opts[ctrlId];
        } else if (opts[ctrlId] && opts[ctrlId][matId]) {
          // per-material list (color/aggregate/thickness)
          options = opts[ctrlId][matId];
        } else {
          options = [];
        }
        if (!options.length) return null;
        return {
          id: ctrlId,
          label: CONTROL_LABELS[ctrlId] || ctrlId,
          mode: 'single',
          options: options.slice()
        };
      }).filter(Boolean);
      CONTROL_SCHEMAS[matId] = groups;
    });
    // Cache loaded config for any other consumer
    window.__floordsgnMaterials = config;
    window.__floordsgnPresets = Array.isArray(config.presets) ? config.presets : [];
    window.__floordsgnGlossary = config.glossary || {};
  }

  // Strip-overlay style for терраццо саргелим (CSS background)
  // Each metallic strip is a layered linear-gradient with a 1px highlight + drop-shadow ridge.
  function stripsBackground(stripId) {
    if (!stripId || stripId === 'off') return 'none';
    // Metallic gradients — 3-stop linear: shadow → core → highlight → core → shadow
    const brassGrad   = 'linear-gradient(180deg,#7a5a18 0%,#b8902a 18%,#e6c870 48%,#b8902a 78%,#5a4012 100%)';
    const aluGrad     = 'linear-gradient(180deg,#8a8d92 0%,#cdd0d4 18%,#f4f6f8 48%,#cdd0d4 78%,#7e8186 100%)';
    const blackGrad   = 'linear-gradient(180deg,#000 0%,#1d1d1f 30%,#3a3a3c 50%,#1d1d1f 70%,#000 100%)';
    // Util — vertical bar at fraction f of width, given strip width w (px), gradient g
    const bar = (f, w, g) =>
      `linear-gradient(${g}) ${f}% 0/${w}px 100% no-repeat`;
    const set = arr => arr.join(', ');
    if (stripId === 'brass4') {
      return set([
        bar(12.5, 3, brassGrad),
        bar(25,   4, brassGrad),
        bar(50,   4, brassGrad),
        bar(75,   4, brassGrad),
        bar(87.5, 3, brassGrad)
      ]);
    }
    if (stripId === 'alu4') {
      return set([
        bar(12.5, 3, aluGrad),
        bar(25,   4, aluGrad),
        bar(50,   4, aluGrad),
        bar(75,   4, aluGrad),
        bar(87.5, 3, aluGrad)
      ]);
    }
    if (stripId === 'black6') {
      return set([
        bar(30, 8, blackGrad),
        bar(50, 8, blackGrad),
        bar(70, 8, blackGrad)
      ]);
    }
    if (stripId === 'mixed') {
      return set([
        bar(20, 4, brassGrad),
        bar(40, 6, blackGrad),
        bar(60, 4, brassGrad),
        bar(80, 6, blackGrad)
      ]);
    }
    return 'none';
  }

  // CTA URL builder — links to quote.html with all current state encoded as URL params.
  // Owner brief: CTA "Заказать эту формулу" → quote.html?<state>; state also persisted to localStorage.
  function quoteHrefFor(material, st) {
    const params = new URLSearchParams();
    params.set('material', material);
    Object.keys(st || {}).forEach(k => {
      const v = st[k];
      if (v != null && v !== '' && v !== 'off') params.set(k, v);
    });
    return 'quote.html?' + params.toString();
  }
  // Backward-compatible alias used elsewhere
  function systemHrefFor(material, st) { return quoteHrefFor(material, st); }

  // Map finish id → CSS variables for plate gloss/contrast.
  // Returns { gloss, filter, shine, reflection } — drives multiple visual layers
  // (sheen overlay opacity, contrast, highlight band size). 5 distinct steps.
  function glossVarsFor(finishId) {
    switch (finishId) {
      case 'matte':    return { gloss: '.05', shine: '.04', reflection: '.06', filter: 'contrast(.96) brightness(.97) saturate(.95)' };
      case 'satin':    return { gloss: '.25', shine: '.22', reflection: '.18', filter: 'contrast(1.02) brightness(1.01)' };
      case 'polished': return { gloss: '.55', shine: '.50', reflection: '.42', filter: 'contrast(1.08) brightness(1.03)' };
      case 'glossy':   return { gloss: '.78', shine: '.78', reflection: '.66', filter: 'contrast(1.12) brightness(1.05) saturate(1.05)' };
      case 'wetlook':  return { gloss: '.95', shine: '.96', reflection: '.92', filter: 'contrast(1.18) brightness(1.08) saturate(1.12)' };
      case 'clear':    return { gloss: '.85', shine: '.78', reflection: '.62', filter: 'contrast(1.10) brightness(1.04)' };
      case 'pigmented':return { gloss: '.30', shine: '.24', reflection: '.20', filter: 'contrast(1.02) brightness(1.00)' };
      default:         return { gloss: '.25', shine: '.22', reflection: '.18', filter: 'contrast(1.02) brightness(1.01)' };
    }
  }

  // Polish grit (concrete) → gloss intensity
  function gritGlossVars(gritId) {
    switch (gritId) {
      case '400':  return { gloss: '.05', shine: '.04', reflection: '.06', filter: 'contrast(.98) brightness(.95)' };
      case '800':  return { gloss: '.30', shine: '.26', reflection: '.22', filter: 'contrast(1.03) brightness(.98)' };
      case '1500': return { gloss: '.60', shine: '.55', reflection: '.45', filter: 'contrast(1.06) brightness(1.02)' };
      case '3000': return { gloss: '.92', shine: '.90', reflection: '.84', filter: 'contrast(1.12) brightness(1.06)' };
      default:     return { gloss: '.30', shine: '.26', reflection: '.22', filter: 'none' };
    }
  }

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function buildTerrazzo(svg, key) {
    if (!svg) return;
    const p = PALETTES[key];
    if (!p) return;
    svg.innerHTML = '';
    const W = 480, H = 480;
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');
    defs.innerHTML = `
      <radialGradient id="fxVg" cx="50%" cy="50%" r="60%">
        <stop offset="0" stop-color="rgba(255,255,255,.06)"/>
        <stop offset="1" stop-color="rgba(0,0,0,.18)"/>
      </radialGradient>
      <filter id="fxGrain"><feTurbulence baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
    svg.appendChild(defs);

    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('width', W); r.setAttribute('height', H);
    r.setAttribute('fill', p.base);
    svg.appendChild(r);

    const chipCount = key === 'terrazzo' ? 260
      : key === 'concrete' ? 180
      : key === 'micro' ? 120 : 80;

    function pickColor() {
      const r = Math.random();
      let acc = 0;
      for (const c of p.chips) {
        acc += c.w;
        if (r <= acc) return c.c;
      }
      return p.chips[0].c;
    }

    for (let i = 0; i < chipCount; i++) {
      const cx = rnd(-10, W + 10), cy = rnd(-10, H + 10);
      const isTerr = key === 'terrazzo';
      const sz = isTerr ? rnd(3, 32) : rnd(1, 5);
      const rot = rnd(0, 360);
      const sides = isTerr ? Math.floor(rnd(3, 7)) : 4;
      const pts = [];
      for (let k = 0; k < sides; k++) {
        const a = rot + k * (360 / sides) + rnd(-12, 12);
        const rr = sz * rnd(.7, 1.1);
        pts.push(`${(cx + Math.cos(a * Math.PI / 180) * rr).toFixed(1)},${(cy + Math.sin(a * Math.PI / 180) * rr).toFixed(1)}`);
      }
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', pickColor());
      poly.setAttribute('opacity', isTerr ? rnd(.85, 1).toFixed(2) : rnd(.4, .85).toFixed(2));
      svg.appendChild(poly);
    }

    const v = document.createElementNS(ns, 'rect');
    v.setAttribute('width', W); v.setAttribute('height', H);
    v.setAttribute('fill', 'url(#fxVg)');
    svg.appendChild(v);

    const g = document.createElementNS(ns, 'rect');
    g.setAttribute('width', W); g.setAttribute('height', H);
    g.setAttribute('filter', 'url(#fxGrain)');
    g.setAttribute('opacity', '.6');
    svg.appendChild(g);
  }

  /* ---------------- /quote.html calculator ---------------- */
  fx.initCalc = function () {
    const card = document.querySelector('.fx-calc-card');
    if (!card) return;
    let p = 280, k = 1.0;
    const $area = card.querySelector('[data-fx="cAreaInput"]');
    if (!$area) return;

    // Approx USD->ILS for orientational dual display. Updated periodically.
    const ILS_PER_USD = 3.65;
    const cta = card.querySelector('.fx-calc-cta');
    const baseHref = cta ? cta.getAttribute('href') : 'contact.html';

    const set = () => {
      const m2 = +$area.value;
      const lbl = card.querySelector('[data-fx="cAreaLbl"]');
      const val = card.querySelector('[data-fx="cAreaVal"]');
      if (lbl) lbl.textContent = m2;
      if (val) val.textContent = m2;
      const totalUsd = Math.round(m2 * p * k);
      const totalIls = Math.round(totalUsd * ILS_PER_USD / 100) * 100;
      const perM2Ils = m2 > 0 ? Math.round(totalIls / m2) : 0;
      const out = card.querySelector('[data-fx="cTotal"]');
      const outIls = card.querySelector('[data-fx="cTotalIls"]');
      const outPerM2 = card.querySelector('[data-fx="cPerM2"]');
      if (out) out.textContent = totalUsd.toLocaleString('ru-RU').replace(/,/g, ' ');
      if (outIls) outIls.textContent = totalIls.toLocaleString('ru-RU').replace(/,/g, ' ');
      if (outPerM2) outPerM2.textContent = perM2Ils.toLocaleString('ru-RU').replace(/,/g, ' ');

      // Pre-fill contact link with calculator state — don't lose the hot lead
      if (cta) {
        const matEl = card.querySelector('[data-fx="cMat"] .on');
        const useEl = card.querySelector('[data-fx="cUse"] .on');
        const params = new URLSearchParams({
          system: matEl ? matEl.dataset.v : '',
          area: m2,
          use: useEl ? useEl.dataset.v : '',
          estimate_usd: totalUsd,
          estimate_ils: totalIls,
        });
        cta.setAttribute('href', baseHref.split('?')[0] + '?' + params.toString());
      }
    };

    $area.addEventListener('input', set);

    card.querySelectorAll('[data-fx="cMat"] button, [data-fx="cMat"] span').forEach(s => {
      s.addEventListener('click', () => {
        card.querySelectorAll('[data-fx="cMat"] button, [data-fx="cMat"] span').forEach(x => x.classList.remove('on'));
        s.classList.add('on');
        p = +s.dataset.p;
        set();
      });
    });
    card.querySelectorAll('[data-fx="cUse"] button, [data-fx="cUse"] span').forEach(s => {
      s.addEventListener('click', () => {
        card.querySelectorAll('[data-fx="cUse"] button, [data-fx="cUse"] span').forEach(x => x.classList.remove('on'));
        s.classList.add('on');
        k = +s.dataset.k;
        set();
      });
    });

    // Prefill material from ?material= query param (sent by hero-lab CTA)
    try {
      const qs = new URLSearchParams(window.location.search);
      const m = qs.get('material');
      if (m) {
        const map = {
          'terrazzo': 'terrazzo', 'terrazzo-dark': 'terrazzo', 'terrazzo-light': 'terrazzo',
          'epoxy': 'epoxy', 'epoxy-light': 'epoxy',
          'micro': 'micro', 'concrete': 'concrete',
          'purcem': 'pucement', 'mma': 'mma', 'rubber': 'epoxy'
        };
        const target = map[m] || m;
        const matBtn = card.querySelector('[data-fx="cMat"] [data-v="' + target + '"]');
        if (matBtn) {
          card.querySelectorAll('[data-fx="cMat"] button, [data-fx="cMat"] span').forEach(x => x.classList.remove('on'));
          matBtn.classList.add('on');
          p = +matBtn.dataset.p || p;
        }
      }
    } catch (e) { /* prefill is best-effort; ignore failures */ }

    set();
  };

  /* ---------------- 3D rotating plate (HERO LAB v3 2026-05-09) --------------------- */
  fx.init3DPlate = function () {
    const plate = document.querySelector('[data-fx="plate"]');
    if (!plate) return;
    const topPattern = document.querySelector('[data-fx="topPattern"]');
    if (!topPattern) return;

    const controlsRoot   = document.querySelector('[data-fx="controls"]');
    const stripsOverlay  = document.querySelector('[data-fx="strips"]');
    const flecksOverlay  = document.querySelector('[data-fx="flecks"]');
    const textureOverlay = document.querySelector('[data-fx="texture"]');
    const markingOverlay = document.querySelector('[data-fx="marking"]');
    const sheenOverlay   = document.querySelector('[data-fx="sheen"]');
    const systemLink     = document.querySelector('[data-fx="systemLink"]');
    const introBlock     = document.querySelector('.fx-hero-lab__intro');
    const heroSection    = document.querySelector('.fx-hero-lab');
    const liveAnnounce   = document.querySelector('[data-fx="liveAnnounce"]');
    const ctaHelper      = document.querySelector('[data-fx="ctaHelper"]');
    const LS_KEY         = 'floordsgn-lab-state';
    const LS_ONBOARDED   = 'floordsgn-lab-onboarded';

    // ---------- Config loader: try fetch then fall back to inline ----------
    function loadConfig(cb) {
      if (window.__floordsgnMaterials) {
        try { buildSchemasFromConfig(window.__floordsgnMaterials); cb(); return; } catch (e) {}
      }
      // Find config relative to current page (handles /en/ subpath too)
      const url = (location.pathname.indexOf('/en/') === 0 ? '../' : '') + 'materials.config.json';
      let done = false;
      const finish = (cfg, source) => {
        if (done) return;
        done = true;
        try {
          buildSchemasFromConfig(cfg);
        } catch (e) {
          console.warn('[hero-lab] config build failed, using inline fallback', e);
          buildSchemasFromConfig(INLINE_CONFIG_FALLBACK);
        }
        cb();
      };
      // Hard timeout — never block the lab if fetch is slow
      const t = setTimeout(() => finish(INLINE_CONFIG_FALLBACK, 'timeout'), 1500);
      try {
        fetch(url, { cache: 'force-cache' })
          .then(r => r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)))
          .then(cfg => { clearTimeout(t); finish(cfg, 'fetch'); })
          .catch(err => { clearTimeout(t); console.warn('[hero-lab] fetch fallback', err.message); finish(INLINE_CONFIG_FALLBACK, 'fallback'); });
      } catch (e) {
        clearTimeout(t);
        finish(INLINE_CONFIG_FALLBACK, 'no-fetch');
      }
    }

    // Boot the lab AFTER config is loaded — guarantees CONTROL_SCHEMAS is populated.
    loadConfig(function boot() {
    // State store: { [material]: { control_id: option_id } }
    const state = Object.create(null);
    function defaultStateFor(material) {
      const schema = CONTROL_SCHEMAS[material] || [];
      const st = {};
      schema.forEach(g => { st[g.id] = (g.options[0] && g.options[0].id) || ''; });
      return st;
    }
    function ensureState(material) {
      if (!state[material]) state[material] = defaultStateFor(material);
      return state[material];
    }

    function persistState() {
      try {
        const snap = { material: curMat, state: state[curMat] || {} };
        localStorage.setItem(LS_KEY, JSON.stringify(snap));
        if (ctaHelper) ctaHelper.hidden = false;
      } catch (e) {}
    }
    function restoreState() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.material && CONTROL_SCHEMAS[parsed.material]) {
          state[parsed.material] = Object.assign(defaultStateFor(parsed.material), parsed.state || {});
          if (ctaHelper) ctaHelper.hidden = false;
          return parsed.material;
        }
      } catch (e) {}
      return null;
    }

    let curMat = plate.getAttribute('data-system') || 'terrazzo-dark';

    function selectedOption(material, group) {
      const st = ensureState(material);
      const schema = CONTROL_SCHEMAS[material] || [];
      const grp = schema.find(g => g.id === group);
      if (!grp) return null;
      const id = st[group];
      return grp.options.find(o => o.id === id) || grp.options[0] || null;
    }

    // Build the right-panel controls for the active material
    function renderControls(material) {
      if (!controlsRoot) return;
      const schema = CONTROL_SCHEMAS[material] || [];
      const st = ensureState(material);
      const colorGroup = schema.find(g => g.id === 'color');
      const customColor = (st.color === 'custom' && st.customHex) ? st.customHex : '';
      controlsRoot.innerHTML = schema.map(group => {
        const buttons = group.options.map(opt => {
          const isOn = st[group.id] === opt.id;
          const swatch = opt.swatch ? `<span class="fx-hero-lab__btn-dot" style="background:${opt.swatch}"></span>` : '';
          const cls = `fx-hero-lab__btn${isOn ? ' is-active' : ''}${opt.swatch ? ' has-dot' : ''}`;
          const tip = opt.tooltip ? ` data-tooltip="${String(opt.tooltip).replace(/"/g,'&quot;')}"` : '';
          return `<button type="button" class="${cls}" data-control="${group.id}" data-value="${opt.id}" aria-pressed="${isOn ? 'true' : 'false'}"${tip}>${swatch}<span class="fx-hero-lab__btn-label">${localize(opt.label)}</span></button>`;
        }).join('');
        // Custom color picker appended to color group
        let extra = '';
        if (group.id === 'color') {
          const isCustomOn = st.color === 'custom';
          const initial = customColor || (colorGroup && colorGroup.options[0] && colorGroup.options[0].hex) || '#cccccc';
          extra = `<div class="fx-hero-lab__custom-color${isCustomOn ? ' is-active' : ''}" data-fx="customColorWrap">
            <label class="fx-hero-lab__custom-label" for="fxCustomHex">${text('Свой цвет','Custom color')}</label>
            <span class="fx-hero-lab__custom-row">
              <input type="color" id="fxCustomHex" class="fx-hero-lab__custom-picker" value="${initial}" data-fx="customColorPicker" aria-label="${text('Выбрать пользовательский цвет','Pick custom color')}" />
              <input type="text" class="fx-hero-lab__custom-text" value="${customColor || ''}" placeholder="#abc123" maxlength="7" data-fx="customColorText" aria-label="${text('HEX-код цвета','Hex color code')}" />
            </span>
          </div>`;
        }
        return `<div class="fx-hero-lab__group">
          <p class="fx-hero-lab__ctrl-label">${localize(group.label)}</p>
          <div class="fx-hero-lab__btnrow">${buttons}</div>
          ${extra}
        </div>`;
      }).join('');
    }

    // Resolve final palette + apply CSS vars / overlays for current material+state
    function applyAllForMaterial(material) {
      const p = PALETTES[material];
      if (!p) return;
      const st = ensureState(material);
      plate.setAttribute('data-system', material);

      // 1) Body/base color from `color` control if hex provided, else palette default.
      // Force a clean repaint so the cross-fade is visible; set vars on plate AND
      // direct background-color on the body face-top (SVG sits above with vector chips,
      // but for solid systems the rect.fill = p.base inside the SVG, so this is the
      // fall-through color for any transparency or filter operations).
      const colorOpt = selectedOption(material, 'color');
      const customHex = (st.color === 'custom' && /^#[0-9a-fA-F]{6}$/.test(st.customHex || '')) ? st.customHex : null;
      const baseHex = customHex || (colorOpt && colorOpt.hex) || p.base;
      const bodyHex = customHex || (colorOpt && colorOpt.hex) || p.bodyColor || p.base;
      plate.style.setProperty('--plate-base', baseHex);
      plate.style.setProperty('--plate-body', bodyHex);
      plate.style.setProperty('--plate-top',  baseHex);
      const bodyTop = plate.querySelector('.fx-l-body .fx-face-top');
      if (bodyTop) bodyTop.style.backgroundColor = bodyHex;

      // 2) Aggregate (terrazzo) → swap chip palette in SVG.
      //    Concrete: "exposure" via aggregate id (salt/cream/full) tweaks chip count weight.
      const aggOpt = selectedOption(material, 'aggregate');
      let chipsForBuild = p.chips;
      if (aggOpt && AGGREGATE_CHIPS[aggOpt.id]) {
        chipsForBuild = AGGREGATE_CHIPS[aggOpt.id];
      }
      // Build SVG pattern (use chipsForBuild)
      const tempPalette = Object.assign({}, p, {
        base: baseHex,
        bodyColor: bodyHex,
        chips: chipsForBuild
      });
      // Patch palette temporarily for buildTerrazzo
      const origPalette = PALETTES[material];
      PALETTES[material] = tempPalette;
      buildTerrazzo(topPattern, material);
      PALETTES[material] = origPalette;

      // 3) Photographic top texture (v4) — REAL PHOTO as base layer, with optional
      //    aggregate-driven filter swap, then color tint via blend-mode overlay.
      const isTerrazzo = (material === 'terrazzo' || material === 'terrazzo-dark' || material === 'terrazzo-light');
      const isSolidSystem = !isTerrazzo;

      // 3a) Pick top photo: per-aggregate override for terrazzo, else material default
      const aggregatePhoto = {
        basalt:  'images/terrazzo/dark-mosaic-textured-background.jpg',
        carrara: 'images/terrazzo/macrophotography-terrazzo-slab-texture.jpg',
        verona:  'images/terrazzo/macrophotography-terrazzo-slab-texture.jpg',
        mirror:  'images/terrazzo/scale_2400.jpeg',
        brass:   'images/terrazzo/macrophotography-terrazzo-slab-texture.jpg'
      };
      const aggregateFilter = {
        basalt:  'none',
        carrara: 'brightness(1.45) saturate(.55) contrast(1.05)',
        verona:  'hue-rotate(-12deg) saturate(1.45) brightness(.95)',
        mirror:  'brightness(1.10) saturate(1.20) contrast(1.05)',
        brass:   'sepia(.45) brightness(.96) saturate(1.5) hue-rotate(-22deg)'
      };

      let topImage = p.top || null;
      let topFilter = p.filter || 'none';
      if (isTerrazzo && aggOpt && aggregatePhoto[aggOpt.id]) {
        // Material default uses its own canonical photo — only override if material isn't dark+basalt etc.
        // For terrazzo-dark, basalt = the dark mosaic photo (already default). For carrara/verona/mirror/brass swap.
        if (material === 'terrazzo-dark') {
          if (aggOpt.id !== 'basalt') {
            topImage = aggregatePhoto[aggOpt.id];
            topFilter = aggregateFilter[aggOpt.id];
            // For dark-base aggregates other than basalt, darken slightly to keep "dark" mood
            if (aggOpt.id === 'carrara') topFilter = 'brightness(1.05) saturate(.5) contrast(1.10)';
          }
        } else {
          topImage = aggregatePhoto[aggOpt.id] || topImage;
          topFilter = aggregateFilter[aggOpt.id] || topFilter;
        }
      }

      if (topImage) {
        plate.style.setProperty('--plate-top-image', `url("${topImage}")`);
        plate.style.setProperty('--plate-top-filter', topFilter);
        // For solid systems, hide the procedural SVG chips (the photo IS the base)
        // For terrazzo, keep SVG faint to add micro-chip detail over the photo
        plate.style.setProperty('--plate-svg-opacity', isSolidSystem ? '0' : '0.35');
      } else {
        plate.style.setProperty('--plate-top-image', 'none');
        plate.style.setProperty('--plate-top-filter', 'none');
        plate.style.setProperty('--plate-svg-opacity', '1');
      }

      // 3b) Color tint overlay — for solid systems the chosen color hex tints the photo.
      // For terrazzo, the photo itself carries the color; tint stays mostly invisible.
      const tintHex = (colorOpt && colorOpt.hex) || baseHex;
      let tintStrength = 0;
      if (isSolidSystem) {
        if (material === 'rubber') tintStrength = 0.78;
        else if (material === 'purcem') tintStrength = 0.72;
        else if (material === 'epoxy' || material === 'mma') tintStrength = 0.70;
        else if (material === 'epoxy-light') tintStrength = 0.55;
        else if (material === 'micro') tintStrength = 0.50;
        else if (material === 'concrete') tintStrength = 0.30;
        else tintStrength = 0.55;
      } else {
        tintStrength = 0; // terrazzo: photo carries color
      }
      plate.style.setProperty('--plate-tint-color', tintHex);
      plate.style.setProperty('--plate-tint-strength', String(tintStrength));

      // 4) Strips overlay (саргелим) — applied to body top face
      if (stripsOverlay) {
        const stripsOpt = selectedOption(material, 'strips');
        if (stripsOpt && stripsOpt.id !== 'off') {
          stripsOverlay.style.background = stripsBackground(stripsOpt.id);
          stripsOverlay.style.opacity = '1';
        } else {
          stripsOverlay.style.background = 'none';
          stripsOverlay.style.opacity = '0';
        }
      }

      // 5) Flecks overlay (epoxy)
      if (flecksOverlay) {
        const flOpt = selectedOption(material, 'flecks');
        flecksOverlay.className = 'fx-hero-lab__flecks';
        if (flOpt && flOpt.id !== 'off') {
          flecksOverlay.classList.add('is-on');
          flecksOverlay.classList.add('mode-' + flOpt.id);
        }
      }

      // 6) Roughness overlay (unified surface texture control)
      // Also tag the plate itself with a roughness class so global rules (e.g. desat
      // body on coarse anti-slip) can react.
      plate.classList.remove('is-rg-fine', 'is-rg-coarse');
      if (textureOverlay) {
        textureOverlay.className = 'fx-hero-lab__texture';
        const rgOpt = selectedOption(material, 'roughness');
        if (rgOpt && rgOpt.id !== 'smooth') {
          textureOverlay.classList.add('is-on');
          textureOverlay.classList.add('rg-' + rgOpt.id);
          plate.classList.add('is-rg-' + rgOpt.id);
        }
        // legacy support — texture/surface/broadcast IDs map to similar visual modes
        const txOpt = selectedOption(material, 'texture');
        if (txOpt && txOpt.id !== 'smooth') {
          textureOverlay.classList.add('is-on');
          textureOverlay.classList.add('mode-' + txOpt.id);
        }
      }

      // 6b) Marking overlay (road/safety markings)
      if (markingOverlay) {
        markingOverlay.className = 'fx-hero-lab__marking';
        const mkOpt = selectedOption(material, 'marking');
        if (mkOpt && mkOpt.id && mkOpt.id !== 'off') {
          markingOverlay.classList.add('is-on');
          markingOverlay.classList.add('is-' + mkOpt.id);
        }
      }

      // 7) Finish / gloss → CSS vars (controls sheen overlay).
      //    glossInfo = { gloss, shine, reflection, filter } — 5 distinct levels.
      let glossInfo = null;
      const finishOpt = selectedOption(material, 'finish');
      if (finishOpt) glossInfo = glossVarsFor(finishOpt.id);
      if (material === 'concrete') {
        const gritOpt = selectedOption(material, 'grit');
        if (gritOpt) glossInfo = gritGlossVars(gritOpt.id);
      }
      if (!glossInfo) glossInfo = { gloss: '.25', shine: '.22', reflection: '.18', filter: 'none' };
      plate.style.setProperty('--plate-gloss', glossInfo.gloss);
      plate.style.setProperty('--plate-gloss-shine', glossInfo.shine);
      plate.style.setProperty('--plate-gloss-reflection', glossInfo.reflection);
      plate.style.setProperty('--plate-body-filter', glossInfo.filter);
      // Tag plate so CSS can also dial finish-specific tweaks (e.g. wet-look needs deeper saturation)
      plate.removeAttribute('data-finish');
      if (finishOpt && finishOpt.id) plate.setAttribute('data-finish', finishOpt.id);

      // 8) Thickness → body layer height (visualization only; proportional)
      const thOpt = selectedOption(material, 'thickness');
      if (thOpt) {
        const thMap = {
          '1.5mm': '8px', '2mm': '10px', '2.5mm': '12px', '3mm': '14px',
          '4mm': '16px', '6mm': '20px', '9mm': '26px', '12mm': '32px',
          '15mm': '38px', '20mm': '46px', '25mm': '52px', '40mm': '64px',
          '55mm': '72px', '80mm': '88px'
        };
        plate.style.setProperty('--plate-body-h', thMap[thOpt.id] || '20px');
      } else {
        plate.style.removeProperty('--plate-body-h');
      }

      // 8b) Cove-base — visual indicator on plate edge via class
      plate.classList.remove('has-cove-R50','has-cove-R75','has-cove-R100','has-cove-R150');
      const coveOpt = selectedOption(material, 'coveBase');
      if (coveOpt && coveOpt.id !== 'off') plate.classList.add('has-cove-' + coveOpt.id);

      // 8c) Drain visual indicator
      plate.classList.remove('has-drain-linear','has-drain-radial');
      const drainOpt = selectedOption(material, 'drain');
      if (drainOpt && drainOpt.id === 'linear-slot') plate.classList.add('has-drain-linear');
      else if (drainOpt && drainOpt.id === 'radial-gully') plate.classList.add('has-drain-radial');

      // 8d) Certification (ESD/cleanroom) — copper-grid overlay class
      plate.classList.remove('cert-antistatic','cert-ESD-conductive','cert-cleanroom-ISO5');
      const certOpt = selectedOption(material, 'certification');
      if (certOpt && certOpt.id && certOpt.id !== 'standard') plate.classList.add('cert-' + certOpt.id);

      // 8e) v6 — per-material decorative filler classes (CSS overlays).
      // Each control toggles an exclusive `.is-<ctrl>-<id>` class on the plate so
      // CSS rules can paint accents / broadcast / exposure / trowel / pattern.
      const v6Controls = [
        { ctrl: 'accents',           prefix: 'is-accents-',  skip: 'off' },
        { ctrl: 'broadcast',         prefix: 'is-broadcast-',skip: 'off' },
        { ctrl: 'aggregateExposure', prefix: 'is-exposure-', skip: null  },
        { ctrl: 'trowelPattern',     prefix: 'is-trowel-',   skip: 'smooth-loft' },
        { ctrl: 'pattern',           prefix: 'is-pattern-',  skip: 'solid' },
        { ctrl: 'broadcastMedia',    prefix: 'is-bcm-',      skip: null  },
        { ctrl: 'cureMode',          prefix: 'is-cure-',     skip: null  }
      ];
      v6Controls.forEach(({ ctrl, prefix, skip }) => {
        // strip any prior class with this prefix
        Array.from(plate.classList).forEach(cn => {
          if (cn.indexOf(prefix) === 0) plate.classList.remove(cn);
        });
        const opt = selectedOption(material, ctrl);
        if (opt && opt.id && opt.id !== skip) {
          plate.classList.add(prefix + opt.id);
        }
      });

      // 9) Update meta-row + system link href
      const t1 = document.querySelector('[data-fx="pmType"]');
      const t2 = document.querySelector('[data-fx="pmThick"]');
      const t3 = document.querySelector('[data-fx="pmBase"]');
      if (t1) t1.textContent = `${localize(p.label)} · ${localize(p.sub)}`;
      if (t2) t2.textContent = thOpt ? thOpt.label : localize(p.thick);
      if (t3) t3.textContent = localize(p.base_);
      if (systemLink) {
        systemLink.setAttribute('href', systemHrefFor(material, st));
      }
      // 9b) Meta-row badges (cure-time, warranty, price-range, R-class)
      const sampleLink = document.querySelector('[data-fx="sampleLink"]');
      if (sampleLink) sampleLink.setAttribute('href', 'contact.html#intent=sample_kit&material=' + encodeURIComponent(material));
      const matCfg = (window.__floordsgnMaterials && window.__floordsgnMaterials.materials || []).find(m => m.id === material) || {};
      const rgOpt2 = selectedOption(material, 'roughness');
      const rgLabel = rgOpt2 ? rgOpt2.label.replace(/.* · /, '') : '';
      const setBadge = (sel, txt) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const wrap = el.closest('div');
        if (!txt) { if (wrap) wrap.style.display = 'none'; return; }
        if (wrap) wrap.style.display = '';
        el.textContent = txt;
      };
      setBadge('[data-fx="pmCure"]', matCfg.cureTime || '');
      setBadge('[data-fx="pmWarranty"]', matCfg.warranty || '');
      setBadge('[data-fx="pmPrice"]', matCfg.priceRange || '');
      setBadge('[data-fx="pmRClass"]', rgLabel || '');
      // Certification badge (if active)
      const certEl = document.querySelector('[data-fx="pmCert"]');
      if (certEl) {
        const certWrap = certEl.closest('div');
        if (certOpt && certOpt.id && certOpt.id !== 'standard') {
          if (certWrap) certWrap.style.display = '';
          certEl.textContent = certOpt.label;
        } else {
          if (certWrap) certWrap.style.display = 'none';
        }
      }

      // 10) Layer labels + bottom-sheet (preserved logic)
      if (p.buildup) {
        const setLayerLabel = (sel, def) => {
          const el = document.querySelector(sel);
          if (!el || !def) return;
          const tag = el.querySelector('.fx-layer-tag');
          if (!tag) return;
          tag.innerHTML = localize(def.name) + (def.sku ? `<b>${localize(def.sku)}</b>` : '');
        };
        setLayerLabel('.fx-l-topcoat',   p.buildup.topcoat);
        setLayerLabel('.fx-l-body',      p.buildup.body);
        setLayerLabel('.fx-l-primer',    p.buildup.primer);
        setLayerLabel('.fx-l-substrate', p.buildup.substrate);
        const meshLayer = document.querySelector('.fx-l-mesh');
        if (meshLayer) {
          meshLayer.style.display = p.mesh ? '' : 'none';
          if (p.mesh && p.buildup.mesh) {
            const tag = meshLayer.querySelector('.fx-layer-tag');
            if (tag) tag.innerHTML = localize(p.buildup.mesh.name) + (p.buildup.mesh.sku ? `<b>${localize(p.buildup.mesh.sku)}</b>` : '');
          }
        }
        const sheetList = document.querySelector('[data-fx="plateSheetList"]');
        if (sheetList) {
          const order = [
            { def: p.buildup.topcoat,   color: '#cfd0d2' },
            { def: p.buildup.body,      color: '#d4cfb8' },
            ...(p.mesh && p.buildup.mesh ? [{ def: p.buildup.mesh, color: '#aac8aa' }] : []),
            { def: p.buildup.primer,    color: '#d49b4a' },
            { def: p.buildup.substrate, color: '#9a9286' }
          ];
          sheetList.innerHTML = order.map(r => r.def
            ? `<li style="--row-color:${r.color}"><span><div class="row-label">${localize(r.def.name)}</div>${r.def.sku?`<div class="row-sku">${localize(r.def.sku)}</div>`:''}</span></li>`
            : '').join('');
        }

        // 11) Buildup spec sidecards (desktop rail next to the plate)
        const specRail = document.querySelector('[data-fx="specRail"]');
        if (specRail) {
          const role = (k) => ({
            topcoat: text('Топкоат', 'Topcoat'),
            body:    text('Тело системы', 'Body'),
            mesh:    text('Стеклосетка', 'Glass mesh'),
            primer:  text('Праймер', 'Primer'),
            substrate: text('Подложка', 'Substrate')
          }[k] || k);
          // Layer-color dot per row (matches plate cross-section visual)
          const colorFor = {
            topcoat:   '#dfe1e3',
            body:      bodyHex || '#d4cfb8',
            mesh:      '#aac8aa',
            primer:    '#d49b4a',
            substrate: '#8a857a'
          };
          const rows = [
            { key: 'topcoat',   def: p.buildup.topcoat },
            { key: 'body',      def: p.buildup.body },
            ...(p.mesh && p.buildup.mesh ? [{ key: 'mesh', def: p.buildup.mesh }] : []),
            { key: 'primer',    def: p.buildup.primer },
            { key: 'substrate', def: p.buildup.substrate }
          ];
          specRail.setAttribute('data-rows', String(rows.length));
          specRail.innerHTML = rows.map((r, i) => {
            if (!r.def) return '';
            const dot = colorFor[r.key];
            return `<li class="fx-hero-lab__spec-row fx-hero-lab__spec-row--${r.key}" style="--row-color:${dot};--row-i:${i};">`
              + `<span class="fx-hero-lab__spec-dot" aria-hidden="true"></span>`
              + `<span class="fx-hero-lab__spec-text">`
              + `<span class="fx-hero-lab__spec-role">${role(r.key)}</span>`
              + `<span class="fx-hero-lab__spec-sku">${localize(r.def.sku || r.def.name || '')}</span>`
              + `</span>`
              + `</li>`;
          }).join('');
        }
      }
    }

    function announceMaterial(material) {
      if (!liveAnnounce) return;
      const p = PALETTES[material];
      if (!p) return;
      liveAnnounce.textContent = text('Выбрано: ', 'Selected: ') + localize(p.label) + (p.sub ? ' · ' + localize(p.sub) : '');
    }

    function applySheenSweep() {
      plate.classList.remove('is-changing');
      // force reflow before re-adding so animation restarts
      void plate.offsetWidth;
      plate.classList.add('is-changing');
      setTimeout(() => plate.classList.remove('is-changing'), 950);
    }

    function applyPreset(preset) {
      if (!preset || !preset.materialId) return;
      const matId = preset.materialId;
      if (!CONTROL_SCHEMAS[matId]) return;
      ensureState(matId);
      const st = state[matId];
      const schema = CONTROL_SCHEMAS[matId] || [];
      // Reset to defaults first, then layer preset values where valid
      schema.forEach(g => { st[g.id] = (g.options[0] && g.options[0].id) || ''; });
      const cs = preset.controlState || {};
      Object.keys(cs).forEach(k => {
        const g = schema.find(grp => grp.id === k);
        if (g && g.options.find(o => o.id === cs[k])) st[k] = cs[k];
      });
      selectMaterial(matId, { persist: true });
      // Mark active preset chip
      document.querySelectorAll('[data-fx="presets"] .fx-hero-lab__preset').forEach(b => {
        b.classList.toggle('is-active', b.dataset.preset === preset.id);
      });
      // Scroll plate into view
      const plateWrap = document.querySelector('.fx-plate-wrap');
      if (plateWrap && plateWrap.scrollIntoView) {
        try { plateWrap.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      }
    }

    function renderPresets() {
      const root = document.querySelector('[data-fx="presets"]');
      if (!root) return;
      const presets = window.__floordsgnPresets || [];
      if (!presets.length) { root.style.display = 'none'; return; }
      root.innerHTML = presets.map(p =>
        `<button type="button" class="fx-hero-lab__preset" data-preset="${p.id}">${localize(p.label)}</button>`
      ).join('');
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('.fx-hero-lab__preset');
        if (!btn) return;
        const id = btn.dataset.preset;
        const p = presets.find(x => x.id === id);
        if (p) applyPreset(p);
      });
    }

    function renderGlossaryTooltips() {
      const gloss = window.__floordsgnGlossary || {};
      document.querySelectorAll('[data-gloss]').forEach(el => {
        const key = el.dataset.gloss;
        const entry = gloss[key];
        if (!entry) return;
        if (el.dataset.glossInit === '1') return;
        el.dataset.glossInit = '1';
        el.classList.add('fx-gloss');
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', entry.term + ': ' + entry.def);
        const tip = document.createElement('span');
        tip.className = 'fx-gloss__tip';
        tip.setAttribute('role', 'tooltip');
        tip.textContent = entry.def;
        el.appendChild(tip);
      });
    }

    function selectMaterial(material, opts) {
      opts = opts || {};
      if (!CONTROL_SCHEMAS[material]) return;
      const isMaterialChange = curMat !== material;
      curMat = material;
      ensureState(material);
      // mark active in left material list (radiogroup pattern)
      document.querySelectorAll('.fx-hero-lab__mat').forEach(b => {
        const on = b.dataset.m === material;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      renderControls(material);
      applyAllForMaterial(material);
      announceMaterial(material);
      if (isMaterialChange) applySheenSweep();
      // Clear active preset chip on direct material change (unless triggered by preset)
      if (!opts.fromPreset) {
        document.querySelectorAll('[data-fx="presets"] .fx-hero-lab__preset').forEach(b => b.classList.remove('is-active'));
      }
      if (opts.persist !== false) persistState();
      if (opts.focus) {
        const btn = document.querySelector('.fx-hero-lab__mat.is-active');
        if (btn) btn.focus();
      }
    }

    // Plate rotation state — declared early so scroll-tilt closure can reference it
    let rx = 56, ry = -18, drag = null, dragMoved = 0, exploded = false;
    const applyRot = () => {
      plate.style.setProperty('--rx', rx + 'deg');
      plate.style.setProperty('--ry', ry + 'deg');
    };

    let idleTimer = null;
    const scheduleIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!drag && !exploded) plate.classList.add('idle');
      }, 2400);
    };

    // Restore from localStorage if present, before initial render
    const restored = restoreState();
    if (restored) curMat = restored;

    // Initial render
    renderPresets();
    renderGlossaryTooltips();
    selectMaterial(curMat, { persist: false });

    // ---------- LEFT: material list keyboard + click ----------
    const allMatBtns = () => Array.from(document.querySelectorAll('.fx-hero-lab__mat'));
    document.querySelectorAll('.fx-hero-lab__mat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const m = btn.dataset.m;
        if (m) selectMaterial(m);
      });
      btn.addEventListener('keydown', (e) => {
        const list = allMatBtns();
        const idx = list.indexOf(btn);
        if (idx < 0) return;
        let next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (idx + 1) % list.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (idx - 1 + list.length) % list.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = list.length - 1;
        if (next >= 0) {
          e.preventDefault();
          const m = list[next].dataset.m;
          if (m) selectMaterial(m, { focus: true });
        }
      });
    });

    // ---------- RIGHT: controls click + keyboard ----------
    if (controlsRoot) {
      controlsRoot.addEventListener('click', (e) => {
        const btn = e.target.closest('.fx-hero-lab__btn');
        if (!btn) return;
        const ctrl = btn.dataset.control;
        const val  = btn.dataset.value;
        if (!ctrl || !val) return;
        const st = ensureState(curMat);
        st[ctrl] = val;
        // mark active within group
        const groupEl = btn.closest('.fx-hero-lab__group');
        if (groupEl) {
          groupEl.querySelectorAll('.fx-hero-lab__btn').forEach(b => {
            const on = b.dataset.value === val;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            b.setAttribute('aria-checked', on ? 'true' : 'false');
          });
        }
        applyAllForMaterial(curMat);
        persistState();
      });
      // arrow-key navigation within control buttons inside a single group — focus only
      // (Enter/Space activates via native button behavior)
      controlsRoot.addEventListener('keydown', (e) => {
        const btn = e.target.closest('.fx-hero-lab__btn');
        if (!btn) return;
        const groupEl = btn.closest('.fx-hero-lab__btnrow');
        if (!groupEl) return;
        const list = Array.from(groupEl.querySelectorAll('.fx-hero-lab__btn'));
        const idx = list.indexOf(btn);
        let next = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % list.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + list.length) % list.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = list.length - 1;
        if (next >= 0) {
          e.preventDefault();
          list[next].focus();
          // No click — Enter/Space triggers activation per ARIA radio guidelines
        }
      });
      // Custom color input — both color picker + text hex
      const handleCustomColor = (hex) => {
        if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
        const st = ensureState(curMat);
        st.color = 'custom';
        st.customHex = hex;
        // Update active state for color buttons
        controlsRoot.querySelectorAll('.fx-hero-lab__btn[data-control="color"]').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed','false');
        });
        const wrap = controlsRoot.querySelector('[data-fx="customColorWrap"]');
        if (wrap) wrap.classList.add('is-active');
        applyAllForMaterial(curMat);
        persistState();
      };
      controlsRoot.addEventListener('input', (e) => {
        if (e.target && e.target.matches('[data-fx="customColorPicker"]')) {
          handleCustomColor(e.target.value);
          const txt = controlsRoot.querySelector('[data-fx="customColorText"]');
          if (txt) txt.value = e.target.value;
        } else if (e.target && e.target.matches('[data-fx="customColorText"]')) {
          let v = e.target.value.trim();
          if (v && v[0] !== '#') v = '#' + v;
          if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            handleCustomColor(v);
            const pk = controlsRoot.querySelector('[data-fx="customColorPicker"]');
            if (pk) pk.value = v;
          }
        }
      });
    }

    // ---------- Onboarding: pulse first 3 controls once ----------
    function maybeOnboard() {
      try {
        if (localStorage.getItem(LS_ONBOARDED) === '1') return;
      } catch (e) { return; }
      if (!controlsRoot) return;
      const buttons = Array.from(controlsRoot.querySelectorAll('.fx-hero-lab__btn'));
      const targets = buttons.slice(0, 3);
      targets.forEach((b, i) => {
        setTimeout(() => {
          b.classList.add('is-pulse');
          setTimeout(() => b.classList.remove('is-pulse'), 800);
        }, i * 800);
      });
      try { localStorage.setItem(LS_ONBOARDED, '1'); } catch (e) {}
    }

    // ---------- Scroll choreography (IntersectionObserver + tilt) ----------
    if (introBlock) {
      try {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              introBlock.classList.add('is-revealed');
              io.disconnect();
            }
          });
        }, { threshold: 0.2 });
        io.observe(introBlock);
      } catch (e) {
        introBlock.classList.add('is-revealed');
      }
    }

    if (heroSection) {
      let scrollTilt = 0;
      let scrollRaf = null;
      let lastScrollAt = 0;
      const updateScrollTilt = () => {
        scrollRaf = null;
        if (exploded || drag) {
          plate.style.setProperty('--plate-scroll-tilt', '0deg');
          return;
        }
        const rect = heroSection.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        // Map top/vh ratio (1 → -8deg entering top, -1 → +8deg leaving bottom)
        let ratio = rect.top / vh;
        ratio = Math.max(-1, Math.min(1, ratio));
        scrollTilt = -ratio * 8;
        plate.style.setProperty('--plate-scroll-tilt', scrollTilt.toFixed(2) + 'deg');
        lastScrollAt = Date.now();
      };
      window.addEventListener('scroll', () => {
        if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollTilt);
      }, { passive: true });
      updateScrollTilt();

      // Pause idle rotation when actively scrolling
      const pauseIdleOnScroll = () => {
        if (Date.now() - lastScrollAt < 400) plate.classList.remove('idle');
      };
      setInterval(pauseIdleOnScroll, 250);
    }

    // Trigger onboarding when intro is revealed (or fallback timeout)
    setTimeout(maybeOnboard, 1500);

    function toggleExplode() {
      exploded = !exploded;
      plate.classList.toggle('is-exploded', exploded);
      plate.setAttribute('aria-pressed', exploded ? 'true' : 'false');
      plate.classList.remove('idle');
      const hint = document.querySelector('[data-fx="plateHint"]');
      if (hint) hint.textContent = exploded
        ? text('нажмите ещё раз чтобы собрать обратно', 'tap again to assemble back')
        : text('тяните чтобы вращать · нажмите чтобы разнести на слои', 'drag to rotate · tap to explode layers');
      const sheet = document.querySelector('[data-fx="plateSheet"]');
      if (sheet) {
        if (exploded) sheet.setAttribute('data-open', '');
        else sheet.removeAttribute('data-open');
      }
      // Spec rail tracks the explosion state (rows fan out vertically)
      const specRail = document.querySelector('[data-fx="specRail"]');
      if (specRail) specRail.classList.toggle('is-exploded', exploded);
      if (exploded) {
        plate.style.removeProperty('--rx');
        plate.style.removeProperty('--ry');
        rx = 24; ry = -16;
        if (window.navigator && window.navigator.vibrate) {
          try { window.navigator.vibrate(12); } catch (e) {}
        }
      } else {
        applyRot();
        scheduleIdle();
      }
    }

    plate.addEventListener('mousedown', (e) => {
      if (exploded) return;
      e.preventDefault();
      if (idleTimer) clearTimeout(idleTimer);
      plate.classList.remove('idle');
      plate.classList.add('is-dragging');
      dragMoved = 0;
      drag = { x: e.clientX, y: e.clientY, rx, ry };
    });
    window.addEventListener('mousemove', (e) => {
      if (!drag) return;
      dragMoved += Math.abs(e.movementX) + Math.abs(e.movementY);
      rx = Math.max(20, Math.min(85, drag.rx + (drag.y - e.clientY) * .4));
      ry = drag.ry + (e.clientX - drag.x) * .6;
      applyRot();
    });
    window.addEventListener('mouseup', () => {
      if (!drag) return;
      drag = null;
      plate.classList.remove('is-dragging');
      scheduleIdle();
    });

    // Click to toggle explode (только если это был tap, не drag)
    plate.addEventListener('click', (e) => {
      if (dragMoved > 6) return;        // drag, не click
      toggleExplode();
    });
    plate.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExplode();
      } else if (e.key === 'Escape' && exploded) {
        e.preventDefault();
        toggleExplode();
        plate.focus();
      }
    });

    plate.addEventListener('touchstart', (e) => {
      if (exploded) return;
      if (idleTimer) clearTimeout(idleTimer);
      const t = e.touches[0];
      plate.classList.remove('idle');
      dragMoved = 0;
      drag = { x: t.clientX, y: t.clientY, rx, ry };
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!drag) return;
      const t = e.touches[0];
      const dx = t.clientX - drag.x, dy = t.clientY - drag.y;
      dragMoved = Math.abs(dx) + Math.abs(dy);
      if (dragMoved > 6 && e.cancelable) e.preventDefault();
      rx = Math.max(20, Math.min(85, drag.rx + (-dy) * .4));
      ry = drag.ry + dx * .6;
      applyRot();
    }, { passive: false });
    window.addEventListener('touchend', () => {
      if (!drag) return;
      drag = null;
      scheduleIdle();
    });

    // ---------- v9: hover parallax (Apple-product feel) ----------
    // Plate "looks at" the cursor with ±0.4deg max tilt. Skipped during
    // drag/explode/touch. Cleared on mouseleave.
    let hoverRaf = null;
    plate.addEventListener('mousemove', (e) => {
      if (drag || exploded) return;
      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = null;
        const r = plate.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        // normalized -1..+1 → multiplier 0.4deg
        const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width  / 2)));
        const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
        plate.style.setProperty('--hover-ry', (nx *  0.4).toFixed(2) + 'deg');
        plate.style.setProperty('--hover-rx', (ny * -0.4).toFixed(2) + 'deg');
        plate.classList.add('is-hovering');
      });
    });
    plate.addEventListener('mouseleave', () => {
      plate.classList.remove('is-hovering');
      plate.style.setProperty('--hover-rx', '0deg');
      plate.style.setProperty('--hover-ry', '0deg');
      scheduleIdle();
    });

    // ---------- v9: cinematic collapse-scale on un-explode ----------
    // Patch toggleExplode to add a brief 'is-exploding-collapse' class on
    // the way down (gives 0.97 → 1.00 settle via CSS --explode-scale).
    const _origToggle = toggleExplode;
    // Replace via wrapper — can't reassign const, so monkey-patch via class hook.
    // We listen for the click that fires toggleExplode and add the collapse
    // class one tick later if the resulting state is NOT exploded.
    plate.addEventListener('click', () => {
      // exploded already toggled inside toggleExplode (via earlier listener).
      // Defer one frame so we read the new state.
      requestAnimationFrame(() => {
        if (!exploded) {
          plate.classList.add('is-exploding-collapse');
          setTimeout(() => plate.classList.remove('is-exploding-collapse'), 280);
        }
      });
    });
    }); // end loadConfig(boot)
  };


  /* ---------------- FAQ accordion ------------------------- */
  fx.initFaq = function () {
    document.querySelectorAll('.fx-faq-item').forEach((item) => {
      const q = item.querySelector('.fx-faq-item__q');
      if (!q) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(isOpen));
      });
    });
  };

  /* ---------------- sticky vertical TOC active link ------- */
  fx.initToc = function () {
    const links = document.querySelectorAll('.fx-toc a[href^="#"]');
    if (!links.length) return;
    const targets = Array.from(links)
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    if (!targets.length) return;
    const setActive = () => {
      let current = targets[0];
      const probe = window.scrollY + window.innerHeight * 0.25;
      for (const t of targets) {
        if (t.offsetTop <= probe) current = t;
      }
      links.forEach(a => {
        const isActive = a.getAttribute('href') === '#' + current.id;
        a.classList.toggle('active', isActive);
      });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  };

  /* ---------------- sample request modal ------------------ */
  fx.initSampleModal = function () {
    const overlay = document.querySelector('[data-fx="sampleOverlay"]');
    if (!overlay) return;
    const open = () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      const focus = overlay.querySelector('input, select, textarea');
      if (focus) focus.focus();
    };
    const close = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-fx="sampleOpen"]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    overlay.querySelectorAll('[data-fx="sampleClose"]').forEach(b => b.addEventListener('click', close));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

    const form = overlay.querySelector('form');
    if (form) {
      let status = overlay.querySelector('[data-fx="sampleStatus"]');
      if (!status) {
        status = document.createElement('p');
        status.setAttribute('data-fx', 'sampleStatus');
        status.className = 'fx-sample-modal__note';
        form.appendChild(status);
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submit = form.querySelector('button[type="submit"]');
        if (submit) submit.disabled = true;
        status.textContent = text('Отправляем...', 'Sending...');

        const data = Object.fromEntries(new FormData(form).entries());
        data.page = window.location.pathname;
        data.source = data.source || 'sample-modal';

        try {
          const response = await fetch(form.getAttribute('action') || '/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error('Sample request failed');

          status.textContent = text(
            'Готово. Мы свяжемся и отправим образец / тех. описание.',
            'Done. We will contact you and send the sample / technical notes.'
          );
          form.reset();
          setTimeout(close, 1200);
        } catch (error) {
          status.innerHTML = text(
            'Не удалось подтвердить отправку. Напишите в WhatsApp: <a href="https://wa.me/972559661459" target="_blank" rel="noopener">+972 55 966 1459</a>.',
            'We could not confirm delivery. Please message us on WhatsApp: <a href="https://wa.me/972559661459" target="_blank" rel="noopener">+972 55 966 1459</a>.'
          );
        } finally {
          if (submit) submit.disabled = false;
        }
      });
    }
  };

  /* ---------------- WhatsApp pre-fill --------------------- */
  fx.initWhatsApp = function () {
    const btn = document.querySelector('[data-fx="waLink"]');
    if (!btn) return;
    const number = btn.dataset.waNumber || '+972559661459';
    const sysName = document.body.dataset.fxPage || document.title;
    const message = isEnglishPage()
      ? `Hello! I'm writing from "${sysName}". I'd like to discuss a project.`
      : `Здравствуйте! Пишу со страницы «${sysName}». Хочу обсудить проект.`;
    const url = `https://wa.me/${number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    btn.setAttribute('href', url);
  };

  /* ---------------- decision tool wizard ------------------ */
  fx.initDecisionTool = function () {
    const root = document.querySelector('[data-fx="decisionTool"]');
    if (!root) return;
    const steps = root.querySelectorAll('[data-step]');
    const total = steps.length;
    const answers = {};
    let i = 0;

    const show = () => {
      steps.forEach((s, idx) => s.style.display = idx === i ? 'block' : 'none');
      const progress = root.querySelector('[data-fx="dtProgress"]');
      if (progress) progress.textContent = isEnglishPage()
        ? `Question ${Math.min(i + 1, total)} of ${total}`
        : `Вопрос ${Math.min(i + 1, total)} из ${total}`;
    };
    show();

    root.querySelectorAll('[data-answer]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        const step = b.closest('[data-step]');
        const key = step.dataset.step;
        answers[key] = b.dataset.answer;
        i += 1;
        if (i >= total - 1) {
          // Show result step (last) — caller renders recommendations from `answers`
          const resultStep = root.querySelector('[data-step="result"]');
          if (resultStep) {
            // basic recommendation logic — operator can refine later
            const place   = answers.place || '';
            const traffic = answers.traffic || '';
            let rec = ['самовыравнивающийся эпокси'];
            if (place === 'industrial' && traffic === 'forklift') rec = ['эпокси HBS 6–9 мм', 'PU-cement'];
            else if (place === 'food')                            rec = ['PU-cement', 'эпокси HBS'];
            else if (place === 'designer')                        rec = ['венецианское терраццо', 'микротопинг'];
            else if (place === 'residential')                     rec = ['микротопинг', 'эпокси декоративный'];
            const out = resultStep.querySelector('[data-fx="dtRec"]');
            if (out) out.innerHTML = rec.map(r => `<li>${localize(r)}</li>`).join('');
          }
        }
        show();
      });
    });
  };

  /* ---------------- fx.initStack — слоёный сэндвич hero -- */
  fx.initStack = function () {
    const root = document.querySelector('.fx-stack');
    if (!root) return;

    const PRESETS = {
      epoxy: {
        name: 'Sikafloor SL — Self-Leveling',
        total: '3.8 мм',
        cure: '3 дня',
        labels: [
          { sel: '[data-fx-label="topcoat"]', t: 'Топкоат',     s: 'Sikafloor‑264 · 0.5 мм' },
          { sel: '[data-fx-label="body"]',    t: 'Тело системы', s: 'Sikafloor‑263 SL · 3 мм' },
          { sel: '[data-fx-label="primer"]',  t: 'Праймер',     s: 'Sikafloor‑156 · 0.3 мм' }
        ]
      },
      terrazzo: {
        name: 'Sikafloor Terrazzo EM-10',
        total: '12 мм',
        cure: '7 дней',
        labels: [
          { sel: '[data-fx-label="topcoat"]', t: 'Шлифовка + sealer', s: 'Sikagard‑701 W · 30 µm' },
          { sel: '[data-fx-label="body"]',    t: 'Терраццо матрица',  s: 'EM-10 + чипсы · 10 мм' },
          { sel: '[data-fx-label="primer"]',  t: 'Праймер',           s: 'Sikafloor‑156 · 0.3 мм' }
        ]
      },
      micro: {
        name: 'Sika MonoTop MicroTopping',
        total: '3 мм',
        cure: '5 дней',
        labels: [
          { sel: '[data-fx-label="topcoat"]', t: 'Sealer PU/AC', s: 'Sikagard‑690 · 60 µm' },
          { sel: '[data-fx-label="body"]',    t: 'Микро 2 слоя',  s: 'MonoTop‑412 N · 2 × 1 мм' },
          { sel: '[data-fx-label="primer"]',  t: 'Bond bridge',    s: 'Sika MonoTop‑910 · 0.5 мм' }
        ]
      },
      purcem: {
        name: 'Sikafloor PurCem 21N',
        total: '6 мм',
        cure: '24 ч',
        labels: [
          { sel: '[data-fx-label="topcoat"]', t: 'Финиш HACCP',  s: 'Sikafloor‑264 N · 0.3 мм' },
          { sel: '[data-fx-label="body"]',    t: 'PurCem body',   s: 'Sikafloor‑21N PurCem · 6 мм' },
          { sel: '[data-fx-label="primer"]',  t: 'Скрэтч-кот',    s: 'PurCem mortar · 1 мм' }
        ]
      },
      mma: {
        name: 'Sikafloor MMA Pronto',
        total: '3 мм',
        cure: '2 ч',
        labels: [
          { sel: '[data-fx-label="topcoat"]', t: 'Топкоат',     s: 'Pronto Topcoat-21 · 0.5 мм' },
          { sel: '[data-fx-label="body"]',    t: 'MMA body',     s: 'Pronto‑18 MMA · 2 мм' },
          { sel: '[data-fx-label="primer"]',  t: 'Праймер MMA',  s: 'Pronto‑112 · 0.3 мм' }
        ]
      }
    };

    const $name  = root.querySelector('[data-fx="stackName"]');
    const $total = root.querySelector('[data-fx="stackTotal"]');
    const $cure  = root.querySelector('[data-fx="stackCure"]');
    const buttons = Array.from(root.querySelectorAll('.fx-stack__seg button'));

    function apply(key) {
      const p = PRESETS[key]; if (!p) return;
      if ($name)  $name.textContent  = p.name;
      if ($total) $total.textContent = localize(p.total);
      if ($cure)  $cure.textContent  = localize(p.cure);
      p.labels.forEach(row => {
        const label = root.querySelector(row.sel);
        if (!label) return;
        const name = label.querySelector('.fx-stack__label-name');
        const sku = label.querySelector('.fx-stack__label-sku');
        if (name) name.textContent = localize(row.t);
        if (sku) sku.textContent = localize(row.s);
      });
      buttons.forEach(b => {
        const on = b.dataset.stack === key;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    buttons.forEach(b => b.addEventListener('click', () => apply(b.dataset.stack)));

    // entrance reveal
    requestAnimationFrame(() => root.setAttribute('data-loaded', '1'));
  };

  /* ---------------- sticky mobile CTA + scroll progress --- */
  fx.initStickyCta = function () {
    const bar = document.querySelector('[data-fx="stickyCta"]');
    // scroll progress bar — создаём если ещё нет
    let progress = document.querySelector('.fx-scroll-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.className = 'fx-scroll-progress';
      document.body.appendChild(progress);
    }
    // adaptive CTA: меняем primary-кнопку под видимую секцию
    const primaryBtn = bar ? bar.querySelector('.fx-sticky-cta__btn--solid') : null;
    const sections = [
      { sel: '.fx-picker', text: text('Сравнить', 'Compare') },
      { sel: '.quality-section, .gallery-section', text: text('Расчёт', 'Estimate') },
      { sel: '.cta-section, .testimonials-section', text: text('Звонок', 'Call') },
    ];
    let lastText = primaryBtn ? primaryBtn.textContent : '';

    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop || 0;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      const ratio = scrolled / max;
      progress.style.width = (ratio * 100).toFixed(2) + '%';
      if (bar) {
        const show = ratio > 0.18 && ratio < 0.94;
        bar.classList.toggle('is-visible', show);
      }
      // adaptive CTA — определяем какая секция в viewport
      if (primaryBtn) {
        const mid = window.innerHeight * 0.5;
        let next = text('Расчёт', 'Estimate');
        for (const s of sections) {
          const el = document.querySelector(s.sel);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top < mid && r.bottom > 0) next = s.text;
        }
        if (next !== lastText) { primaryBtn.textContent = next; lastText = next; }
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  /* ---------------- lazy + decoding async для всех картинок */
  fx.initLazyImages = function () {
    document.querySelectorAll('img').forEach((img, i) => {
      if (!img.hasAttribute('loading')) img.loading = i < 2 ? 'eager' : 'lazy';
      if (!img.hasAttribute('decoding')) img.decoding = 'async';
    });
  };

  /* ---------------- bootstrap ----------------------------- */
  function init() {
    try { fx.initStack       && fx.initStack();       } catch (e) { console.warn('fx.initStack', e); }
    try { fx.init3DPlate     && fx.init3DPlate();     } catch (e) { console.warn('fx.init3DPlate', e); }
    try { fx.initCalc        && fx.initCalc();        } catch (e) { console.warn('fx.initCalc', e); }
    try { fx.initFaq         && fx.initFaq();         } catch (e) { console.warn('fx.initFaq', e); }
    try { fx.initToc         && fx.initToc();         } catch (e) { console.warn('fx.initToc', e); }
    try { fx.initSampleModal && fx.initSampleModal(); } catch (e) { console.warn('fx.initSampleModal', e); }
    try { fx.initWhatsApp    && fx.initWhatsApp();    } catch (e) { console.warn('fx.initWhatsApp', e); }
    try { fx.initDecisionTool && fx.initDecisionTool(); } catch (e) { console.warn('fx.initDecisionTool', e); }
    try { fx.initStickyCta   && fx.initStickyCta();   } catch (e) { console.warn('fx.initStickyCta', e); }
    try { fx.initLazyImages  && fx.initLazyImages();  } catch (e) { console.warn('fx.initLazyImages', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
