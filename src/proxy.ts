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
  // Bülten Web: /tr/bultenv2, /en/bultenv2, /BultenV2 gibi yazımlar doğru adrese (eski yönlendirme tarayıcıda kalmış olabilir)
  const bulten = pathname.match(/^(?:\/(?:tr|en))?\/bultenv2(\/.*)?$/i);
  if (bulten && pathname !== "/bultenv2" && !pathname.startsWith("/bultenv2/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/bultenv2" + (bulten[1] ?? "");
    return NextResponse.redirect(url);
  }

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
  // Bülten Web: dil öneki yok, next.config rewrite'ı sunucuya iletir
  if (pathname === "/bultenv2" || pathname.startsWith("/bultenv2/")) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
