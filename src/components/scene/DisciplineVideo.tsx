"use client";

import { useEffect, useRef } from "react";
import { categories } from "@/data/projects";
import { useScene } from "./SceneProvider";

/**
 * Aktif disiplinin sinematik loop videosu — 3D canvas'ın OLMADIĞI yerlerde
 * (mobil, WebGL yok, work/proje sayfaları) sabit, kısık ambient arka plan.
 * Higgsfield (kling3_0_turbo) üretimi, /videos/<slug>.mp4.
 * reduced-motion'da hiç yüklenmez; video yoksa sessizce halo'ya düşer.
 */
export default function DisciplineVideo() {
  const { active } = useScene();
  const videoRef = useRef<HTMLVideoElement>(null);
  const slug = categories[active].slug;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    const p = v.play();
    if (p) p.catch(() => {}); // autoplay engellenirse poster/halo yeter
  }, [slug]);

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      key={slug}
      className="absolute inset-0 h-full w-full object-cover opacity-[0.32] transition-opacity duration-700"
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden
      onError={(e) => {
        (e.currentTarget as HTMLVideoElement).style.display = "none";
      }}
    >
      <source src={`/videos/${slug}.mp4`} type="video/mp4" />
    </video>
  );
}
