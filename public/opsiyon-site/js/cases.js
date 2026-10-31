// Vakalar: gerçek piyasadan "o gün sen olsan ne yapardın" dosyaları.
import { Fmt, up } from './fmt.js';
import { caseStore, CaseMath, marketClose, marketOpen, trDate, trMoment } from './stores.js';
import { Strategy, parseLeg } from './math.js';
import { h, rich, label, stamp, card, primary, live, icon, pnlClass, focusTitle } from './ui.js';
import { renderBlock } from './blocks.js';

const legsOf = (ch) => ch.legs.map(parseLeg);
const hasLegs = (ch) => ch.legs.length > 0;
const pnlAt = (ch, close, scale) => Strategy.pnlAtExpiry(legsOf(ch), close * scale);
const headline = (c, id) => {
  const ch = c.choices.find((x) => x.id === id);
  if (!ch || !hasLegs(ch)) return null;
  if (c.kind === 'live') {
    const close = caseStore.resolvedClose(c);
    return close === null ? null : pnlAt(ch, close, c.live.scale);
  }
  return c.exits?.[c.exits.length - 1]?.pnl[id] ?? null;
};
const isExpired = (c) => c.kind === 'live' && Date.now() >= marketClose(c.live.resolve_date);
const promptOf = (c) => (isExpired(c) ? c.prompt.replace(/ Kararını .*$/s, '') : c.prompt);
const watchHit = (w, close) => (w.below !== undefined ? close < w.below : close > w.above);

export function caseListView() {
  const status = (c) => {
    const d = caseStore.decision(c);
    if (d) {
      if (c.kind === 'live' && caseStore.resolvedClose(c) === null) return stamp('MÜHÜRLÜ', 'brand');
      const pnl = headline(c, d.choice);
      return pnl !== null ? h('span', { class: `num big ${pnlClass(pnl)}` }, Fmt.money(pnl)) : stamp('BEKLEDİN', 'muted');
    }
    if (isExpired(c)) return h('span', { class: 'mini c-dim' }, 'Vadesi doldu, hâlâ oynanır');
    return c.kind === 'live'
      ? h('span', { class: 'mini c-warn' }, `Son kilit: ${CaseMath.deadline(c)}`)
      : h('span', { class: 'mini c-dim' }, 'Oynanmadı');
  };
  return h('div', { class: 'page wide' }, h('div', { class: 'stack' },
    h('a', { class: 'back', href: '#/masa' }, icon('geri'), 'Masa'),
    h('h1', { class: 'd-xl' }, 'O GÜN SEN OLSAN?'),
    h('p', { class: 't-lead narrow-text' }, 'Gerçek bir günün haritası. Kararını nedeniyle kilitle, sonra piyasanın ne yaptığını gör. Kitap her zaman haklı çıkmaz.'),
    h('div', { class: 'case-grid' }, caseStore.cases.map((c) => h('a', { class: `card link-card case-card ${c.kind === 'live' && !isExpired(c) ? 'is-live' : ''}`, href: `#/masa/vaka/${c.id}` },
      h('div', { class: 'head-row' },
        c.kind === 'live' && !isExpired(c) ? h('span', { class: 'live-line c-brand label' }, icon('dalga'), 'CANLI') : h('span', { class: 'd-sm c-dim' }, c.decision.date.slice(0, 4)),
        status(c)),
      h('h2', { class: 'd-sm' }, up(c.title)),
      h('p', { class: 't-card' }, isExpired(c) ? (caseStore.decision(c) ? 'Bu vaka bitti. Kararını ve sonucu burada gör.' : 'Bu vaka bitti. Sonucu görmeden karar verip kendini sınayabilirsin.') : caseStore.decision(c) || c.kind === 'live' ? c.tagline : c.prompt),
      h('div', { class: 'mini c-dim' }, c.when))))));
}

const sections = (list) => (list ?? []).map((s) => h('section', { class: 'stack' }, h('h2', { class: 'd-xs' }, up(s.title)), s.blocks.map((b) => renderBlock(b))));

const lessonCard = (text) => card({ class: 'brand-edge' }, label('Vakadan kalan', 'c-brand'), rich(text, 'p', 't-title'));

function sourcesCard(sources) {
  return h('details', { class: 'card' },
    h('summary', { class: 'd-xs' }, `KAYNAKLAR (${sources.length})`),
    h('div', { class: 'stack-s pad-t' }, sources.map((s) => {
      let link = h('span', { class: 'foot' }, s.url);
      if (s.url.startsWith('http')) {
        try { link = h('a', { class: 'c-today foot source-link', href: s.url, target: '_blank', rel: 'noreferrer' }, new URL(s.url).host); } catch { /* düz metin kalır */ }
      }
      return h('div', null, h('div', { class: 't-semi sm' }, `K${s.n} · ${s.claim}`), h('p', { class: 'foot-m quote' }, `"${s.quote}"`), link);
    })));
}

