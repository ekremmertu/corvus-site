import Link from "next/link";
import CatName from "@/components/CatName";
import { getCategory, statusLabels, type CardProject, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import VT from "@/components/fx/VT";
import FixStar from "@/components/fx/FixStar";

/**
 * Proje kartı. Perdeli projede gerçek isim/özet HTML'e HİÇ yazılmaz —
 * blur gizlilik sağlamaz; yerine anlamsız çubuklar konur (bkz. toCards).
 */
export default function ProjectCard({ project, locale, d, mark }: { project: CardProject; locale: Locale; d: Dict; mark?: boolean }) {
  const category = getCategory(project.category);
  const status = statusLabels[project.status][locale];
  const isLive = project.status === "live";

  if (project.veil) {
    const label = project.veil === "confidential" ? d.work.veilConfidential : d.work.veilSoon;
    const note = project.veil === "confidential" ? d.work.veilNoteNda : d.work.veilNote;
    return (
      <div className="pcard veiled reveal" aria-label={`${category.name[locale]} — ${label}`}>
        <div className="pcard-top">
          <span>
            <CatName name={category.name[locale]} />
          </span>
          <span className={isLive ? "live" : undefined}>{status}</span>
        </div>
        {/* Gri iskelet çubuklar "yükleniyor" gibi okunuyordu → kilitli kart (★11) */}
        <div className="veil-lock" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
          {mark && <FixStar n={11} />}
        </div>
        <span className="veil-tag">{label}</span>
        <p className="veil-note">{note}</p>
        <div className="pcard-foot">
          {project.stack.slice(0, 3).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/work/${project.slug}`} className="pcard reveal">
      <div className="pcard-top">
        <span>
          <CatName name={category.name[locale]} />
          {mark && <FixStar n={1} />}
        </span>
        <span className={isLive ? "live" : undefined}>{status}</span>
      </div>
      {project.cover && (
        <div className={`pcard-cover ${project.cover.kind}`}>
          <img src={(locale === "en" && project.cover.srcEn) || project.cover.src} alt="" width={600} height={project.cover.kind === "web" ? 375 : 1300} loading="lazy" decoding="async" />
          {mark && <FixStar n={10} style={{ position: "absolute", top: 10, left: 10 }} />}
        </div>
      )}
      <VT name={`proj-${project.slug}`}>
        <h2 className="pcard-title">{project.name}</h2>
      </VT>
      <p>{project.summary?.[locale]}</p>
      {project.metrics && project.metrics.length > 0 && (
        <dl>
          {project.metrics.map((m) => (
            <div key={m.label.en}>
              <dt>{m.label[locale]}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="pcard-foot">
        {project.appStoreSoon && project.category === "ios" && <span className="chip chip-soon">{d.work.appStoreSoon}</span>}
        {project.stack.slice(0, 3).map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
        <span className="go" aria-hidden>
          →
        </span>
        {mark && <FixStar n={8} />}
      </div>
    </Link>
  );
}
