"""Residência Mirante — featured conceptual house. Usage: python scene_mirante.py VIEW [w h samples]"""
import sys; sys.path.insert(0, '/tmp/claude-0/render')
from lib import *

view = sys.argv[1] if len(sys.argv) > 1 else 'hero'
W = int(sys.argv[2]) if len(sys.argv) > 2 else 2400
H = int(sys.argv[3]) if len(sys.argv) > 3 else 1350
S = int(sys.argv[4]) if len(sys.argv) > 4 else 128
OUT = '/tmp/claude-0/render/out/'

reset(S, W, H)
s = bpy.context.scene
light = {
    'hero': (4, 228, -2.7), 'pool': (14, 235, -3.4), 'corner': (18, 260, -3.5),
    'living': (10, 240, -2.6), 'dusk': (-2.5, 255, 0.6), 'aerial': (32, 220, -3.7),
}[view]
world_sky(elev=light[0], rot=light[1], aerosol=2.6 if light[0] < 10 else 1.4)
s.view_settings.exposure = light[2]
night = view == 'dusk'

# ---- materials
conc = concrete('Concreto', (0.50, 0.48, 0.45), board=0.16)
conc_dark = stone_slab('PisoTrav', (0.74, 0.69, 0.61), (0.6, 0.55, 0.47), rough=0.3, scale=0.6)
stn = stone('Pedra', (0.50, 0.44, 0.36), course=0.2, length=0.65)
trav = stone_slab('Travertino', (0.80, 0.75, 0.66), (0.66, 0.60, 0.51), rough=0.5)
wd = wood('Freijo', (0.40, 0.25, 0.14), 'Z', 0.6)
wd_deck = wood('Deck', (0.30, 0.20, 0.13), 'X', 0.7)
gl = glass('Vidro', (0.80, 0.86, 0.85))
blk = metal('Esquadria', (0.03, 0.03, 0.03), 0.4)
pw = pool_water()
pool_tile = matte('Revest', (0.22, 0.30, 0.28), 0.4)
gr = grass('Grama', (0.09, 0.12, 0.045))
fol = foliage('Folha', (0.10, 0.16, 0.05))
fol2 = foliage('Folha2', (0.15, 0.16, 0.06))
capim = foliage('Capim', (0.30, 0.25, 0.12))
lin = fabric('Linho', (0.70, 0.64, 0.55))
warm = emissive('Luz', (1.0, 0.78, 0.52), 6 if not night else 14)

# ---- terrain: platform at z=-0.02, hill rising behind (+y), slope falling in front
def h(x, y):
    import math
    z = -1.62
    if y > 12: z += (y - 12) * 0.38 + math.sin(x * 0.15) * 1.2 * min(1, (y - 12) / 8)
    return z
terrain(-80, -40, 80, 70, gr, h, 160)
# distant mountains
def mtn(x, y):
    import math
    return 18 + 14 * math.sin(x * 0.02 + 1) + 8 * math.sin(x * 0.051) + 4 * math.sin(x * 0.13)
terrain(-400, 230, 400, 260, matte('Monte', (0.06, 0.08, 0.06), 0.9), mtn, 80)

# ---- podium / stone base
box(-16, -2.6, -1.6, 12, 10, -0.02, stn, name='Podio')
box(-16, -2.6, -0.02, 12, 0.6, 0.02, trav, 0, 'Deck pedra')

# ---- ground floor (glass pavilion) x -9..7
box(-10, 0.6, -0.02, 8, 10, 0.25, conc_dark, name='Piso')
box(5.6, 1.2, 0.25, 8, 9.5, 3.4, stn, name='Nucleo pedra')
box(-10, 9.0, 0.25, 5.6, 9.5, 3.4, wd, name='Parede fundo')
# glazing + thin mullions on front (y=1.2)
box(-9.6, 1.18, 0.25, 5.6, 1.22, 3.4, gl, 0, 'Vidro frente')
for x in range(-9, 6, 3):
    box(x - 0.03, 1.12, 0.25, x + 0.03, 1.22, 3.4, blk, 0, 'Montante')
box(-9.62, 1.2, 0.25, -9.58, 9.0, 3.4, gl, 0, 'Vidro lateral')

# ---- upper cantilevered concrete volume x -14..9, y -0.4..9.5, z 3.4..6.8
box(-14, -0.4, 3.4, 9, 9.5, 3.85, conc, name='Laje inf')
box(-14, -0.4, 6.3, 9, 9.5, 6.8, conc, name='Laje sup')
box(-14, -0.4, 3.85, -13.4, 9.5, 6.3, conc, name='Empena esq')
box(8.4, -0.4, 3.85, 9, 9.5, 6.3, conc, name='Empena dir')
box(-13.4, 9.0, 3.85, 8.4, 9.5, 6.3, conc, name='Fundo sup')
box(-13.4, 0.2, 3.85, 8.4, 0.24, 6.3, gl, 0, 'Vidro sup')
# wooden vertical brise on part of upper window
for i in range(48):
    x = -13.2 + i * 0.2
    box(x, -0.32, 3.85, x + 0.07, -0.18, 6.3, wd, 0.003, 'Brise')
