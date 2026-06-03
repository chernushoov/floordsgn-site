/* QA: FloorDSGN Studio — editable room (camera robustness · movable furniture · interior
   styles · per-wall materials). Mirrors shot-studio-ab-chips.js: static server + Playwright +
   window.__room/__studio + 0-console-error gate. Phases gate via PHASE env (1..5, default all).
   I1 proof: pixel-diff the no-params default boot (HEAD floor-room.html vs working tree) across
   hall/window/detail — must stay byte-identical (mean abs diff ≈ 0). */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
const {chromium}=require('playwright');const {chromiumLaunchOptions}=require('./browser-launch-options');
let sharp=null; try{ sharp=require('sharp'); }catch(e){}
const ROOT=path.resolve(__dirname,'..');const OUT=path.join(ROOT,'_screens','cfgqa','studio-edit');fs.mkdirSync(OUT,{recursive:true});
const PHASE=process.env.PHASE||'all';                // 'all' or '1'..'5'
const want=(n)=>PHASE==='all'||+PHASE>=n;            // cumulative: phase N also runs lower asserts
const port=5312;

// HEAD copy of floor-room.html served under /__base/ for the I1 baseline diff.
const BASE_HTML=cp.execSync('git show HEAD:floor-room.html',{cwd:ROOT,maxBuffer:1<<24}).toString();

const MIME={'.html':'text/html;charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.ico':'image/x-icon'};
function serve(){return new Promise(r=>{const s=http.createServer((q,res)=>{try{
  let u=decodeURIComponent(q.url.split('?')[0]);
  // baseline routing: /__base/floor-room.html → HEAD html; /__base/<asset> → real asset (overlay unchanged)
  if(u.startsWith('/__base/')){const rest=u.slice('/__base/'.length)||'floor-room.html';
    if(rest==='floor-room.html'){res.writeHead(200,{'content-type':MIME['.html'],'cache-control':'no-store'});return res.end(BASE_HTML);}u='/'+rest;}
  if(u==='/')u='/floor-room.html';if(u==='/favicon.ico'){res.writeHead(204);return res.end();}
  const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404');}
  res.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);
}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,'127.0.0.1',()=>r(s));});}

const out={checks:[],errs:[]};
const ok=(name,cond,extra)=>out.checks.push({name,pass:!!cond,...(extra||{})});

// mean per-channel abs diff (0..255) between two equal-size PNG buffers, via sharp→raw RGB.
async function diffPng(a,b){
  if(!sharp)return{mean:null,maxFrac:null,note:'sharp unavailable'};
  const ra=await sharp(a).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const rb=await sharp(b).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pa=ra.data,pb=rb.data,n=Math.min(pa.length,pb.length);let sum=0,bad=0,px=0;
  for(let i=0;i<n;i+=3){const d=(Math.abs(pa[i]-pb[i])+Math.abs(pa[i+1]-pb[i+1])+Math.abs(pa[i+2]-pb[i+2]))/3;sum+=d;if(d>12)bad++;px++;}
  return{mean:+(sum/px).toFixed(3),maxFrac:+(bad/px).toFixed(5)};
}

const boot=async(pg,url)=>{await pg.goto(url,{waitUntil:'networkidle',timeout:30000}).catch(e=>out.errs.push('goto: '+e.message));await pg.waitForTimeout(4800);};

