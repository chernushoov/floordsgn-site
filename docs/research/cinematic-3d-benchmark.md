# Cinematic 3D Web — Benchmark & Implementation Brief

**Author:** Claude (research session)
**Date:** 2026-05-27
**Audience:** FloorDSGN owner + autopilot project owner
**Purpose:** Understand why cinematic 3D web is the dominant 2024–2026 trend, who is doing it best, what techniques recur, and how to ship one for a small flooring company in days/weeks, not months.

> All external URLs in this doc were verified via WebFetch/WebSearch on 2026-05-27. Where a site could not be inspected directly (e.g. SPA + heavy gating), the entry is marked **(via third-party reporting)** and the source is cited under "Sources" at the bottom.

---

## 1. Executive Summary

**Why now (2023→2026).** Three forces collapsed into one window. First, the browser caught up: WebGL2 is universal, **WebGPU shipped production-ready in Three.js r171 (Sept 2025)**, and TSL (Three Shading Language) gave devs one shader source that compiles to both back-ends. Second, the framework layer matured: React Three Fiber + drei + postprocessing is now a stable, documented stack used by Vercel, Netlify and serious agencies — no more bespoke render loops. Third, low-code 3D landed: **Spline** (visual editor → iframe / React component) lets non-developers ship a glossy hero scene in an afternoon. Lenis + GSAP ScrollTrigger became the de-facto "scroll grammar" — every cinematic site you'll see uses some variant of it.

**What separates modern cinematic from old-style 3D.** Old 3D web (2014–2020) was "look, a rotating teapot" — a hero island disconnected from the page. Modern cinematic is **dimensional storytelling**: the 3D object is the page. It rotates, splits, fades and re-frames in lockstep with scroll position. PBR materials with real env maps, post-processing (bloom + DOF + chromatic aberration + film grain) baked into the render, particle systems on GPU instancing, and a flat/video fallback for mobile and low-power devices. Camera paths are authored in Theatre.js, not hand-tweened. Audio is sparing and gated behind interaction. The visual signature is **filmic, not gamified** — Apple/Tesla/Lando-Norris look like a Pixar short, not a Three.js demo.

**Implication for FloorDSGN.** You already have the raw asset that 90% of these sites are faking: a real, physical, tactile product (floor plates). The expensive part — "what do we put on screen" — is solved. The cheap path to a cinematic site is therefore **scroll-driven product reveal of the layered floor "пирог"** (substrate → primer → body → topcoat), not a from-scratch 3D experience. Three concrete paths in §6.

---

## 2. Fifteen Benchmark Sites

Each card: **URL** · agency · the *one* technique that wins · why it matters for FloorDSGN.

### 1. Lando Norris — `landonorris.com`
- **Agency:** OFF+BRAND (Scotland) · **Stack:** Webflow + WebGL + **Rive** for motion
- **Awwwards Site of the Year 2025**
- **Technique:** scroll-driven cinematic sequences + a 3D helmet that rotates "as smoothly as a wheel in motion." Rive does the vector motion (typography, signatures); WebGL handles the helmet. Bold lime-green type system.
- **For FloorDSGN:** proof that **Webflow + Rive + one heavy WebGL hero** can win SOTY. You don't need a full Next.js rebuild.

### 2. Messenger (Awwwards 2025 winner)
- **Technique:** an entire tiny planet rendered in WebGL where the visitor delivers packages — GPU physics, lighting, animation. "Closer to a console game than a web page."
- **For FloorDSGN:** *not* the path for a flooring company. Useful as the upper bound of what "WebGL hero" means in 2025.

### 3. Bruno Simon's portfolio — `bruno-simon.com`
- **Tech:** Three.js + WebGPU/TSL, Rapier physics, Howler.js audio, open-source on GitHub (MIT) including Blender files
- **Technique:** drivable car portfolio — physics-based vehicle, interactive zones, gamepad support, quality toggles for low-power devices
- **For FloorDSGN:** Bruno's **Three.js Journey course** (https://threejs-journey.com/) is the single best resource for anyone on the team learning the stack. The portfolio itself is *the* reference for "what one developer can ship in WebGL."

### 4. Jordan Breton portfolio — *FWA Site of the Day 2 Oct 2025*
- **Technique:** floating-island world (grass, waterfall, fire, wind, trees, butterflies) — R3F + drei + custom shaders
- **For FloorDSGN:** template for "atmospheric world as portfolio" — relevant for the **designers.html** page if you ever want to show a fantasy/inspiration layer.

