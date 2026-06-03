/* ═══════════════ FloorDSGN Studio — persona controller ═══════════════
   Overlay on the floor-room 3D engine. Drives the engine ONLY through the
   existing control chips (#floorCtl/#roomCtl/#finishCtl/#viewCtl) and the
   read-only window.__room API. The engine never imports this file. */
(() => {
  'use strict';
  const WA = '972559661459';
  const MAIL = 'floors.dsgn@gmail.com';
  const ASSET_V = '20260603-8';   // bump with studio.js ?v= → busts the 1yr-immutable /3d-assets JSON cache
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, attrs = {}, html) => { const n = document.createElement(tag);
    for (const k in attrs){ if (k === 'class') n.className = attrs[k]; else if (k === 'html') n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html; return n; };

  let DATA = null, MAN = null, DESIGNS = {};   // personas.json, manifest.json, _designs/index.json
  let booting = true;                      // suppress floor-change colour reset during deep-link boot
  let comparing = false;                   // suppress floor-change side-effects during visual A/B capture
  let L = localStorage.getItem('floordsgn_lang') || 'ru';
  if (L !== 'ru' && L !== 'en') L = 'ru';
  const WALL_SIDES = ['left','right','back','window'];
  const wallDef = () => ({ m:'microcement', c:null, d:null });   // material / colour id / design id
  const STATE = { avatar:'explore', m:'micro', room:'living', finish:'satin', view:'hall', light:'golden', figure:false, realChip:false, dims:null, sun:0.4, ctl:{ color:'orig', design:'orig' }, edit:false, tf:{}, style:'warm', walls:{ left:wallDef(), right:wallDef(), back:wallDef(), window:wallDef() } };
  /* walls deep-link: only non-default walls — "wall:material:colourId:designId" joined by ",".
     microcement + no colour + no design = default (omitted). */
  const wallIsDef = (w) => w.m === 'microcement' && !w.c && !w.d;
  const encWalls = () => WALL_SIDES.filter(k => !wallIsDef(STATE.walls[k])).map(k => [k, STATE.walls[k].m, STATE.walls[k].c || '', STATE.walls[k].d || ''].join(':')).join(',');
  const decWalls = (s) => String(s).split(',').forEach(p => { const a = p.split(':'); if (a[0] && WALL_SIDES.indexOf(a[0]) >= 0) STATE.walls[a[0]] = { m:a[1] || 'microcement', c:a[2] || null, d:a[3] || null }; });
  const wallDesigns = (mat) => { const r = window.__room; const k = r && r.getWallDesignKey ? r.getWallDesignKey(mat) : null; return (k && DESIGNS && DESIGNS[k]) || []; };
  const applyWalls = () => { const r = window.__room; if (!r || !r.setWall) return;
    WALL_SIDES.forEach(k => { const w = STATE.walls[k]; if (wallIsDef(w)) return;
      r.setWall(k, w.m);
      if (w.c){ const o = colorOpts().find(x => x.id === w.c); if (o && o.hex) r.setWallColor(k, o.hex); }
      if (w.d){ const v = wallDesigns(w.m).find(x => x.id === w.d); if (v) r.setWallDesign(k, '3d-assets/' + v.file); }
    }); };   // re-apply after a shell rebuild (fixes per-room repeat); material→colour→design order
  /* tf deep-link: per-room furniture transforms, only moved pieces. "name,x,z,ry" joined by ";". */
  const encTf = (arr) => (arr || []).map(m => [m.name, m.x, m.z, +(+m.ry || 0).toFixed(3)].join(',')).join(';');
  const decTf = (s) => String(s).split(';').map(p => { const a = p.split(','); if (a.length < 4 || !a[0]) return null; const x=+a[1], z=+a[2], ry=+a[3]; return (Number.isFinite(x) && Number.isFinite(z) && Number.isFinite(ry)) ? { name:a[0], x, z, ry } : null; }).filter(Boolean);   // M6: drop malformed/NaN tf tokens (NaN would teleport furniture to oblivion)
  const applyTf = (rm) => { const r = window.__room; const arr = STATE.tf[rm || STATE.room]; if (r && r.setTransforms && arr && arr.length) r.setTransforms(arr); };
  const track = (event, data) => { try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event:'studio_' + event, avatar:STATE.avatar }, data || {})); } catch(e){} };
  const postLead = (channel) => { try { fetch('/lead', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ persona:STATE.avatar, material:curFloor(), room:STATE.room, light:STATE.light, url:shareURL(), channel, ts:0 }) }).catch(() => {}); } catch(e){} };
  const t = (k) => (DATA && DATA.ui[L] && DATA.ui[L][k]) || k;
  const tx = (o) => o ? (o[L] || o.ru || '') : '';
  const LIGHT_OPTS = [
    { id:'golden',  ru:'Тёплый',   en:'Warm' },
    { id:'noon',    ru:'День',     en:'Noon' },
    { id:'evening', ru:'Вечер',    en:'Evening' },
    { id:'hard',    ru:'Контраст', en:'Hard' }
  ];
  const COLOR_EN = { neutral:'Neutral', warm:'Warm', cool:'Cool', graphite:'Graphite' };
  const colorOpts = () => {
    const base = [{ id:'orig', name:{ ru:'Оригинал', en:'Original' }, hex:null }];
    const co = (MAN.control_options && MAN.control_options.color && MAN.control_options.color.options) || [];
    return base.concat(co.map(o => ({ id:o.id, name:{ ru:o.name, en:(COLOR_EN[o.id] || o.name) }, hex:o.hex })));
  };
  const applyColor = (id) => {
    STATE.ctl.color = id;
    const room = window.__room; if (!room || !room.floorMat) return;
    const o = colorOpts().find(x => x.id === id);
    room.floorMat.color.set(o && o.hex ? o.hex : 0xffffff);
    room.floorMat.needsUpdate = true;
  };

  /* ---------- life-size chip scale (real-mm) — studio-side, engine file untouched ----------
     Engine sets floorMat repeat = fW/tile (fW = room W+2 = 14 m) with an art-directed `tile`
     per floor. Real installed chips read ~half that, so this optional mode ~doubles the repeat
     to show aggregate at life size (cement/multi anchored to dossier physical_mm_per_tile).
     We cache the engine's own repeat per floor and restore it verbatim when toggled OFF. */
  const FLOOR_PLANE = 14;   // engine fW = W(12)+2
  const REAL_TILE = { light:0.45, venetian:0.5, graphite:0.4, cement:0.34, multi:0.24, comfort:1.1, micro:1.1 };   // m of real floor per texture repeat — life-size, from dossier physical_mm_per_tile (cement ~330mm, multi ~220mm)
  const hasChips = (fl) => !['micro', 'comfort'].includes(fl);   // seamless floors have no aggregate
  const _repCache = {};
  const floorMaps = () => { const m = window.__room && window.__room.floorMat; return m ? [m.map, m.normalMap, m.roughnessMap] : []; };
  function captureArtRepeat(){ const ms = floorMaps(); if (ms[0]) _repCache[curFloor()] = ms[0].repeat.x; }
  function applyChipScale(){
    const r = window.__room; if (!r || !r.floorMat) return;
    const fl = curFloor(); let rep;
    if (STATE.realChip) rep = FLOOR_PLANE / (REAL_TILE[fl] || 0.75);
    else { rep = _repCache[fl]; if (rep == null) return; }   // nothing captured → leave engine value
    floorMaps().forEach(m => { if (m){ m.repeat.set(rep, rep); m.needsUpdate = true; } });
    r.floorMat.needsUpdate = true; if (r.bake) r.bake();
  }

  /* ---------- design variants (different real-floor patterns of one material) ----------
     Swaps ONLY the diffuse image on the live floor texture (keeps normal/roughness/repeat),
     so it stays studio-side and the engine file is untouched. Same-origin image → the canvas
     stays un-tainted, so snapshot/compare/print keep working. */
  const DESIGN_MAP = { cement:'terrazzo-cement', multi:'terrazzo-multi', graphite:'terrazzo-epoxy', micro:'microtopping' };
  const designsFor = (fl) => { const k = DESIGN_MAP[fl]; return (DESIGNS && DESIGNS[k]) || []; };
  function applyDesign(variant){
    const r = window.__room; if (!(r && r.floorMat && r.floorMat.map)) return;
    const fl0 = curFloor();
    const img = new Image();
    img.onload = () => {
      // H3: re-read the LIVE map inside onload and bail if the floor/design changed since the click —
      // otherwise a slow design image can land on a texture setFloor already disposed (corrupt bake).
      if (curFloor() !== fl0 || STATE.ctl.design !== variant.id) return;
      const map = r.floorMat.map; if (!map) return;
      map.image = img; map.needsUpdate = true; r.floorMat.needsUpdate = true; if (r.bake) r.bake();
    };
    img.src = '3d-assets/' + variant.file;
    STATE.ctl.design = variant.id;
  }

  /* ---------- engine seam: drive via existing chips ---------- */
  const clickChip = (sel) => { const b = $(sel); if (b) b.click(); };
  const setFloor  = (slug) => clickChip(`#floorCtl .chip[data-fl="${slug}"]`);
  const setRoom   = (rm)   => clickChip(`#roomCtl .chip[data-rm="${rm}"]`);
  const setFinish = (f)    => clickChip(`#finishCtl button[data-f="${f}"]`);
  const setView   = (v)    => clickChip(`#viewCtl .chip[data-v="${v}"]`);
  const curFloor  = () => { const on = $('#floorCtl .chip.on[data-fl]'); return on ? on.dataset.fl : STATE.m; };

  const persona = () => DATA.personas.find(p => p.id === STATE.avatar) || DATA.personas[0];
  const needsDividers = (fl) => !['micro', 'comfort'].includes(fl);   // seamless floors get no strips
  const manFor  = (floorSlug) => { const ms = DATA.floorMap[floorSlug]; return MAN.materials.find(x => x.slug === ms) || null; };
  const manBySlug = (slug) => MAN.materials.find(x => x.slug === slug) || null;

  /* ---------- price helpers (price ONLY appears via calculator) ---------- */
  const nums = (s) => (String(s).match(/\d[\d\s]*/g) || []).map(x => +x.replace(/\s/g, ''));
  const priceBand = (mat) => { const n = nums(mat && mat.spec && mat.spec.price); return n.length >= 2 ? [n[0], n[1]] : (n.length === 1 ? [n[0], n[0]] : [0, 0]); };
  const cureDays  = (mat) => { const n = nums(mat && mat.spec && mat.spec.cure); return n.length ? n[n.length - 1] : 7; };
  const fmt = (v) => '₪' + Math.round(v).toLocaleString('en-US');

  /* ═══════════ chrome ═══════════ */
  function buildChrome(){
    const header = el('div', { class:'st-header' });
    header.append(
      el('a', { class:'st-brand', href:'index.html' }, '<b>Floor.DSGN</b><span class="st-studio">Studio</span>'),
      el('div', { class:'st-spacer' }),
      (() => { const b = el('button', { class:'st-hbtn st-persona-pill', id:'stPersonaBtn' }, '<span class="dot"></span><span id="stPersonaName"></span>'); b.onclick = openChooser; return b; })(),
      (() => { const b = el('button', { class:'st-hbtn', id:'stBoardBtn' }, '<span class="bl"></span> <span class="cnt"></span>'); b.onclick = boardOpen; return b; })(),
      (() => { const b = el('button', { class:'st-hbtn st-share', id:'stShare' }); b.onclick = share; return b; })(),
      (() => { const w = el('div', { class:'st-lang' });
        ['ru','en'].forEach(lg => { const b = el('button', { 'data-lg':lg }, lg.toUpperCase()); b.onclick = () => setLang(lg); w.append(b); }); return w; })()
    );
    document.body.append(header);

    // chooser
    const chooser = el('div', { class:'st-chooser', id:'stChooser' });
    const card = el('div', { class:'st-chooser-card' });
    card.append(el('h2', { id:'stChooserTitle' }), el('div', { class:'sub', id:'stChooserHint' }));
    const tiles = el('div', { class:'st-tiles', id:'stTiles' });
    card.append(tiles);
    const skip = el('button', { class:'st-chooser-skip', id:'stChooserSkip' }); skip.onclick = () => { applyPersona('explore'); closeChooser(); };
    card.append(skip);
    card.append(el('div', { class:'st-chooser-links', id:'stChooserLinks' }));
    chooser.append(card); document.body.append(chooser);

    // board + compare modals + print host (M3)
    document.body.append(modalEl('stBoardModal', 'stBoardTitle', 'stBoardGrid', 'st-bgrid'));
    (() => { const grid = document.getElementById('stBoardGrid'); if (!grid) return;
      const pb = el('button', { class:'st-act', id:'stBoardPrint', style:'margin:14px auto 0;display:none' }); pb.onclick = boardPrint; grid.after(pb); })();
    document.body.append(modalEl('stCmpModal', 'stCmpTitle', 'stCmpWrap', 'st-cmpwrap'));
    document.body.append(el('div', { class:'st-print', id:'stPrint' }));

    // panel
    const panel = el('div', { class:'st-panel', id:'stPanel' });
    panel.append(el('div', { class:'st-panel-scroll', id:'stScroll' }), el('div', { class:'st-cta', id:'stCta' }));
    document.body.append(panel);
    const toggle = el('button', { class:'st-panel-toggle', id:'stToggle', 'aria-label':'Панель / Panel' }, '☰'); // hidden on desktop via CSS
    toggle.onclick = () => panel.classList.toggle('hidden');
    document.body.append(toggle);

    document.body.append(el('div', { class:'st-toast', id:'stToast' }));
  }

  /* ═══════════ persona chooser ═══════════ */
  function renderChooser(){
    $('#stChooserTitle').textContent = t('chooser_title');
    $('#stChooserHint').textContent = t('chooser_hint');
    $('#stChooserSkip').textContent = t('chooser_skip');
    const tiles = $('#stTiles'); tiles.innerHTML = '';
    DATA.personas.filter(p => p.id !== 'explore').forEach(p => {
      const tile = el('button', { class:'st-tile' });
      tile.append(el('div', { class:'nm' }, tx(p.name)), el('div', { class:'tg' }, tx(p.tagline)));
      tile.onclick = () => { applyPersona(p.id); closeChooser(); };
      tiles.append(tile);
    });
    const lk = $('#stChooserLinks'); if (lk){ lk.innerHTML = '';
      const waPartner = (txt) => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
      const items = [
        [L === 'ru' ? 'Все системы' : 'All systems', 'https://floordsgn.com/floors'],
        [L === 'ru' ? 'Поставщикам' : 'For suppliers', waPartner(L === 'ru' ? 'Партнёрство поставщика' : 'Supplier partnership')],
        [L === 'ru' ? 'Подрядчикам' : 'For contractors', waPartner(L === 'ru' ? 'Партнёрство подрядчика' : 'Contractor partnership')],
        [L === 'ru' ? 'На сайт' : 'Website', 'https://floordsgn.com']
      ];
      items.forEach(([lab, href]) => lk.append(el('a', { href, target:'_blank', rel:'noopener' }, lab)));
    }
  }
  function openChooser(){ renderChooser(); $('#stChooser').classList.add('show'); }
  function closeChooser(){ $('#stChooser').classList.remove('show'); }

  /* ═══════════ apply persona ═══════════ */
  function applyPersona(id){
    const p = DATA.personas.find(x => x.id === id) || DATA.personas[0];
    STATE.avatar = p.id;
    localStorage.setItem('floordsgn_avatar', p.id);

    // surface / order / hide floor chips
    const ctl = $('#floorCtl'); const lbl = ctl.querySelector('.lbl');
    const chips = {}; $$('#floorCtl .chip[data-fl]').forEach(c => { chips[c.dataset.fl] = c; c.style.display = 'none'; });
    p.floors.forEach(fl => { const c = chips[fl]; if (c){ c.style.display = ''; ctl.append(c); } }); // re-append in persona order
    if (lbl) ctl.insertBefore(lbl, ctl.firstChild);

    // defaults (only if current isn't already in persona's set)
    if (!p.floors.includes(curFloor())) setFloor(p.floors[0]);
    if (p.defaults){ if (p.defaults.room) setRoom(p.defaults.room); if (p.defaults.finish) setFinish(p.defaults.finish); if (p.defaults.view) setView(p.defaults.view); }
    const room = window.__room;
    if (room && room.setLighting && p.defaults && p.defaults.light){ room.setLighting(p.defaults.light); STATE.light = p.defaults.light; }
    if (room && room.scaleFigure) room.scaleFigure(STATE.figure);
    if (room && room.setDividers) room.setDividers(needsDividers(curFloor()));
    applyColor('orig');
    track('persona', {});

    $('#stPersonaName').textContent = tx(p.name);
    STATE.m = curFloor();
    renderPanel(); renderCta(); writeURL();
  }

  /* ═══════════ panel ═══════════ */
  function renderPanel(){
    const p = persona(); const fl = curFloor(); STATE.m = fl;
    const mat = manFor(fl);
    const scroll = $('#stScroll'); scroll.innerHTML = '';

    // print head (hidden on screen)
    scroll.append(el('div', { class:'st-print-head' }, '<div style="font-family:var(--disp);font-size:24px">Floor.DSGN — спецификация</div>'));

    // material name + tag
    scroll.append(el('div', { class:'st-mat-name' }, tx(DATA.floorLabels[fl] || { ru:fl })));
    scroll.append(el('div', { class:'st-mat-tag' }, tx(p.tagline)));
    const acts = el('div', { class:'st-acts' });
    const bSave = el('button', { class:'st-act' }, L === 'ru' ? '+ Сохранить' : '+ Save'); bSave.onclick = boardSave;
    const bCmp = el('button', { class:'st-act' }, L === 'ru' ? 'Сравнить' : 'Compare'); bCmp.onclick = compareOpen;
    const bFrame = el('button', { class:'st-act', title: L === 'ru' ? 'Скачать кадр PNG' : 'Download frame PNG' }, L === 'ru' ? 'Кадр' : 'Frame'); bFrame.onclick = downloadFrame;
    acts.append(bSave, bCmp, bFrame); scroll.append(acts);
    scroll.append(buildMaterials(p));

    // suitability gate (restaurant: microcement not for kitchens)
    if (p.suitabilityGate && p.suitability){
      const gate = el('div', { class:'st-gate' + (p.suitability.blocked.includes(fl) ? ' show' : '') }, tx(p.suitability.msg));
      scroll.append(gate);
    }

    scroll.append(buildFloorOpts(p));   // floor Цвет/RAL + Дизайн + Покрытие — right under Материал
    scroll.append(buildScene(p));       // light / style / walls / arrange / size

    const specBlock = buildSpec(mat, p);
    // info hierarchy: architect/pro/restaurant/warehouse → spec TOP; designer/private/explore → pains first, spec under accordion
    if (p.specPosition === 'top'){
      if (specBlock) scroll.append(specBlock);
      scroll.append(buildPains(p));
    } else {
      scroll.append(buildPains(p));
      if (specBlock){ const acc = el('details', { class:'st-acc' }); acc.append(el('summary', {}, `<div class="st-sect-h">${t('spec_toggle')}</div>`)); acc.append(specBlock); scroll.append(acc); }
    }

    // care section (private)
    if (p.careProminent && mat){
      scroll.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Уход и эксплуатация' : 'Care & use'));
      scroll.append(el('div', { class:'st-pain' }, `<div class="a">${L === 'ru'
        ? 'Влажная уборка нейтральным средством. Стойко к детям и животным. Без агрессивной химии и абразивов.'
        : 'Damp-mop with a neutral cleaner. Kid- and pet-friendly. Avoid harsh chemicals and abrasives.'}</div>`));
    }

    // calculator
    scroll.append(buildCalc(p, mat));

    // spec-only cards (systems without 3D)
    if (p.specCards && p.specCards.length){
      scroll.append(el('div', { class:'st-sect-h' }, t('spec_only')));
      p.specCards.forEach(slug => scroll.append(buildSpecCard(slug)));
    }
  }

  function buildSpec(mat, p){
    if (!mat) return null;
    const wrap = el('div', { class:'st-spec' });
    wrap.append(el('div', { class:'st-sect-h' }, t('spec_title')));
    const verChip = p.verification ? ` <span class="st-ver verified">${L === 'ru' ? 'проверено' : 'verified'}</span>` : '';
    const rows = [
      [L === 'ru' ? 'Тип' : 'Type', mat.spec.type],
      [L === 'ru' ? 'Толщина' : 'Thickness', mat.spec.thk],
      [L === 'ru' ? 'Основа' : 'Base', mat.spec.base],
      [L === 'ru' ? 'Готовность' : 'Cure', mat.spec.cure],
      [L === 'ru' ? 'Гарантия' : 'Warranty', mat.spec.warr],
      [L === 'ru' ? 'Применение' : 'Use', mat.spec.load]
      // NOTE: price intentionally omitted — owner rule: price only via calculator
    ];
    const tbl = el('table');
    rows.forEach(([k, v], i) => { if (!v) return; tbl.append(el('tr', {}, `<td>${k}${i === 0 ? verChip : ''}</td><td>${v}</td>`)); });
    wrap.append(tbl);
    if (mat.badges && mat.badges.length){
      const bw = el('div', { class:'st-badges' });
      mat.badges.forEach(b => { const hot = /R1[12]|HACCP|ANTI|ESD/i.test(b); bw.append(el('span', { class:'st-badge' + (hot ? '' : ' alt') }, b)); });
      wrap.append(bw);
    }
    if (mat.buildup){
      wrap.append(el('div', { class:'st-sect-h' }, t('buildup_title')));
      const bu = el('div', { class:'st-buildup' });
      const order = [['topcoat', L === 'ru' ? 'Топ' : 'Topcoat'], ['body', L === 'ru' ? 'Тело' : 'Body'], ['membrane', L === 'ru' ? 'Мембрана' : 'Membrane'], ['primer', L === 'ru' ? 'Праймер' : 'Primer'], ['substrate', L === 'ru' ? 'Основание' : 'Substrate']];
      order.forEach(([k, lab]) => { if (mat.buildup[k]) bu.append(el('div', { class:'st-layer' }, `<span class="ly">${lab}</span><span class="lv">${mat.buildup[k]}</span>`)); });
      wrap.append(bu);
    }
    return wrap;
  }

  function buildSpecCard(slug){
    const mat = manBySlug(slug); if (!mat) return el('div');
    const nameEn = (DATA.manifestLabelsEn && DATA.manifestLabelsEn[slug]) || mat.label_ru;
    const card = el('div', { class:'st-speccard' });
    card.append(el('div', { class:'scn' }, L === 'ru' ? mat.label_ru : nameEn));
    const meta = [mat.spec.thk, (mat.badges || []).slice(0, 3).join(' · ')].filter(Boolean).join(' · ');
    card.append(el('div', { class:'scmeta' }, meta));
    const sp = (DATA.salesPage && DATA.salesPage[slug]) || 'floors.html';
    card.append(el('a', { href: sp }, (L === 'ru' ? 'Спека и применение →' : 'Spec & uses →')));
    return card;
  }

  /* labeled in-panel material picker — the persona's curated floors, brand-styled
     (the top engine chips are cryptic); drives the engine via the existing floor chips */
  function buildMaterials(p){
    const wrap = el('div');
    wrap.append(el('div', { class:'st-sect-h' }, t('material')));
    const row = el('div', { class:'st-matrow' });
    (p.floors || []).forEach(fl => {
      const b = el('button', { class:'st-matchip' + (curFloor() === fl ? ' on' : '') }, tx(DATA.floorLabels[fl] || { ru:fl }));
      b.onclick = () => { if (curFloor() !== fl) setFloor(fl); };
      row.append(b);
    });
    wrap.append(row);
    return wrap;
  }

  function buildScene(p){
    const wrap = el('div');
    // lighting scenarios
    wrap.append(el('div', { class:'st-sect-h' }, t('light')));
    const lr = el('div', { class:'st-pillrow' });
    LIGHT_OPTS.forEach(o => { const b = el('button', { class:'st-pill' + (STATE.light === o.id ? ' on' : '') }, o[L] || o.ru);
      b.onclick = () => { const r = window.__room; if (r && r.setLighting) r.setLighting(o.id); STATE.light = o.id; $$('.st-pill', lr).forEach(x => x.classList.remove('on')); b.classList.add('on'); track('light', { light:o.id }); writeURL(); };
      lr.append(b); });
    wrap.append(lr);
    // live time-of-day slider (arcs the sun: morning → noon → evening)
    const tod = el('div', { class:'st-tod' });
    const tr = el('input', { type:'range', min:'0', max:'1', step:'0.02', value:String(STATE.sun), class:'st-tod-range', 'aria-label': L === 'ru' ? 'Время дня' : 'Time of day' });
    tr.oninput = () => { const r = window.__room; if (r && r.setSunTime) r.setSunTime(+tr.value); STATE.sun = +tr.value; };
    tr.onchange = () => { writeURL(); track('suntime', { t:STATE.sun }); };
    tod.append(el('span', { class:'st-tod-l' }, L === 'ru' ? 'Утро' : 'AM'), tr, el('span', { class:'st-tod-l' }, L === 'ru' ? 'Вечер' : 'PM'));
    wrap.append(tod);
    // interior style — re-skins woods/upholstery/metal (materials only); the signal accent stays locked
    if (window.__room && window.__room.setStyle){
      wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Стиль интерьера' : 'Interior style'));
      const STYLE_OPTS = [{ id:'warm', ru:'Тёплый', en:'Warm' },{ id:'scandi', ru:'Сканди', en:'Scandi' },{ id:'loft', ru:'Лофт', en:'Loft' },{ id:'minimal', ru:'Минимал', en:'Minimal' },{ id:'modern', ru:'Модерн', en:'Modern' }];
      const styRow = el('div', { class:'st-pillrow' });
      STYLE_OPTS.forEach(o => { const b = el('button', { class:'st-pill' + (STATE.style === o.id ? ' on' : '') }, L === 'ru' ? o.ru : o.en);
        b.onclick = () => { const r = window.__room; if (r && r.setStyle) r.setStyle(o.id); STATE.style = o.id; $$('.st-pill', styRow).forEach(x => x.classList.remove('on')); b.classList.add('on'); track('style', { style:o.id }); writeURL(); };
        styRow.append(b); });
      wrap.append(styRow);
    }
    // human-scale figure toggle
    const figRow = el('div', { class:'st-pillrow', style:'margin-top:6px' });
    const fig = el('button', { class:'st-pill' + (STATE.figure ? ' on' : '') }, L === 'ru' ? 'Фигура для масштаба' : 'Scale figure');
    fig.onclick = () => { STATE.figure = !STATE.figure; const r = window.__room; if (r && r.scaleFigure) r.scaleFigure(STATE.figure); fig.classList.toggle('on', STATE.figure); track('figure', { on:STATE.figure }); };
    figRow.append(fig);
    // life-size aggregate scale — only meaningful where the floor has chips
    if (hasChips(curFloor())){
      const cs = el('button', { class:'st-pill' + (STATE.realChip ? ' on' : ''), title: L === 'ru' ? 'Чипы в реальном размере' : 'Aggregate at true size' }, L === 'ru' ? 'Реальный размер чипа' : 'Life-size chips');
      cs.onclick = () => { STATE.realChip = !STATE.realChip; if (STATE.realChip) captureArtRepeat(); applyChipScale(); cs.classList.toggle('on', STATE.realChip); track('chipscale', { on:STATE.realChip }); writeURL(); };
      figRow.append(cs);
    }
    wrap.append(figRow);
    // arrange — move & rotate furniture (engine edit mode; toolbar appears on the selected piece)
    if (window.__room && window.__room.setEditMode){
      wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Расстановка' : 'Arrange'));
      const er = el('div', { class:'st-pillrow' });
      const eb = el('button', { class:'st-pill' + (STATE.edit ? ' on' : '') }, L === 'ru' ? 'Двигать мебель' : 'Move furniture');
      eb.onclick = () => { STATE.edit = !STATE.edit; const r = window.__room; if (r && r.setEditMode) r.setEditMode(STATE.edit); eb.classList.toggle('on', STATE.edit); track('edit', { on:STATE.edit }); };
      er.append(eb);
      const rb = el('button', { class:'st-pill' }, L === 'ru' ? 'Сбросить расстановку' : 'Reset layout');
      rb.onclick = () => { const r = window.__room; if (r && r.resetTransforms) r.resetTransforms(); STATE.tf[STATE.room] = []; writeURL(); track('edit_reset'); };
      er.append(rb);
      wrap.append(er);
      wrap.append(el('div', { class:'st-hint' }, L === 'ru' ? 'Включите и коснитесь предмета: тяните по полу, поворот — кнопками.' : 'Toggle on, tap a piece: drag on the floor, rotate with the buttons.'));
    }
    const rs = buildRoomSize(); if (rs) wrap.append(rs);
    // walls — material (микроцемент / бетон / резина) + palette + design, per wall or all (mirrors the floor)
    if (window.__room && window.__room.setWall){
      wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Стены' : 'Walls'));
      let wallTarget = 'all';
      const WALL_SEL = [{ id:'all', ru:'Все', en:'All' },{ id:'left', ru:'Левая', en:'Left' },{ id:'right', ru:'Правая', en:'Right' },{ id:'back', ru:'Задняя', en:'Back' },{ id:'window', ru:'Окно', en:'Window' }];
      const WALL_MATS_UI = [{ id:'microcement', ru:'Микроцемент', en:'Microcement' },{ id:'concrete', ru:'Бетон', en:'Concrete' },{ id:'rubber', ru:'Резина', en:'Rubber' }];
      const curWall = () => STATE.walls[wallTarget === 'all' ? 'back' : wallTarget];
      const targets = () => wallTarget === 'all' ? WALL_SIDES : [wallTarget];
      const selRow = el('div', { class:'st-pillrow' });
      WALL_SEL.forEach((o, i) => { const b = el('button', { class:'st-pill st-wallsel' + (i === 0 ? ' on' : '') }, L === 'ru' ? o.ru : o.en);
        b.onclick = () => { wallTarget = o.id; $$('.st-wallsel', selRow).forEach(x => x.classList.remove('on')); b.classList.add('on'); renderWalls(); };
        selRow.append(b); });
      wrap.append(selRow);
      const wbox = el('div'); wrap.append(wbox);
      function renderWalls(){
        wbox.innerHTML = ''; const r = window.__room; const cw = curWall();
        // material
        const mr = el('div', { class:'st-pillrow' });
        WALL_MATS_UI.forEach(o => { const b = el('button', { class:'st-pill' + (cw.m === o.id ? ' on' : '') }, L === 'ru' ? o.ru : o.en);
          b.onclick = () => { targets().forEach(wk => { r.setWall(wk, o.id); if (STATE.walls[wk].c){ const co = colorOpts().find(x => x.id === STATE.walls[wk].c); if (co && co.hex) r.setWallColor(wk, co.hex); } STATE.walls[wk] = { m:o.id, c:STATE.walls[wk].c, d:null }; }); track('wall_mat', { wall:wallTarget, mat:o.id }); writeURL(); renderWalls(); };
          mr.append(b); });
        wbox.append(mr);
        // colour palette
        wbox.append(el('div', { class:'st-mini-h' }, L === 'ru' ? 'Цвет' : 'Colour'));
        const cg = el('div', { class:'st-swatches' });
        colorOpts().forEach(o => { const sw = el('button', { class:'st-swatch' + ((cw.c || 'orig') === o.id ? ' on' : '') + (o.hex ? '' : ' st-swatch-orig'), title: tx(o.name), 'aria-label': tx(o.name) });
          if (o.hex) sw.style.background = o.hex;
          sw.onclick = () => { targets().forEach(wk => { r.setWallColor(wk, o.hex || 'orig'); STATE.walls[wk].c = o.hex ? o.id : null; }); track('wall_color', { wall:wallTarget, c:o.id }); writeURL(); renderWalls(); };
          cg.append(sw); });
        wbox.append(cg);
        // design variants for the current material (microtopping / decorative-concrete / rubber patterns)
        const dz = wallDesigns(cw.m);
        if (dz.length){
          wbox.append(el('div', { class:'st-mini-h' }, L === 'ru' ? 'Дизайн' : 'Pattern'));
          const dg = el('div', { class:'st-swatches' });
          const so = el('button', { class:'st-swatch st-swatch-orig' + (!cw.d ? ' on' : ''), title: L === 'ru' ? 'Оригинал' : 'Original', 'aria-label': L === 'ru' ? 'Оригинал' : 'Original' });
          so.onclick = () => { targets().forEach(wk => { r.setWallDesign(wk, 'orig'); STATE.walls[wk].d = null; }); writeURL(); renderWalls(); };
          dg.append(so);
          dz.forEach(v => { const sw = el('button', { class:'st-swatch' + (cw.d === v.id ? ' on' : ''), title: v.name, 'aria-label': v.name });
            if (v.hex) sw.style.background = v.hex;
            sw.onclick = () => { targets().forEach(wk => { r.setWallDesign(wk, '3d-assets/' + v.file); STATE.walls[wk].d = v.id; }); track('wall_design', { wall:wallTarget, d:v.id }); writeURL(); renderWalls(); };
            dg.append(sw); });
          wbox.append(dg);
        }
      }
      renderWalls();
    }
    return wrap;   // floor Цвет/RAL + Дизайн + Покрытие moved up to buildFloorOpts (right under Материал)
  }

  /* floor surface options — colour / RAL + design pattern + finish. Placed right under the
     Материал picker so the floor's own controls aren't buried below the Стены section. */
  function buildFloorOpts(p){
    const wrap = el('div');
    // colour / RAL (skip for warehouse — industrial)
    if (p.id !== 'warehouse'){
      wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Цвет / RAL' : 'Colour / RAL'));
      const cg = el('div', { class:'st-swatches' });
      colorOpts().forEach(o => { const sw = el('button', { class:'st-swatch' + (STATE.ctl.color === o.id ? ' on' : ''), title: tx(o.name), 'aria-label': tx(o.name) });
        if (o.hex) sw.style.background = o.hex; else sw.classList.add('st-swatch-orig');
        sw.onclick = () => { applyColor(o.id); $$('.st-swatch', cg).forEach(x => x.classList.remove('on')); sw.classList.add('on'); writeURL(); };
        cg.append(sw); });
      wrap.append(cg);
    }
    // design variants (real-floor patterns) — shown when the current floor has them
    const dz = designsFor(curFloor());
    if (dz.length){
      wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Дизайн' : 'Pattern'));
      const dg = el('div', { class:'st-swatches' });
      const origOn = (!STATE.ctl.design || STATE.ctl.design === 'orig');
      const so = el('button', { class:'st-swatch st-swatch-orig' + (origOn ? ' on' : ''), title: L === 'ru' ? 'Оригинал' : 'Original', 'aria-label': L === 'ru' ? 'Оригинал' : 'Original' });
      so.onclick = () => { STATE.ctl.design = 'orig'; setFloor(curFloor()); };   // full reload → floor listener re-renders panel
      dg.append(so);
      dz.forEach(v => { const sw = el('button', { class:'st-swatch' + (STATE.ctl.design === v.id ? ' on' : ''), title: v.name, 'aria-label': v.name });
        if (v.hex) sw.style.background = v.hex;
        sw.onclick = () => { applyDesign(v); $$('.st-swatch', dg).forEach(x => x.classList.remove('on')); sw.classList.add('on'); track('design', { d:v.id }); writeURL(); };
        dg.append(sw); });
      wrap.append(dg);
    }
    // finish — surface sheen (drives the engine #finishCtl: satin / polished / matte), moved off the bottom bar
    wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Покрытие' : 'Finish'));
    const FINISH_OPTS = [{ id:'satin', ru:'Сатин', en:'Satin' },{ id:'polished', ru:'Полировка', en:'Polished' },{ id:'matte', ru:'Мат', en:'Matte' }];
    const fr = el('div', { class:'st-pillrow' });
    FINISH_OPTS.forEach(o => { const b = el('button', { class:'st-pill' + (STATE.finish === o.id ? ' on' : '') }, L === 'ru' ? o.ru : o.en);
      b.onclick = () => { setFinish(o.id); STATE.finish = o.id; $$('.st-pill', fr).forEach(x => x.classList.remove('on')); b.classList.add('on'); track('finish', { f:o.id }); writeURL(); };
      fr.append(b); });
    wrap.append(fr);
    return wrap;
  }

  /* parametric room size — drives engine setRoomDims (default 12×8×3.2 path untouched) */
  function buildRoomSize(){
    const r = window.__room; if (!r || !r.setRoomDims) return null;
    const def = r.DIM_DEFAULT || { w:12, d:8, h:3.2 };
    const cur = STATE.dims || (r.getDims ? r.getDims() : def);
    const wrap = el('div');
    wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Размер комнаты, м' : 'Room size, m'));
    const mk = (id, v) => el('input', { id, type:'number', step:'0.5', min:'2', max:'13', value:String(v), inputmode:'decimal', 'aria-label':id });
    const iw = mk('stDimW', cur.w), idp = mk('stDimD', cur.d), ih = mk('stDimH', cur.h);
    const row = el('div', { class:'st-dims' });
    row.append(iw, el('span', { class:'st-dimx' }, '×'), idp, el('span', { class:'st-dimx' }, '×'), ih);
    wrap.append(row);
    const acts = el('div', { class:'st-pillrow', style:'margin-top:8px' });
    const apply = el('button', { class:'st-pill on' }, L === 'ru' ? 'Применить' : 'Apply');
    apply.onclick = () => setDims(+iw.value, +idp.value, +ih.value);
    const reset = el('button', { class:'st-pill' }, L === 'ru' ? 'Сбросить' : 'Reset');
    reset.onclick = () => setDims(def.w, def.d, def.h, true);
    acts.append(apply, reset); wrap.append(acts);
    wrap.append(el('div', { class:'st-dimhint' }, L === 'ru' ? 'Стены, сетка маяков и свет подстроятся под ваши размеры.' : 'Walls, divider grid and light adapt to your room.'));
    if (STATE.dims){
      const a = STATE.dims.w * STATE.dims.d;
      const nx = Math.ceil(STATE.dims.w / 3), nz = Math.ceil(STATE.dims.d / 3);
      const lin = (nx - 1) * STATE.dims.d + (nz - 1) * STATE.dims.w;
      const parts = [(L === 'ru' ? 'Площадь ' : 'Area ') + a.toFixed(1) + ' м²'];
      if (needsDividers(curFloor()) && lin > 0) parts.push((L === 'ru' ? 'маяки ~' : 'dividers ~') + lin.toFixed(0) + (L === 'ru' ? ' пог.м' : ' lin.m'));
      wrap.append(el('div', { class:'st-dimcalc' }, parts.join('  ·  ')));
    }
    return wrap;
  }
  function setDims(w, d, h, isReset){
    const r = window.__room; if (!r || !r.setRoomDims) return;
    r.setRoomDims(w, d, h);
    const g = r.getDims ? r.getDims() : { w, d, h };
    const def = r.DIM_DEFAULT || { w:12, d:8, h:3.2 };
    const isDef = !!isReset || (g.w === def.w && g.d === def.d && g.h === def.h);
    STATE.dims = isDef ? null : g;
    if (!isDef) STATE.figure = true;   // custom room auto-shows the 1.7 m figure for scale
    applyTf(STATE.room); applyWalls();   // M3: shell rebuilt at new dims → re-apply arrangement + recompute wall texture repeat for the new footprint
    track('roomdims', STATE.dims || { reset:true }); writeURL(); renderPanel();
  }

  function buildPains(p){
    const wrap = el('div'); wrap.append(el('div', { class:'st-sect-h' }, t('pains_title')));
    const list = el('div', { class:'st-pains' });
    (p.pains || []).forEach(pn => { list.append(el('div', { class:'st-pain' }, `<div class="q">${tx(pn.q)}</div><div class="a">${tx(pn.a)}</div>`)); });
    wrap.append(list); return wrap;
  }

  /* ═══════════ calculator (price lives here only) ═══════════ */
  function buildCalc(p, mat){
    const wrap = el('div'); wrap.append(el('div', { class:'st-sect-h' }, t('calc_title')));
    const box = el('div', { class:'st-calc' });
    const field = (id, label, type, val, ph) => { const f = el('div', { class:'st-field' });
      f.append(el('label', {}, label));
      f.append(el('input', { id, type: type || 'number', value: val != null ? val : '', placeholder: ph || '', inputmode:'numeric' })); return f; };
    const selField = (id, label, opts) => { const f = el('div', { class:'st-field' }); f.append(el('label', {}, label));
      const s = el('select', { id }); opts.forEach(([v, lab]) => s.append(el('option', { value:v }, lab))); f.append(s); return f; };

    const defArea = STATE.dims ? Math.max(1, Math.round(STATE.dims.w * STATE.dims.d)) : 60;
    box.append(field('stArea', t('calc_area'), 'number', defArea, String(defArea)));
    if (p.calc === 'downtime'){
      box.append(field('stRate', t('calc_days'), 'number', 12000, '12000'));
    } else if (p.calc === 'industrial'){
      box.append(field('stLoad', t('calc_load'), 'number', 3, '3'));
      const row = el('div', { class:'st-toggle-row' });
      row.append(selField('stOld', t('calc_oldfloor'), [['no', t('no')], ['yes', t('yes')]]));
      row.append(selField('stNight', t('calc_night'), [['no', t('no')], ['yes', t('yes')]]));
      box.append(row);
    }
    const run = el('button', { class:'st-calc-run' }, t('calc_run')); box.append(run);
    const out = el('div', { class:'st-calc-out', id:'stCalcOut' }); box.append(out);
    box.append(el('div', { class:'st-calc-note' }, t('calc_note')));
    run.onclick = () => runCalc(p, mat);
    wrap.append(box); return wrap;
  }

  function runCalc(p, mat){
    const out = $('#stCalcOut'); if (!out) return;
    const area = Math.max(1, +($('#stArea') || {}).value || 0);
    const [lo, hi] = priceBand(mat);
    let loT = lo * area, hiT = hi * area, extra = '';
    if (p.calc === 'industrial'){
      if (($('#stOld') || {}).value === 'yes'){ loT *= 1.15; hiT *= 1.18; }
      if (($('#stNight') || {}).value === 'yes'){ loT *= 1.12; hiT *= 1.12; }
      const load = +($('#stLoad') || {}).value || 0;
      extra = (L === 'ru' ? `Нагрузка ~${load} т — подтверждается спекой системы.` : `Load ~${load} t — confirmed by the system spec.`);
    }
    if (p.calc === 'downtime'){
      const days = cureDays(mat); const rate = +($('#stRate') || {}).value || 0;
      extra = (L === 'ru' ? `${t('calc_downtime')}: ~${days} дн · потери ~${fmt(days * rate)}` : `${t('calc_downtime')}: ~${days} d · loss ~${fmt(days * rate)}`);
    }
    out.innerHTML = `<div class="lbl">${t('calc_result')}</div><div class="big">${fmt(loT)} – ${fmt(hiT)}</div>` + (extra ? `<div class="extra">${extra}</div>` : '');
    out.classList.add('show');
    track('calc', { kpi:'calculator-completed' });
  }

  /* ═══════════ CTA (lead) ═══════════ */
  function renderCta(){
    const p = persona(); const box = $('#stCta'); box.innerHTML = '';
    box.append(ctaEl(p.cta.primary, 'st-cta-primary'));
    if (p.cta.secondary) box.append(ctaEl(p.cta.secondary, 'st-cta-secondary'));
  }
  function ctaEl(c, cls){
    if (c.type === 'print'){ const b = el('button', { class:cls }, tx(c.label)); b.onclick = () => { track('lead', { channel:'print' }); doPrint(); }; return b; }
    if (c.type === 'mailto'){ const a = el('a', { class:cls, href:`mailto:${MAIL}` }, tx(c.label)); a.addEventListener('click', () => { track('lead', { channel:'mailto' }); postLead('mailto'); }); return a; }
    // whatsapp
    const a = el('a', { class:cls, target:'_blank', rel:'noopener' }, tx(c.label));
    a.href = waURL(c); a.dataset.role = 'wa';
    a.addEventListener('click', () => { track('lead', { channel:'whatsapp' }); postLead('whatsapp'); });
    return a;
  }
  function waURL(c){
    const p = persona(); const fl = curFloor(); const mat = manFor(fl);
    const matName = tx(DATA.floorLabels[fl] || { ru:fl });
    const parts = [ tx(c.wa) || '', `${t('material')}: ${matName}`, `${t('room')}: ${STATE.room}`, shareURL() ];
    const txt = encodeURIComponent(parts.filter(Boolean).join('\n'));
    return `https://wa.me/${WA}?text=${txt}`;
  }

  /* ═══════════ deep-link ═══════════ */
  function shareURL(){
    const u = new URL(location.href); u.search = '';
    u.searchParams.set('avatar', STATE.avatar);
    u.searchParams.set('m', curFloor());
    u.searchParams.set('room', STATE.room);
    u.searchParams.set('finish', STATE.finish);
    u.searchParams.set('view', STATE.view);
    u.searchParams.set('light', STATE.light);
    if (STATE.ctl && STATE.ctl.color && STATE.ctl.color !== 'orig') u.searchParams.set('c', STATE.ctl.color);
    if (STATE.realChip) u.searchParams.set('cs', '1');
    if (STATE.dims) u.searchParams.set('dims', STATE.dims.w + 'x' + STATE.dims.d + 'x' + STATE.dims.h);
    if (STATE.ctl.design && STATE.ctl.design !== 'orig') u.searchParams.set('d', STATE.ctl.design);
    if (STATE.sun !== 0.4) u.searchParams.set('sun', String(STATE.sun));
    { const tf = STATE.tf[STATE.room]; if (tf && tf.length) u.searchParams.set('tf', encTf(tf)); }
    if (STATE.style && STATE.style !== 'warm') u.searchParams.set('st', STATE.style);
    { const wl = encWalls(); if (wl) u.searchParams.set('walls', wl); }
    return u.toString();
  }
  function writeURL(){ try { history.replaceState(null, '', shareURL()); } catch(e){} }
  function readURL(){
    const q = new URLSearchParams(location.search);
    if (q.get('avatar')) STATE.avatar = q.get('avatar');
    if (q.get('m')) STATE.m = q.get('m');
    if (q.get('room')) STATE.room = q.get('room');
    if (q.get('finish')) STATE.finish = q.get('finish');
    if (q.get('view')) STATE.view = q.get('view');
    if (q.get('light')) STATE.light = q.get('light');
    if (q.get('c')) STATE.ctl.color = q.get('c');
    if (q.get('cs')) STATE.realChip = true;
    const dm = q.get('dims'); if (dm){ const a = dm.split('x').map(Number); if (a.length === 3 && a.every(n => n > 0)) STATE.dims = { w:a[0], d:a[1], h:a[2] }; }
    if (q.get('d')) STATE.ctl.design = q.get('d');
    if (q.get('sun') != null){ const s = parseFloat(q.get('sun')); if (!isNaN(s)) STATE.sun = Math.max(0, Math.min(1, s)); }
    if (q.get('tf')) STATE.tf[STATE.room] = decTf(q.get('tf'));   // for the deep-linked room
    if (q.get('st')) STATE.style = q.get('st');
    if (q.get('walls')) decWalls(q.get('walls'));
  }
  async function share(){
    const url = shareURL();
    try { await navigator.clipboard.writeText(url); } catch(e){ writeURL(); }
    toast(t('share_done'));
  }
  function toast(msg){ const tt = $('#stToast'); tt.textContent = msg; tt.classList.add('show'); setTimeout(() => tt.classList.remove('show'), 1800); }

  /* ═══════════ language ═══════════ */
  function setLang(lg){ L = lg; localStorage.setItem('floordsgn_lang', lg); document.documentElement.lang = lg; renderAll(); }
  function renderAll(){
    $$('.st-lang button').forEach(b => b.classList.toggle('on', b.dataset.lg === L));
    $('#stShare').textContent = t('share');
    const bl = $('#stBoardBtn .bl'); if (bl) bl.textContent = L === 'ru' ? 'Доска' : 'Board';
    updateBoardCount();
    const p = persona(); $('#stPersonaName').textContent = tx(p.name);
    if ($('#stChooser').classList.contains('show')) renderChooser();
    renderPanel(); renderCta();
  }

  /* ═══════════ snapshot / board / compare / print (M3) ═══════════ */
  function snapshot(){ try { const c = window.__room && window.__room.renderer && window.__room.renderer.domElement; return c ? c.toDataURL('image/jpeg', 0.6) : ''; } catch(e){ return ''; } }
  function downloadFrame(){   // save the current 3D view as a PNG (full canvas resolution)
    const c = window.__room && window.__room.renderer && window.__room.renderer.domElement; if (!c) return;
    try { const a = el('a', { href: c.toDataURL('image/png'), download: 'floordsgn-' + curFloor() + '-' + STATE.room + '.png' }); document.body.append(a); a.click(); a.remove(); track('frame', { m: curFloor(), room: STATE.room }); toast(L === 'ru' ? 'Кадр сохранён' : 'Frame saved'); } catch(e){}
  }

  function boardGet(){ try { return JSON.parse(localStorage.getItem('floordsgn_board') || '[]'); } catch(e){ return []; } }
  function boardSet(a){ localStorage.setItem('floordsgn_board', JSON.stringify(a.slice(-12))); updateBoardCount(); }
  function boardSave(){ const fl = curFloor(); const arr = boardGet();
    arr.push({ url: shareURL(), name: tx(DATA.floorLabels[fl] || { ru:fl }), thumb: snapshot(), ts: 0 });
    boardSet(arr); toast(L === 'ru' ? 'Добавлено в доску' : 'Added to board'); track('save', {}); }
  function updateBoardCount(){ const b = $('#stBoardBtn .cnt'); if (b){ const n = boardGet().length; b.textContent = n ? '(' + n + ')' : ''; } }
  function boardOpen(){
    const arr = boardGet(); const grid = $('#stBoardGrid'); grid.innerHTML = '';
    $('#stBoardTitle').textContent = L === 'ru' ? 'Моя доска' : 'My board';
    if (!arr.length) grid.append(el('div', { class:'st-empty' }, L === 'ru' ? 'Пусто. Жмите «+ Сохранить», чтобы собрать подборку.' : 'Empty. Hit "+ Save" to collect picks.'));
    arr.slice().reverse().forEach((it, ri) => { const i = arr.length - 1 - ri;
      const card = el('div', { class:'st-bcard' });
      if (it.thumb) card.append(el('img', { src: it.thumb, alt: it.name }));
      card.append(el('div', { class:'st-bcard-n' }, it.name));
      const row = el('div', { class:'st-bcard-row' });
      const open = el('button', { class:'st-bcard-open' }, L === 'ru' ? 'Открыть' : 'Open'); open.onclick = () => { location.href = it.url; };
      const del = el('button', { class:'st-bcard-del', 'aria-label':'Удалить / Remove' }, '×'); del.onclick = () => { const a = boardGet(); a.splice(i, 1); boardSet(a); boardOpen(); };
      row.append(open, del); card.append(row); grid.append(card); });
    const pb = $('#stBoardPrint'); if (pb){ pb.style.display = arr.length ? 'block' : 'none'; pb.textContent = L === 'ru' ? 'Скачать подборку PDF' : 'Download selection PDF'; }
    $('#stBoardModal').classList.add('show');
  }

  /* render helpers for visual A/B — single engine, so capture floors sequentially */
  function rafWait(n){ n = n || 2; return new Promise(res => { let i = 0; const tick = () => { if (++i >= n) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }); }
  function texReady(){ return new Promise(res => { let n = 0; const chk = () => { const ms = floorMaps(); const im = ms[0] && ms[0].image; const ok = im && im.complete !== false && (im.naturalWidth === undefined || im.naturalWidth > 0); if (ok || ++n > 45) res(); else setTimeout(chk, 30); }; chk(); }); }
  async function renderFloorShot(slug){ setFloor(slug); await texReady(); const r = window.__room; if (r && r.bake) r.bake(); await rafWait(3); return snapshot(); }

  function buildCmpTable(p){
    const slugs = [], seen = {};
    p.floors.forEach(fl => { const ms = DATA.floorMap[fl]; if (ms && !seen[ms]){ seen[ms] = 1; slugs.push(ms); } });
    (p.specCards || []).forEach(s => { if (!seen[s]){ seen[s] = 1; slugs.push(s); } });
    const pick = slugs.slice(0, 4);
    const rows = [['type','Тип','Type'],['thk','Толщина','Thickness'],['base','Основа','Base'],['cure','Готовность','Cure'],['warr','Гарантия','Warranty'],['load','Применение','Use']];
    const tbl = el('table', { class:'st-cmp' });
    const head = el('tr'); head.append(el('th', {}, ''));
    pick.forEach(s => { const m = manBySlug(s); head.append(el('th', {}, m ? (L === 'ru' ? m.label_ru : (DATA.manifestLabelsEn[s] || m.label_ru)) : s)); });
    tbl.append(head);
    rows.forEach(([k, ru, en]) => { const tr = el('tr'); tr.append(el('td', { class:'rk' }, L === 'ru' ? ru : en));
      pick.forEach(s => { const m = manBySlug(s); tr.append(el('td', {}, (m && m.spec && m.spec[k]) || '—')); }); tbl.append(tr); });
    const brow = el('tr'); brow.append(el('td', { class:'rk' }, L === 'ru' ? 'Бейджи' : 'Badges'));
    pick.forEach(s => { const m = manBySlug(s); brow.append(el('td', {}, ((m && m.badges) || []).join(' · '))); }); tbl.append(brow);
    return tbl;
  }

  /* before/after wipe slider — drag to compare two floors in the same camera/room/light */
  function buildBASlider(srcA, nameA, srcB, nameB){
    const ba = el('div', { class:'st-ba' });
    const base = el('img', { class:'st-ba-img', src: srcB, alt: nameB, draggable:'false' });
    const top = el('div', { class:'st-ba-top' });
    top.append(el('img', { class:'st-ba-img', src: srcA, alt: nameA, draggable:'false' }));
    const handle = el('div', { class:'st-ba-handle' });
    ba.setAttribute('role', 'slider'); ba.setAttribute('tabindex', '0'); ba.setAttribute('aria-label', (L === 'ru' ? 'Сравнение: ' : 'Compare: ') + nameA + ' / ' + nameB); ba.setAttribute('aria-valuemin', '0'); ba.setAttribute('aria-valuemax', '100');
    ba.append(base, top, handle, el('span', { class:'st-ba-lab st-ba-lab-l' }, nameA), el('span', { class:'st-ba-lab st-ba-lab-r' }, nameB));
    let split = 50;
    const apply = () => { top.style.clipPath = 'inset(0 ' + (100 - split) + '% 0 0)'; handle.style.left = split + '%'; ba.setAttribute('aria-valuenow', Math.round(split)); };
    const at = (x) => { const r = ba.getBoundingClientRect(); split = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)); apply(); };
    ba.addEventListener('pointerdown', e => { e.preventDefault(); at(e.clientX); const mv = ev => at(ev.clientX); const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); });
    ba.addEventListener('keydown', e => { if (e.key === 'ArrowLeft'){ split = Math.max(0, split - 4); apply(); e.preventDefault(); } else if (e.key === 'ArrowRight'){ split = Math.min(100, split + 4); apply(); e.preventDefault(); } });
    apply();
    return ba;
  }

  async function compareOpen(){
    track('compare', {});
    const p = persona(); const wrap = $('#stCmpWrap'); wrap.innerHTML = '';
    $('#stCmpTitle').textContent = L === 'ru' ? 'Сравнение систем' : 'Compare systems';
    const ef = [], sf = {};   // engine floors (have real 3D)
    p.floors.forEach(fl => { if (REAL_TILE[fl] !== undefined && !sf[fl]){ sf[fl] = 1; ef.push(fl); } });
    let cmpA = ef[0], cmpB = ef[1] || ef[0];
    const lbl = fl => tx(DATA.floorLabels[fl] || { ru:fl });
    const shots = {};   // cache per floor for this session

    if (ef.length >= 2){
      const selRow = el('div', { class:'st-cmp-sel' });
      const mkSel = (val, set) => { const s = el('select', { class:'st-cmp-pick', 'aria-label': L === 'ru' ? 'Пол для сравнения' : 'Floor to compare' });
        ef.forEach(fl => { const o = el('option', { value:fl }, lbl(fl)); if (fl === val) o.selected = true; s.append(o); });
        s.onchange = () => { set(s.value); paint(); }; return s; };
      selRow.append(mkSel(cmpA, v => cmpA = v), el('span', { class:'st-cmp-vs' }, L === 'ru' ? 'и' : 'vs'), mkSel(cmpB, v => cmpB = v));
      wrap.append(selRow);
    }
    const vis = el('div', { class:'st-cmp-vis' });
    if (ef.length >= 2) vis.append(el('div', { class:'st-cmp-spin' }, L === 'ru' ? 'Готовим визуальное сравнение…' : 'Rendering visual compare…'));
    wrap.append(vis);
    wrap.append(buildCmpTable(p));        // spec table is instant
    $('#stCmpModal').classList.add('show');

    async function shotFor(fl){ if (shots[fl]) return shots[fl]; const s = await renderFloorShot(fl); if (s) shots[fl] = s; return s; }
    async function paint(){
      if (ef.length < 2) return;
      comparing = true;
      const orig = curFloor(), origColor = STATE.ctl.color, origReal = STATE.realChip;
      vis.innerHTML = ''; vis.append(el('div', { class:'st-cmp-spin' }, L === 'ru' ? 'Готовим…' : 'Rendering…'));
      try {
        STATE.realChip = false;            // fair A/B: both at art scale
        const a = await shotFor(cmpA), b = await shotFor(cmpB);
        setFloor(orig); await texReady();   // restore the user's exact floor + look
        STATE.realChip = origReal; applyColor(origColor); captureArtRepeat(); if (origReal) applyChipScale();
        const r = window.__room; if (r && r.setDividers) r.setDividers(needsDividers(orig)); if (r && r.bake) r.bake();
        vis.innerHTML = '';
        if (a && b){ vis.append(buildBASlider(a, lbl(cmpA), b, lbl(cmpB)));
          const specRow = el('div', { class:'st-ba-specs' });
          [cmpA, cmpB].forEach(fl => { const m = manFor(fl); const s = (m && m.spec) ? [m.spec.type, m.spec.thk].filter(Boolean).join(' · ') : ''; specRow.append(el('div', { class:'st-ba-spec' }, s)); });
          vis.append(specRow);
          vis.append(el('div', { class:'st-ba-hint' }, L === 'ru' ? 'Перетащите разделитель, чтобы сравнить' : 'Drag the divider to compare')); }
      } catch(e){ vis.innerHTML = ''; }
      await new Promise(r => setTimeout(r, 60));
      comparing = false;
    }
    if (ef.length >= 2) paint();
  }

  function boardPrint(){
    const arr = boardGet(); if (!arr.length) return;
    const host = $('#stPrint'); host.innerHTML = '';
    host.append(el('div', { class:'st-print-brand' }, 'Floor.DSGN Studio'));
    host.append(el('div', { class:'st-print-mat' }, L === 'ru' ? 'Подборка полов' : 'Floor selection'));
    const grid = el('div', { class:'st-print-grid' });
    arr.forEach(it => { const c = el('div', { class:'st-print-cell' });
      if (it.thumb) c.append(el('img', { class:'st-print-cellimg', src: it.thumb, alt: it.name || '' }));
      c.append(el('div', { class:'st-print-celln' }, it.name || ''));
      c.append(el('div', { class:'st-print-cellu' }, it.url || ''));
      grid.append(c); });
    host.append(grid);
    host.append(el('div', { class:'st-print-url' }, 'floordsgn.com · ' + (L === 'ru' ? 'подбор пола в 3D' : '3D floor studio')));
    track('boardprint', { n: arr.length });
    setTimeout(() => window.print(), 90);
  }
  function doPrint(){
    const host = $('#stPrint'); host.innerHTML = '';
    const fl = curFloor(); const mat = manFor(fl);
    host.append(el('div', { class:'st-print-brand' }, 'Floor.DSGN Studio'));
    host.append(el('div', { class:'st-print-mat' }, tx(DATA.floorLabels[fl] || { ru:fl })));
    const img = snapshot(); if (img) host.append(el('img', { class:'st-print-img', src: img }));
    const spec = buildSpec(mat, persona()); if (spec) host.append(spec);
    host.append(el('div', { class:'st-print-url' }, shareURL()));
    setTimeout(() => window.print(), 80);
  }

  function modalEl(id, titleId, bodyId, bodyClass){
    const m = el('div', { class:'st-chooser', id });
    const card = el('div', { class:'st-chooser-card st-modal-card' });
    card.append(el('h2', { id:titleId }), el('div', { class:bodyClass, id:bodyId }));
    const close = el('button', { class:'st-chooser-skip' }, L === 'ru' ? 'Закрыть' : 'Close'); close.onclick = () => m.classList.remove('show');
    card.append(close); m.append(card);
    m.onclick = (e) => { if (e.target === m) m.classList.remove('show'); };
    return m;
  }

  /* one-time onboarding hint (returning / deep-linked users; first-timers get the chooser) */
  function maybeOnboard(){
    try { if (localStorage.getItem('floordsgn_onboard')) return; } catch(e){}
    const box = el('div', { class:'st-onboard' });
    box.append(el('span', {}, L === 'ru' ? 'Выберите материал, комнату и свет — получите расчёт и образец.' : 'Pick a material, room and light — get a quote and a sample.'));
    const close = () => { box.classList.remove('show'); setTimeout(() => box.remove(), 300); try { localStorage.setItem('floordsgn_onboard', '1'); } catch(e){} };
    const x = el('button', { class:'st-onboard-x', 'aria-label': L === 'ru' ? 'Закрыть' : 'Close' }, '×'); x.onclick = close;
    box.append(x); document.body.append(box); requestAnimationFrame(() => box.classList.add('show'));
    setTimeout(close, 9000);
  }

  /* ═══════════ boot ═══════════ */
  async function boot(){
    try {
      [DATA, MAN, DESIGNS] = await Promise.all([
        fetch('3d-assets/studio-personas.json?v=' + ASSET_V).then(r => r.json()),
        fetch('3d-assets/manifest.json?v=' + ASSET_V).then(r => r.json()),
        fetch('3d-assets/textures-v4/_designs/index.json?v=' + ASSET_V).then(r => r.ok ? r.json() : {}).catch(() => ({}))
      ]);
    } catch(e){ console.error('Studio data load failed', e); return; }

    // wait for engine control bar (static HTML, but guard anyway)
    let tries = 0; while (!$('#floorCtl') && tries++ < 50) await new Promise(r => setTimeout(r, 60));

    buildChrome();
    readURL();

    // sync STATE from engine on user clicks
    $$('#floorCtl .chip[data-fl]').forEach(c => c.addEventListener('click', () => setTimeout(() => { if (comparing) return; STATE.m = curFloor(); if (!booting){ applyColor('orig'); STATE.ctl.design = 'orig'; } const r = window.__room; if (r && r.setDividers) r.setDividers(needsDividers(STATE.m)); captureArtRepeat(); if (STATE.realChip) applyChipScale(); renderPanel(); renderCta(); writeURL(); track('floor', { m:STATE.m }); }, 30)));
    $$('#roomCtl .chip[data-rm]').forEach(c => c.addEventListener('click', () => { STATE.room = c.dataset.rm; if (!booting){ STATE.dims = null; renderPanel(); } applyWalls(); applyTf(STATE.room); writeURL(); }));   // engine rebuilt the shell+kit (listener ran first) → re-apply walls (repeat) + this room's arrangement
    $$('#finishCtl button[data-f]').forEach(c => c.addEventListener('click', () => { STATE.finish = c.dataset.f; writeURL(); }));
    $$('#viewCtl .chip[data-v]').forEach(c => c.addEventListener('click', () => { STATE.view = c.dataset.v; writeURL(); }));

    // apply persona: from URL, else stored, else show chooser (default explore underneath)
    const q = new URLSearchParams(location.search);
    const urlFloor = q.get('m'), urlRoom = q.get('room'), urlFinish = q.get('finish'), urlView = q.get('view'), urlLight = q.get('light'), urlColor = q.get('c');
    const stored = localStorage.getItem('floordsgn_avatar');
    const fromURL = q.get('avatar');
    document.documentElement.lang = L;
    if (fromURL){ applyPersona(fromURL); }
    else if (stored){ applyPersona(stored); }
    else { applyPersona('explore'); setTimeout(openChooser, 700); }
    if (fromURL || stored) setTimeout(maybeOnboard, 1400);   // first-timers get the chooser instead

    // apply deep-linked floor/room/finish/view from the URL directly (not STATE,
    // which applyPersona resets to the persona default)
    if (urlFloor) setFloor(urlFloor);
    if (urlRoom) setRoom(urlRoom);
    applyWalls();   // walls after room (per boot order), before style
    if (STATE.style && STATE.style !== 'warm' && window.__room && window.__room.setStyle) window.__room.setStyle(STATE.style);   // style after room, before floor/light/tf
    if (urlFinish) setFinish(urlFinish);
    if (urlView) setView(urlView);
    if (urlLight && window.__room && window.__room.setLighting){ window.__room.setLighting(urlLight); STATE.light = urlLight; }
    if (urlColor) applyColor(urlColor);
    if (q.get('cs')){ STATE.realChip = true; captureArtRepeat(); applyChipScale(); }
    if (STATE.dims && window.__room && window.__room.setRoomDims){ window.__room.setRoomDims(STATE.dims.w, STATE.dims.d, STATE.dims.h); STATE.figure = true; }
    if (STATE.ctl.design && STATE.ctl.design !== 'orig'){ const v = designsFor(curFloor()).find(x => x.id === STATE.ctl.design); if (v) applyDesign(v); }
    if (q.get('sun') != null && window.__room && window.__room.setSunTime) window.__room.setSunTime(STATE.sun);

    // furniture edit: snapshot moved pieces on every drag/rotate settle (engine fires onEdit)
    if (window.__room && window.__room.onEdit) window.__room.onEdit(mv => { STATE.tf[STATE.room] = (mv || []).filter(m => m.moved); writeURL(); });
    applyTf(STATE.room);   // transforms LAST in boot, after setRoom/dims (re-applied on later room switches)

    setLang(L); // paints chrome text + panel
    setTimeout(() => { booting = false; }, 300); // deep-link applied; resume colour-reset on floor change
    window.__studio = { applyPersona, setLang, STATE, openChooser }; // QA hook
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
