"""Secondary project scenes + material macros. Usage: python scenes.py SCENE VIEW W H SAMPLES"""
import sys; sys.path.insert(0, '/tmp/claude-0/render')
from lib import *

SC, VIEW = sys.argv[1], sys.argv[2]
W, H, S = int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
OUT = '/tmp/claude-0/render/out/'
reset(S, W, H)
scn = bpy.context.scene
rnd = random.Random(7)


def ground_trees(fol, n=40, x=(-80, 80), y=(20, 70), zf=lambda x, y: 0, avoid=None, kinds=None):
    T = kinds or [tree_master('Ta', 9, 6, fol, seed=1, leaves=30000, leaf=0.3),
                  tree_master('Tb', 12, 3, fol, seed=3, leaves=20000, leaf=0.26, crowns=4, columnar=True)]
    for i in range(n):
        xx, yy = rnd.uniform(*x), rnd.uniform(*y)
        if avoid and avoid(xx, yy): continue
        place(T[i % len(T)], xx, yy, zf(xx, yy) - 0.2, rnd.uniform(0.8, 1.3))
    return T


# ============================================================ Casa Pedra Alta (residencial, serra)
def pedra_alta():
    elev, rot, exp = {'ext': (8, 112, -3.1), 'entry': (22, 150, -3.5)}[VIEW]
    world_sky(elev, rot, aerosol=1.2)
    scn.view_settings.exposure = exp
    stn = stone('PedraSerra', (0.46, 0.43, 0.39), course=0.18, length=0.55)
    char = wood('Carbonizada', (0.05, 0.045, 0.04), 'Z', 0.75, ring=30)
    roof = metal('Telhado', (0.06, 0.06, 0.06), 0.5)
    gl = glass('V', (0.78, 0.84, 0.83)); blk = metal('Esq', (0.03, 0.03, 0.03))
    gr = grass('Campo', (0.14, 0.15, 0.06)); fol = foliage('F', (0.08, 0.13, 0.05))
    wd = wood('Pinus', (0.55, 0.38, 0.22), 'X', 0.6)
    warm = emissive('L', (1, 0.8, 0.55), 9)
    import math
    def hh(x, y): return 0.04 * x + (y - 10) * 0.12 * (y > 10) + 0.6 * math.sin(x * 0.08 + y * 0.05) - 0.3
    terrain(-90, -40, 90, 80, gr, hh, 150)
    # far ridges
    terrain(-700, 160, 700, 700, matte('Serra', (0.09, 0.12, 0.10), 0.95), lambda x, y: (y - 160) * 0.16 + 25 * math.sin(x * 0.012) + 9 * math.sin(x * 0.041 + 2) - 8, 90)
    # long stone volume (x -14..6), flat roof
    box(-14, 0, -0.8, 6, 7, 3.2, stn, name='Vol pedra')
    box(-14.3, -0.6, 3.2, 6.3, 7.4, 3.5, char, name='Beiral')
    # opening in stone volume (glass recess)
    box(-10, -0.02, 0.0, -3, 0.25, 2.8, gl, 0, 'Vidro')
    box(-10.1, -0.03, 0.0, -2.9, 0.3, 0.05, blk, 0, 'Soleira')
    box(-10, 0.3, 0, -3, 6.5, 2.8, warm, 0, 'Interior')
    # perpendicular charred timber volume with pitched roof (x 6..13, y -6..9)
    box(6, -6, -0.6, 13, 9, 3.6, char, name='Vol madeira')
    import bmesh
    me = bpy.data.meshes.new('Roof'); bm = bmesh.new()
    pts = [(5.6, -6.4, 3.6), (13.4, -6.4, 3.6), (9.5, -6.4, 6.6), (5.6, 9.4, 3.6), (13.4, 9.4, 3.6), (9.5, 9.4, 6.6)]
    v = [bm.verts.new(p) for p in pts]
    bm.faces.new((v[0], v[1], v[2])); bm.faces.new((v[3], v[5], v[4]))
    bm.faces.new((v[0], v[2], v[5], v[3])); bm.faces.new((v[1], v[4], v[5], v[2])); bm.faces.new((v[0], v[3], v[4], v[1]))
    bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new('Roof', me)); me.materials.append(roof)
    sol = o.modifiers.new('s', 'SOLIDIFY'); sol.thickness = 0.12
    # gable glass end
    box(7, -6.02, 0, 12, -5.9, 3.5, gl, 0, 'Vidro empena')
    box(7, -5.8, 0, 12, 8.5, 3.4, warm, 0, 'Interior2')
    for x in (8.2, 9.5, 10.8):
        box(x - 0.03, -6.06, 0, x + 0.03, -5.98, 3.5, blk, 0, 'Mont')
    # deck
    box(-14, -4, -0.3, 6, 0, 0.0, wd, 0, 'Deck')
    # araucárias and native trees
    T = [tree_master('Ar', 16, 5, fol, seed=21, leaves=26000, leaf=0.3, crowns=4),
         tree_master('Tc', 9, 6, foliage('F2', (0.12, 0.14, 0.05)), seed=5, leaves=30000, leaf=0.3)]
    for i in range(40):
        x, y = rnd.uniform(-90, 90), rnd.uniform(12, 75)
        if -20 < x < 20 and y < 18: continue
        place(T[i % 2], x, y, hh(x, y) - 0.2, rnd.uniform(0.8, 1.2))
    place(T[0], -22, 4, hh(-22, 4)); place(T[1], 22, -2, hh(22, -2))
    grass_tufts(-40, -30, 40, -4.5, -0.3, 2400, foliage('Capim', (0.32, 0.27, 0.13)), seed=3, h=0.6)
    if VIEW == 'ext':
        camera((-26, -24, 1.7), (0, 2, 2.6), 30, shift=(0, 0.06))
    else:
        camera((-17, -5.5, 1.55), (-6, 0.6, 1.7), 28)


