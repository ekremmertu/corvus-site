#!/usr/bin/env python3
"""tr-fix katmanını CANLI plan havuzuna yalnız METİN olarak uygular (harita/durak/koordinat değişmez).

Neden upsert.sh değil: upsert her durağı yeniden haritada doğrular → bulunamayan durak ücretli Google Places'e düşer.
Burada hiçbir harita çağrısı yok; yalnız `supabase db query` ile itinerary JSON'unun metin alanları güncellenir.
Güvenlik: bir metin YALNIZ canlıdaki değeri düzeltmeden önceki hâliyle birebir aynıysa değişir
(sunucunun yedekle değiştirdiği durak ya da canlıda başka sürüm varsa dokunulmaz).

  python3 scripts/pool-apply-trfix.py <yedek.json>            # kuru deneme: rapor + SQL dosyası yazar
  python3 scripts/pool-apply-trfix.py <yedek.json> --apply    # SQL'i canlıya uygular (CEO onayıyla)
Geri dönüş: aynı yedek dosyasından `--restore` (itinerary'leri yedekteki hâline yazar).
"""
import copy
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plan_texts  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TW = ROOT.parent / "TripWalkers"
POOL = TW / "Scripts" / "plan-pool"


def rows_of(path: Path) -> list[dict]:
    d = json.loads(path.read_text())
    return next(v for v in d.values() if isinstance(v, list)) if isinstance(d, dict) else d


def source_it(pid: str) -> dict | None:
    for sub in ("plans_v2", "plans"):
        f = POOL / sub / f"{pid}-tr.json"
        if f.exists():
            return json.loads(f.read_text())["itinerary"]
    return None


def patch(live: dict, src: dict, fixes: dict) -> tuple[dict, int, int]:
    out = copy.deepcopy(live)
    days_src = {d["day_index"]: d for d in src.get("days", [])}
    days_live = {d["day_index"]: d for d in out.get("days", [])}
    done = skipped = 0
    for key, new in fixes.items():
        parts = key.split(".")
        ok = False
        if parts[0].startswith("d") and parts[0][1:].isdigit():
            n = int(parts[0][1:])
            ds, dl = days_src.get(n), days_live.get(n)
            if ds and dl:
                if parts[1] == "theme" and dl.get("theme") == ds.get("theme"):
                    dl["theme"] = new
                    ok = True
                elif len(parts) == 3:
                    arr = ds.get("stops", []) if parts[1][0] == "s" else ds.get("backup_stops") or []
                    j = int(parts[1][1:])
                    if j < len(arr):
                        s_src = arr[j]
                        for s_live in (dl.get("stops") or []) + (dl.get("backup_stops") or []):
                            if s_live.get("name") == s_src.get("name") and s_live.get(parts[2]) == s_src.get(parts[2]):
                                s_live[parts[2]] = new
                                ok = True
                                break
        elif key.startswith("note"):
            k = int(key[4:])
            notes_src = src.get("cultural_notes") or []
            notes_live = out.get("cultural_notes") or []
            if k < len(notes_src) and notes_src[k] in notes_live:
                notes_live[notes_live.index(notes_src[k])] = new
                ok = True
        elif parts[0] in ("niche", "transit"):
            field = "niche_experience" if parts[0] == "niche" else "transit_card"
            ls, ss = out.get(field) or {}, src.get(field) or {}
            if ls and ls.get(parts[1]) == ss.get(parts[1]):
                ls[parts[1]] = new
                ok = True
        done += ok
        skipped += not ok
    return out, done, skipped


def text_only_diff(a, b, path="") -> list[str]:
    """Yalnız string değerler değişmiş olmalı; yapı/sayı/koordinat değişikliği = hata."""
    if type(a) is not type(b):
        return [path]
    if isinstance(a, dict):
        if set(a) != set(b):
            return [path + ":keys"]
        return [p for k in a for p in text_only_diff(a[k], b[k], f"{path}.{k}")]
    if isinstance(a, list):
        if len(a) != len(b):
            return [path + ":len"]
        return [p for i, (x, y) in enumerate(zip(a, b)) for p in text_only_diff(x, y, f"{path}[{i}]")]
    if isinstance(a, str):
        return []
    return [] if a == b else [path]


def sql_for(rows: list[dict]) -> str:
    stmts = []
    for r in rows:
        blob = json.dumps(r["itinerary"], ensure_ascii=False)
        tag = "$twfix$"
        assert tag not in blob
        stmts.append(f"update travel.plan_pool set itinerary = {tag}{blob}{tag}::jsonb where id = '{r['id']}';")
    return "begin;\n" + "\n".join(stmts) + "\ncommit;\n"


def run_sql(sql_path: Path) -> None:
    subprocess.run(["supabase", "db", "query", "--linked", "-f", str(sql_path)], cwd=TW, check=True)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    backup = Path(sys.argv[1])
    rows = rows_of(backup)
    if "--restore" in sys.argv:
        sql = backup.with_suffix(".restore.sql")
        sql.write_text(sql_for(rows))
        run_sql(sql)
        print(f"geri yüklendi: {len(rows)} satır")
        return 0
    changed, total_done, total_skip, bad = [], 0, 0, []
    for r in rows:
        pid = f"{r['dest_key']}-{r['season']}"
        layer = plan_texts.load_layer("tr-fix", pid)
        src = source_it(pid)
        if not layer or not src or not layer["strings"]:
            continue
        new_it, done, skip = patch(r["itinerary"], src, layer["strings"])
        total_done += done
        total_skip += skip
        diff = text_only_diff(r["itinerary"], new_it)
        if diff:
            bad.append((pid, diff[:3]))
            continue
        if done:
            changed.append({"id": r["id"], "pid": pid, "itinerary": new_it, "done": done, "skip": skip})
    print(f"plan {len(rows)} · değişecek satır {len(changed)} · uygulanan metin {total_done} · eşleşmeyen (dokunulmadı) {total_skip} · yapı hatası {len(bad)}")
    for b in bad[:5]:
        print("  ✗", b)
    sql = backup.with_suffix(".apply.sql")
    sql.write_text(sql_for(changed))
    print(f"SQL: {sql} ({sql.stat().st_size // 1024} KB)")
    if "--apply" in sys.argv:
        if bad:
            print("yapı hatası var → uygulanmadı")
            return 1
        run_sql(sql)
        print("uygulandı")
    return 0


if __name__ == "__main__":
    sys.exit(main())
