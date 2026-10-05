import { Fragment } from "react";
import { money, toMinutes, type Day, type Stop } from "@/lib/gezi";
import { CATEGORY_LABELS, t, type Locale } from "@/lib/gezi-i18n";

/** İki durak arasında ≥30 dk boşluk varsa ritim satırı: yol, mola, serbest zaman. */
function Gap({ from, to, locale }: { from: string; to: string; locale: Locale }) {
  const d = t(locale);
  const a = toMinutes(from);
  const b = toMinutes(to);
  if (a === null || b === null || b - a < 30) return null;
  const m = b - a;
  const label = m >= 60 ? `${Math.floor(m / 60)} ${d.hours}${m % 60 ? ` ${m % 60} ${d.minutes}` : ""}` : `${m} ${d.minutes}`;
  return (
    <li className="gz-gap" aria-label={d.gapAria(label)}>
      <span />
      <span className="gz-gap__rail" aria-hidden="true" />
      <span className="gz-gap__text gz-mono">{d.gap(label)}</span>
    </li>
  );
}

function Cost({ stop, currency, locale }: { stop: Stop; currency: string; locale: Locale }) {
  const d = t(locale);
  if (!stop.cost) return <span className="gz-cost gz-cost--free">{d.free}</span>;
  return <span className="gz-cost">{d.perPerson(money(stop.cost, currency, locale))}</span>;
}

export default function DaySection({ day, currency, locale }: { day: Day; currency: string; locale: Locale }) {
  const d = t(locale);
  const num = String(day.index).padStart(2, "0");
  return (
    <section id={`gun-${day.index}`} className="gz-day" aria-labelledby={`gun-${day.index}-baslik`}>
      <header className="gz-day__head">
        <span className="gz-day__num gz-display" aria-hidden="true">{num}</span>
        <p className="gz-day__kicker gz-mono">
          {d.dayN(day.index)} · {day.stops[0]?.start}–{day.stops.at(-1)?.end}
          {day.type === "dayTrip" ? <span className="gz-tag">{d.dayTrip}</span> : null}
        </p>
        <h2 id={`gun-${day.index}-baslik`} className="gz-day__title gz-display">{day.theme}</h2>
      </header>

      <ol className="gz-route">
        {day.stops.map((s, i) => (
          <Fragment key={`${s.name}-${s.start}`}>
          {i > 0 ? <Gap from={day.stops[i - 1].end} to={s.start} locale={locale} /> : null}
          <li className="gz-stop" style={{ ["--cat" as string]: `var(--c-${s.category})` }}>
            <p className="gz-stop__time">
              <time>{s.start}</time>
              <span><time>{s.end}</time></span>
            </p>
            <span className="gz-stop__rail" aria-hidden="true"><i /></span>
            <article className="gz-card">
              <p className="gz-card__cat gz-mono">
                <i aria-hidden="true" />{CATEGORY_LABELS[locale][s.category] ?? s.category}
                <span className="gz-card__time" aria-hidden="true">{s.start}–{s.end}</span>
              </p>
              <h3>{s.name}</h3>
              {s.tips ? <p className="gz-card__tip">{s.tips}</p> : null}
              <div className="gz-card__foot">
                <Cost stop={s} currency={currency} locale={locale} />
                {s.bookingUrl ? (
                  <a className="gz-book" href={s.bookingUrl} rel="nofollow noopener" target="_blank">
                    {d.tickets(s.bookingProvider ?? "")} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </article>
          </li>
          </Fragment>
        ))}
      </ol>

      {day.backups.length ? (
        <details className="gz-planb">
          <summary>{d.planB(day.backups.length)}</summary>
          <ul>
            {day.backups.map((b) => (
              <li key={b.name}>
                <b>{b.name}</b>
                {b.tips}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
