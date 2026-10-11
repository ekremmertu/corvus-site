"""scratchpad/site (artifact sürümü, EN) → corvus-site/public/tripwalkers-site/{index,index-tr}.html."""
import sys, json, shutil, os, glob, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tr import to_tr

S, D = sys.argv[1], sys.argv[2]
os.makedirs(D + '/img', exist_ok=True)
for f in ('style.css', 'main.js', 'route.js'):
    shutil.copy(f'{S}/{f}', f'{D}/{f}')
for f in glob.glob(f'{S}/img/*.webp'):
    if not f.endswith('onboarding.webp'):
        shutil.copy(f, D + '/img/')

P = '/tripwalkers-site/'
SITE = 'https://corvus-tech.co'
META = {
    'en': dict(title='TripWalkers · AI trip planner for iPhone · Corvus Tech',
               desc='Pick a city and your dates. TripWalkers writes a day-by-day trip you can actually walk: every stop on the map, every walk timed, your friends on the same page.',
               og='TripWalkers · Your trip, planned. Now go walk it.', ogloc='en_US', og_img='og.jpg'),
    'tr': dict(title="TripWalkers · iPhone için yapay zekâ gezi planlayıcı · Corvus Tech",
               desc='Şehrini ve tarihlerini seç. TripWalkers gün gün, gerçekten yürünebilir bir plan yazar: her durak haritada, her yürüyüşün süresi belli, arkadaşların aynı planda.',
               og='TripWalkers · Gezin planlandı. Sıra yürümekte.', ogloc='tr_TR', og_img='og-tr.jpg'),
}


def build(src: str, lang: str) -> str:
    s = src
    s = s.replace('href="style.css"', f'href="{P}style.css"').replace('src="img/', f'src="{P}img/')
    for cdn, loc in (('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'gsap.min.js'),
                     ('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', 'ScrollTrigger.min.js'),
                     ('https://unpkg.com/lenis@1.1.13/dist/lenis.min.js', 'lenis.min.js')):
        assert cdn in s
        s = s.replace(cdn, f'{P}vendor/{loc}')
    s = s.replace('src="route.js"', f'src="{P}route.js"').replace('src="main.js"', f'src="{P}main.js"')
    s = s.replace(f'href="{SITE}/', 'href="/')  # same-site links stay relative
    m = META[lang]
    url = f'{SITE}/{lang}/work/tripwalkers'
    s = s.replace('<title>TripWalkers</title>', f'<title>{m["title"]}</title>')
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{m["desc"]}">', s, count=1)
    ld = {"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "TripWalkers",
          "applicationCategory": "TravelApplication", "operatingSystem": "iOS", "description": m['desc'], "url": url,
          "installUrl": "https://apps.apple.com/app/id6764424121", "inLanguage": ["en", "tr"],
          "author": {"@type": "Organization", "name": "Corvus Tech", "url": SITE}}
    og = f'{SITE}{P}img/{m["og_img"]}'
    head = f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b0a09">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{SITE}/en/work/tripwalkers">
<link rel="alternate" hreflang="tr" href="{SITE}/tr/work/tripwalkers">
<link rel="alternate" hreflang="x-default" href="{SITE}/en/work/tripwalkers">
<link rel="icon" href="{P}img/rc-happy.webp" type="image/webp">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Corvus Tech">
<meta property="og:locale" content="{m['ogloc']}">
<meta property="og:title" content="{m['og']}">
<meta property="og:description" content="{m['desc']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{og}">
<meta name="apple-itunes-app" content="app-id=6764424121">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<script defer src="/_vercel/insights/script.js"></script>
'''
    js = "<script>document.documentElement.classList.add('js')</script>\n"
    assert js in s
    s = head + s.replace(js, js + '</head>\n<body>\n', 1) + '</body>\n</html>\n'
    assert 'href="#"' not in s
    return s


src = open(f'{S}/index.html').read()
open(D + '/index.html', 'w').write(build(src, 'en'))
open(D + '/index-tr.html', 'w').write(build(to_tr(src), 'tr'))
print('ok en+tr')
