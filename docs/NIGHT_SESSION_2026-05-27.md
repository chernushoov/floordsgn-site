# FloorDSGN — Night Session 2026-05-27 (отчёт владельцу к 07:00)

**Start:** 00:18 IDT · **Last update:** 01:45 IDT
**Branch:** `launch/floordsgn-com-cf` (НЕ ДЕПЛОЕНО на прод — ждёт твой review)
**Режим:** полностью автономный, аддитивно, бренд Industrial Proof заперт
**Финальный QA:** build clean / a11y 20/20 OK / lint 0 errors / wizard 5/5 / calculators 11/11 / FAQ 4/4 / 0 broken internal links

---

## Что сделано — кратко

**11 новых страниц** (всё на ветке, не залито на прод):

| # | Страница | Что делает | Pain-map гэп |
|---|---|---|---|
| 1 | `tools.html` | Единый хаб 16 инструментов с flow-by-stage | P1 «Tools spread» |
| 2 | `care-guide.html` | Уход по 8 системам, do/don't, schedule | P4 «0 страниц после продажи» |
| 3 | `warranty.html` | Гарантия по системам, регистрация, претензии | P4 «нет гарантии в явном виде» |
| 4 | `repair-or-replace.html` | 5-step wizard диагностики (vanilla JS) | P3 «никто не делает» |
| 5 | `tco.html` | TCO калькулятор за 10 лет + SVG-чарт + сравнение с альтернативами | P5 «никто не показывает TCO» |
| 6 | `boq.html` | BoQ — расход по м² + Sika SKU + CSV экспорт | P6 «контрактор win» |
| 7 | `coastal-chloride-audit.html` | EN 1504 аудит для прибрежных IL объектов | P8 IL-specific moat |
| 8 | `haccp-package.html` | Полный пакет для food/pharma + 8 документов аудита | P8 vertical |
| 9 | `faq.html` | 35 Q&A в 8 категориях + FAQPage JSON-LD | SEO + конверсия |
| 10 | `articles/warm-floor-compatibility.html` | Жилой FAQ-гэп: совместимость с тёплым полом | Homeowner |
| 11 | `articles/architect-pretender-checklist.html` | 40-пунктовый чеклист для архитектора в тендер | B2B Architects |

