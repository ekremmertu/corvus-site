import Link from "next/link";
import { getCategory, statusLabels, type CardProject, type Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import VT from "@/components/fx/VT";

/**
 * Proje kartı. Perdeli projede gerçek isim/özet HTML'e HİÇ yazılmaz —
 * blur gizlilik sağlamaz; yerine anlamsız çubuklar konur (bkz. toCards).
 */
export default function ProjectCard({ project, locale, d }: { project: CardProject; locale: Locale; d: Dict }) {
  const category = getCategory(project.category);
  const status = statusLabels[project.status][locale];
  const isLive = project.status === "live";

  if (project.veil) {
    const label = project.veil === "confidential" ? d.work.veilConfidential : d.work.veilSoon;
    const note = project.veil === "confidential" ? d.work.veilNoteNda : d.work.veilNote;
    return (
      <div className="pcard veiled reveal" aria-label={`${category.name[locale]} — ${label}`}>
        <div className="pcard-top">
          <span>{category.name[locale]}</span>
          <span>{status}</span>
        </div>
        <span className="veil-tag">{label}</span>
        <div className="veil-bars" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <p style={{ flex: "none", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--dim)" }}>{note}</p>
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
        <span>{category.name[locale]}</span>
        <span className={isLive ? "live" : undefined}>{status}</span>
      </div>
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
      </div>
    </Link>
  );
}
