# TripWalkers planları (corvus-tech.co/tripwalkers/planlar · /tripwalkers/plans) — veri hattı ve bekçiler

Tek kaynak: TripWalkers plan havuzu (`../TripWalkers/Scripts/plan-pool`) + app'in `CuratedSpots.json`'u.
Site bu kaynaklardan **üretilir**; sayfa metni elle yazılmaz.

## Akış (yeni plan / düzeltme / çeviri sonrası hep aynı)
```
python3 scripts/translate-plans.py --lang tr-fix --all --jobs 3   # 1) Türkçe üslup katmanı (isteğe bağlı)
python3 scripts/translate-plans.py --lang en --all --jobs 3       # 2) İngilizce katman (tr-fix'ten SONRA)
npm run gezi:data                                                 # 3) JSON üret (plans/, plans-en/, liste/)
npm run build && npx next start -p 3123                           # 4) derle + aç
npm run gezi:check && npm run gezi:layout                         # 5) bekçiler: ikisi de 0 sorun vermeli
python3 scripts/translate-plans.py --report                       # harcama özeti
```

## Katmanlar (`scripts/i18n/<dil>/<dest>-<mevsim>.json`)
- `plan_texts.py` planın okunan metinlerini anahtarlı sözlüğe çıkarır (`d1.s0.tips`, `note2`, `niche.why_hidden`…).
- `tr-fix` = yalnız değişen Türkçe metinler (mekân adlarına dokunulmaz: Apple Maps eşleşmesi bozulur).
- `en` = metinlerin tamamı. `source` alanı Türkçenin parmak izidir; Türkçe değişirse `gezi:data` "bayat EN" listeler → o planı yeniden çevir.
- Eksik çeviri varsa EN sayfa **üretilmez** (yarım İngilizce yayına çıkmaz). EN dizini yalnız çevrilmiş şehirleri gösterir.

## Kurallar
- Çeviri/düzeltme YALNIZ `claude -p` (abonelik). Betik çağrıyı `ANTHROPIC_API_KEY`'siz, boş klasörde, araçsız, MCP'siz yapar. Ücretli API yok.
- Arayüz metni sözlükte: `src/lib/gezi-i18n.tsx` (TR + EN birlikte eklenir). Bileşene sabit yazı yazma — `gezi:check` yakalar.
- Adresler: `ROUTES` (TR `/tripwalkers/planlar`, `…/liste`, `…/mekan` · EN `/tripwalkers/plans`, `…/lists`, `…/places`). Çıplak `/tripwalkers` → dile göre yönlendirme (`proxy.ts`).
- Sayfa gövdeleri tek yerde: `src/components/gezi/views/*` — route dosyaları yalnız dili seçer.

## Pilot ölçüm (05.10.2026, sonnet, 2 plan: istanbul-summer v2 + rome-other v1)
| Katman | 2 plan | 200 plana oran (karakter) |
|---|---|---|
| tr-fix | 15,8k girdi + 4,5k çıktı tk · 38 sn | ~0,64M + 0,18M tk · API eşdeğeri ~$4 · 3 paralel ~10 dk |
| en | 18,1k girdi + 15,8k çıktı tk · 94 sn | ~0,82M + 0,72M tk · API eşdeğeri ~$10 · 3 paralel ~25 dk |
API eşdeğeri bilgi amaçlıdır; abonelikte ödenmez, 5 saatlik kotadan düşer.

## Gerçek koşum (05.10.2026, 200 plan, 3 paralel)
| Katman | Token | Süre | API eşdeğeri |
|---|---|---|---|
| tr-fix | 0,84M girdi + 0,48M çıktı | 59 dk | $7,7 |
| en | 1,07M girdi + 0,83M çıktı | 79 dk | $12,1 |
Süre pilot tahmininin 3–6 katı, token ~1,3–1,6 katı çıktı (paralel çağrılar yavaşlıyor; model değişmeyen metni de geri yazıyor) — bütçelerken bu rakamları kullan.
