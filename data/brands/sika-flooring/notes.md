# Sika Flooring — brand profile

**Source data:** 10 product pages + 4 PDFs (Comfortfloor colour chart + finishing aid TDS + corporate brochures) fetched 2026-05-27 from gbr.sika.com (Sika UK). Sika's product-detail TDS PDFs require knowing the specific SKU URL — public landing pages give the brand-family structure but not individual product TDSs.

## Who they are

Sika AG is a Swiss multinational construction-chemicals company founded 1910, headquartered in Baar. Floor systems are one of seven Sika business pillars. After Sika's 2023 acquisition of MBCC Group (which included BASF's former construction-chemicals division), the Ucrete brand also rolled into Sika — so the modern "Sikafloor" portfolio includes both the historic Sika lines and the ex-BASF Ucrete lines.

Sika is the technical reference brand for our entire industrial floor segment. When the master plan or our other articles say "Sika analog" we mean "the equivalent Sikafloor SKU." Their TDS architecture is the de facto industry vocabulary — slip class, CSP requirements, mixing ratios, pot life, coverage rates are all documented in a recognizable Sika TDS format that other manufacturers' TDSs imitate.

## Product brand families (Sika UK organisation)

Sika UK organizes its flooring portfolio into named "brands" — each is a product family with multiple SKUs underneath:

### Decorative / aesthetic
- **Sika ComfortFloor®** — seamless PU decorative flooring for hospitality/showroom/design-led spaces.
- **Sikafloor® DecoDur** — decorative epoxy flooring with smooth or broadcasted finish, matte or gloss sealer. Includes the **EB-Flake** vinyl-chip product line and the **Metallic FX** dramatic 2-layer pours.
- **Sikafloor® Dry Shake Terrazzo** — dry-shake aggregate terrazzo for new concrete floors.

### Industrial
- **Sikafloor® Multidur** — the workhorse industrial epoxy resin family. Known SKUs from Sika literature: **MultiDur EB-24** (heavy SL), **MultiDur EW-24** (chloride-resistant for coastal/marine), **MultiDur ES-26** (healthcare SL with Bioblock antimicrobial pairing).
- **Sikafloor® Monoflex** — single-component flexible PU flooring.
- **Sikafloor® Hardtop** — dry-shake hardener (cementitious powder + quartz broadcasted onto fresh concrete before powerfloat). Includes **Sikafloor-3 QuartzTop** for warehouse slabs.

### Specialist
- **Sikafloor® ESD** — anti-static / conductive systems per IEC 61340-5-1. **Sikafloor-235 ESD** (dissipative, 10⁶–10⁹ Ω, carbon-black filled). **Sikafloor-262 AS** (conductive, ≤ 10⁶ Ω, copper grid).
- **Sika® Ucrete® / Sikafloor® PurCem®** — PU-cement HD for food / pharma / heavy industrial. **PurCem 21N** (6 mm, R11 wet kitchen). **PurCem 22N HD** (9–12 mm, R12 food production / cold storage). **Ucrete UD200** (BASF-equivalent now within Sika after 2023 MBCC acquisition).

### Fast-cure / cold-cure
- **Sikafloor® Pronto** — MMA family applying at -25 to +5 °C, overnight install. Internal SKUs: Sikafloor-13 Pronto primer, Sikafloor-24 PurCem Pronto SL (4 mm), Sikafloor-53 TC Pronto pigmented topcoat, Sikafloor-61 BC Pronto broadcasted layer.

### Concrete repair (sibling product line)
- **Sikadur®** family. **Sikadur-31** semi-rigid joint filler. **Sikadur-52 LP** low-viscosity crack injection epoxy (~310 mPa·s, penetrates 0.2 mm hairlines). **SikaFix HH LV** hydrophobic PU injection for moving cracks and leaks. **Sikafloor EpoCem** epoxy moisture/chloride barrier primer.

## Workhorse SKUs (the ones that show up on real specifications)

These are the SKUs you will see on most Israeli flooring specs:

- **Sikafloor-263 SL** — workhorse self-leveling industrial epoxy 2–3 mm. Default for warehouse, light-industrial, parking. (Within Multidur family.)
- **Sikafloor-156** — epoxy primer (most coatings sit on this).
- **Sikafloor-161** — primer for absorbent substrates.
- **Sikafloor-264** — gloss epoxy topcoat.
- **Sikafloor-304W** — water-based PU 2K satin topcoat (default for microcement, low-VOC EC1+ certified).
- **Sikafloor-305W** — water-based PU 2K gloss topcoat.
- **Sikafloor-2540 W** — polyaspartic UV-stable seal (outdoor / coastal).
- **Sikafloor PurCem 21N** — R11 wet kitchen.
- **Sikafloor PurCem 22N HD** — R12 food production / cold storage.
- **Sikafloor-381** — Novolac epoxy (solvent labs, strong-acid zones).

## What this means for our positioning

Sika is the **default reference brand** for industrial and commercial floor systems globally. On floordsgn.com we should:

1. **Treat Sika as the standard** — every product-comparison page is "X versus the equivalent Sika SKU." That is industry vocabulary.
2. **Sika has Israeli distribution** via Gilar (confirmed in our existing memory) — so we can write "Sikafloor 263 SL is available in Israel through Gilar" with confidence, unlike Topciment or Mortex where IL availability is unclear.
3. **Brand-profile page** at `articles/brands/sika-flooring.html` should be the longest brand-profile page on the site — Sika has the most product families and the most depth.

The Sika website is the canonical TDS resource we will link out to. We do not need to host PDFs ourselves.

## IL distribution

**Gilar Building Products Ltd.** (confirmed via existing project memory + master plan source data; gilar.co.il). Established IL distributor; carries the full Sikafloor + Sikadur + Sika ComfortFloor portfolio.

This is the only Tier 1 brand where IL distribution is confirmed and can be cited on our brand-profile page.

## Outstanding questions

1. **Direct SKU TDS URLs** — to build a Sikafloor SKU table on our brand-profile page we need to follow each brand-family page deeper to product detail (e.g. /flooring/brands/sikafloor-multidur/multidur-eb-24.html or similar). Our crawl stopped at the family level. **Next step:** fetch each brand-family page, extract product-detail links, fetch those, extract per-SKU TDS PDFs.
2. **Ucrete / Sika integration status 2026** — Sika acquired BASF's construction chemicals (and Ucrete with it) in 2023. By 2026 Ucrete is fully a Sika brand. We should reflect that in any "Sika analog of Ucrete UD200" comparison — they are now the same company. The MasterTop / Master Builders brand also rolled into Sika.
3. **Gilar Israel stock specifics** — Gilar carries Sika but availability of every Sikafloor SKU is not certain. Some niche SKUs (Sikafloor-381 Novolac, Pronto cold-cure) may need special order. Worth a phone call to Gilar before specifying.
