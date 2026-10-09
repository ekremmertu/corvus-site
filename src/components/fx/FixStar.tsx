/**
 * Hakem düzeltme işaretleri (CEO isteği 09.10.2026): yalnız NEXT_PUBLIC_FIX_STARS=1 ile
 * yapılan YEREL derlemede görünür. Vercel derlemesinde bu değişken yok → hiçbir şey basmaz.
 */
export const FIX_STARS_ON = process.env.NEXT_PUBLIC_FIX_STARS === "1";

export const FIXES: Record<number, string> = {
  1: '"İOS" → "iOS" (Türkçe büyük harf hatası)',
  2: "iOS kartı kontrastı: turuncu koyulaştı (2,87 → ≥4,5:1)",
  3: "Sekme sayıları + lila kart \"4 proje\" kontrastı",
  4: '"Canlıda" sayacı yalnız yayındaki ürünleri sayar',
  5: "İngilizcede tek ana düğme adı: \"Let's talk\"",
  6: 'Türkçe sayfada İngilizce "Live" etiketi kaldırıldı',
  7: '"Ekranlar" başlığına üst boşluk',
  8: "/work: ok düğmesi tek başına satıra düşmüyor",
  9: "Mobil: yarısı boş Kurumsal kartı kısaldı",
  10: "/work kartlarına gerçek görsel",
  11: "Gizli kartlar: gri iskelet çubuk yerine kilitli kart",
  12: "İngilizce sayfada İngilizce CVtoapply görseli",
};

export default function FixStar({ n, style }: { n: number; style?: React.CSSProperties }) {
  if (!FIX_STARS_ON) return null;
  return (
    <span className="fixstar" title={FIXES[n]} aria-hidden style={style}>
      ★{n}
    </span>
  );
}

export function FixLegend() {
  if (!FIX_STARS_ON) return null;
  return (
    <details className="fixlegend" open>
      <summary>★ Hakem düzeltmeleri (yalnız yerel)</summary>
      <ol>
        {Object.entries(FIXES).map(([n, t]) => (
          <li key={n}>
            <b>★{n}</b> {t}
          </li>
        ))}
      </ol>
    </details>
  );
}
