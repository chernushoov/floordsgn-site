# MASTER PLAN — Перестройка 3D-конфигуратора FloorDSGN

**Дата:** 2026-05-27
**Автор:** chief technical planner (на основе 6 research-документов + аудита кода + UX-аудита)
**Статус:** PROPOSAL — требует подтверждения владельца перед стартом любого Wave
**Слой бренда:** Industrial Proof (Carbon / Steel / Signal / Concrete / Graphite, Cormorant + Montserrat, одна Signal-точка на страницу, без emoji)
**Etalon-коммиты не трогаем:** `cc421cf`, `076fdbc`, `23ed628`, `db80612` — это якорные снимки hero3d / cfg-mobile / audit-fix / sprint0-complete. Перестройка — инкрементальная, поверх etalon, а не вместо.

---

## 0. Owner clarifications (получено после первого draft, 2026-05-27 утром)

Два важных корректирующих факта поступили от владельца сразу после того, как первый draft этого плана был написан. Все упоминания ниже по тексту читать с учётом этих поправок:

### 0.1 «Morris» — это **Marris** (water-based epoxy + membrane)

Владелец уточнил: «по поводу моррис наверно Marris это эпоксидка с мембраной на водной основе». Это не путаница с Mortex/Marmorino как предположил research. **Marris** — итальянский бренд водных эпоксидных систем + мембраны (видимо `Marris Resine`, Acquademica линейка или эквивалент). Категория: **decorative-epoxy** с water-based primer membrane. Не микроцемент. Помещается в семейство `epoxy` (а не `microtopping`) как опция с water-based base coat.

→ Q1 блокер ниже становится **resolved** — Marris добавляется в семейство epoxy с пометкой `[verify TDS URL и IL-импортёра]`, не `[ambiguous]`.

### 0.2 Brand-partnership strategy = **build-first, partners-second**

Владелец: «пока только дружим я хочу сначала показать им проект как оно выглядит и потом они сами захотят там расположиться и все дадут и еще и денег навалят». Это разворот предположения research'a что бренды могут быть включены ТОЛЬКО после verified SKU/прайс-листа от партнёров.

→ **Q3 блокер становится "не блокирующим стартом"**: бренды добавляем сейчас на research-данных + публично доступных TDS, помечаем `[reference based on public TDS]` вместо `[verified by partner]`. Когда партнёр Pavistamp/Topciment/Keim/Marris подключится — заменяем `reference` → `verified` + добавляем IL прайс. Wave B (brand expansion) больше не ждёт партнёрских договоров.

→ Импликация для контента: каждая brand-карточка должна быть **достаточно красивой и точной**, чтобы партнёр увидев конфигуратор сказал «хочу свой логотип здесь + дам вам прайс-лист». Это меняет приоритет визуального качества brand-показа — это уже не demo, это **outreach surface**.

### 0.3 Что это означает для Wave plan ниже

- **Wave A** не зависит ни от чего — стартует на твой «ок» без любых блокеров.
- **Wave B** (brand expansion) **разблокирован** для старта без партнёрских договоров. Делаем на research-данных. Marris добавляется как новая опция в epoxy.
- Q3, Q5, Q7 из блокеров секции 8 — даунгрейдятся до «nice-to-have for accuracy», не блокеры старта.
- Q1 (Morris) — resolved.
- Реально остаются блокеры: **Q4** (UI placement brand-selector — 1 из 4 паттернов выбрать) и **Q6** (GLB regen — Blender на owner-machine vs procedural via three.js). 2 блокера вместо 7.

---

## 1. Executive summary

Конфигуратор `configurator.html` v2.05 ломается на трёх уровнях одновременно: (а) код — 4 P0-бага (color washing, dead gloss control, отсутствующий body-mesh в 3-слойном GLB при заявленном 4-слойном пироге, fake CTAs), (б) UX — 51% взаимодействий не доносят результат (12 dead controls + 32 sub-perceptual из 86 протестированных), (в) данные — конфигуратор привязан только к Sika, а владелец хочет показывать Pavistamp / Topciment / Mortex / Mapei / BASF Ucrete / Flowcrete Flowfresh / Mondo / Nora / Altro / Conica и др. как переключаемые опции внутри каждого семейства материалов. Полный объём работы по трём волнам: **45-65 часов** (Wave A 8-12h fixes + Wave B 20-28h архитектура и бренды + Wave C 15-25h advanced). Top-3 P0: (1) удалить color lerp к белому и запекать цвет в composite canvas, (2) убить дубликат `gloss` control и оставить только `finish`, (3) починить tile-repeat в stripes/marking (одна полоса разлетается на 4-10 копий). Top-3 owner-input блокеров: что такое «Morris» (исследование не нашло бренд — путаница с Mortex или Marmorino), реальные SKU и прайс-листы Pavistamp/Topciment/Keim партнёрств, выбор UI-паттерна для brand-селектора (dropdown / right-rail / tabs / inline) — 1 из 4. **Не в scope** этой перестройки: иврит/RTL, мобильно-специфичная вёрстка отдельным треком, AR/WebXR (это Wave D / phase 2), AI-photo replacement (R10 из benchmark).

---

## 2. Defect inventory — единая таблица

Сведено из `configurator-code-audit.md` (JS) и `configurator-ux-audit.md` (UX/Playwright). Сортировка по severity, P0 → P2.

