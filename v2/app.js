/* ============ TERRAZZO PATTERN GENERATOR ============ */
const PALETTES = {
  terrazzo:{base:'#efe7d6', chips:[
    {c:'#d9c39a',w:.18},{c:'#1c1916',w:.12},{c:'#7d6f54',w:.18},
    {c:'#c2603e',w:.06},{c:'#5a6a4f',w:.05},{c:'#b9a98a',w:.20},{c:'#fff',w:.08}
  ], thick:'12 мм', base_:'эпоксидная смола', sub:'venetian'},
  epoxy:{base:'#2a2620', chips:[
    {c:'#3a342c',w:.5},{c:'#5d5448',w:.25},{c:'#1c1916',w:.25}
  ], thick:'4 мм', base_:'эпоксидная смола', sub:'self-leveling'},
  micro:{base:'#cfc4b3', chips:[
    {c:'#b9a98a',w:.4},{c:'#9a8e7b',w:.3},{c:'#dccaa9',w:.3}
  ], thick:'2–3 мм', base_:'минеральная база', sub:'satin'},
  concrete:{base:'#7a7468', chips:[
    {c:'#5d5448',w:.3},{c:'#3a342c',w:.2},{c:'#9a9286',w:.3},{c:'#a8a298',w:.2}
  ], thick:'8 мм', base_:'портланд-цемент', sub:'polished'}
};
function rnd(min,max){return min+Math.random()*(max-min)}
function buildTerrazzo(svg, key){
  if(!svg) return;
  const p=PALETTES[key]; svg.innerHTML='';
  const W=480, H=480;
  const ns='http://www.w3.org/2000/svg';
  const defs=document.createElementNS(ns,'defs');
  defs.innerHTML=`
    <radialGradient id="vg" cx="50%" cy="50%" r="60%">
      <stop offset="0" stop-color="rgba(255,255,255,.06)"/>
      <stop offset="1" stop-color="rgba(0,0,0,.18)"/>
    </radialGradient>
    <filter id="grain"><feTurbulence baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
  svg.appendChild(defs);
  const r=document.createElementNS(ns,'rect'); r.setAttribute('width',W);r.setAttribute('height',H);r.setAttribute('fill',p.base);
  svg.appendChild(r);
  const chipCount = key==='terrazzo'?260 : key==='concrete'?180 : key==='micro'?120 : 80;
  function pickColor(){const r=Math.random(); let acc=0; for(const c of p.chips){acc+=c.w; if(r<=acc) return c.c} return p.chips[0].c}
  for(let i=0;i<chipCount;i++){
    const cx=rnd(-10,W+10), cy=rnd(-10,H+10);
    const isTerr=key==='terrazzo';
    const sz=isTerr?rnd(3,32):rnd(1,5);
    const rot=rnd(0,360);
    const sides=isTerr?Math.floor(rnd(3,7)):4;
    const pts=[];
    for(let k=0;k<sides;k++){const a=rot+k*(360/sides)+rnd(-12,12);const rr=sz*rnd(.7,1.1);pts.push(`${(cx+Math.cos(a*Math.PI/180)*rr).toFixed(1)},${(cy+Math.sin(a*Math.PI/180)*rr).toFixed(1)}`)}
    const poly=document.createElementNS(ns,'polygon');
    poly.setAttribute('points',pts.join(' '));
    poly.setAttribute('fill',pickColor());
    poly.setAttribute('opacity', isTerr?rnd(.85,1).toFixed(2):rnd(.4,.85).toFixed(2));
    svg.appendChild(poly);
  }
  const v=document.createElementNS(ns,'rect'); v.setAttribute('width',W);v.setAttribute('height',H);v.setAttribute('fill','url(#vg)');
  svg.appendChild(v);
  const g=document.createElementNS(ns,'rect'); g.setAttribute('width',W);g.setAttribute('height',H);g.setAttribute('filter','url(#grain)');g.setAttribute('opacity','.6');
  svg.appendChild(g);
}

/* ============ HERO PLATE ============ */
function initHeroPlate(){
  const topPattern=document.getElementById('topPattern');
  if(!topPattern) return;
  let curMat='terrazzo';
  buildTerrazzo(topPattern,curMat);

  document.querySelectorAll('#matSeg span').forEach(s=>s.onclick=()=>{
    document.querySelectorAll('#matSeg span').forEach(x=>x.classList.remove('on')); s.classList.add('on');
    curMat=s.dataset.m;
    buildTerrazzo(topPattern,curMat);
    const p=PALETTES[curMat];
    const t1=document.getElementById('pmType'); if(t1) t1.textContent=`${curMat} · ${p.sub}`;
    const t2=document.getElementById('pmThick'); if(t2) t2.textContent=p.thick;
    const t3=document.getElementById('pmBase'); if(t3) t3.textContent=p.base_;
  });

  const plate=document.getElementById('plate');
  if(!plate) return;
  let rx=56, ry=-18, drag=null;
  function applyRot(){plate.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`}
  plate.addEventListener('mousedown',(e)=>{
    e.preventDefault();
    plate.classList.remove('idle');
    drag={x:e.clientX,y:e.clientY,rx,ry};
  });
  window.addEventListener('mousemove',(e)=>{
    if(!drag)return;
    rx=Math.max(20,Math.min(85,drag.rx+(drag.y-e.clientY)*.4));
    ry=drag.ry+(e.clientX-drag.x)*.6;
    applyRot();
  });
  window.addEventListener('mouseup',()=>{
    if(!drag)return; drag=null;
    setTimeout(()=>{if(!drag)plate.classList.add('idle')},2400);
  });
  plate.addEventListener('touchstart',(e)=>{const t=e.touches[0];plate.classList.remove('idle');drag={x:t.clientX,y:t.clientY,rx,ry}});
  window.addEventListener('touchmove',(e)=>{if(!drag)return;const t=e.touches[0];rx=Math.max(20,Math.min(85,drag.rx+(drag.y-t.clientY)*.4));ry=drag.ry+(t.clientX-drag.x)*.6;applyRot()},{passive:true});
  window.addEventListener('touchend',()=>{if(!drag)return;drag=null;setTimeout(()=>{if(!drag)plate.classList.add('idle')},2400)});
}

