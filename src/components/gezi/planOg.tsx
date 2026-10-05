import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPlan, money, planStats } from "@/lib/gezi";
import { t, type Locale } from "@/lib/gezi-i18n";

export const OG_SIZE = { width: 1200, height: 630 };
const fontDir = path.join(process.cwd(), "src", "components", "gezi", "og");

/** Paylaşım kartı: şehir adı dev, altında gün sayısı + durak + mevsim; TripWalkers işareti. İki dil ortak. */
export async function planOgImage(slug: string, locale: Locale) {
  const plan = getPlan(slug, locale);
  if (!plan) return new Response("Not found", { status: 404 });
  const display = readFileSync(path.join(fontDir, "Gloock-Regular.ttf"));
  const d = t(locale);
  const s = planStats(plan);
  const place = [plan.city, plan.region, plan.country].filter(Boolean).join(" · ").toLocaleUpperCase(locale);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F5F2EC", padding: "64px 72px", color: "#171717", fontFamily: "Gloock" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#F25623" }} />
            TripWalkers
          </div>
          <div style={{ display: "flex", fontSize: 24, padding: "8px 18px", borderRadius: 999, background: "#171717", color: "#F5F2EC" }}>
            {plan.seasonLabel}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#B23C12", letterSpacing: 2, marginBottom: 10 }}>{place}</div>
          <div style={{ fontSize: plan.city.length > 12 ? 104 : 136, lineHeight: 0.95, letterSpacing: -2 }}>{plan.city}</div>
          <div style={{ fontSize: 64, color: "#66625B", marginTop: 8 }}>{d.ogTagline}</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {[d.ogDays(plan.totalDays), d.ogStops(s.stops), d.ogPerDay(money(s.perDay, plan.currency, locale))].map((x) => (
            <div key={x} style={{ display: "flex", fontSize: 28, padding: "14px 22px", borderRadius: 14, border: "2px solid #DEDAD2", background: "#FFFFFF" }}>{x}</div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Gloock", data: display, weight: 400, style: "normal" }] },
  );
}
