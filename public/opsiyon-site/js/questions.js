// Practice/QuestionGen.swift karşılığı. Doğru cevap motordan gelir; rakamlar her seferinde değişir.
import { Fmt } from './fmt.js';
import { SplitMix } from './rng.js';
import { Strategy, makeLeg, intrinsic, expectedMove, annualizedYield, cents } from './math.js';

const usd = (v, d = 2) => `${Fmt.num(v, d)} $`;
const mny = (v) => Fmt.money(v, { signed: false });

export function build(q, correct, wrong, explain, rng) {
  let opts = [correct];
  for (const w of wrong) if (!opts.includes(w) && opts.length < 4) opts.push(w);
  opts = rng.shuffle(opts);
  return { q, options: opts, answer: Math.max(opts.indexOf(correct), 0), explain };
}

const SELLER_LIMITS = {
  Delta: 'Delta → bant 0,15–0,25',
  Vade: 'Vade → kural 30–45 gün',
  Makas: "Makas → sınır mid'in %10'u",
  OI: 'OI → birkaç yüzün üstünde olmalı',
  'IV rank': 'IV rank → eşik 50',
  'Bilanço': 'Bilanço → vade içinde olmamalı',
  Nakit: 'Nakit → en az teminat kadar',
  'Sektör': 'Sektör → aynı sektöre yığılma yok',
  'Şirket': 'Şirket → düşüşte elinde tutacağın hisse',
};

const SELLER_RULES = [
  { cell: 'Delta', wrong: 'Açmam: delta bandın dışında', why: 'Delta 0,15–0,25 bandının üstünde; fiyata fazla yakın.' },
  { cell: 'Vade', wrong: 'Açmam: vade çok kısa', why: 'Kural 30–45 gün. Vadeye çok az gün kaldı; gamma en sert burada.' },
  { cell: 'Makas', wrong: 'Açmam: makas çok geniş', why: "Makas mid'in %10'unun üstünde; girerken ve çıkarken para kaybedersin." },
  { cell: 'OI', wrong: 'Açmam: açık pozisyon çok az', why: 'OI birkaç yüzün çok altında; çıkmak istediğinde karşı taraf bulamayabilirsin.' },
  { cell: 'IV rank', wrong: 'Açmam: prim ucuz', why: "IV rank 50'nin altında; satıcı için prim pahalı değil. Beklemek de bir karardır." },
  { cell: 'Bilanço', wrong: 'Açmam: bilanço çok yakın', why: "Vade içinde bilanço var; o gece hisse strike'ı atlayabilir." },
  { cell: 'Nakit', wrong: 'Açmam: nakit teminat yetmiyor', why: 'Atanırsan 100 hisseyi alacak nakit hesapta yok.' },
  { cell: 'Sektör', wrong: 'Açmam: tek sektöre yığılma', why: 'Aynı sektörde zaten açık satışların var; birlikte düşebilirler.' },
  { cell: 'Şirket', wrong: 'Açmam: hisseyi tutmak istemem', why: 'Düşüşte satıp kaçacağın hisseye put satılmaz; prim bu riski ödemez.' },
];

