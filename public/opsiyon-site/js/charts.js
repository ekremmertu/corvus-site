// Elle çizilen SVG grafikler: her zaman kapsayıcının gerçek genişliğinde çizilir, yazı ölçeklenmez.
import { Fmt } from './fmt.js';
import { SplitMix } from './rng.js';
import { Strategy, surface, price, greeks, npdf, expectedMove, pathPointsSync } from './math.js';
import { h, rich, stamp, pnlClass, label } from './ui.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tickFmt = (v, digits) => Fmt.num(v, digits).replace('-', '−');

export function niceTicks(lo, hi, count = 5) {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-6 ? 0 : v);
  return out;
}

/** Genişliği değişince yeniden çizen kutu. */
function svgHost(height, draw, attrs = {}) {
  const host = h('div', { class: 'chart', style: `height:${height}px`, ...attrs });
  let lastWidth = 0;
  const paint = () => {
    const w = host.clientWidth;
    if (w > 0) host.innerHTML = draw(w);
  };
  new ResizeObserver(() => {
    if (host.clientWidth !== lastWidth) { lastWidth = host.clientWidth; paint(); }
  }).observe(host);
  host.paint = paint;
  return host;
}

function axes({ w, H, m, x, y, xTicks, yTicks, xFmt, yFmt }) {
  let s = '';
  for (const t of yTicks) {
    s += `<line class="grid" x1="${m.l}" x2="${w - m.r}" y1="${y(t)}" y2="${y(t)}"/>`;
    s += `<text class="tick" x="${m.l - 6}" y="${y(t) + 4}" text-anchor="end">${esc(yFmt(t))}</text>`;
  }
  for (const t of xTicks) {
    s += `<line class="grid" x1="${x(t)}" x2="${x(t)}" y1="${m.t}" y2="${H - m.b}"/>`;
    s += `<text class="tick" x="${x(t)}" y="${H - m.b + 15}" text-anchor="middle">${esc(xFmt(t))}</text>`;
  }
  return s;
}

const linePath = (pts, x, y) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join('');

/**
 * İmza anı: imleci gezdir (dokunmatikte sürükle) → pit tahtası ve damga canlı değişir.
 * get(): { legs, range, today, skew, skewRef, cost, spot }
 */
