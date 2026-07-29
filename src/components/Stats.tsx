import type { Dict } from "@/i18n/dict";
import CountUp from "@/components/fx/CountUp";

export default function Stats({
  items,
}: {
  d: Dict;
  items: { value: string; label: string }[];
}) {
  return (
    <section
      aria-label="Studio in numbers"
      className="relative bg-[color:var(--c-bg)]/70"
    >
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="reveal">
            <CountUp
              value={s.value}
              className="display block text-[clamp(2rem,4vw,3.25rem)]"
              style={{ color: "var(--c-live)" }}
            />
            <p className="eyebrow mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
