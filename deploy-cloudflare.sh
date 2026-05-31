#!/bin/zsh
# FloorDSGN — PRODUCTION deploy to Cloudflare Pages (project: floordsgn → floordsgn.com).
# No Netlify. Builds fresh, strips the (unreviewed) Hebrew /he/ surface, uploads via
# wrangler direct-upload to the project's production branch (so it lands on the apex).
#
# Creds: auto-loaded from macOS keychain (service "ai.openclaw.runtime", accounts
# CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID) — the same store the OpenClaw runtime uses.
# If the token is absent, the script still BUILDS + VERIFIES the artifact, prints the
# one-time unblock command, and exits 0 (safe to run unattended / in the loop).
set -euo pipefail
cd "$(dirname "$0")"

PROJECT="floordsgn"
KCLOADER="/Users/agentmachine/Work/02-Projects/meltbot/moltbot-dashboard/scripts/load-keychain-secrets.sh"

# 1) creds (best-effort; never fail the build if missing)
if [ -f "$KCLOADER" ]; then
  source "$KCLOADER"
  load_keychain_secret CLOUDFLARE_API_TOKEN  >/dev/null 2>&1 || true
  load_keychain_secret CLOUDFLARE_ACCOUNT_ID >/dev/null 2>&1 || true
fi
HAVE_CREDS=0
if [ -n "${CLOUDFLARE_API_TOKEN:-}" ] && [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then HAVE_CREDS=1; fi

# 2) build
echo "[1/4] build (npm run build -> dist/)"
npm run build

# 3) strip unreviewed Hebrew from the artifact (source tree untouched)
echo "[2/4] strip unreviewed Hebrew /he/ from dist (source untouched)"
rm -rf dist/articles/he dist/he.css
find dist -maxdepth 1 -name '*.md' -delete 2>/dev/null || true
node -e 'const fs=require("fs"),p=require("path");let n=0;(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(e.name.endsWith(".html")){let s=fs.readFileSync(f,"utf8"),b=s;s=s.replace(/<button[^>]*data-lang=["\x27]he["\x27][^>]*>[^<]*<\/button>/gi,"");if(s!==b){fs.writeFileSync(f,s);n++;}}}})("dist");console.log("   HE buttons stripped from",n,"files")'

# remove non-public dev files the build may have copied into the artifact
find dist -name '*.sh' -delete 2>/dev/null || true
find dist -maxdepth 1 \( -name '.env*' -o -name '*.log' -o -name 'netlify.toml' \) -delete 2>/dev/null || true
rm -rf dist/netlify 2>/dev/null || true

# 4) verify the artifact
echo "[3/4] verify"
if [ -d dist/articles/he ] || [ -f dist/he.css ]; then echo "   !! Hebrew still present in dist — ABORT"; exit 2; fi
echo "   ok: no /he/ surface in dist"
PAGES=$(find dist -name '*.html' | wc -l | tr -d ' ')
echo "   html pages: $PAGES"
if grep -rIlE 'sk-[A-Za-z0-9_-]{20,}|sk-ant-|CLOUDFLARE_API_TOKEN|-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----' dist >/dev/null 2>&1; then
  echo "   !! secret-like string found in dist — ABORT"; exit 3
fi
echo "   ok: no secret-like strings in dist"

# 5) deploy (only with creds; otherwise leave ready + instruct)
if [ "$HAVE_CREDS" -ne 1 ]; then
  echo "[4/4] DEPLOY SKIPPED — no Cloudflare credential on this machine."
  echo "      Artifact is READY in ./dist ($PAGES pages, Hebrew excluded)."
  echo "      To go live on floordsgn.com, store the token ONCE (then I auto-deploy next loop cycle):"
  echo "        security add-generic-password -U -s ai.openclaw.runtime -a CLOUDFLARE_API_TOKEN  -w '<CF_API_TOKEN>'"
  echo "        security add-generic-password -U -s ai.openclaw.runtime -a CLOUDFLARE_ACCOUNT_ID -w '<CF_ACCOUNT_ID>'"
  echo "      Or run once interactively:  wrangler login   (then ./deploy-cloudflare.sh)"
  exit 0
fi

echo "[4/4] deploy -> Cloudflare Pages project '$PROJECT'"
# resolve the project's production branch so direct-upload lands on the apex (not a preview)
PROD_BRANCH=$(/usr/bin/curl -s --max-time 25 -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT" \
  | python3 -c "import json,sys
try:
    d=json.load(sys.stdin); print((d.get('result') or {}).get('production_branch') or 'main')
except Exception: print('main')" 2>/dev/null || echo main)
echo "   production_branch=$PROD_BRANCH"
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
  wrangler pages deploy dist --project-name="$PROJECT" --branch="$PROD_BRANCH" --commit-dirty=true
echo "   verify: curl -I https://floordsgn.com"
