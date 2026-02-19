# SPRINT — FloorDSGN Site
_Спринт: 2026-02-18 → 2026-02-25_

## Цель спринта
Наполнить контент (materials), проверить воронку лидов, получить первые реальные заявки.

---

## Задача 1
- ID: FD-001
- PROJECT: FloorDSGN Site
- OBJECTIVE: Создать 7 файлов в content/materials/
- SCOPE: Epoxy, Microtopping, Terrazzo, PU-Cement, MMA, Polished Concrete, Rubber
- OUTPUT: 7 .md файлов с YAML frontmatter в /content/materials/
- SUCCESS METRIC: Все 7 типов полов отображаются на /floors
- DEADLINE: 2026-02-20
- DEPENDENCIES: admin/config.yml (схема)
- OWNER: MeltBot/Claude
- STATUS: done
- NOTES: Выполнено 2026-02-18. Созданы все 7 файлов с полным профессиональным контентом. Удалён дублирующий maa.md. Требуется git push → Netlify deploy.

## Задача 2
- ID: FD-002
- PROJECT: FloorDSGN Site
- OBJECTIVE: Проверить и починить форму заявки
- SCOPE: contact.html, форма на quiz
- OUTPUT: Тестовая заявка приходит на email
- SUCCESS METRIC: Получен email с тестовой заявкой
- DEADLINE: 2026-02-21
- DEPENDENCIES: -
- OWNER: Алексей (нужен доступ к email/Netlify Forms)
- STATUS: blocked
- NOTES: Нужно знать куда приходят лиды — уточнить у Алексея

## Задача 3
- ID: FD-003
- PROJECT: FloorDSGN Site
- OBJECTIVE: Обновить general.json реальными контактами
- SCOPE: content/settings/general.json
- OUTPUT: Реальный телефон, email, адрес в файле
- SUCCESS METRIC: Контакты на сайте реальные
- DEADLINE: 2026-02-21
- DEPENDENCIES: Данные от Алексея
- OWNER: Алексей → MeltBot
- STATUS: done
- NOTES: Completed 2026-02-19. Phone updated to +972 55 966 1459, WhatsApp to +972559661459. Updated general.json + 24 HTML files.

## Задача 4
- ID: FD-004
- PROJECT: FloorDSGN Site
- OBJECTIVE: Написать 2 SEO-статьи для blog
- SCOPE: content/blog/
- OUTPUT: 2 новые статьи на тему типов полов
- SUCCESS METRIC: Опубликованы, отображаются в /blog
- DEADLINE: 2026-02-24
- DEPENDENCIES: FD-001
- OWNER: MeltBot/Claude
- STATUS: in_progress
- NOTES: Тематика: Microtopping vs Epoxy, Terrazzo в интерьере. Разблокировано после завершения FD-001.
