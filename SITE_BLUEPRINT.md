# FloorDSGN — Site Blueprint

Date: 2026-05-08
Status: Living document, edits in PR
Companion to: PROJECT_PLAN.md (process / commercials), this doc (content + UX vision)

---

## 0. Promise

> **Технический учебник по напольным покрытиям, который продаёт своей экспертностью**, упакованный в **самый удобный futuristic-сайт в нише — суммарно превосходящий всех конкурентов**.

Two layers of value, both required:

1. **Контент:** человек заходит и понимает — какая система, какой слой, сколько материала, сколько стоит работа, какие подводные камни. Звонит уже подготовленным.
2. **UX:** 3D, конфигуратор, сравнение, room-visualizer, smooth-anim — то, чего нет у Stonhard, Bolon, Sika и тем более ни у одного из 10 израильских игроков **вместе взятых**.

---

## 1. Аудитория

### Кого обслуживаем (3 tier)

| Tier | Кто | Что ищет на сайте | Главный CTA |
|---|---|---|---|
| **1. Architect / Designer / Specifier** | Делает спецификацию для проекта, нужны TDS и образцы | CAD-details, slip class, цвета, sample, прецеденты с named architects | Sample request + ungated PDF |
| **2. Facility / Operations / Procurement Manager** | Завод, склад, ритейл-сеть, гостиница. Нужны данные по downtime, нагрузке, гарантии. | Vertical landing, case studies с m² + dni downtime, цены | WhatsApp + Site Survey |
| **3. Informed homeowner / GC** | Делает ремонт премиум-квартиры. Уже знает разницу epoxy/terrazzo, нужна экспертиза не базар | Сравнение, образцы, реальные проекты | Sample + WhatsApp |

### Кого СОЗНАТЕЛЬНО не обслуживаем

- Tire-kicker homeowner, который "хочет красивый пол как на пинтересте" и не понимает разницы между microtopping и epoxy. Тон сайта отсеивает их сам — они уйдут на Adel или epoxyfloor.co.il.
- Bargain hunter — мы не competing on price.

**Это не баг, это фича.** Премиум-позиционирование требует фильтра. Чем экспертнее звучим, тем лучше квалификация лидов.

---

## 2. Content principles (правила копирайта)

1. **Show systems, not just materials.** "Эпокси" — это не одна вещь, это семейство 5+ систем (seal-coat 0.5mm / self-leveling 3-5mm / troweled HBS 6-12mm / ESD-conductive / decorative). У каждой — свой use-case, цена, толщина. Раскрываем каждую как отдельную страницу.
2. **Show layers.** Каждая система визуализируется буклапом сверху вниз: топкоут → основной слой → праймер → подготовка основания. Толщины + расход материала + назначение каждого слоя.
3. **Show numbers, не прилагательные.** Никаких "premium", "leading", "best". Везде цифры с единицами и стандартом: "≤4% RH (ASTM F2170)", ">55 MPa @ 28d (ASTM C109)", "R10 slip (DIN 51130)".
4. **Show where NOT to use it.** Anti-fit list — самый сильный trust signal. Если все материалы подходят везде — никто не верит ни одному.
5. **Show pitfalls.** Что обычно идёт не так — moisture migration, joint movement, incorrect primer, missed CSP. У конкурентов это закопано или отсутствует.
6. **Show process.** 7 шагов от замера до сдачи: assessment → CM-test → prep → primer → body → finish → handover. С таймлайном.
7. **End in concrete CTA.** Не "Свяжитесь с нами". А: "Заказать физический образец 100×100mm" / "Скачать TDS PDF" / "WhatsApp инженеру проекта" — три CTA на любой странице системы.

---

## 3. UX / Design principles (futuristic layer)

### ⚠️ INVARIANT: Apple-style визуальный baseline сохраняется

