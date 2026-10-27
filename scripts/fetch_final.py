"""Download + prepare the chosen scene/bust/hero/inscription/coin files and
write assets/credits.json.  usage: python3 fetch_final.py <raw_dir> <assets_dir>
Raw downloads go to raw_dir (untrusted data, kept outside the repo)."""
import sys, os, re, json, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import commons
from PIL import Image

RAW, ASSETS = sys.argv[1], sys.argv[2]
os.makedirs(RAW, exist_ok=True)

# (output file, Commons title, long side px, crop box as fractions or None)
IMAGES = [
    ("scenes/01-danube.jpg", "File:Colonne trajane 1-04.jpg", 1600, None),
    ("scenes/02-testudo.jpg", "File:Trajan's Column - NMR - panel 057 A.jpg", 1600, None),
    ("scenes/03-victory.jpg", "File:Separation of the two Dacian Wars on Trajan's Column.jpg", 1600, None),
    ("scenes/04-bridge.jpg", "File:Trajan's Column - NMR - panel 085 A.jpg", 1600, None),
    ("scenes/05-sarmatians.jpg", "File:Trajan's Column - NMR - panel 028 A.jpg", 1600, None),
    ("scenes/06-decebalus.jpg", "File:Decebal suicide.jpg", 1600, None),
    ("scenes/07-departure.jpg", "File:Trajan's Column - NMR - panel 124 B.jpg", 1600, None),
    ("misc/bust.jpg", "File:Portrait head of Trajan on a modern bust (SK Dresden Hm 365) 01.jpg", 1400, (0.1, 0.0, 0.9, 0.98)),
    ("misc/column-photo.jpg", "File:Trajan's Column HD.jpg", 1600, None),
]
# already prepared by other scripts; credits only
PREPARED = [
    ("misc/inscription.jpg", "File:Inscription, Trajan's Column.jpg"),
    ("coins/column-obv.jpg", "File:Traianus Denarius 114 90020186.jpg"),
    ("coins/column-rev.jpg", "File:Traianus Denarius 114 90020186.jpg"),
    ("coins/dacia-obv.jpg", "File:Trajan Denarius, Roman Dacia, 107 AD - Obverse.jpg"),
    ("coins/dacia-rev.jpg", "File:Trajan Denarius, Roman Dacia, 107 AD - Reverse.jpg"),
    ("coins/arabia-obv.jpg", "File:Sestertius, Rome, Trajanus, Romeins keizerrijk.jpg"),
    ("coins/arabia-rev.jpg", "File:Sestertius, Rome, Trajanus, Romeins keizerrijk (2).jpg"),
    ("coins/forum-obv.jpg", "File:TRAJAN RIC II 257.png"),
    ("coins/forum-rev.jpg", "File:TRAJAN RIC II 257.png"),
    ("coins/bridge-obv.jpg", "File:TRAIANUS RIC II 569 - 86000700.jpg"),
    ("coins/bridge-rev.jpg", "File:TRAIANUS RIC II 569 - 86000700.jpg"),
    ("coins/vicdac-obv.jpg", "File:TRAIANUS RIC II 528 - 2230436.jpg"),
    ("coins/vicdac-rev.jpg", "File:TRAIANUS RIC II 528 - 2230436.jpg"),
]

LIC_URL = {
    "cc-by-sa-4.0": ("CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0"),
    "cc-by-4.0": ("CC BY 4.0", "https://creativecommons.org/licenses/by/4.0"),
}

def save_jpeg(im, path, limit=400_000):
    for q in (84, 80, 76, 72, 68):
        b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True, progressive=True)
        if b.tell() <= limit: break
    open(path, "wb").write(b.getvalue())
    return q, b.tell()

def credit_for(title, info, wt):
    c = commons.credit(info)
    c["author"] = re.sub(r"^(Unknown author)\1$", r"\1", c["author"])
    if "lib.ugent.be" in (info["meta"].get("Credit") or ""):
        c["author"] = "Unknown author (photograph: Ghent University Library)"
    # {{Art Photo}} pages: extmetadata reports the *artwork* licence (PD);
    # the photograph's own licence is in |photo license=
    m = re.search(r"photo license\s*=\s*\{\{(?:self\|)?([^|}]+)", wt)
    if m and m.group(1).lower() in LIC_URL:
        c["license"], c["licenseUrl"] = LIC_URL[m.group(1).lower()]
        c["note"] = "Photograph licence; the photographed artwork itself is public domain."
    return c

def main():
    titles = sorted({t for _, t, *_ in IMAGES} | {t for _, t in PREPARED})
    info = commons.imageinfo(titles, width=1600)
    wts = commons.wikitext(titles)
    credits = []
    for out, t, side, crop in IMAGES:
        i = info[t]
        w, h = i["width"], i["height"]
        # request a thumbnail whose long side is ~side px (after optional crop)
        scale = side / max(w, h)
        tw = min(w, round(w * scale * (1.25 if crop else 1)))
        ii = commons.imageinfo([t], width=tw)[t]
        url = ii["thumburl"] if tw < w else ii["url"]
        rp = os.path.join(RAW, re.sub(r"[^A-Za-z0-9.-]+", "_", t[5:])[:80])
        if not os.path.exists(rp):
            commons.download(url, rp)
        im = Image.open(rp).convert("RGB")
        if crop:
            W, H = im.size
            im = im.crop((round(crop[0] * W), round(crop[1] * H), round(crop[2] * W), round(crop[3] * H)))
        if max(im.size) > side:
            s = side / max(im.size)
            im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        dst = os.path.join(ASSETS, out)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        q, n = save_jpeg(im, dst)
        print(out, im.size, "q", q, n)
        credits.append(dict(file=out, **credit_for(t, i, wts.get(t, ""))))
    for out, t in PREPARED:
        credits.append(dict(file=out, **credit_for(t, info[t], wts.get(t, ""))))
    # frieze atlas: one entry, listing every source plate
    aj = json.load(open(os.path.join(ASSETS, "frieze/atlas.json")))
    meta_p = os.path.join(RAW, "..", "plates", "meta.json")
    pm = json.load(open(meta_p))
    credits.append(dict(
        file="frieze/atlas.jpg",
        title="Die Reliefs der Traianssäule, Tafeln IV–CXIII (tone-equalised, cropped and joined)",
        author="Conrad Cichorius (plates, 1896–1900); relief attributed to Apollodorus of Damascus",
        license="Public domain", licenseUrl="",
        sourceUrl="https://commons.wikimedia.org/wiki/Category:Trajan%27s_Column_-_Cichorius_Plates",
        sources=[pm[str(p["number"])]["credit"]["sourceUrl"] for p in aj["plates"]],
    ))
    json.dump(credits, open(os.path.join(ASSETS, "credits.json"), "w"), indent=1, ensure_ascii=False)
    print(len(credits), "credits")

main()
