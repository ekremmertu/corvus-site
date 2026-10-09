import type { Dict } from "@/i18n/dict";

const ROMAN = ["i.", "ii.", "iii.", "iv."];

/** Dört kapı — metin sözlükteki süreç adımlarından. */
export default function Process({ d }: { d: Dict }) {
  return (
    <section id="process" className="proc" aria-labelledby="proc-title">
      <div className="wrap">
        <h2 id="proc-title" className="h-section reveal" style={{ margin: 0 }}>
          {d.home.procTitle1} <span className="serif sheen">{d.home.procTitle2}</span> {d.home.procTitle3}
        </h2>
        <p className="lede reveal" style={{ maxWidth: 560, marginTop: 20 }}>
          {d.process.sub}
        </p>
        <ol className="steps reveal" style={{ listStyle: "none", margin: "56px 0 0", paddingLeft: 0 }}>
          {d.process.steps.map((s, i) => (
            <li key={s.n}>
              <span className="k sheen" aria-hidden>
                {ROMAN[i]}
              </span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="tech reveal" aria-label="Stack">
          {["SwiftUI", "Swift 6", "Next.js", "Supabase", "RevenueCat", "Python", "Claude"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
