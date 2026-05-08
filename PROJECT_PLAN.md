# FloorDSGN — Product Plan

Date: 2026-05-08
Repo: chernushoov/floordsgn-site
Branch base: `origin/main` (Apple-style редизайн, "стандартный сайт позавчера")
Working branch (deprecated, salvage parts): `enhance-features`

---

## 0. TL;DR

Берём `origin/main` как фундамент. На нём уже есть Apple-style chrome, hero-split, trust-section, materials, projects, blog, industrial/designers landing-pages. Всё нужное визуально на месте. Что добавляем поверх — последовательно, в 4 фазы, не ломая существующее.

Ключевые insights из research-а:

1. **Israel: открытое поле.** Из 10 проверенных конкурентов только один имеет калькулятор (epoxyfloor.co.il, только для эпокси). Никто не имеет 3D-визуализатор. Только 1 из 10 (Artfloor) делает RU-локализацию, и плохо. Цены на 5 из 9 материалов (terrazzo / polished concrete / microtopping / MMA / PU-cement) **не публикуются вообще** — везде "request quote".
2. **Глобально: pattern есть.** Stonhard, Sika ComfortFloor, Bolon, Pandomo, Mortex доказали что работает: vertical-first navigation, free physical samples, ungated TDS, named-client logo wall, decision-tree.
3. **B2B-funnel в полах = 7 стадий**: Discovery → Qualification → Specification → Sample → Site Survey → Quote → Contract. Сайт владеет первыми 3.5 стадиями.
4. **Не gating-уем калькулятор. Gating-уем sample.** Ungated TDS download. WhatsApp как primary CTA — Israel в этом #1 в мире.

---

## 1. Что у нас уже построено (inventory)

Все компоненты на ветке `enhance-features`. Что взять, что выкинуть, что доработать:

### 1.1 Калькулятор `/quote.html` — **БЕРЁМ**

**Файлы:** `quote.html` (198 строк HTML), `enhance.js#initCalc` (~80 строк JS), `.fx-calc-*` в `enhance.css` (~120 строк CSS).

Что делает:
- 6 материалов × 4 use-case × slider 20–10000 м² → ₪ project total + $ project total + ~₪/м²
- Чипы как `<button type="button">` (a11y ✓)
- Pre-fills `/contact.html?system=&area=&use=&estimate_usd=&estimate_ils=`

Что доработать (Phase 1):
- Цены повторно сверить с оператором по факт-чеку tech-lead-агента
- Добавить tooltip "что входит в эту цену" под total
- Range-only display ("₪380–₪620/м²") в дополнение к точному числу — pattern из Stonhard
- Строгая валидация input (если 0 м² → не показывать total)

### 1.2 3D вращающаяся плитка — **БЕРЁМ С ОГРАНИЧЕНИЯМИ**

**Файлы:** `enhance.js#init3DPlate` + `buildTerrazzo` + 4 PALETTES (~120 строк), `.fx-plate-*` CSS (~140 строк), markup в `index.html` (35 строк).

Что делает:
- 3D plate с CSS transforms, drag-rotate (mouse + touch fixed)
- 4 материала: terrazzo (260 polygons) / epoxy / micro / concrete
- Material chip clicks → rebuild SVG + update meta-row

Что доработать (Phase 2):
- **IntersectionObserver lazy-init** — сейчас 260 polygons + feTurbulence строятся на DOMContentLoaded даже если плитка ниже фолда. На iOS Safari это серьёзный hit.
- **Кешировать построенные SVG per-material** — сейчас при каждом клике на чип SVG регенерируется с нуля.
- Альтернатива: заменить на 4 короткие looping MP4 (как рекомендует UX-research). MP4 reads as more premium и быстрее, чем SVG patterns.

### 1.3 Spec-table + fit-matrix на материалах — **БЕРЁМ**

**Файлы:** на 3 страницах (concrete/rubber/restoration), CSS `.fx-spec-table*` + `.fx-fit-card*` (~120 строк).

Что делает:
- 7-rows spec table (substrate / load / downtime / thermal / system buildup / warranty / price-orienter) с inline SVG-иконками
- 3-card fit-matrix (good / bad / inspect) с tinted backgrounds (зелёный / красный / песочный)

