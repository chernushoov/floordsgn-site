# Overnight Prompt — FloorDSGN session 2026-05-27 → 2026-05-28 05:00

**Время старта:** 22:00 IDT
**Дедлайн проверки:** 05:00 IDT (owner вернётся)
**Окно работы:** 7 часов
**Минимум по контракту:** 6 часов непрерывной работы
**Прецедент:** 2026-05-27 — остановился в 01:49 после 90 минут, owner потерял доверие. **НЕ ПОВТОРЯТЬ.**

---

## Главное правило — БЕЗ ОСТАНОВКИ

1. **Не спрашиваю owner ничего.** Все блокеры → `docs/BLOCKERS_FOR_OWNER_2026-05-28.md` + продолжаю с следующей задачи.
2. **Не останавливаюсь раньше 05:00** под предлогом «всё готово». Если фазы прошли быстрее плана — беру следующие из master-плана.
3. **Не деплою ничего.** Netlify/Vercel запрещены до явного go.
4. **Только additive.** Новые файлы, новые директории. Existing файлы трогаю только если они НЕ в etalon-списке (см. ниже).
5. **Коммитю часто, мелко.** Каждая страница → отдельный коммит. Owner утром делает review через git log.

---

## Контракт работы (что должно быть готово к 05:00)

**Минимум (must):** 4 страницы — Wave A close
**Целевой (target):** 7 страниц — + comparison troika
**Растяжка (stretch):** 11 страниц — + 4 brand profiles
**Финал (always):** MORNING_BRIEFING + a11y + snap

### Phase 2: Wave A close (4 страницы, 22:15 → 00:30 — ~2ч15м)
1. `articles/encyclopedia/microcement-binder-chemistry.html` — 4 семьи связующего (~2200 слов)
2. `articles/encyclopedia/microcement-known-issues.html` — 9 типов дефектов (~2400 слов, FAQPage schema)
3. `articles/resources/index.html` — хаб ресурсов + 15 outbound (~1500 слов)
4. `articles/resources/standards-glossary.html` — глоссарий (~1800 слов, DefinedTermSet)

### Phase 3: Comparison troika (3 страницы, 00:30 → 03:30 — ~3ч)
Самые ценные SEO assets из плана.
5. `articles/comparisons/purcem-vs-ucrete-vs-flowfresh.html` — топ buyer-stage запрос
6. `articles/comparisons/microcement-brands-7way.html` — 7-way: Topciment / Mortex / Sika DecoDur / Marmorino / Pavistamp / Ideal Work / Smartcret
7. `articles/comparisons/sika-vs-mapei-vs-mastertop.html` — industrial Big-3

### Phase 4: Brand profiles (4 страницы, 03:30 → 04:30 — ~1ч)
8. `articles/brands/ucrete.html` — PU-cement gold standard
9. `articles/brands/flowcrete-flowfresh.html` — Polygiene antimicrobial
10. `articles/brands/mortex.html` — béton ciré
11. `articles/brands/pavistamp.html` — стамповый бетон + PAVICEM

### Phase 5: QA + Morning Brief (04:30 → 05:00 — ~30м)
- `npm run snap <page>` для каждой новой страницы → PNG в `_screens/`
- `npm run a11y` → не должно быть новых errors относительно baseline
- `node scripts/find-404.js` если он работает
- `npx -y @google/design.md lint DESIGN.md` → 0 errors, ≤4 warnings
- Написать `docs/MORNING_BRIEFING_2026-05-28.md`:
  - Список созданных страниц с word-count
  - Список открытых блокеров (если есть)
  - Git log diff
  - Что я НЕ сделал и почему

---

## Etalon-файлы — НЕ ТРОГАТЬ

Из CLAUDE.md и memory:
- Etalon коммиты: `cc421cf`, `076fdbc`, `23ed628`, `db80612` — не амендать, не реверсить
- Etalon файлы (не модифицировать):
  - `index.html` (hero3d landing)
  - `configurator.html` (mobile HUD)
  - `landing.html` (7-layer animation)
- DESIGN.md — трогать только через лимитированные правки, lint должен оставаться 0 errors

## Бренд (Industrial Proof) — жёстко

- Палитра: Carbon `#151515` / Steel `#72716D` / Signal `#C86B3C` / Concrete `#F3F0EA` / Graphite `#2D2D2D`
- Шрифты: Cormorant Garamond (display) + Montserrat (body). Третий шрифт = баг.
- Одна Signal-точка на страницу. Pill-кнопки (980px). Никаких emoji в HTML.
- Никакого `#000` (только Carbon `#151515`)
- `<link rel="stylesheet" href="/styles.css">` + `<link rel="stylesheet" href="/enhance.css">` на каждой новой странице (clone подход)

## Шаблон новой страницы

Структура каждой статьи:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>...</title>
  <meta name="description" content="...">
  <link rel="canonical" href="https://floordsgn.com/articles/...">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/enhance.css">
  <link rel="stylesheet" href="/articles/encyclopedia/_article.css">
  <!-- Open Graph -->
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:type" content="article">
  <!-- JSON-LD Schema -->
  <script type="application/ld+json">{...}</script>
