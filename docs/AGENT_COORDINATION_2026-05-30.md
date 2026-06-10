# Agent coordination — 2026-05-30 (24/7 autonomous mandate)

Two Claude agents are working on this project in parallel: **iMac agent** (autonomous overnight worker on `~/Work/02-Projects/floordsgn/floordsgn-site-new`, pushes to `origin/main`) and **MacBook agent** (pair partner on `~/Desktop/floordsgn-site`, opens PRs). To stop overwriting each other we own different surface area.

If you are an agent reading this — find your machine's section, that is your zone. Ask before touching the other's zone.

## Hostname → role

```bash
hostname  # check who you are
# iMac-AgentMachine / iMacAgetMachine.lan      → iMac agent
# Alexeys-MacBook-Pro.local / any "macbook"    → MacBook agent
```

## Zones

### iMac agent (autonomous, pushes to `main`)
- Anything **content** (blog posts, encyclopedia, brand pages, project case studies).
- Anything **studio / specs / configurator JS data** (specs/, studio.html, decision-tool.html data wiring).
- Anything **CAD** (specs/cad-details/*).
- **Brand & supplier pages** (`articles/` brand profiles, comparisons, IL distributor briefs).
- Site deploys (zip → Netlify API). iMac is the deploy hub.
- Owner reports (`docs/MORNING_BRIEFING_*.md`, `docs/BLOCKERS_FOR_OWNER_*.md`).

### MacBook agent (this one — opens PRs)
- **i18n / translations** (`translations.js`, `js/he-translations.js`, `rtl.css`, language switcher).
- **3D plate factory** (`tools/blender/*`, `3d-assets/plates/*.glb`, `3d-assets/textures/*`).
- **SEO infrastructure** (sitemap.xml generator, hreflang, canonical, robots).
- **Lead-flow plumbing** (forms in `contact.html` / `quote.html` / `industrial.html` / `designers.html`, Netlify functions wiring, WhatsApp link audit).
- **Honesty pass** on hero/CTA copy (factual counts only).

## Hard rules

1. **Never edit a file in the other agent's zone without writing intent to `docs/HANDOFF_<utc>.md` first**, committing it, and pushing. The other agent polls these.
2. **Never push directly to `main`** from MacBook — always via PR. iMac pushes to main locally and deploys.
3. **Never force-push.** Ever.
4. **Never `git reset --hard` or `git clean`** without an explicit owner instruction.
5. If your PR conflicts with main (because iMac merged something), **rebase**, don't merge-commit.

## Soft rules (current open PRs from MacBook)

- **PR #25** `feat/hebrew-rtl-tier1` — Hebrew Tier-1 + RTL + domain swap. **Needs native Hebrew review before merge.** Do not touch `js/he-translations.js`, `rtl.css`, or `translations.js setLanguage` until owner reviews.
- **PR #26** `fix/sitemap-and-claims` — sitemap regen (35→88) + drop "Sika TDS на 50+ систем" overclaim. iMac re-wrote `verticals/architects.html` after this PR was opened and put a NEW "50+ TDS" stat in. **Owner-decision:** which version of architects.html truthfully reflects what Sika gives us? Until then this PR may merge with conflict on architects.html — pick MacBook version of `vt_arch_hero_lede` (honesty), keep iMac's stat block intact.

## Heartbeat protocol

Each agent writes one line to `docs/HEARTBEAT_<machine>.log` every time it commits, with UTC timestamp + commit hash + summary. Other agent reads tail of opposite log when starting a session.

## Resume after API outage

Each agent maintains `docs/RESUME_HERE_<machine>.md` — overwritten after every commit, contains: (a) current branch, (b) last 3 commits, (c) immediate next 1–3 tasks, (d) any half-done work to NOT lose. If the agent's session dies mid-task, the next session reads RESUME_HERE first.

## "First revenue" north-star

The owner explicit goal today: **drive project to working state and first paying lead**. Priority order:

1. Make sure lead-form on every page actually delivers a lead (Netlify function or email or Telegram).
2. WhatsApp CTA works end-to-end (link → opens chat with pre-filled message).
3. Quote calculator returns a real number, not "TBD".
4. Honest pricing visible on at least 3 hero materials.
5. Hebrew live for IL market (after native review).
6. Top-of-funnel SEO (sitemap, hreflang, Search Console).

Whichever agent picks up an item, write to `docs/HANDOFF_revenue_<utc>.md` so the other doesn't double-work.
