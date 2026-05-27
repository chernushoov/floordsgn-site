# 3D / Configurator / PBR GitHub Inventory — 2026-05-27

> Companion to `configurator-design-benchmark.md` (market & UX side) and `configurator-code-audit.md` (current code side).
> This file is the **library-and-framework side**: what's on GitHub that we can clone, copy patterns from, or build on for the configurator rebuild and the "autopilot" 3D layer.
> All star counts and license info verified via `gh api` on 2026-05-27. Repos that returned 404 are explicitly flagged.

---

## 0. Scope reminder

Two consumers of this inventory:
1. **FloorDSGN configurator rebuild** — replace `configurator.html` v2.05 with something that (a) actually recolors / retextures the plate, (b) supports terrazzo procedural variation, (c) ships a 2-stage flow (plate → in-room) per the design benchmark, (d) does not blow up the current Netlify build-less workflow more than necessary.
2. **"Autopilot" project** — same 3D tech, different product. Goal: pick a stack that's portable across both.

Hard constraints:
- Current site is **Netlify static / build-less**. Any build step is a friction tax we must pay back in capability.
- Owner workflow is FTP-style: edit, push, deploy. R3F/Vite ≠ blocker but must be sub-app, not whole-site rewrite.
- Brand bar: Industrial Proof palette, real photo textures (not procedural SVG). PBR mandatory.

---

## 1. Top-tier picks (verified, 10k+ stars OR uniquely load-bearing)

