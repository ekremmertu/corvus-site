import { ImageResponse } from "next/og";
import { isLocale } from "@/i18n/dict";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Corvus Tech — product studio";

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";

  const headline =
    locale === "tr" ? "Yayına çıkan ürünler kuruyoruz." : "We build products that ship.";
  const sub =
    locale === "tr"
      ? "iOS · Web · Fintech · AI Otomasyon · Kurumsal"
      : "iOS · Web · Fintech · AI Automation · Enterprise";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05060a",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#f4f6fb",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 180,
            left: 640,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "#5B8CFF",
            opacity: 0.22,
            filter: "blur(120px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14, letterSpacing: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: "#5B8CFF" }} />
          <div style={{ fontSize: 24, textTransform: "uppercase" }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, maxWidth: 900 }}>
            {headline}
          </div>
          <div style={{ fontSize: 28, color: "#9aa2b8" }}>{sub}</div>
        </div>

        <div style={{ fontSize: 22, color: "#5c6479", letterSpacing: 4 }}>
          {SITE.url.replace("https://", "")}
        </div>
      </div>
    ),
    size
  );
}
