// Desk/DeskEngine.swift, Lab/LabModel.swift (şablonlar) ve Desk/OrderTicket.swift görev mantığı.
import { Fmt } from './fmt.js';
import { SplitMix } from './rng.js';
import { Strategy, makeLeg, price, intrinsic, bidAsk, surface, COMMISSION, MULTIPLIER, rnd, cents, roundTripCost } from './math.js';

const T = (kind, qty, offset, extraDays = 0) => ({ kind, qty, offset, extraDays });

export const TEMPLATES = [
  { id: 'lc', name: 'Long call', note: 'Yükseliş bileti', legs: [T('call', 1, 0)] },
  { id: 'lp', name: 'Long put', note: 'Düşüş sigortası', legs: [T('put', 1, 0)] },
  { id: 'sc', name: 'Short call', note: 'Sınırsız risk', legs: [T('call', -1, 5)] },
  { id: 'sp', name: 'Short put', note: 'Prim topla, hisseyi almaya hazır ol', legs: [T('put', -1, -5)] },
  { id: 'cc', name: 'Covered call', note: 'Hisse + call sat', legs: [T('stock', 100, 0), T('call', -1, 5)] },
  { id: 'pp', name: 'Protective put', note: 'Hisse + sigorta', legs: [T('stock', 100, 0), T('put', 1, -5)] },
  { id: 'bcs', name: 'Bull call spread', note: 'Ucuz yükseliş, tavanlı', legs: [T('call', 1, 0), T('call', -1, 10)] },
  { id: 'bps', name: 'Bear put spread', note: 'Ucuz düşüş, tabanlı', legs: [T('put', 1, 0), T('put', -1, -10)] },
  { id: 'bups', name: 'Bull put spread', note: 'Kredi al, düşmezse kazan', legs: [T('put', -1, -5), T('put', 1, -10)] },
  { id: 'becs', name: 'Bear call spread', note: 'Kredi al, yükselmezse kazan', legs: [T('call', -1, 5), T('call', 1, 10)] },
  { id: 'ls', name: 'Long straddle', note: 'Büyük hareket bekle', legs: [T('call', 1, 0), T('put', 1, 0)] },
  { id: 'lst', name: 'Long strangle', note: 'Daha ucuz, daha uzak', legs: [T('call', 1, 5), T('put', 1, -5)] },
  { id: 'ic', name: 'Iron condor', note: 'Yatay piyasa, tanımlı risk', legs: [T('put', 1, -10), T('put', -1, -5), T('call', -1, 5), T('call', 1, 10)] },
  { id: 'bf', name: 'Long butterfly', note: 'Tam hedefe nişan', legs: [T('call', 1, -5), T('call', -2, 0), T('call', 1, 5)] },
  { id: 'col', name: 'Collar', note: 'Hisse + put al + call sat', legs: [T('stock', 100, 0), T('put', 1, -5), T('call', -1, 5)] },
  { id: 'cal', name: 'Calendar', note: 'Yakın vadeyi sat, uzağı al', legs: [T('call', -1, 0), T('call', 1, 0, 30)] },
  { id: 'diag', name: 'Diagonal (PMCC)', note: 'Uzak ITM call al, yakın OTM call sat', legs: [T('call', 1, -10, 60), T('call', -1, 5)] },
  { id: 'rat', name: 'Call ratio 1×2', note: '1 al, 2 sat: yukarısı çıplak', legs: [T('call', 1, 0), T('call', -2, 5)] },
  { id: 'bsp', name: 'Put backspread', note: '1 sat, 2 al: çöküşe bilet', legs: [T('put', -1, 0), T('put', 2, -5)] },
];

export function presetFromTemplate(t, spot = 100, days = 30, iv = 0.30, rate = 0.045) {
  const legs = t.legs.map((l) => {
    if (l.kind === 'stock') return makeLeg('stock', l.qty, spot);
    const k = spot + l.offset;
    return makeLeg(l.kind, l.qty, k, cents(price(l.kind, spot, k, (days + l.extraDays) / 365, rate, iv)), l.extraDays);
  });
  return { legs, spot, days, iv, r: rate };
}