</head>
<body>
  <!-- header partial -->
  <header class="site-header">...</header>
  
  <main class="article-shell">
    <article>
      <h1>...</h1>
      <p class="lede">...</p>
      <!-- sections -->
    </article>
  </main>
  
  <!-- footer partial -->
  <footer>...</footer>
</body>
</html>
```

Перед каждой новой страницей — Read existing etalon из `articles/encyclopedia/epoxy-sl.html` или `articles/substrate-mechanical-prep.html`, копирую header/footer markup.

## Per-page quality gate

Каждая страница перед `git commit`:
1. Открыть файл руками → визуально не битый HTML
2. grep на запрещённые цвета: `grep -E "#000\b|#fff(?!_|f)|#ffd|#1e9|#10b" file.html` → 0 hits (кроме `#fff` в фоне)
3. grep на emoji unicode (минимум: `grep -P "[\x{1F300}-\x{1F9FF}]"`) → 0 hits
4. grep на font-family → только Cormorant Garamond и Montserrat
5. ≥3 outbound `https://` ссылок (ICRI/FeRFA/DIN/ASTM/SII/manufacturer TDS)
6. JSON-LD валидируется (минимум — присутствует `<script type="application/ld+json">`)
7. Single Signal accent (≤1 `#C86B3C` highlight в primary content)

## Источники

Research в `docs/research/`:
- `substrate-prep.md` — для substrate cluster
- `decorative-brands.md` — для decorative brand pages
- `industrial-brands.md` — для industrial brand pages
- `rubber-and-microtopping.md` — для microcement-binder-chemistry + comparisons
- `choosing-the-right-floor.md` — для decision guides (already used)
- `industry-portals.md` — для resources/index + outbound citation pool

Brand data в `data/brands/*/profile.md` (11 брендов).

## Blocker policy

Если упёрся:
1. Записать в `docs/BLOCKERS_FOR_OWNER_2026-05-28.md`:
   - Что именно блокирует
   - Что я попробовал
   - Какой best-effort fallback применил (если применимо)
   - Что нужно от owner (конкретный вопрос/действие)
2. **Не звонить, не AskUserQuestion.** Owner придёт в 05:00.
3. Перейти к следующей задаче — не зависать.

Известные blocker'ы (Q1–Q7 из master plan, уже задокументированы):
- Q1 Morris бренд?
- Q2 Italprotec = Ideal Work?
- Q3 Cemplaster/Smartrenders бренды?
- Q4 Sikafloor-470 микроцемент или underlayment?
- Q5 IL-дистрибьюторы для Mapei/Master Builders/Altro/Polyflor
- Q6 ₪/m² 2026 цены
- Q7 Etalon scope

Все эти блокеры обходятся словами «по данным TDS на 2026; уточнить у IL-rep» или диапазонами «ориентировочно».

## Commit convention

```
feat(encyclopedia): microcement-binder-chemistry — 4 binder families (~2200 words)

- Cement-polymer (Topciment, Mortex)
- Lime-cement hybrid (Marmorino)
- Pure lime (Tadelakt)
- Epoxy-cement (Pavistamp PAVICEM)
- 5 outbound citations: TDS + FeRFA + ICRI
- JSON-LD Article + HowTo

Wave A page 7/10.
```

Branch остаётся `launch/floordsgn-com-cf`. Не пушу — owner сам сделает push после review.

## Hourly checkpoint (для самопроверки)

- 23:00 — должно быть ≥1 страница готова + закоммичена
- 00:30 — ≥4 страницы (Phase 2 done)
- 02:00 — ≥6 страниц (Phase 3 в работе)
- 03:30 — ≥7 страниц (Phase 3 done)
- 04:30 — ≥10 страниц (Phase 4 done или почти)
- 05:00 — MORNING_BRIEFING написан + commit

Если в 23:00 нет ни одной страницы — сократить scope, упростить, продолжать. Цель — НЕ остановиться.

## Внешние ресурсы

- DESIGN.md lint: `cd ~/Work/02-Projects/floordsgn/floordsgn-site-new && npx -y @google/design.md lint DESIGN.md`
- a11y: `npm run a11y`
- snap: `npm run snap <page-path>` (пример: `npm run snap articles/comparisons/purcem-vs-ucrete-vs-flowfresh.html`)
- 6 humanize prompts: `/Users/agentmachine/Work/02-Projects/meltbot/moltbot-dashboard/docs/project-context/HUMANIZE_AI_TEXT_PROMPTS_2026-05-27.md`

## Финальное

**Я работаю до 05:00. Точка.**
Owner придёт, увидит 4-11 новых страниц + MORNING_BRIEFING + чистый commit log + a11y green + screenshots. Делаем парно с MacBook когда подойдёт.

Сейчас 22:00. Поехал.
