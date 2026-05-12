# Floor.DSGN — стратегия локализации EN + HE

**Дата:** 2026-05-12
**Цель:** получить первый качественный фидбек от англо- и иврито-говорящей аудитории через Instagram-показ.
**Скоуп:** RU → EN, EN → HE с RTL-зеркалированием.

---

## Recon — текущее состояние i18n инфры

| метрика | значение |
|---|---|
| RU страниц с `data-i18n` атрибутами | 19 |
| Уникальных `data-i18n` ключей (приблизительно) | ~1256 использований |
| EN-страниц готовых | 1 (`/en/index.html`) |
| HE-страниц | **0** (с нуля) |
| Translation dictionary | `translations.js` (существует) |
| Toggle logic | `js/i18n.js` (существует) |
| Per-lang CSS | `css/i18n.css` (существует) |

**Вывод:** инфра наполовину готова. Не надо изобретать систему — надо **наполнить dictionary** + добавить HE-ветку + сделать RTL.

---

## Архитектурное решение

Три варианта:

| вариант | плюсы | минусы |
|---|---|---|
| **(A)** Multi-tree `/`, `/en/`, `/he/` | независимо рендерится, легко SEO | тройная синхронизация HTML, всё рассыпается через неделю |
| **(B)** Single tree + JS i18n (translations.js + data-i18n) | уже частично сделано, одна копия HTML | JS-зависимый рендер, SEO слабее без SSR |
| **(C)** Build-time gen (Astro/SSG) из YAML/JSON | best SEO + одна копия | надо переехать на Astro, недели работы |

**Рекомендация: вариант (B).** Инфра существует, риск минимальный, скорость максимальная. SEO-проблема решается на Phase 5 через `prerender` build-step (Lighthouse увидит правильный язык даже без JS).

---

## Фазированный план

### Phase 0 — Audit & extraction (агенты, ~1.5 часа)

Цель: понять что сейчас. Запускаем 3 параллельных Explore-агента:

**Agent A — Cartographer (картограф i18n покрытия)**
- Прочитать все 80+ HTML-страниц
- Построить таблицу: страница × язык × статус (полная / частичная / отсутствует / hardcoded)
- Найти все `data-i18n` ключи, проверить присутствие в `translations.js`
- Найти orphan keys (используются в HTML но нет в dict) и dead keys (в dict но нигде не используются)

**Agent B — Pollution-scanner (детектор смешения)**
- Найти в `/en/index.html` русские строки и наоборот
- Найти hardcoded RU/EN текст без `data-i18n` обёрток (особенно в hero, CTA, meta)
- Проверить meta-tags (`<title>`, `<meta description>`, `<meta og:*>`) — переводятся ли
- Найти атрибуты `alt`, `placeholder`, `aria-label` без перевода

