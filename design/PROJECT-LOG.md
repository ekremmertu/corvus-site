# 🎬 CINEMATIC LOG — TripWalkers Rotaları (corvus-tech.co/gezi)

> Son çalışma: 04.10.2026 — Lumière (sinematik persona), CEO: "200 sayfayı gerçekten dizayn edelim, bitince göster"

🎯 Site: TripWalkers plan havuzundaki 200 planı (100 şehir × Haziran–Eylül / Ekim–Mayıs) Google + ChatGPT'de bulunur sayfalara çevirmek
🛤️ Giriş yolu: B sıfırdan (referans yok) — CEO yön seçimini bana bıraktı ("bitince göster")
🎭 Ton / his: "Biri bu şehri benim için zaten yürümüş." Gezi rehberi değil, yol çizelgesi — saat saat, dürüst
👥 Kitle & pazar: TR — "kapadokya gezi planı", "roma 3 günlük gezi" arayan; AI asistanından plan isteyen
🎯 Conversion hedefi: tek — "Bu planı TripWalkers'ta aç" (App Store id6764424121)
🖥️ Tip & kategori sertliği: programatik SEO içerik sayfası → sinematik KISIK. İçerik > perf > estetik > hareket
⚙️ Stack: corvus-site (Next 16) içinde AYRI kök layout `src/app/gezi/layout.tsx` — stüdyo sitesinin WebGL sahnesi/cursor'u YÜKLENMEZ. SSG 200 + index. Lenis YOK (içerik sayfası, scroll'u kaçırmayız). WebGL YOK.
🖼️ Asset durumu: fotoğraf YOK (bilinçli — 200 şehir × lisanslı foto = asset borcu). Görsel dil veriden: hafta şeridi + rota çizgisi. Harita v1.1 (koordinatlar DB'de, JSON'da yok)