Что доработать (Phase 1):
- **Унифицировать с 5 старыми материалами** (epoxy, micro, terrazzo, mma, pu-cement) — у них своя `fitmatrix-card` система. Решение: переписать все 8 материалов на единый формат.
- Расширить spec-rows под full TDS-стандарт (см. таблицу row 4 ниже): добавить slip-class DIN 51130, MPa compressive, ASTM F2170 / F1869 references.
- Оператор должен подтвердить актуальные numbers per material.

### 1.4 contact.html prefill — **БЕРЁМ**

**Файлы:** `contact.html` (60 строк JS prefill).

Что делает:
- Читает `?system, ?area, ?use, ?estimate_usd, ?estimate_ils, ?intent`
- Мапит use→project-type select
- Автозаполняет textarea стартовым сообщением

Что доработать (Phase 1):
- Добавить `?role=architect|facility|owner` для лучшего routing
- При intent=sample показать укороченную форму (только адрес + телефон)

### 1.5 Legacy-header logo CSS fallback — **РЕФАКТОР**

**Файлы:** в `enhance.css` (~60 строк), 22 страницы получили `<link enhance.css>`.

Проблема: enhance.css теперь load-bearing для chrome 22 страниц. Архитектурно неверно.

**Refactor (Phase 0):**
- Вынести в отдельный `chrome-fix.css` (или внести напрямую в `styles.css` после согласования с оператором).
- Тогда `enhance.css` снова станет опциональным и удаляемым.

### 1.6 Onboarding overlay — **ВЫКИДЫВАЕМ**

**Файлы:** `index.html` (~70 строк markup), `enhance.js#initOnboarding` (~80 строк), `.fx-ob-*` CSS (~280 строк).

Marketing-агент: bounce-rate killer 15-35%. Сейчас выключен (`?onboarding=1` only). Удаляем полностью — в Phase 2 если решим — построим guided-tour триггеримый явным кликом, не first-visit modal.

### 1.7 Audience pill-tabs — **ВЫКИДЫВАЕМ (или переделываем)**

**Файлы:** `enhance.js#initAudSwitch` (~40 строк), `.fx-aud-switch` CSS (~25 строк).

Проблема: Marketing-агент назвал "UX-вруном" — выбор сохраняется в localStorage, но никакая копия / hero / CTA не меняется. Пока убираем. Если в Phase 2 решим строить персонализацию — возвращаем со swap копии.

---

## 2. Конкурентный landscape (3 agents combined)

### 2.1 Israel — реальные конкуренты (10 проверенных)

| Игрок | URL | Фокус | Языки | Качество (1–5) |
|---|---|---|---|---|
| Ofri Coatings | ofri-coating.co.il | Industrial heavy (food, pharma, hi-tech) | HE/EN | 4 |
| Artfloor | artfloor.co.il | Decorative, 3D эпокси | HE/EN/RU | 3 |
| Shahar Epoxy | epoxy-all.co.il | Industrial + own manufacturing | HE | 3 |
| Adel Projects | adelprojects.co.il | Resi + commercial mix | HE | 3 |
| Center for Epoxy Floors | epoxyfloor.co.il | Mid-market (имеет калькулятор!) | HE | 4 |
| Amirim Epoxy | amirim-epoxy.co.il | Industrial | HE | 2 |
| Toppings (em01) | em01.co.il | Decorative residential | HE/EN | 3 |
| CR Contech | crcontech.co.il | Polished concrete / terrazzo premium | HE | 4 |
| Beton Betone | betonbetone.co.il | Decorative + продаёт материалы | HE | 4 |
| Studio Beton | studio-beton.co.il | Polished concrete decorative | HE | n/a |

### 2.2 Israel — pricing benchmarks (только эпокси публичен)

| Material | ₪/м² range | Source |
|---|---|---|
| Basic эпокси (тонкий, large area) | 60–150 | Shahar Epoxy, Adel, top-renovations |
| Residential эпокси | 80–120 | renovations-israel |
| Heavy-duty industrial эпокси 3–5 mm | 120–200 | Shahar Epoxy |
| Chemical-resistant / anti-slip / anti-static | 150–250 | Shahar Epoxy |
| Decorative эпокси (multi-color) | 180–350 | Shahar Epoxy |
| Микротопинг / Polished concrete / Terrazzo / MMA / PU-cement | **— нет публичных цен —** | все competitors hide |

