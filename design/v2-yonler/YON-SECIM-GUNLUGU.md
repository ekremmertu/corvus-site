# 🎬 CINEMATIC LOG — corvus-tech.co yeniden tasarım (v2)

> Son çalışma: 09.10.2026 10:42

🎯 Site: Corvus Tech ürün stüdyosu sitesi — "oyuncak" görünümden premium Studio App & SaaS havasına
🛤️ Giriş yolu: B (CEO referans vermedi) — referansları Lumière buldu
🎯 Conversion hedefi: "Proje başlat" (e-posta/görüşme)

## Teşhis (canlı site, 09.10.2026 10:42, 1440px tam sayfa ekran görüntüsü)
1. Açılış terminal şakası "error: PORTFOLIO NOT LOADED" → ilk saniyede "hata" okunuyor
2. 3D sahnede ilkel kutu objeler (telefon/pencere/mum) → Lego hissi
3. Sabitlenmiş 3D bölümde ~2.700 px boş siyah alan
4. 5 neon disiplin rengi → gökkuşağı
5. 12+ bulanık "YAKINDA" kartı
6. Kartlarda gerçek ekran görüntüsü yok (public/apps'te yalnız 3 jpg) · e-posta @outlook.com

## Referans sökümü (Playwright, doğrulandı)
- linear.app → bg #08090A, Inter Variable 510, 64px, ls -1.4px, ürün ekranı başrolde
- metalab.com → PP Eiko 240, 88px, ls -1.76px, Basis Grotesque gövde, siyah/beyaz
- basement.studio → Geist 600, 87px, ls -3.48px, 3 canvas (WebGL)

## Sunulan yönler (CEO henüz seçmedi — netleştirmek istedi)
- A Ürün Vitrini (öneri): grafit #0B0C0E · Geist/Geist Mono · imza: sürüm defteri
- B Galeri Stüdyo: taş #ECEAE4 · Cormorant 300/Satoshi · tam ekran vaka kapağı
- C Kontrol Odası: #090B0D · Funnel Display/Commit Mono · canlı durum ışıkları

## ❓ Açık sorular
- Yön seçimi · vitrinde kaç proje (öneri 6–8) · hero pipeline: prototipte hero yalnız yön taslağı, nihai hero 5 aşamalı pipeline'dan

## 09.10.2026 10:46 — 3 yön görsel maket olarak çizildi
- CEO: "görselleri görmeden ok diyemem" → 3 statik HTML maket, gerçek ekranlarla (TripWalkers, Quill, CVtoapply panel)
- Dosyalar: design/yonler/a.html · b.html · c.html (+ yon-a/b/c.png tam sayfa)
- Kendi kontrolümde düzeltilen: A alt yazı ekrana biniyordu · B Quill görseli metni örtüyordu · C başlık arka plan bandı Ç/ş çengelini örtüyordu (Funnel Display → Host Grotesk)
- Disiplin sayıları projects.ts'den: iOS 13 · web 6 · AI 8 · fintech 8 · enterprise 5
- Bekleyen: CEO yön seçimi

## 09.10.2026 10:46 — 3 yön görsel maket olarak çizildi
- CEO: "görselleri görmeden ok diyemem" → 3 statik HTML maket, gerçek ekranlarla (TripWalkers, Quill, CVtoapply panel)
- Dosyalar: design/yonler/a.html · b.html · c.html (+ yon-a/b/c.png tam sayfa)
- Kendi kontrolümde düzeltilen: A alt yazı ekrana biniyordu · B Quill görseli metni örtüyordu · C başlık arka plan bandı Ç/ş çengelini örtüyordu (Funnel Display → Host Grotesk)
- Disiplin sayıları projects.ts'den: iOS 13 · web 6 · AI 8 · fintech 8 · enterprise 5
- Bekleyen: CEO yön seçimi
- 09.10.2026 10:49 CEO: A beğenilmedi. B ve C'yi göremedi (Önizleme tek pencerede açmıştı) → ayrı ayrı açıldı.
- 09.10.2026 10:50 CEO: A, B, C'nin üçü de 'güzel değil'. Referans verdi: hubX (TR). → YOL A (referanslı).

## 09.10.2026 10:53 — hubX sökümü + D yönü (hubX dili, Corvus'a uyarlanmış)
- hubx.co DNA: Helvetica Now Display 700, her şey ortalı, h1 48px · siyah/#FAFAFA bölüm ritmi · vurgu #FC576E geçişli, 1-2 kelimede · GSAP/WebGL/Lenis YOK · premium hissi = fotogerçekçi 3D render + elde telefon + gerçek ekip fotoğrafı
- D maketi: Inter Tight 700 (Helvetica Now ücretli) · siyah/#F5F5F7 ritmi · "kuzgun tüyü" yanardöner vurgu (#7C8CFF→#B48CFF→#5FE3D0) · dev CORVUS harfleri arkasında 3 gerçekçi iPhone (gerçek ekran) · uygulama ikonu yörüngesi · 3 hizmet kartı · zigzag süreç · yayındaki işler kartları · teknoloji şeridi
- Dosya: design/yonler/d.html + yon-d-hubx.png · referans: referans-hubx.png
- Düzeltilen: .pill.w ↔ .w kap sınıfı çakışması (düğme tam genişliğe uzuyordu)
- Açık: hubX seviyesi için 3D render/fotoğraf gerekir → ücretli üretim (Higgsfield) ancak CEO onayıyla
- 09.10.2026 10:56 CEO: D (hubX dili) 'şimdi güzel oldu' → ONAY. İstek: daha kaliteli, çok lüks stüdyo sitesine çevir.

## 09.10.2026 10:59 — E: lüks sürüm (D'nin üstüne)
- Ham uygulama ekranları bulundu (telefon-içinde-telefon tanıtım kartları yerine): TripWalkers v6-vitrin/shots/tr, SplitTable kanit-2026-09-*, Almagest proof_pack 23_yer_secildi, Amelie intro-2.0 + 29_empty, BeAnyone sprint4-paywall → design/yonler/img/
- Lüks katmanları: cam nav hapı · 96px başlık + Instrument Serif italik 'stüdyo.' (kuzgun tüyü geçişi) · spot ışık + yansımalı 3 telefon · film greni (SVG noise %7) · ürün adı şeridi · manifesto (koyu gri + beyaz vurgu) + 34/8/5/1 rakamları · 6 telefonlu film şeridi · açık zeminde 3 hizmet kartı (cam küreler) · TripWalkers tam genişlik vaka + Amelie/SplitTable ikilisi · i–iv süreç · dev kapanış
- Font kaydı: Inter Tight 600 / Instrument Serif italik (vurgu) / Inter (gövde) — Inter CEO referansı (hubX) gereği
- Düzeltilen: hizmet kartı alt boşluğu (520→440px) · süreç→kapanış boşluğu
- Dosya: design/yonler/e.html + yon-e-luks.png · kör hakem çalışıyor
- Not: Almagest projects.ts'de yok (sitede yeni kayıt gerekecek) · hello@corvus-tech.co MX doğrulanmadı

## 09.10.2026 11:04 — Kör hakem: E = 6/20 GEÇMEZ
- En zayıf halka: hero "Projeni anlat" orta telefonun ALTINDA (elementFromPoint → IMG). Benim kontrolümde kaçtı.
- Diğer: mor→mavi gradyan + 3 blob (yasak listesi) · rakamlar projects.ts ile çelişiyor (41 kayıt / 4 live; sayfa 34/8 canlı siteden) · 5 disiplin vs 3 alan · tekrar eden 3 ekran · kontrast (manifesto 1,85:1, tech/footer 2,3:1) · alt metin 0/13 · viewport yok, mobil taşma · şerit sağdan kesik · 3 aile/4 ağırlık · hover/focus yok
- Hakem dosyaları: scratchpad/hakem/
## 09.10.2026 11:04 — CEO: yayındaki logo + animasyonları E'ye entegre et
- BULGU: canlı sitedeki açılış (intro) kodu yerel repoda YOK → yerel repo canlıdan geride. Canlı JS chunk 2knstzgmj2w48.js: daktilo terminal metni ("error: PORTFOLIO NOT LOADED"…) → 35 satır ASCII kuzgun başı 620 ms'de yukarıdan aşağı çizilir + "CORVUS." → çıkış. Oturumda 1 kez, ?intro=1 zorlar, reduced-motion'da yok, ESC/Enter/tık geçer.
- Diğer canlı efektler (repo): Scramble (harf çözme), CountUp, CustomCursor (renkli nokta+halka, magnetik), SweepFx (disiplin renk dalgası), Marquee, TerminalEgg ("corvus" yaz → mini terminal), 3D sahne + 5 disiplin videosu (neon tel kafes, 4 sn)

## 09.10.2026 11:08 — E2: yayındaki logo + animasyonlar entegre (çalışan HTML)
- Intro: terminal "error" metni ATILDI. Yayındaki 35 satır ASCII kuzgun korundu → karışık karakterlerden çözülerek satır satır iner (~0,64 sn) → kuzgun tüyü ışıltısı geçer → CORVUS harfleri tek tek → kuzgun nav logosuna küçülerek uçar (FLIP) → hero kademeli açılır. Toplam ~2,8 sn. Oturumda 1 kez, ?intro=1 zorlar, tık/ESC/Enter geçer, reduced-motion'da yok.
- Logo: yayındaki kanat SVG korundu, mavi → beyaz. CustomCursor → tek renk (difference) + telefon/vaka üstünde 'GÖR'. CountUp → manifesto rakamları. Marquee → ürün adı şeridi (üstüne gelince durur). TerminalEgg → 'corvus' yaz ya da footer >_ (sade renk). Scroll reveal. Hero telefonlarına fareyle hafif derinlik.
- ATILAN: SweepFx (gökkuşağı dalga), 3D primitif sahne, 5 neon disiplin videosu, açılış terminal metni.
- Hakem düzeltmeleri (nesnel): hero CTA artık tıklanıyor (elementFromPoint=A ✓) · viewport + mobil düzen (390'da scrollWidth 390 ✓, masaüstü 1440 ✓) · 13 görsele alt metin · h4→h3 · Inter atıldı (2 aile + mono yalnız intro), 3 ağırlık · manifesto gri #636366, tech/footer #8E8E93 · film şeridi yatay kaydırılır · tekrar eden ekranlar değişti (tw-day, cv-mob, ba-grid) · '5 disiplin'→'3 uzmanlık alanı' · TripWalkers v1.2.5 (projects.ts) · hover/focus hâlleri · nav CTA 44px
- AÇIK (CEO kararı): mor→mavi gradyan + 3 küre (hakem: yasak listesi; CEO 'çok iyi' dedi) · 34/8 rakamı canlı siteden, projects.ts 41 kayıt/4 live → hangisi doğru?
- Dosyalar: design/yonler/e2.html (+raven.js) · e2-intro-storyboard.png · yon-e2-tam.png · yon-e2-mobil.png · e2-imlec.png