/** Laboratuvar durumu. Giriş (spot0, iv0, gün0) primleri belirler; kaydırıcılar bugünkü eğriyi oynatır. */
export class LabModel {
  static skewAmount = 0.15;

  constructor(preset) {
    this.legs = preset.legs.map((l) => ({ ...l, extraDays: l.extraDays ?? 0 }));
    this.entrySpot = preset.spot;
    this.entryDays = preset.days;
    this.entryIV = preset.iv;
    this.rate = preset.r ?? 0.045;
    this.spot = preset.spot;
    this.daysLeft = preset.days;
    this.iv = preset.iv;
    this.skewOn = false;
    this.costsOn = false;
  }

  get skew() { return this.skewOn ? LabModel.skewAmount : 0; }
  get surface() { return surface(this.iv, this.skew, this.entrySpot); }
  get entrySurface() { return surface(this.entryIV, this.skew, this.entrySpot); }
  get cost() {
    return this.costsOn ? roundTripCost(this.legs, this.entrySpot, this.entryDays / 365, this.rate, this.entrySurface) : 0;
  }
  get isMultiExpiry() { return Strategy.hasLaterExpiry(this.legs); }

  entryPremium(l) {
    return cents(price(l.kind, this.entrySpot, l.strike, (this.entryDays + l.extraDays) / 365, this.rate, this.entrySurface.iv(l.strike)));
  }

  setSkew(on) {
    this.skewOn = on;
    for (const l of this.legs) if (l.kind !== 'stock') l.premium = this.entryPremium(l);
  }

  get range() {
    const ks = [...this.legs.map((l) => l.strike), this.entrySpot];
    const lo = Math.min(...ks); const hi = Math.max(...ks);
    const pad = Math.max(this.entrySpot * 0.15, (hi - lo) * 0.6);
    return [Math.max(0.5, lo - pad), hi + pad];
  }

  get metrics() { return Strategy.metricsFull(this.legs, this.rate, this.surface, this.cost, this.range); }
  get greeks() { return Strategy.positionGreeks(this.legs, this.spot, this.daysLeft / 365, this.rate, this.surface); }
  get today() { return { days: this.daysLeft, iv: this.iv, rate: this.rate }; }

  shiftStrike(id, delta) {
    const l = this.legs.find((x) => x.id === id);
    if (!l || l.kind === 'stock') return;
    l.strike = Math.max(1, l.strike + delta);
    l.premium = this.entryPremium(l);
  }

  flip(id) {
    const l = this.legs.find((x) => x.id === id);
    if (l) l.qty = -l.qty;
  }

  resetClock() {
    this.spot = this.entrySpot;
    this.daysLeft = this.entryDays;
    this.iv = this.entryIV;
  }
}

export const THESES = [
  { id: 'up', name: 'Yükselir', hit: (r) => r > 0.03 },
  { id: 'down', name: 'Düşer', hit: (r) => r < -0.03 },
  { id: 'flat', name: 'Yatay kalır', hit: (r) => Math.abs(r) <= 0.03 },
  { id: 'big', name: 'Sert hareket eder', hit: (r) => Math.abs(r) > 0.08 },
];

const SYMBOLS = ['XYZ', 'KLM', 'RTS', 'NVA', 'ORB', 'DLT', 'PRX', 'TUV'];
export const DESK_SKEW = 0.10;

