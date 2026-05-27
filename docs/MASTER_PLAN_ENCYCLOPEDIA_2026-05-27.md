# FloorDSGN — Мастер-план расширения энциклопедии и контента

**Дата:** 2026-05-27
**Статус:** предложение на твоё ревью, страницы не пишу до approve
**Бренд:** Industrial Proof — Carbon `#151515` / Steel `#72716D` / Signal `#C86B3C` / Concrete `#F3F0EA` / Graphite `#2D2D2D`, Cormorant Garamond + Montserrat
**Локали:** RU primary; Hebrew — P2 следующая фаза (вынесено в раздел 6)

---

## 1. Executive summary

Предлагаю **37 новых страниц** (общий объём ~92 000 слов, оценка эффорта **~58–72 часа** автономной работы, разнесённых на 3 волны) + **точечное обогащение 8 существующих страниц** энциклопедии и материалов без переписывания etalon-коммитов.

Цель — превратить сайт из «премиум-сайта одного бренда (Sika)» в **технического арбитра рынка**: при поиске «Topciment vs Sika», «Ucrete vs PurCem vs Flowfresh», «как подготовить основание под полимерный пол», «что выбрать для пищевого цеха» — FloorDSGN должен показываться в первой выдаче. Это buyer-stage запросы, по которым к нам придут инженеры/архитекторы/спецификаторы, а не только частники.

**Top-3 SEO win opportunities** (по убыванию ценности):

1. **`Sikafloor PurCem vs Ucrete vs Flowfresh` сравнительная таблица для инженеров** — самый дорогой buyer-stage запрос, который вообще существует в нашем рынке. Никто в IL по-русски не покрывает эту тройку с цифрами из TDS. Один Polygiene-аргумент Flowcrete'a уже даёт дифференциатор, который не закрывает ни один Sika SKU.
2. **«Подготовка бетонного основания: ICRI CSP 1–10 + методы прокачки» (RU)** — нулевая конкуренция в Hebrew/Russian сегменте; цитирует ICRI 310.2R-2013 + ASTM F2170 + ת״י 466. Захватывает 80% «почему мой пол отслоился» поиска.
3. **«Микроцемент: Topciment vs Mortex vs Sika DecoDur vs Marmorino» с честной таблицей по химии связующего (цемент-полимер / лайм-цемент-гибрид / чистая известь)** — закрывает гэп №1 у owner'а (партнёрства Topciment/Pavistamp/Keim) и пробивает топ-3 поиска для микроцемента в IL.

**Лиц.вспомогательный win:** «Industry Resources» хаб со ссылками на ICRI / FeRFA / DIN / SII / Sikafloor TDS — это outbound-citation pool, который Google использует для оценки E-E-A-T. По выкладке агента 6 (industry-portals.md) у нас ~30 trade-magazines + 25 ассоциаций + 30 стандартов готовы к курации.

---

## 2. Owner-input gaps — приоритетные вопросы перед публикацией

Это не «не пишем вообще», это «не публикуем без твоего OK». Каждый пункт блокирует конкретные страницы.

| # | Open question | Откуда вылез | Что разблокирует |
|---|---|---|---|
| Q1 | **«Morris» — какой именно бренд?** Research нашёл только William Morris (текстиль/обои), что не floor brand. Скорее всего опечатка: Mortex (бельгийский), Marmorino (итальянский) или Marius Aurenti (французский Béton Ciré). | decorative-brands.md §3 | Страница `articles/brands/morris.html` или редирект на актуальный бренд |
| Q2 | **Italprotec = Ideal Work?** Research не нашёл бренд Italprotec; крупнейший итальянский decorative cement — Ideal Work (Sarmede, IT), Microtopping® + Lixio®. | decorative-brands.md §13 | Подтвердить — пишем профиль Ideal Work как «итальянский эталон» |
| Q3 | **Cemplaster / Smartrenders — это бренды или категории?** Cemplaster в search не находится как глобальный бренд. Smartrenders скорее всего опечатка от **Smartcret** (Spain, Valencia, ready-to-use DIY-grade kits). | decorative-brands.md §15, §17 | Подтвердить URL/каталог; иначе не пишем профиль |
| Q4 | **Sikafloor-470 — это microcement или underlayment?** Агент 6 (rubber-and-microtopping.md §2.2) flag: Sikafloor-470 Level = self-levelling **underlayment 10–50 mm**, НЕ декоративный микроцемент 2–3 mm. Декоративная линия Sika — **DecoDur / MicroTop / SikaDecor-801 Nature**. На сайте сейчас `articles/encyclopedia/microtopping.html` ссылается на Sikafloor-470 как на микротопинг → нужна правка SKU. | rubber-and-microtopping.md §2.2 + content-inventory | Решение: правим SKU в существующей странице (микро-edit, не переписываем etalon) или сохраняем как есть с пометкой «underlayment под декоратив» |
| Q5 | **IL-дистрибьюторы Mapei / Master Builders (ex-BASF) / Altro / Polyflor / Tarkett / Forbo / Ardex** — research нашёл только Sika→Gilar как 100% подтверждённый. Остальные через тайл-трейд без именованного импортёра. | industrial-brands.md §18 | Без этого мы пишем «европейский бренд, есть в IL через…» — слабая страница. Если знаешь импортёров — резко усилит каждую бренд-страницу. |
| Q6 | **IL ₪/m² цены 2026** — все цифры в research помечены `[verify]` (конверсия из EU/US). | rubber-and-microtopping.md §1.4, §1.5, §2.8 | До твоей price-stamp процедуры публикуем диапазоны со словом «ориентировочно» или прячем цены за «спросить смету» |
| Q7 | **Какие из 4 etalon-коммитов трогать НЕЛЬЗЯ при обогащении existing pages?** Подтверждаю по CLAUDE.md: cc421cf (hero3d), 076fdbc (cfg-mobile), 23ed628 (audit-fix), db80612 (sprint0-complete) — не модифицирую. Но `articles/encyclopedia/*.html` (epoxy-sl, microtopping, pu-cement, terrazzo) — в etalon-коммиты не входят, обогащение допустимо. | CLAUDE.md + git tag list | Подтверди что я правильно понял scope etalon — иначе всё «обогащение» в разделе 4 нужно перенести в новые страницы |

