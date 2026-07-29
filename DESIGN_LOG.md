# PROJECT LOG v2 — Corvus Tech Portfolio Site

> Web App Designer Agent "Hafif Kırık" v2 disipliniyle üretildi.
> Referans: `OneDrive/Corvus Tech/Claude/WEB_APP_DESIGNER_AGENT.md`

## 🎯 Site/App
Corvus Tech portfolyo/pazarlama sitesi — 5 disiplinde 29 gerçek ürünü kategorili anlatan, Ciao Energy tarzı tek-sürekli-3D-sahne deneyimi.

- 🌍 **Pazar:** Global (EN default) + TR
- 👥 **Kitle:** Ürün yaptırmak isteyen kurucu/işletme + freelance müşterisi; 10 sn dikkat, 3 sekme açık
- 💰 **Model:** Lead-gen (tek conversion: e-posta ile "Start a project")
- 🖥️ **Tip:** Marketing site + portfolyo
- ⚙️ **Stack:** Next.js 16 (Turbopack) + React 19 + Tailwind v4 + three.js/R3F, Vercel hedefli
- 🗣️ **i18n:** `/en` + `/tr`, proxy.ts Accept-Language yönlendirme, hreflang alternates

## ✅ KARARLAR
- Görsel yön: **Tam Ciao-style** — tek fixed WebGL canvas, tüm sayfa üstünden akar (CEO seçimi)
- Kategoriler → 5 "disiplin": iOS `#5B8CFF` · Web `#2DD4BF` · Fintech `#FFB020` · AI `#A855F7` · Enterprise `#FF6B4A`
- Aktif disiplin **tüm sayfayı boyar**: `--c-live` custom property → halo, buton, seçim, OG
- **Nestlé adı hiçbir yerde geçmez** → "Global bir FMCG şirketi" (CEO: "çok önemli")
- 3D objeler ürün metaforu: telefon / tarayıcı penceresi / mum çubukları / ajan çekirdeği / palet
- Mobil + reduced-motion + WebGL yok + ≤4 çekirdek → 3D kapalı, CSS halo fallback (progressive enhancement)
- FAQ: Ciao'daki dev tipografi anı (outline italic) + native `<details>` (a11y bedava)

## 🎨 DESIGN TOKENS
- Color: `--c-bg #05060a`, elevated `#0a0c14`, text `#f4f6fb`/dim/faint, 5 disiplin accent'i
- Type: Archivo (display, italic dahil) + Inter (body) + JetBrains Mono (eyebrow/mono); mega `clamp(3rem,11vw,10.5rem)`
- Space: 4-8-12-16-24-32-48-64-96-140
- Radius: 8/12/18/28/pill
- Motion: `--motion-snap` 240ms overshoot (kontroller) · `--motion-gentle` 520ms (sinematik default) · damp() 3D
- Breakpoint: mobile-first; 3D yalnız ≥768px

## 📦 MİMARİ
- `src/data/projects.ts` — 29 proje + 5 kategori, tüm copy EN+TR tek dosyada
- `src/i18n/dict.ts` — UI sözlüğü; `proxy.ts` — locale redirect (Next 16 proxy konvansiyonu)
- `scene/SceneProvider` — aktif disiplin state + `stageRef/stopRef/exitRef` (rAF-okumalı, render tetiklemez)
- `scene/SceneCanvas` — tek Canvas; carousel pozu ↔ pinned stage ↔ exit pozu damp ile
- `DisciplineStage` — desktop 340vh pinned scroll (4 durak, obje döner); mobil düz liste
- SEO: sitemap (58 URL × hreflang), robots, per-locale OG image (ImageResponse), JSON-LD Organization

## 📊 HİPOTEZLER (test edilmemiş)
- 3D hero + tek CTA lead'i artırır → pre-launch: 5-kişi 5-second test + Clarity heatmap
- "Nothing here is a concept render" güven cümlesi dwell artırır → heatmap scroll depth

## 🚫 ELENENLER
- Hibrit (3D hero + CSS grid) → CEO tam Ciao-style seçti
- Higgsfield create_website → kod kontrolü + özel 3D esnekliği yetersiz
- Her karta ekran görüntüsü → v1'de asset borcu yaratır; v1.1'e (aşağıda)

## 🔗 İLHAM
- Ciao Energy (video, kare kare analiz): tek sürekli sahne, seçili obje renkli/diğerleri silüet, scroll-pinned dönen obje + 4 içerik durağı, dev outline FAQ tipografisi, üründen sızan ambient halo

## 🔄 AKTİF TODO (v1.1)
- [Track A] Domain + e-posta doğrula (`corvustech.co` placeholder — `src/lib/site.ts`)
- [Track B] Proje detaylarına gerçek ekran görüntüleri (TripWalkers/Quill/Amelie asset'leri mevcut)
- [Track C] Higgsfield ile disiplin başına sinematik kısa video (kart hover'ı)