export function generateScenario(seed) {
  const rng = new SplitMix(seed);
  const u = () => rng.u();
  const gauss = () => rng.gauss();
  const symbol = rng.pick(SYMBOLS);
  const s0 = rng.pick([42, 65, 100, 140, 210]);
  const iv0 = rnd((0.18 + u() * 0.40) * 100) / 100;
  const ivRank = Math.trunc(5 + u() * 90);
  const days = rng.pick([30, 45]);
  const earnings = u() < 0.4 ? 8 + Math.trunc(u() * (days - 14)) : null;
  const shockDay = u() < 0.12 ? 3 + Math.trunc(u() * (days - 6)) : null;
  const realized = iv0 * (0.6 + u() * 0.7);
  const drift = gauss() * 0.35;
  const dt = 1 / 365;

  let s = s0;
  let iv = iv0;
  const path = [{ spot: s0, iv: iv0, note: earnings !== null ? `Bilanço ${earnings}. günde açıklanacak.` : null }];
  for (let d = 1; d <= days; d++) {
    let note = null;
    let ret = (drift - 0.5 * realized * realized) * dt + realized * Math.sqrt(dt) * gauss();
    let ivTarget = iv0;
    if (earnings !== null) {
      if (d < earnings && d >= earnings - 5) ivTarget = iv0 + 0.04 * (6 - (earnings - d));
      if (d === earnings - 1) note = 'Bilanço yarın. IV yükseldi: belirsizlik fiyatlanıyor.';
      if (d === earnings) {
        const size = 0.03 + u() * 0.08;
        const jump = size * (u() < 0.5 ? -1 : 1);
        ret += Math.log(1 + jump);
        ivTarget = iv0 * 0.8;
        iv = ivTarget;
        note = `Bilanço açıklandı: hisse ${Fmt.signedPct(jump)}. IV çöktü (IV crush).`;
      }
      if (d > earnings) ivTarget = iv0 * 0.8;
    }
    if (d === shockDay) {
      const jump = -(0.07 + u() * 0.07);
      ret += Math.log(1 + jump);
      iv += 0.15;
      note = `Piyasada sert satış: hisse ${Fmt.signedPct(jump)}, IV fırladı.`;
    }
    s *= Math.exp(ret);
    if (d !== earnings) iv += 0.15 * (ivTarget - iv) - 0.8 * ret + 0.01 * gauss();
    iv = Math.min(1.5, Math.max(0.08, iv));
    path.push({ spot: rnd(s * 100) / 100, iv: rnd(iv * 1000) / 1000, note });
  }
  const start = path[0];
  const strikeStep = start.spot < 50 ? 1 : start.spot < 120 ? 2.5 : 5;
  return {
    symbol, days, ivRank, earningsDay: earnings, path, start, strikeStep,
    roundStrike: (k) => Math.max(strikeStep, rnd(k / strikeStep) * strikeStep),
  };
}

export class DeskSession {
  static quarterSpread = 0.25;
  static riskRule = 0.05;

  constructor(seed, balance) {
    this.scenario = generateScenario(seed);
    this.balance = balance;
    this.rate = 0.045;
    this.template = TEMPLATES.find((t) => t.id === 'bups');
    this.legs = [];
    this.contracts = 1;
    this.thesis = THESES[0];
    this.takeProfit = 0;
    this.stopLoss = 0;
    this.day = 0;
    this.opened = false;
    this.closed = false;
    this.realized = 0;
    this.commissions = 0;
    this.events = [];
    this.triggerDay = null;
    this.ignoredTrigger = false;
    this.closedOnTrigger = false;
    this.worst = 0;
    this.best = 0;
    this.entryRisk = 0;
    this.entryLegs = [];
    this.rng = new SplitMix(BigInt.asUintN(64, BigInt(seed) + 99n));
    this.build();
  }

  get today() { return this.scenario.path[Math.min(this.day, this.scenario.days)]; }
  get daysLeft() { return this.scenario.days - this.day; }
  get finished() { return this.closed; }

  surfaceFor(d) { return surface(d.iv, DESK_SKEW, d.spot); }

  choose(t) { this.template = t; this.build(); }

  build() {
    const sc = this.scenario;
    const s = sc.start.spot;
    this.legs = this.template.legs.map((tl) => {
      if (tl.kind === 'stock') return makeLeg('stock', 100, s);
      const k = sc.roundStrike(s + (tl.offset * s) / 100);
      return makeLeg(tl.kind, tl.qty, k, this.mid(tl.kind, k, tl.extraDays, sc.start, 0), tl.extraDays);
    });
    this.resetPlan();
  }

