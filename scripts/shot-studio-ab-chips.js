/* QA: FloorDSGN Studio — visual A/B compare + life-size chip scale. Asserts repeat math,
   two rendered compare cells (data URLs), state restore, deep-link cs=1, 0 console errors. */
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');const {chromiumLaunchOptions}=require('./browser-launch-options');
const ROOT=path.resolve(__dirname,'..');const OUT=path.join(ROOT,'_screens','cfgqa','studio');fs.mkdirSync(OUT,{recursive:true});
const port=5311;
const MIME={'.html':'text/html;charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.ico':'image/x-icon'};
function serve(){return new Promise(r=>{const s=http.createServer((q,res)=>{try{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/floor-room.html';if(u==='/favicon.ico'){res.writeHead(204);return res.end();}const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404');}res.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,'127.0.0.1',()=>r(s));});}

const repeatX=()=>{const m=window.__room&&window.__room.floorMat&&window.__room.floorMat.map;return m?+m.repeat.x.toFixed(2):null;};
const out={checks:[],errs:[]};
const ok=(name,cond,extra)=>out.checks.push({name,pass:!!cond,...(extra||{})});

(async()=>{
  const srv=await serve();
  const browser=await chromium.launch(chromiumLaunchOptions(chromium,{headless:true}));
  const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.25});
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>out.errs.push('pageerror: '+e.message));
  pg.on('console',m=>{if(m.type()==='error')out.errs.push('console: '+m.text());});

  // ── designer on a chip floor (cement) ──
  await pg.goto(`http://127.0.0.1:${port}/floor-room.html?avatar=designer&m=cement`,{waitUntil:'networkidle',timeout:30000}).catch(e=>out.errs.push('goto: '+e.message));
  await pg.waitForTimeout(4500);
  ok('studio booted', await pg.evaluate(()=>!!window.__studio));

  // chip-scale pill present on a chip floor
  const pillSel=`.st-pill`;
  const findChipPill=()=>pg.evaluate(()=>{const p=Array.from(document.querySelectorAll('.st-pill')).find(b=>/чип|chip/i.test(b.textContent));return p?p.textContent.trim():null;});
  ok('chip pill shown on cement', !!(await findChipPill()), {label: await findChipPill()});

  const artRep=await pg.evaluate(repeatX);
  // toggle life-size ON
  await pg.evaluate(()=>{const p=Array.from(document.querySelectorAll('.st-pill')).find(b=>/чип|chip/i.test(b.textContent));if(p)p.click();});
  await pg.waitForTimeout(500);
  const realRep=await pg.evaluate(repeatX);
  ok('life-size increases repeat', realRep>artRep, {artRep, realRep});
  ok('life-size ~ 14/0.7 (≈20)', Math.abs(realRep-20)<3, {realRep});
  // toggle OFF → restored to art repeat
  await pg.evaluate(()=>{const p=Array.from(document.querySelectorAll('.st-pill')).find(b=>/чип|chip/i.test(b.textContent));if(p)p.click();});
  await pg.waitForTimeout(400);
  const backRep=await pg.evaluate(repeatX);
  ok('toggle OFF restores art repeat', Math.abs(backRep-artRep)<0.5, {artRep, backRep});

  // ── chip pill ABSENT on seamless floor (micro) ──
  await pg.evaluate(()=>{const c=document.querySelector('#floorCtl .chip[data-fl="micro"]');if(c)c.click();});
  await pg.waitForTimeout(900);
  ok('chip pill hidden on microcement', !(await findChipPill()));

  // ── visual A/B compare ──
  await pg.evaluate(()=>{const c=document.querySelector('#floorCtl .chip[data-fl="cement"]');if(c)c.click();});
  await pg.waitForTimeout(900);
  const floorBeforeCmp=await pg.evaluate(()=>(document.querySelector('#floorCtl .chip.on[data-fl]')||{}).dataset.fl);
  await pg.evaluate(()=>{const b=Array.from(document.querySelectorAll('.st-act')).find(x=>/сравн|compare/i.test(x.textContent));if(b)b.click();});
  // poll for two rendered cells
  let cells=0, dataUrls=0;
  for(let i=0;i<40;i++){await pg.waitForTimeout(250);
    const r=await pg.evaluate(()=>{const imgs=Array.from(document.querySelectorAll('.st-cmp-vis .st-cmp-cell img'));return{cells:imgs.length,data:imgs.filter(im=>/^data:image/.test(im.src)).length};});
    cells=r.cells;dataUrls=r.data;if(dataUrls>=2)break;}
  ok('compare renders 2 visual cells', cells===2, {cells});
  ok('both cells are data-URL renders', dataUrls===2, {dataUrls});
  ok('compare spec table present', await pg.evaluate(()=>!!document.querySelector('#stCmpModal .st-cmp')));
  await pg.screenshot({path:path.join(OUT,'ab-compare.png')});
  // close + verify floor restored
  await pg.evaluate(()=>{const m=document.querySelector('#stCmpModal');if(m)m.classList.remove('show');});
  await pg.waitForTimeout(800);
  const floorAfterCmp=await pg.evaluate(()=>(document.querySelector('#floorCtl .chip.on[data-fl]')||{}).dataset.fl);
  ok('floor restored after compare', floorBeforeCmp===floorAfterCmp, {floorBeforeCmp, floorAfterCmp});

  // ── parametric room size ──
  ok('room-size control present', await pg.evaluate(()=>!!document.querySelector('#stDimW')));
  await pg.evaluate(()=>{const w=document.querySelector('#stDimW'),d=document.querySelector('#stDimD'),h=document.querySelector('#stDimH');if(w&&d&&h){w.value='5';d.value='4';h.value='2.8';const ap=Array.from(document.querySelectorAll('.st-pill')).find(b=>/примен|apply/i.test(b.textContent));if(ap)ap.click();}});
  await pg.waitForTimeout(1400);
  const rd=await pg.evaluate(()=>window.__room.getDims());
  ok('room resize applies 5x4x2.8', Math.abs(rd.w-5)<0.6&&Math.abs(rd.d-4)<0.6&&Math.abs(rd.h-2.8)<0.4, rd);
  await pg.screenshot({path:path.join(OUT,'room-5x4.png')});
  await pg.evaluate(()=>{const r=Array.from(document.querySelectorAll('.st-pill')).find(b=>/сброс|reset/i.test(b.textContent));if(r)r.click();});
  await pg.waitForTimeout(1100);
  const rdd=await pg.evaluate(()=>window.__room.getDims());
  ok('room reset to default 12x8', Math.abs(rdd.w-12)<0.1&&Math.abs(rdd.d-8)<0.1, rdd);

  // ── design variants ──
  await pg.evaluate(()=>{const c=document.querySelector('#floorCtl .chip[data-fl="cement"]');if(c)c.click();});
  await pg.waitForTimeout(1000);
  ok('design section present on cement', await pg.evaluate(()=>{const hs=Array.from(document.querySelectorAll('.st-sect-h'));return !!hs.find(h=>/дизайн|pattern/i.test(h.textContent));}));
  await pg.evaluate(()=>{const hs=Array.from(document.querySelectorAll('.st-sect-h'));const dh=hs.find(h=>/дизайн|pattern/i.test(h.textContent));if(dh){const grp=dh.nextElementSibling;const sw=grp&&grp.querySelectorAll('.st-swatch')[1];if(sw)sw.click();}});
  await pg.waitForTimeout(1600);
  const dsrc=await pg.evaluate(()=>{const im=window.__room.floorMat.map.image;return (im&&im.src)||'';});
  ok('design swap loads _designs texture', /_designs/.test(dsrc), {tail:dsrc.slice(-46)});
  await pg.screenshot({path:path.join(OUT,'design-swap.png')});
  ok('design absent on seamless venetian', await pg.evaluate(()=>{const c=document.querySelector('#floorCtl .chip[data-fl="venetian"]');if(c)c.click();return new Promise(r=>setTimeout(()=>{const hs=Array.from(document.querySelectorAll('.st-sect-h'));r(!hs.find(h=>/дизайн|pattern/i.test(h.textContent)));},900));}));

  await ctx.close();

  // ── deep-link cs=1 ──
  const ctx2=await browser.newContext({viewport:{width:1280,height:820}});
  const pg2=await ctx2.newPage();
  pg2.on('pageerror',e=>out.errs.push('pageerror(dl): '+e.message));
  pg2.on('console',m=>{if(m.type()==='error')out.errs.push('console(dl): '+m.text());});
  await pg2.goto(`http://127.0.0.1:${port}/floor-room.html?avatar=designer&m=cement&cs=1&dims=6x4x2.8`,{waitUntil:'networkidle',timeout:30000});
  await pg2.waitForTimeout(4800);
  const dl=await pg2.evaluate(()=>({real:window.__studio&&window.__studio.STATE.realChip, rep:(window.__room.floorMat.map.repeat.x), dims:window.__room.getDims()}));
  ok('deep-link cs=1 sets realChip', dl.real===true, {real:dl.real});
  ok('deep-link cs=1 applies life-size repeat', dl.rep>15, {rep:+dl.rep.toFixed(2)});
  ok('deep-link dims=6x4x2.8 applies', Math.abs(dl.dims.w-6)<0.6&&Math.abs(dl.dims.d-4)<0.6, dl.dims);
  await pg2.screenshot({path:path.join(OUT,'deeplink-cs.png')});
  await ctx2.close();

  await browser.close();srv.close();
  const failed=out.checks.filter(c=>!c.pass);
  console.log(JSON.stringify({pass:failed.length===0&&out.errs.length===0, errs:out.errs, checks:out.checks},null,2));
  process.exit(failed.length||out.errs.length?1:0);
})();
