# Stack Decision — Floor Encyclopedia

_Дата: 2026-05-10. Принято в рамках Этапа 0._

## Выбор: Astro

Сайт мигрирует с **Parcel + ручной HTML** на **Astro** для энциклопедической части.

## Почему не Next.js + MDX (как в плане)

- Next.js — это SSR-фреймворк под динамику. Энциклопедия — статика.
- Лишний рантайм, лишние билды, лишний хостинг.
- MDX в Next требует ручной настройки content layer; в Astro оно из коробки.

## Почему не остаёмся на Parcel

- Нет шаблонизации — header/footer повторены 160 раз.
- Нет content collections — YAML придётся обвязывать своим Node-скриптом.
- i18n с RTL — пилить руками.

## Почему Astro

| Возможность | Astro | Зачем |
|---|---|---|
| Static-first | да | Энциклопедия 280 страниц + кэш Netlify CDN |
| Content collections + Zod | да | Один YAML → одна страница, валидация на билде, **заменяет JSON Schema** из плана |
| MDX | из коробки | Можно вкраплять интерактивные блоки (калькулятор, decision tool) в статичный текст |
| i18n routing | встроен | `/he/`, `/en/`, `/ar/` без настройки |
| RTL | через `<html dir>` + CSS logical properties | Готово для HE/AR |
| Islands architecture | да | Material Lab `enhance.js` остаётся как island, не ломается |
| Deploy | Netlify adapter | Та же команда `npm run build`, тот же `dist/` |
| Миграция HTML | парсер + автоконвертер за один скрипт | Существующие 160 страниц → MDX за один проход Claude |

## Что меняется в репозитории

- `src/content/materials/*.yaml` — единственный источник истины контента.
- `src/content/config.ts` — Zod-схема (auto-derived из `encyclopedia/schema/material.schema.yaml`).
- `src/layouts/MaterialLayout.astro` — единый шаблон страницы материала.
- `src/pages/floors/[slug].astro` — динамический роут, читает контент-коллекцию.
- `src/pages/[lang]/floors/[slug].astro` — locale-aware роуты.
- Build: `npm run build` остаётся, но внутри Astro вместо Parcel.
- Deploy: Netlify, тот же `netlify.toml`, тот же `dist/` (он же `_site/` в Astro по умолчанию, перенастроим в `astro.config.mjs`).

## Что НЕ меняется

- `index.html` (homepage) — пока остаётся как есть, мигрирует одним из последних.
- Material Lab (`enhance.js` + `materials.config.json`) — переезжает как Astro Island, без переписывания JS.
- Decap CMS в `/admin/` — оставляем, в Phase 4 интегрируем с YAML-источником.
- Netlify functions (`/api/contact`, `/api/lead`) — без изменений.
- Шрифты, картинки, общие CSS-токены — переносим один в один.

## Migration order

1. Параллельная установка Astro в подпапке `astro/` (не ломая текущий билд).
2. Перенести один материал-эталон (epoxy-self-leveling) полностью на Astro.
3. Сравнить визуал side-by-side с текущей страницей.
4. Конвертер: HTML → YAML для остальных материалов (один проход Claude API).
5. Переключение `netlify.toml` `publish` на Astro-сборку, когда покрытие ≥ 95%.

## Проверка решения

Решение пересматривается, если:
- Astro не даст приемлемого SEO-вывода (HTML/CSS должен быть статически доступен поисковикам — критично).
- i18n routing Astro не справится с 4 языками + RTL без хаков.
- Material Lab не получится упаковать как Island.

Если хоть один пункт выстрелит — fallback на 11ty (тот же static-first подход, проще, но без MDX).
