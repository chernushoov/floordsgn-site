/* ============================================================
   enhance.js — isolated additive layer over existing site.
   IIFE-namespaced as window.fx. Does not modify script.js.
   ============================================================ */
(function () {
  'use strict';
  const fx = window.fx = window.fx || {};

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
    }
  };

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

  /* ---------------- 3D rotating plate --------------------- */
  fx.init3DPlate = function () {
    const plate = document.querySelector('[data-fx="plate"]');
    if (!plate) return;
    const topPattern = document.querySelector('[data-fx="topPattern"]');
    if (!topPattern) return;

    let curMat = 'terrazzo-dark';
    function applyMaterial(key) {
      const p = PALETTES[key];
      if (!p) return;
      plate.setAttribute('data-system', key);
      buildTerrazzo(topPattern, key);
      const t1 = document.querySelector('[data-fx="pmType"]');
      const t2 = document.querySelector('[data-fx="pmThick"]');
      const t3 = document.querySelector('[data-fx="pmBase"]');
      if (t1) t1.textContent = `${p.label} · ${p.sub}`;
      if (t2) t2.textContent = p.thick;
      if (t3) t3.textContent = p.base_;
      plate.style.setProperty('--plate-body', p.bodyColor || p.base);
      plate.style.setProperty('--plate-top',  p.base);
      // Реалистичная фото-текстура поверх процедурного SVG
      if (p.top) {
        plate.style.setProperty('--plate-top-image', `url('${p.top}')`);
        plate.style.setProperty('--plate-svg-opacity', '0');
        plate.style.setProperty('--plate-top-filter', p.filter || 'none');
      } else {
        plate.style.setProperty('--plate-top-image', 'none');
        plate.style.setProperty('--plate-svg-opacity', '1');
        plate.style.setProperty('--plate-top-filter', 'none');
      }
      // Динамические подписи слоёв из buildup конфига Sika TDS
      if (p.buildup) {
        const setLayerLabel = (sel, def) => {
          const el = document.querySelector(sel);
          if (!el || !def) return;
          const tag = el.querySelector('.fx-layer-tag');
          if (!tag) return;
          tag.innerHTML = def.name + (def.sku ? `<b>${def.sku}</b>` : '');
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
            if (tag) tag.innerHTML = p.buildup.mesh.name + (p.buildup.mesh.sku ? `<b>${p.buildup.mesh.sku}</b>` : '');
          }
        }
      }
    }
    applyMaterial(curMat);

    const matSeg = document.querySelector('.fx-plate-mat-seg');
    if (matSeg) {
      matSeg.querySelectorAll('button, span').forEach(s => {
        s.addEventListener('click', () => {
          matSeg.querySelectorAll('button, span').forEach(x => x.classList.remove('on'));
          s.classList.add('on');
          curMat = s.dataset.m;
          applyMaterial(curMat);
        });
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
        ? 'нажмите ещё раз чтобы собрать обратно'
        : 'тяните чтобы вращать · нажмите чтобы разнести на слои';
      if (exploded) {
        // Снимаем inline --rx/--ry от drag, чтобы CSS .is-exploded
        // мог зафиксировать "правильный" угол показа слоёв.
        plate.style.removeProperty('--rx');
        plate.style.removeProperty('--ry');
        // Запоминаем "правильную" позу для подписей.
        rx = 24; ry = -16;
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
        status.textContent = 'Отправляем...';

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

          status.textContent = 'Готово. Мы свяжемся и отправим образец / тех. описание.';
          form.reset();
          setTimeout(close, 1200);
        } catch (error) {
          status.innerHTML = 'Не удалось подтвердить отправку. Напишите в WhatsApp: <a href="https://wa.me/972559661459" target="_blank" rel="noopener">+972 55 966 1459</a>.';
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
    const text = `Здравствуйте! Пишу со страницы «${sysName}». Хочу обсудить проект.`;
    const url = `https://wa.me/${number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`;
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
      if (progress) progress.textContent = `Вопрос ${Math.min(i + 1, total)} из ${total}`;
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
            if (out) out.innerHTML = rec.map(r => `<li>${r}</li>`).join('');
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
      if ($total) $total.textContent = p.total;
      if ($cure)  $cure.textContent  = p.cure;
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
      { sel: '.fx-picker', text: 'Сравнить' },
      { sel: '.quality-section, .gallery-section', text: 'Расчёт' },
      { sel: '.cta-section, .testimonials-section', text: 'Звонок' },
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
        let next = 'Расчёт';
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