| ID    | Defect                                                                                  | File : Line               | Severity | Found by | Fix approach                                                                                                  | Hours |
|-------|-----------------------------------------------------------------------------------------|---------------------------|----------|----------|---------------------------------------------------------------------------------------------------------------|-------|
| D-01  | Color lerp 55-80% к белому — все RAL превращаются в pale beige. Бордо ≈ Антрацит pixel-twins | configurator.html:997-1003 | **P0**   | JS+UX    | Удалить lerp. Цвет применять verbatim. Вторую копию в `buildPbrMaterial` (line 621-623, `tint`) — туда же.    | 0.5h  |
| D-02  | Composite map перестраивается с нуля при aggregates/flecks/stripes/marking, цвет смывается | configurator.html:1015-1017 + 442-590 | **P0**   | JS       | `mat.color = white` всегда; цвет — параметр `buildCompositeMap`, запекается в canvas multiply-pass            | 2h    |
| D-03  | `gloss` control мёртвый (логическая ошибка `m[opt.id]`), `finish` и `gloss` оба пишут `mat.roughness` — last-click wins | configurator.html:1004-1013 | **P0**   | JS+UX    | Удалить `gloss` из manifest всех 9 материалов; из `applyControlEffect`; оставить только `finish` (3 ступени)  | 0.5h  |
| D-04  | Buildup sidebar показывает 4 слоя (topcoat/body/primer/substrate), GLB имеет 3 mesh — "body" не визуализирован | plate.glb + manifest.json | **P0**   | JS       | Регенерировать GLB с 4 primitives + обновить `geometry.primitives` в manifest                                 | 4-6h  |
| D-05  | Tile factor 2-5 на topcoat умножает одиночные stripes в 4-10 полос и marking в 5 полос  | configurator.html:564-590 + 596 | **P1**   | JS+UX    | Stripes/marking → отдельный non-tiled decal overlay поверх (не paint в diffuse). Или зафиксировать tile=1 для decal-аспектов | 1.5h  |
| D-06  | Кнопка "Reset" сбрасывает только камеру, НЕ `orderState` — кнопки остаются `.on`, composite не перестраивается | configurator.html:665-671 | **P1**   | UX       | Переименовать view-Reset → "↺ Камера". Добавить отдельный "Сбросить параметры" возле CTA                      | 0.5h  |
| D-07  | CTA "Заказать формулу" — `alert()` + URL, без формы/email/POST                          | configurator.html:1041-1051 | **P1**   | JS+UX    | Скрытый Netlify Form + POST с JSON `orderState` + saved-render image; редирект на `/quote-success`            | 1.5h  |
| D-08  | CTA "Заказать sample-kit" — `alert()`, без shipping-form                                | configurator.html:1053-1055 | **P1**   | JS+UX    | Netlify Form `sample-kit-request` с адресом доставки + JSON-spec                                              | 1h    |
| D-09  | Системный пирог не обновляется при кликах color/finish/stripes/marking — только при смене материала | configurator.html:982-992 | **P1**   | UX       | Live-update sidebar: при каждом `applyControlEffect` rerender блок параметров с выбранными значениями         | 1h    |
| D-10  | Состояние `orderState[slug][cid]` теряется при re-select материала (X→Y→X)              | configurator.html:929-979 | **P1**   | JS       | `renderControls` читать существующий `orderState[def.slug][cid]` и подсвечивать сохранённую опцию             | 0.5h  |
| D-11  | URL/localStorage не обновляются по клику — share-link невозможен без нажатия "Order"    | configurator.html:1041-1051 | **P1**   | JS       | `pushState` + `localStorage.floordsgn_cfg` debounced 250ms при каждом изменении                                | 1h    |
| D-12  | `finish` + `gloss` оба `.on` после кликов — UI не показывает что одна гасит другую     | configurator.html:1010-1013 | **P1**   | UX       | Снимается с D-03 (gloss удалён) — конфликта больше нет                                                        | —     |
| D-13  | Composite rebuild — single-flight (line 1020 `pendingCompositeBuild`), быстрые клики дропаются | configurator.html:1020-1037 | **P1**   | JS       | Заменить флаг на pending-state queue: запомнить latest payload, после текущего билда — перезапуск             | 0.5h  |
| D-14  | "Top" view даёт оливковый/perspective угол, не plan-view ortho (chamfer виден)         | configurator.html:665-671 | **P2**   | UX       | OrthographicCamera временно при `view=top`, `minPolarAngle=0`, camera.y=высоко                                | 0.5h  |
| D-15  | "Top" view не сбрасывается при смене материала                                          | configurator.html:740-750 | **P2**   | UX       | На `selectMaterial` — `setView('solid')` если был `top`                                                       | 0.2h  |
| D-16  | Физически невозможные опции активны: MMA polished, PU-cement high gloss, Rubber gloss   | manifest.json materials   | **P1**   | JS       | Добавить `allowed_finish`/`allowed_marking` per material → скрывать опции (не disable)                        | 2h    |
| D-17  | Текстура aggregates рисуется поверх stripes — на terrazzo stripes невидимы (0% видимости брасса) | configurator.html:540-580 | **P2**   | UX       | Z-order в `buildCompositeMap`: stripes сверху aggregates, или взаимоисключающие в UI                          | 0.5h  |
| D-18  | "Палитра агрегатов" — текстовые кнопки без 20px-чипов; различия между palettes субпороговые | configurator.html ~970-979 | **P2**   | UX       | Добавить `chip_color` в options manifest + рендерить swatch перед label                                       | 0.5h  |
| D-19  | Реквест в `/favicon.ico` — 404 console error                                            | (root)                    | **P2**   | UX       | Положить `favicon.ico` (есть FloorDSGN brand-mark)                                                            | 0.1h  |
| D-20  | Magic numbers разбросаны по файлу (0.55, 0.88, 0.9, lineWidth 8/28, tile 2-5, 8s sweep) | configurator.html (см. P2-1 audit) | **P2**   | JS       | Top-of-file `CONST` блок с поясняющими комментариями                                                          | 0.5h  |
| D-21  | `Reflector` import (line 292) мёртвый — bundle weight                                   | configurator.html:292     | **P2**   | JS       | Удалить                                                                                                       | 0.1h  |
| D-22  | `findMeshesByMaterialIndex` — название врёт, на самом деле regex по `material.name`     | configurator.html         | **P2**   | JS       | Переименовать в `findMeshesByMaterialName` + использовать `geometry.primitives` из manifest                   | 0.3h  |
| D-23  | Hover-preview `.matprev` исчезает после выбора материала — фотореалистичный asset спрятан | configurator.html:162    | **P2**   | UX       | Закрепить как corner-thumb пока материал активен                                                              | 0.5h  |
| D-24  | Нет on-screen hint для keyboard shortcuts (↑↓/Space/T/R) — фича невидима                | configurator.html:731-749 | **P2**   | UX       | Маленький `<kbd>` legend в углу или `?` для help-overlay                                                      | 0.3h  |
| D-25  | `[PREVIEW-ANIM]` маркеры ссылаются на несуществующий `loader-preview.html`              | configurator.html:96+     | **P2**   | JS       | Удалить dead комментарии                                                                                      | 0.1h  |
| D-26  | Нет error-UI для 404 текстур — fallback `#7c7770` тихий                                 | configurator.html:454     | **P2**   | JS       | Console.warn + small banner "текстура не загрузилась — отображается заглушка"                                 | 0.5h  |
| D-27  | Flecks дублируются поверх aggregates (на terrazzo) — визуально съедены                  | configurator.html flecks  | **P2**   | UX       | Скрывать `flecks` control когда у материала включены `aggregates` и aggregate выбран не-none                  | 0.3h  |
| D-28  | Stripes на single-plate физически не имеют смысла (саргелим — между плитами)            | concept                   | **P2**   | UX       | Переименовать в "Декоративный inlay" + поясняющий tooltip; уменьшить до 1 полосы по центру                    | 0.5h  |

