"""Build the unrolled frieze atlas from the Cichorius plates 4-113.

Paper detection: at ~1000px working width, pixels whose local gradient is low
and which are connected to the image border are paper. Casts are enclosed by
their strong outline so the flood fill stops there. Paper is replaced by a
stone fill colour; each plate is split into horizontal bands (plates 4, 5
stack two rows), each band into cast pieces (paper gaps removed), all scaled
to 256 px tall and concatenated in reading order.

usage: python3 -I build_frieze.py <plates_dir> <out_dir> [preview_dir]
"""
import sys, os, json
from collections import deque
from PIL import Image, ImageFilter, ImageChops

H = 256
W = 2048
FILL = (138, 131, 120)  # #8a8378
WORK = 1000

def paper_mask(im):
    s = WORK / im.width
    g = im.convert("L").resize((WORK, round(im.height * s)), Image.LANCZOS)
    e = g.filter(ImageFilter.GaussianBlur(1.2)).filter(ImageFilter.FIND_EDGES)
    e = e.crop((3, 3, e.width - 3, e.height - 3)).resize(g.size)  # drop frame artefact
    e = e.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(5))
    w, h = e.size
    ep = e.load()
    gp = g.load()
    # paper is smooth; threshold relative to typical paper gradient (border median)
    border = sorted(ep[x, y] for x in range(4, w - 4, 3) for y in (4, h - 5)) + \
             sorted(ep[x, y] for y in range(4, h - 4, 3) for x in (4, w - 5))
    border.sort()
    # paper gradient is ~6-7; plates filled edge-to-edge by casts give a high
    # border median, so use a low percentile
    t = max(8, border[len(border) // 10] + 2)
    smooth = [[ep[x, y] <= t for x in range(w)] for y in range(h)]
    seen = [[False] * w for _ in range(h)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if smooth[y][x] and not seen[y][x]:
                seen[y][x] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if smooth[y][x] and not seen[y][x]:
                seen[y][x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and smooth[ny][nx]:
                seen[ny][nx] = True; q.append((nx, ny))
    m = Image.new("L", (w, h), 0)
    m.putdata([255 if seen[y][x] else 0 for y in range(h) for x in range(w)])
    # close small holes / grow paper a little into the blurred outline
    m = m.filter(ImageFilter.MaxFilter(9))  # eat the light halo along cast outlines
    # remove specks of 'cast' (e.g. printed numerals) inside paper: open cast
    cast = ImageChops.invert(m).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))
    return ImageChops.invert(cast), s

def runs(vals, thr, mingap, minlen):
    out = []; start = None
    for i, v in enumerate(list(vals) + [0]):
        if v > thr and start is None: start = i
        elif v <= thr and start is not None:
            out.append([start, i]); start = None
    merged = []
    for r in out:
        if merged and r[0] - merged[-1][1] < mingap: merged[-1][1] = r[1]
        else: merged.append(r)
    return [r for r in merged if r[1] - r[0] >= minlen]

BAND_OVERRIDE = {
    # plate 4 stacks two rows of fragments whose y-ranges overlap slightly
    4: [(20, 480), (470, 1265)],
}

SCENE_FIX = {43: "LXII"}

def running_median(v, k):
    h = k // 2
    return [sorted(v[max(0, i - h):i + h + 1])[len(v[max(0, i - h):i + h + 1]) // 2] for i in range(len(v))]

def pieces(im, n=None):
    pm, s = paper_mask(im)
    w, h = pm.size
    pp = pm.load()
    if n in BAND_OVERRIDE:
        ybands = [(round(a * s), round(b * s)) for a, b in BAND_OVERRIDE[n]]
    else:
        rowf = [sum(1 for x in range(w) if not pp[x, y]) / w for y in range(h)]
        ybands = runs(rowf, 0.12, 12, 60)
    out = []
    hull = Image.new("L", (w, h), 255)  # 255 = paper/fill
    hp = hull.load()
    for y0, y1 in ybands:
        bh = y1 - y0
        top, bot, cov = [], [], []
        for x in range(w):
            ys = [y for y in range(y0, y1) if not pp[x, y]]
            cov.append(len(ys) / bh)
            top.append(ys[0] if ys else y1)
            bot.append(ys[-1] if ys else y0)
        segs = runs(cov, 0.15, 30, 25)
        if not segs:
            continue
        band = []
        tops, bots = [], []
        for x0, x1 in segs:
            t_ = running_median(top[x0:x1], 31)
            b_ = running_median(bot[x0:x1], 31)
            for i, x in enumerate(range(x0, x1)):
                for y in range(t_[i], b_[i] + 1):
                    hp[x, y] = 0
            tops += t_; bots += b_
        # vertical crop: keep rows where >=40% of the band's columns are cast
        span = sum(x1 - x0 for x0, x1 in segs)
        rows = [sum(1 for a, b in zip(tops, bots) if a <= y <= b) / span for y in range(y0, y1)]
        r2 = runs(rows, 0.4, 10, 20)
        cy0, cy1 = (y0 + r2[0][0], y0 + r2[-1][1]) if r2 else (y0, y1)
        for x0, x1 in segs:
            band.append([round(x0 / s), round(cy0 / s), round(x1 / s), round(cy1 / s)])
        out.append(band)
    hull = hull.filter(ImageFilter.MaxFilter(3))
    full = hull.resize(im.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(2))
    return out, full

FILL_GREY = 0.299 * FILL[0] + 0.587 * FILL[1] + 0.114 * FILL[2]

def tone_equalise(parts, total, seam=40):
    """Greyscale strip with per-plate luminance matched to the median plate.

    1. per plate: affine-match mean/std of cast pixels (paper fill excluded)
       to the median mean/std across plates;
    2. low-frequency flattening: per-column cast mean smoothed (sigma 120 px)
       across the whole strip, 70% corrected toward the target -- this also
       ramps exposure smoothly across plate joins;
    3. at every join, a +-seam/2 px linear offset ramp so both sides meet,
       then a short horizontal blur (cross-fade) over the join itself.
    Paper/fill areas get a flat grey slightly darker than the target mean."""
    import numpy as np
    L = np.zeros((H, total), np.float32)
    C = np.zeros((H, total), np.float32)  # cast weight 0..1
    pid = np.zeros(total, np.int32)
    joins = []
    x = 0
    for img, m, k in parts:
        w = img.width
        L[:, x:x + w] = np.asarray(img.convert("L"), np.float32)
        C[:, x:x + w] = 1 - np.asarray(m, np.float32) / 255
        pid[x:x + w] = k
        if x: joins.append(x)
        x += w
    np_ = pid.max() + 1
    stats = []
    for k in range(np_):
        sel = (pid == k)
        v = L[:, sel][C[:, sel] > 0.9]
        stats.append((float(v.mean()), float(v.std())))
    tm = float(np.median([a for a, b in stats])); ts = float(np.median([b for a, b in stats]))
    for k, (mu, sd) in enumerate(stats):
        sel = (pid == k)
        g = min(1.6, max(0.6, ts / max(sd, 1)))
        L[:, sel] = (L[:, sel] - mu) * g + tm
    # low-frequency flattening
    w = C.sum(0); colmean = (L * C).sum(0) / np.maximum(w, 1)
    def gsmooth(v, wt, sigma):
        r = int(sigma * 3); xs = np.arange(-r, r + 1); kern = np.exp(-xs ** 2 / (2 * sigma ** 2))
        num = np.convolve(v * wt, kern, "same"); den = np.convolve(wt, kern, "same")
        return num / np.maximum(den, 1e-6)
    sm = gsmooth(colmean, w, 120.0)
    L += 0.7 * (tm - sm)[None, :]
    # seam ramps + cross-fade
    half = seam // 2
    for j in joins:
        a, b = max(0, j - half), min(total, j + half)
        cl, cr = C[:, a:j], C[:, j:b]
        if cl.sum() < 50 or cr.sum() < 50: continue
        ml = (L[:, a:j] * cl).sum() / cl.sum(); mr = (L[:, j:b] * cr).sum() / cr.sum()
        d = (mr - ml) / 2
        L[:, a:j] += d * np.linspace(0, 1, j - a)[None, :]
        L[:, j:b] -= d * np.linspace(1, 0, b - j)[None, :]
        # cross-fade: blend each column toward a 9-px horizontal mean, strongest at the join
        fa, fb = max(0, j - 12), min(total, j + 12)
        seg = L[:, max(0, fa - 4):min(total, fb + 4)].copy()
        k9 = np.ones(9, np.float32) / 9
        blur = np.apply_along_axis(lambda r: np.convolve(r, k9, "same"), 1, seg)
        off = fa - max(0, fa - 4)
        for c in range(fa, fb):
            t = 1 - abs(c - j) / 12
            L[:, c] = (1 - t) * L[:, c] + t * blur[:, c - fa + off]
    fillv = tm - 0.6 * ts
    L = L * C + fillv * (1 - C)
    return np.clip(L, 0, 255).astype(np.uint8)

def main():
    src, out = sys.argv[1], sys.argv[2]
    prev = sys.argv[3] if len(sys.argv) > 3 else None
    os.makedirs(out, exist_ok=True)
    if prev: os.makedirs(prev, exist_ok=True)
    meta = json.load(open(os.path.join(src, "meta.json")))
    strip_parts, plates = [], []
    x = 0
    for n in range(4, 114):
        im = Image.open(os.path.join(src, f"{n:03d}.jpg")).convert("RGB")
        bands, pm = pieces(im, n)
        filled = Image.composite(Image.new("RGB", im.size, FILL), im, pm)
        x_start = x
        info = []
        for band in bands:
            for (x0, y0, x1, y1) in band:
                crop = filled.crop((x0, y0, x1, y1))
                nw = max(1, round(crop.width * H / crop.height))
                crop = crop.resize((nw, H), Image.LANCZOS)
                mcrop = pm.crop((x0, y0, x1, y1)).resize((nw, H), Image.BILINEAR)
                strip_parts.append((crop, mcrop, len(plates)))
                x += nw
                info.append([x0, y0, x1, y1])
        m = meta[str(n)]
        import re
        sc = re.findall(r"scenes? ([IVXLC]+)(?:, ([IVXLC]+))?", m["desc"])
        names = [a for t in sc for a in t if a]
        scenes = names[0] if len(names) == 1 else (f"{names[0]}–{names[-1]}" if names else "")
        scenes = SCENE_FIX.get(n, scenes)  # typo in Commons description of plate XLIII
        plates.append(dict(plate=m["roman"], number=n, scenes=scenes, title=m["desc"], x0=x_start, x1=x))
        print(n, scenes, info, x - x_start, flush=True)
        if prev:
            pv = filled.copy(); pv.thumbnail((500, 500))
            from PIL import ImageDraw
            d = ImageDraw.Draw(pv); k = pv.width / im.width
            for (x0, y0, x1, y1) in info:
                d.rectangle([x0 * k, y0 * k, x1 * k, y1 * k], outline=(255, 0, 0), width=2)
            d.text((4, 4), str(n), fill=(0, 0, 255))
            pv.save(os.path.join(prev, f"{n:03d}.jpg"), quality=70)
    total = x
    rows = -(-total // W)
    strip = tone_equalise(strip_parts, total)
    atlas = Image.new("L", (W, rows * H), int(FILL_GREY))
    for r in range(rows):
        seg = strip[:, r * W:(r + 1) * W]
        atlas.paste(Image.fromarray(seg), (0, r * H))
    atlas.save(os.path.join(out, "atlas.jpg"), quality=82, optimize=True, progressive=True)
    json.dump(dict(rows=rows, rowHeight=H, width=W, totalLength=total,
                   source="Conrad Cichorius, Die Reliefs der Traianssäule (1896–1900), Tafeln IV–CXIII",
                   plates=plates),
              open(os.path.join(out, "atlas.json"), "w"), indent=1, ensure_ascii=False)
    print("total", total, "rows", rows)

if __name__ == "__main__":
    main()
