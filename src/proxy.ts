import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "tr"] as const;
const DEFAULT_LOCALE = "en";

function pickLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    if (tag.startsWith("tr")) return "tr";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();
  // /tripwalkers/planlar (TR) ve /tripwalkers/plans (EN) — TripWalkers rotaları: dil adreste sabit, kendi kök layout'ları var.
  // Çıplak /tripwalkers → tarayıcı diline göre ilgili dizine.
  if (pathname === "/tripwalkers" || pathname === "/tripwalkers/") {
    const url = request.nextUrl.clone();
    url.pathname = pickLocale(request) === "tr" ? "/tripwalkers/planlar" : "/tripwalkers/plans";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/tripwalkers/")) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