**Итого по таблице:** ~21h строго багфиксов, без архитектурных изменений и без brand expansion.

---

## 3. Четыре P0 root causes — deep dive

### 3.1 Color washing (D-01)

**Корень:** в `applyControlEffect` (line 997-1003) клиент-цвет лерпится к белому на 55-80% по обратной luminance. Бордо `#943f37` (lum 0.16) → 79% к белому = `#cfbfbd` (бледно-розовый). Антрацит `#293133` → 79% = `#cecdcd` (светло-серый). Оба становятся неразличимы (Δrgb ≈ 5 на canvas).

Дубликат — в `buildPbrMaterial` (line 621-623) при `def.tint`: эпокси-tint `#5a737f` (slate) × `(1 - 0.6) = 0.4` → 40% к белому → серо-голубой вместо slate.

Почему было написано: вероятно cargo-cult из crossfade-логики между материалами (line 895-905), где лерп нужен для плавности transition, но при персистентном применении его не возвращают в исходное.

**Fix в коде:**
- Удалить блок `c.lerp(new THREE.Color('#ffffff'), lerpAmount); mat.color.copy(c);` → заменить на `mat.color.set(opt.hex);`.
- В `buildPbrMaterial` удалить `mat.color = new THREE.Color(def.tint).lerp(...)` → `mat.color = def.tint ? new THREE.Color(def.tint) : new THREE.Color(0xffffff);`
- Если cross-fade transition теряет качество — лерп оставить ТОЛЬКО внутри `transition` блока (line 1091-1102), куда он логически и относится.

**Side-effects:**
- Все 9 материалов мгновенно станут показывать выбранный цвет verbatim. Эпокси будет slate, а не серый. Паркет — реальная морилка под тонировку.
- Связка с D-02: без D-02 пользователь увидит цвет, потом сменит aggregates — и цвет опять смоется (canvas пересоберётся). Пара D-01+D-02 ОДНОВРЕМЕННО.

**Owner-visible result:** Бордо станет бордовым. Антрацит — почти чёрным. «Кнопки начнут совпадать с описаниями».

### 3.2 Composite color smear (D-02)

**Корень:** `refreshCompositeMap(def)` пересобирает canvas с нуля из `def.pbr.diffuse` каждый раз, когда меняется aggregates / flecks / stripes / marking. `mat.color` остаётся, но текстура свежая → product `color * diffuse` = пёстрая каша. Aggregates рисуются с `globalAlpha=0.88` — почти полностью перекрывают тонировку.

**Fix:**
- `mat.color` фиксируем в `white`. Цвет становится первым параметром в `buildCompositeMap(def, options)`.
- Внутри canvas: первый pass — `fillRect` выбранным цветом (или multiply-blend поверх diffuse). Aggregates / flecks / stripes / marking — поверх уже тонированной базы.
- Опции цвета (хексы) пробрасываются в композиции `buildCompositeMap`, обновляются и `orderState`.

**Side-effects:**
- Порядок кликов перестаёт ломать визуальную композицию (детерминированно).
- Кэш билдов composite map станет жирнее (вариативность параметров включает теперь цвет) — нужно или ключевать кэш по полному хешу состояния, или сбрасывать кэш при смене материала.
- Производительность: одна полная пересборка canvas ≈ 100-150ms на iPhone-13-class. Без проблем при дебаунсе 100ms.

**Owner-visible result:** Бордо + Зеркало = бордовый терраццо с зеркальными чипсами, а не серая каша. Эпокси + красные крупные флеки + жёлтая разметка = реальный читаемый ремонтный пол.

### 3.3 Dead gloss control (D-03)

**Корень:** в гэндлере `gloss` есть логическая ошибка — `const m = {low:0.7, mid:0.4, high:0.15}[opt.id]` возвращает число, потом `m[opt.id]` = `undefined`, и `mat.roughness = undefined ?? mat.roughness` = старое значение. Кнопка вообще не меняет roughness. Параллельно `finish` работает корректно и пишет тот же `mat.roughness` — пользователь не подозревает что glossом ничего не управляет.

**Fix:**
- Полностью убрать `gloss` из:
  - `manifest.json` → у каждого материала из массива `controls` удалить `"gloss"`. И из `control_options` удалить блок `gloss`.
  - `configurator.html` → удалить `if (cid === 'gloss') {...}` блок целиком.
- `finish` остаётся как единственный roughness-driver. Значения: matte 0.85 / satin 0.45 / polished 0.12 — оставить или расширить до 5 ступеней (см. R-рекомендацию в UX-аудите).

**Side-effects:**
- На 6 материалах из 9 уйдёт одна строка кнопок. Right rail станет короче — это OK, UX-аудит флагал её как избыточную.
- URL-схема меняется: если у кого-то сохранён старый URL с `gloss=high` — на загрузке игнорируем неизвестный ключ.

**Owner-visible result:** одна понятная ступень для шероховатости. Финиш = матовый/полумат/полированный. Никакой дублирующей «глянец-низкий/средний/высокий».

### 3.4 Buildup sidebar lies (D-04)

**Корень:** sidebar рендерит 4 слоя (topcoat / body / primer / substrate). GLB имеет 3 mesh (topcoat / primer / substrate). Layer view (explode) показывает 3 — пользователь читает 4. Для трейд-про с TDS на руках это мгновенный credibility-loss.

Для terrazzo body — 15-20мм цементно-мраморная масса, доминирующий по объёму слой пирога — вообще не визуализирован. Конфигуратор «врёт» в visualization vs spec.

**Fix (рекомендованный):**
- Регенерировать `plate.glb` с 4 primitives:
  - **topcoat** (top 0.5mm visually) — финишный слой
  - **body** (≈70% вертикали) — масса (terrazzo, SL epoxy, PU-cement bulk)
  - **primer** (~0.5mm) — праймер
  - **substrate** (≈30% вертикали) — бетон
