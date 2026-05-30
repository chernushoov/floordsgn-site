# Resume checkpoint — MacBook agent

Overwritten after each commit. If a Claude session dies mid-task, the next session reads this FIRST before touching anything.

## Identity
- **Machine:** MacBook (alexey@Alexeys-MacBook-Pro)
- **Repo:** `/Users/alexey/Desktop/floordsgn-site` (clone of `chernushoov/floordsgn-site`)
- **Role:** PR-author. **Never push to `main`.**

## Last update
- **UTC:** 2026-05-30T06:50
- **Branch:** `ops/coordination-checkpoint` (clean working tree besides this checkpoint)
- **Recent commits visible on origin/main:**
  - `faebb6e feat(home): material switcher on the live 3D hero — all 10 systems` (iMac)
  - `a15aaba feat(home): live 3D hero — real GLB terrazzo` (iMac)
  - `80046c6 fix(configurator): default to procedural plate` (iMac, equivalent of my old PR #23)

## Open PRs (MacBook-authored)
| PR | Branch | Status | Gate |
|----|--------|--------|------|
| #25 | `feat/hebrew-rtl-tier1` | open, awaiting merge | **needs native Hebrew review** before merge per `LANGUAGE_STRATEGY_2026-05-12.md` |
| #26 | `fix/sitemap-and-claims` | open, awaiting merge | safe to merge; may conflict with iMac's new `verticals/architects.html` (which has a NEW `50+ TDS` stat block) — rebase will need to keep MacBook's `vt_arch_hero_lede` honesty fix |

## Owner mandate (priority order, 2026-05-30)
1. **Drive to first paying lead.** Revenue path: lead-form → email/Telegram → owner reply → quote → sale.
2. Hebrew (#25) and SEO/honesty (#26) help indirectly. Merge gates the owner.
3. iMac and MacBook agents work continuously in parallel; coordinate via `docs/AGENT_COORDINATION_2026-05-30.md`.
4. Owner is away for a few hours; **autonomy mandate** is high — don't wait for confirmations on non-destructive work.

## Immediate next task (this session)
- **Revenue path audit:** verify every lead-capture surface actually delivers to owner inbox/Telegram.
  - `contact.html` form action: where does it POST? Does it reach inbox?
  - `quote.html` form: same.
  - `industrial.html` and `designers.html` forms: same.
  - WhatsApp sticky CTA: does the wa.me URL pre-fill the right pitch?
  - Mobile sticky bar `sticky_cta_estimate` / `sticky_cta_sample` — wired to what?
- Output: `docs/REVENUE_PATH_AUDIT_<utc>.md` with red/yellow/green status per surface.
- After audit, fix the red items first. Open one PR per fix unless they're tightly related.

## Tasks deferred (do NOT pick up until owner says)
- **Hebrew Tier-2** (rest ~900 keys) — gated on native review of Tier-1 in PR #25.
- **EN expansion** (translate remaining HTML pages to /en/) — gated on owner deciding scope: full translate or drop EN switcher.
- **Project gallery cleanup** — `projects.html` lists 12 placeholder projects without images. Big content task, gated on real photos.
- **Move to Astro/SSG** — out of scope; site stays hand-rolled static.

## What to AVOID

- `index.html` and `configurator.html` — owner mandate: do not refactor these. Targeted edits OK; structural rewrites NO.
- `enhance.js` and `enhance.css` — same.
- The other agent's zone (see `docs/AGENT_COORDINATION_2026-05-30.md`).
- Force-pushes, --no-verify, --no-gpg-sign — all blocked / never use.

## Heartbeat
- Each commit appends a line to `docs/HEARTBEAT_MacBook.log` with UTC + hash + summary.
- Before starting work, `tail docs/HEARTBEAT_iMac.log` to see what iMac did last.

## How to re-enter the loop after API outage

The owner asked for a "check" so work resumes from where it broke. The Claude harness restores conversation context when the session restarts. As a backup, this file (`RESUME_HERE_MacBook.md`) holds the state. When a new session starts:

1. Read this file.
2. `git status -sb && git log --oneline -5`.
3. Read `docs/AGENT_COORDINATION_2026-05-30.md`.
4. Read `docs/HEARTBEAT_iMac.log | tail -10` to see what iMac did.
5. Pick up from "Immediate next task" above.
