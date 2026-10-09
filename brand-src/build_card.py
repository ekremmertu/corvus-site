#!/usr/bin/env python3
"""
Corvus Tech kartvizit üretici — tek komut: `python3 brand-src/build_card.py`

Ne üretir (brand-src/Kartvizit/, gitignore'da):
  A-on-yuz.png … C-arka-yuz.png   ekran/paylaşım PNG'leri (4080×2640, 1200 dpi)
  kartvizit-A.pdf / -B.pdf / -C.pdf matbaa dosyası: 91×61 mm (85×55 + 3 mm taşma), sayfa 1 ön, sayfa 2 arka
  kartvizit-onizleme.html          ekranda bakılacak sayfa (telefon gerçek)

Gereksinim: Google Chrome (headless), PIL, internet (Google Fonts + QR kütüphanesi CDN'den).
Telefon: `CORVUS_CARD_PHONE` ortam değişkeni (~/.secrets/corvus-card.env). Boşsa yer tutucu basılır.
Tasarımı değiştirmek = aşağıdaki CSS/HTML'i düzenlemek; matbaa değerleri (mm) sabit.
"""
import base64, html, json, os, re, subprocess, sys, tempfile, http.server, threading, functools
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "brand-src" / "Kartvizit"
OUT.mkdir(exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PHONE = os.environ.get("CORVUS_CARD_PHONE", "").strip() or "+90 5•• ••• •• ••"
# QR'a kişi kartı (vCard 3.0) gömülü: telefon okutunca "Kişi ekle" der, internet gerekmez.
# Kısa tutuldu (her karakter QR'ı sıklaştırır). Yer tutucu numara QR'a girmez.
_tel = f"TEL;TYPE=CELL:{PHONE}\n" if "•" not in PHONE else ""
QR_TEXT = ("BEGIN:VCARD\nVERSION:3.0\nN:UĞUR;Ekrem Mert\nFN:Ekrem Mert UĞUR\nORG:Corvus Tech\nTITLE:Co-Founder\n"
           f"{_tel}EMAIL:corvustech.co@outlook.com\nURL:https://corvus-tech.co\n"
           "ADR:;;;İstanbul;;;Türkiye\nEND:VCARD")  # LinkedIn kartta basılı, QR'ı sıklaştırmamak için gömülmedi

# --- kaynaklar --------------------------------------------------------------
src = (ROOT / "src/components/fx/corvusAscii.ts").read_text()
ASCII = "\n".join(l.replace("\\\\", "\\").replace('\\"', '"')
                  for l in re.findall(r'^\s*"(.*)",?\s*$', src, re.M))
b64 = lambda p: base64.b64encode((ROOT / "public/brand" / p).read_bytes()).decode()
LOGO, MARK = b64("corvus-logo.png"), b64("corvus-mark.png")

CSS = """
:root{--ink:#05060a;--paper:#fff;--blue:#5b8cff;--blue-deep:#2f5fd6;--dim:#9aa2b8;--faint:#5c6479;
 --p-ink:#0a0c14;--p-mute:#6a7185;--p-rule:#e3e7f0;--mm:MMUNIT;
 --mono:"JetBrains Mono",ui-monospace,Menlo,monospace;--disp:"Archivo","Inter",system-ui,sans-serif;--body:"Inter",system-ui,sans-serif}
*{box-sizing:border-box}
body{margin:0;background:#12141c;font-family:var(--body)}
/* .sheet = taşma payı dahil alan (91×61). .card = kesim alanı (85×55), kesim payı içinde ortalı. */
.sheet{position:relative;width:calc(91*var(--mm));height:calc(61*var(--mm));overflow:hidden}
.card{position:absolute;left:calc(3*var(--mm));top:calc(3*var(--mm));width:calc(85*var(--mm));height:calc(55*var(--mm))}
.sheet.dark{background:var(--ink);color:#f4f6fb}.sheet.light{background:var(--paper);color:var(--p-ink)}
.raven{position:absolute;right:calc(-6*var(--mm));top:calc(1*var(--mm));margin:0;font-family:var(--mono);font-size:calc(1.02*var(--mm));line-height:1.09;letter-spacing:0;color:var(--blue);opacity:.85;white-space:pre;
 -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 22%);mask-image:linear-gradient(90deg,transparent 0,#000 22%)}
.raven.soft{opacity:.10;right:calc(-10*var(--mm));top:calc(-2*var(--mm));font-size:calc(1.35*var(--mm))}
.light .raven{opacity:.95}
.term{position:absolute;left:calc(6*var(--mm));top:calc(6*var(--mm));font-family:var(--mono);font-size:calc(2.3*var(--mm));line-height:1.55;color:var(--blue)}
.term .c{color:var(--faint)}.term .w{color:#f4f6fb}
.term .cur{display:inline-block;width:calc(1.3*var(--mm));height:calc(2.4*var(--mm));background:var(--blue);vertical-align:-2px;margin-left:2px}
.light .term{color:var(--blue-deep)}.light .term .c{color:var(--p-mute)}.light .term .w{color:var(--p-ink)}.light .term .cur{background:var(--blue-deep)}
.term-url{position:absolute;left:calc(6*var(--mm));bottom:calc(5.5*var(--mm));font-family:var(--mono);font-size:calc(2.4*var(--mm));font-weight:700;color:#f4f6fb;letter-spacing:.02em}
.term-url b{color:var(--blue)}.light .term-url{color:var(--p-ink)}
.who{position:absolute;left:calc(6*var(--mm));top:calc(6*var(--mm));right:calc(33*var(--mm))}
.name{font-family:var(--disp);font-weight:800;font-size:calc(3.6*var(--mm));line-height:1.05;letter-spacing:-.01em;margin:0}
.role{font-family:var(--mono);font-size:calc(2.05*var(--mm));margin:calc(1.4*var(--mm)) 0 0;color:var(--blue);letter-spacing:.04em}
.role span{color:var(--dim)}.light .role span{color:var(--p-mute)}
.contacts{position:absolute;left:calc(6*var(--mm));bottom:calc(5.5*var(--mm));right:calc(33*var(--mm));list-style:none;margin:0;padding:0;display:grid;gap:calc(1.15*var(--mm));font-size:calc(2.25*var(--mm));line-height:1.2;font-weight:500}
.contacts li{display:grid;grid-template-columns:calc(7*var(--mm)) 1fr;align-items:baseline}
.contacts .k{font-family:var(--mono);font-size:calc(1.75*var(--mm));letter-spacing:.06em;color:var(--faint)}.light .contacts .k{color:var(--p-mute)}
.dark .contacts{color:#e6e9f2}.contacts .v{font-variant-numeric:tabular-nums}
.qr{position:absolute;right:calc(6*var(--mm));top:50%;transform:translateY(-50%);width:calc(24*var(--mm));height:calc(24*var(--mm));padding:calc(1.6*var(--mm));background:#fff;border-radius:calc(1.2*var(--mm))}
.light .qr{padding:0;background:transparent}
.qr svg{width:100%;height:100%;display:block}
.qr-cap{position:absolute;right:calc(6*var(--mm));width:calc(24*var(--mm));bottom:calc(4*var(--mm));text-align:center;font-family:var(--mono);font-size:calc(1.35*var(--mm));letter-spacing:.08em;color:var(--faint)}
.light .qr-cap{color:var(--p-mute)}
.logo{position:absolute;inset:0;display:grid;place-items:center}.logo img{width:calc(34*var(--mm));height:auto}
.tag{position:absolute;left:0;right:0;bottom:calc(5*var(--mm));text-align:center;font-family:var(--mono);font-size:calc(1.6*var(--mm));letter-spacing:.18em;text-transform:uppercase;color:var(--p-mute)}
.corner-mark{position:absolute;right:calc(5*var(--mm));top:calc(4.5*var(--mm));width:calc(9*var(--mm))}
@page{size:91mm 61mm;margin:0}
@media print{body{background:#fff}.sheet{page-break-after:always;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media screen{body{display:flex;flex-wrap:wrap;gap:24px;padding:24px}.sheet{outline:1px dashed rgba(91,140,255,.4)}}
"""

def term_front(theme):
    return f'''<div class="sheet {theme}"><div class="card">
<pre class="raven">{html.escape(ASCII)}</pre>
<div class="term"><span class="c">/* corvus.systems */</span><br>&gt; ürün stüdyosu<br><span class="w">status:</span> SHIPPING<span class="cur"></span></div>
<div class="term-url">corvus<b>-</b>tech.co</div></div></div>'''

def logo_front():
    return f'''<div class="sheet light"><div class="card">
<div class="logo"><img src="data:image/png;base64,{LOGO}" alt="Corvus"></div>
<div class="tag">Ürün stüdyosu · İstanbul</div></div></div>'''

def back(theme):
    deco = f'<pre class="raven soft">{html.escape(ASCII)}</pre>' if theme == "dark" else f'<img class="corner-mark" src="data:image/png;base64,{MARK}" alt="">'
    return f'''<div class="sheet {theme}"><div class="card">{deco}
<div class="who"><p class="name">Ekrem Mert<br>UĞUR</p><p class="role">Co-Founder <span>· Corvus Tech</span></p></div>
<ul class="contacts">
<li><span class="k">tel</span><span class="v">{html.escape(PHONE)}</span></li>
<li><span class="k">mail</span><span class="v">corvustech.co@outlook.com</span></li>
<li><span class="k">web</span><span class="v">corvus-tech.co</span></li>
<li><span class="k">in</span><span class="v">linkedin.com/in/corvus-tech</span></li>
<li><span class="k">loc</span><span class="v">İstanbul, Türkiye</span></li>
</ul>
<div class="qr" data-qr></div><div class="qr-cap">REHBERE KAYDET</div></div></div>'''

DESIGNS = {"A": (term_front("dark"), back("dark")), "B": (logo_front(), back("light")), "C": (term_front("light"), back("light"))}

def page(sheets, mm):
    return f'''<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Corvus Kartvizit</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@800&family=Inter:wght@500&family=JetBrains+Mono:wght@400;500;700&display=swap">
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<style>{CSS.replace("MMUNIT", mm)}</style></head><body>{"".join(sheets)}
<script>qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8'];document.querySelectorAll('[data-qr]').forEach(el=>{{const q=qrcode(0,'L');q.addData({json.dumps(QR_TEXT)},'Byte');q.make();el.innerHTML=q.createSvgTag({{cellSize:4,margin:0,scalable:true}});el.dataset.modules=q.getModuleCount();}});</script>
</body></html>'''

def serve(directory):
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=directory)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}"

