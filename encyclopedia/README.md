# Floor.DSGN — Encyclopedia

Это новая ветка контента сайта: **справочник по материалам полов и ремонту бетона**, не маркетинговые страницы.

Стартовали 2026-05-10 на ветке `encyclopedia` от `enhance-features`.

## Что здесь лежит

```
encyclopedia/
├── README.md                              ← вы здесь
├── docs/
│   └── STACK.md                           ← решение по стеку (Astro), миграция, что не трогаем
├── schema/
│   └── material.schema.yaml               ← JSON-Schema, контракт между Writer-агентом и фронтом
├── materials/
│   └── epoxy-self-leveling.yaml           ← golden sample #1 (эталон для всех 280 страниц)
├── case-studies/                          ← 1 проект = 1 YAML, в Phase 3
├── glossary/                              ← CSP, RH, Mohs, Taber и т.д., в Phase 2
└── (assets/, diagrams/ — добавятся по ходу)
```

Полный план: `~/Downloads/FLOOR_ENCYCLOPEDIA_PLAN.md`.

## Как работает контент-цикл (целевое состояние)

1. **Scout** (Python cron, 6h) мониторит TDS-источники, ICRI/ACI релизы, IL форумы → Postgres.
2. **Curator** (Claude Sonnet) триажит: новое/дубль, релевантно, в какое семейство, приоритет 1–5.
3. **Writer** (Claude Sonnet) пишет YAML по `schema/material.schema.yaml`, цитирует источники с url+датой.
4. **Reviewer** (другой Claude-инстанс) проверяет каждое число против TDS, ловит маркетинг-пух, требует numeric ranges.
5. **Editor (оператор)** получает в Telegram ссылку на дашборд → approve / edit / reject.
6. **Publisher** делает PR в репо, Netlify deploy preview, после merge — production + sitemap update + IndexNow ping.

## Текущая фаза: Этап 0 (fixup) — в работе

- [x] Branch `encyclopedia` создана от `enhance-features`
- [x] Audit: `/materials/` ≠ `/floors/` (не дубли, разные языковые angles)
- [x] Stack decision → Astro
- [x] YAML schema v1
- [x] Golden sample #1 (Self-leveling epoxy)
- [ ] Sitemap.xml пересобрать с подстраницами `/floors/{system}/{variant}/`
- [ ] Исправить домен в sitemap (сейчас `vercel.app`, нужен production)
- [ ] Audit `/admin/` Decap CMS — отключаем или интегрируем

## Следующие шаги (Этап 1)

1. **Astro setup** в `astro/` подпапке параллельно текущему билду.
2. **Zod-схема** автогенерация из `material.schema.yaml`.
3. **MaterialLayout.astro** — единый шаблон, рендерит YAML в HTML.
4. **i18n routing** для RU/EN на старте.
5. **Конвертер**: 30+ существующих `/floors/{system}/{variant}.html` → YAML (один проход Claude API).
6. **Ещё 4 golden samples**: Polished concrete cream, Microcement, ЦПС стяжка, PU-cement Sikafloor-21.

## Что НЕ трогаем

- `index.html` — homepage заморожен.
- `enhance.js` + `materials.config.json` — Material Lab переезжает как Astro Island, не переписываем.
- Текущие `/floors/`, `/materials/`, `/articles/` — параллельно сосуществуют, пока миграция не достигнет 95%.
- Decap CMS в `/admin/` — пока не интегрируем.

## Деньги

- Сейчас (Этапы 0–1): **$0**, всё на существующих ключах.
- Этап 1 тесты промптов: ~$20–50 в Claude API.
- Этап 2 массовая генерация ~280 страниц + переводы: ~$800–1,200 одноразово.
- Постоянка после запуска: ~$25–65/мес.

## Контакты по схеме

- Принципал: Алексей Чернышев (Floor.DSGN owner)
- Архитектор: Claude (через Claude Code)
- Деплой: Netlify
- API ключи: ANTHROPIC, OPENROUTER (уже в `~/.openclaw/env/openclaw-runtime.env`)
