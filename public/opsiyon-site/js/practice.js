// Pratik (aralıklı tekrar), Sözlük ve Ayarlar.
import { progress, journal, caseStore, exportBackup, importBackup } from './stores.js';
import { generate } from './questions.js';
import { randomSeed } from './rng.js';
import { h, rich, label, stamp, card, primary, live, toggle, confirmDialog, focusTitle } from './ui.js';
import { questionCard } from './blocks.js';

const shuffled = (xs) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function practiceView(app) {
  const pool = () => app.units.flatMap((u) => u.lessons).filter((l) => progress.isDone(l.id))
    .flatMap((l) => l.quiz.map((q, i) => ({ key: `${l.id}#${i}`, lessonTitle: l.title, question: q })));
  const reached = () => Math.max(-1, ...app.units.filter((u) => progress.doneCount(u) > 0).map((u) => u.order));
  progress.ensureScheduled(pool().map((x) => x.key));
  app.refreshRail();

  let session = [];
  let index = 0;
  let correct = 0;

  const begin = () => {
    const items = pool();
    const byKey = new Map(items.map((x) => [x.key, x]));
    const picked = progress.dueKeys().map((k) => byKey.get(k)).filter(Boolean).slice(0, 12);
    const seen = new Set(picked.map((x) => x.key));
    for (const item of shuffled(items.filter((x) => progress.data.missed.includes(x.key)))) {
      if (picked.length < 12 && !seen.has(item.key)) { seen.add(item.key); picked.push(item); }
    }
    for (const item of shuffled(items)) {
      if (picked.length < 7 && !seen.has(item.key)) { seen.add(item.key); picked.push(item); }
    }
    const gens = generate({ level: Math.max(reached(), 0), count: 3, seed: randomSeed() })
      .map((q, i) => ({ key: `gen${i}-${crypto.randomUUID()}`, lessonTitle: 'Hesap', question: q }));
    session = [...shuffled(picked), ...gens];
    index = 0;
    correct = 0;
  };
  const labelOf = (item) => {
    if (item.key.startsWith('gen')) return 'Hesap · rakamlar her seferinde değişir';
    if (progress.data.missed.includes(item.key)) return 'Daha önce kaçırdın';
    if (progress.isDue(item.key)) return 'Tekrar zamanı';
    return 'Soru';
  };

  const startCard = (redraw) => {
    const items = pool();
    if (!items.length) {
      return card(null, h('div', { class: 't-title' }, 'Henüz soru yok.'),
        h('p', { class: 't-card' }, 'Yol sekmesinden ilk dersi bitir; dersin soruları buraya düşer ve unutmaman için belli aralıklarla geri gelir.'),
        h('a', { class: 'btn-primary as-link', href: '#/yol' }, 'İlk derse git'));
    }
    const keys = new Set(items.map((x) => x.key));
    const due = progress.dueKeys().filter((k) => keys.has(k)).length;
    const missed = items.filter((x) => progress.data.missed.includes(x.key)).length;
    const parts = [];
    if (due > 0) parts.push(`${Math.min(due, 12)} tekrar`);
    if (missed > 0) parts.push('kaçırdığın sorular');
    parts.push('3 hesap sorusu');
    return [
      card(null,
        h('div', { class: 'due-row' }, h('span', { class: `d-lg ${due > 0 ? '' : 'c-muted'}` }, String(due)), h('span', { class: 't-title' }, due > 0 ? 'soru bugün tekrar bekliyor' : 'bugün tekrar yok')),
        h('p', { class: 't-card' }, `Bu turda: ${parts.join(', ')}.`),
        primary(due > 0 ? 'Tekrara başla' : 'Serbest tur', () => { begin(); redraw(); })),
      h('p', { class: 'foot' }, 'Nasıl çalışır: doğru bildiğin soru 1 → 3 → 7 → 21 → 60 gün aralıklarla geri gelir. Yanlış yaparsan yarın tekrar sorulur. Her turda rakamı yeni üretilen 3 hesap sorusu da var; ezberle değil yöntemle çözülür.'),
    ];
  };

  const host = live((redraw) => {
    if (!session.length) {
      return h('div', { class: 'column stack' }, h('h1', { class: 'd-lg' }, 'TEKRAR MASASI'), startCard(redraw));
    }
    if (index >= session.length) {
      const left = progress.dueKeys().length;
      return h('div', { class: 'column' }, h('div', { class: 'done' },
        stamp(`${correct} / ${session.length}`, correct === session.length ? 'profit' : 'brand', 'xl pop'),
        h('h1', { class: 'd-md' }, 'Tur bitti.'),
        h('p', { class: 't-card' }, left === 0 ? 'Bugünlük tekrar bitti. Bildiklerin daha uzun aralıklarla geri gelecek.' : `Hâlâ ${left} tekrar bekliyor.`),
        primary('Yeni tur', () => { begin(); redraw(); })));
    }
    const item = session[index];
    const next = primary('Bir cevap seç', () => { index += 1; redraw(); focusTitle(host); scrollTo(0, 0); }, { enabled: false });
    return h('div', { class: 'column stack' },
      label(`${index + 1} / ${session.length} · ${item.lessonTitle}`),
      questionCard(item.question, {
        label: labelOf(item),
        onAnswer: (ok) => {
          if (ok) correct += 1;
          progress.recordPractice(item.key, ok);
          app.refreshRail();
          next.disabled = false;
          next.textContent = 'Devam';
        },
      }),
      next);
  }, { class: 'page' });

  const onKey = (e) => {
    if (e.target.matches?.('input,textarea')) return;
    if (/^[1-4]$/.test(e.key)) host.querySelector('.qcard:not(.answered)')?.pick(Number(e.key) - 1);
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && !e.target.matches?.('button,a'))) host.querySelector('.column > .btn-primary:not([disabled])')?.click();
  };
  document.addEventListener('keydown', onKey);
  host.cleanup = () => document.removeEventListener('keydown', onKey);
  return host;
}

