import { chromium } from 'playwright';
const BASE = process.argv[2];
const b = await chromium.launch({...(process.env.CHROME ? {executablePath: process.env.CHROME} : {})});
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', m); };
for (const lang of ['en', 'tr']) {
  const target = `/${lang}/work/tripwalkers`, h1 = lang === 'en' ? 'Your trip' : 'Gezin planlandı';
  for (const [start, w] of [[`/${lang}/work`, 1440], [`/${lang}`, 1440], [`/${lang}/work`, 390], [`/${lang}`, 390]]) {
    const p0 = await b.newPage({ viewport: { width: w, height: 900 }, isMobile: w < 700, hasTouch: w < 700 });
    await p0.goto(BASE + start, { waitUntil: 'networkidle' });
    const n = (await p0.$$(`a[href="${target}"]`)).length; await p0.close();
    ok(n > 0, `${start} @${w}: ${n} link`);
    for (let i = 0; i < n; i++) {
      const p = await b.newPage({ viewport: { width: w, height: 900 }, isMobile: w < 700, hasTouch: w < 700 });
      await p.goto(BASE + start, { waitUntil: 'networkidle' });
      await (await p.$$(`a[href="${target}"]`))[i].evaluate(e => e.click());
      await p.waitForLoadState('load'); await p.waitForTimeout(2200);
      const t = await p.$eval('h1', e => e.innerText).catch(() => 'none');
      ok(t.replace(/\s+/g, ' ').startsWith(h1), `${start} @${w} link#${i} → ${t.slice(0, 22)}`);
      await p.close();
    }
  }
  // back button + language switch
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto(BASE + target, { waitUntil: 'networkidle' });
  const back = await p.$('.nav .back'); const bb = await back.boundingBox();
  ok(bb.width >= 44 && bb.height >= 44, `back button ${bb.width}x${bb.height}`);
  await back.click(); await p.waitForLoadState('load'); await p.waitForTimeout(1500);
  ok(p.url().endsWith(`/${lang}/work`), `back → ${p.url()}`);
  await p.goto(BASE + target, { waitUntil: 'networkidle' });
  const other = lang === 'en' ? 'tr' : 'en';
  await (await p.$(`footer a[href="/${other}/work/tripwalkers"]`)).evaluate(e => e.click());
  await p.waitForLoadState('load'); await p.waitForTimeout(2000);
  const lt = await p.evaluate(() => document.documentElement.lang);
  ok(lt === other, `language switch ${lang}→${lt}`);
  await p.close();
}
console.log(`TOTAL ${pass} pass / ${fail} fail`);
await b.close();