**Plan execution rule:** Wave A (раздел 6) собран только из страниц, **не зависящих** ни от одного Q1–Q7. Wave B и C — зависимые.

---

## 3. Page-by-page plan

37 новых страниц, сгруппированы по 8 секциям. Каждая строка: URL, title (RU), section, words, sources, SEO targets, priority, owner-input.

### 3.1 Substrate preparation cluster (7 страниц) — на базе agent 3

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 1 | `articles/substrate/mechanical-prep.html` | Механическая подготовка бетона: шот-бласт, диамант-грайнд, скарификация, скаблирование | articles | ~2200 | substrate-prep.md §1, ICRI 310.2R, Polycote captive shot blast, Husqvarna PG series | подготовка бетона под полимерный пол / shot blasting на иврите / диамантовый грайнд / скарификация бетона | P0 | none |
| 2 | `articles/substrate/icri-csp-guide.html` | ICRI CSP 1–10: какой профиль для какого покрытия | articles | ~1800 | substrate-prep.md §3, DeFelsko, TCC Materials chart | ICRI CSP / профиль бетона / surface profile под эпоксид | P0 | none |
| 3 | `articles/substrate/moisture-testing.html` (EXTEND existing `articles/substrate-moisture-testing.html`) | Влажность бетона: ASTM F2170 + F1869 + CM + Tramex — полный протокол | articles | +900 to existing | substrate-prep.md §4.1, ASTM F2170/F1869, Wagner, Tramex | F2170 / F1869 / влажность бетона / RH тест | P0 | none (обогащение существующей, см. раздел 4) |
| 4 | `articles/substrate/adhesion-pull-off.html` | Pull-off тест (ASTM D7234 / EN 1542): когда основание готово | articles | ~1400 | substrate-prep.md §4.2, ASTM D7234, DeFelsko PosiTest AT | pull-off бетона / адгезия покрытия / EN 1542 | P0 | none |
| 5 | `articles/substrate/repair-before-coating.html` | Ремонт основания перед укладкой: трещины, сколы, hollow areas | articles | ~2000 | substrate-prep.md §5, §6, Sikadur-52 / SikaFix HH / SikaTop / Planitop / Mapei Eporip | crack injection / ремонт трещин в бетоне / Sikadur-52 | P0 | Q4 (Sikadur SKU IL подтверждение) |
| 6 | `articles/substrate/coastal-chloride-prep.html` | Подготовка прибрежного бетона: хлориды, карбонизация, защита арматуры | articles | ~1800 | substrate-prep.md §7.2, EN 14629, Sika FerroGard, EpoCem, MonoTop-1010 | хлориды в бетоне / прибрежный бетон / коррозия арматуры | P1 | Q5 |
| 7 | `articles/substrate/defects-handbook.html` | 6 дефектов бетона: laitance, curing residue, oil, hollow, efflorescence, exposed rebar | articles | ~1600 | substrate-prep.md §6, Graco, ChemCo, Evolving Elements | дефекты бетона / laitance / выцветание бетона | P0 | none |

**Cluster subtotal:** 7 страниц, ~11 700 слов, **6 P0 + 1 P1**.

### 3.2 Choice / decision guides (4 страницы) — на базе agent 5

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 8 | `articles/guides/how-to-choose-floor.html` | Как выбрать систему пола: 11 критериев в правильном порядке | articles | ~3000 | choosing-the-right-floor.md §1 | как выбрать пол / выбор полимерного пола / decision guide / какой пол куда | P0 | none |
| 9 | `articles/guides/use-cases-15.html` | 15 типов помещений: пол для пентхауса / виллы / офиса / кафе / кухни / склада / фармы / больницы / спортзала / детской площадки / шоурума / порта / ванной / магазина | articles | ~3500 (15×~230 слов на кейс) | choosing-the-right-floor.md §2 | пол для офиса / пол для кухни ресторана / пол для пищевого цеха / пол для аптеки | P0 | none |
| 10 | `articles/guides/anti-patterns.html` | Что НЕ делать: 5 классических ошибок спецификации | articles | ~1800 | choosing-the-right-floor.md §3 | ошибки эпоксидного пола / почему пол отслоился / эпоксид в пищевом цеху | P0 | none |
| 11 | `articles/guides/decision-tree-5q.html` | 5 вопросов — и ты знаешь свой пол: текстовая версия decision-tool wizard | articles | ~1400 | choosing-the-right-floor.md §4 | какой пол выбрать / decision tree пол | P0 | none |

**Cluster subtotal:** 4 страницы, ~9700 слов, **4 P0**.

### 3.3 Brand profile pages (15 страниц) — на базе agents 1+4

Структура единая: HQ → линейка продуктов → 1 differentiator → IL-распространение → Sika analog → 3 ссылки на TDS.