export function payoffChart({ get, setSpot, height = 240 }) {
  const surf = (c, atm) => surface(atm, c.skew ?? 0, c.skewRef ?? 0);
  const expiryValue = (c, s) => Strategy.pnlAtFrontExpiry(c.legs, s, c.today?.rate ?? 0.045, surf(c, c.today?.iv ?? 0.3)) - (c.cost ?? 0);
  const todayValue = (c, s) => Strategy.pnlNow(c.legs, s, c.today.days / 365, c.today.rate, surf(c, c.today.iv)) - (c.cost ?? 0);
  const metricsOf = (c) => Strategy.metricsFull(c.legs, c.today?.rate ?? 0.045, surf(c, c.today?.iv ?? 0.3), c.cost ?? 0, c.range);

  const m = { l: 48, r: 12, t: 22, b: 22 };
  let toX = null;

  const draw = (w) => {
    const c = get();
    const [lo, hi] = c.range;
    const metrics = metricsOf(c);
    const inRange = (v) => v >= lo && v <= hi;
    const xs = [...new Set([
      ...Array.from({ length: 161 }, (_, i) => lo + ((hi - lo) * i) / 160),
      ...c.legs.filter((l) => l.strike > 0 && inRange(l.strike)).map((l) => l.strike),
      ...metrics.breakevens.filter(inRange),
    ])].sort((a, b) => a - b);
    const expiry = xs.map((s) => [s, expiryValue(c, s)]);
    const today = c.today ? xs.map((s) => [s, todayValue(c, s)]) : [];
    const vs = [...expiry, ...today].map((p) => p[1]).concat(0);
    const vlo = Math.min(...vs);
    const vhi = Math.max(...vs);
    const pad = Math.max((vhi - vlo) * 0.12, 10);
    const [ylo, yhi] = [vlo - pad, vhi + pad];
    const x = (v) => m.l + ((v - lo) / (hi - lo)) * (w - m.l - m.r);
    const y = (v) => m.t + (1 - (v - ylo) / (yhi - ylo)) * (height - m.t - m.b);
    toX = (px) => lo + ((px - m.l) / (w - m.l - m.r)) * (hi - lo);

    const area = (f) => `${linePath(expiry.map(([s, v]) => [s, f(v, 0)]), x, y)}L${x(hi)} ${y(0)}L${x(lo)} ${y(0)}Z`;
    let s = axes({ w, H: height, m, x, y, xTicks: niceTicks(lo, hi, w < 420 ? 4 : 7), yTicks: niceTicks(ylo, yhi, 4), xFmt: (t) => tickFmt(t, 0), yFmt: (t) => tickFmt(t, 0) });
    s += `<path class="area-profit" d="${area(Math.max)}"/><path class="area-loss" d="${area(Math.min)}"/>`;
    s += `<line class="zero" x1="${m.l}" x2="${w - m.r}" y1="${y(0)}" y2="${y(0)}"/>`;
    for (const be of metrics.breakevens.filter(inRange)) {
      s += `<line class="be" x1="${x(be)}" x2="${x(be)}" y1="${m.t}" y2="${height - m.b}"/>`;
      s += `<text class="tick be-t" x="${x(be)}" y="${m.t - 6}" text-anchor="middle">${esc(Fmt.num(be, 2))}</text>`;
    }
    if (today.length) s += `<path class="line-today" d="${linePath(today, x, y)}"/>`;
    s += `<path class="line-expiry" d="${linePath(expiry, x, y)}"/>`;
    const sv = Math.min(hi, Math.max(lo, c.spot));
    s += `<line class="spot" x1="${x(sv)}" x2="${x(sv)}" y1="${m.t}" y2="${height - m.b}"/>`;
    s += `<circle class="spot-dot" cx="${x(sv)}" cy="${y(expiryValue(c, sv))}" r="6.5"/>`;
    return `<svg width="${w}" height="${height}" role="presentation">${s}</svg>`;
  };

  const chart = svgHost(height, draw, {
    class: 'chart chart-drag', tabindex: '0', role: 'slider',
    'aria-label': 'Hisse fiyatı. Ok tuşlarıyla değiştir.',
  });
  const fig = h('div', { class: 'stat-t chart-note' });
  const boardLabel = label('');
  const boardValue = h('div', { class: 'board-v' });
  const boardToday = h('div', { class: 'board-t' });
  const stampSlot = h('div', { class: 'board-stamp' });
  let lastStamp = '';

  const refreshBoard = () => {
    const c = get();
    const v = expiryValue(c, c.spot);
    const metrics = metricsOf(c);
    boardLabel.textContent = Strategy.hasLaterExpiry(c.legs) ? 'Ön vadede K/Z' : 'Vadede K/Z';
    boardValue.textContent = Fmt.money(v);
    boardValue.className = `board-v ${pnlClass(v)}`;
    boardToday.replaceChildren();
    if (c.today) {
      const t = todayValue(c, c.spot);
      boardToday.append(h('span', { class: 'c-today' }, 'Bugün: '), h('span', { class: pnlClass(t) }, Fmt.money(t)));
    }
    let st = v > 0 ? ['KÂRDA', 'profit'] : ['ZARARDA', 'loss'];
    if (Number.isFinite(metrics.maxLoss) && Math.abs(v - metrics.maxLoss) < 0.5 && metrics.maxLoss < 0) st = ['MAKS ZARAR', 'loss'];
    else if (Number.isFinite(metrics.maxProfit) && Math.abs(v - metrics.maxProfit) < 0.5 && metrics.maxProfit > 0) st = ['MAKS KÂR', 'profit'];
    else if (Math.abs(v) < 0.5) st = ['BAŞA BAŞ', 'muted'];
    if (st[0] !== lastStamp) {
      lastStamp = st[0];
      stampSlot.replaceChildren(stamp(st[0], st[1], 'pop'));
    }
    fig.replaceChildren(
      h('span', null, 'Hisse: ', h('b', { class: 'num' }, Fmt.price(c.spot))),
      h('span', { class: 'only-hover' }, 'İmleci gezdir ya da grafiğe tıklayıp ok tuşlarını kullan'),
      h('span', { class: 'only-touch' }, 'Grafiğin üstünde sürükle'));
    chart.setAttribute('aria-valuemin', c.range[0]);
    chart.setAttribute('aria-valuemax', c.range[1]);
    chart.setAttribute('aria-valuenow', c.spot);
    chart.setAttribute('aria-valuetext', `Hisse ${Fmt.price(c.spot)}, ${Fmt.money(v)}`);
  };

  const update = () => { chart.paint(); refreshBoard(); };
  const pick = (e) => {
    if (!toX) return;
    const c = get();
    const box = chart.getBoundingClientRect();
    const s = Math.round(Math.min(c.range[1], Math.max(c.range[0], toX(e.clientX - box.left))) * 2) / 2;
    if (s !== c.spot) { setSpot(s); update(); }
  };
  chart.addEventListener('pointerdown', (e) => { chart.setPointerCapture(e.pointerId); pick(e); });
  chart.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons) pick(e); });
  chart.addEventListener('keydown', (e) => {
    const c = get();
    const step = (c.range[1] - c.range[0]) / 40;
    const moves = { ArrowRight: c.spot + step, ArrowUp: c.spot + step, ArrowLeft: c.spot - step, ArrowDown: c.spot - step, PageUp: c.spot + step * 5, PageDown: c.spot - step * 5, Home: c.range[0], End: c.range[1] };
    const next = moves[e.key];
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    setSpot(Math.round(Math.min(c.range[1], Math.max(c.range[0], next)) * 2) / 2);
    update();
  });

  refreshBoard();
  const el = h('div', { class: 'payoff' },
    h('div', { class: 'board' }, h('div', null, boardLabel, boardValue, boardToday), stampSlot),
    chart, fig);
  return { el, update };
}

