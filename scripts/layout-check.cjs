/**
 * Görsel bekçi — verilen sayfaları 390 açık / 390 koyu / 1440 açık açar; ölçer:
 * yatay taşma (sw > genişlik), düşük kontrast metin (WCAG AA), 44px altı dokunma hedefi.
 * Koşum: node scripts/layout-check.cjs /trips/istanbul-summer /gezi  [BASE=http://localhost:3123]
 * Playwright: projede yoksa `npx -y playwright@1 --version` ile önbelleğe alınan kopya kullanılır.
 */
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(require('child_process').execSync("ls -d ~/.npm/_npx/*/node_modules/playwright | head -1", { shell: '/bin/zsh' }).toString().trim())); }
const BASE = process.env.BASE || 'http://localhost:3123';
(async()=>{
 const b=await chromium.launch();
 const pages=process.argv.slice(2); let bad=0;
 for (const u of pages) for (const [w,cs] of [[390,'light'],[390,'dark'],[1440,'light']]) {
  const c=await b.newContext({viewport:{width:w,height:844},colorScheme:cs}); const p=await c.newPage();
  await p.goto(BASE+u,{waitUntil:'networkidle'});
  const r=await p.evaluate(()=>{
   const lum=c=>{const m=(c.match(/[\d.]+/g)||[0,0,0]).map(Number);const a=m.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
   const bg=el=>{while(el){const s=getComputedStyle(el).backgroundColor;if(s.startsWith('color('))return null;const m=s.match(/[\d.]+/g);if(m&&(m[3]===undefined||+m[3]>0.9))return s;el=el.parentElement}return null};
   const low=[];for(const e of document.querySelectorAll('body *')){if(e.closest('.sr-only,.gz-vis__frame,.gz-shelf__card'))continue;const t=[...e.childNodes].filter(n=>n.nodeType==3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');if(!t||!e.getClientRects().length)continue;const s=getComputedStyle(e);const B=bg(e);if(!B)continue;const x=lum(s.color),y=lum(B);const k=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);if(k<((parseFloat(s.fontSize)>=24)?3:4.5))low.push(t.slice(0,25)+' '+k.toFixed(2))}
   const small=[...document.querySelectorAll('a,button,summary,input')].filter(e=>!e.closest('.gz-vis__cap,.gz-source,.gz-skip')&&!e.classList.contains('gz-skip')).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim().slice(0,18),Math.round(r.height)]}).filter(x=>x[1]&&x[1]<44);
   return {sw:document.documentElement.scrollWidth, low:[...new Set(low)].slice(0,4), small:small.slice(0,4)};
  });
  const ok=r.sw<=w&&!r.low.length&&!r.small.length; if(!ok)bad++;
  console.log(ok?'✓':'✗',u,w,cs,ok?'':JSON.stringify(r)); await c.close();
 }
 await b.close(); console.log(bad?`${bad} görünümde sorun`:'tüm görünümler temiz'); process.exit(bad?1:0);
})();