**Стратегический вывод:** на 5 ключевых материалов в Israel НЕТ публичных цен. Если FloorDSGN покажет даже rough range — это категория-лидерство.

### 2.3 Глобал — паттерны worth копирования

1. **Vertical-first navigation** (Stonhard) — Warehouse / Hospitality / Hospital / Retail / Residence как отдельные landing-pages с relevant photo + relevant systems.
2. **Free physical sample** (Bolon, Forbo) — лучший top-of-funnel для residential/architect. Адрес + project type + timeline.
3. **Approved-applicator** позиция (Mortex, Pandomo) — "FloorDSGN — единственный сертифицированный installer Mapei Ultratop в Israel" — riding manufacturer brand equity.
4. **Case studies с metrics** (Stonhard) — m², дни downtime, материал, год. Forwardable internally.
5. **Decision tool** (Sherwin-Williams) — 4–6 questions → recommended system. Самая близкая к калькулятору вещь в индустрии.

### 2.4 Локально мы можем выиграть на 3 фронтах

1. **Trilingual HE/EN/RU** (никто, кроме плохого Artfloor, не делает)
2. **Public price ranges** (никто не публикует на 5 материалов)
3. **Interactive material visualizer** (никто не имеет)

---

## 3. Канонический funnel (7 stages)

```
1. Discovery       → Homepage, social, Google → "вы в нужной категории"
2. Qualification   → Vertical pages (Industrial / Architect / Residence)
3. Specification   → /materials/* pages, full TDS, spec table, fit-matrix
4. Sample          → ⭐ Sample request form — главный conversion event
5. Site Survey     → WhatsApp / phone → выезд замерщика
6. Quote           → формальная смета (off-site)
7. Contract        → подписание (off-site)
```

Сайт владеет 1–3.5. CTA на каждом stage идёт строго к следующему.

---

## 4. User Journeys (3 персоны)

### Journey 1: B2B Procurement / Facility Manager (логистический склад, 4000 м², эпокси)

```
1. Google "industrial epoxy Israel" → /
2. Hero split: "For Business" panel → /industrial.html
3. /industrial.html: hero "Industrial & Commercial Flooring · 10-yr warranty"
   → секция "Object Types" (Warehouse, Manufacturing, Logistics)
   → CTA "Calculate cost →" /quote.html?audience=b2b
4. /quote.html: эпокси × производство × 4000 м² → ₪482k project · ~₪120/м²
   → CTA "Прислать смету в PDF" → /contact.html?system=epoxy&area=4000&use=indus
5. /contact.html: форма pre-filled, role=facility, project size, timeline
   → submit OR sticky-CTA WhatsApp +972559661459
6. Off-site: site survey → quote → contract
```

**Что нужно построить:**
- ✅ /industrial.html уже есть (origin/main)
- ✅ Калькулятор готов
- ✅ Cross-page CTA к calc уже добавлен
- ❌ WhatsApp sticky button — отсутствует
- ❌ Industry-specific case studies на /industrial.html (m² + downtime)
- ❌ Ungated PDF TDS download

### Journey 2: Interior Designer (penthouse Tel Aviv, 120 м², venetian terrazzo)

```
1. Instagram / референс от architect-друга → /designers.html
2. /designers.html: hero "Design Finishes · We handle floors so you can focus"
   → portfolio с named architects → spec/material drill-down
3. /materials/terrazzo.html: full TDS (substrate, slip class, palette options)
   → CTA "Order physical sample" → ⭐ sample form
4. Sample arrives → designer shows client → re-engages WhatsApp
5. Off-site: site survey → quote → contract
```

**Что нужно построить:**
- ✅ /designers.html на месте (но слабая копия)
- ✅ /materials/terrazzo.html spec-table уже есть (existing)
- ❌ **Sample request form** — самое важное, отсутствует полностью
- ❌ Named architects в portfolio (для flattering specifier)
- ❌ Interactive room-visualizer (Roomvo embed или MP4 loops)

### Journey 3: Russian-speaking Homeowner (квартира 80 м², микротопинг)