  shift(id, steps) {
    const l = this.legs.find((x) => x.id === id);
    if (!l || l.kind === 'stock') return;
    const sc = this.scenario;
    l.strike = Math.max(sc.strikeStep, l.strike + steps * sc.strikeStep);
    l.premium = this.mid(l.kind, l.strike, l.extraDays, sc.start, 0);
    this.resetPlan();
  }

  resetPlan() {
    const m = this.planMetrics;
    const debit = Math.abs(m.netPremium);
    this.takeProfit = Math.max(rnd(Number.isFinite(m.maxProfit) ? m.maxProfit * 0.5 : Math.max(debit, 100)), 10);
    this.stopLoss = Math.max(rnd(Number.isFinite(m.maxLoss) ? -m.maxLoss * 0.5 : Math.max(debit * 2, 200)), 10);
  }

  get sizedLegs() { return this.legs.map((l) => ({ ...l, qty: l.qty * this.contracts })); }

  get planMetrics() {
    const sized = this.sizedLegs;
    return Strategy.metricsFull(sized, this.rate, this.surfaceFor(this.scenario.start), 0, this.rangeFor(sized));
  }

  rangeFor(ls) {
    const s = this.scenario.start.spot;
    const ks = [...ls.map((l) => l.strike), s];
    return [Math.max(0.5, Math.min(...ks) - s * 0.25), Math.max(...ks) + s * 0.25];
  }

  get planRisk() {
    const m = this.planMetrics;
    if (Number.isFinite(m.maxLoss)) return -m.maxLoss;
    const s = this.scenario.start.spot;
    const surf = this.surfaceFor(this.scenario.start);
    return -Math.min(...[s * 0.75, s * 1.25].map((x) => Strategy.pnlAtFrontExpiry(this.sizedLegs, x, this.rate, surf)));
  }

  get riskShare() { return this.balance > 0 ? this.planRisk / this.balance : 1; }
  get unlimitedRisk() { return !Number.isFinite(this.planMetrics.maxLoss); }
  get capitalNeeded() {
    return this.sizedLegs.filter((l) => l.kind === 'stock').reduce((a, l) => a + l.qty * l.strike, 0) + Math.max(this.planRisk, 0);
  }
  get canAfford() { return this.capitalNeeded <= this.balance; }

  mid(kind, k, extra, d, day) {
    const years = (this.scenario.days - day + extra) / 365;
    return cents(price(kind, d.spot, k, years, this.rate, this.surfaceFor(d).iv(k)));
  }

  fill(l, d, day, opening) {
    const m = this.mid(l.kind, l.strike, l.extraDays, d, day);
    const q = bidAsk(m);
    const buying = opening ? l.qty > 0 : l.qty < 0;
    const slip = (q.ask - q.bid) * DeskSession.quarterSpread;
    return Math.max(0, cents(buying ? m + slip : m - slip));
  }

  get liquidationPnL() {
    if (!this.opened) return 0;
    return this.realized - this.commissions + this.openValueAtExit - this.exitCommission;
  }

  get openValueAtExit() {
    const d = this.today;
    return this.legs.reduce((acc, l) => {
      if (l.kind === 'stock') return acc + l.qty * (d.spot - l.strike);
      const px = this.daysLeft === 0 && l.extraDays === 0 ? intrinsic(l.kind, d.spot, l.strike) : this.fill(l, d, this.day, false);
      return acc + l.qty * MULTIPLIER * (px - l.premium);
    }, 0);
  }

  get exitCommission() {
    return this.legs.filter((l) => l.kind !== 'stock').reduce((a, l) => a + Math.abs(l.qty) * COMMISSION, 0);
  }

  get greeks() {
    return Strategy.positionGreeks(this.legs, this.today.spot, this.daysLeft / 365, this.rate, this.surfaceFor(this.today));
  }

  open() {
    if (this.opened) return;
    this.entryRisk = this.planRisk;
    const d = this.scenario.start;
    this.legs = this.sizedLegs.map((l) => (l.kind === 'stock' ? l : { ...l, premium: this.fill(l, d, 0, true) }));
    this.entryLegs = this.legs.map((l) => ({ ...l }));
    this.commissions = this.exitCommission;
    this.opened = true;
    this.events.push(`Gün 0: pozisyon açıldı. Dolum ortanın biraz aleyhine, komisyon ${Fmt.money(-this.commissions, { digits: 2 })}.`);
    if (d.note) this.events.push(`Gün 0: ${d.note}`);
    this.track();
  }