## 🎨 ESTETİK SİSTEM
- Tipografi: **Gloock** (display, editoryal serif — son 5 projede yok) + **Manrope** (gövde — TripWalkers app'in kendi fontu) + **Geist Mono** (saatler/etiketler). Scale 1.333.
- Palet: kağıt #F5F2EC · mürekkep #171717 · TripWalkers közü #F25623 (yalnız CTA + aktif gün) · koyu tema ayrı tasarlandı (#121110)
- Kategori renkleri (dataviz validator PASS, açık+koyu ayrı): yemek #D9502A · simge #2E5FB0 · doğa #3A8A57 · kültür #8B5BC4 · alışveriş #B8860B (koyu: #E0603A #5683D6 #3F9A66 #9B72DA #B88A1E)
- Kompozisyon: tek kolon okuma genişliği (68ch) + solda saat kolonu; masaüstünde sağda yapışkan gün listesi

## 🎞️ HAREKET DİLİ
- Motion grammar: **dry/precise** (180–300ms ease-out) — içerik sitesi
- Aktif craft: 2 (scroll-triggered: rota çizgisi CSS `animation-timeline: view()` ile çizilir, destek yoksa düz) · hafta şeridi barları yüklemede yükselir · reduced-motion'da hepsi kapalı

## 📽️ SAYFA SENARYOSU (plan sayfası)
1. Üst şerit: TripWalkers işareti · "Rotalar" · "Uygulamada aç"
2. Başlık bloğu (veri başlığı — pazarlama hero'su değil): şehir · bölge · ülke / H1 "Kapadokya gezi planı" / 7 gün · N durak · mevsim
3. **İMZA: Haftanın saat haritası** — 7 sütun × 06:00–24:00, her durak kategori renginde bar. Bir bakışta: "1. gün 05:00'te balon, 6. gün gün gezisi". Sütuna tıkla → o güne in
4. Kısa cevap kutusu (GEO): 3 cümlelik özet + "kaç gün kalacaksan ilk o kadar günü yap"
5. Gün bölümleri: dev "01" + tema / saat kolonu + renkli nokta + durak kartı (ad, kategori, ipucu, tutar, rezervasyon) / Plan B `<details>`
6. Gizli köşe (v2 planlarında) · Ulaşım kartı · Gitmeden bil
7. Harcama çubuğu (yemek/gezi/ulaşım/diğer)
8. Köz turuncusu CTA bandı → App Store
9. Diğer mevsim + aynı ülkeden şehirler (iç link) · SSS (görünür + FAQPage JSON-LD) · TouristTrip JSON-LD

## ✅ KARARLAR / 🚫 ELENENLER
- ✅ Ayrı kök layout: 200 sayfada 3D sahne = LCP katili + içerikle ilgisiz
- ✅ URL: `/gezi/<şehir>-yaz` ve `/gezi/<şehir>-ekim-mayis` (TR arama dili; ör. /gezi/kapadokya-yaz)
- ✅ v2 plan varsa v2, yoksa v1 (`scripts/build-gezi-data.py`) — 31 v2 / 169 v1
- 🚫 Şehir fotoğrafı: lisans + 200× asset borcu; veri görseli daha özgün
- 🚫 Lenis/WebGL: içerik sayfasında scroll kaçırmak SEO + erişilebilirlik kaybı
- ⚠️ HERO KURALI: plan sayfalarının tepesi veri başlığı (şablon). /gezi ana sayfasının pazarlama hero'su hero-section pipeline'ına bırakıldı — slot işaretli

## 🔄 TODO (max 3)
- Build + ekran görüntüsü + impeccable + kör hakem
- CEO onayı → yayın (deploy CEO onayı olmadan YOK)
- v1.1: harita (DB koordinatları), v1 planların v2'ye yükseltilmesi

## 04.10.2026 23:56 — teslim turu
- CEO: saat haritası kaldırıldı → gün kartı şeridi; plan tamamen açık; gizli AI talimatı yerine meşru GEO.
- Hakem 1: 11/20 (kök neden: CSS reset başlık marjlarını eziyordu; mobil sticky ölü; 2 CTA dili; 3 aile/5 ağırlık; varsayılan 404). Hakem 2: 16/20 GEÇER. Sonra Plan B 44px, 3 ağırlık, 404 tek ana düğme.
- Font kararı değişti: Geist Mono ÇIKTI → Gloock + Manrope (400/600/800).
- Açık: imza anı (hakem: gün kartına mini saat çubuğu), plan metni üslup turu, deploy.

## 05.10.2026 01:20 — İngilizce sürüm (/trips) + listeler EN
- Karar: TR ve EN aynı görünüm kodunu kullanır (`components/gezi/views`), metin sözlükte (`lib/gezi-i18n.tsx`). Tasarım dili aynı; EN için ayrı tasarım yok.
- Dil anahtarı: konum satırının sağında küçük hap ("English"/"Türkçe"), alt bilgide de bağlantı. Karşılığı yoksa görünmez.
- Okunurluk (impeccable): uzun etiketler (bağlantı üst satırı, konum satırı, boşluk satırı) büyük harften cümle düzenine; boşluk satırı 11→12,5px; satırlar ≤68ch. Kısa etiketler (DAYS, STOPS, kategori) büyük harf kaldı.
- EN dizini yalnız çevrilmiş şehirleri listeler; çeviri yokken H1 listelere döner. 2 plan pilotunda "2 cities, planned to the hour." (geçici).
- Ölçüm: 27 görünüm (390 açık/koyu, 1440) temiz · impeccable gerçek bulgu 0 · gezi:check 510 sayfa 0 sorun.
- Hakem: liste/mekân + EN turu başlatıldı (sonuç aşağıya).
- Hakem 1. tur 13/20 GEÇMEZ (sahte UNESCO sırası, Machu çelişkisi, TR h1 İngilizce, "REGİON", "a Istanbul", okunmayan sıra rakamı, podyum taşması). Düzeltildi: miras listesinde sıra yok + "Bu bir sıralama değil" + ItemListUnordered; 50 mirasa Türkçe ad (`HERITAGE_TR`), EN kısa ad; `scripts/liste-duzeltme.json` (eskimiş metin katmanı); EN an/a yardımcısı, TL tek biçim, İ→I; sıra rakamına perde; şerit opak.
- Hakem 2. tur 16/20 GEÇER (sınırda). Sonra: podyum 3 sütun (iç boşluk yok), iç kesim haritasında otomatik geniş ölçek + şehir adı etiketi, mobil kırıntı yolu üç noktayla. 3. tur doğrulama istendi.
- Hakem 3. tur **17/20 GEÇER** (podyum, harita etiketi, kırıntı kapandı). 18+ için isteğe bağlı: bar/restoran ilk 10'a gerçek foto ya da kapak imza öğesi, 'food' noktası turuncudan ayrılsın, liste kartı üst etiketi künyeye.
- 05.10 hakem önerisi 2+3 uygulandı: 'food' rengi #d9502a→#a3324e (koyu #d0607a), dataviz validator açık+koyu PASS; liste kartı künyesi başlığın altına, büyük harf yok. gezi:check 0 · gezi:layout temiz. Öneri 1 (88 harita kapağına gerçek foto) açık.
