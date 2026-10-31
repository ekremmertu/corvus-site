// tools/motor.py ve OptionMath.swift'in birebir karşılığı.
// Birimler: prim hisse başına, T yıl, theta günlük, vega/rho 1 puan başına, 1 kontrat = 100 hisse.

export const MULTIPLIER = 100;

/** Swift .rounded(): .5 sıfırdan uzağa. */
export const rnd = (v) => Math.sign(v) * Math.round(Math.abs(v));
export const cents = (v) => rnd(v * 100) / 100;

export function erf(x) {
  const a = Math.abs(x);
  let r;
  if (a < 3) {
    let term = a;
    let sum = a;
    for (let n = 1; n < 200; n++) {
      term *= (2 * a * a) / (2 * n + 1);
      sum += term;
      if (term < 1e-17 * sum) break;
    }
    r = (2 / Math.sqrt(Math.PI)) * Math.exp(-a * a) * sum;
  } else {
    let f = 0;
    for (let k = 60; k >= 1; k--) f = (k / 2) / (a + f);
    r = 1 - Math.exp(-a * a) / (Math.sqrt(Math.PI) * (a + f));
  }
  return x < 0 ? -r : r;
}

export const ncdf = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
export const npdf = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

export function intrinsic(kind, s, k) {
  if (kind === 'call') return Math.max(s - k, 0);
  if (kind === 'put') return Math.max(k - s, 0);
  return s - k;
}

function d1d2(s, k, t, r, v, q) {
  const vt = v * Math.sqrt(t);
  const d1 = (Math.log(s / k) + (r - q + 0.5 * v * v) * t) / vt;
  return [d1, d1 - vt];
}

export function price(kind, s, k, t, r, v, q = 0) {
  if (kind === 'stock') return s;
  if (!(t > 0 && v > 0)) return intrinsic(kind, s, k);
  const [d1, d2] = d1d2(s, k, t, r, v, q);
  if (kind === 'call') return s * Math.exp(-q * t) * ncdf(d1) - k * Math.exp(-r * t) * ncdf(d2);
  return k * Math.exp(-r * t) * ncdf(-d2) - s * Math.exp(-q * t) * ncdf(-d1);
}

export function greeks(kind, s, k, t, r, v, q = 0) {
  if (kind === 'stock') return { delta: 1, gamma: 0, theta: 0, vega: 0, rho: 0, pITM: 1 };
  if (!(t > 0 && v > 0)) {
    const itm = intrinsic(kind, s, k) > 0;
    return { delta: itm ? (kind === 'call' ? 1 : -1) : 0, gamma: 0, theta: 0, vega: 0, rho: 0, pITM: itm ? 1 : 0 };
  }
  const [d1, d2] = d1d2(s, k, t, r, v, q);
  const eq = Math.exp(-q * t);
  const er = Math.exp(-r * t);
  const gamma = (eq * npdf(d1)) / (s * v * Math.sqrt(t));
  const vega = (s * eq * npdf(d1) * Math.sqrt(t)) / 100;
  const common = (-s * eq * npdf(d1) * v) / (2 * Math.sqrt(t));
  if (kind === 'call') {
    return {
      delta: eq * ncdf(d1), gamma, vega,
      theta: (common - r * k * er * ncdf(d2) + q * s * eq * ncdf(d1)) / 365,
      rho: (k * t * er * ncdf(d2)) / 100,
      pITM: ncdf(d2),
    };
  }
  return {
    delta: -eq * ncdf(-d1), gamma, vega,
    theta: (common + r * k * er * ncdf(-d2) - q * s * eq * ncdf(-d1)) / 365,
    rho: (-k * t * er * ncdf(-d2)) / 100,
    pITM: ncdf(-d2),
  };
}

export const expectedMove = (s, vol, days) => s * vol * Math.sqrt(days / 365);
export const annualizedYield = (premium, strike, days) => ((premium / strike) * 365) / days;

export function bidAsk(mid) {
  const half = Math.max(0.02, mid * 0.03);
  return {
    bid: Math.max(0, Math.floor((mid - half) * 100) / 100),
    ask: Math.max(0.01, Math.ceil((mid + half) * 100) / 100),
  };
}

export function surface(atm, skew = 0, ref = 0) {
  return {
    atm, skew, ref,
    iv(k) { return !skew || ref <= 0 ? atm : Math.max(0.05, atm + (skew * (ref - k)) / ref); },
  };
}

export const COMMISSION = 0.65;

let legCounter = 0;
export function makeLeg(kind, qty, strike = 0, premium = 0, extraDays = 0) {
  legCounter += 1;
  return { id: `leg${legCounter}`, kind, qty, strike, premium, extraDays };
}

export const parseLeg = (j) => makeLeg(j.kind, j.qty, j.strike ?? 0, j.premium ?? 0, j.extra_days ?? 0);

export function roundTripCost(legs, spot, years, rate, surf) {
  return legs.filter((l) => l.kind !== 'stock').reduce((acc, l) => {
    const mid = price(l.kind, spot, l.strike, years + l.extraDays / 365, rate, surf.iv(l.strike));
    const q = bidAsk(mid);
    return acc + Math.abs(l.qty) * (2 * COMMISSION + (q.ask - q.bid) * MULTIPLIER);
  }, 0);
}

export function legPnlAtExpiry(l, s) {
  if (l.kind === 'stock') return l.qty * (s - l.strike);
  return l.qty * MULTIPLIER * (intrinsic(l.kind, s, l.strike) - l.premium);
}

