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

## Осталось по наряду (следующие слайсы)
Studio/Configurator tool-chrome unify (studio.html без «домой»), base-dark глобально (footer/прочие страницы), configurator monospace→Montserrat, listing H1 Cormorant-drift, mobile table overflow. Logo: BLOCKED (оператор выбирает).

## Deliverables
Ветка `fix/design-premium-pass` + этот FIXLOG. PR — без мёржа. Прод не тронут.
