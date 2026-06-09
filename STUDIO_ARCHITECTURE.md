# STUDIO_ARCHITECTURE.md — канон Floor.DSGN Studio

> **Происхождение:** реконструировано из проверенного кода + находок NARYAD 03 (2026-06-09).
> Оригинал документа в репозитории отсутствовал — этот восстановлен по факту кода (источник правды).
> Оператор: ревью / заменить, если найдётся оригинал. На конфликт — DESIGN.md / SITEMAP.md / NAVIGATION.md / PERSONAS.md выше.

## 0. Что такое Studio
Studio = **пол в реальной комнате в 3D**, под аватар (персону). Это лид-инструмент. Вход — `floor-room.html` + `studio.js`.

## 1. Два чистых идеала — НИКОГДА не сливать
- **Studio** = `floor-room.html` + `studio.js`. Эталон: тег `studio-etalon-2026-06-04` = `8f7a6a5` («visual polish to ideal — SSAO grounding, no blown hotspots»).
- **3D-разбор по слоям** = `configurator.html` @ `83f6b45` — отдельная страница, **канон, не модифицировать**.

## 2. Коллапс (зачем этот канон)
07.06 коммит `a7185c4` начал СЛИВАТЬ Studio и 3D в один экран — вкладка «Слои/Layers», встраивающая 3D-разрез ВНУТРЬ Studio. Два дня метаний (modal → tab → two-card). **Корень коллапса = этот мёрж.** 3D-разрез никогда не встраивается в сцену Studio.

## 3. Карта файлов
| Файл | Роль |
|---|---|
| `floor-room.html` (~73.6 KB) | страница Studio; грузит `studio.js` + `studio.css` + 3D-движок (Three.js, GLB-комнаты) |
| `studio.js` (~62.3 KB) | persona-контроллер; читает control-чипы движка (`#floorCtl/#roomCtl/#finishCtl/#viewCtl`) и read-only `window.__room` API. **Движок НЕ импортирует этот файл.** |
| `studio.css` | стили панели Studio |
| `3d-assets/studio-personas.json` (~23 KB) | 9 персон (см. §6) |
| `studio.html` | **редирект → `floor-room.html`** (старый «floor system selector» ретайрнут; контент в git-истории) |
| `configurator.html` @ `83f6b45` | отдельная 3D-страница разбора по слоям — **не трогать** |

## 4. Интеграция Studio ↔ 3D — ЭТО канон (отдельная страница + card-link, не мёрж)
3D-разбор по слоям живёт ТОЛЬКО на `configurator.html`. Studio ведёт туда **card-link'ом**:
«Разобрать систему по слоям в 3D →» → `configurator.html?system=<тек>&material=<тек>&from=studio`.
Сцена Studio **никогда** не встраивает разрез/вкладку «Слои». Этот card-link заменил выпиленную Слои-вкладку.
(Pre-select системы в конфигураторе появится, когда `configurator.html` научится читать `?system` — сейчас @83f6b45 не читает; конфигуратор канон, правится отдельным нарядом.)

## 5. Фичи (проверено — присутствуют в эталоне 8f7a6a5)
- **Persona-контроллер:** `persona()`, `openChooser/closeChooser`, `applyPersona(id)`, persona-pill, чипы переупорядочиваются под персону.
- **Persona-gate:** chooser, skip → `applyPersona('explore')`. **На телефоне/планшете (≤1024) НЕ walled** (фикс 09.06): рабочий Studio показывается сразу, pill = opt-in; на десктопе chooser авто-открывается.
- **A/B-сравнение:** split-слайдер (`compareOpen`, `clipPath: inset(...)`, drag-handle, `aria-valuenow`).
- **Lead-with-persona:** `postLead` → `POST /lead` с `{persona, material, room, light, url, channel}`. (Живая доставка в TG зависит от секретов оператора — D-1, отдельно.)

## 6. Персоны
В `studio-personas.json` — **9 use-case-персон**: `explore` (дефолт) · `designer` · `architect` · `restaurant` · `warehouse` · `private` · `pro` · `safety` · `developer`. У каждой свои curated полы / CTA / инфо-иерархия.
⚠ Это НЕ 4 сайт-аватара из PERSONAS.md (Owner/Designer/Contractor/Builder). Ремап 9→4 — это редизайн (curated-логика на персону), отдельный наряд; здесь не предполагается.

## 7. Жёсткие правила
1. Никогда не встраивать 3D-разрез/Слои-вкладку в сцену Studio (корень коллапса).
2. Не модифицировать `configurator.html` (канон @ `83f6b45`).
3. `landing.html` — FROZEN. Эталон-коммиты (`studio-etalon-2026-06-04`=`8f7a6a5`, configurator `83f6b45`) не реверзить без явной просьбы.
4. `/studio` (и `studio.html`) ведут на floor-room-Studio.
5. Бренд по DESIGN.md: без emoji, одна Signal-точка на страницу.
