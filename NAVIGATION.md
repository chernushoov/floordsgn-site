# NAVIGATION.md — Floor.DSGN карта навигации и конверсии

Источник правды по информационной архитектуре: порядок блоков, переходы, единственное primary-действие на странице, выходы в заявку. Закрывает «бардак среди крутых вещей» — Studio и Configurator перестают быть тупиками. Дополняет DESIGN.md (бренд) и SITEMAP.md (структура).

**Принцип:** одна страница = одна задача = одно primary-действие. Воронка, не веер. Каждый интерактив заканчивается conversion-step.
**Канонический conversion-event** = заявка в `/lead` (образец + расчёт). Вторичный = WhatsApp. Всё ведёт туда.

---

## 1. ГЛАВНАЯ (index.html) — порядок секций под воронку

**Было** (12 секций, веер): `fx-audience → hero3d → fx-tools → fx-picker → gallery → trust → industries-strip → services → process → clients → home-tools-band → cta`.

**Стало** (8 секций, один путь вниз):

1. **hero3d** — обещание + ОДНА primary-кнопка «Собрать пол в 3D» → Configurator. (Вторичная ссылка-текст «Не уверены? Подбор за 6 вопросов» → decision-tool.)
2. **systems (#material-picker)** — 8 систем, каждая → `floors/<x>` (НЕ materials).
3. **gallery** — твои реальные фото (Трек C медиа). Social proof #1.
4. **trust + clients** — гарантия 10 лет, сертификация, named clients (объединить, не две секции).
5. **tools-band** — ОДИН блок: Studio + Configurator как две карты с разными задачами (не два band'а).
6. **industries** — 5 индустрий (свернуть strip + services в одну).
7. **process** — 5 шагов «как работаем».
8. **cta** — «Получить образец + расчёт» → `/lead`. WhatsApp sticky всегда поверх.

**Удалить:** `fx-audience` (мёртвый switcher, Phase 0), второй `home-tools-band` (дубль), лишнее дробление industries/services.

## 2. CONFIGURATOR — перестаёт быть тупиком

**Было:** единственный выход → `/` (домой). Дорогой трафик утекает.
**Стало** — низ инструмента после «формула + смета»:

- **PRIMARY:** «Получить образец + точный расчёт» → `/lead?source=configurator&system=<выбранная>&formula=<id>` (видимая кнопка, не только JS-параметр).
- **SECONDARY:** «Посмотреть в реальной комнате» → `studio.html?system=<выбранная>` (перенос выбора).
- **Бейдж:** «10-летняя гарантия» рядом с CTA.

## 3. STUDIO — перестаёт быть тупиком

**Было:** единственный выход → `floor-room.html` (соседний визуализатор). Conversion-выхода нет.
**Стало** — после раскладки в комнате:

- **PRIMARY:** «Запросить образец этой системы» → `/lead?source=studio&system=<выбранная>`.
- **SECONDARY:** «Точная смета по этой системе» → `quote.html?system=<выбранная>`.
- Убрать тупиковую ссылку на `floor-room` как основную (floor-room → во второй слой `/tools`).

## 4. Перекрёстная связь Studio ↔ Configurator (развести роли)

| | Configurator | Studio |
|---|---|---|
| Задача | одна система крупно → формула + смета | пол в реальной комнате, мульти-персона |
| Для кого | вход для ВСЕХ (быстро, 12с) | дизайнер / архитектор / объект |
| Conversion | `/lead?source=configurator` | `/lead?source=studio` |
| Связь | «Увидеть в комнате →» Studio | «Точная смета →» Configurator/quote |

Оба — НЕ конкуренты на главной: Configurator = primary-вход в hero, Studio = вторая карта в tools-band.

## 5. Страницы систем (floors/*) — одна точка выхода

У каждой `floors/<x>` уже 11 CTA-блоков — это много и распыляет. Свести к иерархии:

- **PRIMARY** (один, заметный): «Образец + расчёт этой системы» → `/lead?source=floors&system=<x>`.
- **SECONDARY:** «Собрать в 3D» → `configurator.html?system=<x>` · «В комнате» → `studio.html?system=<x>`.
- Остальные ссылки (статьи, сравнения) — в подвал страницы, не как CTA.

## 6. Лид-захват (единый, против рассинхрона)

- ОДИН conversion-target: `/lead` со всех инструментов и CTA. `contact.html` и `quote.html` постят в тот же `/lead`-обработчик.
- WhatsApp sticky = PRIMARY на мобиле (Израиль #1 по WhatsApp-commerce). Телефон `tel:` — вторичен (сейчас перекос ×4 phone / ×1 WA — инвертировать).
- Брендовый email вместо `floors.dsgn@gmail.com` (напр. `hello@floordsgn.com`). ⚠ Operator: завести почту на домене.
- `/lead` требует CF-секреты TG (BACKLOG D-1) — иначе всё это утекает в fallback.

### 6.1 WhatsApp ↔ Telegram — ДВА разных канала (не «или-или»)

Их часто путают. Это два разных потока, оба primary в своём:

| Канал | Для кого | Роль | Задача |
|---|---|---|---|
| **WhatsApp** | КЛИЕНТ | публичный вход/общение | sticky-кнопка → клиент пишет тебе (IL #1 по WhatsApp-commerce). Это **N-6**. |
| **Telegram** | ОПЕРАТОР (ты) | труба доставки лида | форма `/lead` → бот шлёт ТЕБЕ структурированный лид: `persona, source, system, формула/BoQ, контакт`. Это **D-1**. |

- Доставка лида идёт через **n8n → Telegram** (guardian-роль, уже сшито). `chat_id 8175553706` — оператора.
- Почему TG для уведомлений, а не WhatsApp: WhatsApp Business API для авто-уведомлений — платный, верификация, шаблоны, провайдер. Telegram-бот — бесплатный, мгновенный, удобен для структурированных данных (persona/система/формула/BoQ).
- **Сейчас сломаны оба недонастройкой:** WhatsApp недоприоритезирован в навигации (телефон ×4 давит WA ×1 → N-6); Telegram-доставка не работает без CF-секретов (→ D-1), поэтому форма падает в WhatsApp-fallback и структурированный лид теряется.
- Правильная картина: **Клиент → WhatsApp** (sticky, общение). **Форма /lead → Telegram** (тебе, структурированный лид, мгновенно).

## 7. Главное меню (5 ядровых)

Системы (floors) · Configurator · Studio · Инструменты (tools hub) · Контакт. Энциклопедия/проекты/about — во вторичную навигацию/подвал. 11 инструментов второго слоя — только в `/tools`.

## 8. ЗАДАЧИ (трек D / навигация — см. FLOORDSGN_BACKLOG)

- **N-1** · Configurator: видимая primary-CTA → `/lead` + перенос system/formula. крит: клик из конфигуратора доходит в `/lead` с параметрами · Builder
- **N-2** · Studio: primary-CTA «образец» → `/lead`, убрать тупик floor-room. крит: conversion-выход виден, лид доходит · Builder
- **N-3** · Главная: удалить fx-audience + второй tools-band, переставить 8 секций по §1. крит: 8 секций, один primary в hero · Builder · dep A-1
- **N-4** · Все ссылки `materials/*` на главной → `floors/*`. крит: 0 ссылок на materials с index · Builder · dep B-1
- **N-5** · floors/*: свести 11 CTA к иерархии primary/secondary по §5. крит: один primary на странице · Builder
- **N-6** · WhatsApp sticky primary + инвертировать phone/WA. крит: WA primary на мобиле · Builder
- **N-7** · ⚠ Брендовый email + заменить gmail во всех шаблонах. крит: gmail не встречается в коде · Operator+Builder

## 9. КАРТА ПЕРЕХОДОВ (целевая)

```
hero → Configurator ─┬─► /lead?source=configurator   (PRIMARY conversion)
                     └─► Studio ──► /lead?source=studio
floors/<x> ──────────┬─► /lead?source=floors&system=x (PRIMARY)
                     ├─► Configurator?system=x
                     └─► Studio?system=x
decision-tool ───────► floors/<x> ──► /lead
любая страница ──────► WhatsApp sticky (PRIMARY mobile) / /lead
```

Один сток — `/lead`. Ни один инструмент не заканчивается «домой» или в соседнем туле.
