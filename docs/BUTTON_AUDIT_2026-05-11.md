# Hero-Lab Button-Audit · 2026-05-11

Запущено 4 параллельных агента, прошли по всем материалам × всем контролам × всем опциям. Собранные находки + что уже починено в v21.6, что осталось.

## Уже исправлено в `1ce6166` (этот коммит)

| # | Проблема | Где было | Фикс |
|---|---|---|---|
| 1 | **terrazzo finishSlider** не работал на first paint | дефолт не задан в config | `defaults.finishSlider:25` для terrazzo+terrazzo-light |
| 2 | **micro · color=custom** — мёртвая кнопка | обещала NCS/RAL picker, нет обработчика | опция убрана из config |
| 3 | **concrete · thickness** — один вариант (0мм) | бесполезный контрол | удалён из controls[] |
| 4 | **rubber · color="multicolor"** — лейбл "Multicolor", рендер серый | label vs visual mismatch | переименовано в «Тёмно-серый» |
| 5 | **aggregateColor brass** дублирует aggregate=brass | два разных контрола, один результат | aggregateColor → «Тёплый металл» |
| 6 | **coveBase=R50** не было своей высоты в CSS | падал на 8px default = равно R75/R100/R150 fallback | explicit `height: 8px` |
| 7 | **densifier=sodium-silicate** brightness(1.0) | no-op | brightness(.985) saturate(.97) |
| 8 | aggregate **verona/brass** — то же фото что carrara | photo-clone | tooltip предупреждает что отличие только в чипах |

## Что осталось (требует owner-решения)

### CRITICAL — ломает UX, нужны конкретные действия

| # | Проблема | Файл:line | Что предлагаю |
|---|---|---|---|
| 1 | **7 агрегатов без своего фото** (nero-marquina, travertino-romano, giallo-siena, granite-sardo, quartz-clear, recycled-glass-cyan, brass-dust, copper-flake) — все падают на дефолтный Carrara photo. Меняется только палитра SVG-чипов поверх, фото остаётся одинаковое. Пользователь не различит | `enhance.js:1080-1095` aggregatePhoto map | (a) Снять кнопки этих агрегатов до появления фото, либо (b) добавить per-aggregate CSS filter которые сильно искажают base-фото |
| 2 | **R-class бейдж не обновляется** для epoxy когда выбран broadcast (Fine R10 / Medium R11 / ...). Сейчас бейдж берётся из `roughness` control, которого у epoxy нет | `enhance.js:1346` | Прокинуть `R-class` из выбранной broadcast опции (вытащить число из label) → `pmRClass` |
| 3 | **strips=mixed** — swatch hex `#7a5a18` (коричневый), но рендер — чередование латуни и чёрного | `materials.config.json:1944` + `enhance.js:518-522` | Поменять hex на серединное значение (`#3a2c0c` или сделать swatch из gradient) |
| 4 | **sargelPattern=linear** не работает без активных strips | `enhance.css:5037` | Сделать sargel-overlay независимым от strips=off (рисовать на отдельном слое) |
| 5 | **AGGREGATE_CHIPS.mirror / aggregatePhoto.mirror** — мёртвый код, в config опции `mirror` нет | `enhance.js:370,1119` | Удалить |
| 6 | **CSS правила `.is-exposure-salt-pepper / cream / full-aggregate`** — старые селекторы, не матчат actual option.ids (classA-cream, classB-saltPepper, classC-medium, classD-fullExposed) | `enhance.css:3930-3942` | Переименовать в `.is-exposure-classA-cream` и т.д. |
| 7 | **mma.crackBridging синхронизация** — config.json content рассинхронизирован с INLINE_CONFIG_FALLBACK | `enhance.js:411` vs `materials.config.json:362` | Привести fallback в соответствие с config (или удалить fallback) |
| 8 | **purcem.broadcastDensity** — в config.json есть, в JS fallback controls list нет | `enhance.js:412` | То же |

### WRONG — label обещает X, делает Y

