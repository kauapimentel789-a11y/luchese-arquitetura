"""Small procedural toolkit for architectural renders with Blender/Cycles (bpy)."""
import bpy, math, random
from mathutils import Vector

# ---------------------------------------------------------------- scene

def reset(samples=128, w=2400, h=1350):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s = bpy.context.scene
    s.render.engine = 'CYCLES'
    s.cycles.device = 'CPU'
    s.cycles.samples = samples
    s.cycles.use_adaptive_sampling = True
    s.cycles.adaptive_threshold = 0.02
    s.cycles.use_denoising = True
    s.cycles.denoiser = 'OPENIMAGEDENOISE'
    s.cycles.max_bounces = 8
    s.cycles.diffuse_bounces = 4
    s.cycles.glossy_bounces = 4
    s.cycles.transmission_bounces = 8
    s.cycles.caustics_reflective = False
    s.cycles.caustics_refractive = False
    s.cycles.blur_glossy = 1.0
    s.cycles.sample_clamp_indirect = 8
    s.render.resolution_x = w
    s.render.resolution_y = h
    s.render.resolution_percentage = 100
    s.render.image_settings.file_format = 'PNG'
    s.render.image_settings.color_depth = '16'
    s.view_settings.view_transform = 'AgX'
    s.view_settings.exposure = 0.0
    s.render.threads_mode = 'AUTO'
    return s


def world_sky(elev=12, rot=40, strength=1.0, sun=True, air=1.0, aerosol=1.0, sky_type='MULTIPLE_SCATTERING'):
    w = bpy.data.worlds.new('World')
    bpy.context.scene.world = w
    nt = w.node_tree
    nt.nodes.clear()
    sky = nt.nodes.new('ShaderNodeTexSky')
    sky.sky_type = sky_type
    sky.sun_elevation = math.radians(elev)
    sky.sun_rotation = math.radians(rot)
    sky.sun_disc = sun
    try:
        sky.air_density = air
        sky.aerosol_density = aerosol
    except Exception:
        pass
    bg = nt.nodes.new('ShaderNodeBackground')
    bg.inputs['Strength'].default_value = strength
    out = nt.nodes.new('ShaderNodeOutputWorld')
    nt.links.new(sky.outputs[0], bg.inputs[0])
    nt.links.new(bg.outputs[0], out.inputs[0])
    return sky


def sun_lamp(elev=12, rot=40, energy=4.0, angle=1.0, color=(1.0, 0.86, 0.7)):
    d = bpy.data.lights.new('Sun', 'SUN')
    d.energy = energy
    d.angle = math.radians(angle)
    d.color = color
    o = bpy.data.objects.new('Sun', d)
    bpy.context.collection.objects.link(o)
    # sky rotation convention: direction the light comes FROM, azimuth rot
    o.rotation_euler = (math.radians(90 - elev), 0, math.radians(rot + 90))
    return o


def area(loc, size=(1, 1), energy=200, color=(1, 0.8, 0.6), rot=(0, 0, 0), shape='RECTANGLE', visible=False):
    d = bpy.data.lights.new('Area', 'AREA')
    d.shape = shape
    d.size = size[0]
    d.size_y = size[1]
    d.energy = energy
    d.color = color
    o = bpy.data.objects.new('Area', d)
    o.location = loc
    o.rotation_euler = rot
    o.visible_camera = visible
    bpy.context.collection.objects.link(o)
    return o


def point(loc, energy=50, color=(1, 0.75, 0.5), radius=0.05):
    d = bpy.data.lights.new('Pt', 'POINT')
    d.energy = energy
    d.color = color
    d.shadow_soft_size = radius
    o = bpy.data.objects.new('Pt', d)
    o.location = loc
    bpy.context.collection.objects.link(o)
    return o


def camera(loc, target, lens=35, shift=(0, 0), dof=None, fstop=4.0, sensor=36):
    c = bpy.data.cameras.new('Cam')
    c.lens = lens
    c.sensor_width = sensor
    c.shift_x, c.shift_y = shift
    c.clip_end = 5000
    o = bpy.data.objects.new('Cam', c)
    bpy.context.collection.objects.link(o)
    o.location = loc
    direction = Vector(target) - Vector(loc)
    o.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    if dof:
        c.dof.use_dof = True
        c.dof.focus_distance = dof
        c.dof.aperture_fstop = fstop
    bpy.context.scene.camera = o
    return o