```
1. FB / Instagram ad на RU → / (RU mode)
2. RU lang switcher → весь контент на RU
3. /quote.html (RU): микротопинг × жильё × 80 м² → ₪50k · ~₪620/м²
   → "Это slishком много" → RU-FAQ "is microtopping right for me?"
4. /materials/microtopping.html (RU): fit-matrix "good fit / not for you"
   → "Inspect first" — для меня релевантно?
5. Sample request OR WhatsApp в RU
```

**Что нужно построить:**
- ❌ **Полная RU-локализация** новых блоков (онбординг убран, но calc / 3D plate / spec / fit — RU-only без data-i18n)
- ❌ Старые materials страницы — EN-only, нужно RU
- ❌ contact.html форма — EN-only
- ❌ FAQ-секция на каждом материале

---

## 5. Что строим (по фазам)

### Phase 0 — Стабилизация (0.5 дня)

Убрать всё что регрессировало или мёртвый вес:

- [ ] Удалить onboarding overlay (markup из index.html, fx-ob CSS, initOnboarding из enhance.js) — `−350 строк`
- [ ] Удалить audience pill-tabs (initAudSwitch + .fx-aud-switch CSS) — `−60 строк`
- [ ] Вынести legacy-header logo fix из enhance.css в `chrome-fix.css` — теперь chrome не зависит от enhance.css
- [ ] Удалить `fx.initProjFilter` (dead code)
- [ ] Унифицировать 3 новых материала (concrete/rubber/restoration) с 5 старыми — единая `fitmatrix-card` визуально

**Результат:** ~1100 строк кода в enhance.css/.js, 4 рабочие фичи, foundation чистый.

### Phase 1 — Foundation на проде (1–1.5 дня)

Mergим в main + добавляем Israel-must-haves:

