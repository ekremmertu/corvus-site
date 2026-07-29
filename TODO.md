# corvus-site — Yol Haritası + PASS LOG

## Sonraki Oturum İçin
**Aktif durum:** v1 tamam, build yeşil (67 sayfa), deploy bekliyor. Önce `.claude-state.md` oku.

| # | Görev | Kim | Not |
|---|-------|-----|-----|
| 1 | ~~Domain kararı~~ ✅ DONE — `corvustech.co` kesinleşti | — | 2026-07-29 |
| 2 | Vercel deploy + `corvustech.co` DNS (GoDaddy → Vercel) | CEO (login gerekli) | `! npx vercel login` → `npx vercel --prod` → domain ekle |
| 2b | ~~/terminal entegrasyonu~~ ✅ DONE | — | Terminal `ac4772f` + site `683e6de`, Firebase canlı |
| 3 | ~~v1 site kur~~ ✅ DONE | — | 2026-07-29, commit `d4c85d6` |
| 4 | v1.1: gerçek ekran görüntüleri (proje detay) | Claude solo | Quill/marketing, TripWalkers/fastlane, Amelie.co/Logo |
| 5 | v1.1: Higgsfield disiplin videoları (kart hover) | CEO onayı (kredi harcar) | 5 kısa loop |
| 6 | GitHub push | CEO kararı | Şu an lokal git |

**Yapma kuralları:**
- İçerik değişikliği SADECE `src/data/projects.ts` — başka dosyaya kopya metin yazma
- **Nestlé adı asla siteye girmez** → "Global bir FMCG şirketi"
- 3D değişikliklerinde mobil fallback'i kır(ma)dığını Playwright ile doğrula

## PASS LOG

### 2026-07-29 (2. seans) — corvustech.co kesin + /terminal yer değişimi
**Karar:** kök = portfolyo, `corvustech.co/terminal` = Terminal (CEO). Keşif: corvustech.co şu an Firebase'e bağlı DEĞİL (Apache 403) → DNS sıfırdan Vercel'e kurulacak; Terminal `corvus-tech.web.app`'te canlı.
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