export function glossaryView(app) {
  const seen = new Set();
  const terms = [];
  for (const u of app.units) for (const l of u.lessons) for (const p of l.pages) for (const b of p.blocks) {
    if (b.t === 'term' && !seen.has(b.en.toLocaleLowerCase('tr-TR'))) {
      seen.add(b.en.toLocaleLowerCase('tr-TR'));
      terms.push({ ...b, lessonID: l.id, lessonTitle: l.title });
    }
  }
  terms.sort((a, b) => a.en.localeCompare(b.en, 'tr'));
  const low = (s) => s.toLowerCase().replaceAll('i\u0307', 'i').replaceAll('ı', 'i').replaceAll('ö', 'o').replaceAll('ü', 'u').replaceAll('ş', 's').replaceAll('ç', 'c').replaceAll('ğ', 'g');
  let query = '';
  const count = label(`${terms.length} terim`);
  const list = live(() => {
    const q = low(query.trim());
    const rank = (t) => (low(t.en).split(/[^a-z0-9]+/).includes(q) ? 0 : low(t.en).startsWith(q) ? 0 : low(t.en).includes(q) || low(t.tr).includes(q) ? 1 : 2);
    const hits = q ? terms.filter((t) => low(t.en).includes(q) || low(t.tr).includes(q) || low(t.md).includes(q)).sort((a, b) => rank(a) - rank(b)) : terms;
    count.textContent = q ? `${hits.length} / ${terms.length} terim` : `${terms.length} terim`;
    if (!hits.length) return card(null, h('div', { class: 't-title' }, 'Bulunamadı'), h('p', { class: 't-card' }, `“${query}” sözlükte yok. Başka bir kelime dene.`));
    return h('div', { class: 'terms' }, hits.map((t) => h('article', { class: 'term' },
      h('div', { class: 'term-head' }, h('span', { class: 't-bold' }, t.en), h('span', { class: 'c-muted t-semi' }, t.tr)),
      rich(t.md, 'p', 't-card'),
      h('a', { class: 'term-link', href: `#/ders/${t.lessonID}` }, `Ders: ${t.lessonTitle}`))));
  });
  const search = h('input', {
    type: 'search', class: 'field', placeholder: 'Terim ara: delta, strike, IV…', 'aria-label': 'Sözlükte ara',
    oninput: (e) => { query = e.target.value; list.redraw(); },
  });
  return h('div', { class: 'page' }, h('div', { class: 'stack' },
    h('div', { class: 'glossary-head' }, h('div', null, h('h1', { class: 'd-lg' }, 'SÖZLÜK'), count), search),
    list));
}

export function settingsView(app) {
  const fileInput = h('input', {
    type: 'file', accept: 'application/json', class: 'sr-only', 'aria-label': 'Yedek dosyası seç',
    onchange: async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      try {
        importBackup(await f.text());
        status.textContent = 'Yedek yüklendi.';
        status.className = 'foot c-profit';
        app.refreshRail();
      } catch {
        status.textContent = 'Bu dosya okunamadı. Buradan indirdiğin yedek dosyasını seç.';
        status.className = 'foot c-loss';
      }
    },
  });
  const status = h('p', { class: 'foot', role: 'status' });
  const download = () => {
    const url = URL.createObjectURL(new Blob([exportBackup()], { type: 'application/json' }));
    const a = h('a', { href: url, download: `opsiyon-ustasi-yedek-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    URL.revokeObjectURL(url);
  };
  return h('div', { class: 'page' }, h('div', { class: 'column stack' },
    h('h1', { class: 'd-lg' }, 'AYARLAR'),
    card(null,
      toggle('Tüm kademeleri aç', 'Açıkken sınavı geçmeden ileri kademelere girebilirsin. Önerilen: kapalı.', progress.data.unlockAll, (on) => { progress.setUnlockAll(on); })),
    card(null,
      h('div', { class: 't-title' }, 'İlerlemen bu tarayıcıda'),
      h('p', { class: 't-card' }, 'Dersler, sınavlar, günlük ve vaka kararların yalnız bu bilgisayardaki bu tarayıcıda durur; telefonla paylaşılmaz. Başka tarayıcıya geçeceksen yedeğini indir, orada yükle.'),
      h('div', { class: 'row-actions' },
        h('button', { type: 'button', class: 'btn-ghost', onclick: download }, 'Yedeği indir'),
        h('label', { class: 'btn-ghost as-label' }, 'Yedeği yükle', fileInput)),
      status),
    card(null,
      h('button', {
        type: 'button', class: 'btn-danger-line',
        onclick: () => confirmDialog('Tüm dersler, sınav puanları, tekrar takvimi, günlük, sanal hesap ve vaka kararları silinir.', 'Evet, sıfırla', () => {
          progress.reset(); journal.reset(); caseStore.reset();
          app.go('#/yol');
          app.render();
        }),
      }, 'İlerlemeyi sıfırla')),
    card(null, label('Hakkında'), h('p', { class: 't-card' }, 'Eğitim amaçlıdır, yatırım tavsiyesi değildir. Örnek fiyatlar Black-Scholes modelinden üretilir; gerçek piyasa fiyatları farklıdır. Kurallar Ekim 2026 itibarıyla derlenmiştir; aracı kurumundan güncel hâlini kontrol et.'))));
}
