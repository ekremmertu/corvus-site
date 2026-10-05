"use client";

import { usePathname } from "next/navigation";
import { appStoreHref, campaignOf } from "@/lib/gezi-links";
import { ROUTES, t, type Locale } from "@/lib/gezi-i18n";

/** App Store bağlantısı — kampanya kodu (ct) bulunduğu sayfaya göre; üst şerit, alt bilgi, CTA ve 404'te ortak. */
export default function HeaderCta({
  locale,
  className = "gz-btn gz-btn--sm",
  children,
}: {
  locale: Locale;
  className?: string;
  children?: React.ReactNode;
}) {
  const root = ROUTES[locale].root;
  const path = usePathname() ?? root;
  const rest = path.startsWith(root) ? path.slice(root.length) : "";
  return (
    <a className={className} href={appStoreHref(locale, campaignOf(locale, rest))} rel="noopener">
      {children ?? t(locale).cta}
    </a>
  );
}