- Naming в Blender: `mat_topcoat`, `mat_body`, `mat_primer`, `mat_substrate`. `findMeshesByMaterialName` (после rename) подхватит автоматически.
- `manifest.json` → `geometry.primitives = {topcoat: 0, body: 1, primer: 2, substrate: 3}`.
- Layer view (explode) расскрывает 4 слоя на Y.
- Для материалов где body не применим (паркет — корпус и есть topcoat; MMA — body это сам тонкий topcoat): conditional hide или клонирование materiala.

**Альтернативный дешёвый fix:** обрезать sidebar до 3 слоёв (схлопнуть body в topcoat-описание). Но это слабее по credibility — терраццо без 15-20мм цементной массы это не терраццо.

**Owner-visible result:** "Слои" в explode-view покажет 4 физических плиты совпадающих со sidebar. Прорабский читатель видит — топкоат тонкий, body большой, primer тонкий, substrate средний. Реалистично.

---

## 4. Brand expansion — NEW DIMENSION

Это главное архитектурное изменение. Сейчас конфигуратор знает только Sika. Владелец хочет показывать каждое семейство материалов с переключаемыми brand-опциями (Pavistamp / Topciment / Mortex / Mapei / BASF Ucrete / Flowcrete / Mondo / Nora и др.), потому что:

1. SEO — каждая комбинация `{brand × material}` это long-tail query («Topciment Sttandard микроцемент Тель-Авив»).
2. Партнёрства — Pavistamp/Topciment/Keim заявлены как owner-claimed; конфигуратор должен их продавать.
3. Trade trust — архитектор-спецификатор кликает на бренд который у него уже в спеке.

### 4.1 Новая manifest schema

Сегодня материал имеет `pbr` / `buildup` / `pricing` / `warranty_years` — всё привязано к одному (Sika) SKU. Предлагаю расширить до многобрендовой структуры:

```json
{
  "slug": "microtopping",
  "label_ru": "Микротопинг",
  "default_brand": "sika",
  "brands": [
    {
      "id": "sika",
      "name": "Sika",
      "country": "CH",
      "priority": "available",
      "sku": "Sikafloor DecoDur + SikaDecor-801 Nature",
      "tds_url": "https://gbr.sika.com/...",
      "il_distributor": "Gilar Ltd",
      "color_palette": ["ral-7032", "ral-7035", "ral-7037", "ral-7016", "ral-1015", "ral-8003", "ral-6021", "ral-5024", "ral-3013"],
      "finish_options": ["matte", "satin", "polished"],
      "aggregates_available": [],
      "flecks_available": [],
      "stripes_available": ["none", "brass", "steel", "black"],
      "gloss_levels": ["matte", "satin", "polished"],
      "pirog": {
        "topcoat": "Sikafloor ProSeal-22 · 2 слоя",
        "body":    "Sikafloor-470 Level · 2-3 мм · 2 прохода",
        "primer":  "Эпоксидный праймер · 0.3 мм",
        "substrate":"Бетон C20/25 · ≥ 20 МПа"
      },
      "pricing": { "ils_per_m2": [280, 420] },
      "warranty_years": [7, 10],
      "thickness_mm": [2, 3],
      "slip_r": "R10",
      "fire_bfl": "Bfl-s1",
      "notes_ru": "Канонический Sika-пирог, поддерживается Gilar в IL."
    },
    {
      "id": "topciment",
      "name": "Topciment",
      "country": "ES",
      "priority": "partner",
      "sku": "Sttandard Microbase + Microdeck + Presealer + Topsealer",
      "tds_url": "https://www.topciment.com/sheets/Microfino_BI_en.pdf",
      "il_distributor": "[verify — нет публичного IL-дилера]",
      "color_palette": ["topciment-arena", "topciment-piedra", "topciment-grafito", "topciment-marfil", "topciment-bordo"],
      "finish_options": ["matte", "satin"],
      "aggregates_available": [],
      "stripes_available": ["none"],
      "gloss_levels": ["matte", "satin", "polished"],
      "pirog": {
        "topcoat": "Topsealer PU water-based · 2 слоя",
        "body":    "Sttandard Microdeck · 2 слоя · 1.5-2 мм",
        "primer":  "Sttandard Microbase + fibreglass mesh на джойнтах",
        "substrate":"Бетон C20/25 + bonding primer"
      },
      "pricing": { "ils_per_m2": "[verify — нужен IL прайс-лист]" },
      "warranty_years": [5, 10],
      "thickness_mm": [2, 3],
      "slip_r": "R10",
      "fire_bfl": "Bfl-s1",
      "notes_ru": "Партнёрство заявлено owner. Самая широкая палитра в категории + академия обучения."
    },
    {
      "id": "mortex",
      "name": "Mortex (BEAL)",
      "country": "BE",
      "priority": "available",
      "sku": "Mortex Color + Mortex Flex",
      "tds_url": "https://bealmortex.com/en/",
      "il_distributor": "[verify]",
      "color_palette": ["mortex-warm-white", "mortex-stone", "mortex-anthracite", "mortex-terracotta"],
      "finish_options": ["matte", "satin"],
      "pirog": {
        "topcoat": "Wax или Mortex sealer · 2 слоя",
        "body":    "Mortex 2-3 слоя · 1.5-3 мм · пигментируется на месте",
        "primer":  "BEAL primer adapté à supportu",
        "substrate":"Бетон / стяжка / даже existing tile"
      },
      "pricing": { "ils_per_m2": "[verify]" },
      "warranty_years": [5, 8],
      "thickness_mm": [1, 3],
      "slip_r": "R10",
      "fire_bfl": "Bfl-s1",
      "notes_ru": "Mass-waterproof from 1mm. BEAL-trained applicator only. Иконичный béton-ciré look."
    }
  ]
}
```

Ключевые поля:
- **`brands[]`** — массив. Все материалы-специфичные опции (текстуры, controls, pricing) переезжают внутрь объекта бренда.
- **`default_brand`** — какой бренд выбран по умолчанию при первом select материала. Sika (бэйзлайн).
- **`priority`** — `partner` (Pavistamp / Topciment / Keim — owner-claimed) / `available` (есть в IL канале верифицированно) / `reference` (для сравнения, но IL-distribution неясно — `[verify]`).
- **`il_distributor`** — кто продаёт в IL. По research: Sika→Gilar (high confidence), остальные `[verify]`.
- **`color_palette`** — id'шки из `control_options.color` отфильтрованные под палитру бренда. Sika — RAL. Topciment — собственная палитра (нужно добавить новые option-id'шки). Mortex — ограниченная палитра под on-site pigmenting.
- **`pirog`** — слои пирога per-brand (Sika ≠ Topciment ≠ Mortex по составу).
- **`tds_url`** — обязательно для каждого, открывается в new tab — outbound trust signal + SEO.