/* ============ AUDIENCE SWITCHER ============ */
const COPY={
  b2b:{eye:'Industrial systems · 15 лет', h:'Полы, которые<br/><em>выдержат</em> <b>десятилетия</b>', lede:'Промышленный эпокси, MMA и PU-cement для производств, складов, парковок. Инженерная подготовка основания, бригады с допусками, сроки в смете.'},
  design:{eye:'Design & finishes · 15 лет', h:'Полы, которые<br/><em>становятся</em> <b>деталью</b>', lede:'Венецианское терраццо, микротопинг, шлифованный бетон. Под архитектурный замысел: палитра, фракции, рисунок, фактура — на образце перед укладкой.'},
  resi:{eye:'Premium residential · 15 лет', h:'Полы, которые<br/><em>живут</em> <b>столетиями</b>', lede:'Терраццо и наливные смолы для резиденций и вилл. Бесшовные, экологичные, лёгкие в уходе. Авторский подбор палитры — лично с вами.'}
};
function applyAudience(a){
  const c=COPY[a]; if(!c) return;
  const e1=document.getElementById('eyebrow'); if(e1) e1.textContent=c.eye;
  const e2=document.getElementById('h1'); if(e2) e2.innerHTML=c.h;
  const e3=document.getElementById('lede'); if(e3) e3.textContent=c.lede;
}
function initAudience(){
  document.querySelectorAll('#aud span').forEach(s=>s.onclick=()=>{
    document.querySelectorAll('#aud span').forEach(x=>x.classList.remove('on')); s.classList.add('on');
    applyAudience(s.dataset.a);
  });
}

/* ============ CALCULATOR ============ */
function initCalc(){
  const cArea=document.getElementById('cAreaR');
  if(!cArea) return;
  const cArea2=document.getElementById('cArea2'), cAreaL=document.getElementById('cArea'), cTot=document.getElementById('cTotal');
  let cMatPrice=280, cUseK=1.0;
  function recalc(){
    const sqm=+cArea.value;
    if(cArea2) cArea2.textContent=sqm;
    if(cAreaL) cAreaL.textContent=sqm;
    let total=Math.round(sqm*cMatPrice*cUseK);
    if(cTot) cTot.textContent=total.toLocaleString('ru-RU').replace(',', ' ');
  }
  cArea.oninput=recalc;
  document.querySelectorAll('#cMat span').forEach(s=>s.onclick=()=>{document.querySelectorAll('#cMat span').forEach(x=>x.classList.remove('on'));s.classList.add('on');cMatPrice=+s.dataset.p;recalc()});
  document.querySelectorAll('#cUse span').forEach(s=>s.onclick=()=>{document.querySelectorAll('#cUse span').forEach(x=>x.classList.remove('on'));s.classList.add('on');cUseK=+s.dataset.k;recalc()});
  recalc();
}

