# Аудит расхождений: 3D конфигуратор ↔ страницы сайта ↔ статьи

**Дата:** 2026-05-12
**Ветка:** `feature/encyclopedia-2026-05-12`
**Источник правды конфигуратора:** `3d-assets/manifest.json` v2.06 (10 систем)
**Сканировано на сайте:** ~30 системных страниц + 4 фэмили-обзоры + `compare.html` + статьи

---

## SPRINT 0 STATUS — 2026-05-12 (по итогам дня)

**13 коммитов на ветке `feature/encyclopedia-2026-05-12`**, проведена тактическая правка + интеграция findings внешнего стратегического аудита (`_external/EXTERNAL_AUDIT_2026-05-12.md`).

| commit | задача |
|---|---|
| `ddd1561` | mobile HUD overlay labels убраны (configurator.html) |
| `7e617b9` | manifest specs приведены к sales-страницам (8 систем, SKU/cure/temp) |
| `23ed628` | ComfortFloor добавлен в manifest, паркет убран |
| `0cfc4a8` | fake testimonials + пустые projects + ESL «Quality» удалены из home |
| `7a41b3f` | index.html SEO: canonical→netlify, lang→ru, fake Schema rating убран |
| `d6c8c35` | translations.js: RU дефолт для новых посетителей + browser-lang detect |
| `d89c647` | site-wide cascade canonical+lang по 80 страницам |
| `bf23840` | nav canonical: убраны Home/Blog links, About Us → About |
| `c7be1c5` | configurator → /quote + /contact bridges починены (URL params) |
| `7323385` | 17 orphan spec keys в materials/epoxy.html переведены |
| `53143d8` | hero3d + picker + sticky-CTA обёрнуты в data-i18n, EN+RU keys |
| `eb01f75` | dead `js/i18n.js` + `css/i18n.css` удалены (broken default `he`) |
| **тег** | `audit-fix-etalon-2026-05-12` помечает commit `23ed628` |

### Оценки до → после

| категория (из EXTERNAL_AUDIT) | начальная | после Sprint 0 |
|---|---|---|
| Brand / numbers canon | 48/100 | **~80** |
| Language system (EN toggle работает на hero) | 32/100 | **~65** |
| Information architecture (один nav, без Blog) | 54/100 | **~75** |
| Proof / trust (фейк удалён) | 28/100 | **~75** |
| Copy / tone (без ESL) | 58/100 | **~70** |
| SEO / tech (canonical, hreflang, OG, Schema чистый) | 38/100 | **~80** |
| Conversion funnel (configurator → quote bridge) | 42/100 | **~70** |

### Done — что закрыто полностью

- ✅ Spec lies от manifest (PU-cement ±150°C → −40…+120°C; epoxy-terrazzo cure 72ч → 7-10 дней; цены terrazzo 2-4× подняты до installed)
- ✅ Trust-killers (fake testimonials, empty projects, ESL copy)
- ✅ Number canon (9/10+/Six/8 → 10/10/8 единый канон)
- ✅ SEO base (canonical, hreflang, OG image, Schema.org без фейк rating)
- ✅ Nav canonical (без Home/Blog redundancy)
- ✅ i18n default (RU primary с browser-lang detect)
- ✅ Hero3d i18n coverage (EN toggle работает)
- ✅ Funnel bridge configurator → quote/contact

### Deferred — отложено осознанно