### 4.2 Brand × material матрица (предложение)

Заполнено по research-документам, `[verify]` где IL-distribution неясно, `[ambiguous]` для Morris (см. блокер Q1).

| Material family       | Sika (baseline)                   | Partner brands (owner-claimed)         | Available alternatives                                                                  | Reference (premium / niche)                          |
|-----------------------|-----------------------------------|----------------------------------------|------------------------------------------------------------------------------------------|------------------------------------------------------|
| **microtopping**      | SikaDecor-801 / Sikafloor DecoDur | Topciment (Sttandard / Evoluttion / Atlanttic / Marmolife), Pavistamp PAVICEM HD | Mortex (BEAL), Béton Ciré (Marius Aurenti / Festfloor Life), Smartcret (DIY), Ideal Work Microtopping, Festfloor Life, Tadelakt (heritage), Marmorino (wall) | Senso bioresin (sustainability)                       |
| **terrazzo-cement**   | Sika CS-31                        | Pavistamp PAVICEM                      | Stucco Italiano, CimentArt, Ideal Work Lixio                                            | Bomanite Bomacron-Crete                              |
| **terrazzo-epoxy**    | Sika EM-10 + chips                | —                                      | Mapei Mapefloor Terrazzo, BASF MasterTop DTZ, Flowcrete Mondéco, Torginol chips         | Stonhard Stonclad GR (25% recycled glass aggregates) |
| **decorative-concrete** | SikaDecor-801 Nature            | Pavistamp PADEC / IMPRESO (stamped), Topciment Industtrial | Bomanite (stamped USA), Increte Thin-Crete (sprayed/stamped), Ardex Pandomo Floor       | Pandomo (Ardex) — architectural premium              |
| **pu-cement**         | Sikafloor PurCem HM-20            | —                                      | BASF Ucrete UD200, Flowcrete Flowfresh HF (с Polygiene antimicrobial), Mapei Mapefloor CPU/HD, Stonhard Stonclad UT, SW Poly-Crete MD | Resdev Pumacrete, Vebrocrete                         |
| **epoxy**             | Sika 263/264 SL                   | —                                      | Mapei Mapefloor I 302 SL, BASF MasterTop 1235SL / 1912 (Xolutec), Stonhard Stonshield SLT, SW Resuflor 3561, Flowcrete Flowshield SL | Stonhard Stonclad NM (novolac, chemical-resistant)   |
| **mma**               | Sika Pronto (53 TC + 100 SL)      | —                                      | BASF MasterTop 1817PC, Triflex, Kemper Kemperol (PMMA)                                  | Stonhard Stontec MMA                                 |
| **rubber (sport+commercial)** | Sika ComfortFloor PS-23/66/MarbleFX | —                              | Mondo Sportflex M / Advance / Harmoni, Nora noraplan / norament, Altro Stronghold 30, Conica CONIPUR HG (sport), Polytan Rekortan (athletic) | Regupol BSW (playground), Polyflor Polysafe Apex (safety vinyl) |
| **parquet**           | Sika Bostik PU-клей (под лак UV)  | Keim Lignosil? `[ambiguous]`           | (нет ярких brand-конкурентов в этой плоскости — это HW oak с финишем)                   | —                                                    |

**Morris** (`[ambiguous]`) — нигде не нашёлся как floor brand. Предложение: при добавлении flag в schema `is_ambiguous: true` со ссылкой на блокер Q1.

**Keim** — partner-claimed owner, но это бренд минеральных силикатных штукатурок ДЛЯ СТЕН (Granital, Soldalit, Purkristalat), не для пола. Включаем как «walls-companion brand» в boundary между floor configurator и wall (future). На полу единственный потенциальный продукт — Lignosil для дерева, тоже `[verify]`.

### 4.3 Brand selector UI — 4 опции, рекомендация

Где разместить переключатель бренда — критичный UX-вопрос. Брэнд это новое измерение поверх «material × color × finish × ...».

| Option | Описание                                                          | Pros                                          | Cons                                                                              |
|--------|-------------------------------------------------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------|
| **1. Dropdown над plate** | `Бренд: Sika ▾` поверх стейджа, постоянно видим | Compact, не съедает right-rail | Dropdown — низкий discoverability, скрывает alternative brands |
| **2. Первая строка right-rail** | `Параметры > Бренд > [Sika][Topciment][Mortex][Mapei]` chip-row | Все опции видимы сразу, паттерн совпадает с другими controls | Right rail вырастает на 60-100px; для материалов где 2 бренда — пусто |
| **3. Tab strip под plate** | `Sika · Topciment · Mortex · Mapei` под центральной зоной | Tabs семантически правильны — это срез одного и того же | Tabs могут конкурировать с view-buttons (Solid/Layers/Top/Reset) визуально |
| **4. Material chip badge** | Клик на материал слева раскрывает inline brand-options | Brand becomes part of material identity | Two-step interaction, скрытая фича на первой загрузке |

**Recommendation: Option 2 (right-rail, первая строка)**. Аргументы:
- Бренд это control, как color/finish — он принадлежит правой панели.
- Поведение consistent: все настройки в одном месте.
- Discoverability максимальный — на первом экране пользователь видит «у этой системы 4 бренда».
- В пирог-сайдбаре под controls сразу обновляется per-brand layer-stack — связка очевидна.

Для материалов с одним brand (например parquet) — строку скрываем или показываем неинтерактивный badge "Sika". Для материалов с 6+ brands — горизонтальный scroll-row на mobile.

### 4.4 Per-brand visual variance — что меняется при swap

При переключении бренда внутри материала меняется:

