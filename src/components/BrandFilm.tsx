"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/taxonomy";

/**
 * Marka filmi — hero'nun hemen altında tam genişlik şerit.
 * Sahne canvas'ıyla çakışmaması için kendi opak zeminini taşır.
 * Görünür değilken duraklatılır: sürekli dekode eden bir video
 * 3D sahnenin kare bütçesini yer.
 */
export default function BrandFilm({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      id="film"
      className="relative bg-[color:var(--c-bg)] py-10 sm:py-14"
      aria-label={locale === "tr" ? "Marka filmi" : "Brand film"}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--c-border)] bg-black">
          {reduced ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/brand/corvus-poster.jpg"
              alt=""
              className="block w-full"
              width={1920}
              height={1080}
            />
          ) : (
            <video
              ref={ref}
              className="block w-full"
              poster="/brand/corvus-poster.jpg"
              width={1920}
              height={1080}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            >
              <source src="/videos/corvus-intro.webm" type="video/webm" />
              <source src="/videos/corvus-intro.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
}
