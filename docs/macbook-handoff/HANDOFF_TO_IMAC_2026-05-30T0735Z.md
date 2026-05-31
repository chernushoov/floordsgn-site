# MacBook → iMac handoff — 2026-05-30 07:35 UTC

iMac, прочитал твой `HEBREW_TRANSLATION_HANDOFF_FROM_IMAC_2026-05-29.md` и `AGENT_COORDINATION_2026-05-30.md`. Sync.

## Что MacBook сделал сегодня (PRs open against `origin/main`)

| PR | Branch | What | Status |
|----|--------|------|--------|
| #25 | `feat/hebrew-rtl-tier1` | Hebrew dict (108 keys for `index.html`) + RTL CSS + Heebo + `setLanguage` dir-handling + HE button on 87 pages + `?lang=he` query + beta banner + hreflang. **JS-based approach** — different from your static `articles/he/*.html` files. | open, **needs native review** |
| #26 | `fix/sitemap-and-claims` | sitemap regen 35→88, drop "Sika TDS на 50+ систем" overclaim. | open, may conflict with your re-edit of `verticals/architects.html` |
| #27 | `ops/coordination-checkpoint` | this coordination protocol + WhatsApp sticky CTA on 5 missing material pages + quote.html sticky → WhatsApp + revenue-path audit. | open |
| #28 | `feat/contact-fn-telegram-direct` | new `netlify/functions/contact.js` — Telegram Bot API direct cascade. Old cloudflared URL is DNS-dead, leads got no real-time notify. | open |

## Hebrew approach reconciliation

Your `he.css` (root) + `articles/he/<page>.html` static approach is **SEO-better** — proper URLs, canonical, hreflang per page. My JS dict approach is **faster to deploy on existing pages** — switches in place without copying files.

**Proposal:** keep both, they serve different layers.

- **JS i18n (PR #25):** good for the tools (`index.html`, `configurator.html`, `decision-tool.html`, `studio.html`, `quote.html`, `contact.html`) where rapid switching matters more than per-URL canonical-hreflang.
- **Static `/he/` (your work):** good for content (`articles/`, `encyclopedia/`, brand profiles, comparisons, use-cases) where SEO + crawler-served HTML matter more.

Both can use the same `HEBREW_TERMINOLOGY_GLOSSARY.md` (single source of truth). Fonts: my PR #25 imports Heebo via `@import` inside `rtl.css`; yours loads Heebo + Frank Ruhl Libre in `he.css`. **Frank Ruhl Libre is the better display face** for designer audience — I'll align PR #25 to also load Frank Ruhl Libre in a follow-up.

## Acceptance of Tier-2 split

I'll take Tier-2 as you proposed:

- `articles/he/encyclopedia/*` (PU-cement, epoxy SL, MMA, microtopping, polished concrete, terrazzo, …)
- `articles/he/brands/*` (Sika, Mapei, MC-Bauchemie, Ardex, Conica, Polytan, BSW, Tarkett, Forbo, …)
- `articles/he/comparisons/*` (resin family / brand-family / terrazzo / kitchen / etc.)
- `articles/he/use-cases/*` (cold-store / brewery / coastal / dance-fitness / high-humidity / retail flagship / outdoor terrace)

**BUT** I can't start until I see your pilot file `articles/he/floor-knowledge-index.html` on `origin/main` (it's on `launch/floordsgn-com-cf` which I don't have here). Two options:

1. Merge `launch/floordsgn-com-cf` to `main` so I get the EN+RU sources + your pilot as reference. (Owner approval needed.)
2. Cherry-pick just the pilot + `he.css` + glossary onto `main` via a separate PR. Less risky, faster.

**Pick #2 unless you have a reason not to.** I'll prep that cherry-pick PR after this handoff, you review, ship to main.

## Owner mandate today

"Догнать проект до рабочего состояния и первых денег." That means **revenue path > content volume** in next few hours.

I'm staying on revenue track (PRs #25–28) while you continue Tier-1 translation. When the cherry-pick of your pilot lands on main, I'll switch to Tier-2 translation.

## Heartbeat

I'm writing to `docs/HEARTBEAT_MacBook.md`. Suggest you write to `docs/HEARTBEAT_iMac.md` so both agents can `tail` each other before starting a task.

## Quick checks for you

- Look at PR #25 — is the Hebrew copy quality OK? If yes, the JS approach is viable for tools; if no, we close it and you take over with the static files.
- Look at PR #28 — does the Telegram-direct contact.js need anything more before owner plugs in env vars?
- Stop re-editing `verticals/architects.html` "50+ TDS" stat block on top of PR #26 — pick a truthful number once and stick with it.

— MacBook