/* ============ FORM SUBMIT (real /api/contact) ============ */
function initForm(){
  const btn=document.getElementById('formSend');
  if(!btn) return;
  btn.onclick=async (e)=>{
    e.preventDefault();
    const form=btn.closest('.form');
    const get=(n)=>form.querySelector(`[name="${n}"]`)?.value?.trim()||'';
    const payload={
      name:get('name'),
      phone:get('phone'),
      address:get('address'),
      type:get('type'),
      area:get('area'),
      message:get('message'),
      source:'v2-preview'
    };
    if(!payload.name||!payload.phone){ msg('Укажите имя и телефон.', 'err'); return; }
    btn.disabled=true; msg('Отправляем…');
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(r.ok){ msg('Заявка отправлена. Перезвоним в течение часа.', 'ok'); form.reset?.(); }
      else { const t=await r.text().catch(()=>''); msg('Не удалось отправить. Напишите нам в WhatsApp: +972 55 966 1459', 'err'); }
    }catch(err){
      msg('Ошибка соединения. Напишите в WhatsApp: +972 55 966 1459', 'err');
    }finally{ btn.disabled=false; }
    function msg(text,kind){
      let el=form.querySelector('.fmsg');
      if(!el){ el=document.createElement('div'); el.className='fmsg'; btn.before(el); }
      el.textContent=text; el.className='fmsg '+(kind||'');
    }
  };
}

/* ============ THEME + LANG ============ */
function initTheme(){
  // remember theme
  const saved=localStorage.getItem('fdg_theme');
  if(saved==='dark') document.body.classList.add('dark');
  document.querySelectorAll('[data-toggle="theme"]').forEach(b=>b.onclick=()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('fdg_theme', document.body.classList.contains('dark')?'dark':'light');
  });
}

function initMobileNav(){
  const tog=document.querySelector('.mobile-tog');
  const drawer=document.querySelector('.mob-drawer');
  if(!tog||!drawer) return;
  tog.onclick=()=>drawer.classList.toggle('on');
  drawer.querySelectorAll('a').forEach(a=>a.onclick=()=>drawer.classList.remove('on'));
}

