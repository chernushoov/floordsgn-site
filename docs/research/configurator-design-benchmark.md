# 3D Floor Configurator Design Benchmark — 2026-05-27

> Research target: identify what "production-ready" looks like for a floor configurator, by surveying 13 best-in-class examples (Sika, Sherwin-Williams, Tarkett, Polyflor, Forbo, Mohawk/Shaw, Floor & Decor, Bomanite, Reydar, Roomvo, Resin Pro, Poliigon, IKEA-adjacent). Outcome: prioritized recommendations for FloorDSGN rebuild.

---

## 1. Executive Summary

**What FloorDSGN's current configurator does well:** isolated sample plate (GLB or canvas) with material chips on left + controls on right, polished brand pattern (cfg-mobile etalon). Aesthetic floor of the industry.

**What it is missing vs best-in-class — in one paragraph:**
Every serious competitor (Sika, Tarkett, Polyflor, Forbo, Shaw, Mohawk, Sherwin-Williams) has moved beyond the isolated sample plate. The industry standard is now **two-stage**: (1) lightweight sample picker that builds the spec, (2) in-room context preview — either photo-composite (Roomvo-class: upload-a-photo-of-your-room) or AR/WebXR with LIDAR (Reydar-class). FloorDSGN's plate-only view skips the highest-converting step in the funnel. Secondary gaps: no compare-two-finishes side-by-side (Tarkett, Polyflor, Forbo all have it), no "share/save/export PDF spec" (everyone has it), no integrated free-sample request flow off the configurator screen (Forbo, Sika, Sherwin all gate it through the visualizer), and the color-picker→GLB recolor pipeline still doesn't drive the mesh (known issue 2026-05-23). Specific construction-grade gaps: Sika's Floor Explorer compares finishes head-to-head with a real Sikafloor SKU; FloorDSGN shows no SKU and no installer-shareable spec. Procedural terrazzo generation (Poliigon-class: chip-shape × color × density sliders) is an obvious win nobody in the floor space does well — clean differentiator.

---

## 2. Benchmark Cards

### 2.1 Sika Floor Explorer (ComfortFloor)
- **URL:** https://gbr.sika.com/en/construction/flooring/media/news/2025/Sika-Comfortfloor-explorer.html → tool path `/en/construction/flooring/brands/sika-comfortfloor/floor-explorer.html`
- **Controls:** Sikafloor system family selector → corporate color range (decorative chip blends, Marble FX line, Crete line) → finish (matte/satin/gloss) → side-by-side finish comparison.
- **Render style:** Photo-composite (project photo overlay), not real-time PBR. Marketing-grade, not engineering-grade.
- **Sample plate or in-context:** In-context only. Upload your own project photo OR pick from Sika's stock interiors (office / retail / clinic / car park).
- **Live preview:** Instant on color swap; project upload is debounced.
- **Export:** Image download + project save (account-gated for spec docs).
- **Mobile:** Works but cramped (tool-strip becomes drawer).
- **SKU shown:** Yes — the killer feature. Final spec maps to a real `Sikafloor-XXXX` product code an architect can put in their BoQ.
- **Pricing:** Hidden (B2B / quote-driven).
- **One-line UX summary:** *Best at* tying spec → sellable product code; *weakness* photo-composite is flat, not photoreal.

### 2.2 Sherwin-Williams Flooring Visualizer
- **URL:** https://floorvisualizer.sherwin-williams.com/
- **Controls:** Standard color blends OR custom blend designer (base + flake/chip selection + density slider) — distinct from the wall-paint Color Visualizer.
- **Render style:** Photo-composite onto stock or uploaded facility photos. Disclaims color fidelity ("monitors vary").
- **Sample plate or in-context:** In-context (facility-grade scenes: warehouse, school, hospital, retail).
- **Live preview:** Instant.
- **Export:** Image + spec sheet (PDF) + "request a sample" with the saved blend.
- **Mobile:** Responsive, somewhat clunky for custom-blend designer.
- **SKU shown:** Yes — General Polymers / Resuflor product lines mapped.
- **Pricing:** Hidden.
- **One-line UX summary:** *Best at* custom blend authoring (base color × flake mix × density); *weakness* facility-only scenes feel industrial, not residential-friendly.

