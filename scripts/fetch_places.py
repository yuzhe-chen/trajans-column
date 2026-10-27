"""Download + prepare the bridge images (assets/misc/bridge-*.jpg) and the map-card
place photos (assets/places/<id>.jpg), and merge their entries into assets/credits.json
(existing entries for the same files are replaced; all others are kept).

usage: python3 fetch_places.py <raw_dir> <assets_dir>
Raw downloads go to raw_dir (untrusted data, keep it outside the repo)."""
import sys, os, re, json, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import commons
from PIL import Image

RAW, ASSETS = sys.argv[1], sys.argv[2]
os.makedirs(RAW, exist_ok=True)

# (output file, Commons title, output width px, crop box as fractions or None, byte limit)
# crop None -> centre-crop to 3:2 for place cards; bridge images keep their own aspect.
BRIDGE = [
    ("misc/bridge-relief.jpg", "File:Trajan's Column - NMR - panel 085 C.jpg", 1800, (0.085, 0.025, 0.895, 0.60), 450_000),
    ("misc/bridge-ruins.jpg", "File:Remains of the Trajan's Bridge on the right bank of Danube, Serbia (40315224890).jpg", 1800, (0, 0.04, 1, 0.96), 450_000),
    ("misc/bridge-reconstruction.jpg", "File:Trajan's Bridge Across the Danube, Modern Reconstruction.jpg", 1800, (0, 0, 1, 1), 450_000),
]
PLACES = [
    ("forum-of-trajan", "File:Foro Traiano dal Vittoriano Roma sera.jpg", None),
    ("basilica-ulpia", "File:RomanForum.jpg", None),
    ("trajans-column", "File:Santissimo Nome di Maria and Trajan's Column 06.jpg", None),
    ("markets-of-trajan", "File:Forum of Trajan 1, Rome.jpg", None),
    ("baths-of-trajan", "File:Trajansthermen.jpg", None),
    ("aqua-traiana", "File:Fontana dellAcqua Paola (8086678675).jpg", None),
    ("portus", "File:Speculum Romanae Magnificentiae- Port of Rome MET DP870571.jpg", (0.0, 0.0, 1.0, 1.0)),
    ("via-traiana", "File:Scavi di egnazia, via traiana 01.jpg", None),
    ("arch-benevento", "File:The Arch of Trajan, Benevento, Italy - 49866022603.jpg", None),
    ("arch-ancona", "File:Arco di Traiano - Porto di Ancona.jpg", None),
    ("harbour-ancona", "File:Jakob Philipp Hackert (1784) Veduta del porto di Ancona.jpg", None),
    ("trajans-bridge", "File:Remains of the Trajan's Bridge on the right bank of Danube, Serbia (27251575447).jpg", None),
    ("tabula-traiana", "File:Traian's Table (Tabula Traiana)2.jpg", None),
    ("alcantara-bridge", "File:Puente de Alcántara.jpg", None),
    ("tropaeum-traiani", "File:006 MG 6430 Tropaeum Traiani Adamclisi 006.jpg", None),
    ("sarmizegetusa-ulpia", "File:Aerial photographs of Ulpia Traiana Sarmizegetusa-0170.jpg", None),
    ("timgad", "File:Timgad (15847441606).jpg", None),
    ("via-nova-traiana", "File:Petra Roman Gate.jpg", None),
    ("centumcellae", "File:Forte Michelangelo 2014.jpg", None),
    ("trajans-kiosk", "File:Philae Temple R01.jpg", None),
    ("italica", "File:Anfiteatro de las ruinas romanas de Itálica, Santiponce, Sevilla, España, 2015-12-06, DD 34-45 PAN HDR.JPG", None),
]
NOTES = {
    "places/aqua-traiana.jpg": "Fontana dell'Acqua Paola (1612), the papal terminus of the restored Aqua Traiana on the Janiculum.",
    "places/centumcellae.jpg": "Forte Michelangelo (16th c.) guards the mouth of Trajan's harbour at Civitavecchia.",
    "places/portus.jpg": "16th-century engraving (Speculum Romanae Magnificentiae) imagining the harbour with Trajan's hexagonal basin.",
    "places/harbour-ancona.jpg": "Painting (1784) of the harbour of Ancona with Trajan's arch on the mole.",
    "places/via-nova-traiana.jpg": "Petra, the Via Nova Traiana's principal city on the route from Bostra to Aila.",
    "misc/bridge-reconstruction.jpg": "Photograph of a reproduction of E. Duperrex's 1907 reconstruction drawing, displayed at Drobeta-Turnu Severin.",
}