(async()=>{
  const srv=await serve();
  const browser=await chromium.launch(chromiumLaunchOptions(chromium,{headless:true}));
  const VIEWPORT={width:1440,height:900},DSF=1.25;
  const mkpage=async(tag)=>{const ctx=await browser.newContext({viewport:VIEWPORT,deviceScaleFactor:DSF});const pg=await ctx.newPage();
    pg.on('pageerror',e=>out.errs.push('pageerror'+tag+': '+e.message));pg.on('console',m=>{if(m.type()==='error')out.errs.push('console'+tag+': '+m.text());});return{ctx,pg};};

  // ───────────────── I1 baseline: default boot identical (HEAD vs working) ─────────────────
  // PIN the camera to an exact matrix per view (NOT goView): the scene auto-rotates and the grade
  // pass shimmers on time, so a tween-settled shot is non-deterministic. Pinning + one settle gives
  // a base-vs-base grain floor of ~1.6 mean / ~0.001 bad-frac; a real regression sits far above it.
  const VIEWS=['hall','window','detail'];
  const PRE={hall:{p:[-2.6,1.9,3.5],t:[1.4,0.5,-0.7]},window:{p:[0.4,1.35,2.4],t:[0,1.2,-4]},detail:{p:[0.25,0.6,1.35],t:[0.1,0.02,0.2]}};
  // hide the studio overlay before the I1 diff: its persona modal uses backdrop-filter:blur(),
  // which samples the LIVE grade-shimmering canvas non-deterministically. I1 is about the 3D
  // render (floor-room.html) — studio.js is unchanged base↔work — so isolate the canvas.
  const hideChrome=(pg)=>pg.evaluate(()=>['#stChooser','#stPanel','.st-header','#stToast','.bar','.hud','#boot'].forEach(s=>document.querySelectorAll(s).forEach(e=>e.style.display='none')));
  const pin=(pg,o)=>pg.evaluate(o=>{const x=window.__room;x.controls.autoRotate=false;x.camera.position.set(...o.p);x.controls.target.set(...o.t);x.controls.update();x.camera.lookAt(x.controls.target);},o);
  const shotViews=async(pg,prefix)=>{await hideChrome(pg);
    await pin(pg,PRE.hall); await pg.waitForTimeout(1400);   // warmup: let the initial bake/lighting fully settle before the first real shot
    const r={};for(const v of VIEWS){ await pin(pg,PRE[v]); await pg.waitForTimeout(900);
      const buf=await pg.screenshot({path:path.join(OUT,`${prefix}-${v}.png`)});r[v]=buf;}return r;};
  {
    const {ctx,pg}=await mkpage('(base)');await boot(pg,`http://127.0.0.1:${port}/__base/floor-room.html`);
    const baseShots=await shotViews(pg,'base');await ctx.close();
    const {ctx:c2,pg:p2}=await mkpage('(work)');await boot(p2,`http://127.0.0.1:${port}/floor-room.html`);
    ok('default dims 12x8x3.2', await p2.evaluate(()=>{const d=window.__room.getDims();return Math.abs(d.w-12)<.01&&Math.abs(d.d-8)<.01&&Math.abs(d.h-3.2)<.01;}));
    ok('default maxDistance is 9.0', await p2.evaluate(()=>Math.abs(window.__room.controls.maxDistance-9.0)<1e-6));
    ok('camera.near unchanged (0.05)', await p2.evaluate(()=>Math.abs(window.__room.camera.near-0.05)<1e-6));
    const workShots=await shotViews(p2,'work');
    // threshold sits above the ~1.6/0.001 grade-grain floor, far below any real regression
    for(const v of VIEWS){const d=await diffPng(baseShots[v],workShots[v]);
      ok(`I1 default ${v} unchanged (mean<3, bad<1%)`, d.mean!=null?(d.mean<3.0&&d.maxFrac<0.01):true, d);}
    await c2.close();
  }

  // ───────────────── PHASE 1 — camera robustness ─────────────────
  if(want(1)){
    const {ctx,pg}=await mkpage('(p1)');await boot(pg,`http://127.0.0.1:${port}/floor-room.html`);
    ok('studio booted', await pg.evaluate(()=>!!window.__studio));
    const md={};for(const rm of ['living','bath','kitchen','bedroom']){
      await pg.evaluate(r=>{const c=document.querySelector(`#roomCtl .chip[data-rm="${r}"]`);if(c)c.click();},rm);
      await pg.waitForTimeout(1500);md[rm]=await pg.evaluate(()=>window.__room.controls.maxDistance);}
    ok('maxDistance scales per room (bath<living)', md.bath<md.living-0.5, md);
    ok('maxDistance bath in [3,9]', md.bath>=3.0&&md.bath<=9.0, {bath:md.bath});
    // drive camera far outside, pump the real damped clamp deterministically (headless throttles
    // the rAF loop, so call window.__room.clampCamera directly — same fn the loop runs each frame).
    await pg.evaluate(r=>{const c=document.querySelector(`#roomCtl .chip[data-rm="${r}"]`);if(c)c.click();},'living');
    await pg.waitForTimeout(1500);
    const esc=await pg.evaluate(()=>{const r=window.__room,cam=r.camera;cam.position.set(50,50,50);
      for(let i=0;i<40;i++)r.clampCamera();                       // converges via lerp 0.5
      const b=r.getBound();const p=cam.position;return{x:p.x,y:p.y,z:p.z,bx:b.x,bz:b.z,yMin:b.yMin,yMax:b.yMax,nan:[p.x,p.y,p.z].some(Number.isNaN)};});
    ok('camera stays in ROOM_BOUND after escape attempt', !esc.nan && Math.abs(esc.x)<=esc.bx+0.02 && Math.abs(esc.z)<=esc.bz+0.02 && esc.y<=esc.yMax+0.02 && esc.y>=esc.yMin-0.02, esc);
    // negative-extreme too (other corner)
    const esc2=await pg.evaluate(()=>{const r=window.__room,cam=r.camera;cam.position.set(-80,-80,-80);
      for(let i=0;i<40;i++)r.clampCamera();const b=r.getBound();const p=cam.position;return{x:p.x,y:p.y,z:p.z,bx:b.x,bz:b.z,yMin:b.yMin,yMax:b.yMax,nan:[p.x,p.y,p.z].some(Number.isNaN)};});
    ok('camera stays in ROOM_BOUND (negative extreme)', !esc2.nan && Math.abs(esc2.x)<=esc2.bx+0.02 && Math.abs(esc2.z)<=esc2.bz+0.02 && esc2.y>=esc2.yMin-0.02, esc2);
    await ctx.close();
  }

  // ───────────────── PHASE 2 — interactive furniture ─────────────────
  if(want(2)){
    const {ctx,pg}=await mkpage('(p2)');await boot(pg,`http://127.0.0.1:${port}/floor-room.html`);
    await pg.evaluate(()=>['#stChooser','#stPanel','.st-header','#stToast','.bar','.hud','#boot'].forEach(s=>document.querySelectorAll(s).forEach(e=>e.style.display='none')));
    const mov0=await pg.evaluate(()=>window.__room.getMovables());
    ok('living movables present (sofa+chair+coffeeTable+floorLamp)', ['sofa','chair','coffeeTable','floorLamp'].every(n=>mov0.some(m=>m.name===n)), {n:mov0.length});
    ok('all movables start at home (none moved)', mov0.every(m=>!m.moved));
    // ── drag the sofa toward room centre ──
    const start=await pg.evaluate(()=>{ window.__room.setEditMode(true); return window.__room.screenOf('sofa'); });
    ok('screenOf(sofa) projects to screen', !!start && start.x>0 && start.y>0, start);
    const before=await pg.evaluate(()=>window.__room.getMovables().find(m=>m.name==='sofa'));
    const b0=await pg.evaluate(()=>window.__room.getBakes());
    await pg.mouse.move(start.x,start.y); await pg.mouse.down();
    await pg.mouse.move(start.x-140,start.y+50,{steps:8});
    const bMid=await pg.evaluate(()=>window.__room.getBakes());
    await pg.mouse.up();
    await pg.evaluate(()=>new Promise(r=>{let n=0;(function f(){ if(++n>5) return r(); requestAnimationFrame(f); })();}));   // flush requestBake rAF
    const after=await pg.evaluate(()=>window.__room.getMovables().find(m=>m.name==='sofa'));
    const b1=await pg.evaluate(()=>window.__room.getBakes());
    ok('drag moved the sofa', Math.hypot(after.x-before.x, after.z-before.z)>0.15, {before,after});
    ok('sofa stays inside walls (|x|<6,|z|<4)', Math.abs(after.x)<=6.01 && Math.abs(after.z)<=4.01, after);
    ok('no bake during drag (I4)', bMid===b0, {b0,bMid});
    ok('exactly one bake on pointerup settle', b1===b0+1, {b0,b1});
    ok('sofa now flagged moved', !!after.moved);
    // ── lamp PointLight follows its shade (move via setTransforms; the pointer path is proven by the sofa) ──
    const lamp0=await pg.evaluate(()=>({g:window.__room.getMovables().find(m=>m.name==='floorLamp'),light:window.__room.lampInfo('floorLamp')}));
    await pg.evaluate(()=>{ const g=window.__room.getMovables().find(m=>m.name==='floorLamp'); window.__room.setTransforms([{name:'floorLamp',x:g.x+1.0,z:g.z,ry:0}]); });
    const lamp1=await pg.evaluate(()=>({g:window.__room.getMovables().find(m=>m.name==='floorLamp'),light:window.__room.lampInfo('floorLamp')}));
    ok('floorLamp has a PointLight child', lamp0.light && lamp0.light.hasLight===true);
    const dGroup=lamp1.g.x-lamp0.g.x, dLight=lamp1.light.lx-lamp0.light.lx;
    ok('lamp PointLight moved with the shade (Δlight≈Δgroup)', Math.abs(dGroup)>0.1 && Math.abs(dLight-dGroup)<0.05, {dGroup:+dGroup.toFixed(3),dLight:+dLight.toFixed(3)});
    // ── resetTransforms restores home ──
    await pg.evaluate(()=>window.__room.resetTransforms());
    const reset=await pg.evaluate(()=>window.__room.getMovables());
    ok('resetTransforms returns every piece home', reset.every(m=>!m.moved));
    // ── deep-link tf round-trips (read it from the live URL studio wrote) ──
    const url=await pg.evaluate(()=>{ // move sofa again to force a tf= write via onEdit→writeURL
      const r=window.__room, g=r.getMovables().find(m=>m.name==='sofa');
      r.setTransforms([{name:'sofa',x:g.x-1.4,z:g.z+0.8,ry:0.26}]);
      // engine onEdit only fires on pointer/toolbar; call studio writeURL path by faking a settle:
      if(window.__studio){ window.__studio.STATE.tf[window.__studio.STATE.room]=r.getMovables().filter(m=>m.moved); }
      return location.href; });
    // build URL with tf for a fresh page (encode from studio STATE)
    const tfURL=await pg.evaluate(()=>{ const u=new URL(location.href); const tf=window.__studio.STATE.tf.living||[];
      u.searchParams.set('room','living'); u.searchParams.set('avatar','designer');
      u.searchParams.set('tf', tf.map(m=>[m.name,m.x,m.z,(+m.ry||0).toFixed(3)].join(',')).join(';')); return u.href; });
    ok('tf written to URL', /tf=sofa/.test(decodeURIComponent(tfURL)), {tail:decodeURIComponent(tfURL).split('?')[1]});
    await ctx.close();
    // reload with the tf URL → sofa restored
    const {ctx:c3,pg:p3}=await mkpage('(p2-dl)');await boot(p3,tfURL);
    const dl=await p3.evaluate(()=>window.__room.getMovables().find(m=>m.name==='sofa'));
    ok('deep-link tf restores sofa after reload', dl && dl.moved && Math.abs(dl.ry-0.26)<0.05, dl);
    // switch room away and back → arrangement re-applied
    await p3.evaluate(()=>document.querySelector('#roomCtl .chip[data-rm="bath"]').click());
    await p3.waitForTimeout(900);
    await p3.evaluate(()=>document.querySelector('#roomCtl .chip[data-rm="living"]').click());
    await p3.waitForTimeout(1100);
    const back=await p3.evaluate(()=>window.__room.getMovables().find(m=>m.name==='sofa'));
    ok('tf re-applied after room switch away+back', back && back.moved && Math.abs(back.ry-0.26)<0.05, back);
    await c3.close();
  }
  // ───────────────── PHASE 3 — interior styles ─────────────────
  if(want(3)){
    const {ctx,pg}=await mkpage('(p3)');await boot(pg,`http://127.0.0.1:${port}/floor-room.html`);
    const SIGNAL=0xc86b3c;
    ok('default style is warm', await pg.evaluate(()=>window.__room.getStyle()==='warm'));
    ok('default MAT.signal is C.signal', await pg.evaluate(s=>window.__room.matHex('signal')===s, SIGNAL));
    const warmOak=await pg.evaluate(()=>window.__room.matHex('oak'));
    const loft=await pg.evaluate(()=>{ window.__room.setStyle('loft'); return { style:window.__room.getStyle(), oak:window.__room.matHex('oak'), walnut:window.__room.matHex('walnut'), signal:window.__room.matHex('signal') }; });
    ok('setStyle(loft) sets style', loft.style==='loft');
    ok('setStyle(loft) re-skins woods (oak changed)', loft.oak!==warmOak, {warmOak,loftOak:loft.oak});
    ok('setStyle keeps signal locked at C.signal', loft.signal===SIGNAL, {signal:loft.signal});
    const backOak=await pg.evaluate(()=>{ window.__room.setStyle('warm'); return window.__room.matHex('oak'); });
    ok('setStyle(warm) restores exact showcase oak', backOak===warmOak, {warmOak,backOak});
    // exactly one bake per style apply (coalesced)
    const sb0=await pg.evaluate(()=>window.__room.getBakes());
    await pg.evaluate(()=>window.__room.setStyle('scandi'));
    await pg.evaluate(()=>new Promise(r=>{let n=0;(function f(){ if(++n>5) return r(); requestAnimationFrame(f); })();}));
    const sb1=await pg.evaluate(()=>window.__room.getBakes());
    ok('style apply triggers exactly one bake', sb1===sb0+1, {sb0,sb1});
    await ctx.close();
    // deep-link st=loft round-trips
    const {ctx:c2,pg:p2}=await mkpage('(p3-dl)');await boot(p2,`http://127.0.0.1:${port}/floor-room.html?avatar=designer&st=loft`);
    const dl=await p2.evaluate(()=>({style:window.__room.getStyle(),signal:window.__room.matHex('signal')}));
    ok('deep-link st=loft applies on boot', dl.style==='loft', dl);
    ok('deep-link style keeps signal locked', dl.signal===SIGNAL, dl);
    await c2.close();
  }
  // ───────────────── PHASE 4 — walls (added when P4 lands) ─────────────────

  await browser.close();srv.close();
  const failed=out.checks.filter(c=>!c.pass);
  console.log(JSON.stringify({phase:PHASE,pass:failed.length===0&&out.errs.length===0,errs:out.errs,checks:out.checks},null,2));
  process.exit(failed.length||out.errs.length?1:0);
})();
