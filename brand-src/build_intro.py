#!/usr/bin/env python3
"""
Corvus marka filmi — ASCII/terminal formatında 10 sn.
Kilavuz: Corvus Tech/-Video Edit Fikri/ASCII-TERMINAL-VIDEO-URETIM-KILAVUZU.md

Katman A (0.0-4.2 sn) : terminal yazma — dogrudan PIL ile cizilir
Katman B (4.2-10.0 sn): Higgsfield master videosu -> ASCII (Bolum 12 algoritmasi)

Kurallar (Bolum 2): iki renk, gradyan/glow yok, tek font tek boyut,
kesme yok, 24 fps, izgara 160x90 civari, letter-spacing yok.

Kullanim:
    python3 build_intro.py           # kareleri uretir + ffmpeg ile birlestirir
"""
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ---------- Sabitler ----------
HERE = Path(__file__).resolve().parent
SITE = HERE.parent
MASTER = HERE / "corvus-intro-master.mp4"
OUT_DIR = HERE / "ascii_frames"
OUT_MP4 = HERE / "corvus-intro-ascii-master.mp4"

W, H = 1920, 1080
FPS = 24
TOTAL_SEC = 10.0
TOTAL = int(TOTAL_SEC * FPS)  # 240 kare

BG = (0x05, 0x06, 0x0A)  # site zemini
FG = (0x7B, 0xA5, 0xFF)  # marka mavisinin parlak tonu — koyu zeminde okunur

RAMP = " .':;/\\<>+*=#{}0189@"  # yazilim temali rampa (Bolum 8.3)
COLS = 150  # ASCII izgara genisligi
CELL_RATIO = 0.55

# Kaynak video koyu zeminli: duz kontrast artirmak yetmiyor, cogu hucre
# bosluga dusuyor. gamma<1 parlak bolgeyi genisletiyor (Bolum 8.4).
ASCII_CONTRAST = 2.2
ASCII_GAMMA = 0.50

# Master videoda kuzgun kadraj ortasinda kaliyor; merkez crop olmadan
# ASCII izgarasinin %6'si doluyor, crop ile %15 (Bolum 8.4 kontrast notu).
SRC_CROP = "crop=1180:664"

TERM_END = 4.2  # Katman A biter
FONT_SIZE = 38  # 1080p'de Coinbase'in oransal metin buyuklugunu yakalar
LINE_H = 1.45
PAD_X = 150

# ---------- Katman A senaryosu ----------
# t: satir · cps: karakter/sn · after: satir sonrasi bekleme (ms) · inv: ters vurgu
SCRIPT = [
    {"t": "/* corvus.systems", "cps": 42, "after": 220},
    {"t": "", "cps": 999, "after": 60},
    {"t": "    ...error: BUILD PROCESS OUTDATED", "cps": 150, "after": 90},
    {"t": "    A problem has been detected", "cps": 150, "after": 80},
    {"t": "    : 29 products / 5 disciplines", "cps": 150, "after": 240},
    {"t": "", "cps": 999, "after": 60},
    {"t": "Set System Mode to: SHIPPING", "cps": 165, "after": 100},
    {"t": "{ Initializing direct build }", "cps": 165, "after": 100},
    {"t": "    *** Too many handoffs ***", "cps": 185, "after": 150},
    {"t": "    >> Ship?", "cps": 60, "after": 340},
    {"t": "Sure.", "cps": 16, "after": 300},   # kasitli yavas — tek insan ani
    {"t": "", "cps": 999, "after": 60},
    {"t": "Compiling............................ [ OK  ]", "cps": 420, "after": 30},
    {"t": "Signing.............................. [ OK  ]", "cps": 420, "after": 30},
    {"t": "Shipping to App Store................ [ OK  ]", "cps": 420, "after": 160},
    {"t": "", "cps": 999, "after": 60},
    {"t": "Enough text ** see it", "cps": 58, "after": 900, "inv": True},
]


def find_font(size):
    for p in ("/System/Library/Fonts/SFNSMono.ttf",
              "/System/Library/Fonts/Menlo.ttc"):
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    raise SystemExit("monospace font bulunamadi")


def build_timeline():
    """Her kare icin (tamamlanmis satirlar, yazilmakta olan satir) durumu."""
    frames = []
    t = 0.0
    done = []
    for line in SCRIPT:
        n = len(line["t"])
        type_dur = n / line["cps"] if n else 0.0
        steps = max(1, int(round(type_dur * FPS)))
        for i in range(steps):
            shown = line["t"][: int(round((i + 1) / steps * n))]
            frames.append((list(done), {"t": shown, "inv": line.get("inv")}))
            t += 1 / FPS
        done.append(line)
        hold = int(round(line["after"] / 1000 * FPS))
        for _ in range(hold):
            frames.append((list(done), None))
            t += 1 / FPS
    return frames


