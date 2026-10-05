#!/usr/bin/env python3
"""TripWalkers seçki listelerini (50 bar · 50 restoran · 50 UNESCO) /gezi/liste ve /gezi/mekan sayfalarına çevirir.

Kaynak : ../TripWalkers/TripWalkers/Resources/CuratedSpots.json (app'in kendi listesi)
Görsel : scripts/liste-gorseller.json — YALNIZ elle gözle onaylanmış açık lisanslı fotoğraflar (62).
         Onaysız mekân fotoğraf ALMAZ; kapak + bölge haritası alır (yanlış görsel riski sıfır).
Koord. : scripts/liste-koordinat.json — OpenStreetMap Nominatim karşılaştırması (sapma bayrağı).
Harita : scripts/geo/ne_50m_land.geojson + boundary_lines (Natural Earth, kamu malı) → public/gezi/harita/<slug>.svg
Çıktı  : src/data/liste/index.json
Koşum  : python3 scripts/build-liste-data.py
"""
import json
import math
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "TripWalkers" / "TripWalkers" / "Resources" / "CuratedSpots.json"
DESTS = ROOT.parent / "TripWalkers" / "Scripts" / "plan-pool" / "destinations.json"
GEZI_INDEX = ROOT / "src" / "data" / "gezi" / "index.json"
OUT = ROOT / "src" / "data" / "liste"
MAP_OUT = ROOT / "public" / "gezi" / "harita"
GEO = ROOT / "scripts" / "geo"

LIST_SLUG = {
    "fifty_best_bars_2025": "dunyanin-en-iyi-50-bari",
    "fifty_best_restaurants_2025": "dunyanin-en-iyi-50-restorani",
    "unesco_iconic": "unesco-ikonik-miraslar",
}
LIST_SLUG_EN = {
    "fifty_best_bars_2025": "worlds-50-best-bars",
    "fifty_best_restaurants_2025": "worlds-50-best-restaurants",
    "unesco_iconic": "unesco-world-heritage-icons",
}
LIST_KIND = {"fifty_best_bars_2025": "bar", "fifty_best_restaurants_2025": "restaurant", "unesco_iconic": "heritage"}
LIST_SOURCE = {
    "fifty_best_bars_2025": ("The World's 50 Best Bars 2025", "https://www.theworlds50best.com/bars/list/1-50"),
    "fifty_best_restaurants_2025": ("The World's 50 Best Restaurants 2025", "https://www.theworlds50best.com/list/1-50"),
    "unesco_iconic": ("UNESCO Dünya Mirası Listesi", "https://whc.unesco.org/en/list/"),
}

