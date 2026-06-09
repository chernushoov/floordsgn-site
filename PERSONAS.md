# PERSONAS.md — Floor.DSGN матрица аватаров

Источник правды по сегментации клиентов. Один сайт обслуживает 4 аватара, каждый — своя дверь, путь, conversion, social-proof и язык. НЕ выбор одной аудитории, а развилка. Дополняет NAVIGATION.md (общая воронка) и DESIGN.md/SITEMAP.md.

**Принцип:** аватар НЕ выбирается мёртвым switcher'ом (это был UX-врун, удалён). Аватар определяется входной дверью (сегментный лендинг / источник клика) и несётся через `?persona=` по всей сессии — hero, CTA, proof и язык подстраиваются.

---

## 1. ЧЕТЫРЕ АВАТАРА

| # | Аватар | Кто | Главная боль | Что покупает решение |
|---|---|---|---|---|
| O | **Owner** | владелец квартиры/виллы | «красиво + сколько это стоит» | образец + точная смета |
| D | **Designer** | дизайнер/архитектор | «спека под проект + как выглядит в комнате» | spec-sheet + образец под объект |
| C | **Contractor** | подрядчик/прораб | «расход на м² + цена + наличие» | BoQ + опт-расчёт |
| B | **Builder** | девелопер/procurement/объект | «соответствие, гарантия, HACCP, downtime» | site survey + спецификация |

---

## 2. ДВЕРИ (вход) И ВОРОНКИ

Каждый аватар входит через свою дверь — существующие сегментные страницы достраиваем, не создаём заново.

### O — Owner
- Дверь: `index.html` (главная) → hero «Соберите свой пол в 3D».
- Путь: hero → **Configurator** → формула+смета → CTA.
- Primary conversion: «Образец + расчёт» → `/lead?persona=owner&source=configurator`.
- Social proof: фото готовых квартир/вилл (терраццо, микротопинг) из медиа-актива.
- Язык: RU primary, HE (Phase 2).

### D — Designer/Architect
- Дверь: `designers.html` (уже есть) — точка входа из IG/портфолио/реферралов.
- Путь: designers → **Studio** (мульти-персона, в реальной комнате) → раскладка → CTA.
- Primary conversion: «Spec-sheet + образец под проект» → `/lead?persona=designer&source=studio`.
- Вторичное: co-branded PDF spec, палитры терраццо, Revit/SketchUp (из памяти — specifier-ход).
- Social proof: венецианское терраццо, palladiana, penthouse-кейсы.
- Язык: EN primary, HE.

### C — Contractor
- Дверь: `industrial.html` / прямой заход на систему.
- Путь: industrial → `floors/<x>` → **BoQ** (расход + Sika SKU + цена) → CTA.
- Primary conversion: «BoQ + опт-расчёт» → `/lead?persona=contractor&source=boq`.
- Social proof: цены/наличие, скорость монтажа, технологические карты.
- Язык: HE primary, EN.

### B — Builder/Procurement
- Дверь: `verticals/*` (warehouse, healthcare, hospitality, architects — уже есть).
- Путь: vertical → spec library / HACCP-package → **site-survey запрос** → CTA.
- Primary conversion: «Site survey + спецификация» → `/lead?persona=builder&source=vertical`.
- Social proof: case studies с метриками (м²/downtime/год), гарантия, сертификация, HACCP, named clients.
- Язык: EN primary, HE.

---

## 3. ЧТО МЕНЯЕТСЯ ПО АВАТАРУ (один движок, 4 маски)

Параметр `?persona=` (или входная дверь) переключает на КАЖДОЙ странице:

| Элемент | Owner | Designer | Contractor | Builder |
|---|---|---|---|---|
| Hero-текст | «ваш пол, ваша квартира» | «спецификация под проект» | «расход, цена, сроки» | «соответствие и гарантия» |
| Primary CTA | образец+смета | spec+образец | BoQ | site survey |
| Главный инструмент | Configurator | Studio | BoQ | spec library |
| Social proof | фото квартир/вилл | терраццо-палитры, penthouse | цены/наличие, тех.карты | case studies, HACCP, clients |
| Доказательство цены | «от ₪/м²» диапазон | spec + материалы | полный BoQ с SKU | TCO 10 лет |
| Тон (скилл-голос) | инженерный, доступный | инженерный, проектный | инженерный, прикладной | инженерный, нормативный |

Неизменно для всех: бренд (DESIGN.md), no emoji, источники Sika/Mapei/BASF/ICRI/ACI, один сток `/lead`, WhatsApp sticky.

## 4. ОБЩИЙ СТОК С СЕГМЕНТАЦИЕЙ

Все 4 воронки → один `/lead`-обработчик, но с `persona` в payload. В Telegram-уведомление падает: `persona, source, system, формула/BoQ, контакт`. Ты сразу видишь, кто пришёл (владелец виллы ≠ подрядчик) и отвечаешь по-разному. Сегментация лида = половина продажи.

## 5. ПРИОРИТЕТ ИСПОЛНЕНИЯ (чтобы не получился веер)

Делаем по одному аватару до конца, не все параллельно:

1. **Owner первым** — самый широкий трафик, самый короткий цикл, Configurator уже почти готов. Быстрые деньги.
2. **Designer вторым** — Studio + designers.html есть, specifier-ход даёт качественные B2B-лиды.
3. **Contractor / Builder** — после, через BoQ/verticals и партнёрство Sika/Mapei (объёмные сделки, длинный цикл).

Логика: O и D окупают сайт быстро и финансируют доводку C/B. Не «все сразу», а волной.

---

## 6. ЗАДАЧИ (трек Personas — см. FLOORDSGN_BACKLOG)

- **PSN-1** · `?persona=` инфраструктура: параметр читается, несётся по сессии, переключает hero/CTA/proof-блоки. крит: смена persona меняет 4 элемента на странице · Builder · dep A-1
- **PSN-2** · Owner-воронка end-to-end: hero→Configurator→`/lead?persona=owner`. крит: тестовый owner-лид с persona в TG · Builder · dep PSN-1, N-1
- **PSN-3** · Designer-воронка: designers.html→Studio→`/lead?persona=designer` + spec-sheet PDF. крит: designer-лид + PDF отдаётся · Builder · dep PSN-1, N-2
- **PSN-4** · Contractor-воронка: industrial→floors→BoQ→`/lead?persona=contractor`. крит: contractor-лид с BoQ · Builder · dep PSN-1
- **PSN-5** · Builder-воронка: verticals→spec/HACCP→`/lead?persona=builder`. крит: builder-лид + site-survey запрос · Builder · dep PSN-1
- **PSN-6** · `/lead` payload += persona/source/system; TG-уведомление сегментировано. крит: уведомление показывает аватар · Builder · dep D-1
- **PSN-7** · Per-persona social-proof блоки (4 набора фото/кейсов из медиа-актива). крит: каждый аватар видит свой proof · Builder+Media · dep C-6
