# FloorDSGN — Что уже есть на сайте (2026-05-27)

Полный inventory перед планированием расширения энциклопедии.

## Текущее состояние: 76 контент-страниц

### 1. Encyclopedia (`articles/encyclopedia/`) — 4 системные статьи + индекс

- `index.html` — хаб 8 систем с фильтрами/сравнением/persona toggle (designer/architect/builder)
- `epoxy-sl.html` — Эпокси SL, Sikafloor-263 (456 строк, самая полная)
- `microtopping.html` — Микротопинг, Sikafloor-470 (331 строка)
- `pu-cement.html` — PU-cement, Sikafloor PurCem (329 строк)
- `terrazzo.html` — Терраццо, CS-31 + EM-10 (331 строка)

**Гэп в encyclopedia:** нет статей для MMA, бетон полированный, каучук, ComfortFloor, восстановление. Только 4 из 8-9 систем.

### 2. Top-level articles (`articles/`) — 13 статей

- `2026-trends.html` — индустриальные тренды 2026
- `concrete-crack-repair.html` — ремонт трещин в бетоне
- `epoxy-vs-polyurethane.html` — техническое сравнение (12 мин чтения)
- `industrial-cleaning.html` — протоколы уборки промышленных полов
- `microtopping-vs-epoxy.html` — сравнение материалов
- `mma-fast-cure.html` — MMA быстрого отверждения
- `self-leveling-screeds.html` — самовыравнивающиеся стяжки
- `substrate-moisture-testing.html` — тестирование влажности
- `terrazzo-modern-interiors.html` — терраццо в интерьере
- `terrazzo-vs-microtopping.html` — сравнение
- `warm-floor-compatibility.html` ← новое (ночь 2026-05-27)
- `when-to-recoat.html` — когда перекрывать
- `architect-pretender-checklist.html` ← новое (ночь 2026-05-27)

**Гэпы в articles:**
- Подготовка основания (только moisture-testing) — нет про механическую подготовку (грайнд/блaст), нет про ICRI CSP, нет про химическую очистку
- Как выбрать систему (есть decision-tool, но нет статьи-руководства)
- Тренды по конкретным брендам / сравнения брендов (только Sika vs внутренние)
- Резина — только в /floors/, нет статьи
- Микроцемент / микротопинг — есть базовая, но нет про варианты (Topciment vs Mortex vs Marmorino vs Sika)

### 3. Material pages (`materials/`) — 8 страниц «обзор материала»

- `concrete.html`, `epoxy.html`, `microtopping.html`, `mma.html`, `pu-cement.html`, `restoration.html`, `rubber.html`, `terrazzo.html`

### 4. Floor systems (`floors/`) — 39 страниц (8 хабов + 31 вариант)

- `concrete/` — cream, salt-pepper, full-aggregate (3 варианта)
- `epoxy/` — anti-static, decorative, esd-conductive, seal-coat, self-leveling, troweled-hbs (6)
- `microtopping/` — standard, walls, wet-rooms (3)
- `mma/` — cold-storage, decorative, fast-cure-industrial (3)
- `pu-cement/` — cove-base, heavy-duty, satin, standard (4)
- `restoration/` — concrete-renewal, full-renewal, recoat, terrazzo-repolish (4)
- `rubber/` — comfortfloor, poured, sheet, tile (4)
- `terrazzo/` — epoxy, mineral, palladiana, venetian (4)

### 5. Tools (`/tools.html` хаб + 15 инструментов) ← все добавил ночью

- decision-tool, studio, configurator, substrate-check, compare, visualizer, room-visualizer, sample-kit, quote, tools, care-guide, warranty, repair-or-replace, tco, boq, coastal-chloride-audit, haccp-package, faq

---

## Что отсутствует (выявлено в твоём запросе)

