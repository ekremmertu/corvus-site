#!/usr/bin/env python3
"""TripWalkers plan havuzunu /gezi sayfalarının okuyacağı JSON'a çevirir.

Kaynak: ../TripWalkers/Scripts/plan-pool/{plans,plans_v2}/<dest>-<season>-tr.json
plans_v2 (gerçek sistem promptuyla üretilmiş, daha kaliteli) varsa onu, yoksa v1'i alır.
Çıktı: src/data/gezi/plans/<slug>.json + src/data/gezi/index.json
Koşum: python3 scripts/build-gezi-data.py
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import plan_texts

ROOT = Path(__file__).resolve().parent.parent
POOL = ROOT.parent / "TripWalkers" / "Scripts" / "plan-pool"
OUT = ROOT / "src" / "data" / "gezi"

COUNTRY_TR = {
    "bangkok": "Tayland", "hong-kong": "Hong Kong", "london": "Birleşik Krallık", "dubai": "BAE",
    "paris": "Fransa", "kuala-lumpur": "Malezya", "singapore": "Singapur", "new-york": "ABD",
    "delhi": "Hindistan", "mumbai": "Hindistan", "phuket": "Tayland", "rome": "İtalya",
    "tokyo": "Japonya", "taipei": "Tayvan", "prague": "Çekya", "seoul": "Güney Kore",
    "amsterdam": "Hollanda", "miami": "ABD", "osaka": "Japonya", "los-angeles": "ABD",
    "shanghai": "Çin", "ho-chi-minh-city": "Vietnam", "bali": "Endonezya", "barcelona": "İspanya",
    "las-vegas": "ABD", "milan": "İtalya", "vienna": "Avusturya", "jaipur": "Hindistan",
    "cancun": "Meksika", "berlin": "Almanya", "cairo": "Mısır", "athens": "Yunanistan",
    "orlando": "ABD", "moscow": "Rusya", "venice": "İtalya", "madrid": "İspanya",
    "dublin": "İrlanda", "florence": "İtalya", "hanoi": "Vietnam", "toronto": "Kanada",
    "sydney": "Avustralya", "munich": "Almanya", "beijing": "Çin", "saint-petersburg": "Rusya",
    "brussels": "Belçika", "jerusalem": "İsrail", "budapest": "Macaristan", "lisbon": "Portekiz",
    "crete": "Yunanistan", "kyoto": "Japonya", "vancouver": "Kanada", "chiang-mai": "Tayland",
    "copenhagen": "Danimarka", "san-francisco": "ABD", "melbourne": "Avustralya", "krakow": "Polonya",
    "marrakech": "Fas", "auckland": "Yeni Zelanda", "tel-aviv": "İsrail", "honolulu": "ABD",
    "warsaw": "Polonya", "buenos-aires": "Arjantin", "frankfurt": "Almanya", "stockholm": "İsveç",
    "lima": "Peru", "da-nang": "Vietnam", "nice": "Fransa", "abu-dhabi": "BAE",
    "porto": "Portekiz", "rhodes": "Yunanistan", "rio-de-janeiro": "Brezilya", "krabi": "Tayland",
    "tbilisi": "Gürcistan", "sao-paulo": "Brezilya", "edinburgh": "Birleşik Krallık",
    "seville": "İspanya", "santorini": "Yunanistan", "mykonos": "Yunanistan", "baku": "Azerbaycan",
    "sharm-el-sheikh": "Mısır",
}

SEASON_SLUG = {"summer": "yaz", "other": "ekim-mayis"}
SEASON_SLUG_EN = {"summer": "summer", "other": "october-may"}
SEASON_LABEL_EN = {"summer": "June–September", "other": "October–May"}

# İngilizce şehir adı: Türkçe adı olan dünya şehirleri + Türkiye şehirleri (dest_key'den türetilemeyenler)
CITY_EN = {
    "istanbul": "Istanbul", "kapadokya": "Cappadocia", "cesme": "Çeşme", "alacati": "Alaçatı", "kas": "Kaş",
    "datca": "Datça", "ayvalik": "Ayvalık", "buyukada": "Büyükada", "eskisehir": "Eskişehir", "izmir": "Izmir",
    "ho-chi-minh-city": "Ho Chi Minh City", "rio-de-janeiro": "Rio de Janeiro", "sao-paulo": "São Paulo",
    "saint-petersburg": "Saint Petersburg", "sharm-el-sheikh": "Sharm El Sheikh", "crete": "Crete (Heraklion)",
    "cancun": "Cancún", "munich": "Munich", "kuala-lumpur": "Kuala Lumpur", "tel-aviv": "Tel Aviv",
}
COUNTRY_EN = {
    "Türkiye": "Türkiye", "Tayland": "Thailand", "Hong Kong": "Hong Kong", "Birleşik Krallık": "United Kingdom",
    "BAE": "UAE", "Fransa": "France", "Malezya": "Malaysia", "Singapur": "Singapore", "ABD": "USA",
    "Hindistan": "India", "İtalya": "Italy", "Japonya": "Japan", "Tayvan": "Taiwan", "Çekya": "Czechia",
    "Güney Kore": "South Korea", "Hollanda": "Netherlands", "Çin": "China", "Vietnam": "Vietnam",
    "Endonezya": "Indonesia", "İspanya": "Spain", "Avusturya": "Austria", "Meksika": "Mexico", "Almanya": "Germany",
    "Mısır": "Egypt", "Yunanistan": "Greece", "Rusya": "Russia", "İrlanda": "Ireland", "Kanada": "Canada",
    "Avustralya": "Australia", "Belçika": "Belgium", "İsrail": "Israel", "Macaristan": "Hungary",
    "Portekiz": "Portugal", "Danimarka": "Denmark", "Polonya": "Poland", "Fas": "Morocco",
    "Yeni Zelanda": "New Zealand", "Arjantin": "Argentina", "İsveç": "Sweden", "Peru": "Peru",
    "Brezilya": "Brazil", "Gürcistan": "Georgia", "Azerbaycan": "Azerbaijan",
}


def city_en(key: str) -> str:
    return CITY_EN.get(key) or " ".join(w.capitalize() for w in key.split("-"))


SEASON_LABEL = {"summer": "Haziran–Eylül", "other": "Ekim–Mayıs"}

TR_MAP = str.maketrans({"ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g",
                        "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c"})


def slugify(text: str) -> str:
    text = text.translate(TR_MAP)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def city_name(display_name: str) -> str:
    name = display_name.split(",")[0].strip()
    return re.sub(r"\s*\(.*?\)", "", name).strip()


def slim_stop(s: dict, lang: str = "tr") -> dict:
    out = {
        "name": s["name"],
        "category": s.get("category", "culture"),
        "start": s.get("start_time", ""),
        "end": s.get("end_time", ""),
        "cost": s.get("estimated_cost", 0) or 0,
        "tips": s.get("tips", ""),
    }
    if s.get("booking_url"):
        out["bookingUrl"] = s["booking_url"]
        out["bookingProvider"] = s.get("booking_provider") or ("Rezervasyon" if lang == "tr" else "Booking")
    return out


def main() -> int:
    dests = json.loads((POOL / "destinations.json").read_text())
    index = []
    for sub in ("plans", "plans-en"):
        OUT.joinpath(sub).mkdir(parents=True, exist_ok=True)
        for old in OUT.joinpath(sub).glob("*.json"):
            old.unlink()
    report = {"trFixed": 0, "en": 0, "enStale": []}

    for d in dests:
        key = d["dest_key"]
        is_tr = d["country"] == "TR"
        city = city_name(d["display_name"])
        region = d["display_name"].split(",")[1].strip() if is_tr and "," in d["display_name"] else None
        country = "Türkiye" if is_tr else COUNTRY_TR.get(key)
        if not country:
            print(f"ülke eksik: {key}", file=sys.stderr)
            return 1
        city_slug = slugify(city)
        seasons = []
        for season in ("summer", "other"):
            v2 = POOL / "plans_v2" / f"{key}-{season}-tr.json"
            v1 = POOL / "plans" / f"{key}-{season}-tr.json"
            src = v2 if v2.exists() else v1
            if not src.exists():
                continue
            raw = json.loads(src.read_text())
            plan_id = f"{key}-{season}"
            it = raw["itinerary"]
            # Türkçe üslup katmanı (varsa) yayından önce uygulanır; çeviri bu düzeltilmiş metinden yapılır.
            fix = plan_texts.load_layer("tr-fix", plan_id)
            if fix:
                it = plan_texts.apply(it, fix["strings"])
                report["trFixed"] += 1
            slug = f"{city_slug}-{SEASON_SLUG[season]}"
            en_slug = f"{slugify(city_en(key))}-{SEASON_SLUG_EN[season]}"
            quality = "v2" if src == v2 else "v1"

            def build(itin: dict, lang: str) -> dict:
                days = [{
                    "index": day["day_index"],
                    "type": day.get("day_type", "cityCenter"),
                    "theme": day.get("theme", ""),
                    "stops": [slim_stop(x, lang) for x in day.get("stops", [])],
                    "backups": [slim_stop(x, lang) for x in day.get("backup_stops", []) or []],
                } for day in itin["days"]]
                en = lang == "en"
                return {
                    "lang": lang,
                    "slug": en_slug if en else slug,
                    "altSlug": slug if en else en_slug,
                    "citySlug": city_slug,
                    "destKey": key,
                    "city": city_en(key) if en else city,
                    "region": region,
                    "country": COUNTRY_EN.get(country, country) if en else country,
                    "isTurkey": is_tr,
                    "coastal": d.get("coastal", False),
                    "season": season,
                    "seasonSlug": SEASON_SLUG_EN[season] if en else SEASON_SLUG[season],
                    "seasonLabel": SEASON_LABEL_EN[season] if en else SEASON_LABEL[season],
                    "currency": itin.get("currency", d.get("currency", "TRY")),
                    "totalDays": itin.get("total_days", len(days)),
                    "quality": quality,
                    "budget": itin.get("budget_breakdown", {}),
                    "notes": itin.get("cultural_notes", []),
                    "niche": itin.get("niche_experience"),
                    "transit": itin.get("transit_card"),
                    "days": days,
                }

            plan = build(it, "tr")
            days = plan["days"]
            en_layer = plan_texts.load_layer("en", plan_id)
            has_en = False
            if en_layer:
                src_strings = plan_texts.extract(it)
                missing = [k for k in src_strings if k not in en_layer["strings"]]
                if en_layer.get("source") != plan_texts.fingerprint(src_strings):
                    report["enStale"].append(plan_id)
                if missing:
                    print(f"çeviri eksik ({plan_id}): {len(missing)} metin — EN sayfa üretilmedi", file=sys.stderr)
                else:
                    en_plan = build(plan_texts.apply(it, en_layer["strings"]), "en")
                    (OUT / "plans-en" / f"{en_slug}.json").write_text(json.dumps(en_plan, ensure_ascii=False, indent=1))
                    has_en = True
                    report["en"] += 1
            plan["altSlug"] = en_slug if has_en else None
            (OUT / "plans" / f"{slug}.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1))
            stops = sum(len(x["stops"]) for x in days)
            seasons.append({"season": season, "slug": slug, "enSlug": en_slug, "hasEn": has_en,
                            "firstThemeEn": en_plan["days"][0]["theme"] if has_en and en_plan["days"] else "",
                            "seasonLabelEn": SEASON_LABEL_EN[season], "seasonSlug": SEASON_SLUG[season],
                            "seasonLabel": SEASON_LABEL[season], "stops": stops,
                            "quality": plan["quality"], "firstTheme": days[0]["theme"] if days else ""})
        index.append({"destKey": key, "city": city, "cityEn": city_en(key), "countryEn": COUNTRY_EN.get(country, country),
                      "citySlug": city_slug, "region": region,
                      "country": country, "isTurkey": is_tr, "coastal": d.get("coastal", False),
                      "rank": d.get("rank"), "seasons": seasons})

    slugs = [s["slug"] for c in index for s in c["seasons"]]
    if len(slugs) != len(set(slugs)):
        print("slug çakışması", file=sys.stderr)
        return 1
    (OUT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1))
    v2 = sum(1 for c in index for s in c["seasons"] if s["quality"] == "v2")
    print(f"{len(index)} şehir · {len(slugs)} sayfa · v2 {v2} · v1 {len(slugs) - v2} · "
          f"TR düzeltilmiş {report['trFixed']} · EN {report['en']} · EN bayat {len(report['enStale'])}")
    if report["enStale"]:
        print("  bayat EN (Türkçe sonradan değişti, yeniden çevir): " + ", ".join(report["enStale"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