  advance(n) {
    if (!this.opened || this.closed) return;
    if (this.triggerDay !== null && !this.closedOnTrigger) this.ignoredTrigger = true;
    for (let i = 0; i < n; i++) {
      if (!(this.day < this.scenario.days && !this.closed)) continue;
      this.day += 1;
      if (this.today.note) this.events.push(`Gün ${this.day}: ${this.today.note}`);
      this.earlyAssignmentCheck();
      if (!this.legs.length) this.finish('Tüm bacaklar kapandı.');
      if (this.day === this.scenario.days) this.expire();
      this.track();
      if (this.triggerDay === this.day) break;
    }
  }

  close() {
    if (!this.opened || this.closed) return;
    if (this.triggerDay !== null && this.triggerDay === this.day) this.closedOnTrigger = true;
    const value = this.openValueAtExit;
    const fee = this.exitCommission;
    this.realized += value;
    this.commissions += fee;
    this.legs = [];
    this.finish(`Gün ${this.day}: pozisyonu kapattın.`);
  }

  track() {
    const v = this.liquidationPnL;
    this.worst = Math.min(this.worst, v);
    this.best = Math.max(this.best, v);
    if (this.triggerDay === null && (v >= this.takeProfit || v <= -this.stopLoss)) {
      this.triggerDay = this.day;
      this.events.push(`Gün ${this.day}: ${v >= this.takeProfit ? 'kâr al' : 'zarar kes'} seviyen geldi (${Fmt.money(v)}). Planın: KAPAT.`);
    }
  }

  earlyAssignmentCheck() {
    if (this.day >= this.scenario.days) return;
    const d = this.today;
    for (const l of [...this.legs]) {
      if (l.kind === 'stock' || l.qty >= 0) continue;
      const intr = intrinsic(l.kind, d.spot, l.strike);
      const px = price(l.kind, d.spot, l.strike, (this.daysLeft + l.extraDays) / 365, this.rate, this.surfaceFor(d).iv(l.strike));
      if (!(intr > 0 && px - intr < 0.05 && this.rng.u() < 0.3)) continue;
      this.realized += l.qty * MULTIPLIER * (intr - l.premium);
      this.legs = this.legs.filter((x) => x.id !== l.id);
      const what = l.kind === 'call' ? `${Math.abs(l.qty) * 100} hisse SATTIN (elinde yoksa açığa)` : `${Math.abs(l.qty) * 100} hisse ALDIN`;
      this.events.push(`Gün ${this.day}: ERKEN ATANMA. ${Fmt.num(l.strike, 1)} ${l.kind === 'call' ? 'call' : 'put'} atandı → ${what}. Basitlik için hisseyi aynı gün ${Fmt.price(d.spot)}'dan kapattığını varsayıyoruz.`);
    }
  }

  expire() {
    const s = this.today.spot;
    const notes = [];
    for (const l of this.legs) {
      if (l.kind === 'stock' || l.extraDays !== 0) continue;
      const intr = intrinsic(l.kind, s, l.strike);
      const name = `${Fmt.num(l.strike, 1)} ${l.kind === 'call' ? 'call' : 'put'}`;
      if (intr > 0) notes.push(l.qty > 0 ? `${name} otomatik kullanıldı` : `${name} için atandın`);
      if (Math.abs(s - l.strike) / s < 0.005) notes.push(`${name} strike'a çok yakın kapandı: pin riski`);
    }
    this.events.push(`Gün ${this.day}: VADE. Hisse ${Fmt.price(s)}. ${notes.length ? `${notes.join('; ')}. Gerçekte hisse hesabına geçerdi; burada fark nakit sayıldı.` : 'Tüm opsiyonlar değersiz bitti.'}`);
    this.realized += this.openValueAtExit;
    this.legs = [];
    this.finish('Vade doldu.');
  }

