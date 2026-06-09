# FLOORDSGN_BACKLOG.md — наряды по трекам

Источник правды по исполнению. Один наряд = одна ветка = один PR. Готово = критерий выполнен (не «я поработал»). Деплой — только по апруву оператора. Verify-before-handoff: a11y + build зелёные, curl 200.

Треки: **A** фундамент (partials/лого) · **B** redirects/ссылки · **C** медиа-актив · **D** лид/TG-инфра · **N** навигация (NAVIGATION.md) · **PSN** аватары (PERSONAS.md).

Статусы: `todo` · `in-progress` · `pr-review` · `done` · `blocked`.

---

## Трек A — Канон-фундамент (partials + лого)

- **A-1** · `todo` · Создать `partials/header.html` + `partials/footer.html`, логотип только там (DESIGN.md §3). крит: header/footer существуют, логотип в одном месте · Builder
- **A-2** · `todo` · Заменить во всех страницах встроенный логотип/nav/footer на partial; raster-лого (`White1_tr.png`/`Black1_tr.png`) из шаблонов убрать. крит: страницы тянут partial, raster-лого нет в шаблонах · Builder · dep A-1
- **A-3** · `todo` · Канон лого = 4 SVG (DESIGN §3): `logo-horizontal[-white].svg`, `logo-mark[-white].svg`. Deprecated (`White1_tr.png`, `Black1_tr.png`, `logo.svg` legacy, `logo-stacked-white`) → `images/logo/_deprecated/`. крит: в активном logo/ только 4 канонических SVG · Builder

## Трек B — Redirects и ссылки (таксономия floors)

- **B-1** · `todo` · Создать `_redirects` с 301-картой из SITEMAP §3. крит: `_redirects` существует, 301 materials→floors · Builder · dep SITEMAP.md
- **B-2** · `todo` · Заменить все внутренние ссылки `/materials/` → `/floors/`. крит: 0 внутренних ссылок на /materials/ · Builder
- **B-3** · `blocked` (отдельный гейт) · Удалить `materials/*.html` после подтверждения 301 + 0 входящих ссылок. крит: materials/ удалён, 301 ловит старые URL · Builder · dep B-1, B-2, апрув оператора

## Трек C — Медиа-актив (1.37 ТБ, отдельный долгий трек)

- **C-6** · `todo` · Каталогизировать/завести per-persona наборы фото из SAMSUNG 1TB в репо (оптимизированные). крит: 4 набора social-proof доступны сайту · Media+Builder

## Трек D — Лид / TG-инфраструктура

- **D-1** · `blocked` (Operator) · `/lead` CF-секреты: `wrangler pages secret put TELEGRAM_BOT_TOKEN` + `CHAT_ID`. крит: тестовый лид доходит в Telegram, не в WhatsApp-fallback · Operator

## Трек N — Навигация (из NAVIGATION.md §8)

- **N-1** · `todo` · Configurator: видимая primary-CTA → `/lead` + перенос system/formula. крит: клик из конфигуратора доходит в `/lead` с параметрами · Builder
- **N-2** · `todo` · Studio: primary-CTA «образец» → `/lead`, убрать тупик floor-room. крит: conversion-выход виден, лид доходит · Builder
- **N-3** · `todo` · Главная: удалить fx-audience + второй tools-band, переставить 8 секций по NAVIGATION §1. крит: 8 секций, один primary в hero · Builder · dep A-1
- **N-4** · `todo` · Все ссылки `materials/*` на главной → `floors/*`. крит: 0 ссылок на materials с index · Builder · dep B-1
- **N-5** · `todo` · floors/*: свести 11 CTA к иерархии primary/secondary по NAVIGATION §5. крит: один primary на странице · Builder
- **N-6** · `todo` · WhatsApp sticky primary + инвертировать phone/WA. крит: WA primary на мобиле · Builder
- **N-7** · `todo` · ⚠ Брендовый email + заменить gmail во всех шаблонах. крит: gmail не встречается в коде · Operator+Builder

## Трек PSN — Аватары (из PERSONAS.md §6)

- **PSN-1** · `todo` · `?persona=` инфраструктура: параметр читается, несётся по сессии, переключает hero/CTA/proof-блоки. крит: смена persona меняет 4 элемента на странице · Builder · dep A-1
- **PSN-2** · `todo` · Owner-воронка end-to-end: hero→Configurator→`/lead?persona=owner`. крит: тестовый owner-лид с persona в TG · Builder · dep PSN-1, N-1
- **PSN-3** · `todo` · Designer-воронка: designers.html→Studio→`/lead?persona=designer` + spec-sheet PDF. крит: designer-лид + PDF отдаётся · Builder · dep PSN-1, N-2
- **PSN-4** · `todo` · Contractor-воронка: industrial→floors→BoQ→`/lead?persona=contractor`. крит: contractor-лид с BoQ · Builder · dep PSN-1
- **PSN-5** · `todo` · Builder-воронка: verticals→spec/HACCP→`/lead?persona=builder`. крит: builder-лид + site-survey запрос · Builder · dep PSN-1
- **PSN-6** · `todo` · `/lead` payload += persona/source/system; TG-уведомление сегментировано. крит: уведомление показывает аватар · Builder · dep D-1
- **PSN-7** · `todo` · Per-persona social-proof блоки (4 набора фото/кейсов из медиа-актива). крит: каждый аватар видит свой proof · Builder+Media · dep C-6

---

## Порядок волн (не веер)

1. **Волна 1 — фундамент:** A-1, A-2, A-3, B-1, B-2 (ветка `feature/canon-foundation`, PR, без деплоя).
2. **Волна 2 — лид-выходы (самый денежный фикс):** N-1, N-2 (Studio/Configurator → `/lead`).
3. **Волна 3 — главная + floors:** N-3, N-4, N-5, N-6, N-7.
4. **Волна 4 — Owner-аватар end-to-end:** PSN-1, PSN-2 (+ D-1 оператором).
5. **Дальше:** Designer (PSN-3), затем Contractor/Builder (PSN-4/5), медиа (C-6/PSN-7).
