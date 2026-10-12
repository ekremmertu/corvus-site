# BlokBom! + Lingoria tanıtım sayfaları — hero pipeline sözleşmeleri

> 12.10.2026 — Lumière + hero-section pipeline. Yapı: TripWalkers tanıtım sayfası (public/tripwalkers-site) — bağımsız statik sayfa, kendi menüsü, GSAP + ScrollTrigger + Lenis, TR/EN.
> Ortalamaya kayma freni: son 5 satırda Manrope / Instrument Serif / SF Pro var → ikisi de kullanılmadı.

## STRATEGY BRIEF
CEO onayladı (12.10.2026). Sohbetteki iki blok: BlokBom = 3–5 dk molası olan iPhone kullanıcısı, derdi reklam/internet/üyelik; fark = internetsiz + üyeliksiz + seçmeli reklam (max 2) + 4 mod + günlük bulmaca. Lingoria = okulda yıllarca İngilizce görüp konuşamayan Türk; fark = Türkçe ipucu veren AI sesli sohbet (12 senaryo) + 100+ deyim + seviye sınavları. Sosyal kanıt yok (2 ve 6 oy) → güven ürünü sayfada çalıştırarak.

## HERO COPY
BlokBom — H1 TR "Bloklar düşüyor. *Sıra sende.*" EN "The blocks are falling. *Your move.*" · alt TR "Parçayı 8×8 tahtaya sürükle, satırı doldur, patlat. Dört mod var, internetsiz ve üyeliksiz oynanır." · CTA "App Store'dan indir" · ikinci "Modları gör ↓" · güven "Ücretsiz · iPhone ve iPad · 6 dil".
Lingoria — H1 TR "Anlıyorsun. *Şimdi konuş.*" EN "You understand it. *Now speak it.*" · alt TR "Takıldığında Türkçe ipucu veren yapay zekâ ile sesli sohbet et. Restoranda, mülakatta, havalimanında — A1'den C2'ye." · CTA "7 gün ücretsiz dene" · ikinci "Deyim yakala ↓" · güven "Türkçe konuşanlar için · 6 seviye, 60 bölüm · 100+ deyim".

## UI SPEC

### Ortak (TripWalkers iskeleti)
- Düzen: **ortalı** (kısa iki satırlık H1 + tek alt cümle; hubX/Corvus dili). Hero = tam ekran sahne (100svh, min 640px); hareket katmanı başlığın ARKASINDA, `aria-hidden`, başlık her zaman okunur.
- Menü: TripWalkers'taki hap menü birebir (geri 44×44 → /tr/work · ikon + ad · 3 bağlantı · ana düğme). <760px bağlantılar gizli.
- Ölçek: H1 `clamp(3rem, 8.4vw, 7.6rem)` / lh 0.95 / tracking -0.04em; mobil 390px'te 3rem (48px). Alt başlık `clamp(1.05rem,1.35vw,1.25rem)` lh 1.6, max 56ch. Düğme 16px/700, yükseklik 52px (mobil tam genişlik değil, ortalı ikili; <420px alt alta tam genişlik).
- Boşluk: gutter `clamp(16px,4vw,56px)`, bölüm dikey 120px (mobil 80px), içerik max 1200px.
- Odak halkası: 2px vurgu rengi, offset 3px. Dokunma hedefleri ≥44px. Tek H1.
- <768px: başlık → alt → düğmeler → güven satırı → sahne (hareket katmanı başlığın arkasında kalır ama yoğunluğu %50).

