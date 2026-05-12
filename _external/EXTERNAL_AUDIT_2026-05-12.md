# External Strategic Audit — Floor.DSGN

**Source:** Claude.ai design artifact share link (2026-05-12)
**Author:** External Claude session
**Grade:** B+ (current) → A+ (180-day potential)

This is a parallel strategic audit complementary to `CONFIGURATOR_SITE_AUDIT_2026-05-12.md` (my tactical product-spec audit).

## Scorecard (11 categories)

| category | score | severity |
|---|---|---|
| Strategy / positioning | 72/100 | OK |
| Brand / naming / numbers | 48/100 | warn |
| Language system (RU/EN/HE) | **32/100** | **CRITICAL** |
| Information architecture | 54/100 | warn |
| 3D configurator | **81/100** | **strong** |
| Catalog (/floors) | 66/100 | OK |
| Proof base | **28/100** | **CRITICAL** |
| Copy / tone | 58/100 | warn |
| Visual system | 74/100 | OK |
| Conversion funnel | 42/100 | warn |
| SEO / tech | 38/100 | CRITICAL |

## Key strategic insight

> "У Floor.DSGN есть то, чего у конкурентов в принципе нет — продуктовый механизм, переводящий пол из услуги в категорию."

Pillars (slide 4):
- **План**: Design-engineering studio (не installer / подрядчик / магазин)
- **Инструмент**: Configure-to-quote (3D → формула → sample-kit → смета)
- **Рынок**: Israel · trilingual B2B (architects, developers, food/pharma facility managers)

The strapline "Полы, которые проектируют — а не кладут" reframes the category. Keep that, prove it with everything else.

## Sprint 0 (0-30 days) — stop the bleeding

1. **Language contract** — один primary RU, /en и /he заглушки; убрать EN headers из RU flow
2. **Single menu** — одно primary, одно CTA («Собрать в 3D»), везде. Footer = sitemap, не доп. навигация
3. **Number canon** — 8 систем везде (либо 10, но один источник правды)
4. **Delete fake testimonials + empty project cards** — лучше пустой блок «Кейсы готовятся» чем 3 stub-карточки
5. **Canonical + hreflang** — один production-домен; hreflang ru/en/he в head
6. **Corporate email** — hello@floor.design, убрать gmail.com с сайта

## Sprint 1 (30-90 days) — build the moat

7. Sample-kit pipeline (адрес → Israel Post → tracking email) — lead-magnet класса A
8. PDF Sika-формула (коды / толщины / расходы / RAL → одна кнопка)
9. Share-link конфигурации (`/c/abc123`)
10. **10 настоящих кейсов** с метриками и фото до/после
11. RAL/NCS color-picker — привязка к стандартам
12. Decision-tool в hero (вместо подвала)
13. **Иврит-стек минимум** (главная + 3 категории + контакт) с RTL

## Sprint 2 (90-365 days) — scale the category

14. Client-portal «Мой пол» (стадии монтажа, фото-день, гарантия)
15. B2B-партнёрка для архитекторов (regshare через регистрацию студии)
16. Контент-engine — 1 кейс/мес + 1 техническая статья
17. Configurator API embed на сайтах архитектурных бюро (white-label)
18. Sample-kit unboxing — TikTok/Reels канал «pour porn» категории
19. Geographic expansion — Кипр / Греция / ОАЭ через local install-партнёров

## Impact × Effort matrix (high-impact + low-effort first)

**Top-left quadrant (do this quarter):**
- Language contract (7 дней)
- Single menu + 1 CTA (3 дня)
- Number canon (1 день)
- Sample-kit pipeline (21 день)
- PDF Sika-формула (14 дней)
- 10 кейсов с метриками (30 дней)

## Business potential (3 scenarios)

| scenario | timeframe | ARR |
|---|---|---|
| Local | 36 мес | ₪8-12m (close Israel, Sika gold-tier) |
| Regional | 60 мес | ₪25-40m (Cyprus/Greece/UAE via install-partners) |
| Platform | 84 мес | x5-8 multiple (white-label SaaS) |

## Specific findings I missed in my tactical audit

| # | finding | severity |
|---|---|---|
| 1 | David K. / Marina S. / Yossi R. testimonials — no photos, no companies, no LinkedIn — antitrust signal | CRITICAL |
| 2 | 3 empty project cards "Commercial Lobby · Tel Aviv" — no metrics, no photos | CRITICAL |
| 3 | 3 different menus on home top / home alt / /floors / footer | CRITICAL IA |
| 4 | 9 vs 10+ vs Six vs 8 systems on different blocks | trust |
| 5 | Configurator → /quote breaks state (user enters again) | funnel |
| 6 | Sample-kit is mailto, not a real form | funnel |
| 7 | gmail.com in footer for "engineering-grade" brand | trust |
| 8 | 3D configurator invisible to crawlers (SSR-fallback needed) | SEO |
| 9 | Schema.org markup absent — no Google Business panel | SEO |
| 10 | OG-image on stale vercel domain — broken share previews | social |
| 11 | "Quality Materials, Expert Installation" ESL copy | copy |
| 12 | "Our Craft / Terrazzo Gallery" EN headers in RU flow | language |

## Voice rules (slide 12)

**Канон editorial-engineering голоса:**
- Цифры всегда — не «надёжный», а «R12 anti-slip, 9 МПа адгезии»
- Глагол всегда — не «системы», а «укладываем», «проектируем», «сертифицируем»
- Конкретное имя — «Sikafloor-264 SL», не «эпоксидная смола»
- Italic-Fraunces для 1-2 акцентов на блок, не больше

**Выкинуть из лексикона:**
- `premium · world-class · cutting-edge`
- `your trusted partner`
- `get a free quote today!`
- `quality you can trust`
- `installer` в русском тексте (использовать «подрядчик» или EN в кавычках)
