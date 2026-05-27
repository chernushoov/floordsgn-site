# Topciment — brand profile

**Source data:** 12 product pages + 19 TDS PDFs fetched 2026-05-27 from topciment.com.
**Status:** my synthesis from publicly available technical data sheets. All facts cite source documents in [sources.md](./sources.md); structured fields in [products.json](./products.json).

## Who they are

Topciment is a Spanish manufacturer of decorative microcement systems headquartered in Valencia. The company positions itself as a specialist in continuous, thin-layer decorative coatings — microcement, metallic effects, primers, and sealers — sold globally through a distributor network. Their messaging is consistently English/Spanish/multilingual, targeting professional applicators and design specifiers rather than DIY end-users.

The product code-naming is deliberately quirky: doubled consonants ("Sttandard", "Evoluttion", "Industtrial", "Efectto", "Topsealer", "Primacem", "Atlanttic", "Mettal"). It is a brand signature, not a typo.

## Product hierarchy

Topciment organizes its decorative-coating line into five technical families:

### 1. STTANDARD — Two-component microcement (flagship technical-grade)
The professional reference system. Two components (powder + Acricem acrylic resin) mixed on site, applied at 1–3 mm total thickness in 2 layers. Three within-family products organized by function:

- **Sttandard Microbase** — base/levelling layer.
- **Sttandard Microfino** — fine finish layer, walls.
- **Sttandard Microdeck** — finish layer for floors.

Certifications cited on TDS: CE, EN 13813, EN 13892. Compressive strength data published per EN 13892-2.

### 2. EVOLUTTION — One-component microcement (simplified workflow)
Powder + water only (no separate resin component). Same three-product internal structure as Sttandard (Microbase / Microfino / Microdeck), plus a variant suffixed "M" for monocomponent flow. Technical specs per TDS:

- Thickness: 1–3 mm total system, ~3 mm combined layers
- Pot life: 1 h
- Drying: 24 h between coats
- Package: 15–18 kg bucket
- Compressive strength: ≥ 40–42 N/mm² (EN 13892-2)
- Cert: EN 13892, CE, EN 13813

Application area: floors, walls, residential + commercial + industrial.

### 3. EFECTTO Quartz — Ready-to-use microcement
Pre-mixed wet product, applied without water or activator. Three grain sizes:

- **Small Grain** — finishing layer for interior walls.
- **Medium Grain** — finishing layer for indoor floors.
- **Big Grain** — preparatory layer for floors and walls.

Single-layer or two-layer system, 17 kg package, CE certified. Positioned as a faster on-site product (no mixing) for users who don't want the two-component workflow.

### 4. INDUSTTRIAL — Epoxy microcement
A separate chemistry: two-component epoxy resin, not cement-bound. Different positioning entirely — for interior floors and walls demanding chemical resistance. Four variants identified on TDS (XL / Base / Medio / Liso). Certifications cited: CE, EN 1504, low-VOC. Mixing ratio 100 parts A : 11.6 parts B. Drying between layers 8–12 h.

This is the only Topciment product line that competes with industrial epoxy systems like Sikafloor-263 SL rather than with other microcements.

### 5. Decorative metallics (top finish layer)
A separate aesthetic category, not used as a structural floor by themselves:

- **Pure Mettal** — metallic coating.
- **Elitte Glaze** + **Elitte Glitter** — metallic glazes for tints/highlights.
- **Classic Mettal** — oxide-effect metallic paint.

### Auxiliaries (consumables)
- **Acricem** — acrylic resin, the B-component for Sttandard 2K microcement. Also doubles as concrete primer at 0.10 L/m².
- **Primacem / Primacem PLUS** — primers (cited as "primers and adhesion promoters").
- **Primapox 100 Fluid** — epoxy primer.
- **Topsealer** — polyurethane / water-based acrylic varnishes (sealer / topcoat range).
- **Arcocem** — pigments for microcement.

## What this means for our positioning

Topciment is a **technical microcement specialist** — not a generalist resin manufacturer like Sika / MasterTop. They do not compete with Sikafloor PurCem in food production. They compete head-to-head with **Mortex (BEAL), Mortex-equivalents, Ideal Work Microtopping, Pavistamp PAVICEM, Smartcret** in the decorative microcement segment.

Their relative strengths from the TDS data:
- Full system (Microbase / Microfino / Microdeck) at three commitment tiers (2K / 1K / ready-to-use) is unusual completeness. Most competitors only offer one or two tiers.
- Industtrial epoxy gives them an answer to "we need microcement aesthetic in a wash-down zone" — though if the application is heavy industrial, Sikafloor / PurCem still wins.
- CE + EN 13813 + EN 13892 certifications are present on the technical-grade products. EN 1504 cited on Industtrial. No HACCP, FDA, NSF, ISEGA on the public TDS we sampled — these are not food-grade systems.

## IL distribution

**UNKNOWN** as of 2026-05-27. Their website lists "international scope" but does not name an Israeli importer in the publicly accessible pages we fetched. Need owner confirmation or local trade contact to write a brand-page that cites a real IL stockist. Until confirmed, our brand-profile page references Topciment as "Spanish microcement specialist, contact Topciment for IL distribution" rather than naming an importer that may not exist.

## What to write on floordsgn.com

A brand-profile page at `articles/brands/topciment.html` should contain:

- HQ + founding context (Valencia, Spain; multilingual global B2B specialist).
- Three product tiers with what differs between them (technical / mid / consumer).
- Honest comparison: where Topciment fits in the decorative microcement segment vs Sika's microcement line.
- TDS link out to topciment.com for each cited product (we do not host their TDS PDFs publicly; they are in our research archive only).
- IL availability section — left honest if no distributor is named.

Photos: only use photos from Topciment's official press kit / case studies with explicit permission, OR our own installation photos when we have them. Do NOT lift catalog photography directly.

## Outstanding questions

1. **IL distributor** — does Topciment have a named Israeli importer? If not, we should not write a "Topciment is available in Israel through X" sentence at all.
2. **Atlanttic** — the website's h2 mentions "the perfect system for demanding spaces" and "underwater spaces" matching the Atlanttic line, but the product page didn't appear in our crawl. May be a sub-line of Sttandard or a separate product family. Need to fetch `/en/microcements/aquaciment-atlanttic` or similar.
3. **Tadelakt** — Topciment's homepage h2 mentions "silky smooth, rock hard tadelakt coating" — they have a tadelakt-style product. Did not appear in this crawl. Worth a follow-up fetch.
4. **Pricing in IL ₪/m²** — TDSs do not contain prices. Will need a Topciment distributor or local survey.
