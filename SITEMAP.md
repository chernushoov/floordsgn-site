# SITEMAP.md — Floor.DSGN канонический сайтмап
Единственный источник правды по структуре сайта. Любая страница не из этого списка — кандидат на удаление. Решает структуру, язык, 301-редиректы и консолидацию дублей.

Репо: `~/Work/02-Projects/floordsgn/floordsgn-site-new` · прод: Cloudflare Pages → `floordsgn.com` · стек: vanilla HTML/CSS/JS.

---

## 1. КАНОНИЧЕСКИЕ РЕШЕНИЯ (зафиксированы)

1. **Таксономия:** `/floors/*` — единственная (44 страницы, богатая, с подсистемами). `/materials/*` (8 плоских) — УДАЛЯЕТСЯ, каждая → 301 на соответствующий `/floors/<x>/`.
2. **Версии-дубли:** `configurator.html` — боевая; `configurator-v3.html` → смержить лучшее, затем удалить. `studio.html` — боевая; `studio-legacy.html` → удалить.
3. **Язык:** каждая страница bilingual EN+RU через `translations.js`. Корень = RU default, EN в один клик. `he/` (~115 стр.) — заморожен до native-review (Phase 2), не публикуется.
4. **Де-раздутие репо:** `dist/` (485M) и `astro/` (189M) — вон из git (`.gitignore` + `git rm --cached`). `3d-assets/` (209M) — остаётся как исходник, кандидат на git-lfs/R2.
5. **Ветки:** 22 → схлопнуть. `main` — единственный trunk. `feature/studio-product-dropin` → review → merge в main. Мёртвые/save-ветки — prune.
6. **Инструменты:** ядро (в главной навигации) = Configurator, Studio, System Selector (decision-tool), Quote/BoQ, Sample-kit. Остальные 11 — второй слой (`/tools.html` hub), из главного меню убрать.

---

## 2. КАНОНИЧЕСКИЕ СТРАНИЦЫ

### 2.1 Корневые (KEEP)
| URL | Роль | Язык-статус |
|---|---|---|
| `/` (index.html) | главная: hero + конфигуратор | bilingual — привести к 100% |
| `/about` | о компании | bilingual |
| `/contact` | контакт + lead | bilingual |
| `/quote` | калькулятор сметы | bilingual |
| `/boq` | BoQ для тендера | RU → добить EN |
| `/projects` | галерея проектов (медиа!) | EN → добить RU |
| `/floors` | хаб систем | EN → добить RU |
| `/blog` | блог | EN → добить RU |
| `/designers` `/industrial` | сегментные лендинги | bilingual |
| `/thank-you` `/404` | служебные | bilingual |

### 2.2 Каталог систем — `/floors/*` (КАНОН, 8 хабов)
`concrete` (cream, full-aggregate, salt-pepper) · `epoxy` (anti-static, decorative, esd-conductive, seal-coat, self-leveling, troweled-hbs) · `microtopping` (standard, walls, wet-rooms) · `mma` (cold-storage, decorative, fast-cure-industrial) · `pu-cement` (cove-base, heavy-duty, satin, standard) · `restoration` (concrete-renewal, full-renewal, recoat, terrazzo-repolish) · `rubber` (comfortfloor, poured, sheet, tile) · `terrazzo` (epoxy, mineral, palladiana, venetian).
Язык-статус: добить bilingual по всем 44.

### 2.3 Инструменты — ядро (KEEP в главном меню)
`/configurator` · `/studio` · `/decision-tool` (System Selector) · `/quote` + `/boq` · `/sample-kit`

### 2.4 Инструменты — второй слой (KEEP, но только в /tools hub)
`/compare` · `/tco` · `/substrate-check` · `/coastal-chloride-audit` · `/care-guide` · `/warranty` · `/faq` · `/haccp-package` · `/repair-or-replace` · `/visualizer` · `/room-visualizer` · `/floor-room`

### 2.5 Энциклопедия — `/articles/*` (KEEP, ~110 EN)
base (~63) · `brands/` (~24) · `comparisons/` (~12) · `encyclopedia/` (~11) · `resources/` (2). Контент-актив, не трогать структуру. RU-перевод — отдельный трек.

### 2.6 Вертикали — `/verticals/*` (KEEP, 4)
`architects` · `healthcare` · `hospitality` · `warehouse`.

### 2.7 Прочее (KEEP)
`/specs/*` (CAD) · `/admin` (CMS-вход) · `/api/*` (lead/contact serverless) · `/3d-assets-cfg/plates/viewer.html`.

---

## 3. 301-РЕДИРЕКТЫ (Cloudflare `_redirects` / `_headers`)

```
/materials/concrete      /floors/concrete       301
/materials/epoxy         /floors/epoxy          301
/materials/microtopping  /floors/microtopping   301
/materials/mma           /floors/mma            301
/materials/pu-cement     /floors/pu-cement      301
/materials/restoration   /floors/restoration    301
/materials/rubber        /floors/rubber         301
/materials/terrazzo      /floors/terrazzo       301
/materials/*             /floors/:splat         301   # safety catch-all
```
После деплоя редиректов — `materials/*.html` удалить из репо. Проверить: ни одна внутренняя ссылка (nav, footer, articles) не указывает на `/materials/`.

---

## 4. УДАЛИТЬ / АРХИВИРОВАТЬ
- `materials/*` (8) — после 301.
- `configurator-v3.html`, `studio-legacy.html` — после консолидации.
- `dist/`, `astro/` — из git (в .gitignore).
- `.netlify/`, `.netlifyignore` — legacy, вычистить (прод на Cloudflare).
- `configurator.legacy-82b7b7e.html.bak` и прочие `.bak` — удалить.
- Save/backup-ветки терраццо/hero — prune после проверки что всё в main.

---

## 5. НЕДОВЫЛОЖЕННОЕ (in-flight → решить)
| Артефакт | Действие |
|---|---|
| `feature/studio-product-dropin` (без upstream) | push → review → merge в main |
| `he/` ~115 страниц | держать, Phase 2, native-review гейт |
| `launch/floordsgn-com-cf` (e2e 20/20) | сверить с main, влить нужное, prune |
| 3D textures-v4 (untracked) | закоммитить в 3d-assets или вынести в R2 |
| `/lead` Telegram secrets | ⚠ выставить CF-секреты (см. BACKLOG D1) |