# interior floor upper + ceiling
box(-13.4, 0.24, 3.85, 8.4, 9.0, 3.9, wd_deck, 0, 'Piso sup')
# interior warm light strips
box(-13, 0.6, 6.25, 8, 0.75, 6.3, warm, 0, 'LED sup')
box(-9.4, 1.6, 3.34, 5.4, 1.75, 3.4, warm, 0, 'LED terreo')
if night or view == 'living':
    for x in (-7.5, -3.5, 0.5, 4):
        area((x, 5, 3.3), (2.5, 2.5), 160 if not night else 260, (1, 0.78, 0.55), (0, 0, 0))
    for x in (-11, -6, -1, 4):
        area((x, 4.5, 6.2), (3, 3), 120 if not night else 220, (1, 0.78, 0.55))
# thin roof over terrace at right side (pergola)
box(9, -2.4, 3.3, 15, 6, 3.42, conc, name='Pergola laje')
cyl(14.6, -2.0, 0, 3.3, 0.09, blk, 16, 'Pilar')

# ---- furniture ground floor (silhouettes through glass)
box(-7.5, 3.5, 0.25, -4.0, 4.4, 0.65, lin, 0.04, 'Sofa base')
box(-7.5, 4.2, 0.65, -4.0, 4.4, 1.0, lin, 0.04, 'Sofa encosto')
box(-6.6, 2.4, 0.25, -5.0, 3.2, 0.6, trav, 0.01, 'Mesa centro')
box(-1.5, 3.0, 0.25, 2.5, 4.2, 1.0, trav, 0.01, 'Ilha')
box(-1.5, 6.5, 0.25, 4.0, 8.6, 0.78, wd, 0.01, 'Mesa jantar')
for x in (-0.5, 1.5):
    sphere((x, 3.6, 2.4), 0.25, emissive('Pendente', (1, 0.8, 0.55), 10), 3, 'Pendente')
place(tree_master('Tin', 3.2, 1.8, fol2, seed=9, leaves=4000, leaf=0.1, crowns=3), -2.5, 7.8, 0.25)

# ---- pool (infinity edge toward front)
box(-14, -8.2, -1.6, 2, -2.6, -0.5, pool_tile, 0, 'Piscina fundo')
box(-14, -8.2, -0.5, 2, -2.6, -0.08, pw, 0, 'Agua')
box(-14.3, -8.4, -1.6, 2.3, -8.2, -0.06, trav, 0, 'Borda frente')
box(2, -8.4, -1.6, 2.3, -2.6, 0.0, trav, 0, 'Borda dir')
box(-14.3, -8.4, -1.6, -14, -2.6, 0.0, trav, 0, 'Borda esq')
box(2.3, -8.4, -0.02, 12, -2.6, 0.0, wd_deck, 0, 'Deck madeira')
# loungers
for x in (4.5, 7.0):
    box(x, -6.2, 0, x + 0.8, -4.2, 0.32, lin, 0.03, 'Espreguicadeira')

# ---- landscape
rnd = random.Random(3)
T1 = tree_master('T1', 9, 6, fol, seed=1, leaves=40000, leaf=0.32)
T2 = tree_master('T2', 11, 4, fol2, seed=2, leaves=34000, leaf=0.3, crowns=5)
T3 = tree_master('T3', 12, 2.6, fol, seed=3, leaves=24000, leaf=0.26, crowns=4, columnar=True)
for i in range(70):
    x = rnd.uniform(-80, 80); y = rnd.uniform(15, 60)
    if -20 < x < 18 and y < 19: continue
    place([T1, T2, T3][i % 3], x, y, h(x, y) - 0.2, rnd.uniform(0.8, 1.4))
for i, (x, y) in enumerate([(-25, 3), (-22, 13), (20, 12), (26, 3), (-31, -5), (30, -7), (-12, 14), (11, 15)]):
    place([T1, T2, T3][i % 3], x, y, h(x, y), rnd.uniform(0.9, 1.2))
place(T3, 13.5, -10.5, h(13.5, -10.5), 0.8)
grass_tufts(-30, -26, 20, -9.0, -1.62, 2200, capim, seed=11, h=0.7)
grass_tufts(12.5, -12, 24, 9, -1.62, 900, capim, seed=5, h=0.6)
grass_tufts(-26, -8, -16.5, 12, -1.62, 700, capim, seed=7, h=0.5)
# ---- cameras
if view == 'hero':
    camera((-14, -27, 2.4), (-3, 4, 2.2), 38, shift=(0, 0.1))
elif view == 'pool':
    camera((6.5, -9.6, 1.1), (-8, -3.5, 1.8), 22)
elif view == 'corner':
    camera((-18.5, -8, 0.6), (-13, 1, 5.4), 22)
elif view == 'dusk':
    camera((5, -32, 1.8), (-2, 4, 3.0), 32, shift=(0, 0.06))
elif view == 'aerial':
    camera((32, -42, 26), (-2, 3, 1), 38)
elif view == 'living':
    # inside ground floor looking out over the pool
    camera((-9.1, 8.2, 1.35), (1.5, -2.5, 1.0), 24)
render(OUT + 'mirante-' + view + '.png')