### BlokBom! — "Gece oyun salonu"
- Font: **Bricolage Grotesque** 800 (display, oyuncaklı geniş) / **Figtree** 500·700 (gövde). İkinci satır vurgusu = aynı aile 800 + sarı renk (serif yok).
- Palet: zemin `#0E0A1F` · yüzey `#18122F` · yazı `#F6F2FF` · ikincil `#B9AED6` · ana vurgu sarı `#FFD23F` (CTA zemini, "Sıra sende") · blok renkleri (oyundaki gibi) `#A78BFA #F472B6 #38BDF8 #34D399 #FB923C #FFD23F`.
- Kontrast: başlık 17.6:1 · ikincil 9.3:1 · CTA yazısı (#0E0A1F / #FFD23F) 13.4:1 · mor vurgu 7.1:1. Hepsi AA.
- CTA: ana = sarı dolu hap + Apple ikonu; hover yukarı 2px + sarı gölge; focus 2px sarı halka. İkinci = hayalet metin.
- Sahne yuvası: hero arka planı tam genişlik kanvas (düşen bloklar) + altta ortada gerçek telefon (oyun ekranı, 9:19.5), alt kenardan taşar.

### Lingoria — "Sıcak sınıf"
- Font: **Fraunces** 600 + italik 500 (display — deyimler de bununla) / **Onest** 400·600 (gövde).
- Palet (AÇIK tema): zemin `#FBF1E6` · yüzey `#F4DFC8` · yazı `#1C130D` · ikincil `#6B5A4C` · vurgu kil turuncusu `#B4410C` (CTA zemini + "Şimdi konuş") · deyim kartı mürekkebi `#1C130D` üstüne krem.
- Kontrast: başlık 16.4:1 · ikincil 5.9:1 · vurgu yazı 5.1:1 · CTA (#FFF / #B4410C) 5.7:1. Hepsi AA.
- CTA: ana = kil turuncusu dolu hap; hover koyulaşır `#9A3709`; focus 2px mürekkep halka. İkinci = hayalet.
- Sahne yuvası: hero arka planı tam genişlik deyim yağmuru (DOM kartları, fizik) + altta gerçek telefon (AI sohbet ekranı).

## VISUAL DIRECTION

### BlokBom! — "Blok yağmuru"
1. Arka plan: `#0E0A1F` düz + altta mor ışık havuzu `radial-gradient(50% 55% at 50% 70%, rgba(139,92,246,.40), transparent 70%)`. Başlık alanında kanvas opaklığı %35'e iner (maske: `radial-gradient(ellipse 46% 34% at 50% 34%, transparent, #000)`) → başlık kontrastı korunur.
2. Ana görsel: tam genişlik **kanvas tahta** — 8×8 oyunun parçaları (I, L, J, O, T, S, kare 2×2, tek) oyunun 6 renginde, yukarıdan düşer, sütunlara yığılır; bir satır dolunca beyaz parlar + 14 parçacık patlar + sağ üstte skor artar. Ziyaretçi kanvasa dokunursa o sütuna parça bırakır (oyunun hissi). Altta ortada gerçek telefon (classic.webp), kenardan taşar.
3. Hareket: düşüş 60fps rAF, yerçekimi hızlanması; satır patlaması 420ms. Sekme görünmezken durur. `prefers-reduced-motion`: hareketsiz yarım dolu tahta (statik çizim), patlama yok.
4. İkon: dolu, 2px köşe yuvarlak kare bloklar (oyunun parçası gibi) — ikon yerine mini blok.
5. Işık: alttan mor, bloklarda üstten parlak kenar (iç gölge 1px beyaz %35) — oyundaki "şeker" blok dokusu.
6. Anahtar sözcükler: arcade glow, candy blocks, night purple, playful grotesk, satisfying blast, tetris rain.
7. Üretim istemi: YOK — tüm görsel kod (kanvas) + gerçek App Store ekranları. Ücretli üretim yapılmadı.

### Lingoria — "Deyim yağmuru"
1. Arka plan: krem `#FBF1E6` + üstte şeftali ışığı `radial-gradient(60% 50% at 50% 0%, #F7D2B0, transparent 70%)`. Kartlar başlığın ARKASINDA değil, başlığın altındaki alanda birikir (yazı üstüne düşmez) → kontrast sabit.
2. Ana görsel: **düşen deyim kartları** — Fraunces italik, mürekkep `#1C130D` zemin + krem yazı (bir kısmı kil turuncusu). Yukarıdan döne döne düşer, zemine çarpıp yığılır. Ziyaretçi bir kartı tutup fırlatabilir; bırakınca kart döner ve Türkçe anlamı görünür ("break the ice" → "buzları kırmak, ortamı yumuşatmak"). Uygulamadaki deyim eşleştirme oyununun web hâli. Altta gerçek telefon (chat.webp).
3. Hareket: basit 2B fizik (yerçekimi, zemin/duvar sekmesi, sürtünme), 60fps rAF, en çok 18 kart. Fırlatma = işaretçi hızı. `prefers-reduced-motion`: kartlar yerde hazır yığın, dokununca anlam döner (fizik yok).
4. İkon: ince çizgi 1.75px, yuvarlak uç — Onest ile uyumlu.
5. Işık: yukarıdan sıcak gün ışığı, düşük doygunluk; tek doygun renk kil turuncusu.
6. Anahtar sözcükler: warm classroom, editorial serif, flashcards, tactile throw, peach daylight.
7. Üretim istemi: YOK — kod + gerçek ekranlar.