function pitBoard(pnl, waited) {
  return card(null, h('div', { class: 'board' },
    h('div', null, label('Senin yolun'), h('div', { class: `board-v xl ${waited ? 'c-muted' : pnlClass(pnl ?? 0)}` }, waited ? '0 $' : Fmt.money(pnl ?? 0))),
    stamp(waited ? 'KENARDA' : (pnl ?? 0) >= 0 ? 'KÂRDA' : 'ZARARDA', waited ? 'muted' : (pnl ?? 0) >= 0 ? 'profit' : 'loss', 'lg pop')));
}

function otherPaths(c, mine, pnlOf) {
  return card(null, label('Diğer yollar'), c.choices.filter((x) => x.id !== mine).map((ch) => {
    const v = hasLegs(ch) ? pnlOf(ch) ?? 0 : 0;
    return h('div', { class: 'head-row path-row' }, h('span', { class: 't-card' }, ch.title), h('span', { class: `num big ${hasLegs(ch) ? pnlClass(v) : 'c-muted'}` }, hasLegs(ch) ? Fmt.money(v) : '0 $'));
  }));
}

function historyResult(c, d) {
  let exitIndex = 0;
  const box = live((redraw) => {
    const exits = c.exits ?? [];
    const ex = exits[exitIndex];
    if (!ex) return null;
    const ch = c.choices.find((x) => x.id === d.choice);
    return [
      label('Ne zaman kapatsaydın?'),
      h('div', { class: 'chips' }, exits.map((e, i) => h('button', {
        type: 'button', class: `exit-chip ${i === exitIndex ? 'is-on' : ''}`, 'aria-pressed': i === exitIndex ? 'true' : 'false',
        onclick: () => { exitIndex = i; redraw(); },
      }, e.label.split(' · ')[0]))),
      h('p', { class: 'foot-m' }, `${ex.label} · ${c.underlying.startsWith('XSP') ? 'XSP' : 'Fiyat'} ${Fmt.num(ex.S)} · IV %${Fmt.num(ex.iv * 100, 1)}`),
      pitBoard(ex.pnl[d.choice], !ch || !hasLegs(ch)),
      otherPaths(c, d.choice, (x) => ex.pnl[x.id]),
      h('p', { class: 'foot' }, 'Model fiyatı (Black-Scholes); endeks ve oynaklık girdileri gerçek. 1 kontrat.'),
    ];
  }, { class: 'stack' });
  return box;
}

