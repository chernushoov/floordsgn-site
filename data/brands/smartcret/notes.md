# Smartcret — brand profile

**Source data:** 9 product/collection pages fetched 2026-05-27 from smartcret.com. Prices extracted directly from Shopify schema.org JSON-LD on each product page (publicly displayed).

## Who they are

Smartcret is a Spanish DIY-focused microcement brand based in Valencia, sold through a Shopify storefront with explicit per-kit pricing. Unlike Topciment or Ideal Work, Smartcret is positioned for end-users, not professional applicators — the product packaging is by application (kit for bathroom walls 16 m², kit for kitchen walls 8 m², kit for tables 6 m²) rather than by mixing components.

This is a **pricing reference** brand for us: their public per-m² rates are the closest thing we have to "what does microcement cost as raw material in Europe in 2026."

## Pricing reference (materials-only, DIY)

From their Spanish-language Shopify storefront:

| Kit | Coverage | Price EUR | Price €/m² |
|-----|----------|-----------|-----------|
| Bathroom walls 16 m² | 16 m² | €758.92 | €47.43 |
| Kitchen walls 8 m² | 8 m² | €385.76 | €48.22 |
| Tables 6 m² | 6 m² | €125.49 | €20.92 |

Per-m² rate for wall kits clusters around **€47–48/m²** (materials only, end-consumer DIY).

Converted at 2026 ILS/EUR rate (~₪4.0/€):
- Microcement materials-only DIY: **~₪185–195/m²**

A professional applicator installation in IL adds labour (typically 2–3× materials), arriving at the **₪380–620/m² installed** range we have on our main Microtopping page — which now we can cite with a defensible materials-cost reference.

## Product hierarchy

### 1. DIY kits — bathroom / kitchen walls + tables
The flagship product. Pre-packaged kits with all components (primer, microcement, sealer, possibly tools-add-on) sized to a specific application area. Three sizes for walls (8 / 16 m²), one for tables (6 m²). Application "over existing tiles with joints" — meaning the kit is engineered for the most common DIY-renovation use case (tile coverage rather than bare-substrate work).

### 2. Smart Tools — application tool kit
Separate purchase, €97.33. Trowels, smoothing pads, mixing tools — what a DIYer needs but won't have. Sold as accessory.

### 3. Smart Varnish Repair — sealer
Water-based varnish for concrete, €38.55. Topcoat product.

### 4. Smartcover Pool — pool paint
Specialty paint for swimming pools (concrete / cement), €33.10. Adjacent product line, not microcement.

## What this means for our positioning

Smartcret is the **price-floor reference** for decorative microcement in Europe-2026 retail. It is NOT a brand to recommend on FloorDSGN's professional pages — DIY kits for ₪185/m² materials-only cannot match the durability or aesthetic of a professional Topciment Sttandard installation, and we should not lead a designer to a DIY kit when the project deserves professional spec.

However, the existence of Smartcret matters for:
- **Honest pricing transparency** on our pricing pages.
- **Lower-tier alternative** in the configurator (`tier: diy-alternative`) for budget-driven renovation use cases.
- **Educational content** on the differences: why a professional kit at €120/m² materials beats a DIY kit at €47/m² materials in durability.

## IL distribution

No IL distributor named on smartcret.com. Spain-only Shopify storefront. International orders presumably possible via direct ship, but no local stocking. **Status:** direct-ship-only.

## What to write on floordsgn.com

- Probably NOT a dedicated brand-profile page like for Topciment / Sika.
- **DO** cite Smartcret pricing in a "How much does microcement cost?" article as a materials-floor reference.
- **DO** include in `data/floordsgn-pricing.json` (if we build one) as a European retail baseline.
- **DO NOT** position as a competing professional-grade brand — they aren't one.

## Outstanding questions

1. **TDS or technical specs** — Shopify product pages don't carry full TDS. Smartcret's DIY model assumes the buyer trusts the kit. For our comparison purposes this is fine, but it means we cannot extract thickness / drying / consumption as cleanly as Topciment.
2. **Quality control** — DIY kits sized to "16 m² bathroom walls" assume a competent end-user. The high failure rate of consumer-DIY microcement (one of the items in our Floor Anti-Patterns article should be DIY-kit-on-bathroom-without-prep) is real.
