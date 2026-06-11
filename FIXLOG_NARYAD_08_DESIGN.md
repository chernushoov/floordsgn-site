# FIXLOG — НАРЯД 08: Design pass (dark-green premium) — homepage slice

- **Ветка:** `fix/design-premium-pass` (от `integration` @ 29546c5, + merge `fix/dark-green-foundation` tokens)
- **Worktree:** `floordsgn-site-new__design`
- **Дата:** 2026-06-11
- **Статус:** ✅ ГЛАВНАЯ (index.html) перестроена и переодета в премиум dark-green. Остальные пункты наряда (Studio/Configurator chrome, прочие страницы) — следующие слайсы.
- **Не мёржено, не задеплоено.** `landing.html` FROZEN (не тронут), `configurator.html` не тронут, эталоны не тронуты.

## Задача (фокус оператора)
«Пройдись по первой странице и правильно построй и расположи блоки — а то всё подряд.» + NARYAD 08: применить тёмно-зелёную премиум-линию (вайб старого Wix-сайта, не его «лавку»), сохранив суть экспертного портала.

## Что было (BEFORE)
Блоки «всё подряд»: hero3d (near-black, Cormorant) → picker → bento → **trust с эмодзи-иконками ✓⌬⌖⏳** → «How We Work / Consultation» → «Trusted Across Sectors» → «Ready to Start? Free consultation» — лавка, плоско, без композиции, near-black вместо зелёного.

## Что стало (AFTER) — index.html
Экспертно-портальная IA + премиум-скин (всё под `body.home .hp-*`, scoped, аддитивно):
1. **HERO** — pine-green `#182420`, big-sans «DESIGN IN EVERY **LAYER**» (Montserrat, 2-тон), RU-саблайн, ОДНА Signal-CTA «Собрать пол в 3D» + ghost + decision-tool. Большое скруглённое фото (28px) с **наплывом** (`translateY(72px)`) — перетекает на зелёный блок и в следующую секцию.
2. **SYSTEMS** — карточки с **вертикальными лейблами** (Resin / Terrazzo / Micro-Topping / Concrete) + «+»-аффорданс (Signal на hover), скругление 24px.
3. **STUDIO · 3D** — зелёная полоса, фото-наплыв, «Спроектируйте пол до миллиметра», формула 10/PBR/≈12s → конфигуратор + Studio.
4. **LIBRARY** — «Инженерная глубина» + 4 карточки (энциклопедия/сравнение/подбор/стандарты).
5. **PROOF** — реальные работы (bento, скругление 20px), без фейк-статистики.
6. **LEAD CTA** — зелёная полоса → 3D / смета.
7. **Footer** → pine-green (home-scoped).

**Удалено:** hero3d-near-black, эмодзи-trust, «How We Work», «Trusted Across Sectors», «Ready to Start? Free consultation» (лавка), все фейк-claims.

## Hard-rules — соблюдено
- ✅ ОДНА Signal-точка на странице (hero CTA; «+» Signal только на hover = transient).
- ✅ Без эмодзи (старые ✓⌬⌖⏳ убраны).
- ✅ Без непроверенного пруфа (никаких 10+/99%/100+/клиентских блоков) — реальные системы + реальные фото.
- ✅ `landing.html` FROZEN, `configurator.html` не тронут, эталоны не тронуты.
- ✅ Pill-кнопки 980px, скругления 20–28px, big-sans хедлайны.

## Render-verify (3 брейкпоинта) — пройдено
390 / 768 / 1440 отрендерены и проверены глазами. Зелёный читается премиально (не «грязно»), наплыв/скругления выглядят намеренно. Пофикшены по ходу: библиотечные лейблы Signal→steel (one-signal), мобильный хедлайн-клип + горизонтальный overflow (box-sizing/тип-скейл на ≤560). Скриншоты: `/tmp/design-before/*` vs `/tmp/design-after/*`.

## DESIGN.md
- §8 переписан: dark-green из «pending» → **APPLIED**, + переиспользуемый спек (radius/наплыв/вертикал-лейбл/big-sans тип/IA).
- Токены формализованы: `colors.base-dark` `#182420`, `colors.base-dark-2` `#151E1B` + компоненты `button-dark` / `section-dark` / `section-dark-deep`.
- **Lint: 0 errors, 3 warnings** (no-primary + 2 contrast — все pre-existing/accepted).