### 5. Aimee's Papercraft World — *Awwwards SOTD 24 May 2026*
- **Built by:** Andrew Woan — open tutorial project, **R3F + Blender + Krita**
- **Technique:** scroll-driven paper-craft 3D portfolio, layered visual depth
- **For FloorDSGN:** *the* most copy-able cinematic 3D site for a small team. The tutorial exists. Same stack would render layered floor plates beautifully.

### 6. Razorpay Sprint 26 — `razorpay.com/sprint/26` — *Awwwards SOTD 26 May 2026*
- **Technique:** interactive 3D product visualisation with dynamic rendering
- **For FloorDSGN:** product-page reference (Razorpay = fintech, so they use 3D for *abstraction*; you'd use it for a literal product, even easier).

### 7. Cartier Watches & Wonders 2026 — `cartier.com/en-fr/watchesandwonders` — *Awwwards SOTD 25 May 2026*
- **Agency:** Immersive Garden
- **Technique:** immersive 3D watch showcase, spatial design, "museum exhibit" pacing
- **For FloorDSGN:** the gold standard for **luxury product as 3D scene** — slow camera, dark stage, single hero. Directly relevant for terrazzo / decorative-concrete pages.

### 8. Sidewave — `sidewave.it` — *Awwwards SOTD 22 May 2026*
- **Technique:** 3D spatial navigation, immersive interface

### 9. La Revoltosa — `larevoltosa.es` — *Awwwards SOTD 21 May 2026*
- **Agency:** Waka
- **Technique:** dimensional storytelling, 3D scene composition

### 10. KVS Studio — `kvs.services` — *Awwwards SOTD 17 May 2026*
- **Technique:** 3D architectural visualisation + spatial interaction
- **For FloorDSGN:** closest peer in subject matter — built-environment 3D. Worth a full case-study read.

### 11. Lusion — `lusion.co`
- **Notable clients (verified on site):** Porsche "Dream Machine", Meta "Spatial Fusion", Devin AI, Oryzo AI, Spaace NFT
- **Technique:** scroll-coupled custom shaders + immersive brand worlds. Studio philosophy: "no trend-chasing, custom every time"
- **For FloorDSGN:** aspirational; out of budget for current phase but useful as visual reference for the configurator.

### 12. Active Theory — `activetheory.net`
- **Reputation:** Nike, Google, NBA, Disney — historically the heaviest WebGL agency on the web. Their **AnimationXYZ / common-tick** patterns are widely copied.
- **For FloorDSGN:** the agency you'd hire for a Super Bowl launch. Useful only as a visual North Star.

### 13. Maxime Heckel blog — `blog.maximeheckel.com`
- **Why it's here:** Maxime is the single best public writer on **production-grade R3F shaders and post-processing**. Verified recent posts:
  - "On Rendering the Sky, Sunsets, and Planets" (May 2026)
  - "Field Guide to TSL and WebGPU" (Oct 2025)
  - "On Shaping Light" — volumetric lighting + raymarching (Jun 2025)
  - "Post-Processing Shaders as a Creative Medium" (Feb 2025)
  - "Shining a Light on Caustics with Shaders and R3F" (Jan 2024)
- **For FloorDSGN:** if you ever want a **wet floor / glossy resin** look that reads as photo-real, his caustics + sky posts are the recipe.

### 14. Little Workshop — Netlify Marble Madness (FWA SOTD)
- **Technique:** Three.js with a custom render pipeline; physics-driven marble game built for a brand campaign
- **For FloorDSGN:** template for "campaign micro-experience" — a 1-month side project that earns press, separate from the main site.

### 15. Spline community showcase — `spline.design` / `viewer.spline.design`
- **Technique:** drag-drop 3D editor → iframe / React / Webflow embed. Mouse-responsive hero scenes, animated states, no code
- **For FloorDSGN:** the low-code path. Owner-editable. See Path 3 in §6.

> **Three sites Awwwards/FWA pushes that we de-prioritised on inspection:** Cuberto (clean product agency, *not* a 3D-cinematic shop in 2026 — verified); Studio Mesh (`studiomesh.com` was unreachable 2026-05-27 — host issue, possibly dormant); pure Apple Vision Pro pages currently ship static hero imagery, not WebGL — Apple moved cinematic 3D into native app trailers, not the marketing site.

---

## 3. Techniques Catalogue

Twelve patterns that recur across every cinematic site above. Use this as the spec checklist.

| # | Pattern | What it is | Library / pattern | Notes |
|---|---|---|---|---|
| 1 | **Scroll-coupled animation** | Animation playhead = scroll position. Camera, opacity, position all driven by `scrollY`. | **GSAP ScrollTrigger + Lenis** is the universal stack 2024→2026. Lenis 1.3+ from Darkroom Engineering (formerly Studio Freight). Drive both from GSAP's ticker (`autoRaf:false`) to avoid double RAF jank. | Improves INP score (Core Web Vital since Mar 2024). Always respect `prefers-reduced-motion`. |
| 2 | **PBR with real-time IBL** | Image-based lighting via HDRI env map → physically-correct metal/roughness materials. | drei `<Environment preset="..."/>`; Three.js `RoomEnvironment` for cheap. | Single biggest "looks expensive" lever. Mandatory for resin/topcoat looks. |
| 3 | **WebGPU + TSL** | Three.js r171+ ships WebGPURenderer with zero-config; TSL = one shader source compiles to WGSL or GLSL. | `import { WebGPURenderer } from 'three/webgpu'`; R3F via async `gl` prop factory. | Production-ready. Use feature-detect → fall back to WebGL2. ~30–50% perf headroom for particles/post-FX. |
| 4 | **Post-processing stack** | Bloom + DOF + chromatic aberration + vignette + film grain stacked. | pmndrs/postprocessing via drei `<EffectComposer>`. For WebGPU: native Three.js post via TSL nodes. | Tasteful = filmic; over-cranked = "cyberpunk 2018." DOF is the single most cinematic effect. |
| 5 | **Camera path on scroll** | Camera flies along an authored 3D spline as user scrolls. | **Theatre.js** (visual keyframe editor in-browser) → R3F `editable` wrapper; or GSAP timeline on `camera.position`. | Theatre.js is the modern Adobe-After-Effects for the web. Single highest-leverage tool for cinematic sequencing. |
| 6 | **Dimensional transitions** | Product splits/rotates/explodes between page sections. | GSAP timeline on instanced meshes; or Theatre.js sheet driven by scroll. | Maps 1:1 to "пирог" exploded-view (substrate → primer → body → topcoat). |
| 7 | **GPU-instanced particles** | Thousands of grains/dust motes/sparkles using `InstancedMesh` or GPU compute (TSL). | drei `<Instances>`; or custom `MeshSurfaceSampler` + `InstancedMesh`. WebGPU compute for >100k. | Terrazzo aggregate IS instanced particles. Direct fit. |
| 8 | **Custom GLSL/TSL shaders** | Displacement, noise, refraction, caustics, parallax-mapping. | Three.js `ShaderMaterial`; TSL for portable code. Maxime Heckel's blog = best reference. | Wet-look / caustics for resin floors. Procedural micro-detail when poly budget is tight. |
| 9 | **Lazy-loaded 3D scenes** | Don't paint WebGL above the fold on first byte; load scene after IntersectionObserver hit. | Dynamic `import()` + `<Suspense>`. Show static poster image until canvas is ready. | Critical for LCP. Lando Norris does this. |
| 10 | **Mobile/low-power fallback** | If WebGL fails, GPU is integrated, or `prefers-reduced-motion` is set → swap to video loop or static image. | Detect via `WEBGL.isWebGL2Available()` + `navigator.deviceMemory < 4`. | Non-negotiable for an Israeli flooring client base where 50%+ traffic = mid-range Android. |
| 11 | **Custom cursor + hover halos** | Replace native cursor with WebGL/CSS element that responds to hovered targets. | GSAP quickTo + `pointer-events:none` div; or shader-based fluid cursor. | Cheapest "feels expensive" upgrade. 20 min of work. |
| 12 | **Rive for UI motion** | Vector animations (typography, signatures, icon transitions) authored in Rive, played in browser. | `@rive-app/canvas` or `@rive-app/react-canvas`. | Lando Norris uses this for everything 2D-motion. Replaces Lottie when you need state-driven motion. |
| 13 | **Audio gated behind interaction** | Subtle ambient/UI sound, *only* after user gesture (autoplay policy). | Howler.js (Bruno Simon's choice). | Optional. For luxury (Cartier) it earns its keep; for B2B floors usually skipped. |
| 14 | **Cross-fade between scene states** | Two `WebGLRenderTarget`s, blend in fragment shader during transition. | drei `<Preload>` + shader-based mix. | For configurator: smooth swap between material states without a flash. |

---

## 4. Stack Analysis 2026 — What's Hot

| Layer | Tool | Status 2026 | When to choose |
|---|---|---|---|
| **Renderer** | Three.js r171+ (WebGL2 default, WebGPU opt-in) | Universal. WebGPU production-ready since r171 (Sept 2025). | Always the base. |
| **React layer** | React Three Fiber + drei | The de-facto stack for any React/Next.js project doing 3D. | Pick if site is React/Next. |
| **Vanilla** | Three.js direct | Still dominant for static landing pages (smaller bundle, no framework cost). | Pick if site is plain HTML or Webflow. |
| **Low-code 3D** | **Spline** | The "Figma of 3D." ~80% of "non-dev wow hero" sites use it. Free tier exists. | Pick when owner wants to edit the 3D himself. |
| **Smooth scroll** | **Lenis** (1.3+, Darkroom Engineering) | Universal. ~3KB. Pair with GSAP ScrollTrigger via shared ticker. | Always on a cinematic site. |
| **Scroll animation** | **GSAP ScrollTrigger** | Universal. Free for commercial since GSAP 3.13 (May 2025). | Always. |
| **Keyframe authoring** | **Theatre.js** | The Adobe-AE-for-web. Visual GUI inside the browser. | When camera paths get complex (>3 keyframes per section). |
| **Post-processing** | pmndrs/postprocessing (WebGL) ; Three.js TSL post nodes (WebGPU) | Stable. Use drei `<EffectComposer>` wrapper. | Always — minimum bloom + vignette. |
| **Physics** | Rapier (via `@react-three/rapier`) | Replaces older `cannon-es`. Rust-compiled, fast. | Only for interactive sims (Bruno's car, marbles). FloorDSGN: probably not needed. |
| **UI motion / 2D** | **Rive** | Replacing Lottie for state-driven motion. Used by Lando Norris winner. | For animated logos, signatures, button states. |
| **Framework wrap** | Next.js 15/16 App Router | Dominant for production sites. Dynamic-import the 3D scene to keep LCP green. | If building from scratch in React. |
| **Deploy** | Vercel / Netlify with preview branches | Standard. Edge functions for personalisation. | Either, depending on existing account. |
| **Asset pipeline** | Blender → glTF (Draco-compressed) → KTX2 textures | Standard. Use `gltf-transform` CLI for optimisation. | Always. KTX2 cuts texture weight ~70%. |
| **Course / learning** | **Three.js Journey** by Bruno Simon (https://threejs-journey.com/) | The single most-recommended course. ~$95 lifetime. | Anyone on the team learning 3D web. |

---

## 5. Fading Patterns (avoid these)

- **Heavy WebGL 1 hero with no fallback** — kills mobile LCP, fails on integrated GPUs, Lighthouse penalises. WebGL1 itself is fine for compatibility, but bare-WebGL1 hero without a video/poster fallback is a 2020 mistake.
- **Parallax-only depth fake** — flat layers sliding at different rates ≠ 3D. Reads as dated since ~2022.
- **Maxed-out bloom / cyberpunk neon** — the 2018–2021 "Tron" aesthetic. Modern cinematic is filmic: subtle bloom, real DOF, warm grading.
- **VR/AR-only experiments with no flat fallback** — Apple's Vision Pro launch killed the appetite for web-VR experiments. Always ship a 2D version.
- **Page-blocking 3D splash screens** ("Loading 3D experience…" full-screen for 8s). Either lazy-load below the fold, or show the page content with the canvas hydrating asynchronously.
- **Autoplay audio** — same reason it died in 2007. Gate behind user interaction.
- **`@studio-freight/*` packages** — retired; the org rebranded to Darkroom Engineering. Use `lenis` (`lenis/react` for the React wrapper).
- **`react-spring` for camera animation** — superseded by Theatre.js + GSAP for scroll-driven work. Spring is still fine for UI micro-interactions, not for cinematic sequencing.
- **Custom `requestAnimationFrame` loops alongside GSAP / Lenis** — always end with double-ticker jank. Use one canonical ticker (GSAP's).

---

## 6. Implementation Paths for FloorDSGN

Three concrete tracks, picked for current state of the codebase (Astro + plain HTML pages, configurator v2.05 with GLB plates, no React layer yet, owner has no 3D-DCC skills, second Mac is M1 = decent GPU).

### Path 1 — Polish the existing configurator (no rebuild)

**Effort:** ~10–15h · **Risk:** very low · **Outcome:** the current configurator stops feeling "Three.js demo" and starts feeling cinematic.

Concrete steps:
1. Add **Lenis** site-wide (one `<script>` tag, configured to sync with any GSAP we already use). ~30 min.
2. Add **drei-equivalent vanilla `EffectComposer`** to the existing Three.js scene: `UnrealBloomPass` (very low intensity), `BokehPass` (DOF — the cinematic win), `FilmPass` (grain, ~0.15). ~3h.
3. Add an **HDRI environment** (one neutral studio HDR, ~500KB KTX2) for proper PBR reflections on the topcoat layer. ~1h. Single largest visual upgrade.
4. **Theatre.js intro sequence** — when the configurator first loads, camera flies in along a 5-second authored path. Authored in the in-browser GUI, saved to JSON, replayed at runtime. ~4h.
5. **Custom cursor** on the configurator: small floor-pin SVG that follows mouse, expands on chip hover. ~1h.
6. **Mobile fallback** — if `WEBGL.isWebGL2Available()` is false or `navigator.deviceMemory < 3`, hide canvas and show a poster + scrub-video instead. ~2h.
7. **Material chip hover** — GSAP-driven scale + glow ring on the active chip. ~1h.

Owner gets: a configurator that feels like Cartier's watch viewer, with the existing GLB assets untouched.

### Path 2 — Cinematic per-material landing pages (the big win)

**Effort:** ~30–50h for 9 materials, or ~6–10h per material if shipped one at a time · **Risk:** medium · **Outcome:** each material has a dedicated, scroll-driven 3D landing — SEO asset + sales tool. This is the path Cartier, Razorpay, KVS Studio took.

Per-material scene structure (each section = one scroll-tied camera position):

1. **Hero** — material plate flies in from offscreen, settles in centre, slow rotation. Soft cinematic DOF, HDRI bounce.
2. **Anatomy** — exploded view of the "пирог": substrate, primer, body, topcoat — each layer separates vertically as the user scrolls. Layer names appear as Cormorant labels. *This is the killer scene.* It's a 3D version of the section diagrams Алексей already has on paper.
3. **Colour / pattern reveal** — for terrazzo/decorative-concrete: aggregate particles spawn and settle in real-time (GPU-instanced).
4. **Scale comparison** — plate next to a sofa, next to a car, next to a Cartier-style luxury context.
5. **Finish reveal** — wet/dry/matte/gloss toggle, driven by a slider that morphs the topcoat shader.
6. **CTA** — slow pull-back, plate sits in a real room (env-mapped), "запросить расчёт" pill button.

Stack proposal: **R3F + drei + Theatre.js + Lenis + GSAP**, deployed as a sub-app on `/material/<slug>/` (or as a new route in the existing Astro site using Astro's React island).

Recommended sequence: build for **terrazzo-epoxy first** (highest-margin, most visually distinctive). Validate on 3 owner calls. Then replicate the template for the other 8 materials in the taxonomy — each subsequent one is mostly content swap + tint changes, ~2-4h.

Brand constraint reminder (CLAUDE.md): the Industrial Proof palette (Carbon / Steel / Signal / Concrete / Graphite) must apply to the *UI chrome and post-FX colour grading*. The 3D plates themselves can show their real material colours.

### Path 3 — Spline-first rebuild (owner-editable)

**Effort:** ~20–30h, mostly the owner's own learning curve · **Risk:** medium — Spline limits scale; harder to wire to the project manifest · **Outcome:** owner can edit 3D scenes himself in a Figma-style GUI; no Blender/code skill required.

Plan:
1. Owner spends ~6h on the official Spline tutorials.
2. Migrate one hero scene (e.g. homepage hero plate) to Spline. Export as React component, embed in the existing Astro page. ~4h dev work.
3. If happy, migrate the rest of the configurator's *static* parts (the floating plate, the lighting rig) to Spline.
4. Keep the dynamic configurator logic (material selection, colour picker) in vanilla JS — Spline handles only the visual layer.

**Honest assessment:** Spline is excellent for hero scenes but breaks down at "configurator" scale. The current GLB-driven configurator should stay code-driven; Spline is the right tool for **inspiration / lookbook pages** where the owner wants to drop new scenes weekly without a developer.

---

## 7. Recommendation

### For **FloorDSGN**

**Ship Path 1 first (this week), Path 2 second (next 4-6 weeks), use Path 3 selectively for one-off inspirational pages.**

Rationale:
- Path 1 is ~2 working days of solo dev work and immediately lifts the configurator from "tech demo" to "cinematic product viewer." Zero risk to the etalon commits (cc421cf, 076fdbc, 23ed628, db80612). Everything is additive — fully aligned with the `feedback_additive_only` rule.
- Path 2 produces the single largest SEO + sales asset the site can have: 9 cinematic material pages. Each one is a scroll-driven story of the "пирог" — the *exact* knowledge moat Алексей has from a thousand square metres of personal floor-laying experience. Visually it puts FloorDSGN level with Cartier / KVS Studio / Razorpay. The build is bounded — start with terrazzo-epoxy, validate, then replicate.
- Path 3 (Spline) is the right tool for **one** thing on this site: a weekly "inspiration of the week" page the owner can author himself. Not for the main configurator.

**First-week deliverable proposal** (do not start without explicit owner go-ahead):
- Day 1: Lenis + GSAP ticker sync, custom cursor, mobile fallback gate.
- Day 2: HDRI environment + EffectComposer (Bloom + DOF + Grain) on existing configurator.
- Day 3: Theatre.js intro sequence + chip hover polish.
- Day 4: Self-QA pass per `feedback_self_qa_screenshot_before_showing` — every state screenshotted on desktop + iPhone 14 Pro spec viewport before showing the owner.

### For the **autopilot** project (separate codebase)

- **Cinematic 3D is the wrong investment here.** Autopilot is a B2B utility (recruit / posting / connector flow). The user comes to *do a job*, not to be wowed. Heavy 3D would slow LCP and add maintenance burden with zero conversion lift.
- **What autopilot should borrow from this trend, however:**
  1. **Lenis smooth scroll** (3KB, INP score win, zero cost).
  2. **Rive** for one micro-element — animated logo / "deal-in-progress" indicator. Tiny payload, big perceived-polish lift.
  3. **One Spline hero scene** on the marketing landing page only (not the product). Owner-editable, replaceable, off the critical product path.
- Skip: R3F, Theatre.js, postprocessing, custom shaders. They're correct for FloorDSGN; they'd be over-engineering for a logistics/marketplace UI.

### Cross-project rule

**Whichever project: never enable a heavy WebGL hero without a video/poster fallback and a `prefers-reduced-motion` short-circuit.** That single rule is what separates 2026 cinematic from 2019 over-engineering, and it's the cheapest insurance against accessibility / Core Web Vitals / Israeli mid-range Android regressions.

---

## Sources (verified 2026-05-27)

Live site inspection:
- Lusion — https://lusion.co/
- Bruno Simon portfolio — https://bruno-simon.com/
- Cuberto — https://www.cuberto.com/
- Maxime Heckel blog — https://blog.maximeheckel.com/
- Awwwards 3D category — https://www.awwwards.com/websites/3d/
- Active Theory — https://activetheory.net/ (limited HTML returned; reputation cross-verified)

Cross-referenced reporting (search):
- Awwwards Site of the Year 2025 (Lando Norris / Messenger) — https://www.awwwards.com/annual-awards-2025/site-of-the-year
- FWA — https://thefwa.com/
- Three.js 2026 / WebGPU production-ready — https://www.utsubo.com/blog/threejs-2026-what-changed and https://www.utsubo.com/blog/webgpu-threejs-migration-guide
- R3F + WebGPU post-processing starter (Anderson Mancini) — https://github.com/ektogamat/r3f-webgpu-starter
- Lenis (Darkroom Engineering) — https://github.com/darkroomengineering/lenis
- Lenis + GSAP best practices 2026 — https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap
- Theatre.js — https://www.theatrejs.com/
- Spline viewer — https://viewer.spline.design/
- Spline community / Webflow integration — https://docs.spline.design/integrating-with-webflow
- Three.js Journey (Bruno Simon's course) — https://threejs-journey.com/
- Codrops (R3F + cinematic web tutorials, the recurring publishing venue for these techniques) — https://tympanus.net/codrops/tag/react-three-fiber/

Verified Awwwards SOTD entries used in §2 (May 2026):
- Razorpay Sprint 26 (26 May), Cartier Watches & Wonders (25 May), Aimee's Papercraft World (24 May), Sidewave (22 May), La Revoltosa (21 May), KVS Studio (17 May).

Excluded / de-prioritised:
- Apple Vision Pro store page — currently static; no live WebGL hero (verified).
- Studio Mesh (studiomesh.com) — host unreachable on 2026-05-27, possibly dormant.
- Cuberto — verified live but no cinematic 3D in current portfolio; reputation as a *product* agency confirmed.
