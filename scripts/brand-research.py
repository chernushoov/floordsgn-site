#!/usr/bin/env python3
"""
Brand research pipeline — fetch publicly available product catalog pages
and TDS PDFs, extract structured technical data into data/brands/<slug>/.

Output is OUR knowledge base, not a republished mirror. Every record cites
the source URL. Texts are NOT copied verbatim into the site — they are
processed into structured fields (sku, thickness, consumption, certs, etc.)
that we will then describe in our own voice with attribution.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Install: pip3 install beautifulsoup4 lxml", file=sys.stderr)
    sys.exit(1)

try:
    from pdfminer.high_level import extract_text as pdf_extract_text
    HAS_PDF = True
except ImportError:
    HAS_PDF = False

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data" / "brands"

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15"

def fetch(url, timeout=30):
    """GET via curl (avoids Python SSL issues on this Mac). Returns (status, body_bytes, content_type)."""
    try:
        result = subprocess.run(
            ["curl", "-sL", "--max-time", str(timeout), "--user-agent", UA,
             "-w", "\n__STATUS__%{http_code}\n__CONTENT_TYPE__%{content_type}\n", url],
            capture_output=True, timeout=timeout + 10
        )
    except subprocess.TimeoutExpired:
        return 0, b"", "TIMEOUT"
    except Exception as e:
        return 0, b"", f"ERROR: {e}"

    body = result.stdout
    # split trailing metadata block
    m = re.search(rb"\n__STATUS__(\d+)\n__CONTENT_TYPE__([^\n]*)\n?$", body)
    if m:
        status = int(m.group(1))
        ctype = m.group(2).decode("ascii", errors="ignore")
        body = body[:m.start()]
    else:
        status = 0
        ctype = ""
    if status == 0 and result.returncode != 0:
        return 0, b"", f"ERROR: curl exit {result.returncode}: {result.stderr.decode('utf-8', errors='ignore')[:200]}"
    return status, body, ctype

def slug(s):
    return re.sub(r"[^a-z0-9-]+", "-", s.lower()).strip("-")

def absolutize(base, href):
    return urllib.parse.urljoin(base, href)

def find_pdf_links(html, base_url, same_host_only=True):
    """Extract PDF links from HTML. Filter to same host by default
    (avoids picking up unrelated 3rd-party PDFs like building codes)."""
    soup = BeautifulSoup(html, "lxml")
    base_host = urllib.parse.urlparse(base_url).netloc
    base_host_root = ".".join(base_host.split(".")[-2:])  # tolerate www. and cdn.
    pdfs = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if ".pdf" not in href.lower():
            continue
        url = absolutize(base_url, href)
        host = urllib.parse.urlparse(url).netloc
        if same_host_only and host:
            host_root = ".".join(host.split(".")[-2:])
            if host_root != base_host_root:
                continue
        label = (a.get_text(strip=True) or a.get("title", "") or os.path.basename(href)).strip()
        pdfs.append({"url": url, "label": label[:200]})
    seen = set()
    out = []
    for p in pdfs:
        if p["url"] in seen:
            continue
        seen.add(p["url"])
        out.append(p)
    return out

def find_internal_links(html, base_url, limit=200):
    """Extract internal links (same host)."""
    soup = BeautifulSoup(html, "lxml")
    base_host = urllib.parse.urlparse(base_url).netloc
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        full = absolutize(base_url, href)
        host = urllib.parse.urlparse(full).netloc
        if host != base_host:
            continue
        label = a.get_text(strip=True)[:200]
        links.append({"url": full, "label": label})
    seen = set()
    out = []
    for l in links:
        if l["url"] in seen:
            continue
        seen.add(l["url"])
        out.append(l)
        if len(out) >= limit:
            break
    return out

def extract_meta(html):
    """Extract structured meta from HTML (title, description, OG tags)."""
    soup = BeautifulSoup(html, "lxml")
    meta = {}
    if soup.title:
        meta["title"] = soup.title.get_text(strip=True)[:300]
    for tag in soup.find_all("meta"):
        name = (tag.get("name") or tag.get("property") or "").lower()
        content = (tag.get("content") or "").strip()
        if not content:
            continue
        if name in ("description", "og:description", "og:title", "og:url", "og:site_name"):
            meta[name] = content[:500]
    # h1s give us section headings (categorical, not copyrightable)
    h1s = [h.get_text(strip=True)[:200] for h in soup.find_all("h1")[:5]]
    if h1s:
        meta["h1"] = h1s
    h2s = [h.get_text(strip=True)[:200] for h in soup.find_all("h2")[:20]]
    if h2s:
        meta["h2"] = h2s
    return meta

def init_brand(brand_slug, brand_name, hq, founded, official_url):
    bdir = DATA_DIR / brand_slug
    bdir.mkdir(parents=True, exist_ok=True)
    (bdir / "tds").mkdir(exist_ok=True)
    meta_path = bdir / "meta.json"
    if meta_path.exists():
        meta = json.loads(meta_path.read_text())
    else:
        meta = {
            "slug": brand_slug,
            "name": brand_name,
            "hq": hq,
            "founded": founded,
            "official_url": official_url,
            "fetched_pages": [],
            "fetched_pdfs": [],
            "il_distributor": None,
            "categories": [],
            "notes_status": "draft",
        }
        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2))
    return bdir, meta

def save_meta(bdir, meta):
    (bdir / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2))

def write_sources(bdir, sources):
    """sources: list of {url, kind, label, status, fetched_at}"""
    lines = ["# Sources\n", "", "All URLs we pulled data from. Public technical-data pages.", ""]
    by_kind = {}
    for s in sources:
        by_kind.setdefault(s["kind"], []).append(s)
    for kind in sorted(by_kind):
        lines.append(f"## {kind}")
        lines.append("")
        for s in by_kind[kind]:
            line = f"- [{s.get('label','')[:200] or s['url']}]({s['url']}) — `{s.get('status','')}` at {s.get('fetched_at','')}"
            lines.append(line)
        lines.append("")
    (bdir / "sources.md").write_text("\n".join(lines))

def fetch_brand_landing(brand_slug, brand_name, hq, founded, urls, max_pdfs=10):
    """
    urls: list of catalog page URLs to fetch for this brand.
    Downloads each, extracts meta + PDF links, downloads up to max_pdfs.
    """
    bdir, meta = init_brand(brand_slug, brand_name, hq, founded, urls[0])

    sources = []
    pages_meta = []
    pdf_index = []

    for url in urls:
        print(f"  fetch {url}", flush=True)
        status, body, ctype = fetch(url)
        ts = time.strftime("%Y-%m-%dT%H:%M:%S")
        if status != 200 or not body:
            sources.append({"url": url, "kind": "page", "label": "", "status": str(status) or "fail", "fetched_at": ts})
            print(f"    {status} {ctype}", flush=True)
            continue

        try:
            html = body.decode("utf-8", errors="ignore")
        except Exception:
            html = body.decode("latin-1", errors="ignore")

        page_meta = extract_meta(html)
        page_meta["url"] = url
        page_meta["status"] = status
        page_meta["fetched_at"] = ts
        pages_meta.append(page_meta)

        sources.append({
            "url": url, "kind": "page",
            "label": page_meta.get("title", ""), "status": str(status), "fetched_at": ts
        })

        pdfs = find_pdf_links(html, url)
        for p in pdfs:
            pdf_index.append({"url": p["url"], "label": p["label"], "from_page": url})

        # also save raw landing HTML for our reference (NOT for republish)
        # filename derived from URL path
        parsed = urllib.parse.urlparse(url)
        path_slug = slug(parsed.path or "index") or "index"
        landing_path = bdir / f"_raw_{path_slug}.html"
        landing_path.write_text(html, encoding="utf-8")

        time.sleep(1.5)

    # download PDFs (up to max_pdfs)
    pdf_seen = set()
    pdf_to_dl = []
    for p in pdf_index:
        if p["url"] in pdf_seen:
            continue
        pdf_seen.add(p["url"])
        pdf_to_dl.append(p)
    pdf_to_dl = pdf_to_dl[:max_pdfs]

    print(f"  downloading {len(pdf_to_dl)} PDF(s)...", flush=True)
    pdf_records = []
    for p in pdf_to_dl:
        print(f"    pdf {p['url']}", flush=True)
        status, body, ctype = fetch(p["url"])
        ts = time.strftime("%Y-%m-%dT%H:%M:%S")
        if status != 200 or not body:
            sources.append({"url": p["url"], "kind": "pdf", "label": p["label"], "status": str(status) or "fail", "fetched_at": ts})
            continue

        fname = slug(p["label"] or os.path.basename(urllib.parse.urlparse(p["url"]).path) or "doc")
        if not fname.endswith("-pdf"):
            fname = fname + "-pdf"
        pdf_path = bdir / "tds" / f"{fname[:90]}.pdf"
        pdf_path.write_bytes(body)

        excerpt = ""
        if HAS_PDF:
            try:
                excerpt = pdf_extract_text(str(pdf_path))[:4000]
            except Exception as e:
                excerpt = f"(extract failed: {e})"

        pdf_records.append({
            "url": p["url"],
            "label": p["label"],
            "saved_to": str(pdf_path.relative_to(ROOT)),
            "size_bytes": len(body),
            "extract_excerpt": excerpt[:1500],
        })
        sources.append({"url": p["url"], "kind": "pdf", "label": p["label"], "status": str(status), "fetched_at": ts})
        time.sleep(1.5)

    # save pages + pdf records
    (bdir / "pages.json").write_text(json.dumps(pages_meta, ensure_ascii=False, indent=2))
    (bdir / "pdfs.json").write_text(json.dumps(pdf_records, ensure_ascii=False, indent=2))

    # update meta
    meta["fetched_pages"] = [p["url"] for p in pages_meta]
    meta["fetched_pdfs"] = [p["url"] for p in pdf_records]
    meta["last_fetched_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    save_meta(bdir, meta)
    write_sources(bdir, sources)

    return bdir, meta, pages_meta, pdf_records


# Predefined brand targets (Tier 1 from SITESUCKER_TARGETS_2026-05-27.md)
BRANDS = {
    "topciment": {
        "name": "Topciment",
        "hq": "Valencia, Spain",
        "founded": None,
        "urls": [
            "https://www.topciment.com/en/",
            "https://www.topciment.com/en/microcement",
            "https://www.topciment.com/en/microcements/two-component-microcement-sttandard",
            "https://www.topciment.com/en/microcements/one-component-microcement-evoluttion",
            "https://www.topciment.com/en/microcements/ready-to-use-microcement-efectto",
            "https://www.topciment.com/en/microcements/epoxy-microcement-for-interior-floors-and-walls-industtrial",
            "https://www.topciment.com/en/microcements/metallic-coating-pure-mettal",
            "https://www.topciment.com/en/microcements/metallic-glazes-elitte",
            "https://www.topciment.com/en/microcements/metallic-paints-oxide-effect-classic-mettal",
            "https://www.topciment.com/en/microcements/primers-and-adhesion-promoters-primacem",
            "https://www.topciment.com/en/microcements/polyurethane-waterbased-acrylic-varnishes-topsealer",
            "https://www.topciment.com/en/microcements/pigments-for-microcement-arcocem",
        ],
    },
    "beal-mortex": {
        "name": "Mortex (BEAL)",
        "hq": "Beloeil, Belgium",
        "founded": "1962",
        "urls": [
            "https://www.beal.be/en/mortex",
            "https://www.beal.be/en/products",
            "https://www.beal.be/en/",
        ],
    },
    "ideal-work": {
        "name": "Ideal Work",
        "hq": "Sarmede, Italy",
        "founded": "2000",
        "urls": [
            "https://www.idealwork.com/",
            "https://www.idealwork.com/microtopping/",
            "https://www.idealwork.com/microcement/",
            "https://www.idealwork.com/lixio/",
            "https://www.idealwork.com/lixio-plus/",
            "https://www.idealwork.com/sassoitalia-floor/",
            "https://www.idealwork.com/stenciltop-floor/",
            "https://www.idealwork.com/ideal-wall/",
            "https://www.idealwork.com/typoligies/floors/",
            "https://www.idealwork.com/faq-microcement/",
        ],
    },
    "pavistamp": {
        "name": "Pavistamp",
        "hq": "Spain",
        "founded": "1990",
        "urls": [
            "https://www.pavistamp.com/microcemento-pavicem/",
            "https://www.pavistamp.com/productos/",
            "https://www.pavistamp.com/",
        ],
    },
    "smartcret": {
        "name": "Smartcret",
        "hq": "Valencia, Spain",
        "founded": None,
        "urls": [
            "https://smartcret.com/",
            "https://smartcret.com/collections/kits-microcemento",
            "https://smartcret.com/pages/microcemento-listo-al-uso",
            "https://smartcret.com/products/kit-microcemento-para-ducha-de-obra-de-16m2",
            "https://smartcret.com/products/kit-de-microcemento-para-paredes-de-bano-con-juntas-de-16m2",
            "https://smartcret.com/products/kit-microcemento-mesas-6m2",
            "https://smartcret.com/products/kit-microcemento-para-paredes-de-cocina-con-juntas-de-8m2",
            "https://smartcret.com/products/smart-tools-kit-de-herramientas-para-aplicar-microcemento",
            "https://smartcret.com/products/smart-varnish-repair-barniz-para-hormigon-de-base-agua",
            "https://smartcret.com/products/smartcover-pool-pintura-piscinas-cemento-hormigon",
        ],
    },
    "keim": {
        "name": "Keim",
        "hq": "Diedorf, Germany",
        "founded": "1878",
        "urls": [
            "https://www.keim.com/en/products",
            "https://www.keim.com/en/",
        ],
    },
    "sika-flooring": {
        "name": "Sika Flooring",
        "hq": "Baar, Switzerland",
        "founded": "1910",
        "urls": [
            "https://gbr.sika.com/en/construction/flooring.html",
            "https://gbr.sika.com/en/construction/flooring/brands.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sika-comfortfloor.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sikafloor-decodur.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sikafloor-dry-shake-terrazzo.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sikafloor-esd.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sikafloor-hardtop.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sikafloor-monoflex.html",
            "https://gbr.sika.com/en/construction/flooring/brands/sikafloor-multidur.html",
            "https://gbr.sika.com/en/construction/flooring/anti-static-esd-systems.html",
        ],
    },
    "master-builders": {
        "name": "Master Builders Solutions (MasterTop)",
        "hq": "Mannheim, Germany",
        "founded": "1909",
        "urls": [
            "https://www.master-builders-solutions.com/en/products/mastertop",
            "https://www.master-builders-solutions.com/en/products/ucrete",
        ],
    },
    "mapei-mapefloor": {
        "name": "Mapei Mapefloor",
        "hq": "Milan, Italy",
        "founded": "1937",
        "urls": [
            "https://www.mapei.com/int/en/products-and-solutions/lines/mapefloor",
            "https://www.mapei.com/int/en/",
        ],
    },
    "flowcrete": {
        "name": "Flowcrete (Tremco CPG)",
        "hq": "UK",
        "founded": "1982",
        "urls": [
            "https://www.flowcrete.com/products/",
            "https://www.flowcrete.com/",
        ],
    },
    "stonhard": {
        "name": "Stonhard",
        "hq": "Maple Shade, NJ, USA",
        "founded": "1922",
        "urls": [
            "https://www.stonhard.com/products",
            "https://www.stonhard.com/",
        ],
    },
    "altro": {
        "name": "Altro",
        "hq": "Letchworth Garden City, UK",
        "founded": "1919",
        "urls": [
            "https://www.altro.com/en-GB/Products-Solutions",
            "https://www.altro.com/",
        ],
    },
    "polyflor": {
        "name": "Polyflor",
        "hq": "Manchester, UK",
        "founded": "1915",
        "urls": [
            "https://www.polyflor.com/commercial",
            "https://www.polyflor.com/",
        ],
    },
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("brand", help="Brand slug (e.g. topciment) or 'list'")
    ap.add_argument("--max-pdfs", type=int, default=8)
    args = ap.parse_args()

    if args.brand == "list":
        for slug_, b in BRANDS.items():
            print(f"{slug_:20s} {b['name']:35s} {b['hq']}")
        return

    if args.brand not in BRANDS:
        print(f"Unknown brand: {args.brand}", file=sys.stderr)
        sys.exit(1)

    b = BRANDS[args.brand]
    print(f"=== {b['name']} ({args.brand}) ===")
    bdir, meta, pages, pdfs = fetch_brand_landing(
        args.brand, b["name"], b["hq"], b["founded"], b["urls"],
        max_pdfs=args.max_pdfs
    )
    print(f"  → {bdir}")
    print(f"  pages fetched: {len(pages)}")
    print(f"  pdfs saved: {len(pdfs)}")
    if pages:
        print(f"  first page title: {pages[0].get('title', '')[:120]}")


if __name__ == "__main__":
    main()
