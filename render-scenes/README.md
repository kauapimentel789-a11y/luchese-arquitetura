# Cenas 3D das renderizações

Scripts Blender (Python/bpy) que geram todas as imagens do site. Requer Blender 4.2+ ou `pip install bpy` (Python 3.13).

```bash
python scene_mirante.py hero 2200 1238 64     # vista, largura, altura, amostras
python scenes.py jardins kitchen 1200 1500 40  # cenas: pedra_alta, jardins, atelier, lago, planos, macro
```

As saídas vão para `/tmp/claude-0/render/out/` (ajuste `OUT` nos scripts). Depois rode `python scripts/process_images.py <pasta>` na raiz do site.