def render(path, w=None, h=None, samples=None):
    s = bpy.context.scene
    if w: s.render.resolution_x = w
    if h: s.render.resolution_y = h
    if samples: s.cycles.samples = samples
    s.render.filepath = path
    bpy.ops.render.render(write_still=True)

# ---------------------------------------------------------------- materials

def _mat(name):
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    return m, nt, p


def _pos(nt, scale=1.0):
    g = nt.nodes.new('ShaderNodeNewGeometry')
    if scale == 1.0:
        return g.outputs['Position']
    v = nt.nodes.new('ShaderNodeVectorMath'); v.operation = 'SCALE'
    v.inputs['Scale'].default_value = scale
    nt.links.new(g.outputs['Position'], v.inputs[0])
    return v.outputs[0]


def _noise(nt, vec, scale, detail=8, rough=0.6):
    n = nt.nodes.new('ShaderNodeTexNoise')
    n.inputs['Scale'].default_value = scale
    n.inputs['Detail'].default_value = detail
    n.inputs['Roughness'].default_value = rough
    nt.links.new(vec, n.inputs['Vector'])
    return n


def _ramp(nt, src, c0, c1, p0=0.3, p1=0.7):
    r = nt.nodes.new('ShaderNodeValToRGB')
    r.color_ramp.elements[0].position = p0
    r.color_ramp.elements[0].color = (*c0, 1)
    r.color_ramp.elements[1].position = p1
    r.color_ramp.elements[1].color = (*c1, 1)
    nt.links.new(src, r.inputs[0])
    return r


def _bump(nt, height, strength=0.2, dist=0.02, normal=None):
    b = nt.nodes.new('ShaderNodeBump')
    b.inputs['Strength'].default_value = strength
    b.inputs['Distance'].default_value = dist
    nt.links.new(height, b.inputs['Height'])
    if normal is not None:
        nt.links.new(normal, b.inputs['Normal'])
    return b


def _mix(nt, a, b, fac, blend='MIX'):
    m = nt.nodes.new('ShaderNodeMix'); m.data_type = 'RGBA'; m.blend_type = blend
    if isinstance(fac, float): m.inputs['Factor'].default_value = fac
    else: nt.links.new(fac, m.inputs['Factor'])
    for sock, val in ((m.inputs[6], a), (m.inputs[7], b)):
        if isinstance(val, tuple): sock.default_value = (*val, 1)
        else: nt.links.new(val, sock)
    return m.outputs[2]


