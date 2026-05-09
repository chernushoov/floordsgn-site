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
  const CONTROL_SCHEMAS = {
    'terrazzo-dark': [
      { id: 'color', label: 'Цвет основы', mode: 'single', options: [
        { id: 'charcoal',   label: 'Charcoal',   hex: '#1c1c1e', swatch: '#1c1c1e' },
        { id: 'anthracite', label: 'Anthracite', hex: '#2c2c2e', swatch: '#2c2c2e' },
        { id: 'graphite',   label: 'Graphite',   hex: '#3a3a3c', swatch: '#3a3a3c' },
        { id: 'stone',      label: 'Stone',      hex: '#5a5a5c', swatch: '#5a5a5c' }
      ]},
      { id: 'aggregate', label: 'Агрегат', mode: 'single', options: [
        { id: 'basalt',  label: 'Basalt' },
        { id: 'carrara', label: 'Carrara' },
        { id: 'verona',  label: 'Verona' },
        { id: 'mirror',  label: 'Glass-mirror' },
        { id: 'brass',   label: 'Brass-flake' }
      ]},
      { id: 'strips', label: 'Саргелим', mode: 'single', options: [
        { id: 'off',      label: 'Без полос' },
        { id: 'brass4',   label: 'Латунь 4мм',  hex: '#c9a04a' },
        { id: 'alu4',     label: 'Алюминий 4мм', hex: '#d8d4cc' },
        { id: 'black6',   label: 'Чёрный 6мм',  hex: '#0a0a0a' }
      ]},
      { id: 'finish', label: 'Финиш', mode: 'single', options: [
        { id: 'matte',    label: 'Matte' },
        { id: 'satin',    label: 'Satin' },
        { id: 'polished', label: 'Polished' }
      ]}
    ],
    'terrazzo-light': [
      { id: 'color', label: 'Цвет основы', mode: 'single', options: [
        { id: 'white',   label: 'White',     hex: '#f0ece2', swatch: '#f0ece2' },
        { id: 'offwhite',label: 'Off-white', hex: '#e8e3d4', swatch: '#e8e3d4' },
        { id: 'sand',    label: 'Sand',      hex: '#dfd4ba', swatch: '#dfd4ba' },
        { id: 'pearl',   label: 'Pearl',     hex: '#ebe6db', swatch: '#ebe6db' }
      ]},
      { id: 'aggregate', label: 'Агрегат', mode: 'single', options: [
        { id: 'carrara', label: 'Carrara' },
        { id: 'verona',  label: 'Verona' },
        { id: 'basalt',  label: 'Basalt' },
        { id: 'mirror',  label: 'Glass-mirror' },
        { id: 'brass',   label: 'Brass-flake' }
      ]},
      { id: 'strips', label: 'Саргелим', mode: 'single', options: [
        { id: 'off',    label: 'Без полос' },
        { id: 'brass4', label: 'Латунь 4мм', hex: '#c9a04a' },
        { id: 'alu4',   label: 'Алюминий 4мм', hex: '#d8d4cc' },
        { id: 'black6', label: 'Чёрный 6мм',  hex: '#1d1d1f' }
      ]},
      { id: 'finish', label: 'Финиш', mode: 'single', options: [
        { id: 'matte',    label: 'Matte' },
        { id: 'satin',    label: 'Satin' },
        { id: 'polished', label: 'Polished' }
      ]}
    ],
    terrazzo: [
      { id: 'color', label: 'Цвет цемента', mode: 'single', options: [
        { id: 'white',   label: 'White',   hex: '#efe7d6', swatch: '#efe7d6' },
        { id: 'cream',   label: 'Cream',   hex: '#e8dec8', swatch: '#e8dec8' },
        { id: 'sand',    label: 'Sand',    hex: '#dfd4ba', swatch: '#dfd4ba' },
        { id: 'grey',    label: 'Grey',    hex: '#bdb6a8', swatch: '#bdb6a8' }
      ]},
      { id: 'aggregate', label: 'Агрегат', mode: 'single', options: [
        { id: 'carrara', label: 'Carrara' },
        { id: 'verona',  label: 'Verona' },
        { id: 'basalt',  label: 'Basalt' },
        { id: 'mirror',  label: 'Glass-mirror' },
        { id: 'brass',   label: 'Brass-flake' }
      ]},
      { id: 'strips', label: 'Саргелим', mode: 'single', options: [
        { id: 'off',    label: 'Без полос' },
        { id: 'brass4', label: 'Латунь 4мм', hex: '#c9a04a' },
        { id: 'alu4',   label: 'Алюминий 4мм', hex: '#d8d4cc' },
        { id: 'black6', label: 'Чёрный 6мм',  hex: '#1d1d1f' }
      ]},
      { id: 'finish', label: 'Финиш', mode: 'single', options: [
        { id: 'matte',    label: 'Matte' },
        { id: 'satin',    label: 'Satin' },
        { id: 'polished', label: 'Polished' }
      ]}
    ],
    epoxy: [
      { id: 'color', label: 'Цвет (RAL)', mode: 'single', options: [
        { id: '9005', label: 'RAL 9005', hex: '#0a0a0a', swatch: '#0a0a0a' },
        { id: '7016', label: 'RAL 7016', hex: '#293133', swatch: '#293133' },
        { id: '7044', label: 'RAL 7044', hex: '#b3aea1', swatch: '#b3aea1' },
        { id: '1001', label: 'RAL 1001', hex: '#c2b078', swatch: '#c2b078' },
        { id: '5024', label: 'RAL 5024', hex: '#5d9b9b', swatch: '#5d9b9b' },
        { id: '6011', label: 'RAL 6011', hex: '#587246', swatch: '#587246' }
      ]},
      { id: 'flecks', label: 'Флеки', mode: 'single', options: [
        { id: 'off',      label: 'Без флеков' },
        { id: 'fine',     label: 'Vinyl chips' },
        { id: 'coarse',   label: 'Coarse 1/8″' },
        { id: 'mica',     label: 'Mica' },
        { id: 'metallic', label: 'Metallic FX' }
      ]},
      { id: 'finish', label: 'Топкоат', mode: 'single', options: [
        { id: 'matte',   label: 'Matte' },
        { id: 'satin',   label: 'Satin' },
        { id: 'glossy',  label: 'Glossy' }
      ]},
      { id: 'broadcast', label: 'Кварц-broadcast', mode: 'single', options: [
        { id: 'off',    label: 'Без кварца' },
        { id: 'fine',   label: 'Fine' },
        { id: 'coarse', label: 'Coarse anti-slip' }
      ]}
    ],
    'epoxy-light': [
      { id: 'color', label: 'Цвет (RAL)', mode: 'single', options: [
        { id: '7044', label: 'RAL 7044', hex: '#b3aea1', swatch: '#b3aea1' },
        { id: '9001', label: 'RAL 9001', hex: '#e9e0d2', swatch: '#e9e0d2' },
        { id: '9010', label: 'RAL 9010', hex: '#f1ece1', swatch: '#f1ece1' },
        { id: '1015', label: 'RAL 1015', hex: '#e6d2b5', swatch: '#e6d2b5' },
        { id: '7035', label: 'RAL 7035', hex: '#cbd0cc', swatch: '#cbd0cc' },
        { id: '5024', label: 'RAL 5024', hex: '#5d9b9b', swatch: '#5d9b9b' }
      ]},
      { id: 'flecks', label: 'Флеки', mode: 'single', options: [
        { id: 'off',      label: 'Без флеков' },
        { id: 'fine',     label: 'Vinyl chips' },
        { id: 'coarse',   label: 'Coarse 1/8″' },
        { id: 'mica',     label: 'Mica' },
        { id: 'metallic', label: 'Metallic FX' }
      ]},
      { id: 'finish', label: 'Топкоат', mode: 'single', options: [
        { id: 'matte',   label: 'Matte' },
        { id: 'satin',   label: 'Satin' },
        { id: 'glossy',  label: 'Glossy' }
      ]},
      { id: 'broadcast', label: 'Кварц-broadcast', mode: 'single', options: [
        { id: 'off',    label: 'Без кварца' },
        { id: 'fine',   label: 'Fine' },
        { id: 'coarse', label: 'Coarse anti-slip' }
      ]}
    ],
    micro: [
      { id: 'color', label: 'Цвет', mode: 'single', options: [
        { id: 'cream',   label: 'Cream',     hex: '#cfc4b3', swatch: '#cfc4b3' },
        { id: 'sand',    label: 'Sand',      hex: '#c4b698', swatch: '#c4b698' },
        { id: 'olive',   label: 'Olive',     hex: '#9a9272', swatch: '#9a9272' },
        { id: 'cement',  label: 'Cement-grey',hex: '#9d9b96', swatch: '#9d9b96' },
        { id: 'charcoal',label: 'Charcoal',  hex: '#3a3a3c', swatch: '#3a3a3c' }
      ]},
      { id: 'finish', label: 'Финиш', mode: 'single', options: [
        { id: 'matte',    label: 'Matte' },
        { id: 'satin',    label: 'Satin' },
        { id: 'wetlook',  label: 'Wet-look' }
      ]},
      { id: 'texture', label: 'Текстура', mode: 'single', options: [
        { id: 'smooth',  label: 'Smooth' },
        { id: 'trowel',  label: 'Trowel-marked' },
        { id: 'wave',    label: 'Wave' }
      ]},
      { id: 'broadcast', label: 'Топкоат', mode: 'single', options: [
        { id: 'pu2x',  label: 'PU 2 × слоя' },
        { id: 'wax',   label: 'Wax-cement' }
      ]}
    ],
    purcem: [
      { id: 'color', label: 'Цвет (RAL)', mode: 'single', options: [
        { id: '7037', label: 'RAL 7037', hex: '#7d7f7d', swatch: '#7d7f7d' },
        { id: '1015', label: 'RAL 1015', hex: '#e6d2b5', swatch: '#e6d2b5' },
        { id: '8004', label: 'RAL 8004', hex: '#a04125', swatch: '#a04125' },
        { id: '6011', label: 'RAL 6011', hex: '#587246', swatch: '#587246' },
        { id: '7035', label: 'RAL 7035', hex: '#cbd0cc', swatch: '#cbd0cc' }
      ]},
      { id: 'surface', label: 'Поверхность', mode: 'single', options: [
        { id: 'smooth',    label: 'Smooth' },
        { id: 'textured',  label: 'Textured (anti-slip)' },
        { id: 'broadcast', label: 'Heavy broadcast' }
      ]},
      { id: 'thickness', label: 'Толщина', mode: 'single', options: [
        { id: '4mm', label: '4 мм' },
        { id: '6mm', label: '6 мм' },
        { id: '9mm', label: '9 мм' }
      ]},
      { id: 'cove', label: 'Cove-base', mode: 'single', options: [
        { id: 'off',  label: 'Без галтели' },
        { id: '100',  label: '100 мм' }
      ]}
    ],
    mma: [
      { id: 'color', label: 'Цвет (RAL)', mode: 'single', options: [
        { id: '9005', label: 'RAL 9005', hex: '#0a0a0a', swatch: '#0a0a0a' },
        { id: '7044', label: 'RAL 7044', hex: '#b3aea1', swatch: '#b3aea1' },
        { id: '1001', label: 'RAL 1001', hex: '#c2b078', swatch: '#c2b078' },
        { id: '5024', label: 'RAL 5024', hex: '#5d9b9b', swatch: '#5d9b9b' },
        { id: 'clear',label: 'Clear pigmented', hex: '#3c3a35', swatch: '#3c3a35' }
      ]},
      { id: 'cure', label: 'Cure', mode: 'single', options: [
        { id: 'std',  label: 'Standard' },
        { id: 'fast', label: 'Fast (–30 °C)' }
      ]},
      { id: 'broadcast', label: 'Кварц-broadcast', mode: 'single', options: [
        { id: 'off',    label: 'Без кварца' },
        { id: 'fine',   label: 'Fine' },
        { id: 'coarse', label: 'Coarse' }
      ]},
      { id: 'finish', label: 'Топкоат', mode: 'single', options: [
        { id: 'clear',     label: 'Clear' },
        { id: 'pigmented', label: 'Pigmented' }
      ]}
    ],
    concrete: [
      { id: 'aggregate', label: 'Aggregate exposure', mode: 'single', options: [
        { id: 'salt',  label: 'Salt-pepper' },
        { id: 'cream', label: 'Cream' },
        { id: 'full',  label: 'Full-aggregate' }
      ]},
      { id: 'grit', label: 'Polish grit', mode: 'single', options: [
        { id: '400',  label: '400' },
        { id: '800',  label: '800' },
        { id: '1500', label: '1500' },
        { id: '3000', label: '3000' }
      ]},
      { id: 'sealer', label: 'Sealer', mode: 'single', options: [
        { id: 'oleo',     label: 'Olephobic' },
        { id: 'wetlook',  label: 'Wet-look' },
        { id: 'densify',  label: 'Densify-only' }
      ]}
    ],
    rubber: [
      { id: 'type', label: 'Тип', mode: 'single', options: [
        { id: 'poured',       label: 'Poured (sport)' },
        { id: 'sheet',        label: 'Sheet' },
        { id: 'tile',         label: 'Tile' },
        { id: 'comfortfloor', label: 'ComfortFloor PS-65' }
      ]},
      { id: 'color', label: 'Цвет', mode: 'single', options: [
        { id: 'black',      label: 'Black',      hex: '#1a1a1a', swatch: '#1a1a1a' },
        { id: 'red',        label: 'Red',        hex: '#a82a28', swatch: '#a82a28' },
        { id: 'blue',       label: 'Blue',       hex: '#1d4f8a', swatch: '#1d4f8a' },
        { id: 'sand',       label: 'Sand',       hex: '#bca27a', swatch: '#bca27a' },
        { id: 'multicolor', label: 'Multicolor', hex: '#3a3a3a', swatch: '#5a5a5a' }
      ]},
      { id: 'surface', label: 'Поверхность', mode: 'single', options: [
        { id: 'smooth',   label: 'Smooth' },
        { id: 'textured', label: 'Textured' }
      ]},
      { id: 'thickness', label: 'Толщина', mode: 'single', options: [
        { id: '4mm', label: '4 мм' },
        { id: '6mm', label: '6 мм' },
        { id: '9mm', label: '9 мм' }
      ]}
    ]
  };

  // Aggregate id → chip palette (overrides PALETTES[mat].chips when active)
  const AGGREGATE_CHIPS = {
    basalt:  [
      { c: '#0a0a0a', w: .35 }, { c: '#3a3a3c', w: .25 },
      { c: '#1c1c1e', w: .20 }, { c: '#5a5a5c', w: .15 },
      { c: '#9a9a9d', w: .05 }
    ],
    carrara: [
      { c: '#fafafa', w: .30 }, { c: '#e8e6e0', w: .30 },
      { c: '#cfcfcf', w: .15 }, { c: '#9a9a9d', w: .10 },
      { c: '#1d1d1f', w: .05 }, { c: '#3a3a3c', w: .10 }
    ],
    verona:  [
      { c: '#c66a3a', w: .20 }, { c: '#d8a82e', w: .15 },
      { c: '#7d6f54', w: .25 }, { c: '#b9a98a', w: .25 },
      { c: '#1d1d1f', w: .05 }, { c: '#fafafa', w: .10 }
    ],
    mirror:  [
      { c: '#e8eef2', w: .35 }, { c: '#9bb0c0', w: .25 },
      { c: '#3a4a58', w: .20 }, { c: '#1d1d1f', w: .10 },
      { c: '#fafafa', w: .10 }
    ],
    brass:   [
      { c: '#c9a04a', w: .35 }, { c: '#a87a2a', w: .25 },
      { c: '#dcb86a', w: .15 }, { c: '#1d1d1f', w: .15 },
      { c: '#7a6a3a', w: .10 }
    ]
  };

  // Strip-overlay style for терраццо саргелим (CSS background)
  function stripsBackground(stripId) {
    if (!stripId || stripId === 'off') return 'none';
    const map = {
      brass4: { color: 'rgba(201,160,74,.92)', width: '4px',  spacing: '120px' },
      alu4:   { color: 'rgba(216,212,204,.95)', width: '4px',  spacing: '120px' },
      black6: { color: 'rgba(10,10,10,.92)',   width: '6px',  spacing: '160px' }
    };
    const s = map[stripId];
    if (!s) return 'none';
    // 4 vertical bars at 25%/50%/75% of plate width — emulate via repeating-linear-gradient
    return `repeating-linear-gradient(90deg, transparent 0 calc(${s.spacing} - ${s.width}), ${s.color} calc(${s.spacing} - ${s.width}) ${s.spacing})`;
  }

  // System URL builder per material
  function systemHrefFor(material, st) {
    const enc = (v) => encodeURIComponent(v || '');
    switch (material) {
      case 'terrazzo':
      case 'terrazzo-dark':
      case 'terrazzo-light':
        return `floors/terrazzo.html?finish=${enc(st.finish)}&aggregate=${enc(st.aggregate)}&color=${enc(st.color)}`;
      case 'epoxy':
      case 'epoxy-light':
        return `floors/epoxy.html?ral=${enc(st.color)}&fleck=${enc(st.flecks)}&finish=${enc(st.finish)}&broadcast=${enc(st.broadcast)}`;
      case 'micro':
        return `floors/microtopping.html?color=${enc(st.color)}&finish=${enc(st.finish)}&texture=${enc(st.texture)}&topcoat=${enc(st.broadcast)}`;
      case 'concrete':
        return `floors/concrete.html?exposure=${enc(st.aggregate)}&grit=${enc(st.grit)}&sealer=${enc(st.sealer)}`;
      case 'purcem':
        return `floors/pu-cement.html?color=${enc(st.color)}&surface=${enc(st.surface)}&thickness=${enc(st.thickness)}&cove=${enc(st.cove)}`;
      case 'mma':
        return `floors/mma.html?color=${enc(st.color)}&cure=${enc(st.cure)}&broadcast=${enc(st.broadcast)}&finish=${enc(st.finish)}`;
      case 'rubber':
        return `floors/rubber.html?type=${enc(st.type)}&color=${enc(st.color)}&surface=${enc(st.surface)}&thickness=${enc(st.thickness)}`;
      default:
        return 'floors.html';
    }
  }

  // Map finish id → CSS variables for plate gloss/contrast
  function glossVarsFor(finishId) {
    switch (finishId) {
      case 'matte':    return { gloss: '0',   filter: 'contrast(1.00) brightness(1.00)' };
      case 'satin':    return { gloss: '.4',  filter: 'contrast(1.04) brightness(1.02)' };
      case 'polished':
      case 'glossy':
      case 'wetlook':  return { gloss: '1',   filter: 'contrast(1.10) brightness(1.05)' };
      case 'clear':    return { gloss: '.85', filter: 'contrast(1.06) brightness(1.03)' };
      case 'pigmented':return { gloss: '.4',  filter: 'contrast(1.04) brightness(1.00)' };
      default:         return { gloss: '.4',  filter: 'contrast(1.04) brightness(1.02)' };
    }
  }

  // Polish grit (concrete) → gloss intensity
  function gritGlossVars(gritId) {
    switch (gritId) {
      case '400':  return { gloss: '0',   filter: 'contrast(1.00) brightness(.95)' };
      case '800':  return { gloss: '.3',  filter: 'contrast(1.03) brightness(.98)' };
      case '1500': return { gloss: '.65', filter: 'contrast(1.06) brightness(1.02)' };
      case '3000': return { gloss: '1',   filter: 'contrast(1.10) brightness(1.06)' };
      default:     return { gloss: '.4',  filter: 'none' };
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
    const sheenOverlay   = document.querySelector('[data-fx="sheen"]');
    const systemLink     = document.querySelector('[data-fx="systemLink"]');

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
      controlsRoot.innerHTML = schema.map(group => {
        const buttons = group.options.map(opt => {
          const isOn = st[group.id] === opt.id;
          const swatch = opt.swatch ? `<span class="fx-hero-lab__btn-dot" style="background:${opt.swatch}"></span>` : '';
          const cls = `fx-hero-lab__btn${isOn ? ' is-active' : ''}${opt.swatch ? ' has-dot' : ''}`;
          return `<button type="button" class="${cls}" data-control="${group.id}" data-value="${opt.id}" aria-pressed="${isOn ? 'true' : 'false'}">${swatch}<span class="fx-hero-lab__btn-label">${localize(opt.label)}</span></button>`;
        }).join('');
        return `<div class="fx-hero-lab__group">
          <p class="fx-hero-lab__ctrl-label">${localize(group.label)}</p>
          <div class="fx-hero-lab__btnrow">${buttons}</div>
        </div>`;
      }).join('');
    }

    // Resolve final palette + apply CSS vars / overlays for current material+state
    function applyAllForMaterial(material) {
      const p = PALETTES[material];
      if (!p) return;
      const st = ensureState(material);
      plate.setAttribute('data-system', material);

      // 1) Body/base color from `color` control if hex provided, else palette default
      const colorOpt = selectedOption(material, 'color');
      const baseHex = (colorOpt && colorOpt.hex) || p.base;
      const bodyHex = (colorOpt && colorOpt.hex) || p.bodyColor || p.base;
      plate.style.setProperty('--plate-base', baseHex);
      plate.style.setProperty('--plate-body', bodyHex);
      plate.style.setProperty('--plate-top',  baseHex);

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

      // 3) Photographic top texture — disabled in Lab v3 mode so SVG always shows
      //    (controls are the source of truth; photo would mask their effect).
      plate.style.setProperty('--plate-top-image', 'none');
      plate.style.setProperty('--plate-svg-opacity', '1');
      plate.style.setProperty('--plate-top-filter', 'none');

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

      // 6) Texture overlay (micro / concrete / rubber surface)
      if (textureOverlay) {
        textureOverlay.className = 'fx-hero-lab__texture';
        const txOpt = selectedOption(material, 'texture');
        if (txOpt && txOpt.id !== 'smooth') {
          textureOverlay.classList.add('is-on');
          textureOverlay.classList.add('mode-' + txOpt.id);
        }
        // surface (purcem/rubber) maps too
        const surfOpt = selectedOption(material, 'surface');
        if (surfOpt && surfOpt.id !== 'smooth') {
          textureOverlay.classList.add('is-on');
          textureOverlay.classList.add('surf-' + surfOpt.id);
        }
        // broadcast (epoxy/mma) → fine/coarse texture
        const bcOpt = selectedOption(material, 'broadcast');
        if (bcOpt && bcOpt.id && bcOpt.id !== 'off' && bcOpt.id !== 'pu2x' && bcOpt.id !== 'wax') {
          textureOverlay.classList.add('is-on');
          textureOverlay.classList.add('bc-' + bcOpt.id);
        }
      }

      // 7) Finish / gloss → CSS vars (controls sheen overlay)
      let glossInfo = null;
      const finishOpt = selectedOption(material, 'finish');
      if (finishOpt) glossInfo = glossVarsFor(finishOpt.id);
      if (material === 'concrete') {
        const gritOpt = selectedOption(material, 'grit');
        if (gritOpt) glossInfo = gritGlossVars(gritOpt.id);
      }
      if (!glossInfo) glossInfo = { gloss: '.4', filter: 'none' };
      plate.style.setProperty('--plate-gloss', glossInfo.gloss);
      plate.style.setProperty('--plate-body-filter', glossInfo.filter);

      // 8) Thickness (purcem / rubber) → body layer height
      const thOpt = selectedOption(material, 'thickness');
      if (thOpt) {
        const map = { '4mm': '12px', '6mm': '16px', '9mm': '22px' };
        plate.style.setProperty('--plate-body-h', map[thOpt.id] || '16px');
      } else {
        plate.style.removeProperty('--plate-body-h');
      }

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
      }
    }

    function selectMaterial(material) {
      curMat = material;
      ensureState(material);
      // mark active in left material list
      document.querySelectorAll('.fx-hero-lab__mat').forEach(b => {
        b.classList.toggle('is-active', b.dataset.m === material);
        b.setAttribute('aria-pressed', b.dataset.m === material ? 'true' : 'false');
      });
      renderControls(material);
      applyAllForMaterial(material);
    }

    // Initial render
    selectMaterial(curMat);

    // LEFT — material list click handler (delegated)
    const matsRoot = document.querySelectorAll('.fx-hero-lab__mat');
    matsRoot.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const m = btn.dataset.m;
        if (!m || m === curMat) {
          // still re-render in case state was reset
          if (m && m !== curMat) selectMaterial(m);
          return;
        }
        selectMaterial(m);
      });
    });

    // RIGHT — controls click handler (delegated)
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
          });
        }
        applyAllForMaterial(curMat);
      });
    }

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

    function toggleExplode() {
      exploded = !exploded;
      plate.classList.toggle('is-exploded', exploded);
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
