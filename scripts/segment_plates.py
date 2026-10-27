"""Find the relief band(s) on each Cichorius plate.

Cast photos sit on cream paper: paper is low-saturation, casts are more
saturated tan. Mask = blurred HSV saturation above an Otsu threshold.
Bands = runs of rows with enough mask coverage. Output: bands.json with
[x0,y0,x1,y1] boxes (full-res px) per plate, in reading order, plus
preview sheets with boxes drawn.
"""
import sys, os, json
from PIL import Image, ImageFilter, ImageDraw

def otsu(hist):
    total = sum(hist); sumall = sum(i * h for i, h in enumerate(hist))
    wb = sb = 0; best = (0, 0)
    for t in range(256):
        wb += hist[t]
        if wb == 0: continue
        wf = total - wb
        if wf == 0: break
        sb += t * hist[t]
        mb = sb / wb; mf = (sumall - sb) / wf
        v = wb * wf * (mb - mf) ** 2
        if v > best[0]: best = (v, t)
    return best[1]

def mask_of(im, scale_w=500):
    """Texture mask: casts are carved (high local gradient), paper is smooth."""
    s = scale_w / im.width
    sm = im.resize((scale_w, round(im.height * s)), Image.LANCZOS).convert("L")
    e = sm.filter(ImageFilter.FIND_EDGES)
    # ignore 2px frame artefact of FIND_EDGES
    e = e.crop((2, 2, e.width - 2, e.height - 2)).resize(sm.size)
    e = e.filter(ImageFilter.GaussianBlur(5))
    t = max(6, otsu(e.histogram()) * 0.6)
    m = e.point(lambda v: 255 if v > t else 0)
    m = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(5))
    return m, s, t

def runs(vals, thr, mingap, minlen):
    out = []; start = None
    for i, v in enumerate(vals + [0]):
        if v > thr and start is None: start = i
        elif v <= thr and start is not None:
            out.append([start, i]); start = None
    merged = []
    for r in out:
        if merged and r[0] - merged[-1][1] < mingap: merged[-1][1] = r[1]
        else: merged.append(r)
    return [r for r in merged if r[1] - r[0] >= minlen]

def bands(im):
    m, s, t = mask_of(im)
    w, h = m.size
    px = m.load()
    rowf = [sum(1 for x in range(w) if px[x, y]) / w for y in range(h)]
    rb = runs(rowf, 0.25, 6, 25)
    res = []
    for y0, y1 in rb:
        colf = [sum(1 for y in range(y0, y1) if px[x, y]) / (y1 - y0) for x in range(w)]
        cb = runs(colf, 0.2, 25, 10)
        if not cb: continue
        x0, x1 = cb[0][0], cb[-1][1]
        res.append([round(x0 / s), round(y0 / s), round(x1 / s), round(y1 / s)])
    return res, m

if __name__ == "__main__":
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    allb = {}
    thumbs = []
    for n in range(4, 114):
        im = Image.open(os.path.join(src, f"{n:03d}.jpg")).convert("RGB")
        b, m = bands(im)
        allb[n] = b
        th = im.copy(); th.thumbnail((400, 400))
        sc = th.width / im.width
        dr = ImageDraw.Draw(th)
        for i, (x0, y0, x1, y1) in enumerate(b):
            dr.rectangle([x0 * sc, y0 * sc, x1 * sc, y1 * sc], outline=(255, 0, 0), width=2)
            dr.text((x0 * sc + 3, y0 * sc + 3), str(i), fill=(255, 0, 0))
        dr.text((5, 5), str(n), fill=(0, 0, 255))
        thumbs.append(th)
        print(n, b, flush=True)
    json.dump(allb, open(os.path.join(out, "bands.json"), "w"), indent=0)
    for k in range(0, len(thumbs), 12):
        sheet = Image.new("RGB", (1600, 1000), "white")
        for j, th in enumerate(thumbs[k:k + 12]):
            sheet.paste(th, ((j % 4) * 400, (j // 4) * 333))
        sheet.save(os.path.join(out, f"sheet{k // 12:02d}.jpg"), quality=80)
