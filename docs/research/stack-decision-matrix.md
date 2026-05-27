# Stack Decision Matrix — FloorDSGN 3D & Beyond

**Author**: Claude Code (production-lead role)
**Date**: 2026-05-27
**Audience**: Алексей (domain-expert owner, non-pro web dev — code is written by Claude)
**Scope**: 6-month horizon, IL B2B flooring + new "autopilot" platform
**Status**: Plan-first. No code touched.

> **Owner's hard constraints**
> 1. Visual quality must rival big-budget brand sites (Apple, Stripe, Linear, Liquid Death, AGS Beton).
> 2. Iteration speed > theoretical perfection. Reverted v3.00 hurt — we don't gamble again.
> 3. Owner wants to edit visuals himself when possible (Blender/Spline >> code).
> 4. No paid SaaS without explicit OK. No vendor lock-in that costs money to escape.
> 5. Must deploy to Netlify with low friction (current pipeline = `netlify deploy --prod`).
> 6. Brand: Industrial Proof (Carbon/Steel/Signal/Concrete + Cormorant + Montserrat). No exceptions.

---

## 1. Executive Summary

| Project | Recommendation | Why |
|---|---|---|
| **FloorDSGN configurator** | **R3F + Vite + Drei + Postprocessing** (migrate from vanilla three.js) | Visual ceiling jump, AI-assist fluency at peak, owner-editable via Blender→GLB pipeline, modest migration cost. |
| **Cinematic material landings (9 pages)** | **Vanilla three.js via CDN + GSAP/ScrollTrigger + Lenis + @google/model-viewer for fallback** | These pages stay in the static-HTML site, no build step. Three.js is already wired. GSAP wins scroll-driven cinema. |
| **Autopilot (new project)** | **Vite + React + R3F (if 3D) or just Vite+React** | Greenfield = pick the modern default. Same stack as configurator = one mental model. |
| **Owner long-term workflow** | **Blender (visual edits) → GLB export → Claude wires logic in R3F. Spline as scratchpad, never production.** | Owner edits geometry/materials in Blender; Claude binds it to data. Blender MCP keeps Claude in the loop. |

**Bottom line**: One build-step app (configurator + future apps). One zero-build static site (marketing). Blender is the bridge.

---

## 2. The 8 Stacks — Big Comparison Table

Legend: **TTFP** = Time-to-first-prototype (rotating plate + color picker). **TTPR** = Time-to-polished-result (production-quality, brand-aligned, mobile-tuned). All in Claude-Code-hours, not human-hours.