function legPnlNow(l, s, years, rate, vol) {
  if (l.kind === 'stock') return l.qty * (s - l.strike);
  return l.qty * MULTIPLIER * (price(l.kind, s, l.strike, years + l.extraDays / 365, rate, vol) - l.premium);
}

const uniqSorted = (xs) => [...new Set(xs)].sort((a, b) => a - b);

export const Strategy = {
  pnlAtExpiry: (legs, s) => legs.reduce((a, l) => a + legPnlAtExpiry(l, s), 0),
  pnlNow: (legs, s, years, rate, surf) => legs.reduce((a, l) => a + legPnlNow(l, s, years, rate, surf.iv(l.strike)), 0),
  hasLaterExpiry: (legs) => legs.some((l) => l.kind !== 'stock' && l.extraDays > 0),

  pnlAtFrontExpiry(legs, s, rate, surf) {
    return Strategy.hasLaterExpiry(legs) ? Strategy.pnlNow(legs, s, 0, rate, surf) : Strategy.pnlAtExpiry(legs, s);
  },

  netPremium: (legs) => legs.filter((l) => l.kind !== 'stock').reduce((a, l) => a + l.qty * MULTIPLIER * l.premium, 0),

  positionGreeks(legs, s, years, rate, surf) {
    const g = { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0, pITM: 0 };
    for (const l of legs) {
      if (l.kind === 'stock') { g.delta += l.qty; continue; }
      const x = greeks(l.kind, s, l.strike, years + l.extraDays / 365, rate, surf.iv(l.strike));
      const m = l.qty * MULTIPLIER;
      g.delta += m * x.delta; g.gamma += m * x.gamma; g.theta += m * x.theta; g.vega += m * x.vega; g.rho += m * x.rho;
    }
    return g;
  },

  metrics(legs) {
    const strikes = uniqSorted(legs.filter((l) => l.strike > 0).map((l) => l.strike));
    const pts = [0, ...strikes];
    const vals = pts.map((p) => Strategy.pnlAtExpiry(legs, p));
    let slopeHi = 0;
    for (const l of legs) {
      if (l.kind === 'stock') slopeHi += l.qty;
      else if (l.kind === 'call') slopeHi += l.qty * MULTIPLIER;
    }
    const maxProfit = slopeHi > 1e-9 ? Infinity : Math.max(...vals);
    const maxLoss = slopeHi < -1e-9 ? -Infinity : Math.min(...vals);
    const ext = [...pts, pts[pts.length - 1] + 1e6];
    const extVals = [...vals, vals[vals.length - 1] + slopeHi * 1e6];
    const bes = [];
    for (let i = 0; i < ext.length - 1; i++) {
      const [a, va, b, vb] = [ext[i], extVals[i], ext[i + 1], extVals[i + 1]];
      if (va === 0 && a > 0) bes.push(a);
      else if (va * vb < 0) bes.push(a + ((b - a) * -va) / (vb - va));
    }
    return { maxProfit, maxLoss, breakevens: uniqSorted(bes.map((v) => rnd(v * 10000) / 10000)), netPremium: Strategy.netPremium(legs) };
  },

  metricsFull(legs, rate, surf, cost, range) {
    const base = Strategy.metrics(legs);
    const multi = Strategy.hasLaterExpiry(legs);
    if (!multi && !(cost > 0)) return base;
    const f = (s) => Strategy.pnlAtFrontExpiry(legs, s, rate, surf) - cost;
    const strikes = legs.filter((l) => l.kind !== 'stock').map((l) => l.strike);
    const minK = strikes.length ? Math.min(...strikes) : range[0];
    const maxK = strikes.length ? Math.max(...strikes) : range[1];
    const lo = Math.max(0.01, Math.min(range[0], minK * 0.3));
    const hi = Math.max(range[1], maxK * 3);
    const n = 900;
    const grid = Array.from({ length: n + 1 }, (_, i) => lo + ((hi - lo) * i) / n);
    const xs = uniqSorted([...grid, ...strikes.filter((k) => k > lo && k < hi)]);
    const vs = xs.map(f);
    const bes = [];
    for (let i = 0; i < xs.length - 1; i++) {
      if ((vs[i] < 0) !== (vs[i + 1] < 0)) {
        let [a, b] = [xs[i], xs[i + 1]];
        for (let j = 0; j < 40; j++) {
          const m = (a + b) / 2;
          if ((f(a) < 0) === (f(m) < 0)) a = m; else b = m;
        }
        bes.push(rnd(((a + b) / 2) * 10000) / 10000);
      }
    }
    return {
      maxProfit: !multi && !Number.isFinite(base.maxProfit) ? Infinity : Math.max(...vs),
      maxLoss: !multi && !Number.isFinite(base.maxLoss) ? -Infinity : Math.min(...vs),
      breakevens: bes,
      netPremium: base.netPremium,
    };
  },
};

export function pathPointsSync(params, SplitMix) {
  const rng = new SplitMix(params.seed ?? 7);
  let s = params.S ?? 100;
  let iv = params.iv ?? 0.3;
  const days = Math.trunc(params.days ?? 30);
  const events = params.events ?? [];
  const out = [[0, s]];
  const dt = 1 / 365;
  for (let d = 1; d <= Math.max(days, 1); d++) {
    const z = rng.gauss();
    s *= Math.exp(-0.5 * iv * iv * dt + iv * Math.sqrt(dt) * z);
    for (const e of events) {
      if (Math.trunc(e.day ?? -1) === d) {
        if (e.jump !== undefined) s *= 1 + e.jump;
        if (e.ivTo !== undefined) iv = e.ivTo;
      }
    }
    out.push([d, s]);
  }
  return out;
}
