#!/usr/bin/env node
/* Eyes-on capture of FloorDSGN Studio across real UI states (chrome visible).
 * Drives window.__studio (applyPersona) + window.__room (goView) past the persona chooser.
 * Out: _screens/studio-states/<label>.png   Usage: node scripts/snap-studio-states.js */
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');const {chromiumLaunchOptions}=require('./browser-launch-options');
const ROOT=path.resolve(__dirname,'..');const OUT=path.join(ROOT,'_screens','studio-states');fs.mkdirSync(OUT,{recursive:true});
const PORT=5321;
const BASE=process.env.BASE||('http://127.0.0.1:'+PORT);   // BASE=https://floorroom.floordsgn.pages.dev → shoot the live deploy
const MIME={'.html':'text/html;charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
function serve(){return new Promise(r=>{const s=http.createServer((q,res)=>{try{
  let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/floor-room.html';if(u==='/favicon.ico'){res.writeHead(204);return res.end();}
  const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404');}
  res.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);
}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(PORT,'127.0.0.1',()=>r(s));});}

const errs=[];
const ready=(pg)=>pg.waitForFunction(()=>window.__room&&window.__studio&&window.__studio.STATE,{timeout:30000});
const dismiss=(pg)=>pg.evaluate(()=>{const c=document.getElementById('stChooser');if(c)c.classList.remove('show');});
const persona=(pg,id)=>pg.evaluate(id=>window.__studio.applyPersona(id),id);
const view=(pg,v)=>pg.evaluate(v=>window.__room.goView&&window.__room.goView(v),v);

async function shot(ctx,label,{vp,id,v,pin,settle=2600,hideChrome=false}){
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>errs.push(label+' pageerror: '+e.message));
  pg.on('console',m=>{if(m.type()==='error')errs.push(label+' console: '+m.text());});
  await pg.setViewportSize(vp);
  await pg.goto(`${BASE}/floor-room.html`,{waitUntil:'networkidle',timeout:30000});
  await ready(pg);await pg.waitForTimeout(900);
  if(id){await persona(pg,id);} await dismiss(pg);
  if(pin){await pg.evaluate(o=>{const x=window.__room;x.controls.autoRotate=false;x.camera.position.set(...o.p);x.controls.target.set(...o.t);x.controls.update();x.camera.lookAt(x.controls.target);},pin);}
  else if(v){await view(pg,v);}
  await pg.waitForTimeout(settle);
  if(pin){await pg.evaluate(o=>{const x=window.__room;x.camera.position.set(...o.p);x.controls.target.set(...o.t);x.controls.update();x.camera.lookAt(x.controls.target);},pin);}
  if(hideChrome)await pg.evaluate(()=>['#stChooser','#stPanel','.st-header','#stToast','.st-bar','#roomEditBar'].forEach(s=>document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')));
  await pg.waitForTimeout(hideChrome?500:0);
  await pg.screenshot({path:path.join(OUT,label+'.png')});
  await pg.close();
  console.log('✓',label);
}

(async()=>{
  const srv=await serve();
  const browser=await chromium.launch(chromiumLaunchOptions(chromium,{headless:true}));
  const dctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
  const mctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3});
  try{
    await shot(dctx,'01-explore-desktop',{vp:{width:1440,height:900},id:'explore'});
    await shot(dctx,'02-designer-desktop',{vp:{width:1440,height:900},id:'designer'});
    await shot(dctx,'03-restaurant-desktop',{vp:{width:1440,height:900},id:'restaurant'});
    await shot(dctx,'04-detail-render',{vp:{width:1440,height:900},id:'explore',pin:{p:[-1.1,0.62,0.6],t:[-0.5,0.02,-0.9]},hideChrome:true});
    await shot(dctx,'05-window-render',{vp:{width:1440,height:900},id:'explore',v:'window',hideChrome:true});
    await shot(mctx,'06-explore-mobile',{vp:{width:390,height:844},id:'explore'});
  }catch(e){console.error('FAIL',e.message);process.exitCode=1;}
  finally{
    if(errs.length){console.log('\n--- console/page errors ---');errs.forEach(e=>console.log('  !',e));}
    else console.log('\n0 console errors');
    await browser.close();srv.close();
  }
})();
