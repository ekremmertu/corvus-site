# corvus-site — Yol Haritası + PASS LOG

## Sonraki Oturum İçin
**Aktif durum:** **CANLI YAYINDA — https://corvus-tech.co**. Son commit `2744c62`, **28 proje** (67 sayfa). 2026-08-23'te beş tur çıkıldı: marka sürümü (`28477be`) → ürün linkleri (`e9b5941`) → favicon+intro düzeltmesi (`f504cff`). Build yeşil (**69 sayfa** — icon route'ları eklendi), 0 TS hatası. Önce `.claude-state.md` oku.

| # | Görev | Kim | Not |
|---|-------|-----|-----|
| 1 | ~~Domain kararı~~ ✅ DONE — `corvus-tech.co` kesinleşti | — | 2026-07-29 |
| 2 | ~~Vercel deploy~~ ✅ DONE — corvus-site-omega.vercel.app canlı, domainler eklendi | — | 2026-07-29 |
| 2c | ~~DNS: GoDaddy A kaydı + www CNAME~~ ✅ DONE | CEO yaptı | 2026-07-30, aşağıda PASS LOG |
| 2d | ~~SSL sertifikası~~ ✅ DONE — elle tetiklendi | — | 2026-07-30, `vercel certs issue` |
| 7 | **Cloud Run'a `CORVUS_API_KEY` env var ekle + redeploy** | **CEO** | ⚠️ ZORUNLU: env var olmadan servis artık BAŞLAMAZ (fail-safe). Komut aşağıda. |
| 7b | Terminal `.env`'ine `VITE_CORVUS_API_KEY` ekle | CEO | Sadece local Terminal Cloud API'ye bağlanacaksa. Local API (`localhost:8765`) anahtar istemiyor. |
| 8 | Portfolyoya CSP ekle (ayrı tur) | Claude solo | R3F/Next inline script + Higgsfield video kaynakları test gerektiriyor |
| 2b | ~~/terminal entegrasyonu~~ ✅ DONE | — | Terminal `ac4772f` + site `683e6de`, Firebase canlı |
| 3 | ~~v1 site kur~~ ✅ DONE | — | 2026-07-29, commit `d4c85d6` |
| 3b | ~~Perf turu 1: site ağır (CEO şikâyeti)~~ ✅ DONE | — | 2026-07-30, blur/grain/dpr/canvas-unmount; aşağıda PASS LOG |
| 3c | Perf turu 2 (gerekirse): CEO hâlâ ağır derse — damp hızlandır, obje polygon azalt, `frameloop` scroll-durdurma | Claude solo | CEO'nun cihaz+tarayıcı bilgisiyle |
| 4 | v1.1: gerçek ekran görüntüleri (proje detay) | Claude solo | Quill/marketing, TripWalkers/fastlane, Amelie.co/Logo |
| 5 | ~~Higgsfield disiplin videoları~~ ✅ DONE | — | 2026-07-30, 30 kredi, 5× kling3_0_turbo, `f007d92` |
| 5b | ~~Afilli paket (4 katman)~~ ✅ DONE | — | cursor+magnetic, tilt+glare, count-up, scramble, sweep, ViewTransition, terminal egg — `7cf289d` |
| 6 | GitHub push | CEO kararı | Şu an lokal git |
| 9 | **Logo mavisi ile iOS disiplin rengi çakışması** — ikisi de `#5B8CFF` | CEO kararı | Logo brand mavisinde kalsın, `--c-ios` hafif kaydırılsın (öneri `#7BA5FF`). Ya da tam tersi. Tek satır CSS. |
| 10 | ~~Marka filmi + intro'yu commit et~~ ✅ DONE | — | 2026-08-23, commit `28477be` + prod deploy |
| 13 | **LinkedIn linkini siteye ekle** | Claude solo (URL CEO'dan) | `site.ts`'e `linkedin` alanı + `Footer.tsx` link. CEO 2026-08-23'te şirket sayfası açtı. |
| 14 | `hello@corvus-tech.co` posta kutusu kur | CEO | Şu an sitede kişisel Gmail görünüyor (`site.ts`). LinkedIn'de kurumsal görünüm için gerekli. |
| 11 | Brand film bölümünün görsel doğrulaması | Claude solo | Yerleşim sayısal doğrulandı, ekran görüntüsü alınamadı — CEO tarayıcıda bakıp onaylasın |
| 15 | **Lingoria + BlokBom! portfolyoya eklensin mi?** | CEO kararı | İkisi de App Store'da yayında ama sitede yok. Eklenecekse metin (summary/description/highlights EN+TR) gerekiyor. |
| 16 | **Ameliea iOS uygulamasının linki** | CEO | CEO "app de var" dedi ama App Store'da bulunamadı (TR+US arama, geliştirici hesabı listesi — üçünde de yok). Farklı hesapta olabilir; link CEO'dan gelecek. |
| 17 | Proje adı `Amelie.co` → `Ameliea` düzeltilsin mi? | CEO kararı | Gerçek marka ve alan adı `ameliea.co`. |
| 12 | 9:16 / 1:1 sosyal videoları LinkedIn/X'e yükle | CEO | `brand-src/corvus-intro-9x16.mp4`, `corvus-intro-1x1.mp4` hazır. LinkedIn giriş gönderisiyle birlikte kullanılacak. |

**Yapma kuralları:**
- İçerik değişikliği SADECE `src/data/projects.ts` — başka dosyaya kopya metin yazma
- **Nestlé adı asla siteye girmez** → "Global bir FMCG şirketi"
- 3D değişikliklerinde mobil fallback'i kır(ma)dığını Playwright ile doğrula

## PASS LOG

### 2026-08-23 (5. tur) — Gerçek App Store linkleri, splittable.me, bir proje silindi + DİSK TEMİZLİĞİ

**⚠️ EN ÖNEMLİ BULGU — mağaza linkini İSİMLE ARAYARAK bulma.** Doğru yöntem: TripWalkers'ın `artistId`'sini çek, sonra o geliştiricinin tüm uygulamalarını listele:
```
curl -s "https://itunes.apple.com/lookup?id=6764424121&country=tr"          # -> artistId 1873744126
curl -s "https://itunes.apple.com/lookup?id=1873744126&entity=software&country=tr"
```
**Geliştirici hesabı: `Arzu UGUR` (artistId 1873744126) — 5 uygulama yayında:**
| Uygulama | trackId | Portfolyoda? |
|---|---|---|
| Quill: Brüt Net Maaş, Bütçe | 6768395513 | ✅ eklendi |
| CVtoapply: ATS Resume Score | 6790497658 | ✅ eklendi |
| TripWalkers | 6764424121 | ✅ zaten vardı |
| **Lingoria: Learn English Fast** | 6769572261 | ❌ **portfolyoda HİÇ YOK** |
| **BlokBom!** | 6787959211 | ❌ **portfolyoda HİÇ YOK** |

**Değişiklikler**
1. **Quill artık `live`** — TestFlight değil. `appStoreUrl` eklendi, `status` `testflight`→`live`, stack'te `TestFlight`→`StoreKit 2`, açıklamalardaki "build 16 TestFlight" cümleleri ve `Status: TestFlight` metriği güncellendi (yayında olan bir üründe "TestFlight'ta" yazması yalan olurdu).
2. **CVtoapply'a `appStoreUrl`** — web projesiydi, iOS uygulaması da yayında. Artık sayfada hem site hem App Store butonu var.
3. **SplitTable sitesi `splittable.me`** (CEO düzeltmesi). Önceki tur `.co` konmuştu — o GoDaddy park sayfasıydı. `.me` gerçek: "SplitTable — Hesap için beklemek yok". ⚠️ Park sayfası sorunu böylece kapandı.
4. **Ameliea sitesi `ameliea.co`.** ⚠️ **`amelie.co` BAŞKASININ** — "Welcome to your new website" placeholder'ı. Veri dosyasındaki proje adı hâlâ `Amelie.co`, gerçek marka `Ameliea` — **isim düzeltmesi CEO onayı bekliyor**.
5. **Distributor Revision Report SİLİNDİ** (CEO isteği). 29 → **28 proje**.
   - ⚠️ Sayı iki yerde ELLE yazılıydı, ikisi de 28 yapıldı: `Intro.tsx:21,33` (": 28 products / 1 screen") ve `TerminalEgg.tsx:87` ("all 28 projects"). Ana sayfa istatistiği `projects.length`'ten geldiği için kendiliğinden düzeldi.
   - Sayfa sayısı 69 → 67 (silinen projenin 2 locale'i).

**Doğrulama (canlı):** `/tr/work/quill` id6768395513 ✓ · `/tr/work/cvtoapply` id6790497658 ✓ · `/tr/work/splittable` splittable.me ✓ · `/tr/work/amelie-co` ameliea.co ✓ · `/tr/work/distributor-revision-report` **404** ✓ · sitemap'te distributor yok ✓

**DİSK TEMİZLİĞİ (CEO onayı: "silinmesi problem olmayacakların hepsini sil")**
- **3,9 GB → 22 GB boş** (18 GB geri alındı).
- Silinenler (hepsi kendini yeniden üretir): Xcode DerivedData 7,6G · iOS DeviceSupport 5,5G · npm `_cacache` 2,5G · SwiftPM/pip/Homebrew/deno/python önbellekleri · Brave/Spotify/Google/TradingView önbellekleri.
- **Silinmedi, CEO kararı bekliyor:** `CoreSimulator/Devices` **26 GB** (26 simulator — silinirse içlerindeki kurulu build'ler ve test verisi gider, Xcode yenilerini kurar) · iOS 26.0.1 runtime imajı **8 GB** (sadece 26.2 kullanılıyorsa gereksiz, yeniden indirilebilir).
- `xcrun simctl delete unavailable` → silinecek bir şey yoktu.
- ⚠️ Xcode **Archives** klasörüne DOKUNULMADI — imzalama/dSYM için lazım, önbellek değil.

**Commit:** `2744c62` · deploy `corvus-site-dcjy4y1fq`


### 2026-08-23 (4. tur) — Intro her yenilemede oynuyor + DİSK DOLDU

**1. CEO kararı değişti:** "refresh yapınca intro oynasın". 3. turdaki oturum-başına-bir-kez kilidi tamamen kaldırıldı.
- Silinenler: `Intro.tsx` içindeki `sessionStorage.cv_intro` okuma/yazma · `layout.tsx`'teki inline `<head>` script'i (artık `<head>` bloğu hiç yok, metadata yeterli) · `globals.css`'teki `html[data-intro-seen="1"] .intro { display:none }` kuralı.
- Kalan tek istisna: `prefers-reduced-motion: reduce`. `?intro=1` onu da geçersiz kılar.
- Atlama yolları duruyor: Skip butonu / ESC / Enter / Space / tıklama.
- Doğrulama: canlı HTML'de `cv_intro` geçmiyor (0 eşleşme), sayfa 200, intro markup'ı yerinde. Commit `c4680c8`, deploy `corvus-site-l2tt0dfj0`.

**2. ⚠️ MAKİNE DİSKİ %100 DOLDU — iş yarıda kesildi.** `git commit` sırasında `ENOSPC: no space left on device`. Commit aslında geçmişti, hata log dosyası yazılırken çıktı.
- Durum: 460 GB'ın 409 GB'ı dolu, **384 MB boş**.
- `.next` silinerek 4 GB'a çıkarıldı, iş tamamlandı — ama kalıcı çözüm değil.
- Ölçülen büyükler: `~/Library/Developer/CoreSimulator` **26 GB** · `Xcode/DerivedData` **7,6 GB** · `iOS DeviceSupport` **5,5 GB** · `Library/Caches` **5,4 GB** · `.npm` **2,5 GB** → toplam ~47 GB geri alınabilir.
- **Sonraki oturum bunu ilk iş sorsun** — disk dolu haldeyken build/deploy güvenilmez, `.next` yarıda kalıp `ENOTEMPTY` veriyor.


### 2026-08-23 (3. tur) — Favicon Vercel üçgeniydi + intro tekrar oynatma

**CEO şikâyeti:** "tarayıcı sekmesinde logomuz değil Vercel'in üçgeni var" + "refresh yapıyorum animasyon oynamıyor"

**1. Favicon — GERÇEK BUG.** `src/app/favicon.ico` hâlâ create-next-app'ın bıraktığı dosyaydı (25.931 bayt, 29 Tem tarihli). Marka turunda logo her yere konmuş ama **sekme ikonu atlanmıştı**.
- Çözüm: `public/brand/corvus-mark.png`'den üretildi → `favicon.ico` (16/32/48/64/128/256) + `icon.png` (512) + `apple-icon.png` (180), Next dosya konvansiyonu.
- ⚠️ **Ders 1 — küçültme sırası:** şeffaf RGBA'yı doğrudan küçültmek kenarda hale ve 16px'te **yeşil piksel artefaktı** üretti. Doğrusu: önce 1024'te `--c-bg` (#05060a) zemine düzleştir, **sonra** küçült.
- ⚠️ **Ders 2 — MaxFilter işe yaramaz:** 16px'te ince konturu kalınlaştırmak için alfaya `ImageFilter.MaxFilter(3)` denendi → şekil lapaya döndü + renk taşması. Geri alındı.
- ⚠️ **Ders 3 — ICO RGBA olmalı:** RGB kaydedilince Turbopack build patlıyor: `Format error decoding Ico: The PNG is not in RGBA format!`. Frame'ler `.convert('RGBA')` ile kaydedilecek.
- Dolgu farklı: ≤64px'te %8 (kuş büyük görünsün), büyük boylarda %16.
- Görsel doğrulama: 32px'te kuzgun net okunuyor, 16px yumuşak ama artefaktsız (Retina zaten 32'yi kullanıyor).

**⚠️ BU KARAR 4. TURDA GERİ ALINDI — aşağıdaki oturum kilidi artık YOK (commit `c4680c8`). Açılış her yüklemede oynuyor.**

**2. Intro "oynamıyor" — BUG DEĞİL, tasarım.** `sessionStorage.cv_intro` sekme oturumunda bir kez oynatıyor; F5 aynı oturum olduğu için oynamıyor. Ziyaretçiyi yormamak için bilinçli karardı.
- Eklendi: **`?intro=1`** → hem `cv_intro` kaydını hem `prefers-reduced-motion`'ı geçersiz kılar. Açık istek varsayılanı yener.
- `layout.tsx`'teki inline `<head>` script'i de aynı parametreyi tanımalı, yoksa CSS overlay'i gizliyor (`html[data-intro-seen="1"]`).
- Test adresi: `https://corvus-tech.co/tr?intro=1`
- ⚠️ Hiç oynamıyorsa 2. şüpheli: macOS → Erişilebilirlik → **Hareketi Azalt** açık.

**3. Temizlik:** kullanılmayan create-next-app artıkları silindi (`next.svg`, `vercel.svg`, `file/globe/window.svg`) — kodda referansları yoktu, grep ile teyit edildi. `vercel.svg` artık 404.

**Doğrulama (canlı):** favicon.ico 200, 6 boyut da içinde ✓ · `<link rel=icon>` + `icon.png` + `apple-touch-icon` HTML'de ✓ · `?intro=1` çalışıyor ✓ · vercel.svg 404 ✓

**Commit:** `f504cff` · deploy `corvus-site-8fge9zxtb`


### 2026-08-23 (2. tur) — Ürün linkleri + "App Store'da yakında" rozeti

**Ne yapıldı**

1. **`appStoreSoon?: boolean` alanı eklendi** (`projects.ts`). Mağaza linki henüz yokken, buton görünümlü ama **pasif** bir rozet basar: `.btn-soon` (kesikli kenarlık) + `.soon-dot` (`--c-live` renginde nokta, disiplin rengiyle değişir). Kural: `appStoreUrl` dolduğu an bu alan silinir, ikisi birlikte kullanılmaz (`page.tsx`'te `&& !project.appStoreUrl` guard'ı var).
   - Sözlük: `work.appStoreSoon` → "Coming soon to the App Store" / "App Store'da yakında"

2. **CVtoapply → `liveUrl: https://cvtoapply.co`**. ⚠️ **`.com` DEĞİL** — `cvtoapply.com` boş park sayfası, ürün `.co` üzerinde ("CV'ni tahmine bırakma, ölç"). curl ile title karşılaştırılarak ayırt edildi.

3. **SplitTable → `liveUrl: https://splittable.co` + `appStoreSoon: true`.**
   - ⚠️ **Bilinçli kabul edilmiş sorun:** `splittable.co` şu an **GoDaddy park/reklam sayfası** servis ediyor (`ap:"parking"`, NS ns73/ns74.domaincontrol.com). "Canlı siteyi gör" butonu ziyaretçiyi oraya götürüyor. CEO'ya 3 seçenek sunuldu (linki koyma / park sayfasıyla koy / önce siteyi kur), **CEO "linki koy" dedi**. Site kurulunca sorun kendiliğinden kapanır.
   - ⚠️ **App Store tuzağı:** iTunes search'te "Splittable: AI Bill Split Scan" (id 6747049315, geliştirici **George King**) çıkıyor — **bizim uygulamamız DEĞİL**. Bu linki koymak ziyaretçiyi rakibe göndermek olurdu. `appStoreUrl` bilerek boş bırakıldı, rozet kullanıldı. Kendi uygulamamız yayınlanınca gerçek link CEO'dan alınacak.

4. **Doğrulama:** build 67 sayfa 0 hata → prod deploy (`corvus-site-nu3kaifk9`, 36 sn) → curl ile canlı teyit: `/tr/work/splittable` rozet+link ✓ · `/tr/work/cvtoapply` `.co` linki ✓ · `/en/work/splittable` İngilizce rozet ✓ · rozet SADECE splittable'da (`btn-soon` diğer sayfalarda 0) ✓

**Öğrenilen ders (build):** `.next` klasörü Finder'ın oluşturduğu `.DS_Store` yüzünden silinemeyip `ENOTEMPTY` verdi. Çözüm: `rm -f .next/.DS_Store && rmdir .next`.

**Commit:** `e9b5941`


### 2026-08-23 — Marka sürümü canlıya alındı + LinkedIn açılış metinleri

**Ne yapıldı**

1. **2026-07-30 marka turu commit edildi ve prod'a çıkıldı.** 5 hafta boyunca sadece lokalde duran marka çalışması (mavi logo, `fx/Intro.tsx` terminal açılışı, `fx/corvusAscii.ts`, `BrandFilm.tsx`, `public/brand/`, `public/videos/corvus-intro.*`) tek committe toplandı → `28477be`, 30 dosya.
   - `npm run build` → ✅ 67 sayfa, 0 TS hatası, derleme 10.9 sn.
   - `npx vercel --prod --yes` → `corvus-site-roji5dq4z-...vercel.app`, 48 sn, `corvus-tech.co`'ya alias'landı.
   - **Canlı doğrulama (curl):** `/tr` 200 (101 KB) · `/brand/corvus-mark.png` 200 (33 KB) · `/videos/corvus-intro.webm` 200 (2.44 MB) · `/en/work/tripwalkers` 200 (42 KB) · HTML'de `brand-mark`/`data-intro-seen` bulundu.
   - **Ağır medya bundle'a girmedi:** `.gitignore` içindeki `brand-src/*.mp4|*.png|ascii_frames/` kuralı sayesinde 51 MB ham medyadan sadece `brand-src/build_intro.py` commitlendi. `git add -A -n` ile teyit edildi.
   - Bu commit ayrıca güvenlik turunun kalıntılarını da taşıdı: Footer'dan `/terminal` linki, `proxy.ts` muafiyeti ve `next.config.ts` rewrite'ları silinmiş hâlde prod'a gitti.

2. **`projects.ts`'e `appStoreUrl` / `liveUrl` alanları canlıya çıktı.** TripWalkers App Store linki (`id6764424121`, iTunes lookup ile teyitli) artık yayında.

3. **LinkedIn şirket sayfası açıldı (CEO).** Bu oturumda yazılan metinler — **henüz dosyaya kaydedilmedi, konuşma içinde**:
   - Giriş gönderisi (TR) — kuzgun hikâyesi + 5 disiplin + 4 kapı + davet
   - Hakkında metni — **1.545 karakter** (LinkedIn sınırı 2.000, python ile sayıldı)
   - Slogan — **73 karakter** (sınır 120)
   - 20 uzmanlık etiketi (Specialties) + sektör/büyüklük/kuruluş kutucukları
   - **Rakam kararı:** "29 ürün" `projects.ts`'ten sayıldı (34 slug − 5 kategori). "App Store'da X uygulama" gibi net sayı YAZILMADI; veride 3 `live` + 1 `testflight` var, abartı olmasın diye "yayında olanlar da var" denildi.

**Kök neden (neden 5 hafta gecikti):** 2026-07-30 turu build alıp doğruladı ama commit/deploy adımını CEO onayına bıraktı, TODO #10 olarak yazıldı ve orada bekledi. Ders: marka/görsel değişiklikleri de kod gibi aynı turda prod'a çıkmalı, yoksa canlı site ile repo arasında sessizce fark birikiyor.

**Etki:** canlı site artık repo ile eşit. Fark 0 commit.

**Commit:** `28477be`


### 2026-07-30 — Marka kimliği + terminal açılışı + marka filmi (henüz commit edilmedi)

**Ne yapıldı**

1. **Logo renkleri değiştirildi.** Kaynak `OneDrive/Corvus Tech/Corvus/Post/2.post.png` (zeytin zemin `#343C26` + neon lime `#E0FC07`) → site paletine taşındı. CEO kararı: **logo siteye uysun (mavi `#5B8CFF`)**. Alternatifler (lime'ı brand yapmak / nötr beyaz) sunuldu, mavi seçildi.
   - Yöntem: PIL ile lime↔zemin mesafe tabanlı yumuşak alfa maskesi → renk değişimi (kenar yumuşaklığı korundu), `scripts` yok, tek seferlik.
   - Üretilenler → `public/brand/`: `corvus-logo.png` (667×473), `corvus-mark.png` (419×333), `corvus-wordmark.png`, `corvus-logo-white.png`, `corvus-mark-white.png`, `corvus-social-1x1.png`
   - ⚠️ **Bilinen çakışma:** `#5B8CFF` aynı zamanda iOS disiplin rengi (`--c-ios`). Logo ile iOS kartları aynı maviye düşüyor. Ayırma önerildi, CEO kararı bekliyor (aşağıda görev 9).

2. **Nav marka işareti gerçek logoyla değiştirildi.** `Nav.tsx` içindeki jenerik kuş SVG'si silindi → `.brand-mark` (globals.css). PNG alfa kanalı **CSS mask** olarak kullanılıyor, renk `var(--c-live)`'dan geliyor — yani marka işareti aktif disiplin rengiyle birlikte değişmeye devam ediyor (sabit renkli PNG olsaydı bu özellik kaybolurdu).

3. **Terminal açılışı (`Intro.tsx`) eklendi.** Coinbase "The Future of Money" reklamının kare kare analizinden çıkarılan formatla — sistem güncellemesi metaforu.
   - Akış: `/* corvus.systems` → `...error: PORTFOLIO NOT LOADED` → `Set System Mode to: SHIPPING` → **`Enough text ** see it`** (format geçiş sinyali, ters vurgulu) → ASCII kuzgun satır satır belirir → `CORVUS.` → fade
   - Süre ~3.8 sn. Skip butonu + ESC/Enter/Space + tıklama ile geçilir.
   - `sessionStorage.cv_intro` ile oturumda bir kez. Tekrar yüklemede tek kare bile sıçramasın diye `layout.tsx` `<head>`'ine inline script → `html[data-intro-seen="1"] .intro { display:none }`.
   - `prefers-reduced-motion: reduce` → hiç oynamaz.
   - Sistem satırları bilinçli İngilizce (terminaller İngilizcedir); yalnız içerik satırı lokalize (`: 29 products / 1 screen` ↔ `: 29 ürün / 1 ekran`).

4. **ASCII kuzgun** (`fx/corvusAscii.ts`) — `corvus-mark.png` alfa kanalından üretilmiş 84×35 grid, rampa `" .':;/\<>+*=#{}0189@"`.
   - ⚠️ **Öğrenilen ders:** ilk sürüm 58 sütundu ve kuzgun tanınmıyordu; ayrıca CSS'te `letter-spacing: 0.08em` vardı → monospace hücre oranını bozup şekli yatay geriyordu. Doğru ayar: **letter-spacing 0, line-height 1.09** (grid `CELL_RATIO 0.55` ile üretildiği ve karakter genişliği ≈0.6em olduğu için).

5. **Marka filmi (`BrandFilm.tsx`) eklendi** — Hero'nun hemen altında, `<Marquee>`'den önce, `id="film"`.
   - Hero'nun sağ tarafını fixed 3D canvas kullandığı için video oraya konmadı — çakışırdı.
   - IntersectionObserver (threshold .25) ile görünürken oynar, çıkınca duraklar (sürekli dekode 3D sahnenin kare bütçesini yiyordu).
   - `preload="none"`, muted/loop/playsInline, WebM→MP4 sırası, `prefers-reduced-motion` → video yerine poster `<img>`.

6. **10 sn'lik marka filmi Higgsfield ile üretildi** (CEO onayı: pro mod, ~22 kredi).
   - Görsel: `nano_banana_pro` 4K 16:9, **logomuz referans verilerek** → partiküllerden oluşan kuzgun (`dd2de6a1`), 4 kredi
   - Video: `kling3_0` 10 sn `mode: pro`, `sound: off`, `start_image` = üretilen görsel, **`end_image` = gerçek logo kilidi** (`fed91264`), 17.5 kredi
   - ⚠️ **Kritik teknik:** `end_image` olarak kendi logomuzu vermek AI'ın logoyu uydurmasını engelledi — video son 1.5 sn'de birebir bizim logomuzda sabitleniyor. Kare kare doğrulandı.
   - `kling3_0` "IN THE DARK" preseti önerdi → **reddedildi** (`declined_preset_id`), preset start/end frame kontrolünü elden alıyor.

7. **Video varyantları.** Master (15MB, 1928×1072) `brand-src/`'ye taşındı — public'te değil.
   - `public/videos/corvus-intro.mp4` (2.3MB, CRF 26, faststart, sessiz) + `.webm` (VP9 CRF 34, 2.3MB)
   - `brand-src/corvus-intro-9x16.mp4` (4.3MB) · `corvus-intro-1x1.mp4` (2.9MB) → sosyal medya
   - `public/brand/corvus-poster.jpg` (38K) = videonun son karesi (logo kilidi)
   - ⚠️ 19MB'lık 4K start frame ve 15MB master **`brand-src/`'de, public'te değil** — Vercel bundle'ına girmesinler.

**Doğrulama**
- `npx tsc --noEmit` → 0 hata · `npm run build` → ✓ 67 sayfa
- Intro headless Chrome'da kare kare doğrulandı (2.4s terminal metni + ters vurgu + cursor, 3.05s ASCII kuzgun + CORVUS)
- BrandFilm: DOM'da bulundu, `!video.paused === true`, `currentSrc` = `corvus-intro.webm`, genişlik 1470px (Playwright evaluate)
- ⚠️ Brand film bölümünün **tam sayfa ekran görüntüsü alınamadı** — Chrome headless fragment+scroll ile takıldı, Playwright MCP screenshot'ı diske yazmıyor. Yerleşim sayısal olarak doğrulandı, görsel olarak değil.

**Referans:** Format kılavuzunun tamamı → `Corvus Tech/-Video Edit Fikri/ASCII-TERMINAL-VIDEO-URETIM-KILAVUZU.md` (1256 satır, 17 bölüm). Kaynak reklam analizi → aynı klasörde `coinbase-ad-analysis/`.

### 2026-07-30 (devam) — Video ASCII formatına çevrildi ⚠️ ÖNEMLİ DÜZELTME

**Sorun:** İlk teslim edilen Higgsfield videosu sinematik partikül işiydi — **kılavuzun formatı değildi**. Kılavuz Bölüm 2'nin değişmez kuralları çiğnenmişti: iki renk yok (mavi glow gradyanlı), ASCII yok, terminal metni yok. CEO uyardı: "bu video gibi istemiştim."

**Çözüm — kılavuzun hibrit yaklaşımı uygulandı (Bölüm 10):** Higgsfield videosu atılmadı, **ASCII katmanının kaynağı** yapıldı. Kılavuz zaten bunu söylüyor: metin kodla render edilir, ASCII katmanı gerçek görüntüden filtrelenir.

**`brand-src/build_intro.py`** — tek script, Chrome/headless gerekmez, saf PIL + ffmpeg:
- **Katman A (0.0-4.2 sn):** terminal yazma, doğrudan PIL ile çizilir. cps sahneye göre değişir (42 → 420 log akışı → `Sure.` 16 cps, kasıtlı yavaş insan anı). Ters vurgulu `Enough text ** see it` geçiş cümlesi. Cursor 0.5 sn periyotla yanıp söner.
- **Katman B (4.2-10.0 sn):** `corvus-intro-master.mp4` → ASCII grid (150 sütun, rampa `" .':;/\<>+*=#{}0189@"`)

**Ayar dersleri (yeniden üretirken bunları koru):**
| Parametre | Değer | Neden |
|---|---|---|
| `SRC_CROP` | `crop=1180:664` | Master'da kuzgun kadraj ortasında küçük kalıyor. Crop'suz ızgara doluluğu **%6**, crop'la **%15**. Kritik fark. |
| `ASCII_GAMMA` | 0.50 | Kaynak koyu zeminli; düz kontrast artırmak yetmiyor, çoğu hücre boşluğa düşüyor. gamma<1 parlak bölgeyi genişletiyor. |
| `FONT_SIZE` | 38 | 22px 1080p'de küçük kalıyordu; 38 Coinbase'in oransal metin büyüklüğünü yakalıyor. |
| `FG` | `#7BA5FF` | `#5B8CFF` koyu zeminde ince ASCII karakterlerinde soluk okunuyor. Parlak ton. (Bu ton aynı zamanda TODO #9'daki iOS çakışmasının çözümü olabilir.) |
| letter-spacing | **0** | Monospace hücre oranını bozup kuzgunu yatay geriyor. |

**Teslim:**
- `public/videos/corvus-intro.mp4` (1.9MB) + `.webm` (2.3MB) — **artık ASCII sürüm**, sitede oynayan bu
- `brand-src/corvus-intro-ascii-master.mp4` (3.4MB, CRF 16) — master
- `brand-src/corvus-intro-ascii-9x16.mp4` (2.5MB) · `-1x1.mp4` (2.0MB) — sosyal
- `brand-src/corvus-intro-cinematic.mp4` — eski Higgsfield sürümü, alternatif olarak saklandı (silinmedi)
- `public/brand/corvus-poster.jpg` — 9.6 sn karesi (ASCII logo kilidi)

**Doğrulama:** `npm run build` ✓ · süre tam 10.000 sn · kilit anlar kare kare doğrulandı (terminal metni 1.0/2.6/3.9 sn, ASCII kuzgun 4.6-8.8 sn, ASCII logo+CORVUS 9.6 sn).

**Yeniden üretmek:** `cd brand-src && python3 build_intro.py` → sonra yukarıdaki ffmpeg varyant komutları. Senaryo metnini değiştirmek için scriptteki `SCRIPT` dizisi yeter.


### 2026-07-30 (5. seans) — 🔒 GÜVENLİK TURU: 7 bulgu, 5'i kapatıldı, 1'i CEO'da, 1'i geçersiz
**Tetikleyici:** CEO'nun OKX Web3 Cüzdan eklentisi `corvus-tech.co/terminal` için "kimlik avı" uyarısı gösterdi → yanlış alarm çıktı (Terminal'de crypto/wallet kodu yok, domain temiz, 2026-01-03 GoDaddy kaydı) ama denetim sırasında gerçek açıklar bulundu.

**Bulgular ve sonuçları:**

| # | Bulgu | Şiddet | Sonuç |
|---|-------|--------|-------|
| 1 | Terminal auth bypass — `AuthContext.tsx:38` auto-admin, panel herkese açık | 🔴 KRİTİK | ✅ Terminal yayından kaldırıldı |
| 2 | Firestore 6 koleksiyonda `allow read: if true` — sinyaller auth'suz okunuyordu | 🟠 YÜKSEK | ✅ Tümü `if false`, deploy edildi |
| 7 | Ortak API'de sıfır auth — `/api/backtest/run` dahil her uç curl'e açık | 🟠 YÜKSEK | ✅ Kod hazır, **Cloud Run deploy CEO'da** |
| 3 | `vite.config.ts` GEMINI_API_KEY'i bundle'a gömüyor | 🟡 ORTA | ✅ Prod build guard eklendi |
| 4 | Admin şifre özeti (tuzsuz SHA-256) canlı bundle'da | 🟡 ORTA | ✅ Terminal kaldırılınca konu dışı |
| 5 | Portfolyoda güvenlik başlıkları yok (sadece HSTS) | 🟢 DÜŞÜK | ✅ 4 başlık eklendi, canlıda |
| 6 | Terminal `.gitignore`'unda `.env` yok | 🟢 DÜŞÜK | ⛔ **GEÇERSİZ** — satır 26-29'da zaten var, ilk tarama hatası |

**Değişen dosyalar (3 repo):**
- `corvus-site`: `next.config.ts` (rewrites silindi + `securityHeaders`), `src/proxy.ts` (/terminal muafiyeti silindi), `src/components/Footer.tsx` (Terminal linki silindi)
- `Corvus-Tech-Terminal`: `firestore.rules` (tümü deny), `storage.rules` (tümü deny), `firebase.json` (hosting çıkarıldı), `firebase.hosting.disabled.json` (YENİ — yedek+talimat), `vite.config.ts` (prod build key guard), `services/data-api.ts` (modül düzeyi fetch sarmalayıcı → X-API-Key), `vite-env.d.ts`
- `Ortak`: `api_server.py` (`ApiKeyMiddleware` + production fail-safe)

**Doğrulama (hepsi PASS):**
- Portfolyo build: 67 sayfa temiz · Terminal `tsc --noEmit`: 0 hata · `api_server.py` syntax: OK
- API anahtar testi 5/5: anahtarsız→401 · yanlış→401 · doğru→200 · Bearer→200 · `/api/backtest/run` anahtarsız→401
- Fail-safe: `STORAGE_MODE=cloud` + anahtar yok → `RuntimeError`, servis başlamıyor ✓ (anahtar varsa import OK ✓)
- Firestore 6/6 koleksiyon → **403** ✓ (öncesinde gerçek veri dönüyordu)
- `corvus-tech.co/terminal` → 404 ✓ · `corvus-tech.web.app` → 404 ✓
- Güvenlik başlıkları canlıda 5/5: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS ✓

**Yan bulgular:**
- Firebase Storage bu projede hiç kurulmamış → storage riski fiilen yoktu; `storage.rules` yine de sertleştirildi ama `firebase.json`'dan çıkarıldı (deploy hata veriyordu).
- Terminal'de Firebase SDK kurulu değil (`package.json`'da yok) → Firestore'u frontend kullanmıyordu, kapatmak hiçbir şeyi kırmadı. Tek etkilenen: `scripts/test-scanner-outputs-on-web.ts` (geliştirici aracı, service account ile çalıştırılmalı).
- `services/supabase.ts` ölü kod — hiçbir yerden import edilmiyor. Anahtar doğru tipte (`"role":"anon"`).

### 2026-07-30 (4. seans) — DNS kesme + SSL: site canlıya çıktı 🚀 (kod değişikliği yok)
**Ne yapıldı:** CEO GoDaddy panelinden DNS'i Firebase'den Vercel'e çevirdi; SSL elle tetiklendi; uçtan uca doğrulandı.

**1. DNS (CEO, GoDaddy paneli):**
- A `@`: `199.36.158.100` (Firebase) → **`76.76.21.21`** (Vercel)
- CNAME `www`: `corvus-tech.web.app` → **`cname.vercel-dns.com`**
- MX / TXT / NS'e dokunulmadı (NS hâlâ ns05/ns06.domaincontrol.com — A-kaydı yöntemi, NS devri gerekmiyor)
- Doğrulama: `dig @ns05.domaincontrol.com corvus-tech.co A` → `76.76.21.21` ✓ · `dig @8.8.8.8` → `76.76.21.21` ✓

**2. KÖK NEDEN — SSL otomatik çıkmadı (asıl bulgu):**
DNS yayıldıktan sonra 15 dk (30×30sn poll) boyunca HTTPS `000` döndü — TLS handshake `SSL_ERROR_SYSCALL`. `vercel domains inspect` "not configured properly" uyarısını kaldırmıştı (yani DNS'i görmüştü) ama `vercel certs ls` çıktısında **sadece ameliea.co vardı, corvus-tech.co yoktu** → sertifika hiç üretilmemiş.
- **Ağ elemesi:** `curl --resolve ameliea.co:443:76.76.21.21 https://ameliea.co` → **200**. Yani 76.76.21.21 erişilebilir, sandbox/ağ sorunu değil, sorun sertifikada.
- **Fix:** `vercel certs issue corvus-tech.co www.corvus-tech.co` → 12 sn'de `cert_K8vvQUGWFbX4nXGdeWRan4eI` (Let's Encrypt YR2, notAfter 2026-10-28, auto-renew açık).

**3. Yan tuzak — yerel DNS cache:** macOS resolver eski Firebase IP'sini tuttuğu için düz `curl https://corvus-tech.co/tr` **200 + `<title>CORVUS TECH TERMINAL</title>`** döndürüyordu (Firebase'in terminal SPA'i) — "site çalışıyor" sanılabilirdi. Gerçek durum ancak `--resolve ...:76.76.21.21` ile görüldü. Temizleme: `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`.

**4. Doğrulama (hepsi `--resolve corvus-tech.co:443:76.76.21.21` ile, PASS):**
| Yol | Sonuç |
|---|---|
| `/` | 307 → `/en` (proxy.ts dil yönlendirmesi) ✓ |
| `/tr` | 200 · `<title>Corvus Tech — Ürün stüdyosu</title>` ✓ |
| `/en` | 200 ✓ |
| `/tr/work` | 200 ✓ |
| `/terminal` | 200 · `<title>CORVUS TECH TERMINAL</title>` ✓ |
| `/terminal/assets/index-BbwEn8hU.js` | 200 (rewrite asset akışı sağlam) ✓ |
| `www.corvus-tech.co` | 307 → siteye ✓ |
| Sertifika | `CN=corvus-tech.co`, Let's Encrypt, 2026-07-30 → 2026-10-28 ✓ |

**Etki:** Site piyasaya açık. `/terminal` Firebase'de yaşamaya devam ediyor, Vercel rewrite'ı üzerinden aynı origin'den servis ediliyor — DNS değişimi terminali bozmadı, tam tersine asıl kurgu (kök=portfolyo) ancak şimdi aktifleşti.

### 2026-07-30 — Perf turu 2: /work geç açılıyor (CEO şikâyeti) — `c5f4933`
**İki kök neden:**
1. `/[lang]/work` **dynamic SSR'dı** (server'da `searchParams` okunuyordu) → her açılış Vercel sunucusuna gidiyordu. Fix: `?d=` filtresi client'a taşındı (`useSearchParams` + Suspense) → sayfa `● SSG`, CDN'den anında + Link prefetch çalışıyor.
2. **Reveal bug'ı:** `useReveal` observer'ı sadece ilk mount'ta kuruluyordu; client-side navigasyonla gelen kartlar `.reveal` opacity:0'da takılıyordu ("projeler geç geliyor"un asıl sebebi). Fix: MutationObserver ile sonradan eklenen `.reveal` öğeleri otomatik yakalanıyor; viewport içindekiler ilk karede açılıyor.
**Doğrulama:** build `● /[lang]/work` ✅; Playwright client-nav: 29 kart, ekrandaki 6'sı anında opacity:1 ✅. Prod deploy edildi.

### 2026-07-30 — "Afilli" paket (CEO: hepsi, beğenmezse revert)
**4 katman eklendi, canlıda (`7cf289d` + `f007d92`):**
1. **Mikro-etkileşim:** `fx/CustomCursor` (disiplin renkli nokta+halka, magnetik butonlar `[data-magnetic]` desteği, pointer:fine+hover:hover, reduced-motion kapalı) · `ProjectCard` 3D tilt+glare (client'a çevrildi) · `fx/CountUp` Stats sayaçları
2. **Terminal easter egg:** `fx/TerminalEgg` — "corvus" yaz veya footer `>_` → mini shell (help/ls/ls projects/open <slug>/whoami/contact/sudo→"nice try."/clear/exit); Playwright'ta komutlar doğrulandı
3. **Sinematik:** `fx/Scramble` hero text-decode · `fx/SweepFx` disiplin değişiminde renk süpürmesi · `experimental.viewTransition` + `fx/VT` sarmalayıcı (kart başlığı ↔ detay h1 morph, `proj-<slug>` isimleri; React export'u yoksa Fragment fallback)
4. **Higgsfield videolar:** 5 disiplin loop'u (kling3_0_turbo, 4sn 720p 16:9, **30 kredi**, bakiye 1044→~1014). `public/videos/<slug>.mp4` (2-6MB). `scene/DisciplineVideo` → SceneLayer fallback dalında (mobil + work/proje sayfaları) opacity 0.32 ambient bg; ana sayfa desktop'ta 3D kalır, video yüklenmez
**Revert notu:** her katman ayrı commit'te; tek katman geri almak için ilgili fx dosyası + layout mount satırı kaldırılır.

### 2026-07-30 — Perf turu 1 (CEO: "site çok ağır hareket ediyor")
**Kök nedenler + fix'ler:**
1. **Tam ekran `backdrop-blur` × 6 section** (canvas üstünde her frame compositing) → kaldırıldı, düz yarı saydam bg (`/86`→`/92`, `/70`→`/85`); Nav `backdrop-blur-xl`→`md`
2. **Grain `mix-blend-mode: overlay` fullscreen** → normal blend + opacity 0.22→0.05, `position: fixed`
3. **Canvas DPR 1.75 + antialias** → `dpr [1,1.5]` + `antialias: false`; dust 420→260
4. **Canvas her sayfada render ediyordu** (work/proje sayfalarında objeler görünmez ama GPU 60fps çiziyordu) → `SceneLayer` artık canvas'ı SADECE ana sayfada (`/en`|`/tr`) mount ediyor; diğer sayfalar CSS halo
**Doğrulama:** build 67 sayfa ✅; Playwright: ana sayfa `canvas:true`, /work `canvas:false halo:true` ✅. Prod deploy edildi (Aliased: corvus-tech.co).
**Yan bulgu:** bayat dev sunucusu (taşınmış proxy.ts'i arayan) 3001'de 500 veriyordu → pkill, temiz restart; canlıyı etkilemez.

### 2026-07-30 (3. seans) — domain düzeltmesi: corvus-tech.co (TİRELİ)
**Hata + düzeltme:** Önceki seansta tiresiz `corvustech.co` (sahibi başkası, Atak Domain, Apache 403) yanlışlıkla hedeflendi. CEO düzeltti: gerçek domain **corvus-tech.co** (GoDaddy, A→Firebase 199.36.158.100, şu an /terminal'e 301). Vercel'den yanlış domainler kaldırıldı, `corvus-tech.co`+`www` eklendi, `site.ts` URL/e-posta güncellendi (`96271fc`), prod redeploy: `Aliased: https://corvus-tech.co`. Kalan: GoDaddy'de A kaydı → 76.76.21.21.

### 2026-07-29 (2. seans) — /terminal yer değişimi
**Karar:** kök = portfolyo, `/terminal` = Terminal (CEO). Terminal `corvus-tech.web.app`'te canlı.
- **Terminal (`ac4772f`):** vite `base:'/terminal/'`, firebase.json public=`deploy` + `deploy/terminal/` yapısı + kök 301; Firebase'e deploy edildi, canlı doğrulandı (200 + asset'ler). `localhost:8765` CSP hataları önceden var (bilinçli local-only mode) — dokunulmadı.
- **Site (`683e6de`):** next.config rewrites `/terminal` → Firebase; proxy /terminal muafiyeti; **kök neden bug:** `proxy.ts` kökteyken hiç çalışmıyordu (`/` 404) → `src/proxy.ts`'e taşındı → `/` 307 `/tr` ✓, `/terminal` 200 title `CORVUS TECH TERMINAL` ✓. Build 67 sayfa ✅.

### 2026-07-29 — v1 sıfırdan kuruldu (F1 tamam)
**Ne yapıldı:** Corvus Tech portfolyo sitesi, Ciao Energy referans videosu (13sn, kare kare ffmpeg analizi) örnek alınarak tam 3D-sahneli kuruldu.
- **Keşif:** 3 klasör tarandı (OneDrive/Corvus Tech, Documents/Corvus Tech, AnaokuluRadar) → 29 proje 5 kategoriye ayrıldı; `WEB_APP_DESIGNER_AGENT.md` disiplini uygulandı (DESIGN_LOG.md)
- **Kurulum:** create-next-app (Next 16.2.12 + React 19 + Tailwind v4) + three/R3F/drei; Next 16 dokümanları okundu (proxy konvansiyonu, async params, PageProps helper)
- **Dosyalar:** `src/data/projects.ts` (29 proje EN+TR), `src/i18n/dict.ts`, `proxy.ts`, `src/app/[lang]/{layout,page,not-found,opengraph-image}.tsx`, `work/{page,[slug]/page}.tsx`, `src/components/` (Hero, DisciplineStage, HomeWork, WorkExplorer, ProjectCard, Process, Faq, Contact, Nav, Footer, Marquee, Stats, RevealBoot) + `scene/` (Provider, Canvas, objects, Layer), `sitemap.ts`, `robots.ts`
- **Kök neden çözümleri:** (1) fixed `-z-10` canvas görünmüyordu → `body` bg transparent, bg `html`'e taşındı; (2) 3D objeler headline ile çakışıyordu → carousel `CAROUSEL_X=2.1` sağa + kamera aşağı bakış; (3) proje/work sayfalarında obje kalıntısı → `exitRef=1` tam çıkış
- **Doğrulama:** `npm run build` ✅ 67 sayfa 0 hata; Playwright görsel PASS: hero (EN), pinned stage (durak 2/4 + dönen telefon), work grid (fintech filtre sarı), FAQ (dev outline tipografi), contact, proje detay TR ("Global bir FMCG şirketi" ✓), mobil 390px TR (3D kapalı fallback ✓)
- **Commit:** ilk commit bu oturumda (aşağıda hash)
