import { DASH_CARD, DASH_HERO } from "./dashSvg";

/** Kurumsal panel görseli (dekor, kurgu "Örnek veri"). Ekran okuyucuya tek cümleyle anlatılır. */
export default function BiDashboard({ variant = "hero", label }: { variant?: "hero" | "card"; label: string }) {
  return (
    <div className="bi" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: variant === "hero" ? DASH_HERO : DASH_CARD }} />
  );
}