function sellerCard(rng) {
  const bad = rng.int(0, SELLER_RULES.length);
  const p = (xs) => rng.pick(xs);
  const strike = p([40, 60, 85, 120]);
  const need = strike * 100;
  const lines = [
    `Şirket: ${bad === 8 ? 'Yarıya düşerse satıp kaçarsın' : 'Yarıya düşerse elinde tutarsın'}`,
    `Sektör: ${bad === 7 ? '3 açık put var' : 'Başka satış yok'}`,
  ];
  const delta = bad === 0 ? p([0.42, 0.50]) : p([0.15, 0.18, 0.20, 0.22, 0.25]);
  const rank = bad === 4 ? p([6, 14, 22]) : p([52, 58, 64, 71]);
  lines.push(`Delta: ${Fmt.num(delta)} · IV rank: ${rank} (eşik 50)`);
  const vade = bad === 1 ? p([3, 5, 6]) : p([30, 35, 38, 42, 45]);
  lines.push(`Vade: ${vade} gün · Bilanço: ${bad === 5 ? 'Yarın' : 'Vadede yok'}`);
  lines.push(`Nakit: ${mny(bad === 6 ? need * 0.6 : need * 1.5)} · Teminat: ${mny(need)}`);
  const makas = bad === 2 ? p([18, 25, 40]) : p([3, 4, 6, 8]);
  const oi = bad === 3 ? p([3, 12, 25]) : p([450, 800, 1200, 3500]);
  lines.push(`Makas: %${makas} · OI: ${Fmt.num(oi, 0)}`);

  const pass = 'Açarım: bütün kurallar uyuyor';
  const others = rng.shuffle(SELLER_RULES.filter((_, i) => i !== bad).map((r) => r.wrong));
  const isPass = bad === SELLER_RULES.length;
  const correct = isPass ? pass : SELLER_RULES[bad].wrong;
  const wrong = isPass ? others.slice(0, 3) : [pass, ...others.slice(0, 2)];
  const explain = isPass
    ? 'Bütün kurallar uyuyor, ama bu kazanç garantisi değil. Kural yalnız kötü adayları eler; kaç kontrat açacağın ve çıkış planın ayrı karardır.'
    : `${SELLER_RULES[bad].why} Diğer satırlar kuralın içinde. Tek hayır, işlem yok demektir.`;
  const q = `${Fmt.num(strike, 0)} put satışı\n${lines.join('\n')}`;
  const built = build(q, correct, wrong, explain, rng);
  built.flag = isPass ? null : SELLER_RULES[bad].cell;
  const refutes = {};
  for (const r of SELLER_RULES) if (r.wrong !== correct) refutes[r.wrong] = `${r.cell} satırı kuralın içinde.`;
  if (!isPass) refutes[pass] = `Kart temiz değil: ${SELLER_RULES[bad].cell} satırı kuralın dışında.`;
  built.refutes = refutes;
  return built;
}