| что | причина |
|---|---|
| Меда декоративи sales page | Требует editorial-голоса владельца (per memory) |
| Restoration в configurator picker | Different UX flow (renovate vs design) — есть свои страницы /floors/restoration/* |
| Реальные кейсы с метриками | Отдельный комплекс материалов (фото/видео — пользователь сам сформирует) |
| Heb stack + RTL | Sprint 1, нужен native proofreader |
| Sample-kit real form (Israel Post API + tracking) | Sprint 1, требует фулфилмент-партнёра |
| Domain decision (floor.design / .com) | Решение владельца |
| Corporate email (hello@) | Решение владельца, ждёт регистрации домена |
| materials.config.json sync с manifest.json | Отдельная задача, не блокирует launch |
| Статьи unification (1-3 мм micro / 6-10 мм epoxy-terrazzo) | Editorial work, требует владельца |

### IG-launch readiness

После Sprint 0 главная страница (`index.html`) готова к первому показу:
- 3D-конфигуратор как hero, всё на русском, все цифры правдивы
- Canonical/OG metadata — share-карточка в IG будет рендерить правильно
- Funnel работает: configurator → quote с pre-filled material
- Trust-killers ушли, ничего фальшивого не светится

**Что нужно перед IG-постом (на стороне владельца):**
1. iPhone 14 Pro ручная проверка после netlify ребилда
2. Реальный пост-копи для caption
3. Возможно: 1-2 настоящих кейса с метриками (необязательно, можно после)

---

---

## TL;DR — масштаб проблемы

Конфигуратор и сайт описывают **разные продуктовые линейки**. Это не «опечатки в цифрах» — это структурное расхождение:

1. **Конфигуратор знает 10 систем; сайт продаёт ~25 систем**. Половина страниц сайта вообще не представлена в конфигураторе. Категория «Реставрация» (4 страницы) отсутствует целиком. Подсистемы эпокси (6 страниц), резины (4), PU-cement (4), MMA (3), микротопинга (3) — в конфигураторе свёрнуты в одну точку каждая.
2. **Цены в конфигураторе систематически занижены или завышены** на 1.5–4×. Терраццо особенно: конфигуратор ₪520–980, сайт ₪1400–3500.
3. **SKU конкретных продуктов Sika не совпадают.** Конфигуратор называет одни артикулы, сайт — другие.
4. **Толщины расходятся** в большинстве систем (terrazzo, micro, mma, pu-cement).
5. **Cure-time расходится фундаментально**: конфигуратор у эпокси-терраццо пишет «24ч/72ч», сайт — «7–10 дней».
6. **Гарантии не совпадают** (terrazzo-cement: 20 лет vs 10 лет; microtopping: 7 vs 5 лет).
7. **«Паркет»** есть в конфигураторе, но НИ ОДНОЙ страницы паркета на сайте нет (orphan).
8. **Конфигуратор использует «материалы» как родовые ярлыки**, а сайт — как конкретные SKU-системы. Это два разных уровня абстракции.

**Стратегический вопрос:** что чинить — конфигуратор подтягивать к сайту, или сайт переписывать под конфигуратор. Моё чтение: сайт — это источник правды для продаж (детальные SKU + реалистичные цены + правильные cure-time), значит конфигуратор должен быть переписан под структуру сайта. Но это решение оунера.

---

## Часть 1. По-системные расхождения (детальная дельта)

### 1.1. TERRAZZO

#### Конфигуратор (`manifest.json`):

| slug | thk | базис | cure | warr | price | substrate |
|---|---|---|---|---|---|---|
| `terrazzo-cement` | **20 мм** | цементная смесь | **7 сут / 28 сут** | **20 лет** | **₪450—780** | C25/30 ≥ 25 МПа |
| `terrazzo-multi` | **12 мм** | эпокси (Sikafloor-264) | **24ч / 72ч** | 10 лет | **₪520—980** | C25/30 ≥ 25 МПа |
| `terrazzo-epoxy` | **12 мм** | эпокси (Sikafloor-264) | **24ч / 72ч** | 10 лет | **₪480—820** | C25/30 ≥ 25 МПа |

#### Сайт (`/floors/terrazzo/*`, `compare.html`):

| страница | thk | SKU | cure | warr | price |
|---|---|---|---|---|---|
| `terrazzo/epoxy.html` | **12–18 мм + 2 мм crack-iso** | **Sikafloor Terrazzo EM-10** | **7–10 дней** | 10 лет | **₪1400/м²+** |
| `terrazzo/mineral.html` | **12–18 мм** | **Sikafloor Terrazzo CS-31** | **10–14 дней** | 10 лет, 30+ срок | **₪1000/м²+** |
| `terrazzo/venetian.html` | НЕ ПРОЧИТАНА АГЕНТОМ | — | — | — | — |
| `terrazzo/palladiana.html` | НЕ ПРОЧИТАНА АГЕНТОМ | — | — | — | — |
| `compare.html` venetian | **15–25 мм** | **CS-31** | **14–21 день** | 10 лет, 50+ срок | **₪1800–3500** |
| `compare.html` epoxy | 12–18 мм | EM-10 | 7–10 дней | 10 лет | ₪1400–2400 |

#### Дельта (что чинить):

- **Цены** — конфигуратор занижен в 2–4×:
  - `terrazzo-epoxy` ₪480–820 vs реальные ₪1400–2400 (compare). **Critical**.
  - `terrazzo-cement` ₪450–780 vs venetian ₪1800–3500. **Critical**.
- **Cure-time** — конфигуратор сильно врёт:
  - Эпокси-терраццо: 72ч полное vs 7–10 дней по сайту. **Off by 7×**.
  - Цементное: 28 сут совпадает, но walk-on 7 сут vs venetian 14–21 день. Off by 2–3×.
- **SKU топкоата** — конфигуратор пишет `Sikafloor-264` (это generic эпокси-роллер), сайт указывает дедикейтид `Sikafloor Terrazzo EM-10` (для эпокси-терраццо) и `CS-31` (для цементного). **SKU неправильный**.
- **Гарантия** — `terrazzo-cement` в конфигураторе 20 лет, на сайте 10 лет (срок службы 30+). Конфигуратор объединяет «гарантию» и «срок службы».
- **Толщина** — конфигуратор фиксированно 20 мм / 12 мм, сайт диапазоны 12–18 мм / 15–25 мм. Нужно ИЛИ диапазоны в конфигураторе, ИЛИ перевести сайт на фиксированные.
- **Crack-isolation 2 мм** на сайте есть, в конфигураторе buildup это не отражено.
- **terrazzo-multi vs terrazzo-epoxy** — в конфигураторе два разных слага с почти одинаковыми спеками. Это либо namespace clash, либо нужно объяснить разницу. Сайт такого разделения не имеет.
- **palladiana и venetian** — на сайте отдельные страницы; в конфигураторе их нет.
- **mineral terrazzo** — отдельная страница на сайте; в конфигураторе `terrazzo-cement` *похож*, но binder указан «цементная смесь» (правильно «CEM I + полимерные добавки» по сайту).

---

### 1.2. EPOXY

#### Конфигуратор:

| slug | thk | базис | cure | warr | price |
|---|---|---|---|---|---|
| `epoxy` | **2–3 мм** | Sikafloor-263 SL + Sikafloor-264 + Sikafloor-156 | **24ч / 72ч** | 10 лет | **₪280—520** |

#### Сайт — **6 (!) подсистем**:

| страница | thk | SKU | cure | warr | price |
|---|---|---|---|---|---|
| `epoxy/anti-static.html` | 2–3 мм | Sikafloor-161 primer + AS body | 4–6 дней | 5 лет | ₪410+ |
| `epoxy/decorative.html` | 3–6 мм | DecoDur Metallic FX / EB-Flake + Sikafloor-161 + Sikafloor-169 | 6–8 дней | 10 лет | ₪720–1500 |
| `epoxy/esd-conductive.html` | 2–3 мм | Sikafloor-220 W + copper grid + Sikafloor-262 AS N | 6–8 дней | 10 лет | ₪590+ |
| `epoxy/seal-coat.html` | 0.5–1.5 мм | Sikafloor-264 ×2 + Sikafloor-161 | 2–3 дня | 5 лет | ₪165+ |
| `epoxy/self-leveling.html` | 3–5 мм (typ 4) | Sikafloor-263 SL + Sikafloor-156 primer | 12ч walk / 24ч light / 7 дней forklift | 10 лет | ₪400+ |
| `epoxy/troweled-hbs.html` | 6–12 мм | Sikafloor-381 ECF + Sikafloor-156 + Sikafloor-264 | 5–7 дней | 10 лет | ₪480+ |

#### Дельта:

- **Конфигуратор сводит 6 систем в одну точку «epoxy»**. У него thk 2–3 мм, что соответствует только anti-static/esd, но SKU указан Sikafloor-263 SL (это self-leveling), а толщина SL = 3–5 мм. **Внутренний конфликт**: «collapse» сделан некорректно, спеки взяты из разных систем и собраны в frankenstein.
- **Cure** — 24ч/72ч соответствует seal-coat, но не SL (7 дней до полной нагрузки).
- **Primer SKU** — конфигуратор пишет Sikafloor-156 для эпокси; сайт SL подтверждает Sikafloor-156, но anti-static/decorative/seal-coat/ESD используют Sikafloor-161 / Sikafloor-220 W. **SKU неправильный для половины систем**.
- **Цена** — ₪280–520, но реально самая дешёвая epoxy = seal-coat ₪165, остальные ₪400–1500. Диапазон конфигуратора не соответствует ни одной отдельной подсистеме.
- **Гарантия** — конфигуратор 10 лет; сайт = 5 лет на seal-coat и anti-static, 10 лет на остальные. Усреднение прячет реальность.

---

### 1.3. MICROTOPPING

#### Конфигуратор:

| slug | thk | buildup | cure | warr | price |
|---|---|---|---|---|---|
| `microtopping` | **3 мм** | Sikafloor-156 primer 0.3 + 2×1 мм микроцемент + fibreglass mesh 4×4/60г/м² + PU-защита 2 слоя | **48ч / 7 сут** | **7 лет** | **₪280—520** |

#### Сайт:

| страница | thk | SKU | cure | warr | price |
|---|---|---|---|---|---|
| `microtopping/standard.html` | **2–3 мм** (2 слоя × 1.2 мм + sealer) | **Sikafloor-470 Level + ProSeal-22** | **5–6 дней** | **5 лет** | **₪500+** |
| `microtopping/walls.html` | 1.5–2 мм | стеклосетка обязательно | 3–5 дней | 5 лет (wet: 3 года) | ₪450+ |
| `microtopping/wet-rooms.html` | 2–3 мм + 1–2 мм гидроизоляция (SikaProof/Igolflex) | 2K PU | 7–9 дней | 5 лет hydro + 3 года финиш | ₪700+ |
| `compare.html` | 2–3 мм | Sikafloor-470 Level + ProSeal-22, >30 МПа, ≤75% RH | 5–7 дней | 5 лет | ₪500–900 |

#### Дельта:

- **Primer SKU неправильный.** Конфигуратор: `Sikafloor-156` (это эпокси-праймер общего назначения). Сайт: `Sikafloor-470 Level` (специфичный для микротопинга). **Critical**.
- **Толщина слоёв** — конфигуратор `2 × 1 мм`, сайт `2 × 1.2 мм`. Total: 2 мм vs 2.4 мм.
- **Sealer** — конфигуратор: `PU-защита · 2 слоя · матовая` (generic); сайт: `ProSeal-22 · 2 слоя` (конкретный SKU).
- **Гарантия** — 7 лет (конфигуратор) vs 5 лет (сайт). **Завышение на 2 года**.
- **Cure** — конфигуратор 48ч walk / 7 сут full; сайт 5–6 дней walk-on (другая формулировка). Сайт компактнее.
- **Цена** — конфигуратор ₪280–520; сайт ₪500–900. **Занижение в 1.5–2×**.
- **Mesh** — конфигуратор указывает спеку (4×4 мм, 60 г/м²); сайт standard mesh не упоминает (только walls и wet-rooms требуют сетку).
- **Подварианты walls / wet-rooms** не отражены в конфигураторе вообще.

---

### 1.4. CONCRETE — **САМОЕ КРУПНОЕ РАСХОЖДЕНИЕ**

#### Конфигуратор:

| slug | thk | базис | cure | warr | price |
|---|---|---|---|---|---|
| `decorative-concrete` | **40—80 мм** | цементная смесь («Меда декоративи») | 7 сут / 28 сут | 25 лет | **₪650—1200** |

#### Сайт:

| страница | thk | продукт | cure | warr | price |
|---|---|---|---|---|---|
| `concrete/cream.html` | **0.5–1 мм removed** (полировка skin) | MetalTop-300 + ProSeal-22 | 2–3 дня | 5 лет на sealer | от ₪220 |
| `concrete/salt-pepper.html` | 1–2 мм removed | MetalTop-300 + ProSeal-22 | 3–4 дня | 5 лет на sealer | от ₪290 |
| `concrete/full-aggregate.html` | 2–3 мм removed | MetalTop-300 + ProSeal-22 | 4–5 дней | 5 лет sealer / 30+ срок | от ₪380 |
| `compare.html` Polished | **0 мм added** (полировка plate) | MetalTop-300 + ProSeal-22 | 3–5 дней | 5 лет | ₪220–380 |

#### Дельта:

**Это два совершенно разных продукта**, перепутанных в одной категории:

- Конфигуратор продаёт **новую заливку 40–80 мм** («Меда декоративи» = декоративный бетон с цветным портландом, IL-термин).
- Сайт продаёт **полировку существующей плиты** (0–3 мм снято с поверхности).
- **На сайте нет страницы про новую заливку декоративного бетона**.
- **В конфигураторе нет полированного бетона** (cream / salt-pepper / full-aggregate).

**Цена расходится в ~4×**: ₪650–1200 конфигуратор vs ₪220–380 сайт. Это объяснимо (разные работы), но клиент увидит несоответствие.

**Решение (требует оунера):** либо
- (а) добавить отдельную страницу `/floors/concrete/decorative-cast.html` под «Меда декоративи» и оставить в конфигураторе как есть,
- (б) удалить `decorative-concrete` из конфигуратора и заменить на 3 полированных варианта,
- (в) переименовать `decorative-concrete` → `polished-concrete` и переписать buildup.

---

### 1.5. RUBBER

#### Конфигуратор:

| slug | thk | buildup | cure | warr | price |
|---|---|---|---|---|---|
| `rubber` | **8–15 мм** | EPDM-крошка + PU-связующее + PU-Primer | 24ч / 48ч | 8 лет | **₪220—420** |

#### Сайт — **4 подсистемы**:

| страница | thk | продукт | cure | warr/lifespan | price |
|---|---|---|---|---|---|
| `rubber/comfortfloor.html` | 7–8 мм total | Sikafloor-161 + 5 мм recycled PU pad + 2.4 мм elastic PU + topcoat | 4–5 дней | 10 лет | ₪590+ |
| `rubber/poured.html` | 10–40 мм (по fall-height) | 2K PU + EPDM 1–4 мм + colored chips | 24ч walk / 3–5 дней full | lifespan 10–15 outdoor / 15+ indoor | ₪450+ для 10 мм |
| `rubber/sheet.html` | 2–6 мм (4 мм typical) | Norament 928 / Artigo, roll 1.2–1.9 м, heat-weld | 2–4 дня (adhesive) | 20–25 лет в healthcare | ₪380+ |
| `rubber/tile.html` | 4–8 мм (gym 8 мм) | Interlocking или клеевая, EPDM + chips | — | 15–20 лет | ₪320+ |

#### Дельта:

- **Конфигуратор собирает 4 продукта в одну точку** «rubber». Имя нечеткое — какой именно вариант?
- **Толщина** 8–15 мм конфигуратора ближе к poured rubber (10–40 мм), но не покрывает comfortfloor (7–8), sheet (2–6) и tile (4–8) корректно.
- **Цена ₪220–420** — ниже самой дешёвой sub-системы сайта (`tile` ₪320). **Занижено**.
- **Cure 24ч/48ч** в конфигураторе vs 24h walk / 3–5 дней full на сайте poured. Off.
- **SKU `PU-Primer`** generic; сайт comfortfloor называет конкретный Sikafloor-161.
- **Норамент / Artigo** не упомянуты в конфигураторе.

---

### 1.6. PARQUET — **ORPHAN**

#### Конфигуратор:

| slug | thk | buildup | cure | warr | price |
|---|---|---|---|---|---|
| `parquet` | 14–22 мм | Дуб/орех/ясень + масло/UV-лак + фанера/стяжка | 1 сут масло / 3 сут лак | 15 лет | ₪380–1100 |

#### Сайт:

**Страниц о паркете нет.** Поиск `/floors/parquet`, `/materials/parquet`, статей о паркете — ничего.

#### Дельта:

- **Паркет в конфигураторе — orphan**. Юзер выбирает паркет, видит спеки, но дальнейшей информации (страница системы / CTA quote / артикулы) на сайте нет.
- **Решение (требует оунера):**
  - (а) Удалить паркет из конфигуратора (если не продаём),
  - (б) Создать страницы `/floors/parquet.html` + 2–3 sub-систем (паркет массив / инженерная доска / штучный паркет).

---

### 1.7. MMA

#### Конфигуратор:

| slug | thk | buildup | cure | warr | price |
|---|---|---|---|---|---|
| `mma` | **5–9 мм** | MMA-Primer 0.5 + MMA-system 4–8 + MMA-топкоат 1 | **2ч / 4ч** | **8 лет** | **₪420—780** |

#### Сайт — **3 подсистемы**:

| страница | thk | SKU | cure | warr | price |
|---|---|---|---|---|---|
| `mma/cold-storage.html` | **4–6 мм** | Sikafloor-41 P + 17 RS Pronto + 61 BC Pronto | 1–2ч cold walk / 1–2 дня full | — | ₪900+ |
| `mma/decorative.html` | 3–6 мм | + 71 TC Pronto topcoat | 2–3ч full | 10 лет | ₪1100+ |
| `mma/fast-cure-industrial.html` | 3–5 мм | 41 P + 61 BC + 71 TC | 1.5ч walk / 2–3ч full | 5–10 лет | ₪780+ |
| `compare.html` | 3–5 мм | Sikafloor-61 BC Pronto | 2–3ч | 5–10 лет | ₪780–1100 |

#### Дельта:

- **Толщина** конфигуратора 5–9 мм vs сайт 3–6 мм. **Off**.
- **Цена ₪420–780** — ниже самой дешёвой подсистемы (₪780 fast-cure). **Занижено в ~2×**.
- **SKU `MMA-Primer`** generic; сайт `Sikafloor-41 P Pronto`. SKU body тоже generic.
- **Cure** конфигуратор 2ч/4ч близко к fast-cure, но cold-storage даёт 1–2 дня full → конфигуратор всегда показывает «fast».
- **Температура** конфигуратор `−25°C OK`; сайт cold-storage `−30°C cure / −40°C use`. Off by 5–15°C.
- **Гарантия** 8 лет vs сайт 5–10 лет (разброс).

---

### 1.8. PU-CEMENT

#### Конфигуратор:

| slug | thk | buildup | cure | warr | price | temp |
|---|---|---|---|---|---|---|
| `pu-cement` | **6–9 мм** | Праймер + PU-Cement + топкоат | **24ч / 7 сут** | 10 лет | **₪520—980** | **±150°C** |

#### Сайт — **4 подсистемы**:

| страница | thk | SKU | cure | strength | slip | price | temp |
|---|---|---|---|---|---|---|---|
| `pu-cement/standard.html` | **4–6 мм** | Sikafloor-21 PurCem | 6ч walk / 5–7 дней full | >50 МПа | R10 | ₪380+ | −40…+120°C |
| `pu-cement/cove-base.html` | 6–12 мм (вертикаль) | Sikafloor PurCem MT-19 | — | — | — | ₪220/п.м. | — |
| `pu-cement/heavy-duty.html` | 6–12 мм broadcast | — | — | >60 МПа | R12–R13 | ₪550+ | −40…+120°C, ΔT 100°C |
| `pu-cement/satin.html` | 4–9 мм | Sikafloor-21N PurCem | 6ч walk / 5–7 дней full | >50 МПа | R11 | ₪450+ | −40…+120°C |
| `compare.html` | 6–12 мм | Sikafloor-22N PurCem | 5–7 дней full | >60 МПа | R11–R13 | ₪480–650 | −40…+120°C |

#### Дельта:

- **Температурный диапазон** конфигуратор `±150°C` (т.е. −150…+150) **завышен**. Сайт единогласно `−40…+120°C`. **Critical** — некорректное обещание клиенту.
- **Cure walk-on** конфигуратор 24ч; сайт **6ч**. **Off by 4×**.
- **Толщина** 6–9 мм конфигуратора не покрывает ни standard (4–6), ни heavy/cove (6–12), ни satin (4–9). Усреднение нерелевантно.
- **Цена ₪520–980** — выше всех подсистем кроме heavy-duty (₪550+). **Завышено** в среднем.
- **SKU primer** конфигуратор «Праймер по бетону» generic; сайт указывает specific.
- **R12 only** — slip class фиксированный; сайт даёт R10/R11/R12/R13 по подварианту.
- **Cove-base** (вертикальное применение, плинтуса) — отдельная страница сайта; конфигуратор не отражает.

---

### 1.9. RESTORATION — **CATEGORY MISSING**

#### Конфигуратор:

— нет.

#### Сайт:

| страница | назначение | продукт | price |
|---|---|---|---|
| `restoration/concrete-renewal.html` | литий-силикат re-densify + diamond polish 800→3000 + PU topical | ProSeal-22 (вероятно) | ₪140+ |
| `restoration/full-renewal.html` | — | — | — |
| `restoration/recoat.html` | замена топкоата | Sikafloor-264 / -169, 0.3–0.5 мм | ₪150–250 (compare) |
| `restoration/terrazzo-repolish.html` | — | — | — |

#### Дельта:

- **Категория «Реставрация» полностью отсутствует в конфигураторе** (4 страницы на сайте, 0 в конфигураторе).
- Для решения: либо добавить категорию (правильно), либо убрать со сайта (нет).

---

## Часть 2. Уровневые проблемы (не на уровне отдельной системы)

### 2.1. Двойной источник правды: `materials.config.json` vs `3d-assets/manifest.json`

**ПОПРАВКА (2026-05-12 после грепа):** `materials.config.json` НЕ legacy. Используется `enhance.js` (sample-builder / lab control schemas) и `scripts/build-site.js` (static passthrough). Это отдельная схема для UI-флоу sample-card на главной, не для 3D-конфигуратора. Удалять НЕ нужно. Синхронизация спеков с manifest.json — отдельная задача на потом.



- `materials.config.json` v17, 10 материалов, **не используется** конфигуратором (legacy).
- `3d-assets/manifest.json` v2.06, 10 материалов, **active**.
- **Схема разная**: `id` vs `slug`, `decor` vs `decorative`, `{name, sku}` vs flat string.
- **Slug-mapping** между двумя файлами не консистентен: `terrazzo-light` → `terrazzo-multi`, `epoxy-light` → нет совпадения, `terrazzo-epoxy` → новый.

**Что делать:** удалить `materials.config.json` (или явно пометить deprecated и убрать из репо после grace period). Сейчас он создаёт когнитивный долг для следующего разработчика.

### 2.2. Энциклопедия (encyclopedia/materials/*.yaml) — третий источник

- Только один файл: `epoxy-self-leveling.yaml`.
- Структура своя, со своей схемой (`encyclopedia/schema/material.schema.yaml`).
- Не синхронизирован с manifest.json.
- Если энциклопедия — план развития, нужно решение: будет ли она источником правды (с генерацией manifest.json из неё) или останется параллельной документацией.

### 2.3. Группировка / таксономия

Из `MEMORY.md` есть **canonical taxonomy 2026-05-10** (owner-approved):

> **Декоративные:** terrazzo-cement, terrazzo-epoxy, microtopping, rubber, decorative-concrete («меда декоративи»), parquet
> **Промышленные:** mma, pu-cement, epoxy

#### Конфигуратор соответствует таксономии:

- Decorative (7): terrazzo-cement, terrazzo-multi, terrazzo-epoxy, microtopping, decorative-concrete, rubber, parquet ✓
- Industrial (3): epoxy, mma, pu-cement ✓

**НО:** `terrazzo-multi` — это extra, не canonical (canonical = `terrazzo-cement` и `terrazzo-epoxy`).

#### Сайт **не соответствует** taxonomy:

- `/floors/concrete/*` — есть, но это polished (не «меда декоративи»). Canonical hint = `decorative-concrete` для нового пола; «полированный» — отдельная категория, которой в taxonomy нет.
- `/floors/parquet` — taxonomy требует, страниц **нет**.
- `/floors/restoration/*` — taxonomy не упоминает, страниц 4.

**Решение (требует оунера):** обновить taxonomy в `MEMORY.md`/`docs/project-context/floor_taxonomy.md` под фактическую структуру сайта, либо привести сайт к canonical taxonomy.

### 2.4. Промышленный набор (epoxy/mma/pu-cement)

Конфигуратор содержит ровно 3 промышленных системы, сайт — 13 (6 эпокси + 3 mma + 4 pu-cement). При переходе клиента из конфигуратора в quote-form он попадёт в выбор из 13 вариантов, которые конфигуратор не покрывает.

### 2.5. Декларативные нумерики / диапазоны

Конфигуратор использует **фиксированные значения или диапазоны без хвостовой логики**:
- thk `12 мм` (одно число) vs `8—15 мм` (диапазон) — формат непоследователен.
- price `₪520—980/м²` (диапазон с em-dash).
- cure `24ч / 72ч` (две точки через slash).

Сайт использует **диапазоны и условные значения**:
- thk `3–5 мм (typically 4)` — точка типичности.
- price `от ₪400/м² на объёме ≥ 200 м²` — условие.
- cure `12 ч пешая, 24 ч light, 7 дней forklift` — три точки.

**Конфигуратор обедняет реальность**, сайт корректнее. При синхронизации нужно решить — расширять формат конфигуратора или сокращать сайт.

### 2.6. Substrate moisture

Конфигуратор не упоминает ограничения по влажности подложки вообще. Сайт указывает критично: `≤ 4% CM` для эпокси, `≤ 75% RH` для микротопинга, `≤ 95% RH` для PU-cement. Это **технически важный параметр** — если клиент не знает, проект провалится на подготовке.

### 2.7. Slip class (R-rating)

Конфигуратор показывает R-класс через `badges` (R9 / R10 / R12), сайт уточняет диапазоны (`R9 базовый / R10 с aggregate`). Конфигуратор обещает один класс, реальность — два-три варианта по броадкасту. **Может вводить в заблуждение** при выборе для wet-зон.

### 2.8. Полностью неотраженные опции в configurator

Не упомянуты в конфигураторе, но критичны на сайте:
- **Cove-base** (плинтус) — отдельный продукт.
- **Cold-storage MMA** — специфический use-case.
- **Decorative MMA / Decorative Epoxy** — отдельные подсистемы.
- **Wet-rooms микротопинг** (с гидроизоляцией).
- **Walls микротопинг** (вертикаль со стеклосеткой).
- **ESD vs anti-static** — разные требования (10⁵–10⁹ Ω vs 10⁹–10¹¹ Ω).
- **Heavy-duty PU-cement broadcast** vs satin.

---

## Часть 3. Что предлагаю сделать (требует ОК)

### Уровень А — критичные исправления (фактические ошибки, врут клиенту):

1. **PU-cement температура** `±150°C` → `−40…+120°C`. Сейчас обещаем больше, чем выдерживает материал.
2. **Эпокси-терраццо cure** `72ч` → `7–10 дней`. Сейчас обещаем 3× быстрее реальности — клиент въедет в свежий пол.
3. **PU-cement cure walk-on** `24ч` → `6ч`. Сейчас занижаем готовность в 4×.
4. **Terrazzo цены** все три варианта — поднять в 2–3× к реальным.
5. **Гарантии** — `terrazzo-cement` 20→10 лет, `microtopping` 7→5 лет. Сейчас обещаем больше, чем юридически дадим.
6. **SKU primer для микротопинга** `Sikafloor-156` → `Sikafloor-470 Level`. Сейчас называем эпокси-праймер на цементной системе — applicator поймёт неправильно.

### Уровень Б — структурные:

7. **Категория «Реставрация»** — добавить в конфигуратор (4 системы).
8. **Подкатегории эпокси / резины / MMA / PU-cement** — расширить конфигуратор до 25 систем, либо явно сделать конфигуратор «обзорным» (~10 точек) и добавить «Подробнее» CTA к деталям на сайте.
9. **Паркет** — решить: убрать из конфигуратора ИЛИ добавить страницы на сайт.
10. **Decorative-concrete** — определить, это «новая заливка» или «полированная плита» — сейчас конфигуратор говорит одно, сайт — другое.

### Уровень В — операционные:

11. **Удалить `materials.config.json`** (legacy, не используется).
12. **Решить статус `encyclopedia/`** — источник правды или параллельная документация.
13. **Обновить `docs/project-context/floor_taxonomy.md`** под реальную структуру сайта (или vice versa).
14. **Добавить substrate moisture в конфигуратор** (обязательная техспека для applicator).
15. **Slip class диапазоны** — `R9–R10 (broadcast: R12)` вместо одного числа.

---

## Часть 4. Что НЕ покрыто этим аудитом (gaps)

- `floors/terrazzo/venetian.html` и `floors/terrazzo/palladiana.html` не прочитаны агентом — нужно отдельно вытащить спеки.
- `floors/restoration/full-renewal.html` и `floors/restoration/terrazzo-repolish.html` — детали не извлечены.
- Полные тексты статей (`articles/*.html`) проверены только на упоминания SKU/цифр; **содержательные противоречия в текстах** (например, статья «epoxy-vs-polyurethane.html» может рекомендовать выбор, не соответствующий реальной линейке) не проверены.
- `compare.html`, `decision-tool.html`, `substrate-check.html` — таблицы извлечены, но логика выбора (какие условия → какая система) не сверена с конфигуратором.
- `floors.html`, `industrial.html`, `materials/*.html` (8 страниц) — обзорные страницы не проанализированы.
- `index.html` главная — числа в hero / featured systems не проверены.

**Что нужно для полноты:** второй проход агентов по этим страницам + текст-анализ статей (`articles/*.html`).

---

---

## UPDATE — Часть 5. Findings от 2-го прогона (gap-fill)

### 5.1. Venetian + Palladiana (terrazzo) — данные есть

- **`floors/terrazzo/venetian.html`**: 15–25 мм + crack-iso 2–4 мм, **Sikafloor Terrazzo CS-31**, 14–21 день cure, ₪1800–3500/м², 10 лет + 50 лет lifespan, R9–R10, >40 МПа.
- **`floors/terrazzo/palladiana.html`**: 15–25 мм, **Sikafloor Terrazzo CS-32**, marble tiles 50–200 мм hand-laid, 14–21 день, ₪2400–4500/м².

→ Подтверждает что конфигуратор `terrazzo-cement` (20 мм, ₪450–780) **в 2–4 раза занижает цену** относительно реального венецианского.

### 5.2. Restoration — данные есть

- **`full-renewal.html`**: 2–4 мм new body on existing, 5–7 days cure, 5 лет, ₪320+.
- **`terrazzo-repolish.html`**: 0.5–1 мм removed, diamond honing 50→3000 grit + lithium silicate + PU sealer, 3–4 days, 5 лет / 15–25 лет cycle, ₪220–320.

→ Подтверждает что **категория «Restoration» полностью отсутствует** в конфигураторе (4 страницы на сайте).

### 5.3. Articles — третий источник чисел (расходится с manifest)

- **`microtopping-vs-epoxy.html`**: «microtopping 1–3 mm» (manifest fix=3 мм)
- **`terrazzo-vs-microtopping.html`**: «cement terrazzo 15–20 mm» (manifest=20), «epoxy terrazzo 6–10 mm» (manifest=12)
- **`terrazzo-modern-interiors.html`**: «traditional 15–20 mm + epoxy 6–10 mm» (manifest=20 + 12 + 12)
- **`mma-fast-cure.html`**: 2–4 ч cure + −25°C — **СОВПАДАЕТ** с manifest. ✓
- **`epoxy-vs-polyurethane.html`**: PU temp `−40…+120°C` — **противоречит** manifest pu-cement `±150°C`. ✓ articles правы

### 5.4. Overview pages — НОВЫЕ расхождения

#### `floors.html` сравнительная таблица — **раздутые гарантии**:
- Epoxy: «20+ years» vs manifest 10 лет
- MMA: «15+ years» vs manifest 8 лет
- PU-Cement: «15+ years» vs manifest 10 лет
- Terrazzo: «75+ years» vs manifest 20 (TC) / 10 (TM/TE)

→ Эти цифры на сайте — **аспирационные / срок службы**, а не warr. Нужен либо отдельный столбец «lifespan» + «warranty», либо обновление подписей.

#### `index.html`:
- Hero claim «9 систем» vs manifest 10
- Picker карточки: 6 систем (Epoxy, Terrazzo, Microtopping, Concrete, PU-cement, MMA) — rubber и parquet не показаны

#### `compare.html` (JS-данные) — **дополнительные расхождения цен**:
- `epoxy-sl` ₪200–260 — manifest EP ₪280–520 (compare занижает)
- `epoxy-hbs` ₪480–650 — manifest EP диапазон не покрывает
- `pu-cement` ₪480–650 — manifest PU ₪520–980 (compare занижает верх)
- `mma` ₪780–1100 — manifest MM ₪420–780 (compare завышает верх)
- `terrazzo-venetian` ₪1800–3500 — manifest TC ₪450–780 (3–4× расхождение)
- **`comfortfloor`** есть в compare.html, **НЕТ в manifest** → orphan product

#### `decision-tool.html`:
- Рекомендует «эпокси HBS 6–9 мм» — manifest EP толщина 2–3 мм, HBS как подвариант не отражён.
- «эпокси декоративный» — нет в manifest.

#### `substrate-check.html`:
- Использует ≥28 days substrate age — manifest для terrazzo требует ≥60 days. Tool не знает, какой материал выбран, → может выдать ОК для проекта, который провалится.

### 5.5. Ключевой инсайт — **двойная семантика «цены»**

Расхождение цен между manifest (≈₪500/м²) и compare/floors-страницами (≈₪1800/м²) — это не баг данных, а **разная семантика**:

- **manifest.json**: цена материала (kit / sample) — узкий range.
- **sales pages (floors/*, compare.html)**: цена installed (материал + работа + подготовка + sealer) — широкий range, +20-300%.

Пользователь видит в 3D-конфигураторе «₪450–780», переходит на `floors/terrazzo.html` и видит «от ₪1800» — **чувствует себя обманутым**.

**Решение:** привести цены в manifest к INSTALLED. Так как:
1. Пользователь в конфигураторе ожидает увидеть «цену пола», а не «цену мешка».
2. Sales-страницы — источник правды для коммерческих решений.
3. Installed-стоимость единственная, по которой клиент примет решение и закажет sample.

---

## UPDATE — Часть 6. План фикса (что делаю сейчас)

### Манифест (`3d-assets/manifest.json`) — основные правки:

| система | поле | было | станет | источник |
|---|---|---|---|---|
| terrazzo-cement | thk | 20 мм | **12–18 мм** | `floors/terrazzo/mineral.html` |
| terrazzo-cement | cure | 7сут/28сут | **10–14 дней** | mineral.html |
| terrazzo-cement | warr | 20 лет | **10 лет + 50 лет срок** | mineral/venetian |
| terrazzo-cement | price | ₪450–780 | **₪1000–1800** | mineral / compare |
| terrazzo-cement | body SKU | «Цементное терраццо» | **Sikafloor Terrazzo CS-31** | mineral |
| terrazzo-multi | thk | 12 мм | **12–18 мм** | `floors/terrazzo/epoxy.html` |
| terrazzo-multi | cure | 24ч/72ч | **7–10 дней** | epoxy.html |
| terrazzo-multi | price | ₪520–980 | **₪1400–2400** | compare |
| terrazzo-multi | body SKU | Sikafloor-264 | **Sikafloor Terrazzo EM-10** | epoxy.html |
| terrazzo-epoxy | thk | 12 мм | **12–18 мм** | epoxy.html |
| terrazzo-epoxy | cure | 24ч/72ч | **7–10 дней** | epoxy.html |
| terrazzo-epoxy | price | ₪480–820 | **₪1400–2400** | compare |
| terrazzo-epoxy | body SKU | Sikafloor-264 | **Sikafloor Terrazzo EM-10** | epoxy.html |
| microtopping | thk | 3 мм | **2–3 мм** | standard.html / compare |
| microtopping | cure | 48ч/7сут | **5–7 дней** | compare |
| microtopping | warr | 7 лет | **5 лет** | standard.html / compare |
| microtopping | price | ₪280–520 | **₪500–900** | compare |
| microtopping | body SKU | Микроцемент 2×1 мм | **Sikafloor-470 Level · 2 × 1.2 мм** | compare |
| microtopping | topcoat | PU-защита 2 слоя | **ProSeal-22 · 2 слоя матовая** | compare |
| rubber | thk | 8–15 мм | **7–15 мм** | covers comfortfloor+poured |
| rubber | warr | 8 лет | **10 лет** | comfortfloor / poured |
| rubber | price | ₪220–420 | **₪380–650** | sheet (compare) / poured |
| rubber | primer SKU | PU-Primer | **Sikafloor-161 · 0.15 мм** | comfortfloor.html |
| mma | thk | 5–9 мм | **3–6 мм** | fast-cure / decorative |
| mma | cure | 2ч/4ч | **1.5ч / 2–3ч** | fast-cure |
| mma | warr | 8 лет | **10 лет** | decorative.html |
| mma | price | ₪420–780 | **₪780–1100** | fast-cure / compare |
| mma | temp badge | −25°C OK | **−30°C OK** | cold-storage |
| mma | topcoat SKU | MMA-топкоат | **Sikafloor-71 TC Pronto** | fast-cure / decorative |
| mma | body SKU | MMA-system | **Sikafloor-61 BC Pronto** | compare |
| mma | primer SKU | MMA-Primer | **Sikafloor-41 P Pronto** | fast-cure |
| pu-cement | thk | 6–9 мм | **4–9 мм** | standard+satin |
| pu-cement | cure | 24ч/7сут | **6ч / 5–7 дней** | standard.html |
| pu-cement | price | ₪520–980 | **₪380–650** | standard+heavy / compare |
| pu-cement | temp badge | THERMAL ±150°C | **−40…+120°C** | стандарт PurCem |
| pu-cement | body SKU | PU-Cement (generic) | **Sikafloor-21N PurCem** | standard / compare |
| epoxy | thk | 2–3 мм | **3–5 мм** | self-leveling |
| epoxy | cure | 24ч/72ч | **12ч / 7 дней** | self-leveling |
| epoxy | price | ₪280–520 | **₪400–650** | SL / compare HBS |
| epoxy | primer thk | 0.3 мм | **0.15 мм** | SL.html consumption |

### Отложено на решение оунера (Priority B):

- **`decorative-concrete`** (Меда декоративи 40–80 мм) — оставляю как есть в manifest. Решение: либо создать `/floors/concrete/decorative-cast.html` (новая sales-страница), либо репозиционировать manifest в `polished-concrete`.
- **`parquet`** — оставляю как есть в manifest. Решение: либо создать `/floors/parquet.html` + 2–3 sub-страниц, либо удалить из конфигуратора.
- **Категория restoration** — НЕ добавляю в конфигуратор (это потребует 4 новых slug + текстуры).
- **6 подтипов epoxy / 4 rubber / 3 mma / 4 pu-cement** — НЕ расширяю конфигуратор. Подтверждаю текущий формат «1 родовой материал = 1 точка в конфигураторе».
- **`comfortfloor` orphan в compare.html** — оставляю.
- **`materials.config.json` legacy** — НЕ удаляю в этом проходе (отдельная задача).

### Страницы сайта — правлю:

- `floors.html` сравнительная таблица: пометить гарантии как «срок службы» вместо «warranty», либо добавить разделение `warr / lifespan`.
- `index.html` «9 систем» → **«10 систем»** (включая parquet).

### Не правлю в этом проходе:

- Тексты статей (`articles/*.html`): они утверждают «5-20 мм cement terrazzo, 6-10 mm epoxy». Подождать с unification — это редакционная работа.
- `compare.html` JS-данные: они корректно показывают installed-prices, расхождения с manifest решатся после моих manifest-фиксов.
- `decision-tool.html`: рекомендации «эпокси HBS» / «декоративный эпокси» — это правильно ведут на `/floors/epoxy/*`. Конфигуратор останется родовым «epoxy».
- `substrate-check.html`: динамическая логика «материал → требования» — отдельная фича, не правка.

---

## Приложение А — полная таблица расхождений (one-line summary)

| система | расхождение | приоритет |
|---|---|---|
| terrazzo-cement | цена 2–4× занижена, гарантия завышена, SKU топкоата generic | A |
| terrazzo-multi | цена 2× занижена, cure 7× короче, SKU неправильный | A |
| terrazzo-epoxy | цена 2× занижена, cure 7× короче, SKU неправильный | A |
| epoxy | 6 подсистем сжаты в одну, спеки=frankenstein | Б |
| microtopping | SKU primer неправильный, гарантия завышена, цена занижена | A |
| decorative-concrete | продукт не соответствует страницам сайта | Б |
| rubber | 4 подсистемы сжаты в одну, цена занижена | Б |
| parquet | orphan: есть в конфигураторе, нет страниц | Б |
| mma | thk off, цена занижена, температура off, SKU generic | A/Б |
| pu-cement | температура завышена (±150 vs +120), cure walk 4× off, SKU generic | A |
| restoration | категория полностью отсутствует | Б |
| (general) | substrate moisture не указана в конфигураторе | A |
| (general) | slip class фиксированный, без диапазона | Б |
| (general) | `materials.config.json` legacy дублирует manifest | В |
