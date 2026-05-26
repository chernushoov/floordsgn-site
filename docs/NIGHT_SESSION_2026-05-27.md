# FloorDSGN — Night Session 2026-05-27

Start: 00:18 IDT. Target: 07:00 IDT.
Branch: `launch/floordsgn-com-cf` (no prod deploy — owner reviews first).
Mode: fully autonomous; additive only; brand "Industrial Proof" locked.

## Source-of-pain references
- `docs/FLOORDSGN_PAIN_MAP_2026-05-23.md` — segment pains + roadmap by ROI
- `_audit/CONFIGURATOR_AUDIT_2026-05-18.md` — configurator details
- `docs/BUTTON_AUDIT_2026-05-11.md` — UI controls
- `docs/DESIGNERS_AUDIT_2026-05-23.md` — designers page gaps

## Pre-session state
- Lint: 0 errors, 1 warning (unused `data` in scripts/gen-pbr-maps.js) — trivial.
- a11y: 8 pages OK, 5 warnings each — informational.
- Build: not run yet.
- `dist/` — present, last build pre-session.
- Branch ahead of main: 5 commits.

## Findings to fix
1. **Tools not in nav.** decision-tool, substrate-check, visualizer, room-visualizer, compare, sample-kit, studio — scattered, missing from main nav on most pages.
2. **Sitemap.xml missing tools.** Only studio, substrate-check present. decision-tool, visualizer, room-visualizer, compare, sample-kit, designers (partial) missing or partial.
3. **Two visualizer pages** — `visualizer.html` AND `room-visualizer.html`. Need consolidation/clarity.
4. **No care-guide / warranty pages** (P4 pain-map gap: nothing after the sale).
5. **No repair-or-replace wizard** (P3 pain-map: highest intent search, competitors ignore).

## Waves (rolling)

### Wave 1: QA baseline — DONE
Lint clean, a11y green, English /en clean (0 cyrillic chars). Studio already not-noindex'd.

### Wave 2: Tools surface consolidation
Goal: every tool reachable from every page, sitemap + robots correct.

### Wave 3: Meta/SEO consistency

### Wave 4: Header/footer/mobile/CTA consistency

### Wave 5: Care + Warranty hub

### Wave 6: Repair-or-replace wizard

### Wave 7: Final QA + morning report

---

## Log (live)

### 00:18–00:30 — context gathering + plan
- Read wiki layer (floordsgn.md), pain map, release status.
- Lint + a11y baseline.
- Drafted 7-wave plan.