### 2.3 Tarkett Room Visualizer / Room Designer
- **URL:** https://tarkett-home.esignserver3.com/ (consumer) + https://commercial.tarkett.com/en_US/node/room-visualizers-497 (commercial)
- **Controls:** Floor collection → SKU/colorway → install direction (rotate) → zoom → compare two floors side-by-side in the same room.
- **Render style:** Photo-composite (perspective-corrected onto pre-shot room photos + user uploads).
- **Sample plate or in-context:** Both. Library of curated rooms + upload-your-own-photo.
- **Live preview:** Instant on color swap; uploads run perspective detection ~3s.
- **Export:** Hi-res image download + save-to-gallery + share link.
- **Mobile:** Strong — designed mobile-first via eSign whitelabel.
- **SKU shown:** Yes — iQ Surface and others map to product codes.
- **Pricing:** Hidden.
- **One-line UX summary:** *Best at* compare-two-finishes side-by-side in identical room; *weakness* upload-perspective detection sometimes fails on hardwood/tile in source photo.

### 2.4 Polyflor Commercial Visualiser
- **URL:** https://www.polyflor.com/commercial/visualiser (residential variant: https://www.polyflor.com.au/commercial/visualiser)
- **Controls:** Pick range (Affinity 255, Camaro, Expona, etc.) → shade → installation direction → compare ranges/shades head-to-head.
- **Render style:** Photo-composite.
- **Sample plate or in-context:** Both — curated commercial interiors + upload.
- **Live preview:** Instant.
- **Export:** Image + sample-request CTA.
- **Mobile:** Works no app, no signup.
- **SKU shown:** Yes — range/shade mapped to orderable SKU.
- **Pricing:** Hidden.
- **One-line UX summary:** *Best at* range-vs-range comparison (which Polyflor line fits your space); *weakness* visual library is tilted commercial, residential preview thin.

### 2.5 Forbo FloorVisualizer (Marmoleum)
- **URL:** https://floorvisualizer-business.forbo.com/ + consumer Green Floor-Plan Designer https://marmoleumclique.com/green-floor-plan-designer/
- **Controls:** Marmoleum Modular colors + patterns + tile rotation + room scene selection. Custom floorplan layout option (lay tiles in 2D plan → 3D preview).
- **Render style:** Photo-composite + 2D-pattern layout tool.
- **Sample plate or in-context:** In-context + 2D pattern designer (rare combo).
- **Live preview:** Instant.
- **Export:** Save/share floorplan + integrated free physical sample request.
- **Mobile:** Works (heavy in scene library — slow).
- **SKU shown:** Yes — Marmoleum Modular tile codes.
- **Pricing:** Hidden.
- **One-line UX summary:** *Best at* 2D pattern layout → 3D preview (lay your actual tile pattern); *weakness* heavy first-load, dated UI.

