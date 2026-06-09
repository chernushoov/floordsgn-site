# LIBRARY_ARCHITECTURE.md — Floor.DSGN Knowledge Library + Blog

Контент библиотеки — сильнейший актив (112 статей EN/RU + 120 HE: BOQ, IL-стандарты, ICRI CSP, pull-off, сравнения брендов, энциклопедия, use-case спеки). Проблема не в контенте — в упаковке. Этот документ задаёт упаковку.

## 1. ПРОБЛЕМА
Дизайн = стена ссылок (8 pillars по 4-19 ссылок, без карточек/визуала). Ноль фото. Языковая каша (полуперевод). Два входа в одно (Library 8 pillars + Blog 5 категорий = пересекающийся контент, путаница).

## 2. ГЛАВНОЕ РЕШЕНИЕ: Library и Blog — ЭТО ОДНО
Одна Knowledge Library. Два входа в один набор статей: по роли (Owner/Designer-Architect/Contractor/Builder) и по теме (8 pillars). Blog = лента «Свежее» внутри Library. Один пункт меню "Library". blog.html → 301 на /library.

## 3. СТРУКТУРА /library
HERO («Инженерная библиотека полов» + поиск) → ВХОД ПО РОЛИ (4 карточки наверху) → ВХОД ПО ТЕМЕ (8 pillars карточками) → СВЕЖЕЕ (лента блога) → CTA «Curated path за 48ч» → /lead.

## 4. ДИЗАЙН — карточки, не стена ссылок
Каждая статья = карточка: превью-фото + pillar-бейдж + persona-бейдж + заголовок + 1 строка сути + время чтения. Pillar = секция с карточкой-обложкой → грид 3-кол (1 моб). Бренд DESIGN.md: Cormorant заголовок, Montserrat тело, ОДИН Signal-акцент на карточку, поверхности Concrete/Surface-2, no emoji (линейные SVG-иконки).

## 5. READING-PATHS ПО РОЛЯМ (4 site-wide аватара, НЕ 9 Studio-персон)

| Роль | Что видит | Reading-path |
|---|---|---|
| Owner | выбор системы, цены, ошибки, гарантия | role-targeted-faq → floor-system-selection-by-use-case → floor-procurement-timeline → 10-most-expensive-floor-mistakes-il |
| Designer/Architect | спека, сравнения, бренды, BOQ | comparisons (microtopping-vs-polished, epoxy-terrazzo-vs-cement-terrazzo) → brands/index → floor-tender-boq-template → architect-pretender-checklist |
| Contractor | расход, монтаж, handover, оценка | floor-procurement-timeline → substrate (icri-csp, moisture, mechanical-prep) → floor-handover-inspection-checklist → floor-warranty-types-explained |
| Builder/Procurement | стандарты, HACCP, compliance, use-case | floor-compliance-verification-checklist → israeli-floor-standards-explained → use-case spec (hospital/kitchen/brewery) → floor-tender-boq-template |

Клик по роли → фильтр ленты + reading-path. Совпадает с site-wide persona-моделью (один аватар сквозь Studio/конфигуратор/библиотеку).

## 6. 8 PILLARS (маппинг)
1. Decision & Selection — role-faq, system-selection-by-use-case, procurement-timeline, how-to-evaluate-installer, floor-decision-guide, floor-decision-tree, floor-use-cases, floor-anti-patterns
2. Tender & Documentation — tender-boq-template, warranty-types, handover-inspection, 10-mistakes, architect-pretender-checklist
3. Standards & Compliance — compliance-verification-checklist, slip-class-DIN-51130, israeli-floor-standards, adhesion-pull-off-test
4. Substrate & Install — icri-csp-surface-profile, substrate-moisture-remediation, expansion-joints, ufh-compatibility, substrate-mechanical-prep, substrate-defects-handbook
5. Use-Case — pu-cement-vs-epoxy-kitchen, cold-stores-freezers, brewery-spec, commercial-kitchen-spec, hospital-spec, tel-aviv-boutique-hotel
6. Comparisons — все articles/comparisons/* (12)
7. Encyclopedia — все articles/encyclopedia/* (13, RU) + brand-agnostic system primers
8. Brands & Channel — все articles/brands/* (24)

Базовые 62: разложи по pillar 1-5 выше + что не вошло — твой первый проход, я проверю. brands→8, comparisons→6, encyclopedia→7 (по папкам, как ты и сказал).

## 7. ИНФОРМАТИВНОСТЬ
На карточке сразу: тема, кому, время чтения, суть. Внутри статьи: хлебные крошки (Library→Pillar→статья) + «дальше по маршруту роли» + связанные 3-7 статей карточками. Фильтр сверху: pillar × роль × текст, мгновенный. Числа везде («8 pillars», «N статей», «12 min read»).

## 8. ИНВАРИАНТЫ
Бренд DESIGN.md, no emoji (SVG-иконки). Единый header/footer (есть). Длинная сессия чтения → ненавязчивый CTA в /lead. landing.html FROZEN. Engineering-voice + источники (Sika/Mapei/BASF/ICRI/ACI) сохранить. Языки RU+EN на прод, HE за гейтом до нативной вычитки. Цены [verify] не подделывать.
