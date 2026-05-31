# Floor.DSGN — Combined Research Report

**Source:** iMac Claude session (consolidated 2026-05-27 from 200-user simulation + hostile expert review + supplier readiness + P0 fix list).
**Purpose:** canonical reference for both MacBook + iMac Claude instances. Treat as ground truth for avatars, P0 work, supplier outreach.

> **Sync note (MacBook, 2026-05-27 22:35):** iMac unreachable (different LAN, 192.168.1.x vs 172.20.10.x). This file is the bridge — iMac Claude pasted the report into chat, MacBook commits it to `platform-foundation`. When iMac comes back online, both sides have identical source.

---

## 1. Overview

Floor.DSGN transforms a traditional flooring company into an engineering-driven digital platform. Goal: 3D system configurator + engineering library serving homeowners, architects, designers, industrial managers, suppliers. Must offer accurate technical data, compelling visuals, clear decision flows, trust features (verified docs, real projects).

## 2. 200-User Simulation Summary

10 roles × 20 simulated users: interior designers, architects, restaurant owners, warehouse owners, engineers, suppliers, contractors, private clients, developers, safety/ops.

### 2.1 Overall

- **Idea potential:** 9/10
- **First impression:** polished 3D + textures → instant trust
- **Clarity:** without role selector, users unsure if platform is for them — **segmented onboarding required**
- **Technical trust:** architects/engineers/safety need verified TDS/SDS, clear "not recommended", placeholders marked
- **Commercial trust:** restaurant/warehouse owners care about downtime, cost, anti-slip — surface early
- **Supplier interest:** intrigued but want accurate representation + brand protection

### 2.2 Role highlights

- **Interior designers** — love microtopping/terrazzo visuals; need more color presets, real interior photos, sample-kit ordering
- **Architects** — value layers/limitations/PDF; require verified docs, substrate requirements, maintenance notes
- **Restaurant owners** — anti-slip, cleaning, downtime; hide jargon
- **Warehouse owners** — heavy duty vs thin guidance; crack repair + substrate reassurance
- **Engineers / PMs** — moisture limits, surface prep, joints, application conditions, warnings about cutting corners
- **Suppliers** — featured listing but with approval workflow; brand protection mandatory
- **Contractors** — layered breakdowns for client + cost justification + price tied to substrate
- **Private clients** — simplified flow, decorative vs industrial suggestions by use-case
- **Developers / asset managers** — multi-object cost, maintenance plans, standardization (P1)
- **Safety / fire / ops** — certifications visible: fire rating, slip, hygiene — distrust if missing or unverified

### 2.3 Key friction → improvements

1. **Role selector / segmentation** — homepage entry: designer / architect / owner / supplier
2. **Verification badges** — `verified` / `pending` / `placeholder` visible on every datum
3. **Pricing + downtime early** — visible with assumptions + disclaimer
4. **"Not recommended"** — explicit per system (e.g. microtopping not for commercial kitchens)
5. **Improved PDF spec** — professional layout: layer tables, performance, cost, brand
6. **Substrate + condition selector** — concrete quality, existing tiles, cracks, moisture
7. **Real project cases** — before/after, area, timeline, lessons
8. **Supplier mode** — dedicated benefit-driven view + data requirements + lead routing
9. **Developer tools** — multi-object estimator, maintenance cost (P1)
10. **Compliance panel** — fire / slip / hygiene certifications (verified only)

## 3. Hostile Expert Review (50 objections)

Six adversarial personas: skeptical architect, senior flooring engineer, supplier tech manager, competitor contractor, burned PM, safety/compliance reviewer.

### 3.1 P0 — Must fix before demo / launch