function liveResult(c, d, redrawAll, locked) {
  const lv = c.live;
  const closeAt = marketClose(lv.resolve_date);
  const due = Date.now() >= closeAt;
  const resolved = caseStore.resolvedClose(c);
  const busy = caseStore.fetching.has(c.id);
  const fetchNow = async () => {
    const p = caseStore.fetchCloses(c);
    redrawAll();
    await p;
    redrawAll();
    const alert = document.querySelector('[role=alert]');
    if (alert) { alert.focus({ preventScroll: true }); alert.scrollIntoView({ block: 'center' }); } else focusTitle();
  };
  let top;
  if (resolved !== null) {
    const mine = c.choices.find((x) => x.id === d.choice);
    top = [
      h('p', { class: 'foot-m' }, `Vade · ${trDate(lv.resolve_date)} kapanışı ${Fmt.num(resolved)} → XSP ${Fmt.num(resolved * lv.scale)}`),
      pitBoard(mine ? pnlAt(mine, resolved, lv.scale) : 0, !mine || !hasLegs(mine)),
      otherPaths(c, d.choice, (x) => pnlAt(x, resolved, lv.scale)),
    ];
  } else {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(closeAt); end.setHours(0, 0, 0, 0);
    const left = Math.round((end - start) / 86_400_000);
    top = card(null,
      h('div', { class: 'board' }, h('div', null, label('Sonuç'), h('div', { class: 'board-v xl' }, due ? 'HAZIR' : left > 0 ? `${left} GÜN` : 'BUGÜN')), stamp(due ? 'AÇILABİLİR' : 'MÜHÜRLÜ', 'brand', 'lg')),
      h('p', { class: 't-card' }, due ? 'Vade kapanışı geldi. Zarfı açmak için aşağıdaki düğmeye bas.' : `Zarf ${trMoment(closeAt)}'te açılır. O ana kadar kimse sonucu bilmiyor; sen de.`));
  }
  const sess = caseStore.sessions(c);
  const watch = card(null, label('Haftanın kapanışları'),
    sess.length === 0 && h('p', { class: 't-card' }, due ? 'Haftanın kapanışları burada yok. Zarfı açınca hepsi birlikte gelir.' : 'Henüz kapanış yok. İlk kapanış ertesi iş günü akşamı (TR 23:00 sonrası) gelir.'),
    sess.map((s) => h('div', { class: 'head-row' }, h('span', { class: 't-card' }, trDate(s.date)), h('span', { class: 'num' }, Fmt.num(s.close)))),
    lv.watch.map((w) => {
      const hit = sess.some((s) => watchHit(w, s.close));
      const text = hit ? 'Oldu' : resolved !== null ? 'Olmadı' : due ? 'Zarf açılınca belli olur' : 'Henüz yok';
      return h('div', { class: 'head-row' }, h('span', { class: 't-semi sm' }, w.label), h('span', { class: `mini ${hit ? 'c-warn' : 'c-dim'}` }, text));
    }));
  const closes = caseStore.closes(c);
  let controls = null;
  if (resolved === null) {
    controls = due
      ? primary(busy ? 'Çekiliyor…' : 'Zarfı aç', fetchNow, { enabled: !busy })
      : h('button', { type: 'button', class: 'btn-ghost wide', disabled: busy, onclick: fetchNow }, icon('yenile'), busy ? 'Çekiliyor…' : 'Haftanın kapanışlarını güncelle');
  }
  const manual = due && resolved === null && (() => {
    const input = h('input', { class: 'field', placeholder: 'Örn: 7.650,25', inputmode: 'decimal', 'aria-label': 'Kapanış', oninput: () => { save.disabled = CaseMath.parseClose(input.value) === null; } });
    const save = h('button', { type: 'button', class: 'btn-ghost', disabled: true, onclick: () => { caseStore.setManualClose(c, lv.resolve_date, CaseMath.parseClose(input.value)); redrawAll(); focusTitle(); scrollTo(0, 0); } }, 'Kaydet');
    return h('details', null, h('summary', { class: 't-semi c-muted' }, `Kapanışı elle gir (${trDate(lv.resolve_date)} SPX)`), h('div', { class: 'manual-row' }, input, save));
  })();
  return h('div', { class: 'outcome-grid' },
    h('div', { class: 'stack' }, locked, top, resolved !== null && watch),
    h('div', { class: 'stack' },
      resolved === null && watch,
      caseStore.fetchError && h('p', { class: 't-semi c-loss', role: 'alert', tabindex: '-1' }, due ? caseStore.fetchError : caseStore.fetchError.replace('Kapanışı elle girebilirsin.', 'Biraz sonra tekrar dene.')),
      controls,
      closes.fetchedAt && h('p', { class: 'foot' }, `Son kontrol: ${trMoment(closes.fetchedAt)} · kaynak Yahoo Finance${closes.manual ? ' + elle giriş' : ''}`),
      manual,
      resolved !== null && sections(c.after),
      resolved !== null && lessonCard(c.lesson),
      sourcesCard(c.sources)));
}