# ============================================================ Apartamento Jardins (interiores)
def jardins():
    world_sky(28, 200, aerosol=1.0)
    scn.view_settings.exposure = -2.6
    scn.cycles.diffuse_bounces = 5
    trav = stone_slab('Trav', (0.82, 0.77, 0.69), (0.68, 0.62, 0.53), rough=0.32, scale=0.8)
    pl = plaster('Reboco', (0.86, 0.83, 0.78))
    oak = wood('Carvalho', (0.52, 0.36, 0.22), 'Y', 0.55)
    walnut = wood('Nogueira', (0.24, 0.15, 0.09), 'X', 0.45, coat=0.2)
    lin = fabric('Linho', (0.78, 0.73, 0.64))
    lin2 = fabric('Linho2', (0.45, 0.38, 0.30))
    gl = glass('V'); blk = metal('Esq', (0.03, 0.03, 0.03)); brz = bronze()
    marble = stone_slab('Pedra ilha', (0.30, 0.27, 0.24), (0.55, 0.50, 0.44), rough=0.25, scale=2.5)
    fol = foliage('F', (0.10, 0.16, 0.05)); gr = grass('G', (0.1, 0.14, 0.05))
    # room 12 x 8, h 3.1 ; glass façade at y=0 (looking toward courtyard at -y)
    box(-8, 0, -0.2, 8, 9, 0, trav, 0, 'Piso')
    box(-8, 0, 3.1, 8, 9, 3.3, pl, 0, 'Teto')
    for i in range(80):  # slatted oak ceiling
        x = -7.9 + i * 0.2
        box(x, 0.3, 2.98, x + 0.08, 8.9, 3.1, oak, 0.002, 'Ripa')
    box(-8.2, 0, 0, -8, 9, 3.1, pl, 0, 'Parede E')
    box(8, 0, 0, 8.2, 9, 3.1, pl, 0, 'Parede D')
    box(-8, 9, 0, 8, 9.2, 3.1, oak, 0, 'Painel fundo')
    box(-8, -0.05, 0, 8, 0.0, 3.1, gl, 0, 'Fachada vidro')
    for x in (-4, 0, 4):
        box(x - 0.025, -0.08, 0, x + 0.025, 0.02, 3.1, blk, 0, 'Mont')
    # courtyard outside
    box(-30, -20, -0.25, 30, 0, -0.2, gr, 0, 'Jardim')
    box(-30, -14, 0, 30, -13.6, 4.5, plaster('Muro', (0.75, 0.71, 0.65)), name='Muro')
    T = tree_master('Jab', 6, 5, fol, seed=12, leaves=26000, leaf=0.16)
    place(T, -2.5, -7, -0.2, 1.0); place(T, 6, -10, -0.2, 0.8)
    for i in range(20): shrub(rnd.uniform(-12, 12), rnd.uniform(-13, -9), -0.2, rnd.uniform(0.5, 0.9), fol, i)
    # living: sofa, rug, coffee table
    box(-6.5, 2.0, 0, -1.0, 4.5, 0.01, fabric('Tapete', (0.62, 0.57, 0.50)), 0, 'Tapete')
    box(-6.2, 4.0, 0.0, -1.4, 5.0, 0.42, lin, 0.06, 'Sofa'); box(-6.2, 4.75, 0.42, -1.4, 5.0, 0.8, lin, 0.06, 'Encosto')
    box(-6.6, 2.4, 0.0, -6.0, 5.0, 0.62, lin, 0.06, 'Braco')
    box(-4.6, 2.5, 0, -2.8, 3.4, 0.34, walnut, 0.01, 'Mesa')
    box(-1.0, 1.6, 0, -0.2, 2.4, 0.7, lin2, 0.08, 'Poltrona')
    # kitchen island + dining
    box(1.5, 4.8, 0, 6.0, 5.9, 0.92, marble, 0.008, 'Ilha')
    box(1.5, 8.4, 0, 7.5, 9.0, 2.3, walnut, 0.004, 'Armario')
    box(1.0, 2.0, 0.72, 5.0, 3.0, 0.76, oak, 0.004, 'Mesa jantar')
    for x in (1.2, 4.7):
        box(x, 2.1, 0, x + 0.06, 2.9, 0.72, blk, 0, 'pe')
    for x in (2.6, 3.8):
        cyl(x, 5.35, 1.55, 1.85, 0.16, brz, 32, 'Pendente')
        point((x, 5.35, 1.52), 25, (1, 0.78, 0.5), 0.08)
    # vase with branch
    cyl(-3.8, 2.9, 0.34, 0.75, 0.1, matte('Ceramica', (0.55, 0.45, 0.36), 0.6), 24, 'Vaso')
    if VIEW == 'living':
        camera((7.5, 3.0, 1.3), (-6, 4.6, 0.9), 20)
    else:
        camera((-1.2, 7.8, 1.45), (4.0, 4.6, 0.8), 30, dof=5.2, fstop=2.8)