1. **Pirog sidebar** — layer-stack из `brands[i].pirog`. Sika микротопинг: «Sikafloor-470 Level 2-3мм · ProSeal-22». Topciment: «Sttandard Microbase + Microdeck · 2-3мм · Topsealer PU». Mortex: «BEAL primer + Mortex 1.5-3мм · wax». Пользователь видит — реальный другой пирог.
2. **Color palette** — `brands[i].color_palette` фильтрует доступные опции в `control_options.color`. Sika показывает 9 RAL. Topciment — 5 собственных Sttandard tone (если добавим). Mortex — 4 on-site-pigment ranges.
3. **Available controls** — `brands[i].finish_options` / `stripes_available` / `aggregates_available` фильтруют что показывается. Mortex не делает aggregates (никогда не было). Tadelakt не делает polished finish (только after-stone-rub polish, отдельная семантика).
4. **Specs card** — `thickness_mm`, `slip_r`, `warranty_years`, `il_distributor` обновляются в правом sidebar (см. R8 из benchmark — live spec card).
5. **TDS link** — внизу sidebar внешняя ссылка "Открыть TDS Topciment Sttandard" → outbound trust + SEO backlink.
6. **PBR texture** — `brands[i].pbr.diffuse` может быть разный (например Topciment Marmolife — marble-veined diffuse vs Sika SikaDecor — smooth). Если бренд не предоставляет свою текстуру — используется fallback от baseline (Sika).
7. **Pricing** — `brands[i].pricing.ils_per_m2` обновляется. Если `[verify]` — показывается строка «Цена по запросу».
8. **SKU surface** — внизу spec card строка `SKU: Sikafloor DecoDur ES-26 Flake` или `Topciment Sttandard Microdeck + Microbase + Microfino + Topsealer`. Architect cite-friendly.

### 4.5 Compare-two-brands side-by-side (R4 из benchmark)

Топ-3 эффект from research: Tarkett, Polyflor, Sherwin-Williams все имеют compare. Простой механизм:

UI: тогл «Сравнить» в правом верхнем углу → стейдж делится надвое. Слева plate с brand A (e.g. Sika PurCem), справа brand B (Flowcrete Flowfresh с Polygiene) — тот же color/finish/marking. Right rail показывает diff:
- `Sika · 6-9мм · R11-R13 · 10y warranty · Gilar IL`
- `Flowcrete · 6-9мм · R11-R13 · Polygiene antimicrobial · HACCP cert · via Mapei IL`

Реализация — duplicate plate в Three.js (2 viewports или 2 OrthographicCameras), shared state for color/finish/marking, brand-разная для всего остального. ~8h работы (Wave C).

---

## 5. Design benchmark moves (R1-R10) — что в scope

Из `configurator-design-benchmark.md`:

| Code | Recommendation                                            | Decision        | Why                                                                                       |
|------|-----------------------------------------------------------|-----------------|-------------------------------------------------------------------------------------------|
| R1   | In-room context preview (Roomvo-class photo upload + mediapipe segmentation) | **Wave D**       | Highest leverage feature, но требует asset library + mediapipe build → out of scope this rebuild |
| R2   | Surface real SKU on configurator output                   | **Wave B (in scope)**  | Combined with brand expansion — SKU is per-brand, sits in spec card                       |
| R3   | Fix color picker → mesh recolor                           | **Wave A (P0)** | D-01 + D-02                                                                               |
| R4   | Compare-two-finishes / two-brands side-by-side            | **Wave C (in scope)** | Extension to compare-two-brands per 4.5                                                   |
| R5   | Integrate free-sample request on configurator screen      | **Wave A (P0)** | D-08, Netlify Form                                                                        |
| R6   | 4-layer exploded view per material                        | **Wave B (in scope)** | D-04, GLB regen — единственное credibility-fixing изменение в визуализации                |
| R7   | Procedural terrazzo authoring (chip × color × density)    | **Wave C / Phase 2** | Clean differentiator, никто в floor space не делает; но v3.00 procedural lessons — нужны Blender + three skill. Defer post brand-expansion. |
| R8   | PDF spec sheet export                                     | **Wave C**       | После brand expansion — генерим бранд-aware PDF с SKU/TDS-link/QR                          |
| R9   | USDZ Quick Look + WebXR AR                                | **Wave D / Phase 2** | iOS-only path, нужен USDZ pipeline. Defer.                                                |
| R10  | Shareable saved-state URL + revisit dashboard             | **Wave A (P0)** | D-11, URL push + localStorage                                                              |

---

## 6. Architecture proposal

### 6.1 Stay vanilla — да

Site — build-less Netlify static. Все `*.html` standalone, нет bundler. Внедрение React/Vue/Svelte/Astro раздует deploy-pipeline под одну страницу. **Решение: остаёмся vanilla + ES modules** (`<script type="module">`), zero-build.

### 6.2 Split configurator.html на 4 ES-модуля

```
configurator.html             — HTML + shell + entry point (≈250 lines)
js/configurator/
  state.js                    — orderState, URL/LS persistence, brand routing (≈200 lines)
  render.js                   — Three.js scene setup, plate, lights, camera, ghost crossfade (≈350 lines)
  controls.js                 — right-rail rendering, button events, pirog sidebar live-update (≈300 lines)
  compositor.js               — canvas composite map (color + aggregates + flecks + stripes + marking) (≈250 lines)
  brands.js                   — manifest loading + per-brand variant resolution + brand-selector wiring (≈150 lines)
```

Каждый module — `export {...}`, импортируется через `import { ... } from './js/configurator/state.js';`. Загрузка — нативная браузера (HTTP/2 multiplexing на Netlify справится).

### 6.3 Manifest split

Вместо одного 392-строчного `manifest.json` — переезжаем на:

```
3d-assets-cfg/
  manifest.json              ← thin index (versioning, business info, control_options, materials list)
  brands/
    sika.json                ← Sika brand info + global defaults
    topciment.json
    mortex.json
    mapei.json
    basf-mbs.json
    flowcrete.json
    stonhard.json
    mondo.json
    nora.json
    altro.json
    conica.json
    polytan.json
    ucrete.json              (or inside basf-mbs.json)
  materials/
    microtopping.json        ← per-material schema (brands[] inline OR brands by id ref)
    terrazzo-cement.json
    terrazzo-epoxy.json
    decorative-concrete.json
    pu-cement.json
    epoxy.json
    mma.json
    rubber.json
    parquet.json
```

Easier owner editing (один материал = один файл), cache-friendlier (изменили только Topciment.json — остальное лежит в браузерном кэше). Loader resolve'ит из index.json все нужные shard'ы.

### 6.4 GLB regeneration

4-primitive plate (см. 3.4). На блендеровском сите — около 2-3h работы. Owner ранее сам успешно ран'ил `m1 headless plates-v2` (commit 1f9293c) → есть Blender pipeline. Если нет — script can compose plate procedurally в Three.js при init (4 `BoxGeometry`, разная высота) и fallback на статический GLB.

### 6.5 Persistence