### A. Подготовка основания
- Нет обширной статьи про механическую подготовку (shot blasting / диамант-грайнд / scarification / scabbling)
- Нет про химическую очистку (acid etching / detergent)
- Нет про ICRI CSP 1-9 (профили поверхности)
- Нет про инструменты подготовки (Blastrac, Diamatic, ручной грайнд)
- Нет статьи «дефекты бетона и как с ними работать» (laitance / curing residue / oil / hollow spots)
- Тесты — есть только статья про влажность; нужны: adhesion pull-off, carbonation, compressive, chlorides
- Ремонт перед укладкой — нет про crack injection, нет про spall repair, нет про bonding agents

### B. Что куда идёт — выборы
- decision-tool работает как wizard, но статьи-guide «какой пол куда» нет
- Нужно текстовое руководство по 15+ use cases (penthouse / coastal villa / office / cafe / kitchen / warehouse / pharma / food / cold storage / gym / hospital / showroom / port / bathroom / shop)
- «Что НЕ делать» — anti-patterns (почему не эпокси в food, почему не микротопинг в industrial, и т.д.)

### C. Резина и микротопинг материалы
- Резина: только 4 страницы в /floors/rubber/ (comfortfloor / poured / sheet / tile), нет статей в encyclopedia
- Микротопинг: 1 encyclopedia + 3 floors/ варианта; нет сравнения Sika Microcement vs Topciment vs Mortex vs Marmorino vs Tadelakt vs Beton Cire
- Нет про спортивные системы (Conica, Polytan, Mondo)
- Нет про safety floors (Altro, Polyflor)
- Нет про conductive/ESD rubber

### D. Другие бренды (besides Sika)
Сайт сейчас исключительно Sika. Нужны страницы / комплекты статей:
- **Pavistamp** (стамп-бетон, испанский)
- **Topciment** / Topcement (испанский лидер микроцемента)
- **Morris** (вероятно Morris Topciment — уточнить)
- **Keim** (немецкий минеральный — стены, но релевантно для wall-microtopping)
- **Mortex** (бельгийский альтернатива микроцементу)
- **Marmorino / Tadelakt / Beton Cire** — традиционные альтернативы
- Промышленные конкуренты Sika: **Mapei** (Mapefloor), **BASF/Master Builders** (Mastertop), **Stonhard**, **Flowcrete**, **Ardex**, **Sherwin-Williams**, **Bostik**
- Спорт: **Mondo**, **Conica**, **Polytan**, **BSW Regupol**
- Safety floors: **Altro**, **Polyflor**, **Forbo**, **Tarkett**

Цель: сравнительные страницы «Sika vs X» — чтобы при поиске «X система пола» Floor.DSGN тоже показывался.

### E. Индустрия / порталы / ресурсы
Сейчас на сайте нет страницы «Resources / Industry» — список авторитетных источников, на которые ссылаемся. Это бустит SEO trust (Google любит сайты которые ссылаются на авторитеты) + создаёт впечатление что мы в теме.

Нужны категории: trade magazines (Concrete Decor, Floor Daily, ESM), trade associations (ICRI, FeRFA), standards (EN 13813, EN 1504, ת״י 466, ASTM, DIN), tutorials (YouTube channels), architecture portals (Archdaily, Designboom, Material Bank).

---

## Что собираем сейчас (research agents в работе)

| Файл | Что собирает | Время |
|---|---|---|
| `docs/research/decorative-brands.md` | Topciment, Pavistamp, Morris, Keim, Mortex, Marmorino, Tadelakt, Beton Cire | ~8 мин |
| `docs/research/industrial-brands.md` | Mapei, BASF, Stonhard, Flowcrete, Ardex, etc. | ~8 мин |
| `docs/research/substrate-prep.md` | Механика, химия, ICRI CSP, тесты, ремонт | ~10 мин |
| `docs/research/rubber-and-microtopping.md` | Rubber поставщики + микротопинг бренды | ~10 мин |
| `docs/research/industry-portals.md` | Trade magazines + associations + standards + tutorials | ~8 мин |
| `docs/research/choosing-the-right-floor.md` | 15 use cases + декрешн критерии + anti-patterns | ~10 мин |

После сбора → собираю master-план: какие страницы добавить, в каком разделе, с какими URL, какой объём, в каком порядке.

**До твоего одобрения плана не пишу страницы.** Только research.
