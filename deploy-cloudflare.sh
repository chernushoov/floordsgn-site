#!/bin/zsh
# FloorDSGN — PRODUCTION deploy to Cloudflare Pages (project: floordsgn -> floordsgn.com).
# Direct-upload via wrangler. Auth via EITHER a CLOUDFLARE_API_TOKEN (keychain) OR an
# existing `wrangler login` session. Builds, strips the unreviewed Hebrew /he/ surface +
# dev files, verifies, then uploads to the production branch (main).
# Safe no-op (build+verify + instructions) when not authenticated.
set -euo pipefail
cd "$(dirname "$0")"

# Node on this machine can't find the system CA issuer for api.cloudflare.com TLS
# (UNABLE_TO_GET_ISSUER_CERT_LOCALLY) — point it at the OpenSSL bundle so wrangler's
# HTTPS calls (token exchange + deploy) succeed.
export NODE_EXTRA_CA_CERTS="${NODE_EXTRA_CA_CERTS:-/etc/ssl/cert.pem}"

PROJECT="floordsgn"
PROD_BRANCH="main"
KCLOADER="/Users/agentmachine/Work/02-Projects/meltbot/moltbot-dashboard/scripts/load-keychain-secrets.sh"

# 1) auth: prefer a keychain token; else fall back to an existing wrangler login session.
if [ -f "$KCLOADER" ]; then
  source "$KCLOADER"
  load_keychain_secret CLOUDFLARE_API_TOKEN  >/dev/null 2>&1 || true
  load_keychain_secret CLOUDFLARE_ACCOUNT_ID >/dev/null 2>&1 || true
fi
# Account ID is known from prior deploys; default it so wrangler never prompts for an account.
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-ef4950ea6a76841cb77e663a600ad839}"
AUTH_MODE=""
if [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
  AUTH_MODE="token"
elif wrangler whoami >/dev/null 2>&1; then
  AUTH_MODE="login"
fi

# 2) build
echo "[1/4] build (npm run build -> dist/)"
npm run build

# 3) strip Hebrew /he/ (PULLED from prod 2026-05-31 per owner — RTL layout not reviewed yet)
#    + dev files. Source tree keeps all /he/ pages; only the published artifact excludes them.
echo "[2/4] strip Hebrew /he/ + dev files from dist (source untouched)"
rm -rf dist/articles/he dist/he.css
find dist -maxdepth 1 -name '*.md' -delete 2>/dev/null || true
node -e 'const fs=require("fs"),p=require("path");let n=0;(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(e.name.endsWith(".html")){let s=fs.readFileSync(f,"utf8"),b=s;s=s.replace(/<button[^>]*data-lang=["\x27]he["\x27][^>]*>[^<]*<\/button>/gi,"");if(s!==b){fs.writeFileSync(f,s);n++;}}}})("dist");console.log("   HE buttons stripped from",n,"files")'
find dist -name '*.sh' -delete 2>/dev/null || true
find dist -maxdepth 1 \( -name '.env*' -o -name '*.log' -o -name 'netlify.toml' \) -delete 2>/dev/null || true
rm -rf dist/netlify 2>/dev/null || true

# 4) verify
echo "[3/4] verify"
if [ -d dist/articles/he ] || [ -f dist/he.css ]; then echo "   !! Hebrew still in dist — ABORT"; exit 2; fi
PAGES=$(find dist -name '*.html' | wc -l | tr -d ' ')
echo "   ok: no /he/ surface; html pages: $PAGES"
if grep -rIlE 'sk-ant-[A-Za-z0-9_-]{20,}|-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----' dist >/dev/null 2>&1; then
  echo "   !! secret-like string in dist — ABORT"; exit 3
fi
echo "   ok: no secret-like strings"

# 5) deploy
if [ -z "$AUTH_MODE" ]; then
  echo "[4/4] DEPLOY SKIPPED — not authenticated to Cloudflare."
  echo "      Artifact is READY in ./dist ($PAGES pages, Hebrew excluded)."
  echo "      Authenticate ONCE (your Cloudflare account), then this ships it:"
  echo "        wrangler login    # opens browser, click Allow"
  echo "      then re-run:  ./deploy-cloudflare.sh"
  exit 0
fi

echo "[4/4] deploy ($AUTH_MODE) -> Cloudflare Pages '$PROJECT' (branch '$PROD_BRANCH' = production)"
wrangler pages deploy dist --project-name="$PROJECT" --branch="$PROD_BRANCH" --commit-dirty=true
echo "   done -> https://floordsgn.com"
