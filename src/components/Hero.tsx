import type { Locale } from "@/data/taxonomy";
import type { Dict } from "@/i18n/dict";
import Phone from "@/components/Phone";
import Parallax from "@/components/fx/Parallax";
import SectionLink from "@/components/SectionLink";
import Link from "next/link";

/**
 * Hero — "Uygulamaların arkasındaki stüdyo." (CEO onayı, hubX dili, 09.10.2026)
 * Dev CORVUS harfleri önünde logolu açılış ekranlı 3 telefon (CEO 09.10.2026:
 * ortada TripWalkers, solda SplitTable, sağda CVtoapply). Yalnız perdesiz ürünler.
 */
export default function Hero({ locale, d }: { locale: Locale; d: Dict }) {
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
          src="/shots/cover-st.jpg"
          alt="SplitTable"
          style={{ transitionDelay: ".3s" }}
        />
        <Phone
          className="side side-r reflect"
          src="/shots/cover-cv.jpg"
          alt="CVtoapply"
          style={{ transitionDelay: ".3s" }}
        />
        <Phone
          className="iph-lg reflect"
          src="/shots/cover-tw.jpg"
          alt="TripWalkers"
          style={{ zIndex: 5, transitionDelay: ".15s" }}
          eager
          view
        />
      </Parallax>
      <div className="hero-fade" aria-hidden />
    </header>
  );
}