  finish(reason) {
    if (this.closed) return;
    this.closed = true;
    this.events.push(reason);
  }

  get finalPnL() { return this.realized - this.commissions; }
  get sizeOK() { return this.entryRisk <= this.balance * DeskSession.riskRule + 0.5; }
  get planOK() { return !this.ignoredTrigger; }
  get thesisHit() { return this.thesis.hit(this.today.spot / this.scenario.start.spot - 1); }

  get grade() {
    if (this.sizeOK && this.planOK) return 'A';
    if (!this.sizeOK && !this.planOK) return 'C';
    return 'B';
  }

  get lessons() {
    const share = Fmt.num((this.entryRisk / Math.max(this.balance, 1)) * 100, 1);
    const out = [this.sizeOK ? `Boyut kuralına uydun: hesabının %${share} kadarını riske attın.` : `Boyut kuralını aştın: hesabının %${share} kadarını riske attın (kural en fazla %5).`];
    if (this.triggerDay === null) out.push('Kâr al / zarar kes seviyelerine hiç gelinmedi.');
    else out.push(this.planOK ? 'Plan KAPAT dediğinde kapattın.' : 'Plan KAPAT dedi, sen devam ettin. Sonuç ne olursa olsun bu bir süreç hatası.');
    const t = this.thesis.name.toLocaleLowerCase('tr-TR');
    out.push(this.thesisHit ? `Tezin gerçekleşti (${t}).` : `Tezin gerçekleşmedi (${t}).`);
    if (this.thesisHit && this.finalPnL < 0) out.push('Tez doğru ama para kaybettin: strateji, strike, vade ya da IV seçimi teze uymamış olabilir.');
    if (!this.thesisHit && this.finalPnL > 0) out.push('Tez yanlış ama kazandın: bunu beceri sanma, şans payı yüksek.');
    out.push(`En kötü an ${Fmt.money(this.worst)}, en iyi an ${Fmt.money(this.best)}.`);
    return out;
  }
}

// Emir fişi

export const TICKET_ACTIONS = { bto: 'Buy to Open', sto: 'Sell to Open', btc: 'Buy to Close', stc: 'Sell to Close' };

export function ticketQuote(chain, kind, k) {
  const iv = Math.max(0.05, chain.iv + (chain.skew * (chain.S - k)) / chain.S);
  const q = bidAsk(price(kind, chain.S, k, chain.days / 365, chain.r, iv));
  return { bid: q.bid, mid: rnd(((q.bid + q.ask) / 2) * 100) / 100, ask: q.ask };
}