`origin/main` (Apple-style редизайн от 2026-03-26) **остаётся фундаментом**. Не делаем bento home redesign, не делаем dark-mode default, не меняем палитру (Cormorant + Montserrat + #0071e3 + white/grey), не переписываем существующие hero / trust / services / projects-preview / cta секции.

Все futuristic-фичи приходят как **новые компоненты внутри существующего визуального языка** или на **новых страницах** (`/floors/*`, `/decision-tool`, `/compare`, `/visualizer`). Нигде не перекрываем existing styles.css.

### Принципы (внутри Apple-style baseline)

- **Bento и scroll-storytelling — на новых страницах** (decision-tool, compare, system pages), не на главной.
- **Scroll-driven animations** — на новых system-pages, для buildup diagram + process timeline. На главной ничего не меняем.
- **View Transitions API** — добавляем когда поддержка >90%, без визуальных изменений (just smooth crossfade).
- **Live data** — calculator уже есть (₪/$/per-m²); экраны курса валюты или activity-feed — только если оператор подтвердит, и только в footer / sidebar новых страниц.
- **Magnetic cursor / motion** — допустим только subtle, в стилистике уже существующих hover-эффектов (.hero-split panel hover-flex, например).
- **Variable fonts** — апгрейдим существующие Cormorant + Montserrat на variable если есть, без подмены семейств.
- **Granular subtle motion** — все hover-state 200–400ms cubic-bezier(.22,1,.36,1) или (.4,0,.2,1) — те же curves что уже использует styles.css.
- **Grain texture / dark mode / bento home** — параметры **Phase 4+**, обсуждаем ОТДЕЛЬНО с оператором, не ломаем existing.
- **Real 3D на новых system pages** — внутри карточек/секций той же визуальной системы, не как radical hero.

### Визуальный язык

- **Type:** Cormorant Garamond (serif headlines) + Montserrat / Inter (body). Variable weights везде где можно.
- **Palette:** Apple-grade нейтральная база (#1d1d1f / #f5f5f7 / #fff) + electric blue (#0071e3) для live data + slate (#3a3a3c) для tech-specs зон. **Без жёлтого, без розового, без gradient мусора.**
- **Spacing:** generous whitespace. Hero ≥ 60vh. Section gap ≥ 120px desktop.
- **Corners:** rounded 18px карточки, 28px crucial CTAs, 980px pills.
- **Shadows:** elevation 0-2-8-24 px (тонкая система).
- **Motion curves:** только cubic-bezier(.22, 1, .36, 1) или (.4, 0, .2, 1). Никогда `ease`.

### Component vocabulary

- **Eyebrow:** uppercase 11px Montserrat 600, letter-spacing .26em, color slate. Над каждым h2.
- **Stat card:** big serif numeral 72px Cormorant + label 12px Montserrat. Для "20+ years", "1700+ projects".
- **Spec row:** 3-col grid (icon | label | value). Иконки Lucide.
- **Buildup card:** layered slab visualization, hover показывает thickness + material + role.
- **Filter chip:** pill 980px, 11px uppercase, dark fill on .on.
- **Floating CTA:** sticky bottom-right desktop / bottom bar mobile. WhatsApp + (calc).
- **Vertical TOC:** на длинных pages, sticky right side, shows progress.
- **Animated counter:** stat numbers count up on viewport entry.

---

## 4. Sitemap

```
/                                 — home (hero + market split + plate + projects + trust)
/about                            — компания, лицензия, warranty, named clients
/projects                         — filterable gallery
/projects/{slug}                  — case study с m² / downtime / тех. подробностями
/blog                             — articles (existing)
/blog/{slug}                      — article (existing)
/contact                          — form
/quote                            — calculator (existing, ✓)

— ГЛАВНЫЙ КАТАЛОГ (новый):
/floors                           — каталог всех систем + decision tree (Phase 1)
/floors/epoxy                     — hub: что такое эпокси + всё семейство
  /floors/epoxy/seal-coat         — 0.5–1.5 mm coating, garage / light commercial
  /floors/epoxy/self-leveling     — 3–5 mm SL, industrial workhorse
  /floors/epoxy/troweled-hbs      — 6–12 mm HBS, food / pharma / heavy-duty
  /floors/epoxy/esd-conductive    — ESD/conductive, electronics / hospitals
  /floors/epoxy/decorative        — 3D / metallic / flake, designer
  /floors/epoxy/anti-static       — antistatic, server rooms / labs
/floors/terrazzo
  /floors/terrazzo/venetian       — 12–20 mm classic venetian
  /floors/terrazzo/palladiana     — large-aggregate palladiana
  /floors/terrazzo/mineral        — cement-based mineral terrazzo
  /floors/terrazzo/epoxy          — epoxy-binder terrazzo (modern)
/floors/microtopping
  /floors/microtopping/standard   — 2–3 mm floors / counters
  /floors/microtopping/walls      — wall application
  /floors/microtopping/wet-rooms  — bath / shower-rated
/floors/concrete
  /floors/concrete/cream          — cream finish (0.5–1 mm removed)
  /floors/concrete/salt-pepper    — salt-and-pepper (1–2 mm)
  /floors/concrete/full-aggregate — full aggregate exposure (2–3 mm)
/floors/mma
  /floors/mma/cold-storage        — cold rooms, fast cure
  /floors/mma/fast-cure-industrial — overnight install
  /floors/mma/decorative          — designer MMA
/floors/pu-cement
  /floors/pu-cement/standard      — food / beverage processing
  /floors/pu-cement/heavy-duty    — chemical / thermal shock
  /floors/pu-cement/cove-base     — coved / hygienic
/floors/rubber
  /floors/rubber/sheet            — vulcanized sheet
  /floors/rubber/tile             — interlocking / loose-lay
  /floors/rubber/poured           — poured-in-place EPDM
/floors/restoration
  /floors/restoration/recoat      — top-coat renewal
  /floors/restoration/full-renewal — full grind + new finish

— ВЕРТИКАЛЬНЫЕ ЛЕНДИНГИ (B2B-acquisition):
/verticals/warehouse              — facility manager focus
/verticals/hospitality            — hotels / restaurants / cafes
/verticals/healthcare             — hospitals / pharma / labs
/verticals/retail                 — showrooms / malls / shops
/verticals/residential            — premium homes / villas
/verticals/architects             — architects / designers as partners

— TOOLS / KILLER-FEATURES:
/decision-tool                    — 4–6 questions → recommended system
/visualizer                       — Roomvo embed / room-overlay
/compare                          — side-by-side material comparison
/substrate-check                  — interactive readiness checklist
/maintenance                      — maintenance protocol generator

— SERVICE / META:
/specs                            — все TDS PDF библиотека
/sample                           — sample request flow
/process                          — 7-step site survey → contract
/warranty                         — гарантийная политика по системе
/about/license                    — лицензия + сертификации
/faq                              — общая FAQ
/legal/privacy
/legal/terms
```

**Итого:** ~55–60 страниц на полной развёртке.

---

## 5. Killer UX features — приоритезированный список

### ✅ Уже построено (Phase 0)

- 3D вращающаяся плитка (CSS 3D + SVG terrazzo generator) — на /
- Калькулятор `/quote` (chip × chip × slider → ₪/$/per-m²)
- Spec table + fit-matrix компоненты (на 3 материалах)
- Contact prefill (читает 6 query params)
- chrome-fix для legacy header

### Phase 1 — Foundation (без контента, только каркас)

**Compulsory features** перед content-pass:

- [ ] **Material hub template** (1 шаблон → 8 страниц) с slot'ами для контента
- [ ] **System sub-page template** (1 шаблон → ~30 страниц)
- [ ] **Buildup diagram component** — interactive layered slab, hover details, animation on scroll
- [ ] **Sample request flow** (`/sample` или модал) — 3-4 поля + WhatsApp/email + project type
- [ ] **WhatsApp sticky CTA** — site-wide, click pre-fills page context
- [ ] **Decision tool** (`/decision-tool`) — 4-6 questions → recommended 1-2 systems + CTA
- [ ] **Filterable project gallery** — Material × Industry × Region × Year (static JSON)
- [ ] **TDS PDF library** (`/specs/`) — ungated downloads, 1 per material

### Phase 2 — Wow features

- [ ] **Comparison tool** (`/compare`) — выбираешь 2-3 материала, side-by-side spec table + decision matrix
- [ ] **Substrate readiness checklist** — interactive 10-question test → readiness score + CTA
- [ ] **Maintenance schedule generator** — выбираешь систему + use-case → персональный календарь обслуживания PDF
- [ ] **Room visualizer** — Roomvo embed ИЛИ кастомный photo-overlay (upload room → swap floor)
- [ ] **3D buildup explosion** — на каждой системе кликаешь "Show layers" → слои разлетаются с annotations
- [ ] **Animated counters** + **live activity feed** ("новый проект в Tel Aviv, 320 m² — терраццо · сегодня")
- [ ] **Before/after slider** на проектах
- [ ] **₪ live exchange rate** в калькуляторе (FX API daily)

### Phase 3 — Future-tech

- [ ] **Dark mode** — smooth color-mix transition, persisted
- [ ] **View Transitions API** — page-to-page переходы без full reload
- [ ] **Magnetic cursor** на CTA + scroll-driven hero animations
- [ ] **Bento home layout** — переделка / в bento grid (Linear-style)
- [ ] **Section-pinned scroll storytelling** — buildup, process, timeline анимируются по mере прокрутки
- [ ] **HE primary RTL** + EN + RU полная локализация
- [ ] **Variable fonts** — плавные веса при hover
- [ ] **Subtle grain overlay** + **gradient mesh backgrounds**
- [ ] **Sample order tracking** — после submission, страница со статусом "выбрано → отправлено → доставлено → инженер свяжется"

### Phase 4 — Ambitious / experimental

- [ ] **AI configurator** — "опиши проект текстом или фото" → recommended systems + draft estimate
- [ ] **3D room scanner** (mobile) — фото комнаты → автообмер площади (иногда через WebXR)
- [ ] **Native iOS/Android sample-request app**
- [ ] **CRM-integrated project portal** для existing клиентов (отдельный auth)

---

## 6. Page templates

### 6.1 Material hub template (`/floors/epoxy`)

Каркас с 12 секциями. Каждая система разворачивает hub в свою glubinu.

```
1. HERO
   - eyebrow: "система покрытий"
   - h1: "Эпокси"
   - 1-line positioning: "Workhorse industrial floor. Системы от 0.5 до 12 mm для нагрузок от showroom до food-processing."
   - hero photo: best-of-portfolio
   - primary CTAs: [Заказать образец] [Подобрать систему →]

2. WHAT IT IS — 1 paragraph
   - chemistry 1-sentence
   - typical buildup 1-sentence
   - typical service life 1-sentence

3. SYSTEMS FAMILY  ⭐ CORE SECTION
   - 5–6 cards, по одной на каждый subtype:
     - Seal Coat 0.5–1.5 mm
     - Self-Leveling 3–5 mm
     - Troweled HBS 6–12 mm
     - ESD / Conductive
     - Decorative (3D / metallic / flake)
     - Anti-Static
   - каждая card: thumbnail buildup, толщина, ₪/m² range, "Подробнее →"
   - CTAs ведут на /floors/epoxy/{system}

4. DECISION CARD: "Подходит ли вам эпокси?"
   - 3 columns: Good fit / Not the first choice / Inspect first
   - короткие списки

5. BUILDUP DIAGRAM (interactive)
   - canonical 5-layer epoxy buildup
   - hover/click на каждый слой → толщина + материал + роль + расход
   - на скролле слои анимируются (slide-in)

6. SPEC TABLE (full TDS-format)
   - 15+ rows, см. §7 в PROJECT_PLAN.md
   - значения per "system family" (диапазоны)
   - на каждой системе ссылка "Точные значения для XYZ →"

7. PITFALLS (что обычно идёт не так)
   - 4-6 cards: substrate moisture / oil contamination / movement joints / UV degradation / re-coat window
   - каждая: проблема → симптом → как мы решаем

8. PROCESS (7 шагов)
   - timeline visualization
   - 1. Assessment & CM-test
   - 2. Substrate prep
   - 3. Primer
   - 4. Body
   - 5. Topcoat
   - 6. Cure
   - 7. Handover & maintenance

9. MAINTENANCE PROTOCOL
   - таблица: daily / weekly / monthly / annual
   - cleaning chemicals (что да, что нет)
   - re-coat window

10. COMPARE
    - "Эпокси vs альтернативы" — quick spec compare с PU-cement / MMA / microtopping
    - CTA на /compare?materials=epoxy,pu-cement

11. RELATED PROJECTS (3-4 cards)
    - real projects из portfolio с m² + downtime + system used

12. FAQ (5-7 Q&A)
    - "Можно ли эпокси при влажности подложки X?"
    - "Сколько служит без обновления?"
    - "Можно ли поверх старого эпокси?"
    - "Запах / VOC?"
    - "Что если уронят кислоту?"
    - и т.д.

13. CTA BLOCK (footer-style)
    - 3 cards: [Sample] [TDS PDF] [WhatsApp]
```

### 6.2 System sub-page template (`/floors/epoxy/self-leveling`)

То же что hub, но **глубже на конкретной системе**:

```
1. HERO
   - eyebrow: "система · эпокси"
   - h1: "Self-Leveling Epoxy 3–5 mm"
   - 1-line: "Industrial workhorse. Самовыравнивающаяся система для production / warehouse / showroom."
   - hero photo
   - inline mini-spec (load class, RH max, downtime, system thickness, price range)

2. WHEN TO USE
   - конкретные use-cases с фотками
   - "warehouse 1000–10000 m²", "showroom 100–500 m²" etc.

3. PRECISE BUILDUP (interactive 3D explosion)
   - exact layer order:
     - prep CSP 3
     - primer 0.15 kg/m²
     - body 4 kg/m² × N coats
     - topcoat 0.2 kg/m²
   - расход + толщина + время

4. PRECISE SPEC TABLE (full TDS, no ranges)
   - конкретные значения, не "from / to"

5. PROCESS TIMELINE для этой системы
   - "в среднем 5 рабочих дней на 500 m²"
   - таймлайн день за днём

6. PITFALLS специфичные для системы
   - SL-specific: floor flatness требования, cure conditions, layer interaction

7. PHYSICAL SAMPLE
   - "Заказать образец 100×100mm — приходит в коробке с тех. описанием"
   - inline form (3 поля)

8. PRICE
   - "от ₪X/m² на объём ≥ 200 m². [Точная смета → калькулятор]"

9. RELATED CASE STUDIES (1-2)

10. FAQ (3-5 specific questions)

11. CTA BLOCK
```

### 6.3 Vertical landing template (`/verticals/warehouse`)

```
1. HERO
   - eyebrow: "VERTICAL"
   - h1: "Полы для складов и логистики"
   - 1-line: "Эпокси и PU-cement системы для forklift loads, минимальный downtime, 10-yr warranty."
   - 4 stat-cards: "1700+ projects · 24+ years · 10-yr warranty · 30 nationwide installs"

2. WHY WAREHOUSE FLOORING IS HARD
   - 4 cards: substrate moisture / shutdown windows / forklift loads / dust control
   - каждое: problem → impact on operations → our approach

3. RECOMMENDED SYSTEMS
   - 2-3 cards: SL Epoxy 4mm / PU-cement / MMA для freezer
   - для каждой: ₪/m² range, downtime window, slip class, warranty

4. CASE STUDIES (3-4 с metrics)
   - logo + m² + downtime + system + result

5. PROCESS для warehouse-сценария
   - phased install (зонами, без остановки операций)

6. CTA: [Site Survey] [Sample] [WhatsApp]
```

### 6.4 Decision tool template (`/decision-tool`)

```
Multi-step (4-6 questions):

Q1: Where is the floor?
[ Industrial / commercial / residential / outdoor ]

Q2: Traffic level?
[ Foot only / wheeled / forklift / vehicle ]

Q3: Chemical exposure?
[ None / mild / aggressive / specific industry ]

Q4: Aesthetic priority?
[ Function only / clean modern / decorative / signature ]

Q5: Downtime tolerance?
[ Days OK / overnight only / hours only ]

Q6: Budget tier?
[ Economy / mid / premium / no constraint ]

→ RESULT
   - 1–2 recommended systems with rationale
   - "Why this system: [reasons based on answers]"
   - CTAs: [Заказать образец X] [Подробнее о X →] [Калькулятор для X]
   - "Не уверены? Поговорите с инженером в WhatsApp — 12 мин"
```

### 6.5 Article / educational template (existing pattern, polish)

Не трогаем существующие, но добавляем sticky vertical TOC + reading-progress bar + related-articles в конец.

---

## 7. Tone of voice — style guide

### Канонические правила

- **"Мы" не "the contractor".** Это команда инженеров пишет инженерам, а не маркетинг.
- **Engineer-to-engineer voice.** Допустим жаргон ("CSP profile", "RH ASTM F2170") — если читатель его не знает, либо tooltip, либо ему не надо тут быть.
- **Skeptical of overclaims.** Если competitor пишет "10-yr warranty no questions asked" — мы пишем "10-yr warranty по системе, документировано в proposal; conditions in /warranty".
- **Specific numbers > adjectives.** "high-strength" → ">55 MPa @ 28d (ASTM C109)".
- **Russian как полноправный язык**, не отдельный sub-site. Native copy, not Google-translated.
- **Hebrew когда готов**, native. Не транслитерация.
- **Мы говорим что мы НЕ делаем.** "Эпокси не подходит для outdoor UV без специального topcoat" — обязательно.

### Запрещённые слова

| ❌ | Почему | ✅ замена |
|---|---|---|
| premium | пустое прилагательное | spec-grade, engineering-grade, по системе |
| best | оценочное | ведущий стандарт DIN / ASTM |
| leading | маркетинг | работаем на проектах X / Y / Z |
| world-class | штамп | сертифицированный installer Sika / Mapei / etc |
| amazing / stunning | для продавца чашек | (заменить на конкретное наблюдение) |
| seamless experience | штамп | (если нужно — убрать) |
| solution | corporate buzzword | система |
| innovative | пусто | (если нужно сказать что новое — что именно?) |

### Обязательные элементы на каждой странице системы

1. Числовая spec-table (минимум 10 строк, ASTM/DIN/EN ссылки)
2. Buildup diagram с расходом материала
3. "Не подходит для:" список
4. "Подводные камни:" минимум 4
5. Process timeline
6. Sample-request CTA
7. TDS PDF download (без email-gate)
8. Сравнительный блок vs другие системы

---

## 8. Контент-инвентаризация (что нужно от оператора)

### Per material × per system (~30 систем)

- **Точные m² ranges:** для каждого use-case
- **Downtime windows:** реальный опыт (overnight / 3 days / 5 days / 1 week)
- **Цены:** USD/m² или ₪/m² range, для каждого system × use-case combination
- **Warranty terms:** что покрывается, что нет, на сколько лет
- **3-5 case studies per system:** m², год, объект, downtime, материал, фото before/during/after
- **3-5 hi-res photos per system** (для hub) + **1-2 per finished project**
- **Manufacturer partnerships:** какие manufacturer-approved (Sika? Mapei? BASF? Kerakoll?)
- **Existing TDS PDFs:** есть ли — либо мы делаем с нуля по technical data of materials supplier

### Site-level

- **Контракторская лицензия:** номер для footer-badge
- **Named clients:** 6-8 логотипов + permission to use
- **Phone:** Israeli format `0XX-XXX-XXXX`
- **WhatsApp Business number** (отдельный или тот же)
- **Office address:** Tel Aviv?
- **Service area:** перечень городов / regions
- **Manufacturer / supplier list:** logos + permission
- **Certifications / standards:** ISO, DIN, ASTM, EN compliance lists
- **Warranty document:** standard warranty terms PDF

---

## 9. Phased roadmap (расширенный)

### Phase 0 — Foundation cleanup ✅ DONE

- chrome-fix.css extracted
- onboarding/audience-switcher removed
- PROJECT_PLAN.md committed
- This SITE_BLUEPRINT.md committed

### Phase 1 — Structure scaffolding (3-5 days, без content)

Сначала каркас всех страниц, затем content fills их по очереди. Цель — sitemap из §4 живой и кликабельный.

**Subphase 1A — templates (2 days)**
- [ ] Material hub template (1 файл-template + CSS)
- [ ] System sub-page template (1 файл-template)
- [ ] Vertical landing template
- [ ] Buildup diagram component (vanilla JS + SVG)
- [ ] Spec-table component (унифицированный, на основе fx-spec)
- [ ] Fit-matrix component (унифицированный)
- [ ] Process timeline component
- [ ] Pitfalls grid component
- [ ] FAQ accordion component
- [ ] Sticky vertical TOC

**Subphase 1B — page generation (1-2 days)**
- [ ] 8 hub pages (`/floors/{material}`) — пустые, со всеми секциями + TODO маркерами
- [ ] ~30 system sub-pages — пустые, со всеми секциями + TODO маркерами
- [ ] 6 vertical landing pages — пустые
- [ ] /decision-tool, /compare, /substrate-check, /sample, /specs

**Subphase 1C — killer features baseline (1 day)**
- [ ] WhatsApp sticky CTA (site-wide)
- [ ] Sample-request modal (3-4 fields)
- [ ] Decision tool widget (4-6 Q questionnaire)

### Phase 2 — Content (1–2 weeks, контент-марафон)

Оператор + Claude вместе пишут контент. Приоритет:

- [ ] 8 hub pages — fully filled (это самый ценный контент, тут сидят первичные посетители)
- [ ] Top-priority systems (по 1-2 на каждый материал, ~12 страниц): self-leveling epoxy, troweled HBS, venetian terrazzo, microtopping standard, polished concrete salt-pepper, PU-cement food, MMA fast-cure
- [ ] 3-4 vertical landings (warehouse / hospitality / healthcare / residential)
- [ ] /decision-tool questions + recommendation logic
- [ ] /sample copy + form-handling integration
- [ ] /specs — uploaded TDS PDFs

### Phase 3 — Wow features (1 week)

- [ ] Comparison tool (`/compare`)
- [ ] Substrate readiness checklist (`/substrate-check`)
- [ ] Maintenance generator
- [ ] Room visualizer (Roomvo embed first, custom если budget allows)
- [ ] Animated counters + live activity feed
- [ ] Before/after slider в /projects

### Phase 4 — Future-tech polish (ongoing)

- [ ] Dark mode
- [ ] View Transitions API
- [ ] Magnetic cursor + scroll storytelling
- [ ] Bento home redesign
- [ ] HE RTL + RU full localization
- [ ] Variable fonts + grain texture
- [ ] AI configurator (если получится прикрутить Anthropic API дёшево)

### Phase 5 — Backlog (ambitious)

- 3D room scanner (WebXR)
- Sample order tracking
- Native iOS/Android app
- Customer portal for existing clients

---

## 10. Reference design boards (что смотреть для inspiration)

| Reference | За что | URL |
|---|---|---|
| Linear.app | Bento grid, dark mode polish, type system | linear.app |
| Stripe.com | Scroll storytelling, gradient detail | stripe.com |
| Apple — Mac configurator | Live spec/price update, smooth UI | apple.com/shop/buy-mac |
| Cosentino 3D Home | Real-3D room visualizer | cosentino.com |
| Roomvo | Photo-overlay floor visualizer | get.roomvo.com |
| Bolon | Sample request flow | bolon.com |
| Stonhard | Vertical landing pages, A&D portal | stonhard.com |
| Pandomo | Architect-led editorial photography | pandomo.com |
| Mortex | Approved-applicator positioning | mortex.be |
| Vercel.com | Bento, smooth dark mode, motion | vercel.com |
| Family.co | Editorial design + technical | family.co |
| Arc Browser site | Maximum motion ambition | arc.net |

---

## 11. Что начинать сейчас (без ожидания контента)

**Начать можем с структурного кода**, не дожидаясь цен/фото:

1. **Material hub template + system sub-template** — пустые шаблоны со всеми компонентами, content TBD-маркерами. Это ~3 файла + CSS компоненты.
2. **Buildup diagram component** — generic, принимает JSON `[{name, thickness, role, consumption}]`, рендерит layered slab с hover. Контент потом.
3. **Decision tool widget** — UI готов, recommendation logic — потом, когда оператор скажет правила.
4. **WhatsApp sticky CTA** — на все страницы, с number TBD.
5. **Sample request modal** — UI готов, form action — потом (Netlify Forms или Formspree).
6. **/specs library shell** — каркас страницы, PDF добавим когда будут.
7. **/compare, /substrate-check** — UI каркас, content потом.

**Пока оператор собирает фото / цены / case studies / клиентов — мы строим скелет.**

Когда контент готов — заливаем без переделок шаблонов.

---

## 12. Метрики успеха per phase

### Phase 1 (structure)
- Все 50+ страниц sitemap живут (даже если 90% контента — TBD)
- Lighthouse Perf ≥ 85
- Все компоненты документированы в style guide

### Phase 2 (content)
- 100% material hubs filled
- 80% system pages filled
- Sample requests ≥ 5/неделю
- Avg time on hub page ≥ 2 min

### Phase 3 (wow)
- /compare engagement ≥ 25% visitors
- /decision-tool completion ≥ 40%
- /substrate-check completion ≥ 30%
- WhatsApp click-through ≥ 8% mobile

### Phase 4 (polish)
- Lighthouse Perf ≥ 92, Accessibility ≥ 95, BP 100
- Mobile bounce rate ↓ 30%
- HE/RU/EN bounce parity within 10%
- Sample-to-quote conversion ≥ 25%

---

## 13. Operator decisions awaiting (синхро с PROJECT_PLAN.md)

Что критично для Phase 1 структуры (можно отложить контент-данные):

1. **Структура material × system** — согласен с моим деревом в §4, или есть свои семейства?
2. **Vertical landings** — какие 4-6 верт. сегментов приоритет (Warehouse / Hospitality / Healthcare / Retail / Residential / Architects)?
3. **Decision tool questions** — есть свои критерии разбиения? Или довериться моим 6-Q?
4. **Buildup diagrams** — для каждой системы свой набор слоёв, или canonical "primer + body + topcoat" хватит и обновлю позже?
5. **Sample logistics** — реально готовы отправлять 100×100мм коробками? Какие материалы в наборе?
6. **WhatsApp number** — отдельный от phone или один?
7. **Контракторская лицензия номер** — для footer
8. **Manufacturer partnerships** — какие brand можем использовать как trust signal (Sika / Mapei / Kerakoll / BASF / Pandomo / Mortex)?
9. **Контент production approach** — оператор пишет drafts → Claude polish? или Claude пишет drafts → оператор fact-check?

---

## 14. Что ждёт твоего апрува (не начинаю кодить пока не одобришь)

**Стоп до твоего "ОК":** не запускаю Phase 1A пока не скажешь по этим пунктам. Stack кода и структуры завязан на них, переделывать дороже чем спросить.

### Минимум, что нужно от тебя для старта Phase 1A

1. **Sitemap §4 — ОК или правки?** Дерево material × system (8 hubs × 2-6 systems каждый = ~30 страниц). Семейства и subtypes согласованы?
2. **Vertical landings §4 — какие 4-6 первыми?** Warehouse / Hospitality / Healthcare / Retail / Residential / Architects.
3. **Style invariant (§3) — подтверждение:** Apple-style оригинала не трогаем, всё новое — внутри его языка ИЛИ на новых страницах. Согласен?
4. **Templates §6 — секции на месте?** 12 секций для hub, 11 для system page, 6 для vertical. Что-то добавить / убрать?
5. **Decision-tool questions §6.4 — мои 6 вопросов или хочешь свои?**
6. **Production approach §13.9 — кто пишет drafts?** (a) оператор пишет drafts → Claude polish, (b) Claude пишет drafts → оператор fact-check, (c) гибрид.

### После апрува — стартую Phase 1A в таком порядке:

1. Общие компоненты в `enhance.css` (внутри Apple-language): buildup diagram / process timeline / pitfalls grid / FAQ accordion / vertical TOC / sticky CTAs / sample modal.
2. Material hub template — `/floors/epoxy.html` как reference (12 секций, TBD-маркеры).
3. System sub-page template — `/floors/epoxy/self-leveling.html` как reference (11 секций, TBD-маркеры).
4. Decision tool prototype — `/decision-tool.html`.
5. WhatsApp sticky CTA + sample-request modal site-wide.

Когда покажу первый material hub живьём — фактчекаешь дизайн в Apple-language → даёшь ОК → масштабирую template на остальные 7 hubs + 30 systems копированием.
