import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import Phone from "@/components/Phone";
import Parallax from "@/components/fx/Parallax";
import SectionLink from "@/components/SectionLink";
import Link from "next/link";

/**
 * Hero — "Uygulamaların arkasındaki stüdyo." (CEO onayı, hubX dili, 09.10.2026)
 * Dev CORVUS harfleri önünde gerçek ekranlı 3 telefon. Yalnız perdesiz
 * (açık) ürünlerin ekranları kullanılır.
 */
export default function Hero({ locale, d }: { locale: Locale; d: Dict }) {
  const tr = locale === "tr";
  return (
    <header className="hero grain">
      <h1 className="h-display wrap" data-in style={{ position: "relative", zIndex: 3, margin: "0 auto", transitionDelay: ".08s" }}>
        {d.hero.title1}
        <br />
        <span className="serif sheen">{d.hero.title2}</span>
      </h1>
      <p className="lede hero-sub" data-in style={{ position: "relative", zIndex: 3, transitionDelay: ".16s" }}>
        {d.hero.sub}
      </p>
      <div className="hero-acts" data-in style={{ transitionDelay: ".24s" }}>
        <SectionLink locale={locale} id="contact" className="pill pill-white">
          {d.hero.ctaPrimary}
        </SectionLink>
        <Link href={`/${locale}/work`} className="link-arrow">
          {d.hero.ctaSecondary}
        </Link>
      </div>

      <div className="hero-word" aria-hidden>
        CORVUS
      </div>
      <Parallax className="hero-stage">
        <div className="hero-spot" aria-hidden />
        <Phone
          className="side side-l reflect"
          src="/shots/tw-ov.jpg"
          alt={tr ? "TripWalkers uygulamasında Tokyo gezi planı" : "TripWalkers trip overview for Tokyo"}
          style={{ transitionDelay: ".3s" }}
        />
        <Phone
          className="side side-r reflect"
          src="/shots/am-splash.jpg"
          alt={tr ? "Ameliea davetiye uygulamasının açılış ekranı" : "Ameliea invitation app splash screen"}
          style={{ transitionDelay: ".3s" }}
        />
        <Phone
          className="iph-lg reflect"
          src="/shots/q-income.jpg"
          alt={tr ? "Quill uygulamasında aylık gelir ekranı" : "Quill monthly income screen"}
          style={{ zIndex: 5, transitionDelay: ".15s" }}
          eager
          view
        />
      </Parallax>
      <div className="hero-fade" aria-hidden />
    </header>
  );
}
