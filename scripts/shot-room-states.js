#!/usr/bin/env node
/* Capture floor-room.html in several view+finish states (blind-QA the interactions). */
const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const { chromiumLaunchOptions } = require('./browser-launch-options');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '_screens', 'cfgqa', 'roomwow'); fs.mkdirSync(OUT, { recursive: true });
const port = 5194;
const MIME = { '.html':'text/html;charset=utf-8','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.ico':'image/x-icon' };
function serve(){return new Promise(r=>{const s=http.createServer((q,res)=>{try{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';if(u==='/favicon.ico'){res.writeHead(204);return res.end();}const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404');}res.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,'127.0.0.1',()=>r(s));});}
const STATES = [
  ['detail-polished','detail','polished'],
  ['window-satin','window','satin'],
  ['hall-matte','hall','matte'],
];
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch(chromiumLaunchOptions(chromium,{headless:true}));
  const errs=[];
  const ctx=await browser.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>errs.push('pageerror: '+e.message));
  pg.on('console',m=>{if(m.type()==='error')errs.push('console.error: '+m.text());});
  await pg.goto(`http://127.0.0.1:${port}/floor-room.html`,{waitUntil:'networkidle',timeout:30000}).catch(e=>errs.push('goto: '+e.message));
  await pg.waitForTimeout(4200); // HDRI + bake
  for (const [label,view,finish] of STATES){
    await pg.evaluate(([v,f])=>{
      const fin={matte:0.55,satin:0.12,polished:0.025};
      window.__room.goView(v);
      window.__room.floorMat.clearcoatRoughness=fin[f]; window.__room.floorMat.needsUpdate=true;
    },[view,finish]);
    await pg.waitForTimeout(1400); // tween + settle
    await pg.screenshot({path:path.join(OUT,'state-'+label+'.png')});
  }
  await ctx.close(); await browser.close(); srv.close();
  console.log(JSON.stringify({states:STATES.map(s=>s[0]),errors:errs},null,2));
})().catch(e=>{console.error('FAIL',e);process.exit(1);});