# ============================================================ Atelier Sete (comercial)
def atelier():
    world_sky(30, 160, aerosol=1.0)
    scn.view_settings.exposure = -2.4
    conc = concrete('C', (0.55, 0.53, 0.50), board=0.0, rough=0.7)
    floor = concrete('Piso', (0.40, 0.39, 0.37), board=0, rough=0.35, stains=False)
    oak = wood('Carvalho', (0.55, 0.40, 0.25), 'X', 0.5)
    fg = fluted_glass(); gl = glass('V'); blk = metal('Esq', (0.03, 0.03, 0.03))
    fol = foliage('F', (0.10, 0.16, 0.05)); lin = fabric('L', (0.30, 0.29, 0.27))
    led = emissive('LED', (1, 0.9, 0.78), 12)
    box(-10, -2, -0.2, 10, 14, 0, floor, 0, 'Piso')
    box(-10, -2, 3.6, 10, 14, 3.9, conc, 0, 'Laje')
    for x in (-6, 0, 6):
        for y in (2, 8):
            box(x - 0.25, y - 0.25, 0, x + 0.25, y + 0.25, 3.6, conc, 0.01, 'Pilar')
    box(-10.2, -2, 0, -10, 14, 3.6, gl, 0, 'Fachada')  # window wall on left
    box(-10, 14, 0, 10, 14.2, 3.6, conc, 0, 'Fundo')
    box(10, -2, 0, 10.2, 14, 3.6, conc, 0, 'Dir')
    # fluted glass meeting room
    box(2.5, 9.0, 0, 9.8, 9.06, 3.6, fg, 0, 'Canelado frente')
    box(2.5, 9.0, 0, 2.56, 13.9, 3.6, fg, 0, 'Canelado lado')
    box(2.48, 8.98, 3.5, 9.8, 9.08, 3.6, blk, 0, 'Perfil')
    area((6, 11.5, 3.5), (4, 3), 400, (1, 0.85, 0.65), (0, 0, 0))
    # long table + benches
    box(-6.5, 4.4, 0.72, 2.5, 5.6, 0.77, oak, 0.004, 'Mesa')
    for x in (-6.0, 2.0):
        box(x, 4.6, 0, x + 0.08, 5.4, 0.72, blk, 0, 'pe')
    box(-6.5, 3.4, 0.0, 2.5, 3.8, 0.45, oak, 0.004, 'Banco'); box(-6.5, 6.2, 0.0, 2.5, 6.6, 0.45, oak, 0.004, 'Banco2')
    box(-6.3, 4.95, 2.6, 2.3, 5.05, 2.64, led, 0, 'Linear')
    box(-6.3, 4.97, 2.64, -6.28, 5.03, 3.6, blk, 0, 'cabo'); box(2.28, 4.97, 2.64, 2.3, 5.03, 3.6, blk, 0, 'cabo2')
    box(-9.5, 10, 0, -6.5, 13.8, 2.0, oak, 0.004, 'Estante')
    for (x, y) in ((-8.5, 1.0), (8.6, 2.5), (-8.8, 12.6)):
        cyl(x, y, 0, 0.55, 0.32, matte('Vaso', (0.25, 0.24, 0.22), 0.7), 24, 'Vaso')
        o = sphere((x, y, 1.4), 0.75, fol, 3, 'Planta', (1, 1, 1.3)); displace(o, 0.5, 0.25)
    # trees outside window
    T = tree_master('Tout', 9, 6, fol, seed=31, leaves=26000, leaf=0.3)
    for y in (-2, 6, 14):
        place(T, -16, y, -0.2, 1.0)
    box(-60, -40, -0.25, -10.2, 60, -0.2, grass('G', (0.1, 0.14, 0.05)), 0, 'Grama')
    camera((8.6, -1.4, 1.55), (-3, 9, 1.2), 22)