- **Misleading safety claims** — fire rating, VOC, slip, hygiene only with verified certificates; otherwise `pending`
- **Moisture & substrate limits** — present per system; absence is misleading
- **Brand misuse** — no Sika/Mapei logos or names without written permission; use generic placeholders
- **Layer thickness & primer details** — correct ranges; no dashes / blanks
- **Price disclosure** — material + labour ranges + disclaimer + "final cost depends on site inspection"
- **Joint treatment** — all industrial systems must show joints
- **Microtopping in kitchens** — explicitly NOT recommended (hygiene + slip)
- **Slip rating** — R9–R12 per system + anti-slip options
- **Pot life & working time** — pot life, recoat, full cure for resins
- **Temperature & humidity limits** — application + storage conditions
- **Chemical & thermal limits** — no claims without tables; mark `pending`
- **Warranty terms & maintenance** — required to justify durability claims

### 3.2 P1 — Important after launch

- BIM objects + CAD downloads
- Thermal shock testing results
- Local standards (Israeli) + code integration
- Mixing ratios + packaging sizes
- Cleaning agents + compatibility
- Sample kit request system with trade verification

### 3.3 P2 — Nice to have

- Decorative options: metallics, stone sizes, aggregate density
- Version control on system names + spec changes
- Hazard symbols on packaging reference
- Case study library + time-lapse videos

## 4. Supplier Meeting Readiness

1. **Objectives** — show platform value (presentation + 3D + spec + lead gen) + obtain technical data + explore partnership models
2. **Pre-meeting checklist** — hero systems polished: PU-Cement Kitchen, Heavy Duty Epoxy/Quartz, Microtopping Premium, Terrazzo, MMA Fast Repair. Supplier demo page + role selector + print spec. ≥3 case studies
3. **Demo script** — problem statement → digital library concept → 3 tailored scenarios (kitchen / warehouse / luxury villa) → data-driven benefits → CTA → finished spec. Never promise unrealistic performance; always "confirmed via site inspection"
4. **Data request** — TDS, SDS, build-ups, primer/topcoat, consumption, thickness, cure, pot life, substrate prep, chemical/thermal resistance, slip ratings, certificates (fire/food), color charts, project photos. IP remains supplier's
5. **Partnership models** — tiered: basic listing / featured system / preferred partner; data + marketing + incentives in exchange for visibility; clarity on lead + revenue share
6. **Follow-up** — recap email, logo permission, next call, discount / exclusivity negotiation, feedback channel for tech corrections
7. **Risk mitigation** — document source URLs + version history; unverified = `pending`; no performance claims / partnership statuses without official approval

## 5. P0 Developer Fix List — actionable

Before any supplier meeting or paid traffic:

1. **Verification taxonomy across data**
   - Per-claim status: `verified | pending | placeholder`
   - Visible badge on every system / material / certification

2. **Brand cleanup**
   - Sika: keep (existing permission)
   - Mapei, MC-Bauchemie, BASF, Pandomo, Kerakoll, StoCretec: replace explicit names with placeholders or "supplier candidate" until written approval received
   - Logos removed everywhere

3. **Per-system completeness gates** (block publish until):
   - Slip class (R9–R13) — real, not generic "low/high"
   - Moisture limit (% CM) — explicit number
   - Substrate strength (MPa pull-off) — explicit
   - Pot life (min @ 20°C)
   - Working time / recoat / full cure
   - Application: min/max temp + humidity + dew point margin
   - Storage conditions
   - Chemical resistance — table or "pending"
   - Thermal limits — table or "pending"
   - Warranty term + maintenance plan
   - Joint treatment (industrial only)

4. **Microtopping kitchen warning** — `notRecommendedFor` must include `commercial-kitchen` with reason text

5. **Pricing UX** — range + disclaimer + "site inspection" copy on every estimate

6. **Documents** — TDS/SDS pull from `documents/<supplier>/<sku>.pdf` with on-disk verification; missing PDF → `pending` badge

7. **Role selector** — homepage entry → tailored configurator path per persona

## 6. Simulation methodology (detail)

200 users split:
- 40 interior designers
- 30 architects
- 25 restaurant / café owners
- 25 warehouse / factory owners
- 20 engineers / project managers
- 15 material suppliers
- 15 contractors
- 10 residential / villa clients
- 10 developers / asset managers
- 10 safety / fire / ops professionals

