#!/usr/bin/env node
/* Generic page shooter: serve repo root, open a page, screenshot desktop + mobile, report
 * console/page errors. Usage: node scripts/shot-page.js <page.html> <outdir> [waitMs] */
const http = require('http'); const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const { chromiumLaunchOptions } = require('./browser-launch-options');
const ROOT = path.resolve(__dirname, '..');
const page_ = process.argv[2] || 'floor-room.html';
const outdir = process.argv[3] || 'room';
const waitMs = parseInt(process.argv[4] || '2600', 10);
const port = 5193;
const OUT = path.join(ROOT, '_screens', 'cfgqa', outdir); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html':'text/html;charset=utf-8','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary' };
function serve(){return new Promise(r=>{const s=http.createServer((q,res)=>{try{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404');}res.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,'127.0.0.1',()=>r(s));});}
(async()=>{
  const srv=await serve();
  const browser=await chromium.launch(chromiumLaunchOptions(chromium,{headless:true}));
  const errs=[];
  for (const [label,vp,dsf,mobile] of [['desktop',{width:1280,height:800},2,false],['mobile',{width:393,height:852},3,true]]){
    const ctx=await browser.newContext({viewport:vp,deviceScaleFactor:dsf,isMobile:mobile,hasTouch:mobile});
    const pg=await ctx.newPage();
    pg.on('pageerror',e=>errs.push(label+' pageerror: '+e.message));
    pg.on('console',m=>{if(m.type()==='error')errs.push(label+' console.error: '+m.text());});
    await pg.goto(`http://127.0.0.1:${port}/${page_}`,{waitUntil:'networkidle',timeout:30000}).catch(e=>errs.push(label+' goto: '+e.message));
    await pg.waitForTimeout(waitMs);
    await pg.screenshot({path:path.join(OUT,label+'.png')});
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(JSON.stringify({page:page_,out:OUT,errors:errs},null,2));
})().catch(e=>{console.error('FAIL',e);process.exit(1);});