COUNTRY_TR = {
    "AE": "BAE", "AL": "Arnavutluk", "AR": "Arjantin", "AT": "Avusturya", "AU": "Avustralya", "BR": "Brezilya",
    "CL": "Şili", "CN": "Çin", "CO": "Kolombiya", "CZ": "Çekya", "DE": "Almanya", "DK": "Danimarka",
    "EC": "Ekvador", "EG": "Mısır", "ES": "İspanya", "ET": "Etiyopya", "FR": "Fransa", "GB": "Birleşik Krallık",
    "GR": "Yunanistan", "GT": "Guatemala", "HK": "Hong Kong", "HR": "Hırvatistan", "ID": "Endonezya",
    "IN": "Hindistan", "IT": "İtalya", "JO": "Ürdün", "JP": "Japonya", "KH": "Kamboçya", "KR": "Güney Kore",
    "MA": "Fas", "ML": "Mali", "MM": "Myanmar", "MX": "Meksika", "NO": "Norveç", "NP": "Nepal", "PE": "Peru",
    "PT": "Portekiz", "SE": "İsveç", "SG": "Singapur", "SK": "Slovakya", "TH": "Tayland", "TR": "Türkiye",
    "TZ": "Tanzanya", "US": "ABD", "VN": "Vietnam", "ZM": "Zambiya",
}
COUNTRY_EN = {
    "AE": "UAE", "AL": "Albania", "AR": "Argentina", "AT": "Austria", "AU": "Australia", "BR": "Brazil",
    "CL": "Chile", "CN": "China", "CO": "Colombia", "CZ": "Czechia", "DE": "Germany", "DK": "Denmark",
    "EC": "Ecuador", "EG": "Egypt", "ES": "Spain", "ET": "Ethiopia", "FR": "France", "GB": "United Kingdom",
    "GR": "Greece", "GT": "Guatemala", "HK": "Hong Kong", "HR": "Croatia", "ID": "Indonesia",
    "IN": "India", "IT": "Italy", "JO": "Jordan", "JP": "Japan", "KH": "Cambodia", "KR": "South Korea",
    "MA": "Morocco", "ML": "Mali", "MM": "Myanmar", "MX": "Mexico", "NO": "Norway", "NP": "Nepal", "PE": "Peru",
    "PT": "Portugal", "SE": "Sweden", "SG": "Singapore", "SK": "Slovakia", "TH": "Thailand", "TR": "Türkiye",
    "TZ": "Tanzania", "US": "USA", "VN": "Vietnam", "ZM": "Zambia",
}
# UNESCO mirasları: resmî İngilizce ad uzun/yabancı → Türkçe sayfada Türkçe ad, İngilizcede kısa ad (resmî ad schema'da kalır)
HERITAGE_TR = {
    1: "Machu Picchu", 2: "Petra", 3: "Angkor", 4: "Çin Seddi", 5: "Gize Piramitleri", 6: "Tac Mahal",
    7: "Atina Akropolisi", 8: "Roma Tarihî Merkezi", 9: "Stonehenge", 10: "Mont-Saint-Michel ve Körfezi",
    11: "Pompeii ve Herculaneum", 12: "Galápagos Adaları", 13: "Yellowstone Millî Parkı", 14: "Büyük Kanyon Millî Parkı",
    15: "Iguazú Millî Parkı", 16: "Büyük Set Resifi", 17: "Rapa Nui (Paskalya Adası)", 18: "Borobudur Tapınakları",
    19: "Antik Kyoto'nun Tarihî Anıtları", 20: "Versay Sarayı ve Parkı", 21: "Elhamra, Generalife ve Albayzín",
    22: "Antoni Gaudí'nin Eserleri", 23: "İstanbul'un Tarihî Alanları", 24: "Göreme Millî Parkı ve Kapadokya",
    25: "Hierapolis-Pamukkale", 26: "Efes", 27: "Bagan", 28: "Ha Long Körfezi", 29: "Plitvice Gölleri Millî Parkı",
    30: "Dubrovnik Eski Şehri", 31: "Salzburg Tarihî Merkezi", 32: "Prag Tarihî Merkezi", 33: "Venedik ve Lagünü",
    34: "Floransa Tarihî Merkezi", 35: "Sintra Kültürel Peyzajı", 36: "Lalibela Kaya Kiliseleri", 37: "Serengeti Millî Parkı",
    38: "Victoria Şelalesi", 39: "Djenné Eski Şehirleri", 40: "Marakeş Medinesi", 41: "Tarihî Kahire", 42: "Tikal Millî Parkı",
    43: "Chichén Itzá", 44: "Cusco Şehri", 45: "Sagarmatha (Everest) Millî Parkı", 46: "Khajuraho Anıtları",
    47: "Hampi Anıtları", 48: "Uluru-Kata Tjuta Millî Parkı", 49: "Sidney Opera Binası", 50: "Meteora",
}
HERITAGE_EN = {
    5: "Pyramids of Giza", 9: "Stonehenge and Avebury", 11: "Pompeii and Herculaneum",
    21: "Alhambra and Albayzín, Granada", 24: "Göreme and the Rock Sites of Cappadocia", 38: "Victoria Falls",
    43: "Chichén Itzá",
}

CITY_TR = {
    "Athens": "Atina", "Barcelona": "Barselona", "Copenhagen": "Kopenhag", "Florence": "Floransa",
    "Lisbon": "Lizbon", "London": "Londra", "Mexico City": "Meksiko", "Milan": "Milano", "Munich": "Münih",
    "Rome": "Roma", "Seoul": "Seul", "Singapore": "Singapur", "Stockholm": "Stokholm", "Vienna": "Viyana",
    "Sao Paulo": "São Paulo", "Sydney": "Sidney", "Istanbul": "İstanbul", "Venice": "Venedik", "Prague": "Prag",
    "Cairo": "Kahire", "Marrakesh": "Marakeş", "Guangzhou": "Guangzhou", "Beijing": "Pekin", "Cusco": "Cusco",
}

TR_MAP = str.maketrans({"ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g", "ü": "u", "Ü": "u",
                        "ö": "o", "Ö": "o", "ç": "c", "Ç": "c"})


def slugify(text: str) -> str:
    text = text.translate(TR_MAP)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def fold(text: str) -> str:
    return slugify(text).replace("-", " ")