- [ ] **WhatsApp Business sticky button** site-wide (mobile bottom-bar + desktop bottom-right). Click-to-chat шаблоны pre-fill контекст страницы.
- [ ] **Phone number в Israeli format `0XX-XXXX-XXX`** в header CTA (не "+972 55 …")
- [ ] **Контракторская лицензия + 10-yr warranty badge** в footer (Adel-style)
- [ ] **Logo wall на главной** — 6–8 named clients (Ofri-style "Strauss / Nestlé / Elbit / HP")
- [ ] **Industry-specific case studies** на /industrial.html — каждая с m² + downtime + материал + год
- [ ] **Ungated PDF TDS** на каждом /materials/* — кнопка "Download Tech Data Sheet"
- [ ] **Sample request flow** (новая страница `/sample.html` или модал) — 3 поля: имя + WhatsApp/email + project type
- [ ] Tune калькулятор: цены подтверждены оператором; range-only opt; tooltip per material

### Phase 2 — Enhancements (2–3 дня)

Killer features которые отсутствуют у Israel-конкурентов:

- [ ] **3D plate с lazy-init** + кеширование → ИЛИ замена на MP4 loops (4K, factory/showroom/residential lighting)
- [ ] **Decision tool**: 4–6 questions → recommended system (Sherwin-Williams pattern). Pure JS, без backend.
- [ ] **Roomvo embed** или собственный room-overlay (single line install, 5× conversion lift)
- [ ] **Filterable project gallery** — Material × Industry × Region × Year (Static JSON manifest + client-side filtering)
- [ ] **Spec download library** — централизованный `/specs/` с PDFs всех материалов
- [ ] **Comparison page**: "Epoxy vs Microtopping vs Terrazzo" — таблица + decision flow

### Phase 3 — i18n + scale (2–3 дня)

- [ ] **Полный data-i18n на новые блоки** (calc, plate, spec, fit, hero CTA)
- [ ] **HE primary RTL** с full CSS flip (не только `dir="rtl"`)
- [ ] **RU как полноправный locale** — не machine-translation; native copy
- [ ] **EN preserved** для архитекторов international
- [ ] **Footer language switcher** — Uber pattern (region и language как 2 dropdown)

---

## 6. Что НЕ делаем (intentionally out of scope)

- **AR-визуализатор** (Sherwin-Williams ColorSnap-style). Sales cycle 4–24 weeks, физический sample всё равно отправят. Overkill.
- **WebGL room engine.** Roomvo embed дешевле и проверенно (5× conversion). MP4 loops премиальнее визуально.
- **CMS / dynamic backend.** Static JSON manifest + Vercel hosting. Никаких БД.
- **Account / login.** Никакого пользовательского кабинета. Sample-request → WhatsApp → off-site.
- **Online checkout / payment.** Это не e-commerce.
- **Onboarding wizard / first-visit overlay.** Marketing-агент: bounce killer.
- **AR**, push notifications, full PWA. Не приносит ROI на этом sales cycle.

---

## 7. Технический stack (без изменений)

- **Frontend:** plain HTML + CSS + vanilla JS. Без фреймворков.
- **Build:** Parcel (только для prod минификации, не блокирует деплой)
- **Hosting:** Vercel (`buildCommand: ""`, `outputDirectory: "."`) → файлы из корня
- **i18n:** уже есть `translations.js` с EN/RU keys; расширяем
- **CSS архитектура:** `styles.css` (chrome) + `chrome-fix.css` (Phase 0, постоянный fix) + `enhance.css` (опциональные features) + per-page inline `<style>` для уникальных секций (existing pattern)

---

## 8. Метрики успеха (per phase)

### Phase 0
- Все 28 страниц рендерятся корректно (logo не overflow)
- enhance.css не load-bearing для chrome
- Нулевые JS-ошибки в console на главной + 3 inner pages

### Phase 1
- WhatsApp click-through ≥ 5% от visitor count
- Sample-request submissions ≥ 3/неделю
- Calculator → /contact prefill conversion ≥ 30%
- Avg time-on-site ≥ 90s

### Phase 2
- 3D plate / room-visualizer engagement ≥ 25% visitors
- Decision-tool completion ≥ 40%
- Project gallery filter clicks ≥ 15% от gallery visitors

### Phase 3
- HE RTL без layout breaks (Lighthouse Visual Stable ≥ 95)
- Bilingual sample-request submissions split (HE / EN / RU)
- Reduce bounce on `?lang=ru` traffic by ≥ 30%

---

## 9. Решения которые ждут от оператора

1. **Цены калькулятора:** подтвердить или переписать `data-p` для каждого материала (terrazzo 280 / epoxy 110 / micro 170 / concrete 80 / pu-cement 200 / mma 240 USD/м²) и multipliers (resi 1.0 / design 1.15 / indus 1.20 / hosp 1.25). Хотим ли диапазон ("from $") вместо точного числа?
2. **WhatsApp number:** какой именно номер вешать на site-wide CTA?
3. **Контракторская лицензия:** есть ли номер для footer-badge?
4. **Warranty:** 10-летняя ли по умолчанию, или per-system?
5. **Named clients:** какие 6–8 логотипов имеем право показывать?
6. **Case studies:** какие 4–6 проектов из portfolio имеем m² / downtime / системы для surfacing?
7. **Sample logistics:** реально готовы отправлять физические образцы 100×100mm? Какой стек материалов?
8. **Sample form fields:** ОК если ask: name + WhatsApp/email + project type + zip / city? Не больше.
9. **Phase 2 priorities:** что важнее — 3D plate с MP4 loops (визуальная вау) ИЛИ decision-tool (lead-qualifier) ИЛИ Roomvo embed (room-visualizer)?
10. **Phase 3 i18n:** HE first или EN+RU first? Каков realistic timeline для native HE копии?

---

## 10. Ссылки на research-материалы

- Global competitors: Stonhard, Sika ComfortFloor, Bolon, Pandomo, Mortex, Sherwin-Williams Resinous
- Israel competitors: Ofri, Artfloor, Shahar Epoxy, Adel Projects, epoxyfloor.co.il, CR Contech, Beton Betone, Toppings, Amirim Epoxy
- Calculator patterns: Summit Epoxy Instant Estimator, Epoxy Flooring Austin TX, Concrete Floor Supply, HomeWyse
- Sample request: Daltile, Tile Shop, Garden State Tile, Tile X Design, Stonhard
- TDS standards: ASTM F2170, F1869, C109, C348; DIN 51130; EN 13892-2; ISO 527
- WhatsApp commerce IL: Times of Israel — Achiya Cohen
- Visualizers: Roomvo, Cosentino 3D Home, Caesarstone Virtual Kitchen, Sherwin-Williams ColorSnap

Полные отчёты исследовательских агентов сохранены в transcripts проекта.
