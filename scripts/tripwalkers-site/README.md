# TripWalkers tanıtım sayfası — kaynak ve üretim

- `kaynak/` = EN ana kaynak (artifact sürümü; CDN, göreli yollar). Düzenleme BURADA yapılır.
- `tr.py` = EN→TR çeviri sözlüğü. Her anahtar sayfada birebir bulunmalı; yoksa betik durur (yarım çeviri yayına çıkmaz).
- `tocorvus.py kaynak ../../public/tripwalkers-site` → `index.html` (EN) + `index-tr.html` (TR) üretir: head/OG/JSON-LD, yerel vendor, TR görseller (img/tr-*.webp), göreli site linkleri.
- Adresler: `next.config.ts` rewrites + `src/components/WorkLink.tsx` STANDALONE (ikisi aynı liste olmalı).
- Test: `CHROME=<chromium yolu> node clicktest.mjs https://corvus-tech.co` → 26 kontrol (kart tıklaması × 2 dil × 2 genişlik + geri butonu 44px + dil değiştirici).

```
cd scripts/tripwalkers-site && python3 tocorvus.py kaynak ../../public/tripwalkers-site
```