def label_svg(label: str, cx: float, cy: float, W: int) -> str:
    """Noktanın yanına şehir adı (boş harita kapağında yer duygusu verir). SVG <img> olarak yüklenir → sistem serif yazısı."""
    if not label:
        return ""
    import html
    right = cx < W * 0.62
    x = cx + 22 if right else cx - 22
    return (f'<text x="{x:.0f}" y="{cy + 9:.0f}" text-anchor="{"start" if right else "end"}" '
            f'style="font:400 28px Georgia,\'Times New Roman\',serif;fill:#171717;paint-order:stroke;stroke:#f6f2ea;stroke-width:6px" '
            f'class="t">{html.escape(label)}</text>')


# ---------- harita (Natural Earth → küçük bölge SVG'si) ----------

def load_geo():
    land = json.loads((GEO / "ne_50m_land.geojson").read_text())
    lines = json.loads((GEO / "ne_50m_boundary_lines_land.geojson").read_text())
    polys, borders = [], []
    for f in land["features"]:
        g = f["geometry"]
        rings = g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p]
        for r in rings:
            xs = [p[0] for p in r]; ys = [p[1] for p in r]
            polys.append((min(xs), min(ys), max(xs), max(ys), r))
    for f in lines["features"]:
        g = f["geometry"]
        segs = [g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]
        for s in segs:
            xs = [p[0] for p in s]; ys = [p[1] for p in s]
            borders.append((min(xs), min(ys), max(xs), max(ys), s))
    return polys, borders