export function payoffBlock(spec) {
  const lo = spec.range?.[0] ?? spec.spot * 0.7;
  const hi = spec.range?.length > 1 ? spec.range[1] : spec.spot * 1.3;
  const legs = spec.legs;
  let spot = spec.spot;
  const today = spec.today ? { days: spec.today.days, iv: spec.today.iv, rate: spec.today.r ?? 0.045 } : null;
  return payoffChart({ get: () => ({ legs, range: [lo, Math.max(hi, lo + 1)], today, spot }), setSpot: (v) => { spot = v; } }).el;
}

const SERIES = ['#F4F1EA', '#7CC4FF', '#FF3EA5', '#FFB454', '#3DDC97'];

function curveModel(spec) {
  const p = spec;
  const num = (k, d) => (typeof p[k] === 'number' ? p[k] : d);
  const r = num('r', 0.045);
  const kind = p.option ?? (p.kind_option) ?? 'call';
  const optKind = ['call', 'put'].includes(p.opt) ? p.opt : kind;
  switch (p.curve) {
    case 'theta_decay': {
      const [S, K, iv, maxD] = [num('S', 100), num('K', 100), num('iv', 0.3), num('maxDays', 90)];
      const step = Math.max(maxD / 120, 0.25);
      const pts = [];
      for (let d = maxD; d >= 0; d -= step) pts.push([d, price(optKind, S, K, d / 365, r, iv)]);
      return { series: [['Fiyat', pts]], xLabel: 'Vadeye kalan gün', yLabel: 'Opsiyon fiyatı ($)', reverseX: true, zero: true };
    }
    case 'price_vs_spot': case 'delta_vs_spot': case 'gamma_vs_spot': case 'vega_vs_spot': {
      const [K, iv] = [num('K', 100), num('iv', 0.3)];
      const days = Array.isArray(p.days) ? p.days : [num('days', 30)];
      const [lo, hi] = [num('lo', K * 0.7), num('hi', K * 1.3)];
      const series = days.map((d) => {
        const pts = [];
        for (let i = 0; i <= 120; i++) {
          const s = lo + ((hi - lo) * i) / 120;
          let y;
          if (p.curve === 'price_vs_spot') y = price(optKind, s, K, d / 365, r, iv);
          else if (p.curve === 'delta_vs_spot') y = greeks(optKind, s, K, d / 365, r, iv).delta;
          else if (p.curve === 'gamma_vs_spot') y = d > 0 ? greeks('call', s, K, d / 365, r, iv).gamma : 0;
          else y = d > 0 ? greeks('call', s, K, d / 365, r, iv).vega : 0;
          pts.push([s, y]);
        }
        return [d === 0 ? 'Vade günü' : `${Fmt.num(d, 0)} gün`, pts];
      });
      const yLabel = { price_vs_spot: 'Opsiyon fiyatı ($)', delta_vs_spot: 'Delta', gamma_vs_spot: 'Gamma', vega_vs_spot: 'Vega ($ / 1 IV puanı)' }[p.curve];
      return { series, xLabel: 'Hisse fiyatı ($)', yLabel, zero: true };
    }
    case 'price_vs_iv': {
      const [S, K, d] = [num('S', 100), num('K', 100), num('days', 30)];
      const pts = [];
      for (let i = 10; i <= 100; i++) pts.push([i, price(optKind, S, K, d / 365, r, i / 100)]);
      return { series: [['Fiyat', pts]], xLabel: 'IV (%)', yLabel: 'Opsiyon fiyatı ($)', zero: true };
    }
    case 'smile': {
      const pts = (p.points ?? []).filter((a) => a.length === 2).map(([x, y]) => [x, y <= 1.5 ? y * 100 : y]);
      return { series: [['IV', pts]], xLabel: 'Strike ($)', yLabel: 'IV (%)', dots: true, note: 'Örnek veri.' };
    }
    case 'distribution': {
      const [S, iv, d] = [num('S', 100), num('iv', 0.3), num('days', 30)];
      const sd = iv * Math.sqrt(d / 365);
      const mu = Math.log(S) - 0.5 * sd * sd;
      const [lo, hi] = [S * Math.exp(-3.2 * sd), S * Math.exp(3.2 * sd)];
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const x = lo + ((hi - lo) * i) / 160;
        pts.push([x, npdf((Math.log(x) - mu) / sd) / (x * sd)]);
      }
      const em = expectedMove(S, iv, d);
      return { series: [['Olasılık', pts]], xLabel: 'Vadede hisse fiyatı ($)', yLabel: 'Olasılık yoğunluğu', band: [S - em, S + em], zero: true, topPad: 1.15 };
    }
    case 'path':
      return { series: [['Fiyat', pathPointsSync({ S: num('S', 100), iv: num('iv', 0.3), days: num('days', 30), seed: num('seed', 7), events: p.events ?? [] }, SplitMix)]], xLabel: 'Gün', yLabel: 'Hisse fiyatı ($)', note: 'Simülasyon — gerçek fiyat değil.' };
    default:
      return null;
  }
}