- **URL** — `pushState` debounced 250ms на каждое изменение `orderState[activeSlug]`, `activeBrand`, `activeSlug`. URL: `?m=microtopping&b=topciment&color=topciment-piedra&finish=satin`.
- **localStorage** — `localStorage.floordsgn_cfg = JSON.stringify({m, b, options})` — последняя конфигурация, восстанавливается при refresh.
- **Shareable links** — клик «Поделиться» → копирует current URL в clipboard + показывает toast.

---

## 7. Wave plan

### Wave 0 — Pre-implementation (2-3h, NO code)

- Owner reviews этот документ.
- Owner отвечает на Q1-Q7 (см. §8).
- Owner подтверждает Wave A scope.
- Если есть real partner SKU/прайс-листы для Pavistamp / Topciment / Keim — owner предоставляет.
- Backup текущего etalon: `git tag cfg-v205-etalon-2026-05-27` (защита).

### Wave A — P0 bug fixes (8-12h, без schema changes)

Все правки внутри `configurator.html` v2.05 без brand-схемы. Поведение бренда остаётся Sika-only — но визуально и UX correct.

| Task                                                       | Defect IDs               | Hours |
|------------------------------------------------------------|--------------------------|-------|
| Delete color lerp (color handler + tint)                   | D-01                     | 0.5   |
| Bake color into composite canvas                           | D-02                     | 2.0   |
| Remove gloss control from manifest + JS                    | D-03                     | 0.5   |
| Fix stripes/marking tile-repeat → non-tiled decal overlay  | D-05, D-17, D-28         | 1.5   |
| Rename view-Reset → "↺ Камера" + add real "Сбросить параметры" | D-06                  | 0.5   |
| Wire ctaOrder to Netlify Form `cfg-quote-request`          | D-07                     | 1.5   |
| Wire ctaSample to Netlify Form `cfg-sample-kit-request`    | D-08                     | 1.0   |
| Live-update Системный пирог on every option click          | D-09                     | 1.0   |
| Restore per-material state on re-select                    | D-10                     | 0.5   |
| URL+localStorage debounced persistence                     | D-11                     | 1.0   |
| Queue composite rebuilds (drop single-flight)              | D-13                     | 0.5   |
| Add allowed_finish/marking gating (физ. невозможные опции) | D-16                     | 1.5   |
| favicon.ico + dead Reflector import removal                | D-19, D-21               | 0.2   |

**Acceptance критерии Wave A:**
- Бордо и Антрацит визуально различимы на всех 9 материалах.
- Один stripe в `stripes=black` это одна полоса, не 10.
- `gloss` контрола нет нигде.
- Спецификация-пирог отражает выбранные опции.
- Refresh страницы возвращает на ту же конфигурацию.
- Order CTA посылает реальный POST в Netlify Forms, владелец получает email.
- 0 console errors.

### Wave B — Architectural rebuild + brand expansion (20-28h)

После Wave A approval owner'ом.

| Task                                                                   | Hours |
|------------------------------------------------------------------------|-------|
| GLB regenerate с 4 primitives + manifest geometry update + Layers explode | 4-6   |
| Split configurator.html → 4 ES modules (state/render/controls/compositor) | 6     |
| Manifest split: brands/ + materials/ shards                            | 2     |
| Implement brand schema loader + Brand selector UI (right-rail, опция 2) | 4     |
| Wire per-brand color palette / finish filters / aggregates filters     | 2     |
| Per-brand pirog rendering + spec card with SKU/TDS-link/IL-distributor | 2     |
| Add Topciment brand-data (`brands/topciment.json` + textures если есть)| 2     |
| Add Mortex / Pavistamp brand-data                                      | 2     |
| Add Mapei / BASF Ucrete / Flowcrete brand-data (industrial)            | 2     |
| Add Mondo / Nora / Altro / Conica brand-data (rubber)                  | 2     |
| Update URL schema to include brand                                     | 0.5   |
| Brand-aware CTA payload (SKU goes into form)                           | 0.5   |

**Acceptance критерии Wave B:**
- Каждое из 9 семейств показывает минимум 2 бренда (Sika + 1 alternative).
- Layer explode показывает 4 plate slabs.
- Spec card per-brand рабочий: TDS link открывается, SKU копируется.
- URL `?m=microtopping&b=topciment&color=topciment-piedra` восстанавливает state.
- Sika baseline не сломан (regression-safe).

### Wave C — Advanced features (15-25h)

| Task                                                            | Hours |
|-----------------------------------------------------------------|-------|
| Compare-two-brands side-by-side (R4 ×2 viewports)               | 6-8   |
| Procedural terrazzo authoring (chip shape × color × density) (R7) | 6-8 |
| Stage 1 in-room preview prep — curate stock-room library 6 шт   | 2     |
| PDF spec sheet export (R8) — branded PDF c QR + render + spec   | 4     |

### Wave D — Phase 2 / later

- R1 In-room photo-composite (Roomvo-class) via mediapipe
- R9 USDZ Quick Look + WebXR AR
- Mobile-optimized layout (отдельная iteration)
- Hebrew/RTL switch
- AI photo-room replacement (Replicate-hosted model)

---

## 8. Owner-input блокеры

Numbered list, без которых Wave 0/A нельзя стартовать (Q1-Q5), Q6-Q7 — допустимо догнать в начале Wave B.

| #  | Question                                                                                  | Why blocking                                                                                | What unblocks                          |
|----|-------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------|
| Q1 | «Morris» — какой бренд? Research не нашёл — путаница с Mortex или Marmorino?              | Без понимания не можем добавить корректный brand-entry в schema                              | Owner называет URL / контакт           |
| Q2 | IL-дистрибьюторы Mapei / BASF MBS / Mondo / Stonhard / Altro / Flowcrete — известны?      | `il_distributor` поле в schema; покупатель спросит "где взять в IL"                          | Owner шлёт список или OK на `[verify]` |
| Q3 | Реальные SKU + прайс-листы Pavistamp / Topciment / Keim — у owner'а есть partner-договоры? | `pricing.ils_per_m2` per brand нужно для spec card                                          | Owner шлёт price-list PDF              |
| Q4 | Brand selector UI placement — 1 of 4 (dropdown / right-rail / tabs / inline-on-material)? | Решает где разместить, влияет на mobile layout                                               | Owner выбирает; рекомендация — Option 2 (right-rail) |
| Q5 | Parquet — оставлять или убрать? Нет brand-конкурентов у owner'а в этой плоскости.         | Если оставить — `default_brand` = generic / Sika клей. Если убрать — 8 материалов, не 9.    | Owner: keep / drop                     |
| Q6 | GLB regeneration — в Blender на owner-машине OR procedural via three.js (4 boxes)?        | v3.00 procedural reverted because "ugly"; нужно решить путь                                 | Owner: «делай в Blender» или «procedural OK» |
| Q7 | Pricing matrix per brand для live spec card — есть у owner'а?                             | Если нет — все non-Sika бренды показывают «Цена по запросу»                                  | Owner: «есть» (шлёт) или «нет — пиши by-request» |

