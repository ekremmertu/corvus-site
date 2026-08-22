"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/taxonomy";
import { useScene } from "@/components/scene/SceneProvider";

/**
 * Disiplin değişiminde ekranı soldan sağa süpüren renk dalgası —
 * Ciao'daki tat değişimi hissi. Transform-only, tek div, ~600ms.
 */
export default function SweepFx() {
  const { active } = useScene();
  const [sweep, setSweep] = useState<{ color: string; key: number } | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSweep({ color: categories[active].accent, key: Date.now() });
  }, [active]);

  if (!sweep) return null;

  return (
    <div
      key={sweep.key}
      aria-hidden
      className="sweep-fx"
      style={{ background: `linear-gradient(90deg, transparent, ${sweep.color}, transparent)` }}
      onAnimationEnd={() => setSweep(null)}
    />
  );
}
