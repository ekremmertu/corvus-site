import type { Locale } from "@/data/projects";
import type { Dict } from "@/i18n/dict";

export default function Process({ d }: { locale: Locale; d: Dict }) {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="relative bg-[color:var(--c-bg)]/86"
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <p className="eyebrow">{"// " + d.nav.process}</p>
        <h2 id="process-title" className="display mt-4 max-w-[18ch]" style={{ fontSize: "var(--type-h1)" }}>
          {d.process.title}
        </h2>
        <p className="lede mt-4 text-[15px]">{d.process.sub}</p>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--c-border)] bg-[color:var(--c-border)] sm:grid-cols-2 lg:grid-cols-4">
          {d.process.steps.map((s) => (
            <li
              key={s.n}
              className="reveal group relative bg-[color:var(--c-bg-elevated)] p-7 transition-colors duration-300 hover:bg-[color:var(--c-bg-elevated)]/60"
            >
              <span
                className="display block text-[3rem] leading-none opacity-25 transition-opacity duration-300 group-hover:opacity-70"
                style={{ color: "var(--c-live)" }}
              >
                {s.n}
              </span>
              <h3 className="display mt-6 text-lg">{s.t}</h3>
              <p className="lede mt-3 text-[14px]">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
