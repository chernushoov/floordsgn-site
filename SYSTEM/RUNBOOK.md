# RUNBOOK — FloorDSGN Site

## Сервисы
| Сервис | Где | Примечания |
|--------|-----|------------|
| Хостинг | Netlify | Автодеплой из GitHub main |
| CMS | Decap CMS | /admin → git-based |
| Репозиторий | GitHub: chernushoov/floordsgn-site | branch: main |
| DNS | ? | Уточнить у Алексея |

## Деплой
1. Коммит в `main` → Netlify автоматически собирает и деплоит
2. Или через Decap CMS → коммит создаётся автоматически

```bash
# Локальный запуск
cd floordsgn-site-new
npm install
npx netlify dev    # Локальный сервер с Netlify Functions
```

## Добавить контент через CMS
1. Открыть: https://<ваш-сайт>/admin
2. Войти через GitHub OAuth
3. Выбрать коллекцию (blog/projects/materials/settings)
4. Создать/редактировать → Publish → автокоммит в GitHub

## Добавить контент напрямую через git
```bash
# Создать новый материал
cp content/blog/epoxy-vs-polyurethane.md content/materials/epoxy.md
# Редактировать YAML frontmatter и body
git add content/materials/epoxy.md
git commit -m "feat: add epoxy material page"
git push origin main
# Netlify задеплоит автоматически
```

## Если сломалось
1. Netlify dashboard → проверить последний build log
2. Если ошибка в JS: открыть DevTools → Console
3. Если CMS не работает: проверить admin/config.yml синтаксис
4. Откат: `git revert HEAD && git push`

## Контакты (нужно заполнить)
- Email для лидов: ???
- Телефон: ???
- Netlify логин: ???