def map_svg(lat: float, lng: float, polys, borders, span_lat: float = 9.0, label: str = "") -> str:
    W, H = 640, 400
    k = math.cos(math.radians(lat))
    span_lng = span_lat * (W / H) / max(k, 0.2)
    x0, x1 = lng - span_lng / 2, lng + span_lng / 2
    y0, y1 = lat - span_lat / 2, lat + span_lat / 2

    def px(p):
        return ((p[0] - x0) / (x1 - x0) * W, (y1 - p[1]) / (y1 - y0) * H)

    def path(coords, close):
        out, last = [], None
        for p in coords:
            x, y = px(p)
            # görünen alanın dışı kenara sabitlenir → art arda gelen aynı noktalar aşağıda elenir
            x, y = min(max(x, -20), W + 20), min(max(y, -20), H + 20)
            if last and abs(x - last[0]) < 2.5 and abs(y - last[1]) < 2.5:
                continue
            out.append(f"{x:.0f} {y:.0f}")
            last = (x, y)
        if len(out) < 2:
            return ""
        return "M" + "L".join(out) + ("Z" if close else "")

    hit = lambda b: not (b[2] < x0 or b[0] > x1 or b[3] < y0 or b[1] > y1)
    # kıyı/sınır çizgisi görünmeyen yakın ölçek (iç kesim şehri) boş krem kutu olur → geniş ölçeğe dön
    inside = sum(1 for r in polys if hit(r) for p in r[4] if x0 < p[0] < x1 and y0 < p[1] < y1)
    inside += sum(1 for r in borders if hit(r) for p in r[4] if x0 < p[0] < x1 and y0 < p[1] < y1)
    if inside < 25 and span_lat < 9.0:
        return map_svg(lat, lng, polys, borders, 9.0, label)
    land_d = "".join(path(r[4], True) for r in polys if hit(r))
    border_d = "".join(path(s[4], False) for s in borders if hit(s))
    cx, cy = px((lng, lat))
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img">
<style>.sea{{fill:#d9e2e4}}.land{{fill:#f6f2ea;stroke:#b9b1a3;stroke-width:1}}.b{{fill:none;stroke:#b9b1a3;stroke-width:.8;stroke-dasharray:3 3}}.h{{fill:#f25623;opacity:.18}}.d{{fill:#f25623;stroke:#fff;stroke-width:3}}.t{{}}
@media (prefers-color-scheme:dark){{.sea{{fill:#14191b}}.land{{fill:#2a2824;stroke:#45413b}}.b{{stroke:#3a3733}}.d{{stroke:#121110}}.h{{fill:#ff6a3d}}.t{{fill:#f2efe9!important;stroke:#2a2824!important}}}}</style>
<rect class="sea" width="{W}" height="{H}"/><path class="land" d="{land_d}"/><path class="b" d="{border_d}"/>
<circle class="h" cx="{cx:.1f}" cy="{cy:.1f}" r="26"/><circle class="d" cx="{cx:.1f}" cy="{cy:.1f}" r="9"/>{label_svg(label, cx, cy, W)}</svg>"""


def main() -> int:
    src = json.loads(SRC.read_text())
    photos = json.loads((ROOT / "scripts" / "liste-gorseller.json").read_text())
    coords = json.loads((ROOT / "scripts" / "liste-koordinat.json").read_text())
    fixes = json.loads((ROOT / "scripts" / "liste-duzeltme.json").read_text())
    gezi = json.loads(GEZI_INDEX.read_text())
    dests = json.loads(DESTS.read_text())

    # İngilizce şehir adı → bizim /gezi şehir kaydı (alias üzerinden)
    by_alias = {}
    for d in dests:
        for a in d.get("aliases", []) + [d["dest_key"].replace("-", " ")]:
            by_alias[fold(a)] = d["dest_key"]
    gezi_by_key = {c["destKey"]: c for c in gezi}

    polys, borders = load_geo()
    MAP_OUT.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    lists, spots, seen = [], [], set()
    for l in src["lists"]:
        lid = l["id"]
        items = []
        for s in l["spots"]:
            key = f"{lid}#{s['rank']}"
            slug = slugify(f"{s['name']} {s['city']}")[:80]
            if slug in seen:
                slug = f"{slug}-{s['rank']}"
            seen.add(slug)
            chk = coords.get(key) or {}
            # OSM'nin mekânın kendisini bulduğu ve bizim kaydın kaydığı 6 yer elle onaylandı ("use": true)
            lat, lng = (chk["lat"], chk["lng"]) if chk.get("use") else (s["lat"], s["lng"])
            dest_key = by_alias.get(fold(s["city"]))
            city_plan = gezi_by_key.get(dest_key) if dest_key else None
            # bar/restoran şehir içinde → yakın ölçek (≈ 4° enlem); miras bölgesel → geniş (9°)
            (MAP_OUT / f"{slug}.svg").write_text(map_svg(lat, lng, polys, borders, 9.0 if lid == "unesco_iconic" else 4.0, s["city"]))
            spot = {
                "slug": slug, "listId": lid, "listSlug": LIST_SLUG[lid], "kind": LIST_KIND[lid], "rank": s["rank"],
                "name": s["name"], "city": s["city"], "cityTr": CITY_TR.get(s["city"], s["city"]),
                "country": COUNTRY_TR.get(s["country_code"], s["country_code"]), "countryCode": s["country_code"],
                "address": s["address"], "lat": lat, "lng": lng,
                "geoDriftKm": 0 if chk.get("use") else chk.get("km"), "geoChecked": chk.get("km") is not None, "geoFixed": bool(chk.get("use")),
                "why": s["why_famous_tr"], "signature": s["signature_tr"], "tip": s["tip_tr"],
                "countryEn": COUNTRY_EN.get(s["country_code"], s["country_code"]),
                "whyEn": s["why_famous_en"], "signatureEn": s["signature_en"], "tipEn": s["tip_en"],
                "photo": photos.get(key), "map": f"/gezi/harita/{slug}.svg",
                "cityPlan": {
                    "destKey": city_plan["destKey"], "city": city_plan["city"], "cityEn": city_plan["cityEn"], "slug": city_plan["seasons"][0]["slug"],
                    "enSlug": next((x["enSlug"] for x in city_plan["seasons"] if x["hasEn"]), None),
                } if city_plan and city_plan["seasons"] else None,
            }
            heritage = lid == "unesco_iconic"
            spot["nameTr"] = HERITAGE_TR.get(s["rank"], s["name"]) if heritage else s["name"]
            spot["nameEn"] = HERITAGE_EN.get(s["rank"], s["name"]) if heritage else s["name"]
            spot.update({k: v for k, v in fixes.get(key, {}).items() if not k.startswith("_")})
            spots.append(spot)
            items.append(slug)
        lists.append({
            "id": lid, "slug": LIST_SLUG[lid], "slugEn": LIST_SLUG_EN[lid], "kind": LIST_KIND[lid], "title": l["title_tr"], "titleEn": l["title_en"],
            "year": l.get("year"), "source": {"name": LIST_SOURCE[lid][0], "url": LIST_SOURCE[lid][1]},
            "sourceEn": "UNESCO World Heritage List" if lid == "unesco_iconic" else LIST_SOURCE[lid][0], "spots": items,
        })

    (OUT / "index.json").write_text(json.dumps({"lists": lists, "spots": spots}, ensure_ascii=False, indent=1))
    withPhoto = sum(1 for s in spots if s["photo"])
    linked = sum(1 for s in spots if s["cityPlan"])
    drift = [s for s in spots if (s["geoDriftKm"] or 0) > 2]
    print(f"{len(lists)} liste · {len(spots)} mekân · fotoğraflı {withPhoto} · şehir planına bağlı {linked} · 2 km üstü sapma {len(drift)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