## Slice 2 — лого «с викса» + tool-chrome
- **Лого RESOLVED.** «лого с викса» = тот же **FLOOR.DSGN tile-mosaic mark**, что уже в репо (`logo-mark-orig.png` + `-white`). Сверил crop старого Wix-хедера vs текущий mark — идентичны. Никакого нового ассета.
- **Хедер главной → премиум.** Включён `header--hero` (инлайн-скрипт на `body.home`): прозрачный хедер с **белым лого** над зелёным hero → на скролле твердеет в pine-полосу (`--base-dark`, лого остаётся белым). Раньше был белый бар.
- **Tool-chrome unify.** Минимальный бар (канонический лого + «← на сайт») добавлен на **Studio (`floor-room.html`)** — у неё не было «домой» — и на **Configurator**. Белый лого на тёмной Studio, чёрный на светлом Configurator. 3D-движки не тронуты (аддитивный оверлей).
- **Configurator monospace → Montserrat.** `--mono` JetBrains Mono (это был 3-й шрифт = нарушение §2) → Montserrat, одной токен-строкой (19 использований).
- Render-verify: home-header (desktop+mobile), Studio chrome, Configurator chrome — отрендерены и проверены. Lint DESIGN.md: 0 errors / 3 warnings.

## Slice 3 — carry-over polish
- **Footer pine-green site-wide.** `.footer{background:var(--carbon)}` → `var(--base-dark)` в styles.css (было: только home-scoped). Теперь зелёный футер на всех 87+ страницах.
- **Configurator `--accent` синий → Signal.** `#0071e3` (Apple-blue) → `#C86B3C`. Бренд-цвет восстановлен (точки/метки/selection).
- **Mobile table/article overflow ИСПРАВЛЕН.** Корень: на статьях/сравнениях `.article-body` имел `min-width:auto` и схлопывался к ширине широкой таблицы (~451px) → весь контент клипался на телефоне. Фикс (styles.css, `@media ≤760`): `.article-content/.article-body{min-width:0;width:100%;box-sizing:border-box}` + content-таблицы `display:block;overflow-x:auto`. DOM-замер в 390px-iframe: `docScrollW=390`, `article-body=290` (было 451). Реальные телефоны (respect viewport-meta) рендерят верно; headless full-page скрин при `--window-size` клипает из-за viewport-meta-кваркa, но DOM-замер — авторитетен.
- **listing-page H1 Cormorant.** Проверил library.html и др. — H1 уже Cormorant (дрейфа нет; «Montserrat» в library был body-шрифтом). Хоумпейдж big-sans hero — намеренное исключение (§8).

## Slice 4 — base-dark по порталу + Studio onboarding
- **base-dark на прочих тёмных поверхностях** (styles.css): `.page-hero` (тёмный hero на всех внутренних страницах: about/floors/projects/contact…), `.cta-section` (тёмная CTA-полоса), `.trust-section` (`#1d1d1f`→pine), `.btn-primary` (тёмные кнопки Carbon→pine). Теперь весь портал в зелёном, не только footer/home. Проверено: about.html hero — pine-green «Инженерное совершенство». Менял только `background` (не токен `--black`), текст не тронут.
- **Studio onboarding-wall убран (§4).** В studio.js на первом визите было `setTimeout(openChooser, 700)` — авто-стена persona-chooser. Заменил на чистый `applyPersona('explore')` (Studio грузится сразу, без стены) на всех вьюпортах; persona-pill остаётся opt-in. 3D-движок не тронут (studio.js — оверлей над движком, правка только в boot-ветке). Проверено: Studio открывается напрямую (панель материалов/цвета/света + «Подобрать пол»).
- **Studio home-link.** Оказалось studio.js уже строит `st-brand` → `index.html` (был скрыт под модалкой при первом осмотре). Мою дублирующую `.studio-home` chrome из floor-room.html убрал — канонический «домой» даёт studio.js. Configurator chrome (tile-логотип + «← на сайт») оставлен как минимальный бар там.

## Осталось (мелочь)
Скролл-pine хедер главной — CSS на месте (`.header--hero.header--scrolled{background:base-dark}`), в headless состояние скролла не снять (iframe-scroll + virtual-time не рендерит) — проверить вживую. Encyclopedia/floors инлайн-тёмные блоки (если есть) — точечно при ревью.

## Deliverables
Ветка `fix/design-premium-pass`: `e04cef8` → `b6af0a8` (главная) → `a13d8ce` (лого/chrome) → `fa6e6c2` (footer/accent/tables) → slice 4 (base-dark портал / Studio §4). FIXLOG. Без мёржа, без прода. `landing.html` FROZEN, 3D-движки не тронуты, эталоны не тронуты. lint DESIGN.md: 0 errors.