| # | Контрол · опция | Лейбл говорит | Делает | Решение |
|---|---|---|---|---|
| 9 | terrazzo · color · yellow/red/blue | "акцент" | заливает body | Лейбл оставить «Жёлтый/Красный/Синий» (убрать "accent") |
| 10 | terrazzo · color · black | "Чёрный" `#0f0f10` | при tintStrength=0.65 photo пробивается → тёмно-серый | Поднять до 0.85 для black/charcoal |
| 11 | mma · cureMode · fast | "Fast, walk 45м" | contrast 1.04 — никакой связи со временем | Добавить badge timer или таймлайн график |
| 12 | mma · color · clear | "Clear pigmented" hex #3c3a35 | тёмно-серый, не прозрачный | Подкрасить с alpha, или убрать лейбл "Clear" |
| 13 | terrazzo · aggregate · recycled-glass-cyan | "Recycled Glass cyan" | палитра имеет янтарь #d4a020 и зелень | Заменить chips на cyan-blue палитру |
| 14 | terrazzo · strips · aluminum-yellow-forklift | "Жёлтый · forklift" | для жилого терраццо | Скрыть для terrazzo* (только industrial) |
| 15 | terrazzo · strips · pvc-black-compensation | "PVC compensation" | для декоративного | То же |

### DEAD CODE — никого не ломает, но мёртво

| # | Что | Где |
|---|---|---|
| 16 | INLINE_CONFIG_FALLBACK расходится с materials.config.json (epoxy цвета 7012/7037 отсутствуют, epoxy-light 9016, micro id совсем другие) | `enhance.js:402-444` |
| 17 | CSS rules для flecks `fine-vinyl-1-16` / `large-vinyl-1-4` / `metallic-bronze-stapa` / `metallic-copper-stapa` / `mica-pearl-iriodin` — присутствуют, но в config epoxy.flecks их нет → визуально неиспользуются | `enhance.css:5101-5138` |
| 18 | rubber pattern: `blend-3tone / bicolor-split / tricolor / stripes` — в CSS есть, в config — нет | `enhance.css:4127+` |
| 19 | parquet woodSpecies: `oak-smoked / maple / cherry / rosewood / whitewashed` — CSS есть, JS fallback всего 4 породы (oak-natural / walnut / ash / teak) | `enhance.js:441` vs `enhance.css:4918+` |

### MINOR / косметика

| # | Что | Решение |
|---|---|---|
| 20 | micro · все 11 color опций `swatch: null` — серые кружки в кнопках | добавить swatch hex в config |
| 21 | Множество aggregates визуально близки (brass / brass-dust / copper-flake) | per-aggregate-CSS filter или удалить дубли |
| 22 | aggregateSize=medium — класс `is-aggsize-medium` ставится, CSS правила нет | добавить пустое правило или явный no-op |
| 23 | thickness разница 12→15мм всего 6px на боковой грани | бамп до 8-10px чтобы стало заметно |

## Приоритезация для следующего sprint

**Tier 1 (must-fix)** — 1-3, 5-8 из CRITICAL. ~2 часа.
**Tier 2 (next)** — 4 (sargel-linear), 9-15 (WRONG labels). ~3 часа.
**Tier 3 (cleanup)** — 16-19 (dead code). ~1 час.
**Tier 4 (polish)** — 20-23. ~2 часа.

Каждый Tier — отдельный коммит. Не пытаться сделать всё сразу (опыт v20-v29 показал что радикальные pass-ы owner отвергает).

## Что cross-validated

- PRNG seed (material + aggregate + aggregateColor) — не реседится при кликах strips/sargel/finish/thickness/aggregateSize ✓
- `antique-coin` рендерит circles + inner highlight, `continue` блокирует polygon fallthrough ✓
- accents 5 опций — все имеют CSS rules ✓
- multiZone 4 опции — все имеют CSS rules ✓
- crackBridging off / aramid-mat / dry-mix-mesh — корректны; fibreglass-4x4 использует default cross-hatch (не баг) ✓
- finishSlider дискретизация (matte/satin/polished/glossy/wetlook) — корректна ✓
- marking 5 опций — все имеют CSS rules ✓
- broadcast 6 опций — отдельные ::after правила с разной плотностью ✓

## Сырьё для будущих passes

Все 4 транскрипта агентов лежат в `/private/tmp/claude-501/-Users-agentmachine-Work-02-Projects-meltbot-moltbot-dashboard/.../tasks/` (full JSONL). Если нужно — можно вытащить более детальные file:line для каждого пункта.
