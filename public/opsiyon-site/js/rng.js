const MASK = (1n << 64n) - 1n;

/** OptionMath tarafındaki SplitMix'in birebir aynısı: aynı tohum aynı fiyat yolunu verir. */
export class SplitMix {
  constructor(seed) { this.state = BigInt.asUintN(64, BigInt(seed)); }

  next() {
    this.state = (this.state + 0x9E3779B97F4A7C15n) & MASK;
    let z = this.state;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & MASK;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & MASK;
    return z ^ (z >> 31n);
  }

  u() { return Number(this.next() >> 11n) / 2 ** 53; }
  below(n) { return Number((this.next() * BigInt(n)) >> 64n); }
  pick(xs) { return xs[this.below(xs.length)]; }
  int(lo, hi) { return lo + this.below(hi - lo + 1); }
  bool() { return ((this.next() >> 17n) & 1n) === 1n; }

  gauss() {
    const u1 = Math.max(this.u(), 1e-12);
    const u2 = this.u();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  shuffle(xs) {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.below(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export const randomSeed = () => BigInt(1 + Math.floor(Math.random() * 2 ** 52));