def concrete(name='Concreto', tone=(0.42, 0.40, 0.37), board=0.18, rough=0.82, stains=True):
    m, nt, p = _mat(name)
    pos = _pos(nt)
    n1 = _noise(nt, pos, 3.0, 10, 0.65)
    n2 = _noise(nt, pos, 28.0, 6, 0.7)
    dark = tuple(c * 0.72 for c in tone); light = tuple(min(1, c * 1.12) for c in tone)
    col = _ramp(nt, n1.outputs['Fac'], dark, light, 0.35, 0.68)
    fine = _ramp(nt, n2.outputs['Fac'], (0.85, 0.85, 0.85), (1.05, 1.05, 1.05), 0.4, 0.6)
    c = _mix(nt, col.outputs[0], fine.outputs[0], 1.0, 'MULTIPLY')
    h = n2.outputs['Fac']
    if board:
        # horizontal formwork bands
        sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(pos, sep.inputs[0])
        wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.bands_direction = 'Z'
        wv.inputs['Scale'].default_value = 1.0 / board / 2.0
        wv.inputs['Distortion'].default_value = 0.2
        wv.inputs['Detail'].default_value = 1
        nt.links.new(pos, wv.inputs['Vector'])
        r = _ramp(nt, wv.outputs['Fac'], (0, 0, 0), (1, 1, 1), 0.02, 0.08)
        band = _ramp(nt, wv.outputs['Fac'], (0.9, 0.9, 0.9), (1, 1, 1), 0.0, 0.06)
        c = _mix(nt, c, band.outputs[0], 1.0, 'MULTIPLY')
        add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'
        mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = 0.6
        nt.links.new(r.outputs[0], mul.inputs[0])
        nt.links.new(n2.outputs['Fac'], add.inputs[0]); nt.links.new(mul.outputs[0], add.inputs[1])
        h = add.outputs[0]
    if stains:
        n3 = _noise(nt, pos, 0.7, 4, 0.5)
        st = _ramp(nt, n3.outputs['Fac'], (0.8, 0.79, 0.77), (1, 1, 1), 0.38, 0.6)
        c = _mix(nt, c, st.outputs[0], 1.0, 'MULTIPLY')
    nt.links.new(c, p.inputs['Base Color'])
    rr = _ramp(nt, n1.outputs['Fac'], (rough - 0.08,) * 3, (rough + 0.08,) * 3)
    nt.links.new(rr.outputs[0], p.inputs['Roughness'])
    b = _bump(nt, h, 0.25, 0.01)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def plaster(name='Reboco', tone=(0.78, 0.75, 0.70), rough=0.9):
    m, nt, p = _mat(name)
    pos = _pos(nt)
    n = _noise(nt, pos, 9, 8, 0.6)
    col = _ramp(nt, n.outputs['Fac'], tuple(c * 0.93 for c in tone), tone, 0.3, 0.7)
    nt.links.new(col.outputs[0], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    b = _bump(nt, n.outputs['Fac'], 0.08, 0.01)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def stone(name='Pedra', tone=(0.55, 0.49, 0.41), course=0.22, length=0.7, rough=0.85, axis='XZ'):
    """Stacked natural stone cladding using brick texture on wall-plane coords."""
    m, nt, p = _mat(name)
    pos = _pos(nt)
    sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(pos, sep.inputs[0])
    u = nt.nodes.new('ShaderNodeMath'); u.operation = 'ADD'
    nt.links.new(sep.outputs[0], u.inputs[0]); nt.links.new(sep.outputs[1], u.inputs[1])
    comb = nt.nodes.new('ShaderNodeCombineXYZ')
    nt.links.new(u.outputs[0], comb.inputs[0]); nt.links.new(sep.outputs[2], comb.inputs[1])
    vec = comb.outputs[0]
    if axis == 'XY':
        comb2 = nt.nodes.new('ShaderNodeCombineXYZ')
        nt.links.new(sep.outputs[0], comb2.inputs[0]); nt.links.new(sep.outputs[1], comb2.inputs[1])
        vec = comb2.outputs[0]
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.012
    br.inputs['Mortar Smooth'].default_value = 0.4
    br.inputs['Bias'].default_value = 0.0
    br.inputs['Brick Width'].default_value = length
    br.inputs['Row Height'].default_value = course
    br.offset = 0.37; br.squash = 0.55; br.squash_frequency = 2
    br.inputs['Mortar Size'].default_value = 0.006
    dark = tuple(c * 0.62 for c in tone)
    br.inputs['Color1'].default_value = (*tone, 1)
    br.inputs['Color2'].default_value = (*dark, 1)
    br.inputs['Mortar'].default_value = (*(c * 0.45 for c in tone), 1)
    nt.links.new(vec, br.inputs['Vector'])
    n = _noise(nt, pos, 14, 10, 0.7)
    nv = _ramp(nt, n.outputs['Fac'], (0.78, 0.76, 0.72), (1.12, 1.08, 1.02), 0.3, 0.7)
    c = _mix(nt, br.outputs['Color'], nv.outputs[0], 1.0, 'MULTIPLY')
    nt.links.new(c, p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    inv = nt.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0
    nt.links.new(br.outputs['Fac'], inv.inputs[1])
    hh = nt.nodes.new('ShaderNodeMath'); hh.operation = 'MULTIPLY_ADD'
    nt.links.new(n.outputs['Fac'], hh.inputs[0]); hh.inputs[1].default_value = 0.35
    nt.links.new(inv.outputs[0], hh.inputs[2])
    b = _bump(nt, hh.outputs[0], 0.6, 0.03)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def stone_slab(name='PedraLisa', tone=(0.80, 0.76, 0.69), vein=(0.62, 0.57, 0.50), rough=0.35, scale=1.5):
    """Honed travertine / limestone slab."""
    m, nt, p = _mat(name)
    pos = _pos(nt)
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.bands_direction = 'X'
    wv.inputs['Scale'].default_value = scale
    wv.inputs['Distortion'].default_value = 6
    wv.inputs['Detail'].default_value = 6
    wv.inputs['Detail Scale'].default_value = 1.2
    nt.links.new(pos, wv.inputs['Vector'])
    col = _ramp(nt, wv.outputs['Fac'], vein, tone, 0.1, 0.55)
    n = _noise(nt, pos, 40, 6, 0.6)
    nv = _ramp(nt, n.outputs['Fac'], (0.9, 0.9, 0.9), (1.04, 1.04, 1.04), 0.3, 0.7)
    c = _mix(nt, col.outputs[0], nv.outputs[0], 1.0, 'MULTIPLY')
    nt.links.new(c, p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    b = _bump(nt, n.outputs['Fac'], 0.05, 0.005)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def wood(name='Madeira', tone=(0.36, 0.22, 0.12), dir='X', rough=0.55, ring=22.0, coat=0.0):
    m, nt, p = _mat(name)
    pos = _pos(nt)
    mp = nt.nodes.new('ShaderNodeMapping')
    nt.links.new(pos, mp.inputs['Vector'])
    # stretch along grain direction
    sc = {'X': (0.08, 1.0, 1.0), 'Y': (1.0, 0.08, 1.0), 'Z': (1.0, 1.0, 0.08)}[dir]
    mp.inputs['Scale'].default_value = sc
    n = _noise(nt, mp.outputs[0], 2.0, 4, 0.5)
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_type = 'RINGS'; wv.rings_direction = 'SPHERICAL'
    wv.inputs['Scale'].default_value = ring
    wv.inputs['Distortion'].default_value = 8
    wv.inputs['Detail'].default_value = 3
    nt.links.new(mp.outputs[0], wv.inputs['Vector'])
    dark = tuple(c * 0.6 for c in tone); light = tuple(min(1, c * 1.25) for c in tone)
    col = _ramp(nt, wv.outputs['Fac'], dark, light, 0.2, 0.8)
    fine = _noise(nt, mp.outputs[0], 60, 4, 0.7)
    fr = _ramp(nt, fine.outputs['Fac'], (0.85, 0.85, 0.85), (1.05, 1.05, 1.05), 0.3, 0.7)
    c = _mix(nt, col.outputs[0], fr.outputs[0], 1.0, 'MULTIPLY')
    nt.links.new(c, p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    p.inputs['Coat Weight'].default_value = coat
    b = _bump(nt, wv.outputs['Fac'], 0.08, 0.004)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def glass(name='Vidro', tint=(0.92, 0.96, 0.95), rough=0.0):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*tint, 1)
    p.inputs['Transmission Weight'].default_value = 1.0
    p.inputs['Roughness'].default_value = rough
    p.inputs['IOR'].default_value = 1.45
    try: p.inputs['Thin Wall'].default_value = True
    except Exception: pass
    return m


def fluted_glass(name='VidroCanelado'):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (0.95, 0.97, 0.96, 1)
    p.inputs['Transmission Weight'].default_value = 1.0
    p.inputs['Roughness'].default_value = 0.12
    pos = _pos(nt)
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.wave_profile = 'SIN'; wv.bands_direction = 'X'
    wv.inputs['Scale'].default_value = 30
    nt.links.new(pos, wv.inputs['Vector'])
    b = _bump(nt, wv.outputs['Fac'], 1.0, 0.02)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def metal(name='Metal', tone=(0.12, 0.11, 0.10), rough=0.35, metallic=1.0):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*tone, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = rough
    pos = _pos(nt)
    n = _noise(nt, pos, 30, 6, 0.6)
    r = _ramp(nt, n.outputs['Fac'], (rough - 0.08,) * 3, (rough + 0.1,) * 3)
    nt.links.new(r.outputs[0], p.inputs['Roughness'])
    return m


def bronze(name='Bronze'):
    return metal(name, (0.42, 0.29, 0.17), 0.38, 1.0)


def matte(name, tone, rough=0.8, sheen=0.0):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*tone, 1)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Sheen Weight'].default_value = sheen
    return m


def fabric(name='Linho', tone=(0.72, 0.67, 0.58)):
    m, nt, p = _mat(name)
    pos = _pos(nt)
    n = _noise(nt, pos, 120, 4, 0.7)
    r = _ramp(nt, n.outputs['Fac'], tuple(c * 0.9 for c in tone), tone)
    nt.links.new(r.outputs[0], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = 0.95
    p.inputs['Sheen Weight'].default_value = 0.6
    b = _bump(nt, n.outputs['Fac'], 0.15, 0.003)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def emissive(name, color=(1, 0.8, 0.55), strength=8):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Emission Color'].default_value = (*color, 1)
    p.inputs['Emission Strength'].default_value = strength
    return m


def water(name='Agua', tone=(0.05, 0.16, 0.17), wave=0.15):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (*tone, 1)
    p.inputs['Roughness'].default_value = 0.02
    p.inputs['Transmission Weight'].default_value = 0.0
    p.inputs['IOR'].default_value = 1.33
    p.inputs['Specular IOR Level'].default_value = 0.6
    pos = _pos(nt)
    n = _noise(nt, pos, 1.6, 4, 0.5)
    b = _bump(nt, n.outputs['Fac'], wave, 0.05)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def pool_water(name='Piscina'):
    m, nt, p = _mat(name)
    p.inputs['Base Color'].default_value = (0.85, 0.95, 0.95, 1)
    p.inputs['Transmission Weight'].default_value = 1.0
    p.inputs['Roughness'].default_value = 0.0
    p.inputs['IOR'].default_value = 1.33
    pos = _pos(nt)
    n = _noise(nt, pos, 2.5, 3, 0.5)
    b = _bump(nt, n.outputs['Fac'], 0.12, 0.05)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def grass(name='Grama', tone=(0.10, 0.14, 0.05)):
    m, nt, p = _mat(name)
    pos = _pos(nt)
    n = _noise(nt, pos, 0.6, 6, 0.6)
    n2 = _noise(nt, pos, 30, 4, 0.7)
    r = _ramp(nt, n.outputs['Fac'], tuple(c * 0.7 for c in tone), (tone[0] * 1.6, tone[1] * 1.3, tone[2] * 1.2), 0.3, 0.7)
    r2 = _ramp(nt, n2.outputs['Fac'], (0.7, 0.7, 0.7), (1.1, 1.1, 1.1))
    c = _mix(nt, r.outputs[0], r2.outputs[0], 1.0, 'MULTIPLY')
    nt.links.new(c, p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = 0.9
    b = _bump(nt, n2.outputs['Fac'], 0.6, 0.02)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m


def earth(name='Terra', tone=(0.20, 0.16, 0.11)):
    return grass(name, tone)


def foliage(name='Folhagem', tone=(0.07, 0.12, 0.04)):
    m, nt, p = _mat(name)
    pos = _pos(nt)
    n = _noise(nt, pos, 6, 6, 0.65)
    r = _ramp(nt, n.outputs['Fac'], tuple(c * 0.55 for c in tone), (tone[0] * 1.8, tone[1] * 1.5, tone[2] * 1.3), 0.35, 0.65)
    nt.links.new(r.outputs[0], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = 0.7
    p.inputs['Subsurface Weight'].default_value = 0.0
    try:
        p.inputs['Diffuse Roughness'].default_value = 0.5
    except Exception: pass
    # leafy breakup: strong bump
    n2 = _noise(nt, pos, 22, 4, 0.8)
    b = _bump(nt, n2.outputs['Fac'], 1.0, 0.08)
    nt.links.new(b.outputs[0], p.inputs['Normal'])
    return m

# ---------------------------------------------------------------- geometry

def link(o):
    bpy.context.collection.objects.link(o)
    return o


def box(x0, y0, z0, x1, y1, z1, mat=None, bevel=0.006, name='Box'):
    """Axis aligned box from min corner to max corner (meters)."""
    import bmesh
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 if v.co.x < 0 else x1
        v.co.y = y0 if v.co.y < 0 else y1
        v.co.z = z0 if v.co.z < 0 else z1
    bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new(name, me))
    if mat: me.materials.append(mat)
    if bevel:
        md = o.modifiers.new('bev', 'BEVEL'); md.width = bevel; md.segments = 2
        md.limit_method = 'ANGLE'
    return o


def plane(x0, y0, x1, y1, z=0, mat=None, name='Plane', subdiv=0):
    return box(x0, y0, z - 0.02, x1, y1, z, mat, 0, name)


def cyl(x, y, z0, z1, r, mat=None, verts=32, name='Cyl'):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=z1 - z0, location=(x, y, (z0 + z1) / 2))
    o = bpy.context.active_object; o.name = name
    if mat: o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o


def sphere(loc, r, mat=None, sub=3, name='Sph', scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=loc)
    o = bpy.context.active_object; o.name = name; o.scale = scale
    if mat: o.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return o


def displace(o, strength=0.3, size=0.6, name='Disp'):
    t = bpy.data.textures.new(name, 'CLOUDS'); t.noise_scale = size; t.noise_depth = 3
    md = o.modifiers.new('disp', 'DISPLACE'); md.texture = t; md.strength = strength
    md.mid_level = 0.5
    return o


def terrain(x0, y0, x1, y1, mat, height_fn=None, res=120, name='Terrain'):
    import bmesh
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    nx = res; ny = res
    verts = []
    for j in range(ny + 1):
        row = []
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx
            y = y0 + (y1 - y0) * j / ny
            z = height_fn(x, y) if height_fn else 0
            row.append(bm.verts.new((x, y, z)))
        verts.append(row)
    for j in range(ny):
        for i in range(nx):
            bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = link(bpy.data.objects.new(name, me))
    o.data.materials.append(mat)
    return o


_leaf_mats = {}


def tree(x, y, z=0, h=7.0, spread=3.0, mat=None, trunk_mat=None, seed=0, clusters=9, slim=False):
    rnd = random.Random(seed)
    tm = trunk_mat or matte('Tronco', (0.12, 0.09, 0.07), 0.9)
    cyl(x, y, z, z + h * 0.62, 0.12 if not slim else 0.08, tm, 12, 'Tronco')
    # a few branches
    for k in range(3):
        a = rnd.uniform(0, 6.28)
        bx, by = x + math.cos(a) * spread * 0.35, y + math.sin(a) * spread * 0.35
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.05, depth=spread * 0.6,
                                            location=((x + bx) / 2, (y + by) / 2, z + h * 0.55))
        br = bpy.context.active_object
        br.rotation_euler = (math.radians(55) * math.sin(a), -math.radians(55) * math.cos(a), 0)
        br.data.materials.append(tm)
    fm = mat or foliage()
    for k in range(clusters):
        a = rnd.uniform(0, 6.28); rr = rnd.uniform(0, spread * 0.55)
        cz = z + h * rnd.uniform(0.6, 0.92)
        s = rnd.uniform(0.7, 1.15) * spread * 0.42
        o = sphere((x + math.cos(a) * rr, y + math.sin(a) * rr, cz), s, fm, 4, 'Copa',
                   (1, 1, rnd.uniform(0.6, 0.85) if not slim else 1.4))
        displace(o, s * 0.55, s * 0.35, 'leafdisp%d' % seed)


def shrub(x, y, z=0, r=0.5, mat=None, seed=0):
    rnd = random.Random(seed)
    o = sphere((x, y, z + r * 0.5), r, mat or foliage(), 3, 'Arbusto', (1, 1, rnd.uniform(0.55, 0.8)))
    displace(o, r * 0.5, r * 0.3)
    return o


def grass_tufts(x0, y0, x1, y1, z=0.0, n=400, mat=None, seed=1, h=0.35):
    """Ornamental grasses as clusters of thin blades (cones)."""
    import bmesh
    rnd = random.Random(seed)
    me = bpy.data.meshes.new('Tufts'); bm = bmesh.new()
    for i in range(n):
        cx, cy = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        for b in range(9):
            a = rnd.uniform(0, 6.28); lean = rnd.uniform(0.05, 0.25)
            hh = h * rnd.uniform(0.6, 1.3)
            base = Vector((cx + rnd.uniform(-0.03, 0.03), cy + rnd.uniform(-0.03, 0.03), z))
            tip = base + Vector((math.cos(a) * lean, math.sin(a) * lean, hh))
            side = Vector((-math.sin(a), math.cos(a), 0)) * 0.008
            v1 = bm.verts.new(base - side); v2 = bm.verts.new(base + side); v3 = bm.verts.new(tip)
            bm.faces.new((v1, v2, v3))
    bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new('Tufts', me))
    o.data.materials.append(mat or foliage('Capim', (0.20, 0.18, 0.08)))
    return o


# ---------------------------------------------------------------- instanced particle trees

def _leaf_mesh(size=0.12):
    import bmesh
    me = bpy.data.meshes.new('Leaf'); bm = bmesh.new()
    pts = [(0, -1), (0.45, -0.5), (0.5, 0.2), (0.25, 0.75), (0, 1), (-0.25, 0.75), (-0.5, 0.2), (-0.45, -0.5)]
    vs = [bm.verts.new((x * size * 0.5, y * size, 0)) for x, y in pts]
    bm.faces.new(vs)
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new('Leaf', me)
    return o


def tree_master(name, h=8, spread=4.5, leaf_mat=None, trunk_mat=None, seed=0, leaves=9000, leaf=0.16,
                crowns=6, columnar=False, palm=False):
    """Builds a tree in its own (excluded) collection and returns that collection for instancing."""
    rnd = random.Random(seed)
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    prev = bpy.context.view_layer.active_layer_collection
    bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children[name]
    tm = trunk_mat or matte('Tronco', (0.10, 0.08, 0.06), 0.9)
    lm = leaf_mat or foliage()
    # trunk + branches
    cyl(0, 0, 0, h * (0.55 if not columnar else 0.4), max(0.06, spread * 0.03), tm, 10, 'Tronco')
    leaf = _leaf_mesh(leaf); leaf.data.materials.append(lm)
    bpy.context.collection.objects.link(leaf)
    leaf.hide_render = True; leaf.hide_viewport = True
    for k in range(crowns):
        a = rnd.uniform(0, 6.28)
        rr = rnd.uniform(0.1, 0.5) * spread * (0.4 if columnar else 1)
        cz = h * rnd.uniform(0.55, 0.85)
        sc = spread * rnd.uniform(0.32, 0.48) * (0.6 if columnar else 1)
        cx, cy = math.cos(a) * rr, math.sin(a) * rr
        # branch to the crown
        d = Vector((cx, cy, cz - h * 0.45)); L = d.length
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=max(0.03, spread * 0.012), depth=L,
                                            location=(cx / 2, cy / 2, h * 0.45 + d.z / 2))
        br = bpy.context.active_object; br.data.materials.append(tm)
        br.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
        crown = sphere((cx, cy, cz), sc, None, 3, 'Crown', (1, 1, 0.7 if not columnar else 1.8))
        displace(crown, sc * 0.6, sc * 0.4, 'cd%d' % seed)
        bpy.context.view_layer.objects.active = crown
        crown.modifiers.new('ps', 'PARTICLE_SYSTEM')
        ps = crown.particle_systems[0].settings
        ps.count = leaves // crowns
        ps.frame_start = ps.frame_end = 1
        ps.emit_from = 'VOLUME' if k % 2 else 'FACE'
        ps.distribution = 'RAND'
        ps.use_emit_random = True
        ps.physics_type = 'NO'
        ps.render_type = 'OBJECT'
        ps.instance_object = leaf
        ps.particle_size = 1.0
        ps.size_random = 0.5
        ps.use_rotations = True
        ps.rotation_mode = 'NONE'
        ps.phase_factor_random = 2.0
        ps.rotation_factor_random = 1.0
        ps.use_rotation_instance = True
        ps.hair_length = 1
        crown.show_instancer_for_render = False
        crown.show_instancer_for_viewport = False
        # dark inner mass so gaps aren't see-through to the sky
        inner = sphere((cx, cy, cz), sc * 0.55, matte('Sombra copa', (0.035, 0.05, 0.02), 1), 2, 'Inner',
                       (1, 1, 0.7 if not columnar else 1.8))
        displace(inner, sc * 0.3, sc * 0.5)
    bpy.context.view_layer.active_layer_collection = prev
    bpy.context.view_layer.layer_collection.children[name].exclude = True
    return col


def place(col, x, y, z=0, scale=1.0, rot=None):
    e = bpy.data.objects.new('Inst', None)
    e.instance_type = 'COLLECTION'; e.instance_collection = col
    e.location = (x, y, z); e.scale = (scale,) * 3
    e.rotation_euler = (0, 0, rot if rot is not None else random.uniform(0, 6.28))
    bpy.context.scene.collection.objects.link(e)
    return e
