#!/usr/bin/env python3
"""Plan metinlerini İngilizceye çevirir (en) ya da Türkçesini düzeltir (tr-fix) — YALNIZ `claude -p` (abonelik).

Ücretli API YOK: çağrı `env -u ANTHROPIC_API_KEY` ile, boş klasörde, araçsız ve MCP'siz yapılır.
Çıktı katmanı: scripts/i18n/<lang>/<dest_key>-<season>.json → build-gezi-data.py okur.
Sıra: önce tr-fix (varsa), sonra en — çeviri düzeltilmiş Türkçeden yapılır.

Örnekler:
  python3 scripts/translate-plans.py --lang tr-fix --plans istanbul-summer,rome-other
  python3 scripts/translate-plans.py --lang en --all --jobs 3
  python3 scripts/translate-plans.py --report            # harcama özeti (_usage.jsonl)
Var olan ve Türkçesi değişmemiş katman atlanır (kaldığı yerden devam eder); --force yeniden yapar.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plan_texts  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
POOL = ROOT.parent / "TripWalkers" / "Scripts" / "plan-pool"
USAGE = plan_texts.I18N / "_usage.jsonl"

PROMPT_EN = """You translate a Turkish travel itinerary into natural, native British-neutral English for a travel website.
Input: a JSON object of {key: Turkish text}. Output: ONLY a JSON object with exactly the same keys, values in English. No commentary, no code fences.
Rules:
- Write like a sharp travel editor: concise, concrete, second person ("you"). Never add facts, never drop facts.
- Keep every number, time, price and currency exactly (you may change number formatting to English: 1.500 → 1,500; 09:00 stays 09:00). "TL" stays "TL".
- Keys ending in ".name" are place names used for map search:
  * places outside Türkiye: keep the name exactly as given (it is already the local/official name);
  * places in Türkiye: use the name English-language maps and guidebooks use (Kapalıçarşı → Grand Bazaar, Sultanahmet Camii → Blue Mosque, Yerebatan Sarnıcı → Basilica Cistern); if there is no common English name keep the Turkish proper noun and translate only generic words (Kaleiçi Yat Limanı → Kaleiçi Marina).