# tidier author strings where the Commons "Artist" field is verbose
AUTHORS = {
    "places/tabula-traiana.jpg": "Sadko, Wikipedia",  # credit line requested by the author
    "places/forum-of-trajan.jpg": "Wolfgang Moroder",
    "places/centumcellae.jpg": "Shapiro1983 (Italian Wikipedia)",
}

LIC_URL = {
    "cc-by-sa-4.0": ("CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0"),
    "cc-by-sa-3.0": ("CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0"),
    "cc-by-4.0": ("CC BY 4.0", "https://creativecommons.org/licenses/by/4.0"),
    "cc-by-2.0": ("CC BY 2.0", "https://creativecommons.org/licenses/by/2.0"),
    "cc-by-sa-2.0": ("CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0"),
}

def save_jpeg(im, path, limit):
    for q in (85, 82, 78, 74, 70, 66):
        b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True, progressive=True)
        if b.tell() <= limit: break
    open(path, "wb").write(b.getvalue())
    return q, b.tell()

def credit_for(info, wt):
    c = commons.credit(info)
    c["author"] = re.sub(r"^(Unknown (?:author|artist))\1$", r"\1", c["author"])
    # {{Art Photo}} pages: extmetadata may report the artwork licence (PD);
    # the photograph's own licence is in |photo license=
    m = re.search(r"photo license\s*=\s*\{\{(?:self\|)?([^|}]+)", wt)
    if m and m.group(1).lower() in LIC_URL:
        c["license"], c["licenseUrl"] = LIC_URL[m.group(1).lower()]
        c["note"] = "Photograph licence; the photographed artwork itself is public domain."
    return c

def crop_frac(im, box):
    W, H = im.size
    return im.crop((round(box[0] * W), round(box[1] * H), round(box[2] * W), round(box[3] * H)))

def centre_3x2(im):
    W, H = im.size
    if W / H > 1.5:
        w = round(H * 1.5); x = (W - w) // 2
        return im.crop((x, 0, x + w, H))
    h = round(W / 1.5); y = (H - h) // 2
    return im.crop((0, y, W, y + h))

def main():
    jobs = [(o, t, w, c, lim) for o, t, w, c, lim in BRIDGE]
    jobs += [(f"places/{pid}.jpg", t, 900, c, 200_000) for pid, t, c in PLACES]
    titles = sorted({j[1] for j in jobs})
    info = commons.imageinfo(titles)
    wts = commons.wikitext(titles)
    new = {}
    for out, t, width, crop, limit in jobs:
        i = info[t]
        if not commons.license_ok(i):
            print("SKIP licence", out, t); continue
        # fetch ~2x the output width (cropping needs headroom), never above original
        tw = min(i["width"], width * 3)
        ii = commons.imageinfo([t], width=tw)[t]
        url = ii["thumburl"] if tw < i["width"] and ii.get("thumburl") else ii["url"]
        rp = os.path.join(RAW, re.sub(r"[^A-Za-z0-9.-]+", "_", t[5:])[:80] + f"_{tw}.img")
        if not os.path.exists(rp):
            commons.download(url, rp)
        im = Image.open(rp).convert("RGB")
        im = crop_frac(im, crop) if crop else centre_3x2(im)
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        dst = os.path.join(ASSETS, out)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        q, n = save_jpeg(im, dst, limit)
        print(f"{out:36s} {im.size} q{q} {n//1024} KB")
        c = dict(file=out, **credit_for(i, wts.get(t, "")))
        if out in AUTHORS:
            c["author"] = AUTHORS[out]
        if out in NOTES:
            c["note"] = (c.get("note", "") + " " + NOTES[out]).strip()
        new[out] = c
    cp = os.path.join(ASSETS, "credits.json")
    credits = [c for c in json.load(open(cp)) if c["file"] not in new]
    credits += list(new.values())
    json.dump(credits, open(cp, "w"), indent=1, ensure_ascii=False)
    print(len(credits), "credits")

main()