function initScroll(){
  const tb=document.querySelector('.topbar');
  if(!tb) return;
  const onScroll=()=>tb.classList.toggle('scrolled', window.scrollY>40);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ============ LOADER ============ */
function initLoader(){
  const wrap=document.getElementById('lchips');
  const loader=document.getElementById('loader');
  if(!loader) return;
  // skip loader on subsequent visits in this session
  if(sessionStorage.getItem('fdg_loaded')){ loader.remove(); return; }
  if(wrap){
    const palette=PALETTES.terrazzo.chips.map(c=>c.c);
    const w=wrap.parentElement.offsetWidth;
    for(let i=0;i<32;i++){
      const c=document.createElement('i');
      const sz=4+Math.random()*16;
      c.style.cssText=`width:${sz}px;height:${sz}px;background:${palette[Math.floor(Math.random()*palette.length)]};left:${10+Math.random()*(w-40)}px;top:${50+Math.random()*200}px;animation-delay:${(Math.random()*1.0).toFixed(2)}s`;
      wrap.appendChild(c);
    }
  }
  const lprog=document.querySelector('#lprog .b');
  let p=0;
  const iv=setInterval(()=>{p+=Math.random()*9+3;if(p>=100){p=100;clearInterval(iv)}if(lprog)lprog.textContent=String(Math.floor(p)).padStart(2,'0')},80);
  setTimeout(()=>{loader.classList.add('gone');setTimeout(()=>loader.remove(),1300);sessionStorage.setItem('fdg_loaded','1')}, 3400);
}

/* ============ SHARED HEADER / FOOTER injection ============ */
function injectChrome(){
  const root = location.pathname.includes('/v2/materials/') || location.pathname.includes('/v2/floors/') || location.pathname.includes('/v2/projects/') || location.pathname.includes('/v2/blog/') ? '..' : '.';
  const imgRoot = location.pathname.includes('/v2/materials/') || location.pathname.includes('/v2/floors/') || location.pathname.includes('/v2/projects/') || location.pathname.includes('/v2/blog/') ? '../../images' : '../images';

  const headerHTML = `
<header class="topbar">
  <div class="tb-l">
    <nav class="nav">
      <a href="${root}/floors/">Системы</a>
      <a href="${root}/industrial.html">Бизнесу</a>
      <a href="${root}/decorative.html">Архитекторам</a>
    </nav>
  </div>
  <a class="tb-c" href="${root}/index.html">
    <img class="dark-only" src="${imgRoot}/logo/White1_tr.png" alt="Floor.DSGN"/>
    <img class="light-only" src="${imgRoot}/logo/Black1_tr.png" alt="Floor.DSGN"/>
  </a>
  <div class="tb-r">
    <nav class="nav">
      <a href="${root}/projects/">Проекты</a>
      <a href="${root}/blog/">Журнал</a>
      <a href="${root}/about.html">О нас</a>
    </nav>
    <div class="langSeg">
      <span class="on" data-l="RU">RU</span>
      <span data-l="EN">EN</span>
    </div>
    <a class="cta-mini" href="${root}/contact.html">Заявка<span>→</span></a>
    <button class="mobile-tog" aria-label="Меню"><span></span><span></span><span></span></button>
  </div>
</header>
<nav class="mob-drawer">
  <a href="${root}/floors/">Системы</a>
  <a href="${root}/industrial.html">Бизнесу</a>
  <a href="${root}/decorative.html">Архитекторам</a>
  <a href="${root}/projects/">Проекты</a>
  <a href="${root}/blog/">Журнал</a>
  <a href="${root}/about.html">О нас</a>
  <a href="${root}/contact.html">Контакты</a>
</nav>`;

  const footerHTML = `
<footer class="foot">
  <div class="foot-grid">
    <div>
      <img class="flogo dark-only" src="${imgRoot}/logo/White1_tr.png" alt="Floor.DSGN"/>
      <img class="flogo light-only" src="${imgRoot}/logo/Black1_tr.png" alt="Floor.DSGN"/>
      <p>Полимерные полы, спроектированные как часть архитектуры. Промышленные системы и декоративные покрытия по всему Израилю.</p>
    </div>
    <div>
      <h5>Системы</h5>
      <ul>
        <li><a href="${root}/floors/terrazzo.html">Terrazzo</a></li>
        <li><a href="${root}/floors/epoxy.html">Epoxy</a></li>
        <li><a href="${root}/floors/microtopping.html">Micro-topping</a></li>
        <li><a href="${root}/floors/concrete.html">Polished Concrete</a></li>
        <li><a href="${root}/floors/pu-cement.html">PU-Cement</a></li>
        <li><a href="${root}/floors/mma.html">MMA</a></li>
      </ul>
    </div>
    <div>
      <h5>Компания</h5>
      <ul>
        <li><a href="${root}/projects/">Проекты</a></li>
        <li><a href="${root}/about.html">О нас</a></li>
        <li><a href="${root}/blog/">Журнал</a></li>
        <li><a href="${root}/contact.html">Контакты</a></li>
      </ul>
    </div>
    <div>
      <h5>Контакты</h5>
      <ul>
        <li><a href="mailto:floors.dsgn@gmail.com">floors.dsgn@gmail.com</a></li>
        <li><a href="tel:+972559661459">+972 55 966 1459</a></li>
        <li><a href="https://wa.me/972559661459">WhatsApp</a></li>
        <li><a>Israel · Tel Aviv</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bot">
    <div class="badges">
      <span>Документированная гарантия по системе</span>
      <span>Бесплатный выезд с тестом основания</span>
      <span>Европейские материалы</span>
    </div>
    <div class="foot-soc">
      <a href="https://instagram.com/floor.dsgn">IG</a>
      <a href="https://linkedin.com/company/floordsgn">IN</a>
      <a href="https://facebook.com/floordsgn">FB</a>
    </div>
  </div>
  <div class="foot-bot" style="border-top:none;padding-top:18px;color:var(--ink-mute)">© 2026 Floor.DSGN Ltd. · Tel Aviv · Jerusalem · Haifa · Be'er Sheva</div>
</footer>
<div class="preview-banner">⚙ Превью v2 · <a href="${root}/index.html">главная превью</a> · <a href="/">старый сайт</a></div>`;

  const head = document.querySelector('[data-chrome="header"]');
  const foot = document.querySelector('[data-chrome="footer"]');
  if(head){ head.outerHTML = headerHTML; }
  if(foot){ foot.outerHTML = footerHTML; }
}

/* ============ PROJECT FILTER ============ */
function initProjFilter(){
  const filter=document.querySelector('.proj-filter');
  if(!filter) return;
  filter.querySelectorAll('span').forEach(s=>s.onclick=()=>{
    filter.querySelectorAll('span').forEach(x=>x.classList.remove('on'));
    s.classList.add('on');
    const f=s.dataset.f;
    document.querySelectorAll('#projGrid .proj').forEach(p=>{
      p.classList.toggle('is-hidden', f!=='all' && p.dataset.cat!==f);
    });
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  injectChrome();
  initLoader();
  initTheme();
  initScroll();
  initMobileNav();
  initHeroPlate();
  initAudience();
  initCalc();
  initForm();
  initProjFilter();
});