- Inside sentences use the same English place names; keep Turkish dish names in italics-free original form with a 1–3 word gloss on first mention only if the dish is not widely known (e.g. "simit (sesame bread ring)").
- Day themes ("dN.theme") stay short: 2–6 words, title-like but sentence case.
- No Turkish characters (ç ğ ı ö ş ü) outside proper nouns. Write a capital dotted İ as plain I (Istanbul, Istanbulkart, Istiklal).
- Turkish lira is always "TL" after the number (1,500 TL), never "₺".
- Use the em dash (—) sparingly: at most once per text; prefer a comma, colon or full stop."""

PROMPT_TR = """Sen bir Türkçe yayın editörüsün. Bir gezi planının metinlerini düzeltiyorsun.
Girdi: {anahtar: metin} JSON nesnesi. Çıktı: anahtar adları girdidekiyle BİREBİR aynı olmak üzere, YALNIZ değiştirdiğin anahtarları içeren JSON nesnesi {anahtar: düzeltilmiş metin}. Değişiklik gerekmeyen anahtarı YAZMA. Açıklama ve kod bloğu yok.
Düzelt:
- Yazım, noktalama, büyük-küçük harf, TDK'ye uygun yazım (ör. "birşey" → "bir şey", "herzaman" → "her zaman").
- Ek uyumu ve kesme işareti (Paris'te, 06.30'da değil 06:30'da, Frantzén'de).
- Bozuk ya da çeviri kokan cümle yapısı; anlamı belirsiz, yarım ya da çok uzun cümleler (kısalt, böl).
- Yabancı kelimeyi Türkçesi yaygınsa Türkçeye çevir ("check-in yap" kalabilir; "booking yap" → "rezervasyon yap").
Dokunma:
- Bilgiyi değiştirme, ekleme, çıkarma. Her sayı, saat, fiyat, para birimi, mekân ve yemek adı aynen kalır.
- Hitap "sen" dilidir, kısa ve somuttur; üslubu süsleme, metni uzatma.
- Yalnız gerçekten hatalı ya da kötü yazılmış metni değiştir."""


def plan_ids(all_: bool, plans: str | None) -> list[str]:
    if plans:
        return [p.strip() for p in plans.split(",") if p.strip()]
    if not all_:
        return []
    dests = json.loads((POOL / "destinations.json").read_text())
    return [f"{d['dest_key']}-{s}" for d in dests for s in ("summer", "other") if source_file(f"{d['dest_key']}-{s}")]


def source_file(plan_id: str) -> Path | None:
    for sub in ("plans_v2", "plans"):
        p = POOL / sub / f"{plan_id}-tr.json"
        if p.exists():
            return p
    return None


def turkish_texts(plan_id: str) -> dict:
    """Yayındaki Türkçe: havuz metni + (varsa) tr-fix katmanı."""
    src = source_file(plan_id)
    if not src:
        raise FileNotFoundError(plan_id)
    it = json.loads(src.read_text())["itinerary"]
    fix = plan_texts.load_layer("tr-fix", plan_id)
    if fix:
        it = plan_texts.apply(it, fix["strings"])
    return plan_texts.extract(it)


def call_claude(system: str, payload: dict, model: str) -> tuple[dict, dict]:
    if os.environ.get("ANTHROPIC_API_KEY"):
        print("  (ANTHROPIC_API_KEY ortamda dolu — çağrı anahtarsız yapılıyor: env -u)", file=sys.stderr)
    env = {k: v for k, v in os.environ.items() if k not in ("ANTHROPIC_API_KEY", "CLAUDECODE")}
    with tempfile.TemporaryDirectory() as empty:
        proc = subprocess.run(
            ["claude", "-p", json.dumps(payload, ensure_ascii=False), "--model", model, "--output-format", "json",
             "--tools", "", "--system-prompt", system, "--setting-sources", "project",
             "--strict-mcp-config", "--mcp-config", '{"mcpServers":{}}'],
            cwd=empty, env=env, capture_output=True, text=True, timeout=900,
        )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr[-500:] or proc.stdout[-500:])
    meta = json.loads(proc.stdout)
    if meta.get("is_error"):
        raise RuntimeError(str(meta.get("result"))[:500])
    text = (meta.get("result") or "").strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    start, end = text.find("{"), text.rfind("}")
    return json.loads(text[start:end + 1]), meta


DIGITS = re.compile(r"\d+")
TR_WORDS = re.compile(r"\b(ve|için|bir|ile|gibi|çok|daha|sonra|önce|değil|olan|yer|mutlaka)\b", re.I)


NUM_WORDS = {"one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8",
             "nine": "9", "ten": "10", "eleven": "11", "twelve": "12", "fifteen": "15", "twenty": "20", "thirty": "30",
             "double": "2", "twice": "2", "triple": "3", "triples": "3", "doubles": "2", "a dozen": "12", "single": "1"}
NUM_WORD_RE = re.compile(r"\b(" + "|".join(sorted(NUM_WORDS, key=len, reverse=True)) + r")\b", re.I)


def numbers(s: str, words: bool = False) -> list[str]:
    """Rakamlar (1.500 → 1500); words=True (yalnız İngilizce) yazıyla sayıyı da sayar ("five" → 5).
    Türkçede açılmaz: "Marmaris'ten" içindeki "ten" 10 sanılır."""
    if words:
        s = NUM_WORD_RE.sub(lambda m: f" {NUM_WORDS[m.group(1).lower()]} ", s)
    return DIGITS.findall(re.sub(r"(?<=\d)[.,](?=\d{3}\b)", "", s))


def check(lang: str, src: dict, out: dict) -> tuple[dict, list[str]]:
    """Katmanı denetler; sorunlu metni at (tr-fix) ya da raporla (en). Döner: (temiz katman, uyarılar)."""
    warn, clean = [], {}
    for k, v in out.items():
        if k not in src and f"{k}.tips" in src:  # model bazen "d2.s4.tips" yerine "d2.s4" yazıyor
            k = f"{k}.tips"
        if k not in src or not isinstance(v, str) or not v.strip():
            warn.append(f"{k}: bilinmeyen/boş anahtar atıldı")
            continue
        if lang == "tr-fix" and sorted(numbers(src[k])) != sorted(numbers(v)):
            warn.append(f"{k}: sayı değişti → düzeltme atıldı")
            continue
        if lang == "en":
            # yalnız KAYBOLAN sayı uyarılır; "five", "1960" (← 60) gibi yazımlar kayıp sayılmaz
            got = numbers(v, words=True)
            lost = [n for n in numbers(src[k]) if n not in got and not any(g.endswith(n) and len(g) > len(n) for g in got)]
            if lost:
                warn.append(f"{k}: sayı kayboldu ({' '.join(lost)})")
        if lang == "tr-fix" and not (0.6 <= len(v) / max(len(src[k]), 1) <= 1.4):
            warn.append(f"{k}: uzunluk çok değişti → düzeltme atıldı")
            continue
        # özel adlardaki Türkçe harf (Kadıköy) normal; çevrilmemiş cümleyi Türkçe bağlaçlar ele verir
        if lang == "en" and not k.endswith(".name") and len(TR_WORDS.findall(v)) >= 2:
            warn.append(f"{k}: çevrilmemiş Türkçe kalmış olabilir")
        if lang == "en":
            v = v.replace("İ", "I").replace("₺", "TL ").replace("TL  ", "TL ")
        clean[k] = v
    if lang == "en":
        missing = [k for k in src if k not in clean]
        if missing:
            warn.append(f"eksik çeviri: {len(missing)} metin ({', '.join(missing[:5])}…)")
    return clean, warn


def run_one(plan_id: str, lang: str, model: str, force: bool) -> dict:
    src = turkish_texts(plan_id)
    if lang == "tr-fix":
        # Mekân adları haritada aranır (Apple Maps doğrulaması) — Türkçe düzeltmede ADLARA DOKUNULMAZ.
        src = {k: v for k, v in src.items() if not k.endswith(".name")}
    fp = plan_texts.fingerprint(turkish_texts(plan_id) if lang == "en" else src)
    layer = plan_texts.load_layer(lang, plan_id)
    if layer and not force and layer.get("source") == fp:
        return {"plan": plan_id, "lang": lang, "skipped": True}
    if lang == "tr-fix" and plan_texts.load_layer("tr-fix", plan_id) and force:
        # yeniden düzeltmede eski katmanın üstüne değil havuz metnine bakılır
        src = {k: v for k, v in plan_texts.extract(json.loads(source_file(plan_id).read_text())["itinerary"]).items() if not k.endswith(".name")}
    t0 = time.time()
    out, meta = call_claude(PROMPT_EN if lang == "en" else PROMPT_TR, src, model)
    clean, warn = check(lang, src, out)
    if lang == "tr-fix":
        fp = plan_texts.fingerprint({**src, **clean})
    path = plan_texts.layer_path(lang, plan_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"source": fp, "model": model, "strings": clean, "warnings": warn}, ensure_ascii=False, indent=1))
    u = meta.get("usage") or {}
    rec = {
        "plan": plan_id, "lang": lang, "model": model, "texts": len(src), "changed": len(clean),
        "chars": sum(len(v) for v in src.values()), "in": u.get("input_tokens", 0) + u.get("cache_creation_input_tokens", 0) + u.get("cache_read_input_tokens", 0), "out": u.get("output_tokens", 0),
        "usd_equiv": meta.get("total_cost_usd"), "sec": round(time.time() - t0, 1), "warnings": len(warn),
        "at": time.strftime("%Y-%m-%d %H:%M"),
    }
    with USAGE.open("a") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    return rec


def report() -> None:
    if not USAGE.exists():
        print("henüz kayıt yok")
        return
    rows = [json.loads(x) for x in USAGE.read_text().splitlines() if x.strip()]
    for lang in sorted({r["lang"] for r in rows}):
        rs = [r for r in rows if r["lang"] == lang]
        chars = sum(r["chars"] for r in rs)
        print(f"{lang}: {len(rs)} çağrı · {chars:,} karakter · girdi {sum(r['in'] for r in rs):,} tk · çıktı {sum(r['out'] for r in rs):,} tk · "
              f"API eşdeğeri ${sum(r['usd_equiv'] or 0 for r in rs):.2f} (abonelikte ödenmez) · {sum(r['sec'] for r in rs):.0f} sn")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=["en", "tr-fix"])
    ap.add_argument("--plans")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--jobs", type=int, default=1)
    ap.add_argument("--model", default="sonnet")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--report", action="store_true")
    a = ap.parse_args()
    if a.report:
        report()
        return 0
    if not a.lang:
        ap.error("--lang gerekli")
    ids = plan_ids(a.all, a.plans)[: a.limit or None]
    if not ids:
        ap.error("--plans ya da --all")

    def job(pid: str):
        try:
            r = run_one(pid, a.lang, a.model, a.force)
            if r.get("skipped"):
                print(f"= {pid} (güncel, atlandı)")
            else:
                print(f"✓ {pid}: {r['changed']}/{r['texts']} metin · {r['in']}+{r['out']} tk · {r['sec']} sn · uyarı {r['warnings']}")
        except Exception as e:  # tek plan düşerse diğerleri sürer; tekrar koşunca kaldığı yerden devam
            print(f"✗ {pid}: {e}", file=sys.stderr)

    with ThreadPoolExecutor(max_workers=max(1, a.jobs)) as ex:
        list(ex.map(job, ids))
    return 0


if __name__ == "__main__":
    sys.exit(main())