# ============================================================ Pavilhão do Lago (hospitalidade)
def lago():
    elev, rot, exp = {'wide': (6, 95, -2.8), 'deck': (9, 110, -3.0)}[VIEW]
    world_sky(elev, rot, aerosol=3.0)
    scn.view_settings.exposure = exp
    wd = wood('Cumaru', (0.42, 0.26, 0.15), 'X', 0.6)
    roofm = wood('Forro', (0.55, 0.38, 0.22), 'X', 0.6)
    steel = metal('Aco', (0.04, 0.04, 0.04), 0.45)
    gl = glass('V', (0.85, 0.9, 0.88)); wt = water('Lago', (0.03, 0.06, 0.06), 0.06)
    fol = foliage('F', (0.07, 0.12, 0.05)); lin = fabric('L', (0.80, 0.76, 0.68))
    warm = emissive('Luz', (1, 0.8, 0.55), 4)
    import math
    box(-400, -300, -0.6, 400, 400, -0.5, wt, 0, 'Lago')
    # opposite shore with forest
    terrain(-300, 90, 300, 160, grass('Margem', (0.07, 0.10, 0.04)), lambda x, y: (y - 90) * 0.2 - 0.6 + 2 * math.sin(x * 0.03), 80)
    T = [tree_master('L1', 14, 6, fol, seed=41, leaves=26000, leaf=0.32), tree_master('L2', 16, 3.2, fol, seed=42, leaves=18000, leaf=0.28, crowns=4, columnar=True)]
    for i in range(140):
        x, y = rnd.uniform(-220, 220), rnd.uniform(96, 150)
        place(T[i % 2], x, y, (y - 90) * 0.2 - 0.8, rnd.uniform(0.8, 1.4))
    # near shore left with trees
    terrain(-120, -40, -18, 40, grass('Margem2', (0.09, 0.12, 0.05)), lambda x, y: -0.6 + min(1.2, (-18 - x) * 0.08), 60)
    for i in range(14):
        place(T[i % 2], rnd.uniform(-60, -24), rnd.uniform(-20, 30), 0.3, rnd.uniform(0.8, 1.2))
    # pavilion on pilotis: deck 0..0.3, roof at 3.4
    box(-18, -1, -0.05, 6, 12, 0.15, wd, 0.004, 'Deck')
    box(-14, 1.5, 0.15, 3, 10, 3.3, gl, 0, 'Caixa vidro')
    box(-13.9, 1.6, 0.15, 2.9, 9.9, 3.25, warm, 0, 'Interior')
    for x in range(-14, 4, 3):
        box(x - 0.03, 1.46, 0.15, x + 0.03, 1.54, 3.3, steel, 0, 'Mont')
    box(-19, -2.5, 3.3, 7, 13.5, 3.62, roofm, 0, 'Cobertura')
    box(-19.05, -2.55, 3.55, 7.05, 13.55, 3.68, steel, 0, 'Rufo')
    for x in (-18.4, -12, -5.5, 1, 6.4):
        for y in (-2.0, 13):
            cyl(x, y, -0.6, 3.3, 0.07, steel, 16, 'Pilar')
    for x in (-10, -4):
        box(x, -0.4, 0.15, x + 0.7, 1.2, 0.45, lin, 0.04, 'Chaise')
    # steps into water
    box(-6, -2.2, -0.35, 0, -1, -0.15, wd, 0.004, 'Degrau')
    if VIEW == 'wide':
        camera((22, -26, 1.0), (-5, 6, 1.8), 30, shift=(0, 0.1))
    else:
        camera((4.5, -0.3, 1.5), (-14, 3.0, 1.6), 24)


