/* ═══════════════ FloorDSGN Studio — persona controller ═══════════════
   Overlay on the floor-room 3D engine. Drives the engine ONLY through the
   existing control chips (#floorCtl/#roomCtl/#finishCtl/#viewCtl) and the
   read-only window.__room API. The engine never imports this file. */
(() => {
  'use strict';
  const WA = '972559661459';
  const MAIL = 'floors.dsgn@gmail.com';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, attrs = {}, html) => { const n = document.createElement(tag);
    for (const k in attrs){ if (k === 'class') n.className = attrs[k]; else if (k === 'html') n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html; return n; };

  let DATA = null, MAN = null;            // personas.json, manifest.json
  let booting = true;                      // suppress floor-change colour reset during deep-link boot
  let L = localStorage.getItem('floordsgn_lang') || 'ru';
  if (L !== 'ru' && L !== 'en') L = 'ru';
  const STATE = { avatar:'explore', m:'micro', room:'living', finish:'satin', view:'hall', light:'golden', ctl:{ color:'orig' } };
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

  /* ---------- engine seam: drive via existing chips ---------- */
  const clickChip = (sel) => { const b = $(sel); if (b) b.click(); };
  const setFloor  = (slug) => clickChip(`#floorCtl .chip[data-fl="${slug}"]`);
  const setRoom   = (rm)   => clickChip(`#roomCtl .chip[data-rm="${rm}"]`);
  const setFinish = (f)    => clickChip(`#finishCtl button[data-f="${f}"]`);
  const setView   = (v)    => clickChip(`#viewCtl .chip[data-v="${v}"]`);
  const curFloor  = () => { const on = $('#floorCtl .chip.on[data-fl]'); return on ? on.dataset.fl : STATE.m; };

  const persona = () => DATA.personas.find(p => p.id === STATE.avatar) || DATA.personas[0];
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
    chooser.append(card); document.body.append(chooser);

    // board + compare modals + print host (M3)
    document.body.append(modalEl('stBoardModal', 'stBoardTitle', 'stBoardGrid', 'st-bgrid'));
    document.body.append(modalEl('stCmpModal', 'stCmpTitle', 'stCmpWrap', 'st-cmpwrap'));
    document.body.append(el('div', { class:'st-print', id:'stPrint' }));

    // panel
    const panel = el('div', { class:'st-panel', id:'stPanel' });
    panel.append(el('div', { class:'st-panel-scroll', id:'stScroll' }), el('div', { class:'st-cta', id:'stCta' }));
    document.body.append(panel);
    const toggle = el('button', { class:'st-panel-toggle', id:'stToggle' }, '☰'); // hidden on desktop via CSS
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
    applyColor('orig');

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
    acts.append(bSave, bCmp); scroll.append(acts);

    // suitability gate (restaurant: microcement not for kitchens)
    if (p.suitabilityGate && p.suitability){
      const gate = el('div', { class:'st-gate' + (p.suitability.blocked.includes(fl) ? ' show' : '') }, tx(p.suitability.msg));
      scroll.append(gate);
    }

    scroll.append(buildScene(p));   // lighting + colour

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

  function buildScene(p){
    const wrap = el('div');
    // lighting scenarios
    wrap.append(el('div', { class:'st-sect-h' }, t('light')));
    const lr = el('div', { class:'st-pillrow' });
    LIGHT_OPTS.forEach(o => { const b = el('button', { class:'st-pill' + (STATE.light === o.id ? ' on' : '') }, o[L] || o.ru);
      b.onclick = () => { const r = window.__room; if (r && r.setLighting) r.setLighting(o.id); STATE.light = o.id; $$('.st-pill', lr).forEach(x => x.classList.remove('on')); b.classList.add('on'); writeURL(); };
      lr.append(b); });
    wrap.append(lr);
    // colour / RAL (skip for warehouse — industrial)
    if (p.id !== 'warehouse'){
      wrap.append(el('div', { class:'st-sect-h' }, L === 'ru' ? 'Цвет / RAL' : 'Colour / RAL'));
      const cg = el('div', { class:'st-swatches' });
      colorOpts().forEach(o => { const sw = el('button', { class:'st-swatch' + (STATE.ctl.color === o.id ? ' on' : ''), title: tx(o.name) });
        if (o.hex) sw.style.background = o.hex; else sw.classList.add('st-swatch-orig');
        sw.onclick = () => { applyColor(o.id); $$('.st-swatch', cg).forEach(x => x.classList.remove('on')); sw.classList.add('on'); writeURL(); };
        cg.append(sw); });
      wrap.append(cg);
    }
    return wrap;
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

    box.append(field('stArea', t('calc_area'), 'number', 60, '60'));
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
  }

  /* ═══════════ CTA (lead) ═══════════ */
  function renderCta(){
    const p = persona(); const box = $('#stCta'); box.innerHTML = '';
    box.append(ctaEl(p.cta.primary, 'st-cta-primary'));
    if (p.cta.secondary) box.append(ctaEl(p.cta.secondary, 'st-cta-secondary'));
  }
  function ctaEl(c, cls){
    if (c.type === 'print'){ const b = el('button', { class:cls }, tx(c.label)); b.onclick = doPrint; return b; }
    if (c.type === 'mailto'){ const a = el('a', { class:cls, href:`mailto:${MAIL}` }, tx(c.label)); return a; }
    // whatsapp
    const a = el('a', { class:cls, target:'_blank', rel:'noopener' }, tx(c.label));
    a.href = waURL(c); a.dataset.role = 'wa';
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

  function boardGet(){ try { return JSON.parse(localStorage.getItem('floordsgn_board') || '[]'); } catch(e){ return []; } }
  function boardSet(a){ localStorage.setItem('floordsgn_board', JSON.stringify(a.slice(-12))); updateBoardCount(); }
  function boardSave(){ const fl = curFloor(); const arr = boardGet();
    arr.push({ url: shareURL(), name: tx(DATA.floorLabels[fl] || { ru:fl }), thumb: snapshot(), ts: 0 });
    boardSet(arr); toast(L === 'ru' ? 'Добавлено в доску' : 'Added to board'); }
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
      const del = el('button', { class:'st-bcard-del' }, '×'); del.onclick = () => { const a = boardGet(); a.splice(i, 1); boardSet(a); boardOpen(); };
      row.append(open, del); card.append(row); grid.append(card); });
    $('#stBoardModal').classList.add('show');
  }

  function compareOpen(){
    const p = persona(); const wrap = $('#stCmpWrap'); wrap.innerHTML = '';
    $('#stCmpTitle').textContent = L === 'ru' ? 'Сравнение систем' : 'Compare systems';
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
    wrap.append(tbl); $('#stCmpModal').classList.add('show');
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

  /* ═══════════ boot ═══════════ */
  async function boot(){
    try {
      [DATA, MAN] = await Promise.all([
        fetch('3d-assets/studio-personas.json').then(r => r.json()),
        fetch('3d-assets/manifest.json').then(r => r.json())
      ]);
    } catch(e){ console.error('Studio data load failed', e); return; }

    // wait for engine control bar (static HTML, but guard anyway)
    let tries = 0; while (!$('#floorCtl') && tries++ < 50) await new Promise(r => setTimeout(r, 60));

    buildChrome();
    readURL();

    // sync STATE from engine on user clicks
    $$('#floorCtl .chip[data-fl]').forEach(c => c.addEventListener('click', () => setTimeout(() => { STATE.m = curFloor(); if (!booting) applyColor('orig'); renderPanel(); renderCta(); writeURL(); }, 30)));
    $$('#roomCtl .chip[data-rm]').forEach(c => c.addEventListener('click', () => { STATE.room = c.dataset.rm; writeURL(); }));
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

    // apply deep-linked floor/room/finish/view from the URL directly (not STATE,
    // which applyPersona resets to the persona default)
    if (urlFloor) setFloor(urlFloor);
    if (urlRoom) setRoom(urlRoom);
    if (urlFinish) setFinish(urlFinish);
    if (urlView) setView(urlView);
    if (urlLight && window.__room && window.__room.setLighting){ window.__room.setLighting(urlLight); STATE.light = urlLight; }
    if (urlColor) applyColor(urlColor);

    setLang(L); // paints chrome text + panel
    setTimeout(() => { booting = false; }, 300); // deep-link applied; resume colour-reset on floor change
    window.__studio = { applyPersona, setLang, STATE, openChooser }; // QA hook
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
