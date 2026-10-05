import Link from "next/link";
import { t, type Locale } from "@/lib/gezi-i18n";

/** Sayfanın öbür dildeki karşılığı (yoksa hiç görünmez). Hem ziyaretçi hem tarayıcı botu için. */
export default function LangSwitch({ locale, href }: { locale: Locale; href: string | null }) {
  if (!href) return null;
  const other = locale === "tr" ? "en" : "tr";
  const d = t(locale).otherLang;
  return (
    <Link className="gz-lang" href={href} hrefLang={other} lang={other} title={d.hint}>
      {d.label}
    </Link>
  );
}