# ============================================================ Estudo Planos (conceitual)
def planos():
    elev, rot, exp = {'wide': (11, 235, -3.3), 'close': (16, 220, -3.4)}[VIEW]
    world_sky(elev, rot, aerosol=1.8)
    scn.view_settings.exposure = exp
    conc = concrete('C', (0.62, 0.60, 0.56), board=0.25)
    wt = pool_water(); bot = matte('Fundo', (0.08, 0.08, 0.08), 0.3)
    sand = grass('Cascalho', (0.42, 0.38, 0.32))
    capim = foliage('Capim', (0.36, 0.31, 0.15))
    box(-200, -200, -0.3, 200, 200, -0.25, sand, 0, 'Chao')
    box(-12, -6, -0.25, 10, 3, -0.2, bot, 0, 'Espelho fundo')
    box(-12, -6, -0.2, 10, 3, -0.06, wt, 0, 'Espelho')
    walls = [(-10, 2, 8, 2.5, 6.5), (-3, -9, -2.5, 6, 4.2), (4, 6, 18, 6.4, 3.2), (-14, -1, -6, -0.6, 2.4), (6, -12, 6.4, 0, 5.2)]
    for x0, y0, x1, y1, h in walls:
        box(x0, y0, -0.3, x1, y1, h, conc, 0.004, 'Plano')
    box(-6, 2.5, 4.8, 6.5, 9, 5.1, conc, 0.004, 'Laje')
    grass_tufts(-60, 8, 60, 40, -0.25, 2600, capim, seed=9, h=0.8)
    grass_tufts(-60, -40, -14, 8, -0.25, 1200, capim, seed=10, h=0.8)
    if VIEW == 'wide':
        camera((16, -24, 1.2), (-1, 2, 2.0), 30, shift=(0, 0.08))
    else:
        camera((-9, -8.5, 1.0), (-2.6, 2, 2.4), 24)


