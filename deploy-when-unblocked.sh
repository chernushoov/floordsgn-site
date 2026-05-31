#!/bin/zsh
# FloorDSGN — one-command production deploy of the "everything except Hebrew" build.
# Use the moment Netlify credits are restored (account hit "credit usage exceeded" 2026-05-30).
# Builds fresh, strips the (unreviewed) Hebrew /he/ surface, zips dist, uploads via Netlify API.
set -euo pipefail
cd "$(dirname "$0")"

echo "[1/4] build"; npm run build

echo "[2/4] strip unreviewed Hebrew from the artifact (source untouched)"
rm -rf dist/articles/he dist/he.css
find dist -maxdepth 1 -name '*.md' -delete 2>/dev/null || true
node -e 'const fs=require("fs"),p=require("path");let n=0;(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(e.name.endsWith(".html")){let s=fs.readFileSync(f,"utf8"),b=s;s=s.replace(/<button[^>]*data-lang=["\x27]he["\x27][^>]*>[^<]*<\/button>/gi,"");if(s!==b){fs.writeFileSync(f,s);n++;}}}})("dist");console.log("   HE buttons stripped from",n,"files")'

echo "[3/4] zip"
ZIP="/tmp/floordsgn-deploy-$(date +%s).zip"
(cd dist && zip -r -q "$ZIP" . -x '*.DS_Store')
echo "   $ZIP ($(du -h "$ZIP" | cut -f1))"

echo "[4/4] deploy to Netlify (site floordsgn / floordsgn.com)"
TOKEN=$(python3 -c "import json;d=json.load(open('$HOME/Library/Preferences/netlify/config.json'));print(next(iter(d['users'].values()))['auth']['token'])")
/usr/bin/curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary "@$ZIP" \
  "https://api.netlify.com/api/v1/sites/7be3f64b-df4a-470b-97d3-e437fe71d26b/deploys" \
  | python3 -c "import json,sys;d=json.load(sys.stdin);print('deploy:',d.get('id'),d.get('state'),d.get('error') or d.get('message') or 'ok')"
echo "Then verify: curl -I https://floordsgn.com"