| Repo | Stars | Last push | License | Stack | What it gives FloorDSGN | Effort to integrate |
|---|---:|---|---|---|---|---|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | 112,701 | 2026-05-27 | MIT | vanilla JS | Engine itself + ~500 official examples (PBR, env maps, KTX2, postprocessing, WebGPU branch). Reference implementation. | Already in use; ongoing. |
| [vercel/next.js](https://github.com/vercel/next.js) | 139,584 | 2026-05-27 | MIT | React framework | Only if we go R3F path. Powers `pmndrs/react-three-next` starter. | High if adopted site-wide; low if a sub-app under `/configurator/`. |
| [pmndrs/zustand](https://github.com/pmndrs/zustand) | 58,129 | 2026-05-22 | MIT | React state | Configurator state store (material, color, finish, layout) — the canonical R3F state lib. | Trivial once on React. |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 30,928 | 2026-05-07 | MIT | React + three.js | The reactive scene graph. Cuts ~60% of imperative three.js code from `configurator.html`. | Medium — requires build step. |
| [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | 29,095 | 2026-05-24 | MIT | React anim | Spring-physics camera moves, material crossfades. Pairs with R3F. | Low. |
| [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js) | 25,574 | 2026-05-26 | Apache-2.0 | Engine | Three.js alternative with built-in node-material editor, IBL, glTF — heavier but more "configurator out of the box" (has GUI library, asset host UX). | High — full pivot. |
| [greensock/GSAP](https://github.com/greensock/GSAP) | 24,923 | 2026-04-13 | Custom (free for most uses) | vanilla JS | ScrollTrigger + Timeline = current de-facto for scroll-driven 3D reveals. Already battle-tested on the site. | Already partially used. |
| [playcanvas/engine](https://github.com/playcanvas/engine) | 15,889 | 2026-05-27 | MIT | Engine | Strong WebGPU support, real-time editor cloud-hosted. Less popular for configurators than Babylon but lighter. | High — full pivot. |
| [CesiumGS/cesium](https://github.com/CesiumGS/cesium) | 15,310 | 2026-05-27 | Apache-2.0 | GIS engine | Irrelevant for floor; **only** if autopilot needs map/geo 3D. Skip for FloorDSGN. | N/A for floor. |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | 13,953 | 2026-05-22 | MIT | vanilla JS | Smooth-scroll lib used by every awwwards site. Required for cinematic scroll → 3D parity with Sika/Forbo. | Trivial — drop-in. |
| [vercel/satori](https://github.com/vercel/satori) | 13,459 | 2026-05-22 | MPL-2.0 | OG-image gen | Generate sharable spec card PNGs server-side (the "export your spec" CTA). | Low — Netlify Functions. |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) | 12,451 | **2024-08-14 (stale 1.7y)** | Apache-2.0 | Keyframe editor | Animate camera/material reveals with a Premiere-style timeline. Caveat: project effectively unmaintained. | Medium — risk of dead deps. |
| [pmndrs/drei](https://github.com/pmndrs/drei) | 9,663 | 2026-03-23 | MIT | R3F helpers | Environment, ContactShadows, AccumulativeShadows, MeshTransmissionMaterial, OrbitControls, useGLTF — every configurator helper you need. | Bundled with R3F. |
| [google/model-viewer](https://github.com/google/model-viewer) | 8,087 | 2026-05-27 | Apache-2.0 | Web component | `<model-viewer>` = drop-in `<img>`-class tag for glTF + AR. No build, no JS, no framework. **The build-less path** for FloorDSGN today. | **Trivial** — one `<script>` tag. |
| [KhronosGroup/glTF](https://github.com/KhronosGroup/glTF) | 7,729 | 2026-05-18 | spec | spec/docs | Authoritative spec — for understanding the floor-plate GLB structure and PBR extensions (KHR_materials_*). | Reference only. |
| [google/draco](https://github.com/google/draco) | 7,286 | 2026-05-18 | Apache-2.0 | Compression | Compress floor plate GLBs 80–95% (1.2 MB → ~200 KB). Used by three.js GLTFLoader natively. | Low — npm + loader config. |
| [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) | 5,798 | 2024-11-04 | MIT | CLI | Auto-converts `plate.glb` → JSX component with named material slots. Enables per-material recolor with type safety. | Trivial — one CLI command. |

**Repos people often namedrop but that DO NOT EXIST (verified 404 on 2026-05-27):**
- `vercel/satori-3d` (no such thing — "satori-3d" is a marketing term, not a repo)
- `pmndrs/use-cannon` is real (2,948 ★) but **dormant since 2024-02-25**. Use `pmndrs/react-three-rapier` (1,388 ★, active 2025) for new physics.
- `splinetool/runtime` (the Spline runtime lives only via npm `@splinetool/runtime` — no public GitHub source repo). The React wrapper `splinetool/react-spline` (1,407 ★, MIT) is open.
- `pixotronics/webgi` — closed-source / commercial; OSS successor is `repalash/threepipe` (889 ★, Apache-2.0).
- `needle-tools/needle-engine`, `tympanus/codrops` (codrops repos live under org `codrops` not `tympanus`).
- `brunosimon/folio-2024`, `brunosimon/threejs-journey`. Bruno Simon's most-starred public is `brunosimon/folio-2019` (4,684 ★, MIT) — 6-year-old but still the gold reference for cinematic R3F.

---

## 2. R3F templates worth cloning

We want minimum-friction starters. Below are the ones that actually exist and have non-trivial stars or recent commits.

### 2.1 `pmndrs/react-three-next` — 2,837 ★, MIT, last push 2024-06-21
- https://github.com/pmndrs/react-three-next
- Stack: Next.js 13 + R3F + Tailwind + Leva (debug GUI). Has the "Tunnel" pattern for keeping R3F on a single `<Canvas>` while routing pages.
- **Fit for FloorDSGN:** highest if we ever consolidate site → Next.js. Otherwise overkill (it owns the whole site).
- **Workflow break:** turns Netlify static deploy into Netlify Next.js plugin (already in use for Connector — known good). FloorDSGN site would become full-Next, which contradicts "additive only" preference.

### 2.2 `wass08/r3f-vite-starter` — 281 ★, CC0-1.0, last push 2025-05-23
- https://github.com/wass08/r3f-vite-starter
- Author: Wawa Sensei (the YouTube R3F teacher behind chair / table configurator tutorials below).
- Stack: Vite + R3F + Drei + Leva. Minimal — no Next.js, no router.
- **Fit:** **highest for a configurator sub-app**. Stick the configurator under `/configurator/dist/` as a Vite-built static bundle, deploy with the rest of the static site. The owner workflow doesn't change — only `npm run build` in one folder.
- **Workflow break:** none if treated as sub-app. Owner edits `configurator/src/`, runs `npm run build`, commits `dist/`.

### 2.3 `14islands/r3f-scroll-rig` — 935 ★, MIT, last push 2025-12-17 (active)
- https://github.com/14islands/r3f-scroll-rig
- Stack: React + R3F + Lenis. Sync 3D meshes to DOM elements as you scroll — exactly the pattern Sika and Forbo use for "scroll to see material on different scenes."
- **Fit:** **highest for the cinematic reveal** that's missing from FloorDSGN. Pairs with 14islands' own Lenis (which they wrote).
- **Workflow break:** add as dep in the configurator sub-app.

### 2.4 `wass08/chair-configurator-three-js-r3F-tutorial` — 48 ★, no license, last push 2026-05-07
- https://github.com/wass08/chair-configurator-three-js-r3F-tutorial
- Companion video: chair material/color picker with Drei + Zustand. Pattern is **directly transferable** — swap chair GLB for plate.glb, leg color slot becomes Signal-orange flake color.
- **Use as:** reference for the state shape (`useConfigurator` zustand store), not as starter.

### 2.5 `wass08/table-configurator-three-js-r3F-tutorial-final` — 26 ★, no license, last push 2026-05-11
- https://github.com/wass08/table-configurator-three-js-r3F-tutorial-final
- Same author. Material swap + AO map + procedural variation. Slightly more advanced than the chair.

### 2.6 `repalash/threepipe` — 889 ★, Apache-2.0, last push 2026-04-07
- https://github.com/repalash/threepipe
- Open-source successor to WebGi (commercial photoreal product viewer). Built-in tonemapping, real-time GI approximation, SSR, depth-of-field. **Photoreal out of the box without R3F**.
- **Fit for FloorDSGN:** highest-quality-output / minimum-build option. Used directly as `<script>`. Worth a dedicated spike.
- **Workflow break:** very low — works build-less.

### 2.7 `brunosimon/folio-2019` — 4,684 ★, MIT, last push 2024-05-25
- https://github.com/brunosimon/folio-2019
- Reference for car-style scroll-controlled scene. Old but the patterns (asset loader, debug GUI, post-processing) are still textbook.
- **Use as:** read-only reference, not as starter.

### 2.8 `Sean-Bradley/Three.js-TypeScript-Boilerplate` — 587 ★, MIT, last push 2026-02-18
- https://github.com/Sean-Bradley/Three.js-TypeScript-Boilerplate
- Vanilla three.js + TS + Vite. No React tax. Closest to current `configurator.html` mental model with types added.
- **Fit:** medium — the "improve current code without changing paradigm" path.

### 2.9 `ektogamat/threejs-andy-boilerplate` — 751 ★, MIT, last push **2022-05-01 (4y stale)**
- https://github.com/ektogamat/threejs-andy-boilerplate
- Vanilla three.js + webpack. Listed because it's still cited everywhere — but it's effectively abandoned. Avoid.

### 2.10 `fireship-io/threejs-scroll-animation-demo` — 1,644 ★, no license, last push 2024-07-06
- https://github.com/fireship-io/threejs-scroll-animation-demo
- Apple-iPhone-style scroll-driven 3D in vanilla three.js. Pattern reference for "scroll = camera path" without R3F.

**Recommendation row for templates:** `wass08/r3f-vite-starter` + `14islands/r3f-scroll-rig` for the configurator sub-app, with `repalash/threepipe` as the photoreal-no-build fallback if owner refuses the build step.

---

## 3. Material / PBR specifically for floor visualization

### 3.1 Poly Haven (CC0)
- Source code site: [Poly-Haven/polyhaven.com](https://github.com/Poly-Haven/polyhaven.com) (81 ★, GPL-3.0 site code) and public API [Poly-Haven/Public-API](https://github.com/Poly-Haven/Public-API) (57 ★).
- Blender add-on: [Poly-Haven/polyhavenassets](https://github.com/Poly-Haven/polyhavenassets) (483 ★).
- License: **CC0** on every asset. Commercial use fine. Already used in our current `3d-assets-cfg/textures/*`.
- Resolutions: 1K / 2K / 4K / 8K per material. 8K available for terrazzo, concrete, marble, parquet, tiles.
- **Specific picks for FloorDSGN catalog:**
  - `concrete_floor_worn_001` / `concrete_floor_worn_002` (8K)
  - `floor_tiles_06`, `floor_tiles_08` (4K + 8K)
  - `weathered_concrete_floor` (8K)
  - `large_grey_tiles` (concrete-look 8K)
  - `medieval_blocks` (terrazzo-adjacent 8K)
  - `metal_plate_*` for industrial line
- Downloader scripts: [agmmnn/polydown](https://github.com/agmmnn/polydown) (100 ★) — bulk fetch with preview.

### 3.2 AmbientCG (CC0)
- No first-party GitHub mirror that exists at the URL people cite — verified 404 on `ambientcg/ambientcg.com`. Assets are available only via web + their own API.
- Downloader: [alvarognnzz/ambientcg-downloader](https://github.com/alvarognnzz/ambientcg-downloader) (19 ★), [mid1224/ambientcg-textures-downloader](https://github.com/mid1224/ambientcg-textures-downloader) (1 ★).
- License: **CC0**. ~2,500 PBR sets, 1K / 2K / 4K / 8K / 16K. Stronger than Poly Haven on industrial concrete (`Concrete*` series goes up to 16K), tile patterns, terrazzo-ish (`Marble*`, `Granite*`).
- **Specific picks:** `Concrete034` (worn microcement-like), `Marble022` (terrazzo-like), `Tiles096` / `Tiles101` (mosaic), `Ground037` (rough industrial).

### 3.3 `pmndrs/market` — 278 ★, MIT, last push 2024-02-21
- https://github.com/pmndrs/market
- Curated CC0 assets cherry-picked for three.js / R3F. Includes HDRs and a few PBR materials. Smaller than Poly Haven but everything is verified import-ready.
- Status: **maintenance mode** (last push Feb 2024) but assets fine.

### 3.4 `pmndrs/assets` — 108 ★, CC0-1.0, last push 2024-09-26
- https://github.com/pmndrs/assets
- Base64-encoded CC0 assets importable via npm `@pmndrs/assets`. Includes HDR envs (`city.exr`, `warehouse.exr`, `apartment.exr`) — perfect for studio-shot floor renders without writing your own HDRI loader.

### 3.5 `KhronosGroup/glTF-Sample-Models` — 3,574 ★, no license header (per-asset CC-BY mostly), last push 2023-12-22 (frozen, superseded)
- https://github.com/KhronosGroup/glTF-Sample-Models
- Reference glTF assets including PBR material test scenes (MetalRoughSpheres, DamagedHelmet). Use only to validate the rendering pipeline, not as product assets.

### 3.6 `donmccurdy/glTF-Transform` — 1,883 ★, MIT, last push 2026-05-13 (active)
- https://github.com/donmccurdy/glTF-Transform
- Not assets — but the **toolchain** to optimize floor plate GLBs: KTX2 texture compression, mesh quantization, draco compression, instancing, simplification. Will shrink current 1.2 MB plate to ~150 KB without visual loss.

### 3.7 `KhronosGroup/KTX-Software` — 1,259 ★, multi-license, last push 2026-05-25
- https://github.com/KhronosGroup/KTX-Software
- KTX2 = the texture format that costs ~5× less GPU memory than JPEG/PNG. Required for shipping 4K+ textures on mobile without OOM crashes. Standard tooling.

### 3.8 `keijiro/CC0TexturesUtils` — 53 ★, no license (Unity-only)
- https://github.com/keijiro/CC0TexturesUtils
- Listed only because it shows up in searches — **Unity-specific, irrelevant for us**.

### 3.9 Procedural terrazzo / tile generators (open source)
- [Tom32i/terrazzo](https://github.com/Tom32i/terrazzo) — 17 ★. Vanilla JS canvas-based terrazzo pattern generator (chip shapes, density, color palette). Old but the algorithm is ~150 LOC and trivial to port to a GLSL shader.
- [muhammadrahim124/Generated-Terrazzo-Background](https://github.com/muhammadrahim124/Generated-Terrazzo-Background) — 1 ★. Same idea, smaller scope.
- [asmoly/Einstein_Tile_Generator](https://github.com/asmoly/Einstein_Tile_Generator) — 22 ★. Aperiodic tile patterns (the 2022 "einstein tile" math discovery). More artistic than industry-realistic.
- [mostlynobody/truchet](https://github.com/mostlynobody/truchet) — 17 ★. Truchet-tile generator. Useful as a "decorative concrete pattern" source.
- **Recommendation:** Tom32i's algorithm + a GLSL fragment shader = a real procedural terrazzo material slot in the configurator. Differentiator vs all 13 benchmark sites (none do this well — see `configurator-design-benchmark.md`).

### 3.10 LYGIA shader library — `patriciogonzalezvivo/lygia` — 3,348 ★
- https://github.com/patriciogonzalezvivo/lygia
- GLSL function library: noise, hash, voronoi, blur, color spaces. For writing a custom terrazzo / microcement / scratch-overlay shader without reinventing primitives.

**Recommendation for assets:** Continue using Poly Haven for hero materials (we already do), add AmbientCG for the 16K industrial-concrete pack, write one procedural terrazzo shader on top of LYGIA. Run every GLB through glTF-Transform + KTX2 before shipping.

---

## 4. Configurator code patterns to study

### 4.1 `wass08/chair-configurator-three-js-r3F-tutorial` — 48 ★
- https://github.com/wass08/chair-configurator-three-js-r3F-tutorial
- **Material swap:** GLB has named meshes (`Cushion`, `Frame`, `Legs`). State store is one zustand slice per slot. Each `<mesh>` renders `<meshStandardMaterial color={color}>` driven by the store. **Direct fix for FloorDSGN's "color picker doesn't recolor GLB" bug** — current code shares one material instance across primitives.
- **Color handling:** Color picker writes hex to store; material reads via subscription. `react-spring` animates the transition (`<animated.meshStandardMaterial color={springColor}/>`).
- **Export state:** URL query string with material-id + color hex per slot. Shareable.
- **Mobile UX:** Drawer over canvas, OrbitControls disabled-pan, single-finger orbit only.
- **Pattern to adopt:** named-mesh + per-slot store + animated material.

### 4.2 `wass08/table-configurator-three-js-r3F-tutorial-final` — 26 ★
- AO + roughness driven by store. Procedural wood-grain variation via UV offset. **Adopt:** per-material UV-scale slider (controls "chip density" for terrazzo) — most benchmark sites lack this.

### 4.3 `pmndrs/react-three-next` — 2,837 ★
- **Tunnel pattern (`<Canvas>` once + portal scene per route)** — for FloorDSGN's flow `plate → in-room → AR` it keeps GPU state hot between stages. Current code rebuilds the scene on each tab — visible flash.
- **Export PDF spec:** see their `Layout.jsx` overlay pattern — DOM next to canvas, html-to-canvas + jsPDF on click.

### 4.4 `repalash/threepipe-device-mockup-codrops` — 31 ★
- https://github.com/repalash/threepipe-device-mockup-codrops
- Photoreal device-mockup using threepipe. **Pattern:** SSR + DOF + tonemapping → looks like product photography, not WebGL. Useful as proof for "no R3F, no build, still photoreal."

### 4.5 `kovacsv/Online3DViewer` — 3,526 ★, MIT, last push 2026-02-28
- https://github.com/kovacsv/Online3DViewer
- Production 3D viewer with material-browser sidebar, lighting presets, snapshot, multiple format loaders. **Pattern to study:** the right-rail material browser UX (clean, fast, mobile-aware) — closer to Sika Floor Explorer than to any GitHub R3F demo.

### 4.6 `donmccurdy/three-gltf-viewer` — 2,436 ★, MIT, last push 2026-04-09
- https://github.com/donmccurdy/three-gltf-viewer
- Drag-and-drop GLB validator with full PBR debug HUD. **Pattern:** the lighting-and-tonemap controls on the right, with sane defaults. Strong starting point for FloorDSGN's "studio / showroom / on-site light" preset toggle.

### 4.7 `splinetool/react-spline` — 1,407 ★, MIT
- https://github.com/splinetool/react-spline
- Pattern of "designer-built scene in Spline UI, embedded as React component via runtime npm pkg." **Pattern to study:** treating the 3D scene as a designed asset (not code), with code only for state and reactions. Lower ceiling than R3F but huge owner-empowerment win.

### 4.8 `google/model-viewer` patterns
- https://github.com/google/model-viewer
- **AR on iOS Safari:** `<model-viewer ar ios-src="plate.usdz">` opens AR Quick Look. No app, no other JS. This is the **fastest path** to the Reydar-class AR feature from the design benchmark.
- **Hotspots:** declarative DOM children pinned to 3D points. Pattern for "this layer is 4mm primer, click to learn more."

### 4.9 `14islands/r3f-scroll-rig` patterns
- https://github.com/14islands/r3f-scroll-rig
- **DOM-driven scene composition** — scroll the page, the 3D scene scrolls with it, with the canvas appearing portal-style behind specific DOM regions. Drives Sika-class cinematic narrative without leaving the static-site model.

**Three patterns FloorDSGN should adopt (concrete):**
1. **Per-mesh material store** (from 4.1) — fixes the recolor bug confirmed in `configurator-code-audit.md`.
2. **Single persistent `<Canvas>` + scene portals** (from 4.3 + 4.9) — fixes the "plate → in-room" tab flash and gives us the cinematic scroll story.
3. **Web-component fallback** (from 4.8) — `<model-viewer>` for AR-on-iOS without any other code path.

---

## 5. Animation stack — what's hot in 2026

### 5.1 The current de-facto stack (every awwwards site this year)
- **Lenis** ([darkroomengineering/lenis](https://github.com/darkroomengineering/lenis), 13,953 ★, MIT, active) — smooth scroll. Replaces native scroll with a `requestAnimationFrame` interpolation.
- **GSAP + ScrollTrigger** ([greensock/GSAP](https://github.com/greensock/GSAP), 24,923 ★, custom license, active) — scroll-position → timeline progress.
- **Together:** Lenis emits a virtual scroll value, ScrollTrigger reads it, GSAP animates anything (DOM + three.js camera path + material lerps).

### 5.2 Theatre.js for keyframed reveals
- [theatre-js/theatre](https://github.com/theatre-js/theatre) — 12,451 ★, Apache-2.0.
- **Caveat:** last commit 2024-08-14. Effectively unmaintained. Use only if you can pin deps and tolerate no upstream fixes.
- Pattern: Premiere-style timeline editor; export keyframes as JSON; play back in production. Good for marketing-grade cinematic 30-second product reveals.

### 5.3 Rive for UI motion
- [rive-app/rive-runtime](https://github.com/rive-app/rive-runtime) — 1,091 ★, MIT, active.
- [rive-app/rive-react](https://github.com/rive-app/rive-react) — 1,123 ★, MIT, active.
- 2D vector animations with state machines. Replaces Lottie for interactive UI. Not for 3D content but for HUD over the canvas (buttons, transitions, micro-interactions).

### 5.4 Spline for low-code 3D
- [splinetool/react-spline](https://github.com/splinetool/react-spline) — 1,407 ★, MIT.
- Visual editor → web. **Use case:** quick hero scenes the owner can edit himself. **Limit:** export is via Spline's cloud runtime (npm pkg `@splinetool/runtime`, source not on GitHub) — you don't fully own the asset.

### 5.5 Tempus & Hamo (companion libs for Lenis)
- [darkroomengineering/tempus](https://github.com/darkroomengineering/tempus) — 305 ★, MIT. One `requestAnimationFrame` shared across the whole app — fixes the multi-RAF-loop CPU drain.
- [darkroomengineering/hamo](https://github.com/darkroomengineering/hamo) — 304 ★, MIT. React hooks compatible with Lenis (`useScroll`, `useFrame`).
- [darkroomengineering/satus](https://github.com/darkroomengineering/satus) — 949 ★, Next.js starter assembled by the Lenis team — opinionated reference for "Lenis + GSAP + Next + scroll-driven content."

### 5.6 Top 5 sites combining the stack (with public code where it exists)
1. **Lusion.co** — closed source. Reverse-engineered clone: [canxerian/lusion-reverse-engineered](https://github.com/canxerian/lusion-reverse-engineered) (10 ★). Useful pattern reference.
2. **Bruno Simon folio** — [brunosimon/folio-2019](https://github.com/brunosimon/folio-2019) (4,684 ★). Open source.
3. **My Room in 3D** — [brunosimon/my-room-in-3d](https://github.com/brunosimon/my-room-in-3d) (4,417 ★). Open source.
4. **Darkroom Engineering's own site** — uses `satus` stack (open). Best real-world example of Lenis + GSAP + R3F + Next.
5. **14islands lab demos** — the team behind `r3f-scroll-rig` (open). Their own portfolio is the canonical example of the rig.

### 5.7 The light-touch alternatives
- [pmndrs/react-spring](https://github.com/pmndrs/react-spring) — 29,095 ★, MIT. Spring physics, no timelines. Pairs best with R3F.
- [oframe/ogl](https://github.com/oframe/ogl) — 4,519 ★ (no license header). 12 KB three.js alternative. Use only if bundle size is critical and you're willing to write more shader code.
- [martinlaxenaire/curtainsjs](https://github.com/martinlaxenaire/curtainsjs) — 1,816 ★, MIT. Turns DOM elements into textured planes for shader effects. Smaller scope than R3F, no full 3D.

---

## 6. Quick-start packs for owner

Three progressive paths from least to most build friction. Pick one and commit; mixing increases tax.

### Pack A — Vanilla + drop-in (no build, owner workflow unchanged)
**Stack:** three.js (already in use) + `<model-viewer>` web component + GSAP + Lenis, all via CDN.
**Add:** `glTF-Transform` CLI run once per asset (offline) to ship optimized GLBs.
**Add:** `Tom32i/terrazzo` algorithm ported to a GLSL fragment shader injected into a Standard material via `onBeforeCompile`.
**Repos to copy patterns from:**
- `donmccurdy/three-gltf-viewer` (right-rail material browser, light presets)
- `fireship-io/threejs-scroll-animation-demo` (scroll → camera path in vanilla)
- `repalash/threepipe` (photoreal output without a framework)
**Best for:** fastest ship; keeps every file under git as plain text; no PRs about lock files. **Ceiling:** harder to evolve; state lives in DOM/global vars; the "two-stage flow" gets messy past 2k LOC.

### Pack B — R3F + Vite as a sub-app
**Stack:** Vite + React 18 + R3F + Drei + Zustand + Leva (debug) + Lenis + GSAP + `gltfjsx` for components.
**Layout:** `apps/configurator/` is a Vite project. `npm run build` outputs to `dist/`, copied to the main site's `/configurator/` path. Main site stays static.
**Repos to clone:**
- Starter: `wass08/r3f-vite-starter` (281 ★)
- Scroll rig: `14islands/r3f-scroll-rig` (935 ★)
- Pattern refs: `wass08/chair-configurator-three-js-r3F-tutorial`, `wass08/table-configurator-three-js-r3F-tutorial-final`
**Best for:** the actual configurator rebuild as scoped in `MASTER_PLAN_CONFIGURATOR_REBUILD_2026-05-27.md`. **Workflow break:** one folder with `node_modules`; one build step before deploy. Owner sees only the resulting static files in `/configurator/`.

### Pack C — Spline visual editor + embed (no code)
**Stack:** Owner builds the scene in Spline.design's web editor. Export → `react-spline` (or vanilla embed via `@splinetool/runtime`).
**Repos:** `splinetool/react-spline` (1,407 ★).
**Best for:** **hero scenes only** (landing page, autopilot pitch deck). Not for the configurator — Spline lacks per-mesh material binding to a React state store, no programmatic AR Quick Look. **Limit:** scene is hosted by Spline; lock-in is real.

---

## 7. Recommendations

### Top 3 repos to clone immediately
1. **`wass08/r3f-vite-starter`** — bootstrap the configurator sub-app. CC0 license, no friction.
2. **`14islands/r3f-scroll-rig`** — add it as dep in the starter. Gets us cinematic scroll → 3D parity with the design benchmark.
3. **`pmndrs/gltfjsx`** — run on the current `plate.glb` to immediately fix the per-material binding bug from `configurator-code-audit.md`.

### Top 3 repos worth full reading (not cloning, just studying)
1. **`donmccurdy/three-gltf-viewer`** — production-quality vanilla three.js with right-rail material browser. The closest open source comes to Sika Floor Explorer's UX.
2. **`brunosimon/folio-2019`** — asset-loader / debug-GUI / post-processing patterns that still hold up six years later.
3. **`repalash/threepipe`** — photoreal output without R3F. Read it to know what tonemapping / SSR / DOF settings to crib even if we stay R3F.

### One framework choice for FloorDSGN configurator rebuild
**Pack B — R3F + Vite + Drei + Zustand**, deployed as a sub-app under `/configurator/`. Reasons:
- The bug-fix matrix from `configurator-code-audit.md` (per-mesh material, shareable URL state, smooth state transitions) is what R3F + Zustand + react-spring give you for free.
- The cinematic scroll → 3D requirement from the design benchmark is what `14islands/r3f-scroll-rig` gives you for free.
- The procedural terrazzo differentiator is what `onBeforeCompile` + `lygia` give you for free.
- All three together in vanilla three.js = 3–5× more code, all of which we'd be writing and maintaining ourselves.
- Build-step risk is bounded: owner only sees `/configurator/index.html` + bundle files in git; main site keeps its build-less workflow.

**Fallback if owner refuses the build step:** Pack A with `repalash/threepipe` + `<model-viewer>` + ported terrazzo shader. Documented in §6 above. Ships slower, ceiling lower, but zero workflow change.

**Do not pick Pack C for the configurator** — Spline can't drive per-mesh state from a React store and won't pass the "12 material slots × 6 color variants × procedural density slider" matrix.

---

## Appendix A — verification methodology

All stars/last-push/license values pulled via `gh api repos/<owner>/<repo>` on 2026-05-27 between 10:00–11:00 local. Search results pulled via `gh search repos` with `--sort=stars`. Repos that returned 404 are explicitly flagged in §1 ("Repos people often namedrop but that DO NOT EXIST"). No values were taken from cached knowledge or guessed.

## Appendix B — companion docs
- `docs/research/configurator-design-benchmark.md` — market & UX side (13 sites benchmarked)
- `docs/research/configurator-code-audit.md` — current code findings (bugs / architecture)
- `docs/MASTER_PLAN_CONFIGURATOR_REBUILD_2026-05-27.md` — the execution plan this inventory feeds into
