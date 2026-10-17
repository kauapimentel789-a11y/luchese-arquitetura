"""Gera as versões web (WebP) das renderizações e o manifesto usado pelo componente <Picture>.
Uso: python scripts/process_images.py <pasta_dos_renders_png>
"""
import sys, json, os, base64, io
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'images')
MAN = os.path.join(ROOT, 'src', 'content', 'images.json')
os.makedirs(OUT, exist_ok=True)
WIDTHS = [640, 1200, 1800, 2400]

# recortes "macro" tirados das renderizações grandes: nome -> (arquivo, caixa relativa x0,y0,x1,y1)
CROPS = {
    'mat-concreto': ('mirante-corner.png', (0.32, 0.18, 0.78, 0.62)),
    'mat-pedra': ('pedra_alta-entry.png', (0.05, 0.10, 0.45, 0.70)),
}


def grade(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255.0
    # curva em S suave + leve aquecimento nos médios
    a = a + 0.10 * (a - a**2) * (2 * a - 1) * -1  # contraste suave
    a = np.clip(a, 0, 1)
    a[..., 0] *= 1.015
    a[..., 2] *= 0.985
    a = np.clip(a, 0, 1) ** 0.98
    im = Image.fromarray((a * 255).astype(np.uint8))
    return ImageEnhance.Color(im).enhance(0.93)


def emit(name, im):
    w, h = im.size
    widths = [x for x in WIDTHS if x < w] + [w]
    widths = sorted(set(widths))
    for x in widths:
        r = im if x == w else im.resize((x, round(h * x / w)), Image.LANCZOS)
        if x != w:
            r = r.filter(ImageFilter.UnsharpMask(radius=0.6, percent=40, threshold=2))
        r.save(os.path.join(OUT, f'{name}-{x}.webp'), 'WEBP', quality=82, method=6)
    t = im.resize((24, max(1, round(24 * h / w))), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1))
    buf = io.BytesIO(); t.save(buf, 'WEBP', quality=40)
    return {'w': w, 'h': h, 'widths': widths, 'blur': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()}


manifest = {}
for f in sorted(os.listdir(SRC)):
    if not f.endswith('.png') or f.startswith(('suntest', 'macro-concreto', 'macro-pedra')):
        continue
    name = f[:-4]
    im = grade(Image.open(os.path.join(SRC, f)))
    manifest[name] = emit(name, im)
    print(name, im.size)
for name, (f, box) in CROPS.items():
    p = os.path.join(SRC, f)
    if not os.path.exists(p):
        continue
    im = grade(Image.open(p))
    w, h = im.size
    c = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    # proporção vertical 4:5
    cw, ch = c.size
    tw = min(cw, int(ch * 0.8)); th = int(tw / 0.8)
    c = c.crop(((cw - tw) // 2, (ch - th) // 2, (cw - tw) // 2 + tw, (ch - th) // 2 + th))
    manifest[name] = emit(name, c)
    print(name, c.size)
json.dump(manifest, open(MAN, 'w'), indent=1)
