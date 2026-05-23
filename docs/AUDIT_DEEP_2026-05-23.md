# FLOORdsgn — глубокий аудит (2026-05-23)

5 параллельных агентов прошли все **92 страницы** (root, floors/, materials/, specs/, verticals/, articles/, en/, admin/) против живого `floordsgn.com` + исходников. Аудит, без правок. Приоритеты: **P0** = ломает прод/SEO, **P1** = заметный баг/контент, **P2** = полировка.

> ВАЖНО про канонические URL: прод (floordsgn.com) уже отдаёт правильный canonical — деплой-пайплайн подменяет `netlify.app→floordsgn.com` ВНЕ `build-prod.js` (скрипт `swap-canonical-domain.js`). Значит в ИСХОДНИКАХ host неверный, на ЖИВОМ — в основном верный. Но `sitemap.xml`, `robots.txt`, `og:image`, JSON-LD URL подменяются НЕ везде. Хрупко: фикс надо вшить в build.

---

## P0 — критичное

1. **sitemap.xml + robots.txt → host `floordsgn.netlify.app` (теперь 503).** robots `Sitemap:` и все `<loc>` на мёртвом хосте. → заменить на `floordsgn.com`.
2. **Sitemap пропускает ВЕСЬ каталог:** только 35 `<loc>`, НЕТ всех 40 `/floors/*` (спек/цена-страницы — главный money-контент), нет `/articles/*`, части `/materials/*`, `/en`. → перегенерировать sitemap со всеми страницами.
3. **Канонический host в исходниках = netlify.app на ВСЕХ страницах**, билд не чинит (`build-prod.js` не делает swap; `dist/` остаётся netlify.app; живой прод чинит out-of-band скриптом). → вшить swap в `scripts/build-prod.js` ИЛИ поправить исходники на `floordsgn.com`. Также `og:image`/JSON-LD `url`/`logo`/`image` местами остаются `netlify.app/images/og-preview.jpg` (битый хост).

## P1 — заметные баги / контент

4. **Битые ссылки на энциклопедию (404 живьём): 11 статей** `articles/encyclopedia/01..14-*.html` (Cyrillic/Hebrew slugs) линкуются, но НЕ существуют. Источники: `studio.html:282-287` (6 шт) + 8 страниц `materials/*.html`. Существуют только: epoxy-sl, microtopping, pu-cement, terrazzo, index. → создать 11 статей ИЛИ перенаправить ссылки на существующие.
5. **3 статьи-сироты:** `encyclopedia/{microtopping,pu-cement,terrazzo}.html` готовы, в sitemap, но НИ ОТКУДА не линкуются (плитки индекса ведут на `floors/*` вместо них). → плитки «Статья →» направить на статьи.
6. **Гарбл/плейсхолдер-текст (видно пользователю!)** — позорные опечатки на проде:
   - `floors/pu-cement/standard.html:50` — «rubbish»
   - `floors/pu-cement/satin.html:51` — «mojity»
   - `floors/restoration/concrete-renewal.html:51` — «пыля»
   - `floors/rubber.html:55,56,150` — «smягчённое», «rвут», «agresива»
   - `floors/restoration.html:122,125` — «моисture», «slabs»
   - `floors/terrazzo.html:70,125` — «Reполируется», «Toлщина»
   - `floors/rubber/comfortfloor.html:63` — бессвязный спек
7. **ВСЕ 5 страниц rubber/ показывают БЕТОН в герое** (`images/rubber/g12ground.jpg` = серый бетон, не резина). + кросс-заимствованные герои на ~8 pu-cement/restoration страницах (нет папок `images/pu-cement/`, `images/restoration/`). → подобрать корректные фото.
8. **Несогласованность данных (цены/толщина/срок) — система-сирота:** разные источники дают РАЗНЫЕ числа для одного материала:
   - 4 источника спеков: `room-visualizer.html` MAT, `visualizer.html` MATERIALS, `materials.config.json`, `enhance.js` — разные цены И разные id (`microtopping` vs `micro`, `pu-cement` vs `purcem`).
   - terrazzo толщина: 12-18 / 8-15 / 10-25 / 10-12 мм (4 значения по разным страницам + CAD 15мм).
   - epoxy-SL цена: ₪400-650 (materials/floors) vs **₪200-260** (compare.html — выброс).
   - ComfortFloor: PS-65 ₪590-780 (rubber/encyclopedia) vs PS-23 ₪380-450 (compare.html).
   - → выбрать ОДИН источник правды (предложение: `materials.config.json` или `compare.html`) и свести.