const MONTHS = ['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];
function fridayExpiry(target, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + target);
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7));
  return {
    days: Math.round((d - start) / 86400000),
    expiry: `${d.getDate()} ${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
  };
}

export function generateTicket(seed) {
  const rng = new SplitMix(seed);
  const s = rng.pick([48, 100, 150, 220]);
  const step = s < 60 ? 1 : 5;
  const atm = rnd(s / step) * step;
  const strikes = [-2, -1, 0, 1, 2].map((i) => atm + i * step);
  const { days, expiry } = fridayExpiry(rng.pick([14, 30, 45]));
  const iv = rng.pick([0.25, 0.32, 0.45]);
  const chain = { S: s, days, iv, r: 0.045, strikes, skew: 0.1 };
  const n = rng.pick([1, 2, 3, 5]);
  const [, down, at, upK] = strikes;
  const f = (k) => Fmt.num(k, 0);
  const cases = [
    [`Yükseleceğini düşünüyorsun. **${f(upK)} call**'dan **${n} kontrat AL**. Orta fiyattan (mid) limit emir, yalnız bugün geçerli.`, { action: 'bto', kind: 'call', strike: upK, qty: n, tif: 'day' }, 'mid'],
    [`Elinde **${n} kontrat ${f(down)} put** var ve pozisyonu **KAPATMAK** istiyorsun. Hemen dolsun diye **bid** fiyatından limit emir, bugün geçerli.`, { action: 'stc', kind: 'put', strike: down, qty: n, tif: 'day' }, 'bid'],
    [`100 hisse sahibisin. Covered call için **${f(upK)} call**'dan **1 kontrat SAT**. Mid'den limit emir, iptal edene kadar geçerli.`, { action: 'sto', kind: 'call', strike: upK, qty: 1, tif: 'gtc' }, 'mid'],
    [`Daha önce **${n} kontrat ${f(down)} put SATMIŞTIN**. Şimdi geri alıp **kapatmak** istiyorsun. Mid'den limit emir, iptal edene kadar geçerli.`, { action: 'btc', kind: 'put', strike: down, qty: n, tif: 'gtc' }, 'mid'],
    [`Cash-secured put: **${f(at)} put**'tan **${n} kontrat SAT**. Mid'den limit emir, yalnız bugün.`, { action: 'sto', kind: 'put', strike: at, qty: n, tif: 'day' }, 'mid'],
    [`Düşüşe karşı sigorta: **${f(down)} put**'tan **${n} kontrat AL**. Acelen var ama market emri kullanma: **ask** fiyatından limit emir, bugün.`, { action: 'bto', kind: 'put', strike: down, qty: n, tif: 'day' }, 'ask'],
    [`Elindeki **${n} kontrat ${f(at)} call**'u **kapat**. Mid'den limit emir, iptal edene kadar geçerli.`, { action: 'stc', kind: 'call', strike: at, qty: n, tif: 'gtc' }, 'mid'],
  ];
  const [prompt, exp, priceRule] = rng.pick(cases);
  const expected = { ...exp, type: 'limit', price: ticketQuote(chain, exp.kind, exp.strike)[priceRule] };
  return { prompt, chain, expiry, expected, priceRule };
}

export function gradeTicket(task, o) {
  const e = task.expected;
  const open = e.action === 'bto' || e.action === 'sto';
  const priceOK = Math.abs(o.price - e.price) <= 0.011;
  const rule = task.priceRule === 'bid' ? 'bid' : task.priceRule === 'ask' ? 'ask' : "mid (bid ile ask'in ortası)";
  const name = TICKET_ACTIONS[e.action];
  const kindName = e.kind === 'call' ? 'Call' : 'Put';
  return [
    { ok: o.action === e.action, text: o.action === e.action ? `İşlem: ${name}` : `İşlem: ${name} olmalıydı. ${open ? "Yeni pozisyon açıyorsun → 'to Open'." : "Var olan pozisyonu kapatıyorsun → 'to Close'."} ${e.action === 'bto' || e.action === 'btc' ? 'Alıyorsun → Buy.' : 'Satıyorsun → Sell.'}` },
    { ok: o.kind === e.kind, text: o.kind === e.kind ? `Tür: ${kindName}` : `Tür: ${kindName} olmalıydı.` },
    { ok: o.strike === e.strike, text: o.strike === e.strike ? `Strike: ${Fmt.num(e.strike, 0)}` : `Strike: ${Fmt.num(e.strike, 0)} olmalıydı (sen ${Fmt.num(o.strike, 0)} seçtin).` },
    { ok: o.qty === e.qty, text: o.qty === e.qty ? `Adet: ${e.qty} kontrat` : `Adet: ${e.qty} kontrat olmalıydı. 1 kontrat = 100 hisse.` },
    { ok: o.type === 'limit', text: o.type === 'limit' ? 'Emir türü: Limit' : o.type === 'market' ? 'Market emri opsiyonda makas genişse çok kötü fiyattan dolabilir. Limit kullan.' : 'Stop emri tetik fiyatına gelince çalışır; burada istenen hemen bir limit emir.' },
    { ok: priceOK, text: priceOK ? `Fiyat: ${Fmt.price(e.price)} (${rule})` : `Fiyat: ${rule} = ${Fmt.price(e.price)} olmalıydı.` },
    { ok: o.tif === e.tif, text: o.tif === e.tif ? `Geçerlilik: ${e.tif === 'day' ? 'Day' : 'GTC'}` : `Geçerlilik: ${e.tif === 'day' ? 'Day (gün sonunda iptal)' : 'GTC (iptal edene kadar)'} olmalıydı.` },
  ];
}
