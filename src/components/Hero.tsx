import type { Locale } from "@/data/taxonomy";
import FixStar from "@/components/fx/FixStar";
import type { Dict } from "@/i18n/dict";
import Phone from "@/components/Phone";
import Parallax from "@/components/fx/Parallax";
import SectionLink from "@/components/SectionLink";
import Link from "next/link";
import BrowserFrame from "@/components/BrowserFrame";
import BiDashboard from "@/components/bi/BiDashboard";

/**
 * Hero — "Dijital ürünlerin arkasındaki stüdyo." (CEO onayı, hubX dili, 09.10.2026)
 * Dev CORVUS harfleri önünde üç cihazlı sahne (CEO 09.10.2026, hero-section pipeline):
 * solda web/SaaS (cvtoapply.co), ortada TripWalkers telefonu, sağda kurumsal panel (petrol, örnek veri).
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
        <FixStar n={5} />
      </div>

      <div className="hero-word" aria-hidden>
        CORVUS
      </div>
      <Parallax className="hero-stage">
        <div className="hero-spot" aria-hidden />
        <figure className="hero-win hero-win-l">
          <BrowserFrame url="cvtoapply.co">
            <img src={tr ? "/shots/web-cv.jpg" : "/shots/web-cv-en.jpg"} alt={tr ? "CVtoapply web sitesi ana sayfası" : "CVtoapply website home page"} width={1200} height={750} decoding="async" />
          </BrowserFrame>
          <figcaption>
            {d.home.stageWeb}
            <FixStar n={12} />
          </figcaption>
        </figure>
        <figure className="hero-win hero-win-r">
          <BrowserFrame url={tr ? "Operasyon Paneli" : "Operations dashboard"}>
            <BiDashboard label={d.home.dashLabel} />
          </BrowserFrame>
          <figcaption>{d.home.stageEnt}</figcaption>
        </figure>
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
