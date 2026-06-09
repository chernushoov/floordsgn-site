# CANON.md — READ FIRST

Site canon for Floor.DSGN. **Read these before touching code or content — they override older docs / wiki / memory on conflict. Do not work «по памяти».**

- `DESIGN.md` — brand: «Industrial Proof» palette, Cormorant + Montserrat, logo, language rules.
- `SITEMAP.md` — canonical page structure, taxonomy, 301-redirects (`/floors` vs `/materials`).
- `NAVIGATION.md` — information architecture, conversion funnel, one primary action per page, `/lead` sink.
- `PERSONAS.md` — the 4 site avatars (Owner / Designer-Architect / Contractor / Builder).
- `STUDIO_ARCHITECTURE.md` — Studio = `floor-room.html` + `studio.js`; 3D layer-breakdown = separate `configurator.html` reached by a card-link, **never merged** into the Studio scene.
- `LIBRARY_ARCHITECTURE.md` — Floor Encyclopedia (`articles/*`) + blog consolidated into `/library`. *(operator-provided — pending.)*
- `FLOORDSGN_BACKLOG.md` — наряды (tracks A/B/C/D/N/PSN). One branch = one наряд.

Etalon commits (do not revert without explicit ask): hero3d `cc421cf`, cfg-mobile `076fdbc`, audit-fix `23ed628`, sprint0 `db80612`, studio-etalon `8f7a6a5`, configurator `83f6b45`.

> The per-agent read-first (steps order, memory) lives in the gitignored `AGENTS.md`; this committed file is the repo-wide canon pointer for every machine and order.