/** Ders JSON'unda eğri türü `kind`, opsiyon türü `params.kind` içindedir. */
export function normalizeCurve(b) {
  const params = b.params ?? b;
  return { ...params, curve: b.kind, opt: params.kind };
}

export function curveBlock(b) {
  const model = curveModel(normalizeCurve(b));
  if (!model) return null;
  const all = model.series.flatMap(([, pts]) => pts);
  const allX = all.map((p) => p[0]);
  const allY = all.map((p) => p[1]);
  const [xlo, xhi] = [Math.min(...allX), Math.max(...allX)];
  let ylo = Math.min(...allY);
  let yhi = Math.max(...allY);
  if (model.zero) ylo = Math.min(ylo, 0);
  if (model.topPad) yhi *= model.topPad;
  else { const pad = (yhi - ylo) * 0.08 || 1; yhi += pad; if (!model.zero) ylo -= pad; }
  const height = 240;
  const m = { l: 48, r: 14, t: 16, b: 38 };
  let hover = null;

  const draw = (w) => {
    const x = (v) => {
      const f = (v - xlo) / (xhi - xlo);
      return m.l + (model.reverseX ? 1 - f : f) * (w - m.l - m.r);
    };
    const y = (v) => m.t + (1 - (v - ylo) / (yhi - ylo)) * (height - m.t - m.b);
    const small = yhi - ylo < 3;
    let s = axes({
      w, H: height, m, x, y,
      xTicks: niceTicks(xlo, xhi, w < 420 ? 4 : 6), yTicks: niceTicks(ylo, yhi, 4),
      xFmt: (t) => tickFmt(t, Math.abs(t) < 10 && t !== Math.round(t) ? 2 : 0),
      yFmt: (t) => tickFmt(t, small ? (yhi - ylo < 0.2 ? 3 : 2) : Math.abs(t) < 1 && t !== 0 ? 2 : 0),
    });
    if (model.band) {
      s += `<rect class="band" x="${x(model.band[0])}" width="${x(model.band[1]) - x(model.band[0])}" y="${m.t}" height="${height - m.t - m.b}"/>`;
      s += `<text class="tick c-brand-f" x="${(x(model.band[0]) + x(model.band[1])) / 2}" y="${m.t + 12}" text-anchor="middle">±1σ</text>`;
    }
    model.series.forEach(([, pts], i) => {
      s += `<path class="curve" stroke="${SERIES[i % SERIES.length]}" d="${linePath(pts, x, y)}"/>`;
    });
    if (model.dots) for (const [px, py] of all) s += `<circle class="spot-dot sm" cx="${x(px)}" cy="${y(py)}" r="4"/>`;
    s += `<text class="axis-t" x="${(m.l + w - m.r) / 2}" y="${height - 4}" text-anchor="middle">${esc(model.xLabel)}</text>`;
    if (hover !== null) {
      const hx = x(hover);
      s += `<line class="spot thin" x1="${hx}" x2="${hx}" y1="${m.t}" y2="${height - m.b}"/>`;
    }
    host.toValue = (px) => {
      const f = Math.min(1, Math.max(0, (px - m.l) / (w - m.l - m.r)));
      return xlo + (model.reverseX ? 1 - f : f) * (xhi - xlo);
    };
    return `<svg width="${w}" height="${height}" role="img" aria-label="${esc(b.title ?? model.yLabel)}">${s}</svg>`;
  };
  const host = svgHost(height, draw);
  const readout = h('div', { class: 'readout' }, h('span', { class: 'stat-t' }, model.yLabel));
  const nearest = (pts, v) => pts.reduce((a, c) => (Math.abs(c[0] - v) < Math.abs(a[0] - v) ? c : a));
  const fmtY = (v) => Fmt.num(v, Math.abs(v) < 1 ? 3 : 2);
  host.addEventListener('pointermove', (e) => {
    if (!host.toValue) return;
    const v = host.toValue(e.clientX - host.getBoundingClientRect().left);
    hover = v;
    host.paint();
    readout.replaceChildren(
      h('span', { class: 'stat-t' }, `${model.xLabel}: ${Fmt.num(v, xhi - xlo < 20 ? 1 : 0)}`),
      ...model.series.map(([name, pts], i) => h('span', { class: 'num', style: `color:${SERIES[i % SERIES.length]}` }, `${model.series.length > 1 ? `${name} ` : ''}${fmtY(nearest(pts, v)[1])}`)));
  });
  host.addEventListener('pointerleave', () => {
    hover = null;
    host.paint();
    readout.replaceChildren(h('span', { class: 'stat-t' }, model.yLabel));
  });
  return h('div', { class: 'card' },
    b.title && h('div', { class: 't-bold' }, b.title),
    host,
    readout,
    model.series.length > 1 && h('div', { class: 'legend' }, model.series.map(([name], i) => h('span', null, h('i', { style: `background:${SERIES[i % SERIES.length]}` }), name))),
    model.note && h('div', { class: 'foot' }, model.note),
    b.caption && rich(b.caption, 'p', 'caption'));
}

