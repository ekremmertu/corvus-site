const WORDS = [
  "SwiftUI",
  "Next.js",
  "Supabase",
  "Swift 6",
  "TypeScript",
  "Python",
  "Multi-agent AI",
  "StoreKit 2",
  "FastAPI",
  "Pine Script",
  "Power BI",
  "Three.js",
];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-[color:var(--c-border)] bg-[color:var(--c-bg)]/70 py-4 backdrop-blur-[2px]"
    >
      <div className="marquee-track gap-10">
        {row.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="mono flex shrink-0 items-center gap-10 text-[11px] uppercase tracking-[0.22em] text-faint"
          >
            {w}
            <span style={{ color: "var(--c-live)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
