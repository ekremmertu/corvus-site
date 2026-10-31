const cache = new Map();

function nf(digits) {
  if (!cache.has(digits)) {
    cache.set(digits, new Intl.NumberFormat('tr-TR', { minimumFractionDigits: digits, maximumFractionDigits: digits }));
  }
  return cache.get(digits);
}

export const Fmt = {
  num: (v, digits = 2) => nf(digits).format(v),
  price: (v) => `${Fmt.num(v, 2)} $`,
  money(v, { signed = true, digits = 0 } = {}) {
    if (v === Infinity) return 'Sınırsız';
    if (v === -Infinity) return 'Sınırsız zarar';
    const body = Fmt.num(Math.abs(v), digits);
    if (!signed) return `${v < 0 ? '−' : ''}${body} $`;
    if (Math.abs(v) < 0.5 && digits === 0) return '0 $';
    return `${v >= 0 ? '+' : '−'}${body} $`;
  },
  pct: (v, digits = 0) => `%${Fmt.num(v * 100, digits)}`,
  signedPct: (v, digits = 1) => `${v < 0 ? '−' : '+'}%${Fmt.num(Math.abs(v) * 100, digits)}`,
  signed: (v, digits = 2) => `${v < 0 ? '−' : v > 0 ? '+' : ''}${Fmt.num(Math.abs(v), digits)}`,
};

const ENGLISH = new Set(['bid', 'credit', 'debit', 'diagonal', 'interest', 'iron', 'lizard', 'margin', 'mid', 'parity', 'percentile', 'pin', 'portfolio', 'protective', 'ratio', 'scalping', 'smile', 'sticky', 'strike', 'wing']);
/** Türkçe büyük harf; İngilizce terim gerçek ekrandaki yazımıyla kalır (BID, BİD değil). */
export const up = (s) => s.replace(/\p{L}+/gu, (w) => (ENGLISH.has(w.toLocaleLowerCase('en-US')) ? w.toUpperCase() : w.toLocaleUpperCase('tr-TR')));
export const low = (s) => s.toLocaleLowerCase('tr-TR');