/** Trade Masası fiyat yolu. */
export function deskPathChart(session) {
  const height = 280;
  const m = { l: 48, r: 14, t: 18, b: 24 };
  const draw = (w) => {
    const sc = session.scenario;
    const pts = sc.path.slice(0, session.day + 1).map((d, i) => [i, d.spot]);
    const strikes = [...new Set(session.entryLegs.filter((l) => l.kind !== 'stock').map((l) => l.strike))].sort((a, b) => a - b);
    const all = [...pts.map((p) => p[1]), ...strikes, sc.start.spot];
    const [lo, hi] = [Math.min(...all) * 0.97, Math.max(...all) * 1.03];
    const x = (v) => m.l + (v / sc.days) * (w - m.l - m.r);
    const y = (v) => m.t + (1 - (v - lo) / (hi - lo)) * (height - m.t - m.b);
    let s = axes({ w, H: height, m, x, y, xTicks: niceTicks(0, sc.days, 5), yTicks: niceTicks(lo, hi, 4), xFmt: (t) => `${Math.round(t)}. gün`, yFmt: (t) => tickFmt(t, 0) });
    for (const k of strikes) {
      s += `<line class="strike" x1="${m.l}" x2="${w - m.r}" y1="${y(k)}" y2="${y(k)}"/>`;
      s += `<text class="tick c-warn-f" x="${m.l + 4}" y="${y(k) - 4}">Strike ${esc(Fmt.num(k, 1))}</text>`;
    }
    if (sc.earningsDay !== null) {
      s += `<line class="be" x1="${x(sc.earningsDay)}" x2="${x(sc.earningsDay)}" y1="${m.t}" y2="${height - m.b}"/>`;
      s += `<text class="tick" x="${x(sc.earningsDay)}" y="${m.t - 6}" text-anchor="middle">bilanço</text>`;
    }
    s += `<path class="line-expiry" d="${linePath(pts, x, y)}"/>`;
    const last = pts[pts.length - 1];
    s += `<circle class="spot-dot" cx="${x(last[0])}" cy="${y(last[1])}" r="6"/>`;
    return `<svg width="${w}" height="${height}" role="img" aria-label="Hisse fiyat yolu, gün ${session.day}">${s}</svg>`;
  };
  return svgHost(height, draw);
}
