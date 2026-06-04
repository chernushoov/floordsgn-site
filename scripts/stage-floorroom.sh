#!/bin/zsh
# Assemble the FloorDSGN Studio PREVIEW bundle for the isolated CF Pages branch `floorroom`.
# Root index.html = floor-room.html (the 3D studio). Prod (main → floordsgn.com) is NOT touched.
# Usage: scripts/stage-floorroom.sh [stageDir]   (default /tmp/floorroom-stage)
set -euo pipefail
cd "$(dirname "$0")/.."
STAGE="${1:-/tmp/floorroom-stage}"
rm -rf "$STAGE"; mkdir -p "$STAGE/3d-assets"

cp floor-room.html "$STAGE/index.html"     # alias root = studio
cp floor-room.html "$STAGE/floor-room.html"
cp studio.css studio.js _headers "$STAGE/"

# Full asset tree → no missing texture/HDRI/design (wrangler dedupes unchanged files on upload).
cp -R 3d-assets/. "$STAGE/3d-assets/"

echo "staged → $STAGE"
du -sh "$STAGE"
echo "--- top level ---"; ls "$STAGE"
echo "--- HDRIs ---"; ls "$STAGE/3d-assets/textures-v4/_hdri/"*.hdr
echo "--- ?v token in index ---"; grep -oE "studio\.(css|js)\?v=[0-9a-zA-Z-]+" "$STAGE/index.html"