9. **`floors/epoxy.html` — единственная страница в долларах ($45-$220/м²)**, цены противоречат своим же подстраницам (₪). + блог-статьи и fx-spec таблицы materials (concrete/restoration/rubber) тоже в USD/imperial. → перевести в ₪.
10. **`visualizer.html` canonical = `https://floor.dsgn/visualizer.html`** — несуществующий TLD. → `floordsgn.com/visualizer`.
11. **`index.html:385-392` — 8 чужих брендов с `thesvg.org`** (McDonald's/BMW/IKEA/Starbucks/DHL/Hilton/Bosch/3M): (а) trademark-риск (выглядит как «наши клиенты»), (б) внешняя зависимость. → самохостить нейтральные иконки отраслей.
12. **`specs/index.html:157-162` — 6 «Compliance» ссылок = `href="#"`** (мёртвые, живьём) на странице, чей смысл — скачиваемые стандарты.
13. **11 блог-статей без canonical/og:image/robots meta** (только энциклопедия их имеет).
14. **`en/` — дубль главной + сломанный hreflang:** индексируемый клон index.html, asymmetric hreflang (en/ без обратных hreflang), нет в sitemap.
15. **`lang="ru"` но видимый по умолчанию контент EN** (blog-статьи, materials) — declared lang ≠ контент для краулера/no-JS.
16. **Self-contradictions на странице:** `materials/concrete.html` гарантия «5 years» vs «system-specific»; `materials/restoration.html` «5-10 лет» vs «3-7 лет»; `floors/restoration` full-renewal «сохраняем подложку» vs «снимаем до бетона».

## P2 — полировка

- `room-visualizer.html`/`configurator.html` — не переводятся (0-11 i18n-ключей, хардкод RU) → либо i18n, либо убрать `translations.js`.
- `language-switcher.html` — орфан-артефакт в корне (битый `i18n` ref, мёртвый HE), публично доступен → удалить/вынести.
- «Sika SKU» на не-Sika брендах (Norament/Artigo/Polyflor) на rubber-страницах → переименовать.
- `admin/index.html` — добавить `noindex` meta + `X-Robots-Tag` (сейчас безопасно: 404 на .com, 503 на netlify, robots disallow — но defense-in-depth).
- `about.html` — meta «гарантия 10 лет» vs on-page «warranty by selected system».
- sample-threshold: terrazzo parent «от 50 м²» vs подстраницы «от 100 м²».
- strength-цифры по материалу разнятся (epoxy >55/>70/>95; pu-cement >50/>60); MMA темп `−30…+30` (typo) vs `−30…+60`.
- `<html lang="ru">` + EN-кнопка статично `active`; нет hreflang на floors; даты-плейсхолдеры `2026-01-26` в 8 статьях; og:image нет на tools (compare/decision-tool/studio); palladiana цена-потолок только в title; configurator игнорит `?material=`.

---

## Рекомендованный порядок фиксов (дёшево→дорого, безопасно→рискованно)
1. **P0 SEO:** sitemap.xml + robots.txt host + полный список URL; вшить canonical-swap в build (+og:image/JSON-LD).
2. **P1 текст:** починить ~10 гарбл-опечаток (видно на проде, стыдно).
3. **P1 ссылки:** перенаправить 6 studio + materials ссылки на существующую энциклопедию; плитки индекса → 3 статьи-сироты; visualizer canonical; specs «#» ссылки.
4. **P1 данные:** свести спеки в один источник (отдельная задача с владельцем — какие числа верны).
5. **P1 контент:** USD→₪ на epoxy hub + статьях; убрать thesvg.org бренды.
6. **P1 фото:** корректные герои для rubber/pu-cement/restoration (нужны ассеты).
7. **P2:** по списку.

Координация: фиксы 1-3 безопасны и проверяемы — могу делать ветками/PR. Фикс 4 (данные) и 6 (фото) нужны решения/ассеты от владельца.