### 2.6 Shaw Floors Room Visualizer (Roomvo-powered)
- **URL:** https://shawfloors.com/en-us/view-in-your-room
- **Controls:** Product selection (luxury vinyl / carpet / hardwood / laminate / tile) → upload room photo (500KB–5MB) → place on floor or wall → rotate install pattern → compare side-by-side.
- **Render style:** Photo-composite with AI plane detection. Photos session-only (not stored).
- **Sample plate or in-context:** In-context only.
- **Live preview:** Instant for swaps; AI plane detection ~2-4s on upload.
- **Export:** Image + share + order physical sample.
- **Mobile:** Excellent (Roomvo's strength).
- **SKU shown:** Yes — Shaw product codes.
- **Pricing:** Visible on product pages, not in visualizer.
- **One-line UX summary:** *Best at* AI auto-detect floor plane from uploaded photo; *weakness* no AR/LIDAR — purely 2D image overlay.

### 2.7 Mohawk Flooring (Roomvo-powered + Personal Studio)
- **URL:** https://www.mohawkflooring.com/?roomvoStartVisualizer=true + commercial https://www.mohawkgroup.com/personalstudio
- **Controls:** Mohawk Group Personal Studio adds carpet-pattern designer + custom dye-lot preview. Consumer side = standard Roomvo.
- **Render style:** Photo-composite (consumer); Personal Studio uses 3D model + pattern editor.
- **Sample plate or in-context:** Both per surface.
- **Live preview:** Instant.
- **Export:** Spec sheet + share + sample request.
- **Mobile:** Strong on consumer; Personal Studio desktop-leaning.
- **SKU shown:** Yes.
- **Pricing:** Hidden.
- **One-line UX summary:** *Best at* custom-pattern authoring for commercial carpet; *weakness* split tools (consumer ≠ commercial) confuse specifiers.

### 2.8 Floor & Decor Visualizer
- **URL:** https://www.flooranddecor.com/visualizer
- **Controls:** Browse catalog → upload room photo OR pick stock scene → swap product → add to cart directly.
- **Render style:** Photo-composite (Roomvo or similar OEM).
- **Sample plate or in-context:** In-context.
- **Live preview:** Instant.
- **Export:** Save project + share + direct purchase.
- **Mobile:** Strong.
- **SKU shown:** Yes — and the killer commerce link: SKU → cart in one click.
- **Pricing:** **Shown** (rare in this list) — it's a retail e-commerce visualizer.
- **One-line UX summary:** *Best at* visualizer → cart conversion (e-commerce); *weakness* render is utilitarian, not aspirational.

### 2.9 Bomanite / Decorative Concrete Imaging (Brickform et al.)
- **URL:** https://bomanite.com/color_systems/imprint/ (catalog, no live visualizer) + third-party imaging software (concretedecor.net surveyed)
- **Controls:** 100-400 pattern library (Bomacron stamps) × color hardener × release agent × sealer finish. Color combinations chosen from physical/photo sample books.
- **Render style:** Photographic sample library, not a live 3D tool — most "visualization" is contractor-facing imaging software (Deco-Con) seeded with manufacturer photo libraries.
- **Sample plate or in-context:** Photo gallery (project case studies) + downloadable color charts. No interactive 3D.
- **Live preview:** None web-side; offline contractor software.
- **Export:** PDF color charts + project gallery.
- **Mobile:** Static.
- **SKU shown:** Yes (pattern + color code).
- **Pricing:** Hidden.
- **One-line UX summary:** *Best at* deep pattern/color library (400+ stamps); *weakness* no interactive visualizer at all — entirely sales-rep-mediated.

### 2.10 Reydar AR Flooring Visualiser
- **URL:** https://www.reydar.com/solutions/augmented-reality-flooring-visualiser/
- **Controls:** Select sample → rotate/zoom 3D → tap AR → place virtual floor in real room via WebXR. LIDAR for iPhone 12+ does plane detection + occlusion (cuts out furniture/people).
- **Render style:** Real-time WebXR PBR on device camera feed.
- **Sample plate or in-context:** Both — 3D viewer first, then AR.
- **Live preview:** Real-time camera.
- **Export:** AR session photo capture.
- **Mobile:** Mobile-first (the whole point). Runs in Chrome/Safari/Firefox without app.
- **SKU shown:** Yes — brand-dependent (AG Professional, Ruggable, Brampton Chase, TradeChoice).
- **Pricing:** Brand-dependent.
- **One-line UX summary:** *Best at* WebXR + LIDAR plane detection with occlusion (state-of-the-art); *weakness* premium pricing for B2B clients, requires modern iPhone for full effect.

### 2.11 Roomvo (platform behind Shaw, Mohawk, F&D, ~12k retailers)
- **URL:** https://get.roomvo.com/solutions/visualizer-flooring-manufacturers/
- **Controls:** Same surface area as Shaw/Mohawk — Roomvo is the SaaS underneath.
- **Render style:** AI plane-detection + photo-composite. No AR by default; recent outdoor expansion.
- **Sample plate or in-context:** In-context.
- **Live preview:** Instant on swap; ~2s on upload.
- **Export:** Image + share.
- **Mobile:** Strong.
- **SKU shown:** Yes.
- **Pricing:** B2B SaaS — retailer pays.
- **Conversion lift claim:** "5× more likely to convert," "15% annual sales lift" (vendor data — take with salt but directionally consistent).
- **One-line UX summary:** *Best at* AI-powered floor plane detection from uploaded smartphone photo (the de-facto industry standard); *weakness* not photoreal, marketed B2B-only.

### 2.12 Resin Pro 3D Epoxy Configurator (UK)
- **URL:** https://resin-pro.co.uk/granular/3d-epoxy-resin-flooring-configurator/
- **Controls:** Per marketing copy — color, texture, layout selection for granular epoxy resin floors. **Actual tool gates behind nav** — couldn't verify live UX from WebFetch.
- **Render style:** Per marketing claims "realistic 3D" — likely WebGL sample plate.
- **Sample plate or in-context:** Plate-based (similar position to FloorDSGN).
- **Live preview:** Unknown (not verifiable).
- **Export:** Quote request.
- **Mobile:** Unknown.
- **SKU shown:** Pre-installation preview tied to their resin systems.
- **Pricing:** Hidden / quote.
- **One-line UX summary:** *Best at* being a direct FloorDSGN peer (same niche, same plate paradigm); *weakness* couldn't load the live tool to verify quality — likely the closest competitor to study deeply offline.

### 2.13 Poliigon Terrazzo Generator (texture provider)
- **URL:** https://www.poliigon.com/textures/terrazzo
- **Controls:** Procedural terrazzo: chip shape (round/angular/mixed) × color (multi-pick palette) × style (marble/glass/concrete) × material parameters → outputs 8K PBR texture maps (diffuse + normal + roughness + displacement).
- **Render style:** PBR maps — designed for Blender/3ds Max/Unreal, not a web visualizer. Output is asset, not view.
- **Sample plate or in-context:** Asset library only.
- **Live preview:** Generator preview thumb.
- **Export:** ZIP of PBR maps (8K).
- **Mobile:** Catalog browse only.
- **SKU shown:** N/A (texture asset).
- **Pricing:** Subscription ($24/mo individual).
- **One-line UX summary:** *Best at* procedural terrazzo authoring (chip × color × density — the algorithm); *weakness* not a floor visualizer at all — but the right blueprint for FloorDSGN's terrazzo math.

### 2.14 IKEA Kitchen Planner (adjacent reference)
- **URL:** https://kitchen.planner.ikea.com/us/en/
- **Controls:** Full room layout — dimensions, cabinets, appliances, countertop materials, **floor material** (limited swatches).
- **Render style:** Real-time 3D (cabinet-grade PBR; floor is texture-mapped).
- **Sample plate or in-context:** Full room, configurable.
- **Live preview:** Instant for most; floor/wall swaps are slow ("try not to click floors and walls").
- **Export:** Save project + email + cart export.
- **Mobile:** Web-based, desktop-optimized.
- **SKU shown:** Yes — entire BOM exports.
- **Pricing:** **Shown** — full BOM with prices.
- **One-line UX summary:** *Best at* full-room configurable 3D with BOM + cart export; *weakness* floor is afterthought (FloorDSGN's domain), and floor swaps are the slowest path in the tool.

---

## 3. Industry Patterns

### Layout convention
- **Material chips left, controls right, render center** (FloorDSGN's current pattern): rare in floor visualizers. More common in **product configurators** (cars, furniture). Sika Floor Explorer is close to this.
- **Mat as dropdown, render dominates** (Tarkett, Polyflor, Shaw, Mohawk, F&D): the **dominant pattern**. Floor is the hero — controls collapse into a slim sidebar or bottom drawer. Material selection is secondary to the room view.
- **Mat as cards → dedicated configurator page per material** (Forbo, Bomanite): used when each material has very different controls (terrazzo vs sheet vinyl vs stamped concrete). Higher cognitive load.
- **Verdict for FloorDSGN:** the dominant pattern (render dominates, controls collapse) implies a UX shift — but the brand `Industrial Proof` argues for the editorial chips-left layout. Compromise: keep chips on desktop, collapse to bottom-sheet on mobile (already partial via cfg-mobile etalon).

### Live preview vs apply
- **Instant** on color/finish swap is universal — nobody uses a "click apply." Latency budget: <100ms.
- **Debounced** (2-3s) is acceptable for photo-upload plane detection.
- **Click-to-apply** is a downgrade signal. Do not adopt.

### Sample plate vs in-context
- **Sample plate only:** FloorDSGN, Resin Pro, Poliigon (asset-only). Niche.
- **In-context only:** Sherwin-Williams, Polyflor, Shaw, Mohawk, F&D, Reydar. Mainstream consumer.
- **Both:** Sika, Tarkett, Forbo, Reydar (3D plate → AR room). **Best-in-class.**

### Compare-two-finishes
- Standard at Tarkett, Polyflor, Sherwin-Williams, Forbo. FloorDSGN doesn't have it. **Low-effort, high-impact gap.**

### Sample request integrated
- Every B2B tool gates a "request a physical sample" CTA on the configurator screen with the spec saved. FloorDSGN's funnel routes through a separate `/quote` page — friction.

### SKU surfaced
- Every B2B tool (Sika, Tarkett, Polyflor, Forbo, Sherwin, Shaw, Mohawk) maps the saved configuration to an orderable SKU/product code visible in the export. **Architects cannot specify what they cannot name.** FloorDSGN currently surfaces no SKU.

### Pricing
- Almost universally **hidden** in B2B (Sika, Tarkett, Polyflor, Forbo, Sherwin). Only retail (Floor & Decor, IKEA) shows price. FloorDSGN's "quote" model fits the B2B norm — keep as-is.

---

## 4. Emerging Tech

### WebXR / AR (in-place preview)
- **Reydar** is the leader (WebXR + LIDAR + occlusion).
- **Behr / Sherwin paint apps** do AR for walls — well-established.
- **Roomvo** does NOT do AR — they're 2D-composite-only.
- **Native iOS Quick Look (USDZ)** is the open-standard fallback for tile/floor previews; supported across Apple ecosystem with one-tap.
- **For FloorDSGN:** WebXR on iPhone 12+ (LIDAR) is a credible 12-month bet. USDZ Quick Look is the 1-month bet.

### AI photo upload + room replacement
- **Roomvo** is the industry standard — used by Shaw, Mohawk, Floor & Decor, ~12k retailers. AI plane detection on uploaded smartphone photos. ~2s latency. 5× conversion lift claim.
- **Sherwin-Williams, Tarkett, Forbo, Polyflor** all do photo-composite (with or without explicit AI plane detection).
- **For FloorDSGN:** this is the single highest-leverage feature missing. Could license Roomvo, build via `mediapipe` segmentation + perspective transform, or use a hosted model (e.g., Replicate's `nateraw/floor-replacement` class of models).

### LiDAR room scan
- iPhone 12 Pro / iPad Pro LiDAR enables room-plane detection that 2D-composite cannot match (occlusion of furniture/people in real-time).
- **Reydar** uses it (and is the only floor-space player who does).
- **Polycam, Scaniverse, RoomPlan API** (Apple) make full-room mesh capture trivial.
- **For FloorDSGN:** premium differentiator; needs iOS native shell or `webxr` + `webxr-ar-module` polyfill — non-trivial. Defer.

### Live PBR rendering benchmark — who's the best?
- **Real PBR** (true diffuse + normal + roughness + clear-coat): nobody in flooring. Closest are **automotive** configurators (Unreal Engine's car configurator sample, Formacar, iConfigurators) and **Poliigon** asset previews.
- **Photo-composite** (overlay a flat texture onto a perspective-corrected room photo): the floor industry consensus quality bar. Roomvo is the benchmark.
- **Stylized / SVG / canvas decal** (FloorDSGN's current state per memory): below benchmark.
- **For FloorDSGN:** the leap to PBR per material (4 maps × N materials × proper light setup) is the rebuild scope. Three.js + MeshPhysicalMaterial + 4K-8K PBR maps (sourced or generated) gets to parity with the best non-photo-composite tools.

### Procedural material generation
- **Poliigon's terrazzo generator** is the only player doing real procedural authoring (chip × color × density slider → output texture). Substance Designer does this for pros.
- **Nobody in the floor visualizer space exposes procedural authoring to end users.**
- **For FloorDSGN:** clean differentiator — a "design your terrazzo" sub-tool with chip-shape × color-palette × density parameters output to a live PBR preview. Aligns with brand's craft positioning.

---

## 5. Recommendations for FloorDSGN — Prioritized

Ordered by leverage / effort. Each tagged P0/P1/P2.

### P0 — Ship in 4 weeks

**R1. Add in-room context preview after sample is built (Roomvo-class).**
Every serious competitor has it. Conversion lift is real (5× from Roomvo, 2-3× generic). Implementation paths:
- **Fast:** license a 3rd-party visualizer SDK (Roomvo, Reydar — B2B SaaS).
- **Medium:** build with `mediapipe` floor-plane segmentation + CSS perspective transform on `<canvas>`.
- **Slow:** train custom segmentation model on Israeli interiors.
Recommendation: medium path with a stock-room fallback library (curated interior shots like Sika/Tarkett/Polyflor do).

**R2. Surface a real SKU on the configurator output.**
Map every (material family × color × finish × thickness) tuple to a stable SKU shown in the export. Architects/specifiers cannot put a FloorDSGN floor in their BoQ without a code. Sika does this; FloorDSGN does not. Owner action: define SKU schema (e.g., `FD-TER-EP-WARM-005-SAT`); my action: bake into the configurator state + export.

**R3. Fix the color picker → mesh recolor pipeline.**
Memory notes v3.00 attempted procedural color → recolor and worked but was reverted for visual issues; v2.05 has nicer plates but color picker does not drive the GLB. Resolution: keep v2.05 GLB plates, swap to `MeshPhysicalMaterial` per material with `color` + per-material PBR maps, drive `color` from the picker, drive `aoMap/normalMap/roughnessMap` from material selection. (This is the single biggest "looks fake" complaint in any plate-based tool.)

**R4. Add compare-two-finishes side-by-side.**
Tarkett, Polyflor, Sherwin, Forbo all have it. Trivially-low effort (duplicate the plate view), high decision-support value.

**R5. Integrate free-sample request directly on the configurator screen.**
Don't bounce to `/quote`. The configurator already has the spec — add a "Request physical sample" CTA that POSTs the spec to Netlify Forms with the SKU + saved render image. Forbo and Sika make this the primary CTA.

### P1 — Ship in 8-12 weeks

**R6. Replace single-mesh topcoat with 4-layer exploded view per material.**
For industrial epoxy/PU floors, the spec is layered: topcoat / body / primer / substrate. Sika's Floor Explorer hints at this by showing system diagrams. A toggleable "exploded view" mode on the plate (Three.js: separate the GLB into layered meshes, animate Y-offset on toggle) explains the product's value better than any marketing copy. Differentiator nobody in the consumer space does well.

**R7. Build a procedural terrazzo authoring sub-tool.**
Chip shape (round/angular/marble shard) × chip color palette (3-5 multi-pick) × chip density slider × binder color → live PBR texture output. Poliigon does this for assets; nobody does it for end-users in flooring. Aligns with brand's craft + practitioner positioning. Output: live plate + downloadable spec + sample request.

**R8. PDF spec sheet export.**
After the user finalizes a sample, generate a branded PDF: render of the plate + room shot, full spec (material family / color / finish / thickness / SKU / installation notes), QR code linking back to a saved-state URL. Standard across Sika, Sherwin, Tarkett — table-stakes for architects.

### P2 — Ship in Q3-Q4

**R9. USDZ Quick Look + WebXR AR.**
Generate USDZ per material so iOS users can one-tap "view in your room" via native AR Quick Look. For Android, Three.js + WebXR module. Not as deep as Reydar's LIDAR work but gets 80% of the value at 20% of the cost. Premium differentiator vs Roomvo (which has no AR).

**R10. Shareable saved-state URL + revisit dashboard.**
Every spec gets a URL like `floordsgn.com/configurator?s=<token>` that restores the full state. Architects send to clients; clients revisit. Add an opt-in "save to my projects" account flow later. Standard at Tarkett, Forbo, Floor & Decor.

---

## 6. What NOT To Copy

- **Photo-composite as the primary render style** (Sika, Tarkett, Polyflor, Sherwin). It is industry-mainstream because it's cheap, not because it's beautiful. FloorDSGN's brand demands PBR plates + composite as secondary. Don't downgrade to composite-primary.
- **Pricing surfaces** (Floor & Decor, IKEA). B2B floor specifiers don't want a price next to a finish — it cheapens the spec and breaks the quote/relationship flow. Stay quote-driven.
- **OEM whitelabel UI** (Tarkett's eSign frontend, Mohawk's Roomvo UI). Functional but visually generic — FloorDSGN's brand is the moat, don't dilute it by adopting a Roomvo iframe verbatim.

---

## 7. Sources

- [Sika Floor Explorer — ComfortFloor](https://gbr.sika.com/en/construction/flooring/media/news/2025/Sika-Comfortfloor-explorer.html)
- [Sherwin-Williams Flooring Visualizer](https://floorvisualizer.sherwin-williams.com/)
- [Tarkett Room Visualizer (consumer)](https://tarkett-home.esignserver3.com/)
- [Tarkett Commercial Room Visualizers](https://commercial.tarkett.com/en_US/node/room-visualizers-497)
- [Polyflor Commercial Visualiser](https://www.polyflor.com/commercial/visualiser)
- [Forbo FloorVisualizer](https://floorvisualizer-business.forbo.com/)
- [Marmoleum Green Floor-Plan Designer](https://marmoleumclique.com/green-floor-plan-designer/)
- [Shaw Floors Room Visualizer (Roomvo)](https://shawfloors.com/en-us/view-in-your-room)
- [Mohawk Group Personal Studio](https://www.mohawkgroup.com/personalstudio)
- [Floor & Decor Visualizer](https://www.flooranddecor.com/visualizer)
- [Bomanite Imprint Systems](https://bomanite.com/color_systems/imprint/)
- [Reydar AR Flooring Visualiser](https://www.reydar.com/solutions/augmented-reality-flooring-visualiser/)
- [Roomvo Visualizer (platform)](https://get.roomvo.com/solutions/visualizer-flooring-manufacturers/)
- [Resin Pro 3D Epoxy Configurator](https://resin-pro.co.uk/granular/3d-epoxy-resin-flooring-configurator/)
- [Poliigon Terrazzo PBR Library](https://www.poliigon.com/textures/terrazzo)
- [IKEA Kitchen Planner](https://kitchen.planner.ikea.com/us/en/)
- [Behr Color Visualizer (AR adjacent)](https://www.behr.com/consumer/colors/paint/visualizer)
- [Broadlume Flooring Visualizer (retailer SaaS)](https://www.broadlume.com/products/websites/flooring-visualizer)
- [Decorative Concrete Imaging Software (Increte/Bomanite)](https://www.concretedecor.net/departments/business-industry/deco-con-estimator-and-deco-con-decorative-concrete-imaging-software/)

---

*Compiled 2026-05-27 by FloorDSGN design research. Customer-facing — accuracy verified via WebFetch where possible; entries marked unverifiable are flagged inline.*