def draw_terminal(state, font, cursor_on):
    """Tek terminal karesi cizer. Ters vurgu = zemin/metin renkleri takas."""
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    lh = int(FONT_SIZE * LINE_H)
    cw = d.textlength("M", font=font)

    done, current = state
    rows = [(l["t"], l.get("inv")) for l in done]
    if current:
        rows.append((current["t"], current["inv"]))

    # Metin blogu dikeyde sabit bir cizgide baslar: satirlar eklendikce
    # blok asagi buyur, ama ekranin dikey ortasinda kalir.
    total_h = len(SCRIPT) * lh
    y = (H - total_h) / 2

    for text, inv in rows:
        if text:
            if inv:
                w = d.textlength(text, font=font)
                d.rectangle([PAD_X - 4, y - 3, PAD_X + w + 4, y + lh - 5], fill=FG)
                d.text((PAD_X, y), text, font=font, fill=BG)
            else:
                d.text((PAD_X, y), text, font=font, fill=FG)
        y += lh

    if cursor_on:
        last = rows[-1][0] if rows else ""
        cx = PAD_X + d.textlength(last, font=font)
        cy = y - lh
        d.rectangle([cx + 2, cy + 2, cx + cw * 0.6, cy + FONT_SIZE], fill=FG)
    return img


def ascii_grid(pil_img, cols, contrast=2.0, gamma=1.0):
    w, h = pil_img.size
    rows = max(1, round(cols * (h / w) * CELL_RATIO))
    small = pil_img.convert("L").resize((cols, rows), Image.LANCZOS)
    a = np.asarray(small, dtype=np.float32) / 255.0
    a = np.clip((a - 0.5) * contrast + 0.5, 0, 1) ** gamma
    idx = np.clip((a * len(RAMP)).astype(int), 0, len(RAMP) - 1)
    return [[RAMP[i] for i in row] for row in idx]


def draw_ascii(grid, font, cell_w, cell_h):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    rows, cols = len(grid), len(grid[0])
    y_off = (H - rows * cell_h) / 2
    x_off = (W - cols * cell_w) / 2
    for y, row in enumerate(grid):
        for x, c in enumerate(row):
            if c != " ":
                d.text((x_off + x * cell_w, y_off + y * cell_h), c, font=font, fill=FG)
    return img


def main():
    if not MASTER.exists():
        raise SystemExit(f"master video yok: {MASTER}")

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True)

    term_font = find_font(FONT_SIZE)

    # --- Katman B kaynagini cikar: master'in TERM_END sonrasi ---
    tmp = Path(tempfile.mkdtemp())
    subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(TERM_END), "-i", str(MASTER),
         "-vf", f"{SRC_CROP},fps={FPS}", str(tmp / "src_%05d.png")], check=True)
    src_frames = sorted(tmp.glob("src_*.png"))

    # ASCII hucre olculeri (letter-spacing YOK — Bolum 7/8 dersi)
    probe = Image.new("RGB", (10, 10))
    pd = ImageDraw.Draw(probe)
    cell_w = W / COLS
    cell_h = cell_w / CELL_RATIO
    ascii_font = find_font(max(6, int(cell_h * 0.95)))
    _ = pd  # olcum icin degil, netlik icin birakildi

    timeline = build_timeline()
    term_frames = int(TERM_END * FPS)
    print(f"senaryo {len(timeline)} kare uretti, katman A {term_frames} kare")

    for n in range(TOTAL):
        if n < term_frames:
            state = timeline[n] if n < len(timeline) else (
                [l for l in SCRIPT], None)
            cursor_on = (n // (FPS // 2)) % 2 == 0  # 0.5 sn periyot
            img = draw_terminal(state, term_font, cursor_on)
        else:
            i = n - term_frames
            src = src_frames[min(i, len(src_frames) - 1)]
            grid = ascii_grid(Image.open(src), COLS,
                              contrast=ASCII_CONTRAST, gamma=ASCII_GAMMA)
            img = draw_ascii(grid, ascii_font, cell_w, cell_h)
        img.save(OUT_DIR / f"f_{n:05d}.png")
        if (n + 1) % 24 == 0 or n == TOTAL - 1:
            print(f"{n+1}/{TOTAL}", flush=True)

    shutil.rmtree(tmp, ignore_errors=True)

    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS),
         "-i", str(OUT_DIR / "f_%05d.png"),
         "-c:v", "libx264", "-crf", "16", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT_MP4)],
        check=True)
    print(f"bitti -> {OUT_MP4}")


if __name__ == "__main__":
    main()
