"""Split side-by-side coin photos into obverse/reverse squares, or square-crop
single-side photos. Background = median of the image border; coin = pixels
differing from it. usage: prep_coins.py <src> <out_prefix> [split|single] [max]"""
import sys
import numpy as np
from PIL import Image, ImageFilter

def bbox_of(a, bg, thr=40):
    d = np.abs(a.astype(np.int16) - bg[None, None, :]).sum(2)
    m = d > thr
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5))) > 0
    return m

def square(im, box, bg, mx, pad=0.03):
    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    s = max(x1 - x0, y1 - y0) * (1 + 2 * pad)
    out = Image.new("RGB", (round(s), round(s)), tuple(int(v) for v in bg))
    crop = im.crop((round(cx - s / 2), round(cy - s / 2), round(cx + s / 2), round(cy + s / 2)))
    # crop() pads outside areas with black; paste over bg canvas using in-bounds part only
    sx0, sy0 = max(0, round(cx - s / 2)), max(0, round(cy - s / 2))
    inner = im.crop((sx0, sy0, min(im.width, round(cx + s / 2)), min(im.height, round(cy + s / 2))))
    out.paste(inner, (sx0 - round(cx - s / 2), sy0 - round(cy - s / 2)))
    if out.width > mx:
        out = out.resize((mx, mx), Image.LANCZOS)
    return out

src, pre = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else "split"
mx = int(sys.argv[4]) if len(sys.argv) > 4 else 900
im = Image.open(src)
if im.mode == "RGBA":
    bgim = Image.new("RGB", im.size, (255, 255, 255)); bgim.paste(im, mask=im.split()[3]); im = bgim
im = im.convert("RGB")
a = np.asarray(im)
border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
bg = np.median(border, 0)
m = bbox_of(a, bg)
cols = m.mean(0); rows_ = m.mean(1)
if mode == "split":
    w = a.shape[1]
    mid_lo, mid_hi = int(w * 0.35), int(w * 0.65)
    cut = mid_lo + int(np.argmin(cols[mid_lo:mid_hi]))
    parts = [(0, cut), (cut, w)]
else:
    parts = [(0, a.shape[1])]
names = ["obv", "rev"] if mode == "split" else [""]
for (c0, c1), nm in zip(parts, names):
    sub = m[:, c0:c1]
    ys = np.where(sub.mean(1) > 0.02)[0]; xs = np.where(sub.mean(0) > 0.02)[0]
    box = (c0 + xs[0], ys[0], c0 + xs[-1] + 1, ys[-1] + 1)
    # paint the other coin's half with background so it can't leak into the square
    iso = im.copy()
    if c0 > 0: iso.paste(tuple(int(v) for v in bg), (0, 0, c0, im.height))
    if c1 < im.width: iso.paste(tuple(int(v) for v in bg), (c1, 0, im.width, im.height))
    out = square(iso, box, bg, mx)
    fn = f"{pre}-{nm}.jpg" if nm else f"{pre}.jpg"
    out.save(fn, quality=86, optimize=True)
    print(fn, out.size, "bg", bg)
