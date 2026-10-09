/**
 * Hakem düzeltme işaretleri (CEO isteği 09.10.2026): yalnız NEXT_PUBLIC_FIX_STARS=1 ile
 * yapılan YEREL derlemede görünür. Vercel derlemesinde bu değişken yok → hiçbir şey basmaz.
 */
export const FIX_STARS_ON = process.env.NEXT_PUBLIC_FIX_STARS === "1";

export const FIXES: Record<number, string> = {
  1: '"İOS" → "iOS" (Türkçe büyük harf hatası)',
  2: "iOS kartı: telefonlar büyüdü (150 → 196 px) + turuncu koyulaştı (≥4,5:1)",
  3: "Sekme sayıları + lila kart \"4 proje\" kontrastı",
  4: "\"Canlıda\" 20 = yayındaki uygulama/web (SplitTable + Manager App Store'da) + kurumsal + trading + AI; /work rozetleri de aynı",
  5: "İngilizcede tek ana düğme adı: \"Let's talk\"",
  6: 'Türkçe sayfada İngilizce "Live" etiketi kaldırıldı',
  7: '"Ekranlar" başlığına üst boşluk',
  8: "/work: ok düğmesi tek başına satıra düşmüyor",
  9: "Mobil: yarısı boş Kurumsal kartı kısaldı",
  10: "/work kartlarına gerçek görsel, ortalı; kart zemini sayfadan ayrışıyor",
  11: "Gizli kartlar: gri iskelet çubuk yerine kilitli kart",
  12: "İngilizce sayfada İngilizce CVtoapply görseli",
  13: "İngilizce sayfada kurumsal panel yazıları İngilizce (W16, 8.2%, Last 26 weeks…)",
  14: "Türkçe sayfada etiketler Türkçe (40 bölüm, Kariyer simülasyonu…) + \"TRADİNG\" → \"TRADING\"",
  15: "Filtre sayıları okunur (3,38 → ≥4,5:1)",
  16: "Ameliea telefon yerine tarayıcı çerçevesinde (web ürünü)",
  17: "Logo kapakları yerine gerçek ekranlar; iOS kartında yukarıda geçmeyen 3 uygulama (Manager, Quill, Lingoria)",
  19: "Giriş başlığı geçişi 1,6–1,8 sn → 1 sn",
  20: "İngilizce sayfada TripWalkers ekranları İngilizce (hero + öne çıkan app)",
  18: "Ürün adı bandı artık yürümüyor: sabit, ortalı satır",
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