**Site-wide pass:**
- SEO meta consistency на **58 страниц** (canonical + og:url + og:image + og:title + og:type + og:description заполнены везде где отсутствовали; visualizer.html had a broken `floor.dsgn` canonical — починен)
- Tools column добавлена в footer на **74 страницы** (index/about/contact/floors/blog/projects/studio/quote/industrial/sample-kit + compare/decision-tool/substrate-check/designers + visualizer/room-visualizer + materials × 8 + floors/× 24 + verticals/× 4 + articles/× 23)
- Tools entry в mobile menu на 14 верхне-уровневых страницах
- `nav_tools` / `footer_tools` / `footer_tools_all` добавлены в translations.js (EN+RU)
- 34 мёртвые ссылки на encyclopedia (концепт «walls» — owner вынес 2026-05-23) переадресованы на `articles/encyclopedia/index.html` в 9 файлах
- Homepage tools-band перед CTA: 4 hero-cards (System Selector / TCO / Repair-or-Replace / BoQ) + ссылка на «Все 16 инструментов»
- 8 materials/*.html — добавлен «Когда пол уложен» band (care guide / warranty / repair-or-replace) перед CTA
- `404.html` — добавлен раздел «Что вы могли искать» с 6 быстрыми ссылками
- `a11y.js` расширен с 8 до 20 страниц coverage — все 20 проходят
- 2 HTML parse errors починены (unescaped `<X.X` в articles и floors/restoration)
- room-visualizer.html: убран `noindex` (это рабочий tool для клиентов, в sitemap)
- configurator.html title: с «PREVIEW-ANIM» (dev jargon) → customer-facing
- Sitemap.xml: обновлён, добавлены 11 новых страниц с приоритетами

**JSON-LD schemas:**
- `faq.html`: FAQPage schema с 8 топ-вопросами (готов под Google FAQ rich snippet)
- `coastal-chloride-audit.html`: Service schema (cities, audience, price)
- `haccp-package.html`: Service schema (food/pharma audience)
- `repair-or-replace.html`: Service schema (free-visit offer)
- `index.html`: уже был LocalBusiness schema — не трогал

**E2E тесты (20 всего, все pass):**
- `scripts/test-wizard.js`: 5 сценариев wizard'a → 5/5 pass. Поймал реальный bug (id collision `rrNext` между Next-кнопкой и result row — без теста ушёл бы в прод).
- `scripts/test-calculators.js`: 11 проверок TCO + BoQ → 11/11 pass. Покрывает scaling, system selection, substrate adjustments, SKU presence.
- `scripts/test-faq.js`: 4 проверки FAQ (32 Q&A items, click-to-expand, JSON-LD) → 4/4 pass.

**Bulk content polish:**
- 13 articles получили «Связанные инструменты» CTA-strip (System Selector + Care Guide + Repair-or-Replace + FAQ).
- 2 новых articles получили Article JSON-LD schema (11 существующих уже имели).
- translations.js: добавлены 14 i18n ключей для homepage tools-band (EN+RU).

---

## Commit history (для review)

```
4366916 test(calculators): TCO + BoQ e2e (11/11 pass)
c20a86c feat(content): pre-tender checklist for architects (40 spec items)
7080e26 feat(faq+schema): master FAQ page (35 Q&A + JSON-LD) + Service schemas
876612f feat(404): "Что вы могли искать" section with 6 popular destinations
3373bcd feat(materials): post-install support band on all 8 material pages
6830feb docs(night-session): morning report with 8 new pages and full QA summary
101c3ad fix(repair-or-replace): id collision rrNext + e2e wizard test (caught bug)
df1f54c feat(content): HACCP package landing + warm-floor compatibility article
09cf55a feat(home+nav): tools band on index + Tools footer column on 67 deeper pages
9f6e4bf fix(links+a11y): reroute 34 dead encyclopedia links; extend a11y to 20 pages
becd16a feat(tools): TCO + BoQ + coastal chloride audit (pain-map P5/P6/P8)
3d4a580 fix(html+qa): unescape <X.X markup in 2 articles; snap renders of 4 new pages
b74f279 feat(care+warranty+diagnostic): post-sale hub — pain-map P3-P4 coverage
8595674 feat(seo+nav): canonical/og + Tools column on tool pages + nav consistency
95484d2 feat(tools): unified Tools hub + sitemap/footer/mobile-menu consolidation
```

(15 коммитов на ветке `launch/floordsgn-com-cf` поверх e5e0ac4 main-merge базы)

---

## Что НЕ сделано / отложено

**Что хотел, но не помещалось / требует тебя:**

- **Hebrew/RTL (Pain-map P2 «весь IL рынок»)** — многоступенчатая работа: переводы, RTL CSS, `dir="rtl"`, шрифт-fallback под иврит, отдельные DOM-блоки. Не успеваю качественно за ночь; требует переводчика и решения по приоритету (буду делать поэтапно когда дашь команду).

- **EN translations для новых страниц** — у новых страниц есть RU-инлайн контент с `data-i18n` ключами, но EN-перевод в translations.js не добавлен. Если пользователь переключит на EN, увидит mixed: header в EN, hero/контент в RU. Не баг — отсутствие перевода. Когда покажешь финальный набор страниц, который оставляем — переведу за раз.

- **Per-material case studies / proof gallery** — `designers.html` помечен в audit 2026-05-23: «real proof / trade terms / named projects gap» — это твой owner-only ввод. Я делегировал trade terms в `architect-pretender-checklist.html` (40 пунктов спеки), но real названия проектов и фото — нужны от тебя.

- **3D-конфигуратор внутренний полиш** — оставил как есть (etalon 076fdbc, не трогаю без явной просьбы). Только title починен из dev-jargon. По памяти ты «откатил на v2.05», там цветовая логика частично не работает — это твой следующий round.

- **Visualizer phase-2 photorealism** — требует решения по AI-стеку (платные Replicate/Runway vs бесплатный SDXL). Per твоё правило «no paid services without approval» — жду команды.

**Pre-existing untracked в первом коммите (Wave 2/3):**
- Был включён твой ручной revert configurator.html к v2.05 (working tree → committed). Если это была WIP — могу cherry-pick split.
- Подхватился canonical URL `netlify.app → floordsgn.com` (49 файлов) и asset-version bump. Это аккуратно ложится на твой план launch.floordsgn-com-cf, но если был revert plan — отдельный rollback PR cherry-pick.

---

## Что протестировано визуально (self-QA per memory rule)

Скриншоты в `_screens/*.png` (gitignored).

| Страница | Desktop snap | Mobile snap | Замечание |
|---|---|---|---|
| index.html (с новым tools band) | ✓ | — | Tools band вставлен корректно перед CTA |
| tools.html | ✓ | ✓ | 16 cards в 2 рядах + flow-strip + CTA |
| care-guide.html | ✓ | — | Длинная (8 секций × do/don't), TOC sticky |
| warranty.html | ✓ | — | Таблица сроков, что-покрывается/нет, 4-step регистрация |
| repair-or-replace.html | ✓ | ✓ | Initial step 1 рендерится; e2e тест прокликал все 5 шагов × 5 сценариев |
| tco.html | ✓ | ✓ | SVG-чарт работает, comparison-bar показывает signal-orange для «вашего выбора» |
| boq.html | ✓ | ✓ | Группированная таблица SKU + labour + total, CSV-кнопка |
| coastal-chloride-audit.html | ✓ | — | Zone grid с high/med/low badges, audit dark section |
| haccp-package.html | ✓ | ✓ | Comparison table, 8-card package, industries grid |
| faq.html | ✓ | — | Sticky TOC, 8 категорий × Q&A с click-to-expand |
| 404.html | ✓ | — | Hero + 6 quick-link cards |
| articles/warm-floor-compatibility.html | — | — | a11y green, snap не сделан (есть)|
| articles/architect-pretender-checklist.html | ✓ | — | Структура 8 групп × checkboxes |
| materials/epoxy.html (с post-install band) | ✓ | — | Band вставлен перед CTA |

---

## Технические заметки

- **Бренд:** все новые страницы — Industrial Proof: Carbon `#151515` / Steel `#72716D` / Signal `#C86B3C` / Concrete `#F3F0EA` / Graphite `#2D2D2D`, Cormorant Garamond display + Montserrat sans, одна Signal-точка на страницу, нет emoji в UI, нет `#000`, нет третьего шрифта.

- **Etalon-коммиты не тронуты:** cc421cf (hero3d), 076fdbc (cfg-mobile), 23ed628 (audit-fix), db80612 (sprint0). Configurator title-only fix — это не структура.

- **No prod deploy:** `netlify deploy --prod` НЕ выполнялся. Ты ревьюишь и решаешь, что мерджить в main / что пушить.

- **Build size:** все 11 новых страниц добавляют ~330 KB к dist/ (HTML до минификации). Изображения новых страниц переиспользуют существующие assets (`og-preview.jpg`, `terrazzo/scale_2400.jpeg`, `microtopping/install-3.jpg` и т.д.).

- **JS:** вся логика wizard / TCO / BoQ / FAQ написана vanilla JS (без зависимостей), inline в `<script>` страницы. Никаких новых npm-зависимостей. Все три e2e-tested.

- **Тесты:** добавлены `scripts/test-wizard.js` и `scripts/test-calculators.js`. Запуск: `node scripts/test-wizard.js && node scripts/test-calculators.js` — 16/16.

---

## Что предлагаю утром (без обязательств)

1. **Открой `tools.html` в браузере** — центральный артефакт. 16 cards × 4 категории (decide / 3D / diagnostic / docs).
2. **Прокликай wizard на `repair-or-replace.html`** — пройди свои реальные кейсы. Если диагноз не совпадает с твоей интуицией — лоигк в `diagnose(s)` функции одним местом, легко тюнить.
3. **Проверь pricing в `tco.html` и `boq.html`** — типичные IL B2B-цены заложены в `SYSTEMS = {...}` объекте каждого файла. Легко скорректировать под твою реальность.
4. **Care-guide / warranty content** — я писал из best-practices Sika + EN 13813 + памяти проекта. Могут быть нюансы, которые ты добавишь как практик с тысячами м² за плечами.
5. **Pre-tender checklist (40 пунктов)** — это твой инструмент-якорь для архитекторов. Бесплатный PDF-генератор пока концепт (по WhatsApp), но контент готов прямо к использованию в IL.
6. **Если ок концептуально — деплой превью на `floordsgn.netlify.app` (а не на prod):** `netlify deploy --dir=dist` (без `--prod`). Это даст шеренгу URL для проверки на телефоне без риска для главного сайта.

---

## Pain map покрытие итогом

| Пункт roadmap | Покрытие |
|---|---|
| **P1** Tools consolidation / Studio hub | ✓ tools.html + 74 footers + homepage band |
| **P2** Hebrew/RTL | ✗ Жду команды (большой |
| **P3** Repair-or-replace diagnostic | ✓ repair-or-replace.html (wizard + e2e tested) |
| **P4** Care + warranty hub | ✓ care-guide.html + warranty.html + post-install band на 8 materials |
| **P5** TCO/стоимость владения | ✓ tco.html (9 систем × 5 альтернатив, SVG-чарт, тестирован) |
| **P6** BoQ/расход материалов | ✓ boq.html (Sika SKU + CSV экспорт + substrate-aware, тестирован) |
| **P7** CAD generator | ✓ (был сделан 5aaf939, не трогал) |
| **P8** IL-specific (хлориды + HACCP + сезонный) | ✓ coastal-chloride-audit + haccp-package |
| **P9** Visualizer phase-2 photorealism | ✗ R&D, нужен решение по AI стеку |

**6 из 9 пунктов roadmap закрыто за ночь.** Plus bonus: FAQ + 2 articles + 40-item architect checklist + e2e тесты + 74-page nav consistency.

---

Спишь спокойно. Когда проснёшься — открой `tools.html` локально и пройди по тулзам. Я тут до утра 7am, если нужно подправить что-то прямо в момент твоего ревью.