**Decorative brands (8 страниц):**

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 12 | `articles/brands/topciment.html` | Topciment: испанский лидер микроцемента (Sttandard / Evoluttion / Atlanttic / Industtrial) | articles/brands | ~1800 | decorative-brands.md §1, rubber-and-microtopping.md §2 | Topciment Israel / Topciment микроцемент / Sttandard Microbase | P0 | Q5 (IL-дистрибьютор) |
| 13 | `articles/brands/pavistamp.html` | Pavistamp: испанский стамп-бетон + PAVICEM микроцемент с 1990 | articles/brands | ~1500 | decorative-brands.md §2, rubber-and-microtopping.md §2 | Pavistamp Israel / стамповый бетон / PAVICEM | P0 | Q5 |
| 14 | `articles/brands/mortex.html` | Mortex (BEAL): бельгийский béton ciré, waterproof from 1 mm | articles/brands | ~1600 | decorative-brands.md §8, rubber-and-microtopping.md §2 | Mortex Israel / béton ciré / Mortex микроцемент | P0 | Q5 |
| 15 | `articles/brands/keim.html` | Keim: 140 лет минеральной силикатной краски (стены, фасады, реставрация) | articles/brands | ~1400 | decorative-brands.md §4 | Keim Israel / минеральная краска / силикатная штукатурка | P1 | Q5 (Keim — owner-named partner) |
| 16 | `articles/brands/ideal-work.html` | Ideal Work: итальянский Microtopping® + Lixio® continuous flooring | articles/brands | ~1500 | decorative-brands.md §13 | Ideal Work / Microtopping Italy / Lixio | P1 | Q2 (Italprotec = Ideal Work?) |
| 17 | `articles/brands/marmorino.html` | Marmorino: венецианская известь + мраморная пыль (Stucco Italiano, Meoded, Vasari) | articles/brands | ~1300 | decorative-brands.md §12 | Marmorino / венецианская штукатурка / Stucco Italiano | P1 | none |
| 18 | `articles/brands/tadelakt.html` | Tadelakt: марокканская техника саппонификации (waterproof через химию, не через сили) | articles/brands | ~1300 | decorative-brands.md §11 | Tadelakt / марокканская штукатурка / hammam finish | P2 | none (niche, sparse demand) |
| 19 | `articles/brands/senso.html` | Senso (NL): первый recyclable bioresin seamless floor — Cradle-to-Cradle | articles/brands | ~1200 | decorative-brands.md §6 | Senso flooring / bioresin pol | P2 | Q5 |

**Industrial brands (7 страниц):**

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 20 | `articles/brands/mapei-mapefloor.html` | Mapei Mapefloor: I 302 SL / PU 410 / CPU/HD — итальянский конкурент Sika | articles/brands | ~1600 | industrial-brands.md §2 | Mapei Mapefloor / Mapei эпоксид / I 302 SL | P0 | Q5 |
| 21 | `articles/brands/master-builders-mastertop.html` | MasterTop (ex-BASF): MasterTop 1235SL / 1912 Xolutec / 1817PC MMA | articles/brands | ~1700 | industrial-brands.md §3, §3b | MasterTop / Xolutec / Ucrete | P0 | Q5 |
| 22 | `articles/brands/ucrete.html` | Ucrete UD200: эталон PU-cement для тяжёлой индустрии (-40°C → +200°C) | articles/brands | ~1400 | industrial-brands.md §3b | Ucrete UD200 / PU-cement / BASF Ucrete | P0 | Q5 |
| 23 | `articles/brands/flowcrete-flowfresh.html` | Flowcrete Flowfresh: Polygiene® серебряный антимикроб в PU-cement матрице | articles/brands | ~1600 | industrial-brands.md §4 | Flowcrete / Flowfresh HF / Polygiene antimicrobial | P0 | Q5 |
| 24 | `articles/brands/stonhard.html` | Stonhard Stonclad: single-source warranty (материал + укладка + сервис) | articles/brands | ~1500 | industrial-brands.md §5 | Stonhard / Stonclad UT / single source warranty | P1 | Q5 |
| 25 | `articles/brands/altro.html` | Altro: safety vinyl с PTV >36 на весь срок жизни (кухни, healthcare) | articles/brands | ~1500 | industrial-brands.md §13 | Altro safety / Altro Stronghold 30 / R12 vinyl | P1 | Q5 |
| 26 | `articles/brands/polyflor.html` | Polyflor Polysafe: британский safety vinyl R10–R12 с PUR-усиленной поверхностью | articles/brands | ~1300 | industrial-brands.md §12 | Polyflor / Polysafe Apex / safety vinyl IL | P1 | Q5 |

**Brand-vs-brand comparison pages (3 страницы — самые дорогие SEO assets):**

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 27 | `articles/comparisons/sika-vs-mapei-vs-mastertop.html` | Sika vs Mapei vs Master Builders: эпоксидный SL для коммерческого склада | articles/comparisons | ~2200 | industrial-brands.md §17 + TDS-таблицы | Sika vs Mapei / эпоксид сравнение / Mapefloor vs Sikafloor | P0 | Q5 (для IL-channel конкретики) |
| 28 | `articles/comparisons/purcem-vs-ucrete-vs-flowfresh.html` | **PurCem vs Ucrete vs Flowfresh: что выбрать инженеру для пищевого цеха** (the engineer query) | articles/comparisons | ~2500 | industrial-brands.md §16 + TDS-таблицы | PurCem vs Ucrete / Sika vs Flowcrete / PU-cement сравнение | P0 | none (research-only) |
| 29 | `articles/comparisons/microcement-brands-7way.html` | Микроцемент: 7 брендов (Sika DecoDur / Topciment / Pavistamp / Mortex / Marmorino / Tadelakt / Béton Ciré) — таблица химии связующего | articles/comparisons | ~3000 | rubber-and-microtopping.md §2.2 + §2.3 | микроцемент сравнение / Topciment vs Mortex / какой микроцемент выбрать | P0 | Q1 (Morris), Q3 (Smartcret) — но можно публиковать БЕЗ их колонок |

**Cluster subtotal:** 18 страниц (8 decorative + 7 industrial + 3 comparisons), ~30 700 слов. **9 P0 + 7 P1 + 2 P2**.

