/** Ürün adı şeridi — yalnız perdesiz ürünler, ikiye katlanır (kesintisiz döngü). */
export default function Marquee({ label, names }: { label: string; names: string[] }) {
  const loop = [...names, ...names];
  return (
    <section className="trust" aria-label={label}>
      <p className="eyebrow" style={{ textAlign: "center", margin: "0 0 18px", fontSize: 11 }}>
        {label}
      </p>
      <p className="sr-only">{names.join(", ")}</p>
      <div className="marquee" aria-hidden>
        {loop.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </div>
    </section>
  );
}