# ============================================================ material macros
def macro():
    world_sky(18, 250, strength=0.03, aerosol=1.0)
    scn.view_settings.exposure = -1.6
    m = VIEW
    area((-5, -0.6, 0.6), (1.5, 6), 9000, (1, 0.84, 0.66), (0, math.radians(-90), math.radians(16)))
    if m == 'concreto':
        o = box(-2, 0, -2, 2, 0.3, 3, concrete('C', (0.55, 0.53, 0.5), board=0.3))
        box(-2, -0.4, -2, 2, 0.3, -1.5, concrete('C2', (0.52, 0.5, 0.47), board=0))
        camera((0.3, -2.4, 0.6), (0, 0, 0.4), 50)
    elif m == 'pedra':
        box(-2, 0, -2, 2, 0.3, 3, stone('P', (0.47, 0.41, 0.33), course=0.17, length=0.38))
        camera((0.3, -2.4, 0.6), (0, 0, 0.4), 50)
    elif m == 'madeira':
        for i in range(16):
            x = -1.6 + i * 0.2
            box(x, 0, -2, x + 0.12, 0.12, 3, wood('W', (0.45, 0.28, 0.15), 'Z', 0.55), 0.004)
        box(-2, 0.12, -2, 2, 0.2, 3, matte('Sombra', (0.03, 0.03, 0.03), 0.9))
        camera((0.4, -2.2, 0.5), (0, 0, 0.4), 50)
    elif m == 'vidro':
        box(-2, 0, -2, 2, 0.02, 3, fluted_glass())
        box(-3, 2, -3, 3, 2.1, 4, emissive('BG', (1, 0.82, 0.6), 1.5))
        box(-0.6, 1.0, -2, -0.2, 1.4, 3, matte('Silh', (0.05, 0.06, 0.04), 1))
        for z in (0.2, 0.9): sphere((0.6, 1.2, z), 0.4, foliage('F', (0.1, 0.15, 0.05)), 3)
        camera((0.3, -2.4, 0.6), (0, 0, 0.4), 50)
    elif m == 'metal':
        for i in range(12):
            x = -1.5 + i * 0.26
            box(x, 0, -2, x + 0.06, 0.25, 3, bronze(), 0.004)
        box(-2, 0.3, -2, 2, 0.35, 3, concrete('C', (0.5, 0.48, 0.45), board=0))
        camera((0.9, -2.1, 0.7), (0, 0.1, 0.4), 50)
    elif m == 'vegetacao':
        box(-3, 0.8, -3, 3, 1.0, 4, concrete('C', (0.6, 0.58, 0.55), board=0.3))
        grass_tufts(-1.6, -0.6, 1.6, 0.7, -0.6, 160, foliage('Capim', (0.34, 0.30, 0.14)), seed=4, h=1.3)
        box(-3, -3, -0.8, 3, 0.8, -0.6, earth('T', (0.16, 0.13, 0.1)))
        camera((0.2, -2.6, 0.2), (0, 0.4, 0.3), 50, dof=2.6, fstop=2.8)


{'pedra_alta': pedra_alta, 'jardins': jardins, 'atelier': atelier, 'lago': lago, 'planos': planos, 'macro': macro}[SC]()
render(OUT + SC + '-' + VIEW + '.png')
