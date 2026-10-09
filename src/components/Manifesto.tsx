import type { Dict } from "@/i18n/dict";
import CountUp from "@/components/fx/CountUp";

/** "Ajans değiliz…" + veriden hesaplanan rakamlar. */
export default function Manifesto({
  d,
  stats,
}: {
  d: Dict;
  stats: { value: string; label: string; static?: boolean }[];
}) {
  return (
    <section className="mani grain" aria-label={d.home.mani1}>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <p className="mani-text reveal">
          {d.home.mani1} <b>{d.home.mani2}</b> {d.home.mani3} <b>{d.home.mani4}</b>
        </p>
        <dl className="stats reveal">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd style={{ margin: 0 }}>
                <strong>
                  {s.static ? s.value : <CountUp value={s.value} />}
                </strong>
                <small>{s.label}</small>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
