#!/usr/bin/env python3
"""Ürün tanıtım sayfası üretici (BlokBom!, Lingoria).

Kullanım:  python3 scripts/landing-common/build.py blokbom   (veya lingoria, ya da ikisi)
Kaynak:    scripts/<app>-site/page.html  ({{anahtar}} yer tutucuları)
           scripts/<app>-site/strings.py (META + EN + TR sözlükleri)
           scripts/<app>-site/theme.css + hero.js, scripts/landing-common/base.css + common.js
Çıktı:     public/<app>-site/index.html (EN) + index-tr.html (TR) + style.css + main.js + hero.js
Eksik ya da fazla anahtar varsa durur — yarım çeviri yayına çıkmaz.
"""
import json
import re
import runpy
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COMMON = ROOT / "scripts" / "landing-common"
SITE = "https://corvus-tech.co"


def head(meta, L, lang, app):
    path = {"en": f"/en/work/{app}", "tr": f"/tr/work/{app}"}
    url = SITE + path[lang]
    ld = {
        "@context": "https://schema.org", "@type": "SoftwareApplication", "name": meta["name"],
        "applicationCategory": meta["category"], "operatingSystem": "iOS", "description": L["meta_desc"],
        "url": url, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "installUrl": meta["store"], "author": {"@type": "Organization", "name": "Corvus Tech", "url": SITE},
    }
    esc = lambda s: s.replace("&", "&amp;").replace('"', "&quot;")
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="{meta['theme']}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{SITE}{path['en']}">
<link rel="alternate" hreflang="tr" href="{SITE}{path['tr']}">
<link rel="alternate" hreflang="x-default" href="{SITE}{path['en']}">
<link rel="icon" href="/{app}-site/img/icon.webp" type="image/webp">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Corvus Tech">
<meta property="og:locale" content="{'tr_TR' if lang == 'tr' else 'en_US'}">
<meta property="og:title" content="{esc(L['og_title'])}">
<meta property="og:description" content="{esc(L['meta_desc'])}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
<meta name="apple-itunes-app" content="app-id={meta['app_id']}">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<script defer src="/_vercel/insights/script.js"></script>
<title>{esc(L['title'])}</title>
<meta name="description" content="{esc(L['meta_desc'])}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{meta['fonts']}" rel="stylesheet">
<link rel="stylesheet" href="/{app}-site/style.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
"""


def build(app):
    src = ROOT / "scripts" / f"{app}-site"
    out = ROOT / "public" / f"{app}-site"
    s = runpy.run_path(str(src / "strings.py"))
    meta, langs = s["META"], {"en": s["EN"], "tr": s["TR"]}
    if set(langs["en"]) != set(langs["tr"]):
        sys.exit(f"{app}: EN/TR anahtar farkı: {sorted(set(langs['en']) ^ set(langs['tr']))}")
    page = (src / "page.html").read_text()
    used = set(re.findall(r"\{\{(\w+)\}\}", page))
    for lang, L in langs.items():
        L = {**L, **(s["extra"](lang) if "extra" in s else {}), "lang": lang, "store": meta["store"], "work_url": f"/{lang}/work",
             "other_url": f"/{'tr' if lang == 'en' else 'en'}/work/{app}", "app": app}
        missing = used - set(L)
        if missing:
            sys.exit(f"{app}/{lang}: eksik anahtar {sorted(missing)}")
        body = re.sub(r"\{\{(\w+)\}\}", lambda m: L[m.group(1)], page)
        tail = f'\n<script src="/{app}-site/vendor/gsap.min.js"></script>\n<script src="/{app}-site/vendor/ScrollTrigger.min.js"></script>\n<script src="/{app}-site/vendor/lenis.min.js"></script>\n<script src="/{app}-site/hero.js"></script>\n<script src="/{app}-site/main.js"></script>\n</body>\n</html>\n'
        name = "index.html" if lang == "en" else "index-tr.html"
        (out / name).write_text(head(meta, L, lang, app) + body + tail)
    unused = set(langs["en"]) - used - {"title", "og_title", "meta_desc"}
    if unused:
        print(f"  uyarı — kullanılmayan anahtar: {sorted(unused)}")
    (out / "style.css").write_text((COMMON / "base.css").read_text() + "\n" + (src / "theme.css").read_text())
    (out / "main.js").write_text((COMMON / "common.js").read_text())
    (out / "hero.js").write_text((src / "hero.js").read_text())
    print(f"✓ {app}: {out.relative_to(ROOT)}/index.html + index-tr.html")


if __name__ == "__main__":
    for a in sys.argv[1:] or ["blokbom", "lingoria"]:
        build(a)