export const KINDS = [
  { id: 'cost', level: 0, make(rng) {
    const p = rng.pick([0.85, 1.20, 2.45, 3.10, 4.75]); const n = rng.pick([1, 2, 3, 5]);
    const total = p * 100 * n;
    return build(`Prim **${usd(p)}** görünen bir call'dan **${n} kontrat** alıyorsun. Komisyon hariç ne ödersin?`,
      mny(total), [mny(p * n), mny(total * 10), mny(p * 100)],
      `Prim hisse başınadır, 1 kontrat = 100 hisse: ${usd(p)} × 100 × ${n} = ${mny(total)}.`, rng);
  } },
  { id: 'budget', level: 0, make(rng) {
    const cash = rng.pick([500, 1000, 1500, 2000]); const p = rng.pick([1.20, 2.40, 3.10, 4.50]);
    const n = Math.floor(cash / (p * 100));
    return build(`Hesabında **${mny(cash)}** var. Prim **${usd(p)}** olan call'dan en çok kaç kontrat alabilirsin? (Komisyon hariç)`,
      `${n} kontrat`, [`${n + 1} kontrat`, `${n + 3} kontrat`, `${Math.floor(cash / p)} kontrat`],
      `1 kontrat = ${usd(p)} × 100 = ${mny(p * 100)}. ${mny(cash)} ÷ ${mny(p * 100)} = ${n} kontrat (aşağı yuvarla).`, rng);
  } },
  { id: 'spreadCost', level: 0, make(rng) {
    const bid = rng.pick([1.10, 1.85, 2.40, 3.20, 4.60]); const gap = rng.pick([0.05, 0.10, 0.15, 0.20]);
    const ask = bid + gap; const cost = gap * 100;
    return build(`Bid **${usd(bid)}**, ask **${usd(ask)}**. 1 kontratı ask'ten alıp hemen bid'den satarsan komisyon hariç ne kaybedersin?`,
      mny(cost), [mny(gap), mny(ask * 100), mny(cost * 10)],
      `Aldığın ve sattığın fiyat arasındaki fark hisse başına ${usd(gap)}. 1 kontrat = 100 hisse: ${usd(gap)} × 100 = ${mny(cost)}.`, rng);
  } },
  { id: 'shares', level: 0, make(rng) {
    const n = rng.pick([2, 3, 4, 6, 8]);
    return build(`**${n} kontrat** call, kullanılırsa kaç hisseye karşılık gelir?`,
      `${n * 100} hisse`, [`${n} hisse`, `${n * 10} hisse`, `${n * 1000} hisse`],
      `1 kontrat = 100 hisse: ${n} × 100 = ${n * 100} hisse.`, rng);
  } },
  { id: 'callBE', level: 1, make(rng) {
    const k = rng.pick([45, 60, 100, 150, 210]); const p = rng.pick([1.40, 2.25, 3.80, 5.10]);
    const be = Strategy.metrics([makeLeg('call', 1, k, p)]).breakevens[0] ?? k + p;
    return build(`**${Fmt.num(k, 0)} strike** call'u **${usd(p)}** primle aldın. Vadede başa baş noktası kaç?`,
      usd(be), [usd(k - p), usd(k), usd(k + p * 2)],
      `Long call başa baş = strike + ödenen prim = ${Fmt.num(k, 0)} + ${Fmt.num(p)} = ${usd(be)}.`, rng);
  } },
  { id: 'putBE', level: 1, make(rng) {
    const k = rng.pick([40, 75, 100, 180]); const p = rng.pick([1.15, 2.60, 3.35, 4.90]);
    const be = Strategy.metrics([makeLeg('put', 1, k, p)]).breakevens[0] ?? k - p;
    return build(`**${Fmt.num(k, 0)} strike** put'u **${usd(p)}** primle aldın. Vadede başa baş noktası kaç?`,
      usd(be), [usd(k + p), usd(k), usd(k - p * 2)],
      `Long put başa baş = strike − ödenen prim = ${Fmt.num(k, 0)} − ${Fmt.num(p)} = ${usd(be)}.`, rng);
  } },
  { id: 'callPnL', level: 1, make(rng) {
    const k = rng.pick([50, 100, 120]); const p = rng.pick([2.10, 3.40, 4.20]);
    const st = k + rng.pick([-6, 2, 5, 9, 14]);
    const v = Strategy.pnlAtExpiry([makeLeg('call', 1, k, p)], st);
    return build(`1 kontrat **${Fmt.num(k, 0)} call**, prim **${usd(p)}**. Vadede hisse **${usd(st, 0)}**. Toplam kâr/zarar?`,
      Fmt.money(v), [Fmt.money(Math.max(st - k, 0) * 100), Fmt.money(v + 2 * p * 100), Fmt.money(-p * 100), Fmt.money(v - 100)],
      `İçsel değer max(${Fmt.num(st, 0)} − ${Fmt.num(k, 0)}, 0) = ${Fmt.num(Math.max(st - k, 0))} $; eksi prim ${Fmt.num(p)} $, × 100 = ${Fmt.money(v)}.`, rng);
  } },
  { id: 'extrinsic', level: 1, make(rng) {
    const s = rng.pick([103, 108, 112]); const k = 100; const px = rng.pick([6.40, 9.25, 13.60]);
    const intr = Math.max(s - k, 0); const ext = cents(px - intr);
    return build(`Hisse **${usd(s, 0)}**, 100 call **${usd(px)}**. Primin ne kadarı zaman değeri (extrinsic)?`,
      usd(ext), [usd(intr), usd(px), usd(cents(px + intr))],
      `İçsel = ${Fmt.num(s, 0)} − 100 = ${Fmt.num(intr)} $. Zaman değeri = prim − içsel = ${Fmt.num(px)} − ${Fmt.num(intr)} = ${usd(ext)}.`, rng);
  } },
  { id: 'moneyness', level: 1, make(rng) {
    const s = rng.pick([95, 100, 105]); const k = rng.pick([90, 100, 110]); const isCall = rng.bool();
    const intr = intrinsic(isCall ? 'call' : 'put', s, k);
    const correct = s === k ? 'ATM (paranın üstünde)' : intr > 0 ? 'ITM (paranın içinde)' : 'OTM (paranın dışında)';
    return build(`Hisse **${usd(s, 0)}**. **${Fmt.num(k, 0)} ${isCall ? 'call' : 'put'}** hangisidir?`,
      correct, ['ITM (paranın içinde)', 'OTM (paranın dışında)', 'ATM (paranın üstünde)'],
      s === k ? "Hisse strike'a eşit, bu yüzden ATM."
        : `${isCall ? "Call, hisse strike'ın ÜSTÜNDEYSE" : "Put, hisse strike'ın ALTINDAYSA"} ITM'dir. Burada hisse ${usd(s, 0)}, strike ${usd(k, 0)}: ${intr > 0 ? 'içsel değeri var, ITM.' : 'içsel değeri yok, OTM.'}`, rng);
  } },
  { id: 'deltaMove', level: 2, make(rng) {
    const d = rng.pick([0.25, 0.40, 0.55, 0.70]); const mv = rng.pick([1, 2, 3]); const n = rng.pick([1, 2, 4]);
    const v = d * mv * 100 * n;
    return build(`${n} kontrat call, delta **${Fmt.num(d)}**. Hisse **+${usd(mv, 0)}** giderse pozisyon kabaca ne kadar değişir?`,
      Fmt.money(v), [Fmt.money(d * mv * n), Fmt.money(mv * 100 * n), Fmt.money(-v)],
      `Delta × hisse hareketi × 100 × kontrat = ${Fmt.num(d)} × ${Fmt.num(mv, 0)} × 100 × ${n} ≈ ${Fmt.money(v)}. Kaba bir yaklaşımdır; gamma büyük harekette sapma yaratır.`, rng);
  } },
  { id: 'thetaDays', level: 2, make(rng) {
    const th = rng.pick([0.03, 0.05, 0.08, 0.12]); const days = rng.pick([3, 5, 7]); const n = rng.pick([1, 2, 4]);
    const v = -th * days * 100 * n;
    return build(`Long ${n} kontrat, theta **−${Fmt.num(th)}** (hisse başı, günlük). Başka hiçbir şey değişmeden **${days} gün** geçerse kabaca ne olur?`,
      Fmt.money(v), [Fmt.money(-th * days * n, { digits: 2 }), Fmt.money(-v), Fmt.money(-th * 100 * n)],
      `Theta × gün × 100 × kontrat = −${Fmt.num(th)} × ${days} × 100 × ${n} ≈ ${Fmt.money(v)}. Theta vade yaklaştıkça değiştiği için bu bir yaklaşımdır.`, rng);
  } },
  { id: 'debitSpread', level: 4, make(rng) {
    const k1 = rng.pick([50, 100, 150]); const w = rng.pick([5, 10]);
    const p1 = rng.pick([4.20, 5.60, 6.30]); const p2 = cents(p1 - rng.pick([1.40, 2.10, 2.80]));
    const m = Strategy.metrics([makeLeg('call', 1, k1, p1), makeLeg('call', -1, k1 + w, p2)]);
    return build(`Bull call spread: **${Fmt.num(k1, 0)} call al ${usd(p1)}**, **${Fmt.num(k1 + w, 0)} call sat ${usd(p2)}**. Maksimum kâr?`,
      Fmt.money(m.maxProfit), [Fmt.money(-m.maxLoss), Fmt.money(w * 100), Fmt.money((w + p1 - p2) * 100)],
      `Net borç ${Fmt.num(p1 - p2)} $. Maks kâr = (genişlik − borç) × 100 = (${Fmt.num(w, 0)} − ${Fmt.num(p1 - p2)}) × 100 = ${Fmt.money(m.maxProfit)}.`, rng);
  } },
  { id: 'creditSpread', level: 4, make(rng) {
    const k = rng.pick([90, 95, 140]); const w = rng.pick([5, 10]);
    const ps = rng.pick([2.30, 2.90, 3.60]); const pb = cents(ps - rng.pick([0.80, 1.25, 1.70]));
    const m = Strategy.metrics([makeLeg('put', -1, k, ps), makeLeg('put', 1, k - w, pb)]);
    return build(`Bull put spread: **${Fmt.num(k, 0)} put sat ${usd(ps)}**, **${Fmt.num(k - w, 0)} put al ${usd(pb)}**. Maksimum zarar?`,
      Fmt.money(m.maxLoss), [Fmt.money(-w * 100), Fmt.money(-(ps - pb) * 100), Fmt.money(m.maxLoss - (ps - pb) * 200)],
      `Alınan kredi ${Fmt.num(ps - pb)} $. Maks zarar = (genişlik − kredi) × 100 = (${Fmt.num(w, 0)} − ${Fmt.num(ps - pb)}) × 100 → ${Fmt.money(m.maxLoss)}.`, rng);
  } },
  { id: 'expMove', level: 5, make(rng) {
    const s = rng.pick([80, 100, 150, 400]); const iv = rng.pick([0.20, 0.30, 0.45, 0.60]); const d = rng.pick([7, 30, 45]);
    const em = expectedMove(s, iv, d);
    return build(`Hisse **${usd(s, 0)}**, IV **${Fmt.pct(iv)}**, vadeye **${d} gün**. 1 standart sapmalık beklenen hareket kabaca kaç $?`,
      `±${usd(cents(em))}`, [`±${usd(cents(s * iv))}`, `±${usd(cents((s * iv * d) / 365))}`, `±${usd(cents(em * 2))}`],
      `S × IV × √(gün/365) = ${Fmt.num(s, 0)} × ${Fmt.num(iv)} × √(${d}/365) ≈ ${usd(cents(em))}. Bu kaba bir ölçüdür; hisse bunun dışına da çıkabilir.`, rng);
  } },
  { id: 'sizing', level: 6, make(rng) {
    const acct = rng.pick([8000, 15000, 25000, 40000]); const r = rng.pick([0.01, 0.02, 0.03]); const ml = rng.pick([180, 260, 340, 420]);
    const n = Math.floor((acct * r) / ml);
    const fmt = (x) => (x === 0 ? 'Hiç açma (0)' : `${x} spread`);
    return build(`Hesap **${mny(acct)}**, kural: trade başına en fazla **${Fmt.pct(r)}** risk. 1 spread'in maks zararı **${mny(ml)}**. En fazla kaç spread?`,
      fmt(n), [fmt(n + 1), fmt(n + 2), fmt(n + 3)],
      `Risk bütçesi ${mny(acct * r)}. ${mny(acct * r)} ÷ ${mny(ml)} = ${Fmt.num((acct * r) / ml)} → aşağı yuvarla: ${fmt(n)}. Boyut maks zarardan hesaplanır.`, rng);
  } },
  { id: 'sellerCard', level: 7, make: sellerCard },
  { id: 'cspYield', level: 7, make(rng) {
    const k = rng.pick([50, 80, 100, 150, 200]); const d = rng.pick([30, 35, 40, 45]);
    const p = cents(k * rng.pick([0.01, 0.015, 0.02, 0.025]));
    const y = annualizedYield(p, k, d);
    return build(`**${Fmt.num(k, 0)} put**'u **${usd(p)}**'a sattın, vadeye **${d} gün** var. Teminata göre yıllık getiri kabaca kaç?`,
      Fmt.pct(y, 1), [Fmt.pct(p / k, 1), Fmt.pct((p / k) * 365, 1), Fmt.pct(y * 2, 1)],
      `(Prim ÷ strike) × (365 ÷ gün) = (${Fmt.num(p)} ÷ ${Fmt.num(k, 0)}) × (365 ÷ ${d}) ≈ ${Fmt.pct(y, 1)}. Bu rakam atanmazsan geçerlidir; riski göstermez.`, rng);
  } },
  { id: 'cashGap', level: 7, make(rng) {
    const k = rng.pick([50, 80, 100, 150]); const d = rng.pick([30, 35, 45]); const r = rng.pick([0.03, 0.04, 0.045]);
    const p = cents(k * rng.pick([0.015, 0.02, 0.025]));
    const prem = p * 100; const cash = (k * 100 * r * d) / 365;
    const q = build(`**${Fmt.num(k, 0)} put** prim **${usd(p)}**, **${d} gün**. Aynı teminat örnek **${Fmt.pct(r, 1)}** faizde dursaydı. Prim, faizden kabaca kaç $ fazla?`,
      Fmt.money(prem - cash), [Fmt.money(prem), Fmt.money(cash), Fmt.money(prem + cash)],
      `Prim ${Fmt.num(p)} × 100 = ${mny(prem)}. Teminat ${Fmt.num(k, 0)} × 100 = ${mny(k * 100)}. Faiz ${mny(k * 100)} × ${Fmt.pct(r, 1)} × ${d} ÷ 365 ≈ ${mny(cash)}. Fark ${Fmt.money(prem - cash)}. Bu fark bedava değil: düşüş riskini taşımanın ücretidir.`, rng);
    q.refutes = {
      [Fmt.money(prem)]: `${mny(prem)} primin kendisi; faizi düşmedin.`,
      [Fmt.money(cash)]: `${mny(cash)} faizin kendisi, fark değil.`,
      [Fmt.money(prem + cash)]: 'İkisini topladın; fark için çıkarman gerekir.',
    };
    return q;
  } },
  { id: 'cspCash', level: 7, make(rng) {
    const k = rng.pick([35, 60, 90, 120, 200]); const cash = rng.pick([5000, 10000, 15000, 25000]);
    const n = Math.floor(cash / (k * 100));
    const fmt = (x) => (x === 0 ? 'Hiç açamam (0)' : `${x} kontrat`);
    return build(`Hesapta **${mny(cash)}** nakit var. **${Fmt.num(k, 0)} put** için nakit teminatlı en fazla kaç kontrat satabilirsin?`,
      fmt(n), [fmt(n + 1), fmt(n + 2), fmt(n + 4)],
      `1 kontrat atanırsa ${Fmt.num(k, 0)} × 100 = ${mny(k * 100)} ödersin. ${mny(cash)} ÷ ${mny(k * 100)} = ${Fmt.num(cash / (k * 100))} → aşağı yuvarla: ${fmt(n)}.`, rng);
  } },
  { id: 'profitTake', level: 7, make(rng) {
    const p = rng.pick([1.00, 1.40, 2.00, 3.00, 3.60, 4.20]); const x = rng.pick([0.5, 0.6, 0.7]);
    const buy = cents(p * (1 - x)); const gain = (p - buy) * 100;
    const opt = (a, b) => `${usd(a)} · ${Fmt.money(b)}`;
    const word = x === 0.5 ? "%50'sini" : x === 0.6 ? "%60'ını" : "%70'ini";
    return build(`Put'u **${usd(p)}**'a sattın. Kuralın: primin **${word}** kazanınca kapat. Kaçtan geri alırsın, 1 kontrat kârı kaç?`,
      opt(buy, gain), [opt(p, gain), opt(Math.abs(p - buy - buy) < 0.005 ? cents(p * 1.5) : p - buy, gain), opt(buy, p * 100)],
      `Kalan prim %${Fmt.num((1 - x) * 100, 0)}: ${Fmt.num(p)} × ${Fmt.num(1 - x)} = ${usd(buy)}. Kâr = (${Fmt.num(p)} − ${Fmt.num(buy)}) × 100 = ${Fmt.money(gain)}.`, rng);
  } },
  { id: 'stopBuyback', level: 7, make(rng) {
    const p = rng.pick([0.90, 1.25, 1.60, 2.20, 3.10]); const m = rng.pick([2, 3]);
    const buy = cents(p * m); const loss = -(buy - p) * 100;
    const opt = (a, b) => `${usd(a)} · ${Fmt.money(b)}`;
    return build(`Prim **${usd(p)}**. Kuralın: geri alım primin **${m} katına** çıkarsa kapat. Kaçtan kapatırsın, 1 kontrat zararı kaç? Boşluk olmadığını varsay.`,
      opt(buy, loss), [opt(buy, -buy * 100), opt(p, loss), opt(buy, -p * 100 * (m + 1))],
      `Geri alım ${Fmt.num(p)} × ${m} = ${usd(buy)}. Primi almıştın, bu yüzden sonuç (${Fmt.num(p)} − ${Fmt.num(buy)}) × 100 = ${Fmt.money(loss)}. Boşlukta fiyat bu seviyeyi atlayabilir; kural garanti değildir.`, rng);
  } },
  { id: 'ccOutcome', level: 7, make(rng) {
    const c = rng.pick([40, 50, 90, 100]); const k = c + rng.pick([-5, -2.5, 5, 10]); const p = rng.pick([0.80, 1.20, 1.75, 2.40]);
    const v = (k - c + p) * 100; const kd = k === Math.round(k) ? 0 : 1;
    const spot = k < c ? ` (o sırada hisse ${usd(k - rng.pick([1, 2, 3]), 2)})` : '';
    return build(`100 hisseyi **${usd(c, 0)}**'dan aldın. **${Fmt.num(k, kd)} call**'u **${usd(p)}**'a sattın${spot}. Hisse strike'ın üstünde biter, çağrılırsın. Toplam sonuç?`,
      Fmt.money(v), [Fmt.money((k - c) * 100), Fmt.money(p * 100), Fmt.money(-v)],
      `(Strike − maliyet + prim) × 100 = (${Fmt.num(k, kd)} − ${Fmt.num(c, 0)} + ${Fmt.num(p)}) × 100 = ${Fmt.money(v)}.${v < 0 ? ' Strike, prim düşülmüş maliyetinin altında: çağrılmak zararı kilitler. Bu call yazılmaz.' : ''}`, rng);
  } },
  { id: 'expectancy', level: 8, make(rng) {
    const w = rng.pick([0.40, 0.55, 0.65, 0.75]); const aw = rng.pick([120, 150, 200]); const al = rng.pick([180, 240, 300]);
    const ev = w * aw - (1 - w) * al;
    return build(`30 trade: kazanma oranı **${Fmt.pct(w)}**, ortalama kazanç **${mny(aw)}**, ortalama kayıp **${mny(al)}**. Trade başına beklenen değer?`,
      Fmt.money(ev), [Fmt.money(aw - al), Fmt.money(w * aw), Fmt.money(-ev)],
      `Beklenen değer = kazanma% × ort. kazanç − kayıp% × ort. kayıp = ${Fmt.num(w)} × ${Fmt.num(aw, 0)} − ${Fmt.num(1 - w)} × ${Fmt.num(al, 0)} = ${Fmt.money(ev)}. Yüksek kazanma oranı tek başına yetmez.`, rng);
  } },
];

