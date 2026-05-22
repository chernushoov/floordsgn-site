# Задача для Codex: блог Floor.DSGN — сортировка по разделам + все готовые статьи + полная двуязычность

## Репозиторий и контекст
- Работай в корне: `/Users/agentmachine/Work/02-Projects/floordsgn/floordsgn-site-new` (статический мультиязычный сайт, ~104 HTML; RU-исходник + клиентский своп на EN).
- ПЕРЕД любыми правками прочитай `DESIGN.md` (бренд «Industrial Proof») — палитра, шрифты, правила. Не нарушать.
- НЕ ТРОГАТЬ etalon-файлы: `index.html` hero-блок (3D-сцена, ~строки 177–224), `configurator.html` (целиком), `landing.html` (заморожен). Если правка их касается — остановись и опиши, не меняй.
- Не деплоить и не пушить. Только правки в коде + локальная проверка. Build/deploy сделает владелец после ревью.

## Как устроена двуязычность (важно — не сломать)
- `translations.js` объявляет `const translations = { en:{…}, ru:{…} }`. Это **НЕ** `window.translations` (block-scoped). Любой inline `_t()`-хелпер должен брать лексический `translations`, не `window.translations`, иначе всегда падает в RU.
- `setLanguage(lang)` проходит по всем `[data-i18n="key"]` и ставит `translations[lang][key]`: INPUT/TEXTAREA → placeholder; если значение содержит инлайн-тег (regex `/<(br|strong|em|b|i|u|sup|sub|a|span|small|mark)[\s>/]/`) → innerHTML; иначе textContent.
- `initLanguage()` при загрузке читает localStorage `floordsgn_lang` (иначе navigator.language: en→en, иначе ru). Статический HTML по умолчанию показывает EN-фоллбэк, JS свопит на лету.
- **Кэш-бастинг ОБЯЗАТЕЛЕН:** если меняешь `translations.js` / `styles.css` / `chrome-fix.css` / `enhance.js` — подними `?v=` во ВСЕХ ссылках на изменённый файл по всему сайту (сейчас `?v=20260520b` для translations/styles, `?v=20260520c` для chrome-fix/enhance — подними до `20260521a`). Иначе вернувшиеся посетители получат старую версию и фикс «не доедет».

## Текущее состояние блога (факты — проверены в коде)
1. `blog.html` — сетка из 11 карточек статей (строки 64–174), у каждой `data-cat` (all/materials/installation/maintenance/comparisons/trends). Кнопки-фильтры строки 51–60. JS-фильтр строки 218–235 (корректный по логике).
2. **ПРОБЛЕМА A — «не доделано»:** 7 из 11 карточек показывают `<span class="read-more is-soon" data-i18n="blog_article_soon">Скоро · в подготовке</span>` БЕЗ ссылки — хотя файл статьи СУЩЕСТВУЕТ и готов. Соответствие карточка → готовый файл:
   - article1 (Terrazzo in Modern Interiors, trends) → `articles/terrazzo-modern-interiors.html`
   - article2 (Microtopping vs Epoxy, comparisons) → `articles/microtopping-vs-epoxy.html`
   - article4 (Substrate Moisture Testing, installation) → `articles/substrate-moisture-testing.html`
   - article6 (Terrazzo vs Microtopping, comparisons) → `articles/terrazzo-vs-microtopping.html`
   - article7 (MMA fast cure, installation) → `articles/mma-fast-cure.html`
   - article9 (Self-Leveling Screeds, materials) → `articles/self-leveling-screeds.html`
   - article10 (When to Recoat, maintenance) → `articles/when-to-recoat.html`
   Уже связаны корректно: article3→`epoxy-vs-polyurethane.html`, article5→`industrial-cleaning.html`, article8→`2026-trends.html`, article11→`concrete-crack-repair.html`.