export function caseView(id) {
  const c = caseStore.cases.find((x) => x.id === id);
  if (!c) return null;
  caseStore.fetchError = null;
  let step = caseStore.decision(c) ? 2 : 0;
  let choice = null;
  let reason = '';
  const host = live((redraw) => {
    const header = h('header', { class: 'stack-s' },
      h('a', { class: 'back', href: '#/masa/vakalar' }, icon('geri'), 'Vakalar'),
      h('h1', { class: 'd-lg' }, up(c.title)),
      label(`${c.kind === 'live' && !isExpired(c) ? 'Canlı vaka' : 'Vaka'} · ${c.when}`, c.kind === 'live' && !isExpired(c) ? 'c-brand' : ''),
      h('div', { class: 'case-steps', role: 'img', 'aria-label': `Adım ${step + 1} / 3` }, ['Hikâye', 'Karar', 'Sonuç'].map((t, i) => h('div', { class: `case-step ${i <= step ? 'on' : ''} ${i === step ? 'cur' : ''}` }, h('i'), `${i + 1} · ${t}`))));
    const toStep = (s) => { step = s; redraw(); focusTitle(host); scrollTo(0, 0); };

    if (step === 0) {
      return h('div', { class: 'column-wide stack-l' }, header,
        h('div', { class: 'story-grid' },
          h('div', { class: 'stack-l' },
            c.kind === 'live' && !isExpired(c) && h('p', { class: 't-lead' }, c.tagline),
            isExpired(c) && h('p', { class: 't-semi c-warn' }, `Bu vaka bitti (vade ${trDate(c.live.resolve_date)}). Sonucu görmeden karar verip kendini sınayabilirsin.`),
            sections(c.story),
            h('p', { class: 'foot' }, '[K1] gibi işaretler kaynak numarasıdır. Kaynak listesi sonuç ekranında açılır; kararını etkilemesin diye burada yok.')),
          card({ class: 'story-next' }, rich(promptOf(c), 'p', 't-task'), primary('Karar ver', () => toStep(1)))));
    }
    if (step === 1) {
      const ready = () => choice !== null && reason.trim().length >= 5;
      const lockBtn = primary('', () => {
        caseStore.lock(c, choice, reason.trim());
        toStep(2);
      }, { enabled: false });
      const syncLock = () => {
        lockBtn.disabled = !ready();
        lockBtn.textContent = ready() ? 'Kararı kilitle' : choice === null ? 'Önce bir yol seç' : 'Nedenini yaz';
      };
      syncLock();
      const late = c.kind === 'live' && Date.now() >= marketOpen(c.decision.date);
      const choices = live((rd) => c.choices.map((ch) => {
        const m = hasLegs(ch) ? Strategy.metrics(legsOf(ch)) : null;
        return h('button', {
          type: 'button', class: `choice ${choice === ch.id ? 'is-on' : ''}`, 'aria-pressed': choice === ch.id ? 'true' : 'false',
          onclick: () => { choice = ch.id; rd(); syncLock(); },
        },
        h('span', { class: 'radio', 'aria-hidden': 'true' }),
        h('span', { class: 'choice-t' },
          h('span', { class: 't-title' }, ch.title),
          rich(ch.md, 'span', 't-card'),
          h('span', { class: 'choice-meta' }, h('span', { class: 't-semi sm' }, CaseMath.costText(ch)), m && h('span', { class: 't-semi sm c-loss' }, `Vadede en kötü ${Fmt.money(m.maxLoss)}`))));
      }), { class: 'stack-s' });
      const input = h('textarea', {
        class: 'field', rows: 3, placeholder: 'Örn: VIX düşük, sigorta ucuz', 'aria-label': 'Neden? (tek cümle)',
        oninput: (e) => { reason = e.target.value; syncLock(); },
      });
      input.value = reason;
      return h('div', { class: 'column-wide stack' }, header,
        rich(promptOf(c), 'p', 't-task'),
        c.kind === 'live' && h('p', { class: 't-semi c-warn live-line' }, icon(late ? 'dikkat' : 'saat'), late ? `Süre geçti (son kilit ${CaseMath.deadline(c)} idi). Kilitlersen "geç kilit" etiketi alır.` : `Son kilit: ${CaseMath.deadline(c)}`),
        h('div', { class: 'decide-grid' },
          choices,
          h('div', { class: 'stack sticky-col' },
            h('div', { class: 'stack-s' }, label('Neden? (tek cümle)'), input, h('p', { class: 'foot' }, 'Sonuçta "haklı mıydım, şanslı mıydım" sorusunu bu cümleyle cevaplayacaksın.')),
            lockBtn,
            h('p', { class: 'foot' }, 'Karar, sonucu görene kadar kilitli kalır.'))));
    }
    const d = caseStore.decision(c);
    const ch = c.choices.find((x) => x.id === d.choice);
    const lateLock = c.kind === 'live' && !d.onTime;
    const locked = card(null,
      h('div', { class: 'head-row' }, label('Kilitli kararın'), stamp(lateLock ? 'GEÇ KİLİT' : 'KİLİTLENDİ', lateLock ? 'warn' : 'brand')),
      h('div', { class: 't-title' }, ch?.title ?? d.choice),
      h('p', { class: 't-card quote' }, `"${d.reason}"`));
    if (c.kind === 'live') return h('div', { class: 'column-wide stack' }, header, liveResult(c, d, redraw, locked));
    return h('div', { class: 'column-wide stack' }, header,
      h('div', { class: 'outcome-grid' },
        h('div', { class: 'stack' }, locked, historyResult(c, d)),
        h('div', { class: 'stack' }, sections(c.outcome), lessonCard(c.lesson), sourcesCard(c.sources),
          h('button', { type: 'button', class: 'link quiet center', onclick: () => { caseStore.replay(c); choice = null; reason = ''; toStep(0); } }, 'Baştan oyna'))));
  }, { class: 'page wide' });
  return host;
}