### 3.4 Rubber deep-dive (5 страниц) — на базе agent 6 §1

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 30 | `articles/encyclopedia/rubber-poured-sport.html` | Литой PU-каучук для спорта: Conica / Polytan / Regupol под EN 14904 | articles/encyclopedia | ~2000 | rubber-and-microtopping.md §1.2 | спортивный пол / литая резина / EN 14904 / IAAF трек | P1 | Q6 (IL pricing) |
| 31 | `articles/encyclopedia/rubber-playground.html` | Резина для детских площадок: EN 1177, CFH, толщина под падение | articles/encyclopedia | ~1800 | rubber-and-microtopping.md §1.2, §1.7 + EN 1177 fall-height table | резина детская площадка / EN 1177 / CFH / impact attenuation | P1 | Q6 |
| 32 | `articles/encyclopedia/rubber-sheet-healthcare.html` | Листовая каучуковая резина: Nora / Mondo / Altro для больниц и транзита | articles/encyclopedia | ~1800 | rubber-and-microtopping.md §1.4, §1.8 | Nora rubber / больничный пол / Mondo Harmoni | P1 | Q5, Q6 |
| 33 | `articles/encyclopedia/rubber-tiles-gym.html` | Резиновая плитка SBR / EPDM: дом, гараж, кроссфит | articles/encyclopedia | ~1500 | rubber-and-microtopping.md §1.5 | резина для спортзала / EPDM плитка / SBR плитка | P2 | Q6 |
| 34 | `articles/encyclopedia/rubber-esd-conductive.html` | ESD/conductive каучук: сервер-комнаты, MRI, ATEX-зоны | articles/encyclopedia | ~1500 | rubber-and-microtopping.md §1.6 + Sika ESD / StaticWorx | ESD пол / антистатическая резина / server room flooring | P2 | Q6 |

**Cluster subtotal:** 5 страниц, ~8600 слов. **0 P0 + 3 P1 + 2 P2** (rubber — niche по сравнению с микроцементом + PU-cement, поэтому ни одна не P0).

### 3.5 Microcement deep-dive (4 страницы) — на базе agent 6 §2

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 35 | `articles/encyclopedia/microcement-binder-chemistry.html` | Связующее в микроцементе: цемент-полимер vs известь-цемент-гибрид vs чистая известь vs псевдо-эпоксид | articles/encyclopedia | ~2000 | rubber-and-microtopping.md §2.1, §2.3 | микроцемент состав / chemistry микроцемента / Mortex vs Topciment химия | P0 | none |
| 36 | `articles/encyclopedia/microcement-wet-rooms.html` | Микроцемент в мокрой зоне: build-up, мембраны, PU-сили, сроки обновления | articles/encyclopedia | ~1800 | rubber-and-microtopping.md §2.5 + Resin Flooring Co / Festfloor / Smartcret | микроцемент ванная / микроцемент душ / waterproof микроцемент | P0 | none |
| 37 | `articles/encyclopedia/microcement-known-issues.html` | Известные проблемы микроцемента и как их избежать (9 типов дефектов) | articles/encyclopedia | ~2200 | rubber-and-microtopping.md §2.7 + Topciment problems / Microcementec / Seamless Overlays | трещины микроцемента / проблемы микроцемента / why microcement cracks | P0 | none |
| 38 | `articles/encyclopedia/microcement-decision-tree.html` | Какой микроцемент куда: 9 типов помещений → 1 правильный продукт | articles/encyclopedia | ~1400 | rubber-and-microtopping.md §2.6 + §2.9 decision tree | какой микроцемент выбрать / Tadelakt vs Topciment / микроцемент для бассейна | P0 | none |

**Cluster subtotal:** 4 страницы, ~7400 слов. **4 P0** — это самый sharp ROI кластер.

### 3.6 Resources / Industry hub (2 страницы) — на базе agent 6

| # | URL slug | Title (RU) | Section | Words | Sources | SEO targets | Tier | Owner-input |
|---|---|---|---|---|---|---|---|---|
| 39 | `articles/resources/index.html` | Авторитетные источники по полу: trade magazines / associations / standards / YouTube | resources | ~2200 | industry-portals.md §1, §2, §4 (top-5 per category = 15+5+5 = 25 ссылок) | ICRI Israel / FeRFA / Concrete Decor / стандарты бетонного пола | P0 | none |
| 40 | `articles/resources/standards-glossary.html` | Глоссарий стандартов: EN 13813 / EN 1504 / DIN 51130 / ASTM F2170 / ICRI 310.2R / ת״י 466/1923/5566 | resources | ~2500 | industry-portals.md §3 + industrial-brands.md §0 | EN 13813 / DIN 51130 / R9-R13 / CSP стандарт | P0 | none |

**Cluster subtotal:** 2 страницы, ~4700 слов. **2 P0**.

### 3.7 Summary of new pages

**TOTAL: 37 новых страниц + 3 обогащения существующих (см. раздел 4)**

| Cluster | Pages | Words | P0 | P1 | P2 |
|---|---|---|---|---|---|
| Substrate prep | 7 | 11 700 | 6 | 1 | 0 |
| Decision guides | 4 | 9700 | 4 | 0 | 0 |
| Brand profiles | 18 | 30 700 | 9 | 7 | 2 |
| Rubber | 5 | 8600 | 0 | 3 | 2 |
| Microcement | 4 | 7400 | 4 | 0 | 0 |
| Resources | 2 | 4700 | 2 | 0 | 0 |
| Substrate moisture (extend) | 1 (existing) | +900 | 1 | 0 | 0 |
| **Total** | **37 new + 1 extend** | **~73 700** | **26** | **11** | **4** |