3. **ПРОБЛЕМА B — «куча одной скипой»:** на странице блога вкладка «Material Guides» (а возможно и другие) даёт визуально пустую выдачу, хотя в категории есть карточки (#3, #9). Плюс общий вид — плоская недифференцированная сетка без ощущения разделов.
4. **ПРОБЛЕМА C — двуязычность статей сломана:** страницы `articles/*.html` имеют i18n только на «хроме» (~28 data-i18n: nav/header/footer), а ТЕЛО статьи захардкожено на одном языке (английском: 0 кириллицы, заголовки «Understanding the Chemistry» и т.п.). При переключении на RU хром русский, а тело английское — именно эту несогласованность владелец не терпит.
5. **Орфан:** `articles/index.html` («Floor Engineering Articles») — второй список-дубль, на него ничего не ссылается (нав ведёт на `blog.html`). НЕ путать с `articles/encyclopedia/index.html` — это рабочая энциклопедия, её содержимое не трогать.

## Что сделать

### Фаза 1 — обязательная
**1. Связать все готовые статьи (Проблема A).** В `blog.html` заменить 7 «is-soon»-заглушек на реальные ссылки по таблице выше, формат как у рабочих карточек:
`<a href="articles/FILE.html" class="read-more" data-i18n="blog_articleN_link">Read Article</a>`
+ добавить ключи `blog_articleN_link` в `translations.js` (en: `Read Article`, ru: `Читать статью`). Заглушку-ключ убрать только если он больше нигде не используется.

**2. Сортировка / разделы (Проблема B).** Сначала диагностировать, почему фильтр даёт пустую выдачу для «Material Guides» (есть 2 карточки materials — #3, #9 — но визуально пусто; проверь, нет ли перехвата в `enhance.js`, конфликта `display`, или проблемы с лэйаутом грида при скрытии `.featured`-карточки). Починить так, чтобы КАЖДАЯ категория надёжно показывала свои карточки. Затем сделать блог визуально организованным по разделам: упорядочить карточки сгруппированно по категориям и/или добавить заголовки секций (строго в бренде DESIGN.md). Вид «All» должен читаться как структурированный список, а не «куча».

**3. Полная двуязычность тел статей (Проблема C).** Для КАЖДОЙ из 11 статей `articles/*.html` тело должно быть доступно на RU и EN.
   - **Рекомендуемый подход (для длинных текстов чище, чем сотни data-i18n ключей): дублирующиеся языковые блоки.** Обернуть EN-версию тела в контейнер `data-lang-block="en"`, RU-версию — `data-lang-block="ru"`. Перевести существующий EN-текст на профессиональный инженерно-флористический русский (термины и нормативы сохранять; единицы конвертировать: mm→мм, kg→кг, m²→м²; проперноуны/стандарты ICRI/ACI/EN не трогать).
   - **Интеграция с СУЩЕСТВУЮЩИМ переключателем** (единственная правка shared-функции, additive): в `translations.js` в конце `setLanguage(lang)` добавить:
     ```js
     document.querySelectorAll('[data-lang-block]').forEach(function(el){
       el.style.display = (el.getAttribute('data-lang-block') === lang) ? '' : 'none';
     });
     ```
     По умолчанию (до JS) показывать EN-блок, RU-блок ставить `style="display:none"` (консистентно с «статический HTML = EN-фоллбэк»). Подними `?v=` для `translations.js` по всему сайту.
   - Хром статей (nav/header/footer/lang-switch) уже на data-i18n — оставить как есть.
   - Допустимая альтернатива (если предпочтёшь единый механизм): data-i18n на каждый элемент тела + ключи с пер-статейным префиксом в `translations.js`. Но это сотни ключей в глобальном файле, грузящемся на каждой странице. Решение за тобой; РЕЗУЛЬТАТ один — обе языковые версии полные, без утечки чужого языка.

**4. Орфан `articles/index.html`.** Поставить `<meta name="robots" content="noindex">` и редирект/явную ссылку на `blog.html`, либо удалить — чтобы не плодить дубль-индекс. (Энциклопедию `articles/encyclopedia/*` не трогать.)

### Фаза 2 — если останется бюджет (расширение блога готовым контентом)
В `content/blog/*.md` лежат готовые черновики, которых ещё нет как статей: `lobby-tel-aviv-terrazzo.md`, `polished-concrete-industrial.md`, `mma-flooring-industrial.md`, `epoxy-3d-transparent.md`, `floordsgn-portfolio-vysota.md`, `floordsgn-article-microtopping.md`. Опубликовать как новые статьи `articles/<slug>.html` по образцу существующих (тот же layout, хром на data-i18n, тело двуязычным блоком RU+EN), добавить карточки в `blog.html` в правильную категорию. Это другие ракурсы (кейсы/портфолио), не дублировать один-в-один существующие темы.

## Жёсткие правила (бренд + безопасность)
- Палитра: Carbon `#151515`, Steel `#72716D`, Signal `#C86B3C`, Concrete `#F3F0EA`, Graphite `#2D2D2D`. Других цветов нет. Никакого `#000`.
- Шрифты: Cormorant Garamond (display) + Montserrat (всё остальное). Третий шрифт = баг.
- Никаких emoji в UI. Одна Signal-точка на страницу. Pill-кнопки (980px).
- Не трогать etalon (hero-3D в index.html, configurator.html, landing.html). Не деплоить/не пушить.
- Не менять русский смысл существующих текстов; перевод EN→RU — с технической точностью.

## Проверка (ОБЯЗАТЕЛЬНО перед отчётом)
Playwright есть в `node_modules`. Подними локальный статический сервер из КОРНЯ репо (страницы используют относительные пути к ассетам) и снапь оттуда. Для `blog.html` и КАЖДОЙ изменённой статьи:
1. Загрузить headless, вызвать `setLanguage('en')` → скриншот; `setLanguage('ru')` → скриншот. Прочитать оба PNG глазами.
2. Подтвердить: (a) в EN тело БЕЗ кириллицы; (b) в RU тело по-русски (нет «английский хром + русское тело» и наоборот, нет литералов разметки вроде `<br>` как текста); (c) лэйаут цел.
3. `blog.html`: прокликать КАЖДУЮ категорию фильтра — показываются именно совпадающие карточки (ни одна непустая категория не пуста), все «Read Article» ведут на существующие файлы (нет 404, нет оставшихся «coming soon» для готовых статей).
4. **Регрессия shared-правки `setLanguage`:** снап ещё на 3 разнотипных страницах (`index.html`, любая `floors/*`, любой tool-page напр. `decision-tool.html`) в EN и RU — ничего не должно сломаться.

## Отчёт
- Список изменённых файлов.
- Сколько карточек связано; какие категории починены; что было причиной пустой выдачи фильтра.
- Какой механизм двуязычности применён к телам и сколько статей переведено.
- Результат снап-проверки по каждой странице (EN/RU — чисто/нет).
- Любой мешающий текст из `enhance.js`/shared `.js` — НЕ чинить, а сообщить.
