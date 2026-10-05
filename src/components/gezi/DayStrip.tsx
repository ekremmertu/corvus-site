import type { Plan } from "@/lib/gezi";
import { t } from "@/lib/gezi-i18n";

/** Planın haftası tek bakışta: her gün bir kart — numara, tema, durak sayısı. Kart o güne iner. */
export default function DayStrip({ plan }: { plan: Plan }) {
  const d = t(plan.lang);
  return (
    <nav className="gz-strip" aria-label={d.daysOf(plan.city)}>
      <ol className="gz-strip__list">
        {plan.days.map((day) => (
          <li key={day.index}>
            <a href={`#gun-${day.index}`} className="gz-strip__card">
              <span className="gz-strip__top">
                <span className="gz-strip__num gz-display" aria-hidden="true">{String(day.index).padStart(2, "0")}</span>
                {day.type === "dayTrip" ? <span className="gz-strip__trip">{d.dayTrip}</span> : null}
              </span>
              <span className="gz-strip__theme">
                <span className="sr-only">{d.dayN(day.index)}: </span>
                {day.theme}
              </span>
              <span className="gz-strip__meta gz-mono">
                {d.stopsN(day.stops.length)}
                <span>{day.stops[0]?.start}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
