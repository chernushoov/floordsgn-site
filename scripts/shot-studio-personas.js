/* QA: FloorDSGN Studio M1 — persona loop + assertions + screenshots. */
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright');const {chromiumLaunchOptions}=require('./browser-launch-options');
const ROOT=path.resolve(__dirname,'..');const OUT=path.join(ROOT,'_screens','cfgqa','studio');fs.mkdirSync(OUT,{recursive:true});
const port=5310;
const MIME={'.html':'text/html;charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.ico':'image/x-icon'};
function serve(){return new Promise(r=>{const s=http.createServer((q,res)=>{try{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/floor-room.html';if(u==='/favicon.ico'){res.writeHead(204);return res.end();}const f=path.join(ROOT,u);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404');}res.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500);res.end(String(e));}});s.listen(port,'127.0.0.1',()=>r(s));});}

const PERSONAS=['explore','designer','architect','restaurant','warehouse','private','pro'];
const results=[];

(async()=>{
  const srv=await serve();
  const browser=await chromium.launch(chromiumLaunchOptions(chromium,{headless:true}));
  for(const av of PERSONAS){
    const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1.5});
    const pg=await ctx.newPage();
    const errs=[];
    pg.on('pageerror',e=>errs.push('pageerror: '+e.message));
    pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
    await pg.goto(`http://127.0.0.1:${port}/floor-room.html?avatar=${av}`,{waitUntil:'networkidle',timeout:30000}).catch(e=>errs.push('goto: '+e.message));
    await pg.waitForTimeout(4500);
    const info=await pg.evaluate(()=>{
      const sc=document.querySelector('#stScroll');
      const cta=document.querySelector('.st-cta-primary');
      return {
        hasStudio: !!window.__studio,
        personaName: (document.querySelector('#stPersonaName')||{}).textContent||'',
        ctaText: cta? cta.textContent : null,
        hasPanel: !!document.querySelector('#stPanel'),
        hasSpecOrPains: !!(document.querySelector('.st-spec')||document.querySelector('.st-pains')),
        priceInPanelBeforeCalc: /₪/.test(sc? sc.textContent : ''),
        specCards: document.querySelectorAll('.st-speccard').length,
        floorsShown: Array.from(document.querySelectorAll('#floorCtl .chip[data-fl]')).filter(c=>c.style.display!=='none').map(c=>c.dataset.fl)
      };
    }).catch(e=>({error:String(e)}));
    // run calculator → price should appear
    let priceAfterCalc=false;
    try{ await pg.evaluate(()=>{const b=document.querySelector('.st-calc-run'); if(b) b.click();}); await pg.waitForTimeout(400);
      priceAfterCalc=await pg.evaluate(()=>/₪/.test((document.querySelector('#stCalcOut')||{}).textContent||'')); }catch(e){}
    await pg.screenshot({path:path.join(OUT,`persona-${av}.png`)});
    results.push({av, errs, info, priceAfterCalc});
    await ctx.close();
  }

  // deep-link round-trip + i18n toggle on one page
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const pg=await ctx.newPage(); const errs=[];
  pg.on('pageerror',e=>errs.push('pageerror: '+e.message));
  pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
  await pg.goto(`http://127.0.0.1:${port}/floor-room.html?avatar=architect&m=graphite&room=bedroom&finish=polished&view=detail`,{waitUntil:'networkidle',timeout:30000});
  await pg.waitForTimeout(4500);
  const dl=await pg.evaluate(()=>({ floorOn:(document.querySelector('#floorCtl .chip.on[data-fl]')||{}).dataset?.fl, url:location.search }));
  // toggle to EN
  await pg.evaluate(()=>{const b=document.querySelector('.st-lang button[data-lg="en"]'); if(b) b.click();});
  await pg.waitForTimeout(500);
  const en=await pg.evaluate(()=>({ share:(document.querySelector('#stShare')||{}).textContent, persona:(document.querySelector('#stPersonaName')||{}).textContent }));
  await pg.screenshot({path:path.join(OUT,'deeplink-architect-en.png')});
  results.push({deeplink:dl, en, errs});
  await ctx.close();

  await browser.close(); srv.close();
  console.log(JSON.stringify(results,null,1));
})().catch(e=>{console.error('FAIL',e);process.exit(1);});
