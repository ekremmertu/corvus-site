"""Bir havuz planının okunan metinlerini anahtarlı sözlüğe çıkarır ve geri yazar.

Çeviri (en) ve Türkçe üslup düzeltmesi (tr-fix) aynı mekanizmayı kullanır:
  extract(itinerary) -> {"d1.s2.tips": "...", ...}
  apply(itinerary, {"d1.s2.tips": "..."}) -> yeni itinerary (kopya)
Katman dosyası: scripts/i18n/<lang>/<dest_key>-<season>.json = {"source": <hash>, "strings": {anahtar: metin}}
`source` = katman yazılırken Türkçe metnin parmak izi; Türkçe sonradan değişirse katman "bayat" sayılır.
"""
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
I18N = ROOT / "scripts" / "i18n"

NICHE_FIELDS = ("name", "why_hidden", "access_instructions", "insider_tip", "season")


def extract(it: dict) -> dict:
    out: dict[str, str] = {}

    def put(key: str, val) -> None:
        if isinstance(val, str) and val.strip():
            out[key] = val

    for day in it.get("days", []):
        d = f"d{day['day_index']}"
        put(f"{d}.theme", day.get("theme"))
        for j, s in enumerate(day.get("stops", [])):
            put(f"{d}.s{j}.name", s.get("name"))
            put(f"{d}.s{j}.tips", s.get("tips"))
        for j, s in enumerate(day.get("backup_stops") or []):
            put(f"{d}.b{j}.name", s.get("name"))
            put(f"{d}.b{j}.tips", s.get("tips"))
    for k, note in enumerate(it.get("cultural_notes") or []):
        put(f"note{k}", note)
    niche = it.get("niche_experience") or {}
    for f in NICHE_FIELDS:
        put(f"niche.{f}", niche.get(f))
    transit = it.get("transit_card") or {}
    put("transit.name", transit.get("name"))
    put("transit.why_chosen", transit.get("why_chosen"))
    return out


def apply(it: dict, strings: dict) -> dict:
    it = copy.deepcopy(it)
    for day in it.get("days", []):
        d = f"d{day['day_index']}"
        if f"{d}.theme" in strings:
            day["theme"] = strings[f"{d}.theme"]
        for prefix, arr in (("s", day.get("stops", [])), ("b", day.get("backup_stops") or [])):
            for j, s in enumerate(arr):
                for f in ("name", "tips"):
                    key = f"{d}.{prefix}{j}.{f}"
                    if key in strings:
                        s[f] = strings[key]
    notes = it.get("cultural_notes") or []
    for k in range(len(notes)):
        if f"note{k}" in strings:
            notes[k] = strings[f"note{k}"]
    for f in NICHE_FIELDS:
        if f"niche.{f}" in strings and it.get("niche_experience"):
            it["niche_experience"][f] = strings[f"niche.{f}"]
    for f in ("name", "why_chosen"):
        if f"transit.{f}" in strings and it.get("transit_card"):
            it["transit_card"][f] = strings[f"transit.{f}"]
    return it


def fingerprint(strings: dict) -> str:
    blob = json.dumps(strings, ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(blob.encode()).hexdigest()[:12]


def layer_path(lang: str, plan_id: str) -> Path:
    return I18N / lang / f"{plan_id}.json"


def load_layer(lang: str, plan_id: str):
    p = layer_path(lang, plan_id)
    return json.loads(p.read_text()) if p.exists() else None
