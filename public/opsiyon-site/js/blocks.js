// Learn/BlockView.swift ve Charts/ChainView.swift karşılığı.
import { Fmt, up } from './fmt.js';
import { price, greeks, intrinsic, bidAsk, parseLeg } from './math.js';
import { drillQuestion, missedRule } from './questions.js';
import { randomSeed } from './rng.js';
import { h, rich, label, stamp, card, primary, icon, ghost, fill } from './ui.js';
import { payoffBlock, curveBlock } from './charts.js';

export function parsePayoff(b) {
  return { ...b, legs: b.legs.map(parseLeg) };
}

export function parsePreset(p) {
  return { legs: p.legs.map(parseLeg), spot: p.spot, days: p.days, iv: p.iv, r: p.r ?? 0.045 };
}

function accentCard(lab, tone, title, md) {
  return card({ class: 'accent-card' },
    h('i', { class: `dot bg-${tone}`, 'aria-hidden': 'true' }),
    label(lab, `c-${tone}`),
    title && h('div', { class: 't-title' }, title),
    rich(md, 'p', 't-card'));
}

function tableBlock(b) {
  return card({ class: 'tight' }, h('div', { class: 'table-scroll', tabindex: '0' }, h('table', { class: 'tbl' },
    h('thead', null, h('tr', null, b.head.map((c) => h('th', { scope: 'col' }, up(c))))),
    h('tbody', null, b.rows.map((row) => h('tr', null, row.map((c, i) => h('td', { class: i === 0 ? 'first' : '' }, rich(c)))))))));
}

const CALC_ORDER = ['price', 'intrinsic', 'extrinsic', 'delta', 'gamma', 'theta', 'vega', 'rho', 'p_itm'];

function calcBlock(b) {
  const s = { r: 0.045, q: 0, ...b.bs };
  const t = s.days / 365;
  const p = price(s.kind, s.S, s.K, t, s.r, s.iv, s.q);
  const intr = intrinsic(s.kind, s.S, s.K);
  const g = greeks(s.kind, s.S, s.K, t, s.r, s.iv, s.q);
  const rows = {
    price: ['Prim', Fmt.price(p)],
    intrinsic: ['İçsel değer', Fmt.price(intr)],
    extrinsic: ['Zaman değeri', Fmt.price(p - intr)],
    delta: ['Delta', Fmt.num(g.delta, 2)],
    gamma: ['Gamma', Fmt.num(g.gamma, 3)],
    theta: ['Theta / gün', `${Fmt.signed(g.theta, 3)} $`],
    vega: ['Vega / 1 puan', `${Fmt.num(g.vega, 3)} $`],
    rho: ['Rho / 1 puan', `${Fmt.num(g.rho, 3)} $`],
    p_itm: ['ITM bitme olasılığı', Fmt.pct(g.pITM, 0)],
  };
  const shown = CALC_ORDER.filter((k) => b.claims?.[k] !== undefined);
  return card(null,
    b.title && h('div', { class: 't-bold' }, b.title),
    h('div', { class: 'label-row' }, `${s.kind === 'call' ? 'Call' : 'Put'} · hisse ${Fmt.price(s.S)} · strike ${Fmt.price(s.K)} · ${Fmt.num(s.days, 0)} gün · IV ${Fmt.pct(s.iv)}`),
    h('div', { class: 'grid-2' }, shown.map((k) => h('div', { class: 'stat' }, h('div', { class: 'stat-t' }, rows[k][0]), h('div', { class: 'stat-v' }, rows[k][1])))),
    h('div', { class: 'foot' }, 'Hisse başına. 1 kontrat = 100 hisse.'),
    b.caption && rich(b.caption, 'p', 'caption'));
}

export function chainBlock(spec) {
  const r = spec.r ?? 0.045;
  const skew = spec.skew ?? 0;
  const hl = spec.highlight ?? (spec.highlightKind ? { kind: spec.highlightKind, strike: spec.highlightStrike } : null);
  const rows = [...spec.strikes].sort((a, b) => a - b).map((k) => {
    const iv = Math.max(0.05, spec.iv + (skew * (spec.S - k)) / spec.S);
    const t = spec.days / 365;
    return { k, c: bidAsk(price('call', spec.S, k, t, r, iv)), p: bidAsk(price('put', spec.S, k, t, r, iv)) };
  });
  const cell = (v, itm, on) => h('td', { class: `num ${on ? 'hl' : itm ? 'itm' : ''}` }, Fmt.num(v, 2));
  return card({ class: 'tight' },
    label(`Örnek zincir · hisse ${Fmt.price(spec.S)} · ${Fmt.num(spec.days, 0)} gün`),
    h('div', { class: 'table-scroll', tabindex: '0' }, h('table', { class: 'chain' },
      h('thead', null, h('tr', null, ['CALL BID', 'ASK', 'STRIKE', 'PUT BID', 'ASK'].map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', null, rows.map((row) => {
        const [callOn, putOn] = [hl?.kind === 'call' && hl.strike === row.k, hl?.kind === 'put' && hl.strike === row.k];
        return h('tr', null,
          cell(row.c.bid, row.k < spec.S, callOn), cell(row.c.ask, row.k < spec.S, callOn),
          h('td', { class: 'num strike' }, Fmt.num(row.k, row.k === Math.round(row.k) ? 0 : 1)),
          cell(row.p.bid, row.k > spec.S, putOn), cell(row.p.ask, row.k > spec.S, putOn));
      })))),
    h('div', { class: 'foot' }, 'Koyu zemin = ITM (paranın içinde). Fiyatlar öğretim için modelden üretildi, piyasa verisi değil.'),
    spec.caption && rich(spec.caption, 'p', 'caption'));
}

