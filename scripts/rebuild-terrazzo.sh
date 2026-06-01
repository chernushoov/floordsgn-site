#!/bin/zsh
# Rebuild all 3 terrazzo materials (bases + design tiles) from the owner's REAL terrazzo
# photos. Replaces the kaleidoscope/stock-photo junk. Run from 3d-assets/.
set -e
SRC="$HOME/Desktop/текстуры /текстуры террацо"
PY="python3 ../scripts/rebuild-texture.py"
mkdir -p textures-v4/_designs/terrazzo-cement textures-v4/_designs/terrazzo-multi textures-v4/_designs/terrazzo-epoxy

echo "### BASES (full PBR, flat polished normal) ###"
python3 ../scripts/rebuild-texture.py "$SRC/cement-concrete-texture-copy-space.jpg"     textures-v4/terrazzo-cement 4096 0.6 0.92
python3 ../scripts/rebuild-texture.py "$SRC/c2676cda97fb8d4b08bdf5f61df9e4cf.jpg"       textures-v4/terrazzo-multi  2048 0.7 0.90
python3 ../scripts/rebuild-texture.py "$SRC/macrophotography-terrazzo-slab-texture.jpg" textures-v4/terrazzo-epoxy  4096 0.6 0.92

echo "### terrazzo-cement designs ###"
python3 ../scripts/rebuild-texture.py "$SRC/cement-concrete-texture-copy-space.jpg"   textures-v4/_designs/terrazzo-cement/grey-classic.jpg     2048 0 0.92
python3 ../scripts/rebuild-texture.py "$SRC/cement-concrete-texture-copy-space 2.jpg" textures-v4/_designs/terrazzo-cement/grey-dense.jpg       2048 0 0.92
python3 ../scripts/rebuild-texture.py "$SRC/texture-natural-stone.jpg"                textures-v4/_designs/terrazzo-cement/grey-blue.jpg        2048 0 0.92
python3 ../scripts/rebuild-texture.py "$SRC/rock-texture-background-detail.jpg"       textures-v4/_designs/terrazzo-cement/light-fine.jpg       2048 0 0.92
python3 ../scripts/rebuild-texture.py "$SRC/1.61gX4.jpg"                              textures-v4/_designs/terrazzo-cement/installed-light.jpg  2048 0 0.55

echo "### terrazzo-multi designs ###"
python3 ../scripts/rebuild-texture.py "$SRC/c2676cda97fb8d4b08bdf5f61df9e4cf.jpg"                                          textures-v4/_designs/terrazzo-multi/white-multi.jpg  2048 0 0.90
python3 ../scripts/rebuild-texture.py "$SRC/1627478409_7-kartinkin-com-p-terratstso-stoleshnitsa-tekstura-krasivo-7.jpg"  textures-v4/_designs/terrazzo-multi/colorful-big.jpg 2048 0 0.55
python3 ../scripts/rebuild-texture.py "$SRC/dna-terrazzo-graphite-32x37-253274.jpg"                                        textures-v4/_designs/terrazzo-multi/graphite-dna.jpg 2048 0 0.50
python3 ../scripts/rebuild-texture.py "$SRC/dna-terrazzo-white-colours-32x37-253275.jpg"                                   textures-v4/_designs/terrazzo-multi/white-dna.jpg    2048 0 0.50

echo "### terrazzo-epoxy designs ###"
python3 ../scripts/rebuild-texture.py "$SRC/macrophotography-terrazzo-slab-texture.jpg" textures-v4/_designs/terrazzo-epoxy/dark-classic.jpg  2048 0 0.92
python3 ../scripts/rebuild-texture.py "$SRC/Terrazzo_Black_Lappato_75x75.jpg"           textures-v4/_designs/terrazzo-epoxy/black-lappato.jpg 2048 0 0.90
python3 ../scripts/rebuild-texture.py "$SRC/dark-mosaic-textured-background.jpg"        textures-v4/_designs/terrazzo-epoxy/dark-mosaic.jpg   2048 0 0.92
python3 ../scripts/rebuild-texture.py "$SRC/dna-terrazzo-graphite-32x37-253274.jpg"     textures-v4/_designs/terrazzo-epoxy/graphite.jpg      2048 0 0.50
echo "### DONE ###"
