/* ============================================================
   enhance.js — isolated additive layer over existing site.
   IIFE-namespaced as window.fx. Does not modify script.js.
   ============================================================ */
(function () {
  'use strict';
  const fx = window.fx = window.fx || {};

  /* ---------------- terrazzo pattern (from /v2/) ---------- */
  const PALETTES = {
    terrazzo: {
      base: '#efe7d6', sub: 'venetian',
      thick: '12 мм', base_: 'эпоксидная смола',
      chips: [
        { c: '#d9c39a', w: .18 }, { c: '#1c1916', w: .12 },
        { c: '#7d6f54', w: .18 }, { c: '#c2603e', w: .06 },
        { c: '#5a6a4f', w: .05 }, { c: '#b9a98a', w: .20 },
        { c: '#fff', w: .08 }
      ]
    },
    epoxy: {
      base: '#2a2620', sub: 'self-leveling',
      thick: '4 мм', base_: 'эпоксидная смола',
      chips: [
        { c: '#3a342c', w: .5 }, { c: '#5d5448', w: .25 },
        { c: '#1c1916', w: .25 }
      ]
    },
    micro: {
      base: '#cfc4b3', sub: 'satin',
      thick: '2–3 мм', base_: 'минеральная база',
      chips: [
        { c: '#b9a98a', w: .4 }, { c: '#9a8e7b', w: .3 },
        { c: '#dccaa9', w: .3 }
      ]
    },
    concrete: {
      base: '#7a7468', sub: 'polished',
      thick: '8 мм', base_: 'портланд-цемент',
      chips: [
        { c: '#5d5448', w: .3 }, { c: '#3a342c', w: .2 },
        { c: '#9a9286', w: .3 }, { c: '#a8a298', w: .2 }
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

    const set = () => {
      const m2 = +$area.value;
      const lbl = card.querySelector('[data-fx="cAreaLbl"]');
      const val = card.querySelector('[data-fx="cAreaVal"]');
      if (lbl) lbl.textContent = m2;
      if (val) val.textContent = m2;
      const total = Math.round(m2 * p * k);
      const out = card.querySelector('[data-fx="cTotal"]');
      if (out) out.textContent = total.toLocaleString('ru-RU').replace(/,/g, ' ');
    };

    $area.addEventListener('input', set);

    card.querySelectorAll('[data-fx="cMat"] span').forEach(s => {
      s.addEventListener('click', () => {
        card.querySelectorAll('[data-fx="cMat"] span').forEach(x => x.classList.remove('on'));
        s.classList.add('on');
        p = +s.dataset.p;
        set();
      });
    });
    card.querySelectorAll('[data-fx="cUse"] span').forEach(s => {
      s.addEventListener('click', () => {
        card.querySelectorAll('[data-fx="cUse"] span').forEach(x => x.classList.remove('on'));
        s.classList.add('on');
        k = +s.dataset.k;
        set();
      });
    });

    set();
  };

  /* ---------------- project filter chips ------------------ */
  fx.initProjFilter = function () {
    const filter = document.querySelector('[data-fx="projFilter"]');
    if (!filter) return;
    const items = document.querySelectorAll('.project-item, .project-card, .projects-masonry__item');
    if (!items.length) return;
    filter.querySelectorAll('span').forEach(s => {
      s.addEventListener('click', () => {
        filter.querySelectorAll('span').forEach(x => x.classList.remove('on'));
        s.classList.add('on');
        const f = s.dataset.f;
        items.forEach(it => {
          const cat = (it.dataset.fxCat || it.dataset.category || '').toLowerCase();
          it.style.display = (f === 'all' || cat.includes(f)) ? '' : 'none';
        });
      });
    });
  };

  /* ---------------- audience switcher --------------------- */
  fx.initAudSwitch = function () {
    const hero = document.getElementById('heroSplit');
    if (!hero || hero.querySelector('.fx-aud-switch')) return;

    const tabs = document.createElement('div');
    tabs.className = 'fx-aud-switch';
    tabs.innerHTML = `
      <span class="on" data-a="b2b">Бизнесу</span>
      <span data-a="design">Архитектору</span>
      <span data-a="resi">Частнику</span>
    `;
    hero.appendChild(tabs);

    // URL ?audience=b2b|design|resi takes priority over saved
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('audience');
    const saved = fromUrl || localStorage.getItem('fx_audience');
    if (saved) {
      tabs.querySelectorAll('span').forEach(s => {
        s.classList.toggle('on', s.dataset.a === saved);
      });
      if (fromUrl) localStorage.setItem('fx_audience', fromUrl);
    }

    tabs.querySelectorAll('span').forEach(s => {
      s.addEventListener('click', () => {
        tabs.querySelectorAll('span').forEach(x => x.classList.remove('on'));
        s.classList.add('on');
        try { localStorage.setItem('fx_audience', s.dataset.a); } catch (e) { /* private mode */ }
      });
    });
  };

  /* ---------------- 3D rotating plate --------------------- */
  fx.init3DPlate = function () {
    const plate = document.querySelector('[data-fx="plate"]');
    if (!plate) return;
    const topPattern = document.querySelector('[data-fx="topPattern"]');
    if (!topPattern) return;

    let curMat = 'terrazzo';
    buildTerrazzo(topPattern, curMat);

    const matSeg = document.querySelector('.fx-plate-mat-seg');
    if (matSeg) {
      matSeg.querySelectorAll('span').forEach(s => {
        s.addEventListener('click', () => {
          matSeg.querySelectorAll('span').forEach(x => x.classList.remove('on'));
          s.classList.add('on');
          curMat = s.dataset.m;
          buildTerrazzo(topPattern, curMat);
          const p = PALETTES[curMat];
          if (!p) return;
          const t1 = document.querySelector('[data-fx="pmType"]');
          const t2 = document.querySelector('[data-fx="pmThick"]');
          const t3 = document.querySelector('[data-fx="pmBase"]');
          if (t1) t1.textContent = `${curMat} · ${p.sub}`;
          if (t2) t2.textContent = p.thick;
          if (t3) t3.textContent = p.base_;
        });
      });
    }

    let rx = 56, ry = -18, drag = null;
    const applyRot = () => {
      plate.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    plate.addEventListener('mousedown', (e) => {
      e.preventDefault();
      plate.classList.remove('idle');
      drag = { x: e.clientX, y: e.clientY, rx, ry };
    });
    window.addEventListener('mousemove', (e) => {
      if (!drag) return;
      rx = Math.max(20, Math.min(85, drag.rx + (drag.y - e.clientY) * .4));
      ry = drag.ry + (e.clientX - drag.x) * .6;
      applyRot();
    });
    window.addEventListener('mouseup', () => {
      if (!drag) return;
      drag = null;
      setTimeout(() => { if (!drag) plate.classList.add('idle'); }, 2400);
    });

    plate.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      plate.classList.remove('idle');
      drag = { x: t.clientX, y: t.clientY, rx, ry };
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!drag) return;
      const t = e.touches[0];
      rx = Math.max(20, Math.min(85, drag.rx + (drag.y - t.clientY) * .4));
      ry = drag.ry + (t.clientX - drag.x) * .6;
      applyRot();
    }, { passive: true });
    window.addEventListener('touchend', () => {
      if (!drag) return;
      drag = null;
      setTimeout(() => { if (!drag) plate.classList.add('idle'); }, 2400);
    });
  };

  /* ---------------- onboarding overlay -------------------- */
  fx.initOnboarding = function () {
    const ob = document.querySelector('[data-fx="onboarding"]');
    if (!ob) return;
    const params = new URLSearchParams(location.search);
    const force = params.get('reset') === '1';

    let onboarded = false;
    try { onboarded = localStorage.getItem('fx_onboarded') === '1'; } catch (e) { /* ignore */ }

    if (onboarded && !force) {
      ob.remove();
      return;
    }

    // make it visible (HTML uses display:none for non-blocking initial paint)
    ob.style.display = 'flex';

    const screens = ob.querySelectorAll('.fx-ob-screen');
    const dots = ob.querySelectorAll('.fx-ob-dot');
    const goto = step => {
      screens.forEach(s => s.classList.toggle('active', s.dataset.step === String(step)));
      dots.forEach(d => d.classList.toggle('on', Number(d.dataset.i) <= step));
    };
    const chosen = { audience: '', type: '' };

    const skipBtn = ob.querySelector('[data-fx="obSkip"]');
    if (skipBtn) skipBtn.addEventListener('click', finish);

    ob.querySelectorAll('[data-next]').forEach(b => {
      b.addEventListener('click', () => goto(Number(b.dataset.next)));
    });
    ob.querySelectorAll('.fx-ob-opt[data-aud]').forEach(b => {
      b.addEventListener('click', () => {
        chosen.audience = b.dataset.aud;
        goto(3);
      });
    });
    ob.querySelectorAll('.fx-ob-opt-large[data-type]').forEach(b => {
      b.addEventListener('click', () => {
        chosen.type = b.dataset.type;
        finish();
      });
    });

    function finish() {
      try {
        if (chosen.audience) localStorage.setItem('fx_audience', chosen.audience);
        if (chosen.type) localStorage.setItem('fx_type', chosen.type);
        localStorage.setItem('fx_onboarded', '1');
      } catch (e) { /* private mode */ }

      ob.classList.add('gone');
      setTimeout(() => ob.remove(), 900);

      if (chosen.audience) {
        const tab = document.querySelector(`.fx-aud-switch span[data-a="${chosen.audience}"]`);
        if (tab) tab.click();
      }
    }
  };

  /* ---------------- bootstrap ----------------------------- */
  function init() {
    try { fx.initOnboarding && fx.initOnboarding(); } catch (e) { console.warn('fx.initOnboarding', e); }
    try { fx.initAudSwitch && fx.initAudSwitch(); } catch (e) { console.warn('fx.initAudSwitch', e); }
    try { fx.init3DPlate && fx.init3DPlate(); } catch (e) { console.warn('fx.init3DPlate', e); }
    try { fx.initCalc && fx.initCalc(); } catch (e) { console.warn('fx.initCalc', e); }
    try { fx.initProjFilter && fx.initProjFilter(); } catch (e) { console.warn('fx.initProjFilter', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
