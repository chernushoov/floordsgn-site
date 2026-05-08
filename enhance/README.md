# enhance/ — isolated additive layer

This directory and the two root files `enhance.css` and `enhance.js`
form a fully **isolated layer** on top of the existing Apple-style
production site. The layer **does not modify** any existing CSS, JS,
fonts, palette, class names, or HTML sections.

## What it adds

- `/quote.html` — calculator (chip + slider × area → orientational total)
- spec-table + fit-matrix on materials/concrete.html, materials/rubber.html, materials/restoration.html
- project filter chips above the masonry on `projects.html`
- audience switcher pill-tabs (b2b / design / resi) overlayed on the home hero
- 3D rotating terrazzo plate section on home (between services and CTA)
- onboarding overlay on home (first-visit, 3 screens: welcome → persona → type)

## How to remove a feature
1. Delete its block in `enhance.css`.
2. Delete its `fx.init*` function in `enhance.js`.
3. Remove the corresponding HTML (or the `<link>`/`<script>` lines in the page).

## Conventions
- All CSS classes are prefixed with `.fx-`.
- All JS lives under the `window.fx` namespace.
- LocalStorage keys use the `fx_` prefix: `fx_onboarded`, `fx_audience`, `fx_type`.
- URL overrides: `?reset=1` (reopen onboarding), `?audience=b2b|design|resi` (preselect persona).