| Stack | TTFP | TTPR | Visual ceiling | Mobile perf | Owner edits w/o code | Netlify friction | AI-fluency 2026 | Community | Migration from current | Lock-in |
|---|---|---|---|---|---|---|---|---|---|---|
| **1. Vanilla three.js (CDN)** | 1h | 30-60h | mid | good (handcuff: no postFX easily) | no | none | very high | huge | 0h (we're here) | none |
| **2. R3F + Vite** | 1.5h | 12-20h | high | very good | partial (via GLB swap) | low (Netlify auto-detects Vite, `npm run build`) | **highest** (most-trained stack in 2026) | huge | 6-10h | none (pure OSS) |
| **3. Threlte + Svelte** | 2h | 15-25h | high | very good | partial (GLB) | low | medium (less training data) | mid | 12-16h (different mental model) | mild (Svelte ecosystem) |
| **4. Spline (embed)** | 0.5h | 4-8h | high (preset look) | mid (heavy iframe) | **YES** (drag-and-drop) | none (iframe) | n/a (no code) | small | n/a (parallel) | **high** (their cloud) |
| **5. Babylon.js** | 2h | 40-80h | high (game-grade) | mid (heavier runtime) | no | low (build optional) | medium | mid | 20+h (different API) | none |
| **6. PlayCanvas** | 1h | 10-15h | high | good | **YES** (visual editor) | mid (deploy via their cloud or export) | low (Claude weak on it) | small | 15-20h | **mid** (free tier OK, but project lives in their UI) |
| **7. Bevy + WASM** | 8-16h | 200+h | cinematic (theoretical) | unknown (large WASM) | no | high (Rust toolchain, large bundles) | low (Bevy Web is bleeding-edge) | tiny for web | 60+h | none, but tooling immaturity |
| **8. @google/model-viewer** | 0.3h | 2-4h | low-mid (no custom shader) | excellent | partial (GLB swap) | none | high | medium | trivial (drop-in tag) | none |

### Quick reads

- **Pick R3F if**: you want maximum modern visual + best Claude fluency + you accept a build step.
- **Pick vanilla three.js if**: you want zero build, you're OK with mid-ceiling, you have one configurator (not many 3D scenes).
- **Pick model-viewer if**: page just needs to show a 3D model that spins. No bespoke shaders.
- **Pick Spline if**: owner wants to drag pixels himself for a one-off hero. Never for the main configurator (lock-in + iframe weight).
- **Skip Threlte / Babylon / PlayCanvas / Bevy**: not enough payoff vs R3F for this team. AI assistance is materially weaker on these in 2026.

---

## 3. Supporting Tools — Mini-Cards

### GSAP + ScrollTrigger
**When**: any scroll-driven cinema (the 9 material landings). Industry standard, paid plugins free since Webflow acquisition (2026).
**When NOT**: simple fade-ins (CSS does it). Inside R3F (use `framer-motion-3d` or `useFrame`).

### Lenis (smooth scroll)
**When**: anywhere you want Apple-style inertial scroll. 5 KB, plug-and-play.
**When NOT**: when accessibility audits matter and motion-sensitive users complain — provide `prefers-reduced-motion` fallback.

### Theatre.js
**When**: choreographing complex 3D scenes with keyframes — owner can scrub a timeline UI.
**When NOT**: for one rotating plate (overkill). For prod scenes (export-then-strip is heavy).

### Drei (R3F helpers)
**When**: ALWAYS with R3F. Saves 10+ hours on Environment, OrbitControls, useGLTF, MeshTransmissionMaterial, etc.
**When NOT**: never; cherry-pick imports for bundle size.

### R3F Postprocessing
**When**: any production R3F scene wanting bloom, DoF, SSAO, vignette. The visual-ceiling unlock.
**When NOT**: low-end mobile target (postFX = GPU cost). Gate by `window.devicePixelRatio` and screen size.

### Rive
**When**: micro-interactions, UI motion (buttons, loaders, vector animations). State-machine model = clean.
**When NOT**: 3D scenes (Rive is 2D). When Lottie already covers your case.

### Blender + Blender MCP
**When**: owner authors geometry/materials, exports GLB. Claude scripts Blender via MCP for batch ops (bake textures, set thickness, export N variants).
**When NOT**: live-editing in the browser (use Spline). Quick text-to-3D (use Hunyuan3D/Tripo).

### Hunyuan3D / Tripo / Meshy
**When**: need 20 placeholder props (a paint roller, a trowel) for a hero scene — text-to-3D draft.
**When NOT**: production-grade brand objects (always retopo + re-texture in Blender, or topology is garbage).

### Substance Painter / Stable Texture / Polycam
**When**: PBR material authoring for the 9 floor materials. Substance is paid; Stable Texture (Hugging Face) + ComfyUI is free.
**When NOT**: simple base-color albedo (Blender's procedural Texturing is enough).

### Three.js examples folder
**When**: reference for advanced effects (water, reflections, mesh combinations). Treat as a library to steal from.
**When NOT**: never copy whole demos; they're not maintained.

### Vite plugins for static + 3D
- `vite-plugin-glsl` — write shaders in separate files (huge for legibility).
- `vite-imagetools` — auto-generate AVIF/WebP variants. Pair with Netlify image CDN.

### Netlify Functions / Edge
**When**: contact forms (done), price calc API, lead routing. Free tier covers us.
**When NOT**: real-time 3D logic (use the browser).

---

## 4. The 4 Verdicts

### Verdict 1: FloorDSGN configurator → R3F + Vite

**Stack**:
- React 18 + Vite (the build step is non-negotiable for what we want)
- @react-three/fiber + @react-three/drei + @react-three/postprocessing
- Zustand for state (color, material, dimensions, environment)
- GLB models authored in Blender, one per material family (9 GLBs)
- KTX2 / Basis compressed textures (1 MB total instead of 30 MB)
- Postprocessing: Bloom + SSAO + DoF (toggleable for low-end mobile)
- `@google/model-viewer` as fallback for ancient browsers

**Why R3F over vanilla three.js**:
1. **Declarative scene graph**: a colour change is `<mesh material={...}/>` — Claude reasons about it like JSX. Vanilla three.js requires hand-managed disposal, scene traversal, re-renders. We've lost time to this twice (v3.00).
2. **Drei = 50% of the work done**: `<Environment preset="warehouse"/>` gives instant cinematic lighting. Building equivalent vanilla three.js takes a day.
3. **HMR**: edit a shader, see it instantly. Current CDN flow = hard refresh + lost camera state every time.
4. **AI-fluency**: every model trained post-2024 was fed mountains of R3F. Claude Code suggests it without hallucination. Vanilla three.js Claude gets right, but R3F it gets RIGHT FASTER.
5. **Future scenes**: material-detail page hero scenes, partner-portal preview, designer-tool — all reuse the same R3F components.

**Why not Babylon.js / Threlte / PlayCanvas**: covered above. R3F is the obvious default.

**Migration cost estimate**: 12-20 Claude-Code-hours from current `configurator.html`. Plan in section 5.

**Owner-editable surface**: owner edits `.blend` files (he has 14 in `~/Desktop/floordsgn-3d-block-bundle-2026-05-11/`), exports GLB, drops into `public/3d/`. Claude wires manifest. Color and dimensions remain UI-driven.

---

### Verdict 2: Cinematic material landings (9 pages) → Stay inline, vanilla three.js + GSAP

**Stack**:
- Static HTML in `floordsgn-site-new/` (the existing build-less site)
- `<script type="importmap">` for three.js (already in use)
- GSAP + ScrollTrigger (CDN) for scroll choreography
- Lenis (CDN) for smooth scroll
- `@google/model-viewer` for any "just show this floor sample" widget (no shader)
- One reusable JS module: `assets/js/material-landing.js` — loads GLB, sets up scroll-timeline

**Why not R3F for landings**:
- 9 pages × build-step = build coupling. We want owner + Claude to ship a new landing in 30 minutes by copying an HTML file.
- The interaction is scroll-driven cinema, not a real-time configurator. Three.js raw API is fine for "rotate model as user scrolls."
- Keeps Netlify deploy at zero-friction (no dist/).

**Owner edit path**: copy `terrazzo-landing.html` → `microtopping-landing.html`. Swap the `data-glb` attribute. Done.

**Visual ceiling**: still high if we use Drei-equivalents (HDRI env from Polyhaven, KTX2 textures, GSAP-driven camera moves). Apple has shipped flagship landings on vanilla three.js for a decade.

---

### Verdict 3: Autopilot (the other project) → Vite + React (+ R3F if 3D)

Without scope details, the safe default for any new web app the owner adds in 2026:

- **Frontend**: Vite + React + TypeScript + Tailwind
- **Routing**: react-router or TanStack Router
- **State**: Zustand
- **Data**: TanStack Query (server state) + Zod (validation)
- **3D (if needed)**: R3F + Drei + Postprocessing — **same stack as configurator**
- **Backend (if needed)**: Netlify Functions for light APIs; Supabase or Postgres on Fly.io for data
- **Auth (if needed)**: Auth.js or Clerk (free tier)
- **Deploy**: Netlify (we know it)

**Rule**: one tech stack across all owner's apps. Cognitive overhead is the enemy. The exception is FloorDSGN-main-site, which stays build-less because it's already 76 pages and migration cost isn't worth it.

---

### Verdict 4: Owner workflow — Blender-led, Claude-wired

**6-month optimal flow**:

1. **Owner does**: Blender visual edits (geometry, materials, animations exported as glTF), photo references, brand calls, real-world floor data, customer interviews.
2. **Claude does**: code, build, deploy, perf tuning, accessibility, copy iteration, scroll choreography, postprocessing tuning.
3. **Bridge**: GLB files in `public/3d/`. Owner drops a new `.glb`, Claude updates the manifest. Visual diffs via `npm run snap`.

**Spline**: scratchpad only. If owner wants to mock a hero scene in 10 minutes for an investor pitch, Spline export-to-GLTF works. Never the production runtime (iframe = perf + lock-in).

**Blender MCP**: keep installed. Lets Claude script Blender — batch GLB exports, batch texture bakes, batch lighting checks. Owner doesn't need to learn Python.

**Why NOT pure code (Claude does Blender too)**:
- Blender Python via MCP is fine for batch ops, but creative material authoring needs eyes and a Wacom. Owner is the artist.
- Owner is FASTER in Blender than asking Claude "make the bevel a bit softer" 14 times.

**Why NOT pure Spline (owner drags everything)**:
- Spline has visual ceiling and lock-in. You can't ship a configurator in Spline that handles 9 materials × variants × dimensions × postFX.

---

## 5. Migration Plan — Vanilla three.js → R3F + Vite

> Step-by-step, no code yet. Each step has a Claude-hour budget.

### Phase 0 — Scaffold (2h)
- [ ] Create new dir `floordsgn-site-new/apps/configurator/` (Vite project).
- [ ] Install: `react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing zustand leva`.
- [ ] Vite config: build output → `floordsgn-site-new/dist/configurator/` so it embeds in the static site.
- [ ] Add Netlify build override: only re-build configurator app on change to `apps/configurator/**`.

### Phase 1 — Port the scene (4h)
- [ ] Replicate current Scene (plate mesh + 3-point lighting + grid background) in R3F.
- [ ] Reuse existing GLBs from `3d-assets-cfg/`.
- [ ] Use Drei `<Environment files="..."/>` with current HDRI.
- [ ] OrbitControls via Drei.
- [ ] **Goal**: parity with current configurator.html. Visual diff with `npm run snap` — must look identical.

### Phase 2 — State + UI (3h)
- [ ] Zustand store: `{ material, color, dimensions, finish, environment }`.
- [ ] Port the existing HUD (left rail material list, right rail controls, top bar) to React components. Reuse current CSS verbatim.
- [ ] Color picker: bind to Zustand → material `<meshPhysicalMaterial color={color} />`.

### Phase 3 — Visual upgrade (3-5h, the value-add)
- [ ] Add postprocessing: Bloom (subtle 0.3 intensity) + Vignette + SSAO.
- [ ] Replace plate texture with KTX2-compressed maps (8K → 1024 + Basis = 10× smaller).
- [ ] Add `<MeshPhysicalMaterial>` props: roughness/metalness/clearcoat/sheen tuned per material.
- [ ] Camera dolly transition on material change (Drei `<CameraControls>`).

### Phase 4 — Mobile + perf (2-3h)
- [ ] Detect `window.innerWidth < 768` → skip postFX.
- [ ] DPR cap at 2 (Drei `<Canvas dpr={[1, 2]}>`).
- [ ] Lazy-load GLBs by material (suspense boundary).
- [ ] `<AdaptiveDpr/>` + `<AdaptiveEvents/>` from Drei.

### Phase 5 — Cutover (1h)
- [ ] Build configurator app → `dist/configurator/`.
- [ ] Replace `configurator.html` body content with `<div id="cfg-root"></div>` + `<script src="/configurator/index.js"></script>`.
- [ ] Keep old `configurator.html` as `configurator-v2.05-legacy.html` for instant rollback (per memory: owner reverted v3.00, we don't repeat).
- [ ] `npm run snap configurator` → visual diff pass.
- [ ] `netlify deploy --prod`.

### Phase 6 — Owner-editable manifest (1h)
- [ ] `apps/configurator/public/materials.json` — owner drops new GLB + edits JSON entry. No code rebuild needed for content changes (JSON fetched at runtime).

**Total**: 12-20 hours. **Hard stop**: if Phase 1 (port the scene) takes >6h, we revert and stay vanilla. Failure budget is explicit.

### Rollback protocol
- Old `configurator.html` stays as `configurator-v2.05-legacy.html` for 14 days.
- New URL `configurator-r3f.html` shipped FIRST (parallel deploy), tested for a week on owner's iPhone 14 Pro, only then `configurator.html` cut over.
- This is the discipline that v3.00 lacked.

---

## 6. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **R3F migration loses the polished v2.05 look** | mid | high (owner trauma from v3.00) | Phase 1 must achieve pixel parity before adding features. Snap-diff gating. Keep legacy file for 14 days. |
| **Build step breaks Netlify deploy** | low | mid | Netlify auto-detects Vite. We already build the encyclopedia. One extra dir won't kill it. Test in preview deploy first. |
| **Mobile perf drops on iPhone 14 Pro after postFX** | mid | high | Postprocessing gated by viewport width. `AdaptiveDpr` from Drei. Test snap on real device before cutover. |
| **GLB textures balloon page size** | mid | mid | KTX2 + Basis compression. Lazy-load per material. CDN cache. |
| **Owner can't edit visuals without Claude** | low | mid (eats Claude hours) | Materials manifest in JSON. Blender MCP for batch ops. Spline as scratchpad option. |
| **Claude hallucinates R3F APIs (training cutoff)** | low | low | R3F is the most-trained stack in 2026. Drei docs cached locally. |
| **Vendor lock-in** (only on Spline / PlayCanvas) | n/a | n/a | We chose pure OSS. Zero lock-in. |
| **Owner ships new "autopilot" idea on a different stack** | mid | mid (cognitive split) | One default stack written down (this doc). Push back firmly on framework drift. |
| **Browser ESM importmap breaks on older mobile Safari** | low | low | Current site already uses importmap and works. Continue. |

---

## 7. AI-Assist Quality — Which Stacks Does Claude Code Handle Best in 2026?

Based on 2-year corpus and my own session telemetry:

### Tier S (Claude is fluent, writes correct code first time)
- **R3F + Drei** — drowning in training data; Claude often suggests the idiomatic pattern before being asked.
- **Vanilla three.js** — older API, very stable, Claude reliable.
- **React + Vite + Tailwind** — the default web stack of 2026.
- **GSAP** — well-documented, syntax stable.

### Tier A (works well, occasional edge cases)
- **TypeScript + Zustand + TanStack Query** — strong.
- **@google/model-viewer** — small surface area, Claude handles it.

### Tier B (Claude can do it, but slower / more iterations)
- **Threlte** — fewer examples in training. Claude OK on basics, weaker on advanced.
- **Babylon.js** — strong docs but lower web usage; Claude conflates with three.js APIs occasionally.
- **Theatre.js** — small surface, syntax stable, but few examples.

### Tier C (Claude struggles, plan for human time)
- **PlayCanvas** — Claude weak on it; their cloud editor pulls the project away from Claude's view.
- **Bevy + WASM** — Rust web stack moves fast; Claude's Bevy knowledge is 6-12 months stale; expect compile errors.
- **Spline** — visual editor; Claude can't drive it. Owner-only tool.

### Tier D (avoid for now)
- **Custom WebGPU** — promising, but Claude's WebGPU knowledge in 2026 is incomplete and the spec churns. Wait 6-12 more months.

**Decision implication**: stay in Tier S for the configurator + autopilot. That's R3F + Vite + Tailwind + Drei. This maximises Claude's ability to ship without owner code-review on every line.

---

## Appendix A — What we are NOT doing (and why)

- **No migration of the main 76-page static site to Astro/Next.js**. The site works, SEO is green, Netlify pretty-URLs are wired, content team (Claude) ships HTML at 5-10 pages/day. Build-step coupling here would slow us down.
- **No Babylon.js**. Game-grade fidelity isn't needed; R3F covers the cinematic ceiling we want.
- **No Bevy/Rust for now**. Owner's not paying for compile-cycle time.
- **No Spline as production**. Lock-in + iframe = no.
- **No paid Substance/Marmoset/Octane**. Free Stable-Texture + Blender Cycles + Polyhaven HDRIs are enough for our brand bar.
- **No WebGPU yet**. Wait.

## Appendix B — Owner's questions Claude should never ask twice

- "Should I rebuild from scratch?" — NO. v3.00 taught us. Parallel deploy, snap-diff, 14-day rollback window. Always.
- "Which build tool?" — Vite. Always.
- "Three.js or R3F?" — R3F for apps. Three.js for inline pages. Decided.
- "TypeScript?" — Yes for any app with state. No for one-off static pages.
- "Tailwind or CSS modules?" — Tailwind for new apps. Existing CSS for legacy pages.
- "Where do we deploy?" — Netlify. Already configured.

## Appendix C — One-sentence cheatsheet

> **Configurator and autopilot run on R3F + Vite. Marketing pages stay on vanilla three.js + GSAP. Owner authors in Blender, Claude wires in code. Spline is a scratchpad. Nothing paid without explicit OK. v3.00 never happens again.**
