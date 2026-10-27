"""Straighten + crop the pedestal inscription photo.
usage: prep_inscription.py <src.jpg> <out.jpg> [angle_deg] [x0 y0 x1 y1 in source fractions]"""
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
ang = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
box = [float(v) for v in sys.argv[4:8]] if len(sys.argv) > 7 else [0, 0, 1, 1]
im = Image.open(src).convert("RGB")
if ang:
    im = im.rotate(ang, resample=Image.BICUBIC, expand=False, fillcolor=(128, 128, 128))
W, H = im.size
im = im.crop((round(box[0] * W), round(box[1] * H), round(box[2] * W), round(box[3] * H)))
im.save(out, quality=84, optimize=True, progressive=True)
print(im.size)