export function generate({ level, count, seed, preferLevel = null }) {
  const rng = new SplitMix(seed);
  const pool = KINDS.filter((k) => k.level <= level);
  if (!pool.length) return [];
  const preferred = pool.filter((k) => k.level === preferLevel);
  const out = [];
  const used = new Set();
  for (let i = 0; i < count; i++) {
    const source = i % 2 === 0 && preferred.length ? preferred : pool;
    const fresh = source.filter((k) => !used.has(k.id));
    const unused = pool.filter((k) => !used.has(k.id));
    const k = rng.pick(fresh.length ? fresh : unused.length ? unused : source);
    used.add(k.id);
    out.push(k.make(rng));
  }
  return out;
}

export function missedRule(kind, q) {
  if (kind === 'sellerCard') {
    return q.flag ? SELLER_LIMITS[q.flag] ?? q.flag : 'Temiz kart → bütün kurallar uyuyorsa açılabilir';
  }
  return {
    cspYield: 'Yıllık getiri → (prim ÷ strike) × (365 ÷ gün)',
    cashGap: 'Faiz farkı → prim − teminat × faiz × gün ÷ 365',
    cspCash: 'Kontrat sayısı → nakit ÷ (strike × 100), aşağı yuvarla',
    profitTake: 'Kâr alma → geri alım = prim × (1 − kâr oranı)',
    stopBuyback: 'Zarar kesme → (prim − geri alım) × 100',
    ccOutcome: 'Çağrılma sonucu → (strike − maliyet + prim) × 100',
  }[kind] ?? 'Hesap';
}

export function drillQuestion(ids, round, seed) {
  if (!ids.length || round < 1) return null;
  const rng = new SplitMix(seed);
  const seen = new Set();
  let last = null;
  for (let r = 1; r <= round; r++) {
    const kind = KINDS.find((k) => k.id === ids[(r - 1) % ids.length]);
    if (!kind) return null;
    let q = kind.make(rng);
    let tries = 0;
    while (seen.has(q.q) && tries < 50) { q = kind.make(rng); tries += 1; }
    seen.add(q.q);
    last = q;
  }
  return last;
}
