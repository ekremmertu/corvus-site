import { NextResponse } from "next/server";

// Opsiyon Ustası canlı vakası: tarayıcı Yahoo'ya doğrudan gidemez (CORS), bu uç aracılık eder.
// Yalnız tek sembol ve geçerli tarih kabul eder; açık vekil değildir. Ücretsiz uç, anahtar yok.
const ALLOWED = new Set(["^GSPC"]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY = 86_400;

const epoch = (date: string) => {
  const ms = Date.parse(`${date}T00:00:00Z`);
  return Number.isNaN(ms) ? null : ms / 1000;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const p1 = DATE.test(from) ? epoch(from) : null;
  const p2 = DATE.test(to) ? epoch(to) : null;
  if (!ALLOWED.has(symbol) || p1 === null || p2 === null || p2 < p1 || p2 - p1 > 60 * DAY) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${p1}&period2=${p2 + 2 * DAY}&interval=1d`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ error: "Kaynak yanıt vermedi" }, { status: 502 });
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const offset: number = result?.meta?.gmtoffset ?? 0;
    const stamps: number[] = result?.timestamp ?? [];
    const prices: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
    const closes: Record<string, number> = {};
    stamps.forEach((t, i) => {
      const close = prices[i];
      if (close == null) return;
      const day = new Date((t + offset) * 1000).toISOString().slice(0, 10);
      if (day >= from && day <= to) closes[day] = close;
    });
    return NextResponse.json({ closes });
  } catch {
    return NextResponse.json({ error: "Kaynak yanıt vermedi" }, { status: 502 });
  }
}