---

## 9. Risks

| #  | Risk                                                                                       | Likelihood | Impact | Mitigation                                                                              |
|----|--------------------------------------------------------------------------------------------|------------|--------|------------------------------------------------------------------------------------------|
| R-1 | URL/localStorage migration breaks existing saved configs                                  | Низкая     | Низкий | Нет live деплоя нового; existing users = 0. На загрузке игнорим неизвестные ключи.       |
| R-2 | GLB regeneration usability — если owner не делает в Blender, fallback procedural needed   | Средняя    | Средний| Procedural fallback в three.js (4 boxes c материалами); ugly-but-shippable               |
| R-3 | Brand TDS URL outbound может быть за login или 404                                         | Низкая    | Низкий | Verify pass на старте Wave B; backup-link на local PDF copy в `docs/tds-cache/`         |
| R-4 | Brand-expansion может «диллютить» Sika positioning — owner Sika-certified applicator      | Средняя    | Высокий| Sika остаётся `default_brand` + помечен `priority: partner-primary`. Брендирование «Industrial Proof by Sika, knows alternatives» |
| R-5 | Roomvo benchmark подсказывает photo-composite — `Industrial Proof` бренд требует PBR plate primary. Не залить себя downgrade'ом. | Средняя | Средний | Confirmed via benchmark agent: PBR-plate-first соблюдается, photo-composite Wave D       |
| R-6 | Per-brand палитра требует новых color option-id в `control_options.color` — manifest рост ~3-4× | Высокая | Низкий | Acceptable. Schema поддерживает.                                                          |
| R-7 | Compare-two-brands viewport — Three.js 2× scenes на mobile = perf hit                      | Средняя    | Средний| На mobile сравнение через swap-toggle, не split-view                                     |
| R-8 | Owner может разочароваться брендами без IL-партнёрства — выглядит как "продаём то чего нет"| Средняя   | Высокий| `priority: reference` показывает «доступно через спецоснащение / запрос» — не misleading |

---

## 10. Quality gates per wave

(Зеркалит plan энциклопедии)

| Gate | Описание                                                                              |
|------|----------------------------------------------------------------------------------------|
| QG-1 | A11y — focus visible, ARIA-labels на всех кнопках, контраст ≥4.5:1                     |
| QG-2 | Build — Netlify deploy preview зелёный, 0 errors                                       |
| QG-3 | No broken links — все TDS-link отдают 200, не 404 (verify pass)                         |
| QG-4 | No etalon mutation — `git tag etalon-cc421cf / 076fdbc / 23ed628 / db80612` неподвижны |
| QG-5 | No emoji в UI — grep `[\u{1F300}-\u{1F9FF}]` на final HTML/JS = 0                       |
| QG-6 | Outbound citation — каждый brand имеет TDS-url, видимый в spec card                    |
| QG-7 | Brand palette одна Signal-точка — CTA или active-state, не больше                       |
| QG-8 | Fonts — только Cormorant + Montserrat, grep на third-font = 0                          |
| QG-9 | Lighthouse Performance ≥85 (desktop), Accessibility ≥95, SEO ≥90                        |
| QG-10| Self-QA: screenshot каждого view (Solid / Layers / Top / Reset × каждый brand × 2-3 colors) перед показом owner'у |

---

## 11. Top 3 SEO opportunities specifically from rebuild

1. **Per-brand SEO landing pages** — каждая комбинация `{brand × family}` это long-tail query. Примеры:
   - `floordsgn.com/encyclopedia/microtopping/topciment` — «Topciment Sttandard микроцемент в Тель-Авиве»
   - `floordsgn.com/encyclopedia/pu-cement/flowcrete-flowfresh` — «Flowcrete Flowfresh Polygiene антимикробный пол для пищевого производства»
   - `floordsgn.com/configurator?m=microtopping&b=mortex` — shareable URL ловится поисковыми ботами через canonical
   - Прирост organic traffic: 10-15 страниц × конкурентность low-mid в IL ≈ **+200-400 unique/mo** через 6 мес после полной публикации.

2. **«Sika vs Topciment микроцемент сравнение»** — buyer-stage query, конверсионный. Compare-two-brands feature (Wave C) даёт UI для этого; страница `/encyclopedia/compare/sika-vs-topciment-microcement` агрегирует таблицу. Никто в IL такой страницы не имеет → first-mover.

3. **Real SKU surfacing → backlinks от spec writers** — когда архитектор пишет тендер с указанием `Topciment Sttandard 2K Microdeck`, он гуглит и попадает на нас. Если у нас есть SKU + TDS-link + IL-availability, мы становимся цитируемым источником. Backlinks от тендерной документации, e-mailed BoQs, project case-studies — это самый ценный SEO-капитал в B2B сегменте.

---

## 12. Что предлагаю как next-step (open to owner)

После approval этого документа, рекомендую:

1. **Сегодня — Q1 ответ** про Morris (один разговор-уточнение).
2. **Завтра утром — Wave 0 закрытие** (Q2-Q5 ответы) + git tag etalon.
3. **Завтра днём — старт Wave A** (8-12h работы за 1-2 рабочих дня). К концу Wave A конфигуратор перестанет лгать пользователю.
4. **Wave B стартует** когда owner подтвердит Topciment/Pavistamp партнёрства реальными prices + TDS URLs. Без этого Topciment останется `[verify]`-skeleton.
5. **Wave C и D** — quarterly roadmap, не сейчас.

Wave A scope можно начать без ответов на Q2-Q7 (это всё bug-fixes на текущей Sika-only схеме) — но без owner-approval лучше не трогать etalon.

**Прошу выноса на ревью.**

---

*Compiled 2026-05-27. Sources: configurator-code-audit.md, configurator-ux-audit.md, configurator-design-benchmark.md, decorative-brands.md, industrial-brands.md, rubber-and-microtopping.md. Brand-data verification status: Sika `confirmed via Gilar`, Topciment/Pavistamp/Keim `partner-claimed by owner — verify SKU/IL price`, остальные `[verify IL availability]` per research findings.*