Metrics on 0–10: clarity, visual impact, technical usefulness, trust, commercial value, likelihood to convert, likelihood to share, supplier interest. Per-user collection: first-impression (5s), first click, revisited elements, confusion points, trust triggers, objections, suggestions.

## 7. Hostile review — expert personas

1. Skeptical Architect — standards, spec accuracy, liability, client trust
2. Senior Flooring Engineer — layer composition, moisture, joints
3. Material Supplier Technical Manager — brand control, data misuse, claims
4. Competitor Contractor — looking for marketing-gimmick angles
5. Burned PM — transparency + risk disclosure
6. Safety / Compliance Reviewer — fire, food hygiene, slip, regulatory

Headline takeaways:
- Verification & transparency essential — `Verified / Pending / Placeholder` badges on every critical property
- Scope control — do not market FDSL as definitive until data complete
- Legal risk — remove or rephrase guarantee-shaped statements; strong disclaimers for price / performance / warranty / certificate
- Data integrity — no wholesale copy of supplier text; summarise + interpret; missing = labelled + plan
- Expert-level detail — substrate moisture, primer spec, joints, thickness tolerance, maintenance
- Brand usage — logos only with permission + correct product names + certifications

## 8. P0 Developer Fix List — six themes

1. **Role-based experience** — clear entry per user type (designer, architect, owner, engineer, supplier); fast routing to relevant info
2. **Technical accuracy & verification** — `Verified / Pending / Placeholder` labels on every datum; no unverified claims about food safety, fire, slip, price; primer + thickness + moisture + joints + application conditions per system
3. **Transparent pricing & scope** — assumptions + optional costs (crack repair, joints, substrate removal, night work) + "final price depends on site inspection"
4. **Supplier branding & rights** — no logos / product names without written permission; placeholders + explanation of how supplier data will appear once approved
5. **Critical system logic** — fix incorrect layer compositions (e.g. epoxy thickness for heavy duty); mark microtopping NOT for kitchens; add joint treatment layers where appropriate
6. **Safety & compliance** — sections for slip rating, moisture, temperature/humidity, VOC, certificate status; remove or rephrase absolute claims

## 9. Pre-supplier-meeting tasks

- **5 hero systems polished** — PU-Cement Kitchen, Heavy Duty Epoxy/Quartz, Microtopping Premium Interior, Terrazzo, MMA Fast Repair → correct layers, realistic textures, color/aggregate options, exploded view, price/timeline ranges, not-recommended sections, verified/pending badges
- **Supplier demo page** — role selector + 3 polished scenarios (kitchen / warehouse / villa) + hero system selector + layer stack + exploded view + price estimate + PDF/spec preview + WhatsApp CTA + sample kit CTA + supplier value section
- **Print / PDF spec** — clean professional template for ≥2 systems (PU-Cement + Microtopping): brand, layer table, limits, price range, disclaimer
- **Case examples** — placeholder photos / renders matching each hero system
- **Data request list** — TDS, SDS, certificates (fire / food / slip), build-ups, primers, topcoats, consumption, thickness, cure, pot life, color charts, project photos, price ranges, MOQs, warranty
- **Legal / branding** — no supplier logos / specific product names in demo without approval; use placeholders + explain brand-rights respect
- **Negotiation strategy** — what we offer (priority placement, co-branding, analytics access, exclusive features); what we expect (data completeness, marketing support, pricing terms)
- **Success metrics** — e.g. supplier commits to full data for 3 systems + follow-up meeting scheduled

## 10. Next steps (sequenced)

1. **Customer avatars (5)** — based on simulation roles (designer / architect / restaurant owner / warehouse manager / private client) — data file + behavior model
2. **P0 fixes** — fields above, batch into `data/*.json`
3. **Demo prep** — hero systems polished, role-selected demo flows, real project placeholders filled
4. **Supplier meetings** — using data request + partnership tiers from §4