def chrome(*args):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-pdf-header-footer",
                    "--virtual-time-budget=10000", *args], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    tmp = Path(tempfile.mkdtemp())
    srv, base = serve(str(tmp))
    try:
        # 1) matbaa PDF — mm gerçek
        for key, (front, bk) in DESIGNS.items():
            (tmp / f"{key}.html").write_text(page([front, bk], "1mm"))
            chrome(f"--print-to-pdf={OUT}/kartvizit-{key}.pdf", f"{base}/{key}.html")
            print("pdf ", key)
        # 2) PNG — 1 mm = 12 px, 4× DPR → 48 px/mm ≈ 1200 dpi; sayfa 91 mm genişlikte tek sütun
        for key, (front, bk) in DESIGNS.items():
            (tmp / f"{key}-png.html").write_text(page([front, bk], "12px").replace("padding:24px", "padding:0;gap:0"))
            shot = tmp / f"{key}.png"
            chrome("--force-device-scale-factor=4", "--window-size=1092,1464", f"--screenshot={shot}", f"{base}/{key}-png.html")
            im = Image.open(shot)
            for i, face in enumerate(["on-yuz", "arka-yuz"]):
                x, y = 3 * 12 * 4, (i * 61 + 3) * 12 * 4
                im.crop((x, y, x + 85 * 48, y + 55 * 48)).save(OUT / f"{key}-{face}.png", dpi=(1200, 1200))
            print("png ", key)
        # 3) önizleme sayfası (tek dosya, tüm yüzler)
        (OUT / "kartvizit-onizleme.html").write_text(page([s for pair in DESIGNS.values() for s in pair], "4px"))
    finally:
        srv.shutdown()
    print("tamam →", OUT)

if __name__ == "__main__":
    main()
