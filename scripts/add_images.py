"""Adiciona imagens prontas (renderizações do escritório) ao site, sem tratamento de cor.
Uso: python scripts/add_images.py <lista.tsv>
Cada linha do TSV: nome<TAB>caminho_da_imagem<TAB>corte_direita (fração, opcional)
Gera WebP em 640/1200/1800/2400 px e atualiza src/content/images.json.
"""
import sys, json, os, base64, io
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'images')
MAN = os.path.join(ROOT, 'src', 'content', 'images.json')
WIDTHS = [640, 1200, 1800, 2400]

manifest = json.load(open(MAN))
for line in open(sys.argv[1]):
    if not line.strip():
        continue
    parts = line.rstrip('\n').split('\t')
    name, path = parts[0], parts[1]
    cut = float(parts[2]) if len(parts) > 2 and parts[2] else 0.0
    im = Image.open(path).convert('RGB')
    w, h = im.size
    if cut:
        # remove a faixa da direita (marca d'água da ferramenta de imagem)
        im = im.crop((0, 0, round(w * (1 - cut)), h))
        w, h = im.size
    widths = sorted(set([x for x in WIDTHS if x < w] + ([w] if w <= WIDTHS[-1] else [])))
    if w > WIDTHS[-1]:
        widths = [x for x in WIDTHS]
    for x in widths:
        r = im if x == w else im.resize((x, round(h * x / w)), Image.LANCZOS)
        if x != w:
            r = r.filter(ImageFilter.UnsharpMask(radius=0.6, percent=35, threshold=2))
        r.save(os.path.join(OUT, f'{name}-{x}.webp'), 'WEBP', quality=80, method=6)
    fw = widths[-1]
    fh = round(h * fw / w)
    t = im.resize((24, max(1, round(24 * h / w))), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1))
    buf = io.BytesIO(); t.save(buf, 'WEBP', quality=40)
    manifest[name] = {'w': fw, 'h': fh, 'widths': widths, 'blur': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()}
    print(name, (fw, fh), widths)
json.dump(manifest, open(MAN, 'w'), indent=1)
