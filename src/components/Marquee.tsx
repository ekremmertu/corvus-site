import FixStar from "@/components/fx/FixStar";

/** Ürün adı satırı — yalnız perdesiz ürünler; sabit, ortalı (yürüyen bant kaldırıldı, ★18). */
export default function Marquee({ label, names }: { label: string; names: string[] }) {
  return (
    <section className="trust" aria-label={label}>
      <p className="eyebrow" style={{ textAlign: "center", margin: "0 0 18px", fontSize: 11 }}>
        {label}
      </p>
      <div className="marquee">
        {names.map((n) => (
          <span key={n}>{n}</span>
        ))}
        <FixStar n={18} />
      </div>
    </section>
  );
}
