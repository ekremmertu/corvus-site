"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/data/taxonomy";

/**
 * Ana sayfadaki bir bölüme götüren link.
 *
 * Adres çubuğuna `#process` YAZMAZ (CEO kararı 2026-08-23) — sadece kaydırır.
 * Başka bir sayfadaysak önce ana sayfaya geçer, bölüm DOM'a gelince kaydırır.
 * `href` yine de dolu: JavaScript çalışmazsa tarayıcının kendi çapası devreye girer.
 */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const navH =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
    ) || 72;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - navH - 12,
    behavior: reduced ? "auto" : "smooth",
  });
  return true;
}

export default function SectionLink({
  locale,
  id,
  className,
  children,
  onNavigate,
}: {
  locale: Locale;
  id: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const home = `/${locale}`;

  return (
    <Link
      href={`${home}#${id}`}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();

        if (pathname === home) {
          scrollToSection(id);
          return;
        }

        // Ana sayfaya fragment'siz geç, bölüm basılana kadar bekle.
        router.push(home);
        let tries = 0;
        const tick = () => {
          if (scrollToSection(id)) return;
          if (++tries < 150) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      {children}
    </Link>
  );
}
