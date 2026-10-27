"""Download the 113 Cichorius plates (originals, ~2000px tall) + metadata."""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(__file__))
import commons
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
c = "Category:Trajan's Column - Cichorius Plates"
f = commons.category_members(c)
plates = sorted([t for t in f if re.match(r'File:\d{3} Conrad Cichorius.*Tafel [IVXLC]+\.jpg$', t)])
info = commons.imageinfo(plates)
meta = {}
for t in plates:
    n = int(t[5:8])
    i = info[t]
    p = os.path.join(out, f"{n:03d}.jpg")
    if not os.path.exists(p):
        # pick 2000px-tall thumbnail or original
        commons.download(i["url"], p)
    meta[n] = dict(title=t, roman=re.search(r'Tafel ([IVXLC]+)', t).group(1),
                   desc=commons.strip_html(i["meta"].get("ImageDescription", "")),
                   credit=commons.credit(i), w=i["width"], h=i["height"])
    print(n, i["width"], i["height"], meta[n]["desc"][:100], flush=True)
json.dump(meta, open(os.path.join(out, "meta.json"), "w"), indent=1, ensure_ascii=False)
