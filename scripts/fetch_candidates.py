"""Download candidate files as thumbnails for review.
usage: fetch_candidates.py outdir width 'File:a' 'File:b' ...
Prints size and photo licence (from wikitext 'photo license' if Art Photo)."""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
import commons
out, width, titles = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
os.makedirs(out, exist_ok=True)
info = commons.imageinfo(titles, width=width)
wt = commons.wikitext(titles)
for k, t in enumerate(titles):
    i = info.get(t)
    if not i:
        print("MISSING", t); continue
    w = wt.get(t, "")
    pl = re.search(r"photo license\s*=\s*(.*)", w)
    lic = re.findall(r"\{\{(?:self\|)?((?:cc|CC|PD|pd|GFDL|Cc)[^}]*)\}\}", w)
    fn = os.path.join(out, re.sub(r"[^A-Za-z0-9.-]+", "_", t[5:])[:80])
    if not fn.lower().endswith((".jpg", ".jpeg", ".png")): fn += ".jpg"
    if not os.path.exists(fn):
        commons.download(i["thumburl"] or i["url"], fn)
    print(f'{i["width"]}x{i["height"]} | ext={commons.strip_html(i["meta"].get("LicenseShortName",""))} | photo={pl.group(1).strip() if pl else "-"} | tpl={lic[:4]} | {fn}')