**Agent C — Glossary-extractor (доменный словарь)**
- Извлечь все технические термины из RU-страниц (Sikafloor SKUs, толщины с единицами, slip-классы, химия)
- Извлечь IL-loanwords (Меда декоративи, ת"י 466, и т.д.)
- Извлечь brand-vocabulary (Floor.DSGN, специфичные обороты пользователя)
- Подготовить CSV-skeleton: RU → EN (пусто) → HE (пусто) → notes

**Артефакты:**
- `LANGUAGE_AUDIT_2026-05-12.md` — общий отчёт
- `glossary-skeleton.csv` — для следующей фазы

### Phase 1 — Glossary build (Alexey + 1 expert agent, 2-3 часа)

Цель: зафиксировать **constraints** для перевода. Без glossary каждый агент будет переводить «Sikafloor-264» как «Sikafloor-264» в одних местах и «Sika 264» в других — несинхронность убивает доверие.

**Структура glossary:**

| RU | EN | HE | notes |
|---|---|---|---|
| Sikafloor-264 | Sikafloor-264 | Sikafloor-264 | brand SKU, do not translate |
| эпоксидная заливка | epoxy floor | יציקת אפוקסי | category noun |
| 12—18 мм | 12—18 mm | 12—18 מ"מ | thickness unit |
| ₪1400—2400/м² | ₪1,400—2,400/m² | ₪1,400—2,400 למ"ר | currency stays ₪ |
| Меда декоративи | Decorative Concrete | מדה דקורטיבי | IL term, native HE pronunciation |
| полированный бетон | polished concrete | בטון מוחלק | category noun |
| фаска | chamfer / champher | פאזה | technical detail |
| подложка | substrate | מצע | foundation |
| гарантия 10 лет | 10-year warranty | אחריות 10 שנים | legal term |
| HACCP-ready | HACCP-ready | מתאים HACCP | acronym kept |

**Owner-only решения (Alexey):**
- Какие термины оставлять русскими/ивритскими loanwords даже в EN ("Меда декоративи" — оставить как есть или переводить?)
- Какие slip-классы записывать — IL стандарт vs EU? (`R10` универсально, но есть SCOF, BCRA)
- Какие единицы — м² vs sq.ft vs м²?

**Артефакт:** `glossary.csv` — authoritative reference. Каждая последующая фаза ссылается ИМЕННО на этот файл.

### Phase 2 — Translation execution (orchestrator + workers, 4-6 часов)

**EN перевод:**

- Источник: RU мастер (текущий сайт)
- Двухпроходный пайплайн:
  1. **Worker-агент EN-translator** — переводит батчами по 50 ключей с glossary в контексте → пишет в `translations.js`
  2. **Reviewer-агент EN-validator** — читает оба языка side-by-side, помечает: ✅ accept / ⚠ review / ❌ rework
- Alexey финально пробегает spot-check, особенно: CTA-кнопки, hero, цены

**HE перевод:**

- Источник: **EN** (не RU). Иврито-говорящие в IL чаще bilingual EN+HE чем RU+HE. EN как «source of truth» для перевода более стандартный output.
- Тот же двух-проходный пайплайн с дополнительной фазой:
  3. **Native-HE-speaker review** — обязательно перед публикацией. Без нативного ревью HE = trust killer для IL аудитории.
- Если нативного спикера нет в моменте → **НЕ запускать HE-show до его наличия**. Лучше показать «coming soon» чем плохой иврит.

**Бар качества:**

- EN: B+ — клиент читает на 2-й секунде и не спотыкается
- HE: A− native-grade — иначе IL архитектор закроет вкладку через 5 секунд

### Phase 3 — RTL implementation (HE only, ~4-6 часов)

**Без RTL HE-сайт = катастрофа.** Тексты будут читаться слева-направо как обычно, и весь контент покажется хаотичным.

**Что переключаем:**

1. **HTML root**: `<html dir="rtl" lang="he">`
2. **CSS overrides** в `css/i18n.css` под `[dir="rtl"]`:
   - `padding-left` → `padding-inline-start`
   - `margin-right` → `margin-inline-end`
   - `text-align: left` → `text-align: right`
   - `float: left` → `float: right`
   - Direction-specific анимации (slide-from-left → slide-from-right)
3. **Header nav**: порядок пунктов меню — зеркало
4. **Иконки направления**: стрелки ←→, chevrons > < — flip
5. **Hero layout**: если картинка справа на EN/RU — слева на HE
6. **Configurator picker**: материалы справа (главный visual), спеки слева, кнопки SOLID/LAYERS/TOP/RESET — порядок зеркало
7. **Цифры и валюта**: ₪ остаётся, но формат `₪1,400—2,400 למ"ר` (примечание: иврит не флипает латиницу/цифры внутри RTL контекста, но эти острова должны быть LTR с `<bdi>`)
8. **Формы**: `text-align: right`, `direction: rtl` на инпутах

**Тест-протокол:**

- Snap каждой страницы в HE × mobile+desktop = ~80 скриншотов
- Manual проверка на iPhone (RTL поведение Safari отличается от Chrome)
- Тест: hover, click, scroll, swipe direction на mobile

### Phase 4 — SEO + meta (агент, ~1 час)

- `<link rel="alternate" hreflang="en" href="...">` на каждой странице
- `<link rel="alternate" hreflang="he-IL" href="...">`
- `<link rel="alternate" hreflang="ru" href="...">`
- `<link rel="alternate" hreflang="x-default" href="...">`
- Per-language `<title>` и `<meta description>`
- Per-language `<meta og:title>`, `<meta og:description>`
- Per-language OG cover image (текст наложен на картинку — 3 версии)
- Per-language sitemap.xml: `sitemap-en.xml`, `sitemap-he.xml`, `sitemap-ru.xml` + index
- robots.txt: разрешить crawl на все

### Phase 5 — QA + launch (агенты + Alexey, ~2 часа)

- Lighthouse per language (i18n score + SEO score)
- Snap всех страниц в 3 языках × mobile+desktop
- Clickthrough smoke test: каждая CTA, каждый toggle, каждая ссылка
- Telegram bot test (если есть language switch в боте)
- Form submission на каждом языке (что заявка приходит с пометкой языка)

---

## Распределение ролей агентов

| фаза | агент | тип | приоритет |
|---|---|---|---|
| 0 | Cartographer | Explore (читает HTML) | критично |
| 0 | Pollution-scanner | Explore (grep + анализ) | критично |
| 0 | Glossary-extractor | Explore (термы из текста) | критично |
| 1 | Domain-expert | claude (генерация EN/HE для glossary) | критично |
| 2 | EN-translator | claude (батчи по 50 keys) | критично |
| 2 | EN-validator | claude (side-by-side review) | high |
| 2 | HE-translator | claude (батчи) | критично |
| 2 | HE-validator | claude (review) | high |
| 3 | CSS-mirror | claude (RTL overrides) | критично |
| 3 | Layout-tester | claude (snap + анализ) | high |
| 4 | Meta-translator | claude (per-page meta) | medium |
| 4 | Sitemap-builder | claude (hreflang + sitemap) | medium |
| 5 | Snap-runner | claude (screenshots all combos) | high |
| 5 | Native HE proofreader | **HUMAN ONLY** | критично |

**Параллелизм:** Phase 0 — 3 агента одновременно (1.5 часа). Phase 2 — EN-translator + EN-validator последовательно, потом HE-translator + HE-validator. Phase 3 — параллельно с QA отдельных страниц.

---

## Бюджет: compute + time

**Локально:**

- Ollama llama3.2:3b — НЕ годится для HE (слабое качество)
- Hermes-3 free на OpenRouter — годится для черновика EN, слабо для HE
- OpenClaw gateway — orchestration

**Claude (платный, эта сессия):**

- 1256 ключей × 2 языка = 2512 переводов
- ~20 слов/ключ × 50 байт UTF-8 = 1000 байт/ключ
- Per-language: ~2 MB текста в обе стороны (input+output) × Claude pricing
- Опус 4.7: $15/M input, $75/M output. Грубо: 2M tokens input + 1M output на каждый язык = ~$45/язык
- **Итого: ~$90 на весь перевод**, не считая повторных проходов

**Дешевле:** использовать hermes-3-405b free для черновика, Claude только для review + HE finalization. **~$25-40 итого.**

**Human time (Alexey):**

- Glossary build: 1-2 часа (важно: только владелец знает IL-specifics)
- EN spot-check: 1-2 часа
- HE native review: либо сам если знает иврит на B2-уровне, либо найти native speaker (друг-архитектор, заказчик с прошлого года) — 2-3 часа

**Total wall-clock estimate:** 1.5—2 рабочих дня от старта до launch-ready.

---

## Что нужно от тебя (Alexey) ПЕРЕД стартом

1. **Глоссарий-входные данные** — 10-20 самых частых IL-flooring терминов которые ты используешь с клиентами на иврите. Это ядро glossary. Без этого агент придумает «правильный» иврит из словаря, который не звучит как ты.
2. **Решение по архитектуре** — OK на вариант (B)? Или предпочитаешь (A) multi-tree?
3. **Решение по compute** — могу гонять Claude API (~$30-45) или попробовать сначала бесплатные модели (Hermes-3) с риском хуже качества?
4. **Native HE proofreader** — есть ли в твоём окружении кто-то с native-уровнем кому можно доверить ревью? Если нет — лучше пока HE отложить и идти EN-first.
5. **Срочность** — это «для Instagram-показа на этой неделе» или «фундаментально, ради SEO»? Это диктует приоритеты: показ — фокус hero + 5 главных страниц на EN, остальное потом; SEO — все 80+ страниц нужны.

---

## Промты агентов (готовы к запуску)

### Phase 0 Agent A — Cartographer

```
Working dir: /Users/agentmachine/Work/02-Projects/floordsgn/floordsgn-site-new

Job: Build a complete i18n coverage map. For every HTML page in the repo,
report: (a) which `data-i18n` keys are used, (b) which appear in
translations.js, (c) which are missing (orphan in HTML), (d) which are in
dict but never used (dead).

Output: markdown table per file + summary stats. Top 20 most-used keys.
List of orphan keys + dead keys. Under 500 lines.
```

### Phase 0 Agent B — Pollution-scanner

```
Working dir: same.

Job: Find language pollution.
1. In /en/* — any Cyrillic chars (`[Ѐ-ӿ]`)?
2. In root /*.html with data-i18n — any hardcoded RU text that is NOT
   wrapped in data-i18n?
3. Meta tags (<title>, <meta description>, <meta og:*>) — are they
   translatable or fixed?
4. Attributes alt, placeholder, aria-label, title — translatable?
5. Hardcoded text in JS files that appears in UI?

Output: list of every offending location with file:line, the string, and
proposed fix (add data-i18n / move to dict / etc).
```

### Phase 0 Agent C — Glossary-extractor

```
Working dir: same.

Job: Build glossary skeleton.

1. Extract every unique noun-phrase that is technical/branded from RU pages:
   Sika SKUs, thickness ranges with units, slip classes, chemical names,
   IL-Hebrew loanwords (e.g., "Меда декоративи", "ת"י"), brand-specific
   phrases.
2. Output CSV: column 1 = RU term, column 2 = EN (leave empty),
   column 3 = HE (leave empty), column 4 = category (sku / unit /
   loanword / brand / noun-cat / cta / legal), column 5 = frequency.
3. Sort by frequency descending.

Target output: glossary-skeleton.csv with 100-200 rows.
```

(Phase 1, 2, 3 prompts — заполняем после OK на план.)

---

## Ловушки которые я знаю заранее

1. **Иврит и цифры/латиница**: внутри RTL-блока английская "Sikafloor-264" должна оставаться LTR. Без `<bdi>` или `dir="ltr"` обёрток получится «-Sikafloor 264» (минус справа). **Решение:** все brand-SKU в HE-tree обернуть в `<bdi>`.
2. **Hebrew typography**: иврит с дефолтным fallback-шрифтом выглядит ужасно. Нужен либо системный Heebo / Rubik / Noto Sans Hebrew, либо явный `font-family` override. Google Fonts: Heebo рекомендуется для B2B.
3. **Date/number формат**: «12 ноября 2026» на иврите = «12 בנובמבר 2026», не «November 12». Если есть динамические даты — `Intl.DateTimeFormat('he-IL')`.
4. **₪ положение**: на иврите ₪ ставится **после** числа: «1,400 ₪» (не «₪1,400»). Это редактируем per-language.
5. **Configurator material picker labels**: «Терраццо · мульти-цвет» — английский «Multicolor terrazzo» удлинняется на 40%, иврит «טראצו רב-צבעי» короче, но шрифт визуально больше. UI должен flexibly resize, иначе wrap-overflow на mobile.
6. **CTA-кнопки**: «Заказать формулу» = 16 chars. EN «Order this formula» = 18. HE «הזמן את הנוסחה» = ~13. Кнопки придётся пересмотреть на min-width, не на fixed-width.
7. **3D-конфигуратор группы**: «Декоративные» / «Промышленные» — на HE это «דקורטיביים» / «תעשייתיים». В RTL должны быть справа панели. UX-тест нужен.

---

## Risk: что может пойти не так

| риск | вероятность | impact | mitigation |
|---|---|---|---|
| HE-качество просядет без native review | high | trust-killer | блокируем HE launch до native ревью |
| Mixed-language pollution всплывёт уже после релиза | medium | стыдоба | Phase 0 Pollution-scanner ловит до релиза |
| RTL ломает существующий layout (overflow, cutoff) | high | mobile UX | snap-test all pages × mobile в Phase 3 |
| `translations.js` race-condition при batch update | low | data loss | atomic write + git commit per batch |
| Brand voice теряется в авто-переводе | medium | low-converting copy | glossary + Alexey spot-check на CTA |
| Стоимость Claude API выйдет за бюджет | low | $50-100 | использовать Hermes-3 для черновика |

---

## Решения которые надо принять сейчас (4 OK от Alexey)

1. **Архитектура:** вариант (B) — единое дерево + JS i18n (rec) или (A) multi-tree?
2. **Compute:** Claude (быстро + дорого ~$30-50) или Hermes-3 free (медленно + риск качества)?
3. **HE native proofreader:** есть кандидат? Если нет — стартовать с EN-only?
4. **Срочность:** Instagram-показ в эту неделю → фокус 5-10 главных страниц / 2 недели → полный сайт?

Скажи 4 ответа — запускаю Phase 0 (3 параллельных Explore-агента) и пишу промты для Phase 1-2-3.
