# corvus-site — Yol Haritası + PASS LOG

## Sonraki Oturum İçin
**Aktif durum:** v1 tamam, build yeşil (67 sayfa), deploy bekliyor. Önce `.claude-state.md` oku.

| # | Görev | Kim | Not |
|---|-------|-----|-----|
| 1 | ~~Domain kararı~~ ✅ DONE — `corvus-tech.co` kesinleşti | — | 2026-07-29 |
| 2 | ~~Vercel deploy~~ ✅ DONE — corvus-site-omega.vercel.app canlı, domainler eklendi | — | 2026-07-29 |
| 2c | **DNS: GoDaddy panelinde A kaydı** @ `199.36.158.100`→`76.76.21.21`, www CNAME→`cname.vercel-dns.com` | **CEO** | NS değişimi gerekmez; MX etkilenmez. Domain TİRELİ: corvus-tech.co |
| 2b | ~~/terminal entegrasyonu~~ ✅ DONE | — | Terminal `ac4772f` + site `683e6de`, Firebase canlı |
| 3 | ~~v1 site kur~~ ✅ DONE | — | 2026-07-29, commit `d4c85d6` |
| 3b | ~~Perf turu 1: site ağır (CEO şikâyeti)~~ ✅ DONE | — | 2026-07-30, blur/grain/dpr/canvas-unmount; aşağıda PASS LOG |
| 3c | Perf turu 2 (gerekirse): CEO hâlâ ağır derse — damp hızlandır, obje polygon azalt, `frameloop` scroll-durdurma | Claude solo | CEO'nun cihaz+tarayıcı bilgisiyle |
| 4 | v1.1: gerçek ekran görüntüleri (proje detay) | Claude solo | Quill/marketing, TripWalkers/fastlane, Amelie.co/Logo |
| 5 | v1.1: Higgsfield disiplin videoları (kart hover) | CEO onayı (kredi harcar) | 5 kısa loop |
| 6 | GitHub push | CEO kararı | Şu an lokal git |

**Yapma kuralları:**
- İçerik değişikliği SADECE `src/data/projects.ts` — başka dosyaya kopya metin yazma
- **Nestlé adı asla siteye girmez** → "Global bir FMCG şirketi"
- 3D değişikliklerinde mobil fallback'i kır(ma)dığını Playwright ile doğrula

## PASS LOG

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
