# Floor.DSGN — Supplier Outreach Briefs

**Дата:** 2026-05-28
**Источник:** background-agent web research (public sources, see commit b8aeac7) + hostile-review supplier-meeting readiness (§4 of [COMBINED_RESEARCH_REPORT.md](COMBINED_RESEARCH_REPORT.md)).

Per-supplier outreach packages — каждый бриф готов к отправке с заранее проделанной разведкой (TDS URLs, IL-каналы, сертификаты, разрыв данных). Цель: получить письменное разрешение на бренд + полные TDS/SDS для перехода `displayMode: candidate-placeholder` → `displayMode: full`.

---

## 1. Mapei S.p.A. — Italy

**Internal id:** `mapei` (suppliers.json) · публично: `Supplier Candidate 1 — Decorative & Repair`

**IL канал — НЕ найден для индустриальной/декоративной линии.** Только tile-grout-sealant дистрибьюторы (Negev Group, Amrusi, Saadon) — это не наш target.

**Уже идентифицированные продукты-кандидаты:**
| Продукт | Категория | TDS URL |
|---|---|---|
| Mapefloor I 300 SL | Industrial self-leveling epoxy (≈Sikafloor 263 SL) | [Mapefloor I 300 SL PDF](https://cdnmedia.mapei.com/docs/librariesprovider29/products-documents/1_mapefloor-i-300-sl_tds_bg_39b886067a5948de81032b8dd2a75b07.pdf) |
| Ultratop Loft F | Cementitious decorative microtopping (floor) | [Ultratop Loft F](https://www.mapei.com/it/en/products-and-solutions/products/detail/ultratop-loft-f) |
| Ultratop Loft W | Wall microtopping | [Ultratop Loft W](https://www.mapei.com/it/en/products-and-solutions/products/detail/ultratop-loft-w) |

**Сертификации public:** CE EN 13813, CE EN 1504-2, EC1 Plus (per-product, verify), ISO 9001/14001.

**Что просим у Mapei:**
1. Подтверждение Israeli distributor для Mapefloor / Ultratop Loft линии (если есть — может это Tambour?)
2. Письменное разрешение на использование бренда + product names в Floor.DSGN
3. Полный TDS + SDS на 3 продукта выше
4. Изображения продуктов высокого разрешения
5. Чек-лист сертификатов: EN 1186, EU 10/2011 (food contact), Slip DIN 51130 R-class per product

**Открытия в текущей платформе:** Mapei упомянут в `PROJECT_PLAN.md L140` как applicator — нужна история этого упоминания, если есть формальная договорённость.

---

## 2. MC-Bauchemie — Germany

**Internal id:** `mc-bauchemie` · публично: `Supplier Candidate 2 — Industrial Epoxy/PU`

**IL канал — ✅ НАЙДЕН:**
> **A.Z Marketing Ltd.** · PO Box 1010, Ramle 72120 · **+972-8-9150190**
> Listed на MC worldwide locations page. Scope (полный MC-DUR диапазон или только repair mortars) требует прямого подтверждения.

**Идентифицированные продукты:**
| Продукт | Категория | TDS URL |
|---|---|---|
| MC-DUR 1320 VK | Transparent epoxy car-park/industrial | [TDS PDF](https://www.mc-bauchemie.com/assets/downloads/products/en/technical_datasheet/MC-DUR_1320_VK_DE_DE_EN_TDS.pdf) |
| MC-DUR PowerCoat | Heavy-duty industrial coating, chem+mech to 120°C | [Product page](https://www.mc-bauchemie.com/products/floor-coatings/coatings/mc-dur-powercoat-cat.html) |
| MC-DUR TopSpeed SC | KineticBoost rapid-cure primer/coating | [TDS PDF](https://mcbifi-bauchemie.com/wp-content/uploads/2024/02/TDS_MC-DUR-TopSpeed-SC_EN-1.pdf) |

**Сертификации public:** CE EN 13813, CE EN 1504-2, AgBB low-emission, ISO 9001/14001.

**Что просим у MC-Bauchemie / A.Z Marketing:**
1. Подтверждение полного scope A.Z Marketing — все MC-DUR + MC-Floor или только subset?
2. Письменное разрешение на бренд + product names
3. Полные TDS + SDS на 3 продукта выше + MC-Floor (PU) если он существует
4. Israeli pricing + MOQ
5. Applicator certification program условия

**Звонок A.Z Marketing — рекомендуется как первое действие.**

---

## 3. Master Builders Solutions / BASF — Germany

**Internal id:** `basf-master-builders` · публично: `Supplier Candidate 3 — Industrial Epoxy/PU`

⚠️ **КРИТИЧЕСКАЯ ИНФОРМАЦИЯ (от агента, верифицировано 2026-05-28):**
> **Sika приобрела MBCC (которая владела Master Builders) в May 2023.**
> MasterTop / MasterEmaco линейки сейчас активно ребрендируются в Sika portfolio.
> Листить MBS как **«альтернативу Sika»** — фактически ОШИБОЧНО.

**Owner-решение (требуется):**
| Option | Действие |
|---|---|
| A | Удалить `basf-master-builders` из suppliers.json — не выходить ни с каким брифом |
| B | Заменить slot на true Sika-independent: **Remmers (DE)** / **Flowcrete (PPG, US/EU)** / **Bautech** / **Sherwin-Williams General Polymers** |
| C | Оставить как historical placeholder с пометкой "now integrated into Sika" |

**Рекомендация:** Option B — Remmers (полная независимая немецкая флор-химия, прямой конкурент Sika).

См. [MBCC product integration page](https://gcc.sika.com/en/mbcc-product-integration.html), [Sika MBCC acquisition news](https://www.sika.com/en/media/insights/sikanews/strong-platform-for-future-growth.html).

---

## 4. Ardex / Pandomo — Germany

**Internal id:** `ardex-pandomo` · публично: `Supplier Candidate 4 — Decorative / Microtopping`

**IL канал — ✅ НАЙДЕН:**
> **Harel v'Idan – Hakol L'Binyan (הראל ועידן הכל לבניין)** · Hamerkava 33, Holon · **058-403-5595**
> Ardex Israel Facebook page lists Rosh Ha'Ayin presence. Scope Pandomo decorative диапазона (vs только tile-substrate Ardex) — требует подтверждения.

**Идентифицированные продукты:**
| Продукт | Категория | TDS URL |
|---|---|---|
| Pandomo K2 / K2 Loft | Cementitious design microtopping (trowel-applied) | [TDS PDF](https://www.ardexamericas.com/wp-content/uploads/ARDEX-PANDOMO-K2-Technical-Data.pdf) · [Spec](https://www.ardexamericas.com/wp-content/uploads/ARDEX-PANDOMO-K2-LOFT-Specification.pdf) |
| Pandomo W1 | Wall design plaster | [TDS PDF](https://www.ardexamericas.com/wp-content/uploads/2018/05/ARDEX-PANDOMO-W1-Technical-Data.pdf) |
| Pandomo Floor / Floor Plus | Polished cementitious floor | [Tech page](https://www.ardex-pandomo.com/en_US/floor-floorplus/technik/technische-daten.html) |

**Сертификации public:** EMICODE EC1 Plus (Pandomo K2), CE EN 13813, sustainability data sheets.

**Existing program:** **Pandomo Certified Applicator / Lizenzpartner network** — training-licensed installers. Спросить про условия для IL.

**Что просим:**
1. Harel v'Idan — реальный scope Pandomo line (или только tile/substrate)?
2. Письменное разрешение на бренд + product names
3. Полные TDS + цветовые палитры Pandomo K2 Loft + W1 + Floor
4. Условия Pandomo Certified Applicator программы для Israel
5. Реальные кейсы IL-объектов (если есть)

**Действие №1:** звонок Harel v'Idan на 058-403-5595.

---

## 5. Kerakoll — Italy

**Internal id:** `kerakoll` · публично: `Supplier Candidate 5 — Eco Decorative`

**IL канал — НЕ найден.** Официальная contacts page Kerakoll и group-locations page не указывают Israel presence. Hebrew-language reseller не surfaced.

**Идентифицированные продукты:**
| Продукт | Категория | TDS URL |
|---|---|---|
| Cementoresina (CR) | 2-comp eco-resin floor, coloured-through | [TDS PDF](https://media.kerakoll.com/Sito_Web/techSheet/International/0_Design/Cementoresina%201_2024_en.pdf) |
| Cementoresina Wall | Cement-resin wall coating | [TDS PDF](https://media.kerakoll.com/Sito_Web/techSheet/International/0_Design/Cementoresina%20Wall%20CC_2024_en.pdf) |
| Wallcrete | Water-based resin for wet rooms | [Product page](https://int.kerakoll.com/p/wallcrete) |

**Сертификации public:** GreenBuilding Rating + EPDs, CE EN 13813, EMICODE EC1 Plus / GEV-EMICODE, B-Corp.

**Existing program:** **Kerakoll Design House** applicator-certification + showroom-partner network — Italy/EU-focused.

**Что просим у Kerakoll напрямую:**
1. Israeli importer — есть ли план открыть IL канал?
2. Условия импорта direct from Italy (для project-specific case)
3. Письменное разрешение на бренд + product names
4. Полные TDS + EPDs для Cementoresina линейки
5. Kerakoll Design House — условия для Israeli applicator

---

## 6. StoCretec — Germany

**Internal id:** `stocretec` · публично: `Supplier Candidate 6 — Concrete Protection / Industrial`

**IL канал — НЕ найден.** Sto country-dropdown lists Israel но без named representative. sto.co.il — несвязанный computer retailer. Tambour-Sto licensing rumours не подтверждены.

**Идентифицированные продукты:**
| Продукт | Категория | TDS URL |
|---|---|---|
| StoPox WL 100 | 2-comp water-based industrial epoxy | [TDS PDF](https://www.stocretec.de/webdocs/0000/SDB/techdoc_out_renamed/TechnicalDataSheet_StoPox_WL_100_0101_EN_00_00.PDF) |
| StoPox KU 601 | 2-comp epoxy floor sealer | [TDS PDF](https://stocretec.no/wp-content/uploads/2020/02/StoPox-KU-601_TDS_en.pdf) |
| StoPox WHG Deck 100 | Self-levelling, water-pollutant containment | [TDS PDF](https://www.sto-sea.com/media/documents/download_broschuere_1/01__floor_coating/03__self_levelling/StoPox_WHG_Deck_100_TD_SE_1911_RV_03.00.pdf) |

**Сертификации public:** AgBB, GISCODE, CE EN 13813, CE EN 1504-2, WHG (DE water pollution control), Sustainability Data Sheets.

**Existing program:** **Sto Verarbeiter** certified-applicator program — DE/EU.

**Что просим у Sto Germany напрямую:**
1. Israeli representative — есть ли план или только project-by-project import?
2. Условия Sto Verarbeiter program для IL applicator
3. Письменное разрешение на бренд + product names
4. Полные TDS + WHG-сертификаты
5. Реальные индустриальные кейсы (EU/UK) — для нашего портфолио

---

## Контрольный список действий

- [ ] **Сначала позвонить:** A.Z Marketing (MC-Bauchemie, +972-8-9150190) и Harel v'Idan (Ardex/Pandomo, 058-403-5595)
- [ ] **Owner-решение:** Master Builders Solutions slot — option A / B / C (см. §3)
- [ ] **Email брифы** (используя выше структуру) → Mapei, Kerakoll, StoCretec
- [ ] **Юр.часть** — подготовить шаблон Brand-Usage Permission Letter (для подписи поставщиками)
- [ ] **Юр.часть** — определить как храним конфиденциальные TDS (NDA нужен?)
- [ ] **После получения разрешений** — поменять `displayMode: candidate-placeholder` → `full` для соответствующих suppliers + обновить materials с реальными product names + загрузить TDS PDFs в `documents/`
