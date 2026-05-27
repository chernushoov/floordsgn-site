#!/usr/bin/env python3
"""
Extract structured technical fields from downloaded brand TDS PDFs.
Re-extracts full text from PDFs (not just the truncated excerpt in pdfs.json)
and pulls out consumption / thickness / drying / pot-life / application
into products.json.

Categorical facts (numbers, system names, application areas) are not copyrightable
when extracted as discrete data. We DO NOT republish the TDS text — we use it
as research input to write our own page later, with source attribution.
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from pdfminer.high_level import extract_text
except ImportError:
    print("pip3 install pdfminer.six", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data" / "brands"


def parse_fields(text):
    """Best-effort regex extraction of technical fields from TDS text."""
    out = {}

    # Consumption: "0.10 L/m²" / "1-1.5 kg/m²" / "1,5 kg/m²"
    m = re.search(
        r"(?:consumption|consumo|расход)[^.]{0,80}?(\d+[,.]?\d*\s*[-–]\s*\d+[,.]?\d*|\d+[,.]?\d*)\s*(?:kg|kgs|L|l|gr|g)\s*/\s*m\s*[²2]",
        text, re.I,
    )
    if m:
        out["consumption_raw"] = m.group(0).strip()[:120]
        out["consumption_value"] = m.group(1).strip()

    # Thickness: "1-3 mm" / "2 mm" / "between 1 and 3 mm"
    m = re.search(
        r"(?:thickness|spessore|espesor|толщина)[^.]{0,80}?(\d+[,.]?\d*\s*[-–]\s*\d+[,.]?\d*|\d+[,.]?\d*)\s*(?:mm)",
        text, re.I,
    )
    if m:
        out["thickness_raw"] = m.group(0).strip()[:120]
        out["thickness_value"] = m.group(1).strip()

    # Drying time: "24 hours", "between 4 and 8 hours"
    m = re.search(
        r"(?:drying|secado|essicc|сушк|cure time|curing time)[^.]{0,100}?(\d+[-–]\d+|\d+)\s*(?:h(?:ours?|rs?)?|min(?:utes?)?)",
        text, re.I,
    )
    if m:
        out["drying_raw"] = m.group(0).strip()[:120]

    # Pot life: "30 minutes", "45 min"
    m = re.search(
        r"(?:pot life|pot-life|vida útil|vida util|tempo di lavorazion)[^.]{0,80}?(\d+[-–]\d+|\d+)\s*(?:min(?:utes?)?|h)",
        text, re.I,
    )
    if m:
        out["pot_life_raw"] = m.group(0).strip()[:120]

    # Mixing ratio: "A:B = 3:1" / "1 part B to 3 parts A"
    m = re.search(
        r"(?:mixing\s+ratio|mezcla|rapporto di miscelazione|пропорц)[^.]{0,100}?(\d+\s*[:.]\s*\d+|\d+\s*parts?\s+\w+\s+to\s+\d+\s*parts?\s+\w+)",
        text, re.I,
    )
    if m:
        out["mixing_raw"] = m.group(0).strip()[:120]

    # Application area
    apps = []
    for kw, label in [
        (r"\b(?:floor|suelo|pavimento|pol)\b", "floor"),
        (r"\b(?:wall|pared|parete|стен)\b", "wall"),
        (r"\b(?:ceiling|techo|soffitto|потол)\b", "ceiling"),
        (r"\b(?:bath(?:room)?|shower|ducha|doccia|ванн)\b", "bathroom"),
        (r"\b(?:kitchen|cocina|cucina|кухн)\b", "kitchen"),
        (r"\b(?:exterior|exteriores|esterno|exterior|улиц)\b", "exterior"),
        (r"\b(?:pool|piscina|бассейн|swimming)\b", "pool"),
        (r"\b(?:stair(?:case)?|escalera|scala|лестниц)\b", "stairs"),
        (r"\b(?:industrial|industriel|industria)\b", "industrial"),
        (r"\b(?:commercial|comercial|коммерч)\b", "commercial"),
        (r"\b(?:residential|residencial|residenz|жил)\b", "residential"),
    ]:
        if re.search(kw, text, re.I):
            apps.append(label)
    if apps:
        out["application_areas"] = sorted(set(apps))

    # Number of components: "two-component" / "one-component" / "single component"
    if re.search(r"\btwo[\s-]?component\b|\b2[\s-]?component\b|\bbicomponent\b|\bdoscomponent\b", text, re.I):
        out["components"] = "two-component"
    elif re.search(r"\bone[\s-]?component\b|\b1[\s-]?component\b|\bsingle[\s-]?component\b|\bmonocomponent\b", text, re.I):
        out["components"] = "one-component"
    elif re.search(r"\bready[\s-]?to[\s-]?use\b|\bready[\s-]?mixed\b", text, re.I):
        out["components"] = "ready-to-use"

    # Layers/coats
    m = re.search(r"(\d+|two|three|four|five)\s+(?:coats?|layers?|capas?|strati|слоя)", text, re.I)
    if m:
        out["layers_raw"] = m.group(0)[:80]

    # Container size: "20 kg", "5 L"
    m = re.search(r"(\d+\s*(?:kg|kgs|L|l))\s*(?:bucket|tin|drum|package|cont)", text, re.I)
    if m:
        out["package_raw"] = m.group(0)[:80]

    # Certifications (look for explicit ones)
    certs = []
    for cert in ["CE", "EN 13892", "EN 1504", "EN 13813", "ASTM", "ISO 14001", "ISO 9001",
                 "VOC", "EC1", "AgBB", "LEED", "BREEAM", "HACCP", "FDA", "ISEGA", "NSF",
                 "DIN 51130", "DIN 51097", "ATEX", "IEC 61340", "Greenguard", "Kosher",
                 "Badatz"]:
        if re.search(r"\b" + re.escape(cert) + r"\b", text, re.I):
            certs.append(cert)
    if certs:
        out["certifications"] = sorted(set(certs))

    # Hardness / Shore / Mohs
    m = re.search(r"(?:Shore|Mohs)[^.]{0,40}?(\d+[,.]?\d*)", text, re.I)
    if m:
        out["hardness_raw"] = m.group(0)[:80]

    # Compressive strength: "60 MPa"
    m = re.search(r"(?:compressive|compress(?:ion|ive)\s+strength|resistencia\s+a\s+compresi)[^.]{0,80}?(\d+[,.]?\d*)\s*(?:MPa|N/mm)", text, re.I)
    if m:
        out["compressive_strength_raw"] = m.group(0)[:120]

    return out


def slug_to_product_name(slug_or_filename):
    """Best-effort guess of product family from filename slug."""
    s = re.sub(r"-?pdf$", "", slug_or_filename.lower())
    s = re.sub(r"-?en$", "", s)
    s = re.sub(r"-?sistema$", "", s)
    # known Topciment product codes
    families = ["sttandard", "evoluttion", "atlanttic", "industtrial", "efectto", "primacem",
                "topsealer", "arcocem", "acricem", "elitte", "mettal", "pure"]
    found = []
    for f in families:
        if f in s:
            found.append(f.title())
    return found or [s.strip("-")]


def process_brand(brand_slug):
    bdir = DATA_DIR / brand_slug
    pdfs_json = bdir / "pdfs.json"
    if not pdfs_json.exists():
        print(f"No pdfs.json for {brand_slug}", file=sys.stderr)
        return

    pdfs = json.loads(pdfs_json.read_text())
    products = []

    for p in pdfs:
        saved = p.get("saved_to")
        if not saved:
            continue
        pdf_path = ROOT / saved
        if not pdf_path.exists():
            continue

        # Re-extract full text from PDF (not just excerpt)
        try:
            full_text = extract_text(str(pdf_path))
        except Exception as e:
            full_text = ""
            print(f"  extract fail: {pdf_path.name} ({e})", file=sys.stderr)

        # Guess product code from filename
        family = slug_to_product_name(pdf_path.stem)

        product = {
            "label": p.get("label"),
            "tds_url": p.get("url"),
            "tds_local": saved,
            "family": family,
            "fields": parse_fields(full_text),
            "text_first_lines": "\n".join([l.strip() for l in full_text.split("\n")[:5] if l.strip()])[:300],
        }
        products.append(product)

    out_path = bdir / "products.json"
    out_path.write_text(json.dumps(products, ensure_ascii=False, indent=2))
    print(f"✓ {brand_slug}: {len(products)} products → {out_path}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("brand", help="Brand slug")
    args = ap.parse_args()
    process_brand(args.brand)


if __name__ == "__main__":
    main()