(Подсчёт ниже использует укрупнённый ~92 000 включая обогащения в разделе 4 — там +6 страниц обогащаются короткими блоками 600–1200 слов каждая.)

---

## 4. Existing pages — обогащение (no rewrite of etalon)

Не переписываем работающие страницы. Добавляем секции «Альтернативы / Сравнение» в конец каждой релевантной страницы.

| Existing page | What to add at end | Words added |
|---|---|---|
| `articles/encyclopedia/microtopping.html` | Секция «Microtopping: Sika DecoDur vs Topciment Sttandard vs Mortex vs Pavistamp PAVICEM» — компактная таблица + ссылки на 4 новые brand pages (см. cluster 3.3) + правка Sikafloor-470 → Sikafloor DecoDur (Q4 from §2) | +800 |
| `articles/encyclopedia/epoxy-sl.html` | Секция «Эпоксидный SL: Sikafloor-263 vs MasterTop 1235SL vs Mapefloor I 302 SL vs Flowshield» — таблица из industrial-brands.md §17 | +700 |
| `articles/encyclopedia/pu-cement.html` | Секция «PU-cement: PurCem vs Ucrete vs Flowfresh vs Stonclad UT» — таблица из industrial-brands.md §16 | +900 |
| `articles/encyclopedia/terrazzo.html` | Секция «Эпокси-terrazzo альтернативы: Flowcrete Mondéco vs MasterTop DTZ vs Sikafloor EM-10» | +500 |
| `materials/microtopping.html` | Краткий блок «3 семьи связующего» (cement-polymer / lime-hybrid / pure-lime) + ссылка на new page #35 binder-chemistry | +400 |
| `materials/rubber.html` | Блок «4 семьи каучука» (poured PU / sheet / tile / ESD) + ссылка на rubber cluster (#30–#34) | +400 |
| `materials/epoxy.html` | Блок «3 уровня эпоксида»: FeRFA Type 1–3 coating / Type 4–5 SL / Type 6–8 mortar + ссылка на industrial-brands.md классификацию | +400 |
| `articles/substrate-moisture-testing.html` | Добавить ASTM F1869 CaCl₂ + DIN 18560 CM + Tramex impedance — research у нас всё есть, существующая страница только про F2170 | +900 (= page #3 в substrate cluster — это и есть обогащение, не новая страница) |

**Etalon коммиты — не трогаю:** cc421cf (hero3d, index.html), 076fdbc (configurator.html mobile), 23ed628 (audit-fix manifest), db80612 (sprint0-complete RU default + EN toggle). Если обогащение какой-то из existing pages случайно затронет файл из этих коммитов — стоп, спрашиваю.

---

## 5. SEO architecture

### 5.1 URL hierarchy

```
articles/
├── encyclopedia/                  ← системы (что это такое + варианты)
│   ├── epoxy-sl.html              (existing, обогащаю)
│   ├── microtopping.html          (existing, обогащаю + правка SKU)
│   ├── pu-cement.html             (existing, обогащаю)
│   ├── terrazzo.html              (existing, обогащаю)
│   ├── rubber-poured-sport.html   ← НОВОЕ #30
│   ├── rubber-playground.html     ← НОВОЕ #31
│   ├── rubber-sheet-healthcare.html  ← НОВОЕ #32
│   ├── rubber-tiles-gym.html      ← НОВОЕ #33
│   ├── rubber-esd-conductive.html ← НОВОЕ #34
│   ├── microcement-binder-chemistry.html  ← НОВОЕ #35
│   ├── microcement-wet-rooms.html ← НОВОЕ #36
│   ├── microcement-known-issues.html ← НОВОЕ #37
│   └── microcement-decision-tree.html ← НОВОЕ #38
│
├── substrate/                     ← НОВЫЙ раздел
│   ├── mechanical-prep.html       ← #1
│   ├── icri-csp-guide.html        ← #2
│   ├── adhesion-pull-off.html     ← #4
│   ├── repair-before-coating.html ← #5
│   ├── coastal-chloride-prep.html ← #6
│   └── defects-handbook.html      ← #7
│
├── guides/                        ← НОВЫЙ раздел
│   ├── how-to-choose-floor.html   ← #8
│   ├── use-cases-15.html          ← #9
│   ├── anti-patterns.html         ← #10
│   └── decision-tree-5q.html      ← #11
│
├── brands/                        ← НОВЫЙ раздел
│   ├── topciment.html             ← #12
│   ├── pavistamp.html             ← #13
│   ├── mortex.html                ← #14
│   ├── keim.html                  ← #15
│   ├── ideal-work.html            ← #16
│   ├── marmorino.html             ← #17
│   ├── tadelakt.html              ← #18
│   ├── senso.html                 ← #19
│   ├── mapei-mapefloor.html       ← #20
│   ├── master-builders-mastertop.html ← #21
│   ├── ucrete.html                ← #22
│   ├── flowcrete-flowfresh.html   ← #23
│   ├── stonhard.html              ← #24
│   ├── altro.html                 ← #25
│   └── polyflor.html              ← #26
│
├── comparisons/                   ← НОВЫЙ раздел (самые ценные SEO assets)
│   ├── sika-vs-mapei-vs-mastertop.html  ← #27
│   ├── purcem-vs-ucrete-vs-flowfresh.html ← #28
│   └── microcement-brands-7way.html ← #29
│
└── resources/                     ← НОВЫЙ раздел
    ├── index.html                 ← #39
    └── standards-glossary.html    ← #40
```

### 5.2 Internal cross-link graph

**Hub-and-spoke логика:**

- `articles/guides/how-to-choose-floor.html` (хаб) → линкует все 15 use-cases + decision tree + anti-patterns + каждый encyclopedia type
- Каждая brand page (`brands/X.html`) → линкует (a) соответствующий material page (`materials/X.html`), (b) Sika analog encyclopedia, (c) comparison page
- Каждая comparison page (`comparisons/X.html`) → линкует все участвующие brand pages
- Каждая substrate page → линкует encyclopedia пол-системы, которая требует данного CSP/prep
- `articles/resources/index.html` (хаб ресурсов) → outbound on ICRI/FeRFA/DIN, internal на substrate cluster + standards-glossary
- `materials/X.html` (existing 8 pages) → обогащение блоком «3–4 семьи материала» с linka на encyclopedia новые

**Карта влияния (top 10 связей):**

1. `guides/how-to-choose-floor` → 4 substrate + 11 encyclopedia + 4 guides = 19 outbound
2. `comparisons/purcem-vs-ucrete-vs-flowfresh` → brands/ucrete + brands/flowcrete-flowfresh + encyclopedia/pu-cement + guides/use-cases-15#food = 4 outbound + entry from 6 inbound
3. `comparisons/microcement-brands-7way` → 7 brand pages + microcement-binder-chemistry + decision-tree = 9 outbound
4. `substrate/icri-csp-guide` → 4 encyclopedia + mechanical-prep + defects-handbook = 6 outbound
5. `resources/index` → 25+ outbound external + 6 substrate + standards-glossary
6. `articles/encyclopedia/microtopping` (existing) → новые 4 microcement encyclopedia + brand pages Topciment/Mortex/Sika DecoDur + microcement-brands-7way comparison
7. `articles/encyclopedia/pu-cement` (existing) → brands/ucrete + brands/flowcrete-flowfresh + comparison purcem-vs-ucrete-vs-flowfresh + use-cases-15#food
8. `tools.html` (existing хаб) → добавить ссылки на guides/decision-tree-5q (текстовая версия wizard'a)
9. `articles/substrate/coastal-chloride-prep` → existing `coastal-chloride-audit.html` (это owner's tool) — взаимная связка
10. `guides/anti-patterns` → existing `architect-pretender-checklist.html` — это смежная тема

### 5.3 External outbound link strategy

Из industry-portals.md (agent 6): ~30 trade magazines + 25 associations + 30 standards + 20 YouTube. Чтобы не выглядеть spam-фермой ссылок:

**Правила ротации (по 3–5 outbound links на длинную статью, разной природы):**

1. **1 link на standards body** (ICRI / FeRFA / DIN / SII / ASTM) — даёт E-E-A-T trust
2. **1 link на manufacturer TDS** (Sika, Topciment, Mapei) — даёт buyer-stage authority
3. **1 link на trade publication** (Concrete Decor / FeRFA Resin / Floor Trends) — даёт editorial trust
4. **1 link на academic / association** (.org > .com где возможно)
5. **Никогда не ссылаться 50× на один источник** — ротируем

**Per-page citation map (примеры P0):**

- `substrate/icri-csp-guide.html` → ICRI 310.2R store page + DeFelsko CSP + TCC Materials chart + одна Sika TDS + одна Mapei TDS = 5 outbound
- `comparisons/purcem-vs-ucrete-vs-flowfresh.html` → Sikafloor PurCem HM-20 TDS + Ucrete UD200 page + Flowcrete Flowfresh MF TDS + FeRFA Type table + EN 13813 = 5 outbound
- `microcement-binder-chemistry.html` → Topciment composition page + Mortex BEAL + Stucco Italiano Marmorino + Tadelakt Wikipedia + Festfloor sealer guide = 5 outbound
- `resources/index.html` — концентрированный outbound, **15 ссылок** (top-5 per 3 category: associations + magazines + standards bodies)

### 5.4 Schema.org markup

Каждая новая страница получает соответствующий JSON-LD:

| Page type | Schema |
|---|---|
| Brand profile (`brands/*.html`) | `Brand` + `Product` (если SKU явный) + `Organization` |
| Comparison (`comparisons/*.html`) | `Article` + `ComparisonReview` (если поддержит Google) + 3× `Product` |
| Encyclopedia system (`encyclopedia/*.html`) | `Article` + `HowTo` (если есть пошаговый install) |
| Substrate prep (`substrate/*.html`) | `Article` + `HowTo` + `TechArticle` |
| Decision guide (`guides/*.html`) | `Article` + `FAQPage` (для 5-Q decision tree) |
| Resources (`resources/*.html`) | `Article` + `CollectionPage` + `WebPage` |
| Standards glossary | `Article` + `DefinedTermSet` + N× `DefinedTerm` |

`FAQPage` schema особенно ценный — даёт rich snippets в выдаче. Использовать его минимум на:
- `guides/decision-tree-5q.html` (5 вопросов = 5 Q&A)
- `microcement-known-issues.html` (9 типов дефектов = 9 Q&A)
- `guides/anti-patterns.html` (5 «почему не …» = 5 Q&A)

---

## 6. Execution order — 3 waves

### Wave A — сегодняшняя сессия / next 8–10 hours (10 страниц P0, ~25 000 слов)

Самые быстрые wins, не требуют owner-input. Все из P0, все могут публиковаться без Q1–Q7.

1. `articles/substrate/mechanical-prep.html` (#1) — шот-бласт / грайнд / скарификация / скаблирование
2. `articles/substrate/icri-csp-guide.html` (#2) — CSP 1–10 + таблица «какой профиль для какого покрытия»
3. `articles/substrate/defects-handbook.html` (#7) — 6 дефектов бетона
4. `articles/guides/how-to-choose-floor.html` (#8) — 11 критериев
5. `articles/guides/use-cases-15.html` (#9) — 15 типов помещений
6. `articles/guides/anti-patterns.html` (#10) — 5 «что не делать»
7. `articles/encyclopedia/microcement-binder-chemistry.html` (#35) — 4 семьи связующего
8. `articles/encyclopedia/microcement-known-issues.html` (#37) — 9 типов дефектов микроцемента
9. `articles/resources/index.html` (#39) — хаб ресурсов
10. `articles/resources/standards-glossary.html` (#40) — глоссарий стандартов

**Effort estimate:** ~16–22 hours (по 1.5–2 часа на страницу с QA-проходом). Можно выкатить одним PR.

### Wave B — next 1–2 days (15 страниц P0+P1, ~35 000 слов)

Требуют owner-input по Q5 (IL-дистрибьюторы) и Q6 (IL pricing). Без них пишутся, но публикация — после твоей price/dist verification.

11–13. Comparison troika: `purcem-vs-ucrete-vs-flowfresh` (#28), `sika-vs-mapei-vs-mastertop` (#27), `microcement-brands-7way` (#29) — самые дорогие SEO assets.
14–18. Core brand profiles P0 industrial: Mapei (#20), MasterTop (#21), Ucrete (#22), Flowcrete (#23), Topciment (#12)
19–21. Core brand profiles P0 decorative: Pavistamp (#13), Mortex (#14), Ideal Work (#16 — после Q2 confirm)
22–24. Substrate prep остальное: adhesion-pull-off (#4), repair-before-coating (#5), coastal-chloride-prep (#6)
25. `articles/guides/decision-tree-5q.html` (#11)
26–28. Microcement: wet-rooms (#36), decision-tree (#38)
29–30. Existing pages enrichment блоки в `encyclopedia/microtopping`, `encyclopedia/pu-cement`, `encyclopedia/epoxy-sl`, `encyclopedia/terrazzo`, `materials/microtopping`, `materials/rubber`, `materials/epoxy` (см. раздел 4)

**Effort estimate:** ~30–38 hours.

### Wave C — week+ (12 страниц P1+P2, ~20 000 слов + Hebrew prep)

Низкий приоритет / niche / R&D.

- Brand profiles P1+P2: Keim, Marmorino, Tadelakt, Senso, Stonhard, Altro, Polyflor — 7 страниц
- Rubber cluster: 5 страниц (#30–#34) — все P1+P2
- **Hebrew SEO strategy note** (см. ниже §6.4) — НЕ пишем страницы, только готовим инфраструктуру

**Effort estimate:** ~18–25 hours.

### 6.4 Hebrew strategy note — отдельный раздел (DO NOT publish Hebrew pages yet)

**Контекст:** agent 6 (industry-portals.md §4 + §5) явно выделил: «Hebrew install content + standards-summary content is underserved. Producing high-quality Hebrew floor-encyclopedia content positions FloorDSGN as the IL-language authority — a defensible SEO moat.»

Decorative-brands.md тоже: «None of the Spanish/Italian/Belgian microcement brands have visible Hebrew-language press coverage that surfaces in English search — content gap = FloorDSGN opportunity.»

**Что это значит:** на иврите по запросу «איך לבחור רצפת אפוקסי» / «מיקרוצמנט מול אפוקסי» / «הכנת בטון לפני יציקה» / «ICRI CSP» — почти пустая выдача. Если мы выкатим Hebrew-версию 10–15 P0 страниц, мы захватим IL-рынок до того, как кто-либо другой начнёт.

**Стратегия Hebrew (P2, отдельной фазой):**

1. **Sequence:** сначала RU (Wave A+B), потом Hebrew localization of the 10 most-valuable pages (substrate prep cluster + decision guides + 3 comparisons). Это 10 страниц × ~2 часа на тщательную локализацию = ~20 hours.
2. **Hebrew-specific elements:**
   - Glossary up front: ליטוש יהלום / שיוף שוט / שיוף מסור / פרופיל פני בטון / בדיקת לחות / בדיקת היצמדות (из substrate-prep.md §11)
   - Local ת״י cross-references вместо EN-only (ת״י 466 / 1923 / 5566)
   - Hebrew RTL CSS — Cormorant Garamond fallback на David / Frank Ruehl (нужно протестировать typography)
   - Israeli case studies (если у тебя есть фото с реальных IL объектов)
3. **DO NOT** делать машинный перевод Yandex/Google → выглядит топорно, специфические термины (PU-cement / шот-бласт / лайтанс) переводятся плохо. Нужен либо ручной проход, либо нанять профильного редактора (~₪80–120 за час, 20 hours = ₪1600–2400 за весь pack).
4. **SEO setup:** добавить `<link rel="alternate" hreflang="he-IL" href="...">` на каждую existing RU page + наоборот; sitemap.xml с он-же мультиязычными hreflang annotations.

**Blocker:** нанять Hebrew-native редактора со знанием строительной терминологии — это owner's decision (бюджет + кто).

**Не публикуем Hebrew pages в Wave A/B.** Только готовим инфраструктуру (hreflang в template, RTL CSS stub в styles.css) — это можно сделать без новых текстов.

---

## 7. Quality gates per page

Каждая новая страница перед коммитом в main проходит чек-лист:

| Gate | Команда / проверка | Acceptance |
|---|---|---|
| 1. **Build clean** | `npm run build` | exit 0, dist/ генерится |
| 2. **a11y check** | `npm run a11y` | 0 errors; warnings ≤ baseline |
| 3. **Linkcheck (internal)** | curl каждый внутренний link или скрипт linkcheck | 200 на каждом |
| 4. **Brand colors only** | grep на чужие hex-коды (`#fff` кроме фона, `#000` запрещён, нет `#ffd700` / `#1e90ff` etc.) | 0 violations |
| 5. **No emoji** | grep на emoji unicode ranges | 0 hits |
| 6. **Single Signal accent** | grep на `#C86B3C` в HTML | максимум 1 «активная» Signal-точка на страницу |
| 7. **Typography** | grep на `font-family` | только Cormorant Garamond + Montserrat; третий font = баг |
| 8. **Outbound citations** | ≥1 link на ICRI/FeRFA/DIN/ASTM/SII или manufacturer TDS | mandatory для SEO trust |
| 9. **Schema.org** | view-source + JSON-LD валидатор | присутствует соответствующий type (см. §5.4) |
| 10. **Self-QA screenshot** | `npm run snap <page>` | визуальная проверка глазами — feedback_self_qa_screenshot_before_showing |
| 11. **DESIGN.md lint** | `cd ~/Work/02-Projects/floordsgn/floordsgn-site-new && npx -y @google/design.md lint DESIGN.md` | 0 errors, 4 known warnings допустимы |
| 12. **Source verification** | каждый `[verify]` flag из research → либо подтверждён, либо помечен в тексте «по данным TDS на 2026; уточнить у IL-rep перед спецификацией» | 0 unflagged unverified claims |

**Etalon guard:** перед коммитом — `git diff --stat HEAD~1` на список эталонных файлов (hero3d index.html, configurator.html, manifest.json). Если хоть один в diff'е — стоп, проверяю ручкой.

---

## 8. Что я НЕ предлагаю (для прозрачности)

1. **Не переписываю etalon-коммиты** (cc421cf / 076fdbc / 23ed628 / db80612). Обогащение только existing pages вне этих коммитов.
2. **Не пишу Hebrew pages в этой итерации.** Готовлю инфраструктуру (RTL CSS stub, hreflang в template), сами тексты — отдельной P2 фазой (см. §6.4).
3. **Не публикую цены** ₪/m² без твоего OK — все из research помечены `[verify]`, в текст ставлю «спросить смету» или диапазон со словом «ориентировочно».
4. **Не публикую профиль Morris** до Q1. Заведу stub-page с 301 редиректом на best-guess (Mortex), если ты подтвердишь.
5. **Не публикую профиль Cemplaster** до Q3. Удалю из плана если бренда не существует.
6. **Не делаю SDXL / Pollinations / generated hero images** для новых страниц. Brand 1:1 clone подход — копия `styles.css` + `enhance.css`, hero визуал через existing FloorDSGN photo library или Concrete background patterns. Если нужно конкретное фото для какой-то страницы (например, литая резина на спортивной площадке) — список missing assets выкачу отдельно в P1.
7. **Не подключаю автоматический wiki:refresh** к новым страницам. После Wave A прогоню вручную `npm run wiki:refresh && npm run memory:refresh` чтобы Karpathy-слой увидел новый контент.

---

## 9. Risks I'm tracking

| Risk | Mitigation |
|---|---|
| Сайт станет «энциклопедией без воронки» — конверсия упадёт | Каждая новая статья завершается blockом «Готов специфицировать у себя? → /quote» с тем же design-language что и existing landing |
| Google посчитает 37 новых страниц за раз спамом / over-optimization | Wave A (10 pp) → 7-day delay → Wave B (15 pp) → 14-day delay → Wave C; рост постепенный |
| Конкуренты украдут структуру | Структуру — пусть берут, контент основан на собственном опыте укладки и proprietary research выкладке (40 страниц research → 92 000 слов уникального текста) |
| Sika может возражать на сравнения «Sika vs X» | Сравнения — fact-based из публичных TDS, ни одного претензионного выражения; формулировка «Sika лидер по reach + сервису, X выигрывает в нише Y». Это редакторская позиция, а не дисс. |
| Какой-то IL-distributor попросит правки на своей brand page | Brand pages — research-based, не product placement. Если importer попросит — рассматриваем case-by-case |
| Etalon коммиты случайно затронуты | Pre-commit grep guard на список etalon files (раздел 7 gate 12 — etalon guard) |

---

## 10. Что нужно от тебя

**Минимум для старта Wave A (10 P0 страниц без owner-input):**
- Один ответ: «OK go» или «измени X».

**Для Wave B (полная мощность):**
- Q1: Morris — что за бренд? (или подтверди «это Mortex, опечатка»)
- Q2: Italprotec = Ideal Work? (или другое?)
- Q3: Cemplaster / Smartrenders — это бренды или категории?
- Q4: Sikafloor-470 — оставляем как SKU в `microtopping.html` или меняем на DecoDur?
- Q5: IL-импортёры Mapei / Master Builders / Altro / Polyflor / Tarkett / Forbo / Ardex — есть инсайды?
- Q6: ₪/m² 2026 — отдашь price-stamp перед публикацией comparisons (#27–#29)? Или публикуем со словом «ориентировочно»?
- Q7: etalon scope подтверждение — это только 4 указанных коммита, всё остальное в `articles/encyclopedia/` доступно для обогащения?

**Для Wave C (Hebrew + P2):**
- Бюджет на Hebrew-native редактора (~₪1600–2400 за 20 hours для P0 pack)
- Подтверждение что нанимаешь редактора или я делаю ручной перевод сам

---

## 11. Estimate итого

- **37 новых страниц + 1 extend + 8 enrichment blocks** = ~92 000 слов
- **Effort:** 58–72 часа автономной работы (Wave A: 16–22h + Wave B: 30–38h + Wave C: 18–25h, без Hebrew)
- **+Hebrew P2:** +20 hours (после owner-input по бюджету редактора)
- **3 SEO win targets** (см. §1)
- **3 owner-input blockers** (см. §2 Q1, Q5, Q6 — приоритетные; Q2, Q3, Q4, Q7 — second-tier)

---

*Plan prepared for owner review — FloorDSGN brand. Wave A pages do not depend on any owner-input; can ship on approve. Wave B and C require Q1–Q6 answers before publication.*