function factSheet(lines, flag) {
  return h('div', { class: 'facts' }, lines.flatMap((line) => line.split(' · ').map((part) => {
    const [name, ...rest] = part.split(': ');
    const bad = name === flag;
    return h('div', { class: `fact ${bad ? 'is-bad' : ''}` },
      h('span', { class: 'fact-n' }, name),
      h('span', { class: 'fact-v' }, rest.join(': '), bad && h('span', { class: 'sr-only' }, ' (bozuk kural)')));
  })));
}

/** Şık: 1–4 tuşu ya da tık. Sayfada cevaplanmamış ilk kart klavyeyi dinler. */
const checkPicks = new WeakMap();

export function questionCard(q, { label: lab = 'Soru', collapses = false, onAnswer = () => {}, bare = false, initial = null } = {}) {
  let picked = initial;
  const el = h('div', { class: `qcard ${bare ? '' : 'card'}` });
  const paint = () => {
    const lines = q.q.split('\n');
    const isSheet = lines.length > 2 && lines.slice(1).every((l) => l.includes(': '));
    el.classList.toggle('answered', picked !== null);
    fill(el,
      lab && label(lab, 'c-brand'),
      isSheet ? rich(lines[0], 'div', 't-q') : rich(q.q, 'div', 't-q'),
      isSheet && factSheet(lines.slice(1), picked === null ? null : q.flag),
      h('div', { class: 'opts' }, q.options.map((opt, i) => {
        if (collapses && picked !== null && i !== q.answer && i !== picked) return null;
        const state = picked === null ? '' : i === q.answer ? 'is-right' : i === picked ? 'is-wrong' : '';
        return h('button', {
          type: 'button', class: `opt ${state}`, disabled: picked !== null,
          onclick: () => choose(i),
        },
        h('kbd', { class: 'only-hover', 'aria-hidden': 'true' }, String(i + 1)),
        rich(opt, 'span', 'opt-t'),
        state === 'is-right' && h('span', { class: 'opt-mark c-profit' }, icon('tik'), h('span', { class: 'sr-only' }, 'Doğru cevap')),
        state === 'is-wrong' && h('span', { class: 'opt-mark c-loss' }, icon('kapat'), h('span', { class: 'sr-only' }, 'Senin cevabın, yanlış')));
      })),
      picked !== null && h('div', { class: 'explain', role: 'status', tabindex: '-1' },
        h('div', { class: `t-verdict ${picked === q.answer ? 'c-profit' : 'c-loss'}` }, picked === q.answer ? 'Doğru.' : 'Yanlış.'),
        picked !== q.answer && q.refutes?.[q.options[picked]] && h('div', { class: 't-refute' }, q.refutes[q.options[picked]]),
        rich(q.explain, 'p', 't-card')));
  };
  const choose = (i) => {
    if (picked !== null || i < 0 || i >= q.options.length) return;
    picked = i;
    paint();
    onAnswer(i === q.answer, i);
    el.querySelector('.explain')?.focus({ preventScroll: true });
    el.querySelector('.explain')?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  el.pick = choose;
  paint();
  return el;
}

function drillCard(b, link) {
  const saved = link.saved;
  let seed = randomSeed();
  let round = 1;
  let results = saved?.results ?? [];
  let missed = saved?.missed ?? [];
  let finished = saved != null;
  let attempt = 1;
  const rounds = b.rounds;

  const outcome = () => {
    const correct = results.filter(Boolean).length;
    return { results, missed, correct, isClean: correct === results.length, isSolid: correct * 3 >= results.length * 2 };
  };
  const el = h('div', { class: 'drill' });

  const next = () => {
    link.onNextReady(null);
    if (round < rounds) {
      round += 1;
    } else {
      finished = true;
      link.onStartedChange(false);
      link.onFinished(outcome());
    }
    paint();
    el.scrollIntoView({ block: 'start' });
  };
  const restart = () => {
    attempt += 1;
    seed = randomSeed();
    round = 1;
    results = [];
    missed = [];
    finished = false;
    link.onStartedChange(false);
    link.onRestart();
    paint();
  };

  const resultView = () => {
    const o = outcome();
    const verdict = o.isClean
      ? 'Hepsi doğru. Gerçek işlemde de yöntem aynı: önce hesapla, sonra aç.'
      : o.isSolid ? 'Yöntem oturuyor. Kaçırdıklarına bir kez daha bak.'
        : 'Yöntem henüz oturmadı. Bir tur daha at; rakamlar değişir, yöntem aynı kalır.';
    const uniq = [...new Set(o.missed)].map((line) => {
      const times = o.missed.filter((x) => x === line).length;
      const [head, tail] = line.split(' → ');
      return [times > 1 ? `${head} · ${times} kez` : head, tail];
    });
    return card(null,
      h('div', { class: 'drill-score' },
        h('div', { class: `t-score ${o.isClean ? 'c-profit' : ''}` }, `${o.correct} / ${rounds} DOĞRU`),
        stamp(o.isClean ? 'TEMİZ TUR' : o.isSolid ? 'OTURUYOR' : 'TEKRAR', o.isClean ? 'profit' : o.isSolid ? 'brand' : 'loss', 'pop lg')),
      h('div', { class: 'pips', role: 'img', 'aria-label': `${o.correct} doğru, ${results.length - o.correct} yanlış` }, results.map((ok) => h('i', { class: ok ? 'ok' : 'no' }))),
      h('div', { class: 't-refute' }, verdict),
      uniq.length > 0 && h('div', { class: 'missed' },
        h('div', { class: 't-missed c-loss' }, 'Kaçırdıkların'),
        uniq.map(([head, tail]) => h('div', null, h('div', { class: 't-semi' }, head), tail && h('div', { class: 'foot' }, tail)))),
      o.isSolid ? ghost('Yeni rakamlarla tekrar', restart, 'wide brand-line') : primary('Yeni rakamlarla tekrar', restart));
  };

  const paint = () => {
    const head = h('div', { class: 'drill-head' },
      label(finished ? `Antrenman · ${b.title}` : attempt > 1 ? `Antrenman · ${attempt}. tur` : 'Antrenman', 'c-brand'),
      !finished && h('span', { class: 'num drill-count', 'aria-label': `Soru ${round} / ${rounds}` }, `${round} / ${rounds}`));
    if (finished) { el.replaceChildren(head, resultView()); return; }
    const q = drillQuestion(b.kinds, round, seed);
    el.replaceChildren(head,
      h('div', { class: 't-h2' }, b.title),
      rich(b.prompt, 'p', 't-card'),
      q ? questionCard(q, {
        label: '', collapses: true,
        onAnswer: (ok) => {
          results = [...results, ok];
          link.onStartedChange(true);
          if (!ok) missed = [...missed, missedRule(b.kinds[(round - 1) % b.kinds.length], q)];
          link.onNextReady({ title: round < rounds ? 'Sonraki soru' : 'Skoru gör', action: next });
        },
      }) : card(null, h('p', { class: 't-card' }, 'Bu soru açılamadı. Antrenmanı atlayıp derse devam edebilirsin.')));
  };
  paint();
  return el;
}

const VISUAL = new Set(['payoff', 'curve', 'calc', 'chain', 'table']);
export const isVisual = (b) => VISUAL.has(b.t);

export function renderBlock(b, ctx = {}) {
  switch (b.t) {
    case 'text': return rich(b.md, 'p', 't-body');
    case 'analogy': return accentCard('Benzetme', 'brand', b.title, b.md);
    case 'example': return accentCard('Gerçek hayattan', 'today', b.title, b.md);
    case 'warn':
      return h('div', { class: 'warn' }, icon('dikkat', 'c-warn'), h('div', null, label('Dikkat', 'c-warn'), rich(b.md, 'p', 't-warn')));
    case 'term':
      return card(null, h('div', { class: 'term-head' }, h('span', { class: 't-term' }, b.en), h('span', { class: 'c-muted t-semi' }, b.tr)), rich(b.md, 'p', 't-card'));
    case 'steps':
      return card(null, b.title && h('div', { class: 't-bold' }, b.title), h('ol', { class: 'steps' }, b.items.map((item, i) => h('li', null, h('span', { class: 'step-n', 'aria-hidden': 'true' }, String(i + 1)), rich(item)))));
    case 'table': return tableBlock(b);
    case 'payoff': {
      const m = parsePayoff(b);
      return card(null, b.title && h('div', { class: 't-bold' }, b.title), payoffBlock(m), metricsSlot(m), b.caption && rich(b.caption, 'p', 'caption'));
    }
    case 'curve': return curveBlock(b);
    case 'calc': return calcBlock(b);
    case 'chain': return chainBlock(b);
    case 'lab':
      return h('button', { type: 'button', class: 'lab-link', onclick: () => ctx.openLab?.(parsePreset(b.preset)) },
        h('span', { class: 'lab-ico' }, icon('kaydirac')),
        h('span', { class: 'lab-t' }, label('Laboratuvarda dene', 'c-brand'), rich(b.prompt, 'span', 't-semi')),
        icon('ileri', 'c-muted'));
    case 'check': return questionCard(b, { label: 'Kendini dene', initial: checkPicks.get(b) ?? null, onAnswer: (_, i) => checkPicks.set(b, i) });
    case 'drill': return drillCard(b, ctx.drillLink ?? { onFinished() {}, onRestart() {}, onStartedChange() {}, onNextReady() {} });
    default: return null;
  }
}

let metricsImpl = null;
export const setMetricsRow = (f) => { metricsImpl = f; };
const metricsSlot = (m) => metricsImpl?.(m);
