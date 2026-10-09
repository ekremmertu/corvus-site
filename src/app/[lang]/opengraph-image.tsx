import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/dict";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Corvus Tech — the studio behind the apps";

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";

  const tr = locale === "tr";
  const l1 = tr ? "Uygulamaların arkasındaki" : "The studio behind";
  const l2 = tr ? "stüdyo." : "the apps.";
  const sub = tr ? "iOS · SaaS · AI · Fintech · Kurumsal" : "iOS · SaaS · AI · Fintech · Enterprise";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: 250,
            width: 700,
            height: 520,
            borderRadius: 9999,
            background: "#8e9bff",
            opacity: 0.28,
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            fontSize: 330,
            fontWeight: 800,
            letterSpacing: -20,
            color: "rgba(255,255,255,0.07)",
          }}
        >
          CORVUS
        </div>
        <div style={{ fontSize: 20, letterSpacing: 8, color: "#8e8e93", textTransform: "uppercase" }}>
          {SITE.name} · {SITE.city}
        </div>
        <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: -3, marginTop: 28 }}>{l1}</div>
        <div
          style={{
            fontSize: 92,
            fontStyle: "italic",
            fontWeight: 400,
            backgroundImage: "linear-gradient(100deg, #8e9bff, #c2a2ff 45%, #7debda)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {l2}
        </div>
        <div style={{ fontSize: 24, color: "#a1a1a6", marginTop: 30 }}>{sub}</div>
      </div>
    ),
    size
  );
}
