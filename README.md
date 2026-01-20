# Floor.DSGN Website

Сайт компании Floor.DSGN с админ-панелью для управления контентом.

## Быстрый старт: Публикация на Netlify

### Шаг 1: Создайте GitHub репозиторий

1. Зайдите на [github.com](https://github.com) и создайте аккаунт (если нет)
2. Нажмите "New repository"
3. Название: `floordsgn-site`
4. Выберите "Public"
5. Нажмите "Create repository"

### Шаг 2: Загрузите файлы в GitHub

**Вариант А: Через браузер (простой)**
1. На странице репозитория нажмите "uploading an existing file"
2. Перетащите ВСЕ файлы из папки `floordsgn-site`
3. Нажмите "Commit changes"

**Вариант Б: Через терминал**
```bash
cd /Users/alexey/Desktop/финал/floordsgn-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/floordsgn-site.git
git push -u origin main
```

### Шаг 3: Подключите Netlify

1. Зайдите на [netlify.com](https://netlify.com)
2. Нажмите "Sign up" → "GitHub"
3. После входа нажмите "Add new site" → "Import an existing project"
4. Выберите GitHub → ваш репозиторий `floordsgn-site`
5. Нажмите "Deploy site"

Через 1-2 минуты сайт будет доступен по адресу типа: `random-name.netlify.app`

### Шаг 4: Включите админ-панель (Identity)

1. В Netlify откройте ваш сайт
2. Перейдите в **Site settings** → **Identity**
3. Нажмите **Enable Identity**
4. В разделе **Registration** выберите **Invite only**
5. Перейдите в **Identity** → **Invite users**
6. Введите ваш email и нажмите "Send"
7. Проверьте почту и создайте пароль

### Шаг 5: Включите Git Gateway

1. В **Site settings** → **Identity** → **Services**
2. Нажмите **Enable Git Gateway**

## Использование админ-панели

1. Откройте `https://ваш-сайт.netlify.app/admin`
2. Войдите с email и паролем
3. Вы увидите разделы:
   - **Блог - Статьи** — добавляйте и редактируйте статьи
   - **Проекты** — управляйте портфолио
   - **Настройки сайта** — контактные данные, тексты главной страницы
   - **Материалы** — информация о типах полов

## Как добавить статью в блог

1. Откройте админ-панель → **Блог - Статьи**
2. Нажмите **New Блог - Статьи**
3. Заполните поля:
   - Заголовок
   - Категория
   - Краткое описание
   - Текст статьи (поддерживает Markdown)
   - Загрузите изображение
4. Нажмите **Publish**

## Как добавить проект

1. Откройте **Проекты** → **New Проекты**
2. Заполните информацию о проекте
3. Загрузите фотографии
4. Отметьте "На главной" если хотите показать на homepage
5. **Publish**

## Как загрузить изображения

1. В любом редакторе нажмите на поле изображения
2. Нажмите **Choose an image** → **Upload**
3. Выберите файл с компьютера
4. Изображение загрузится в папку `/images`

## Настройка домена

1. В Netlify: **Domain settings** → **Add custom domain**
2. Введите ваш домен (например: `floordsgn.com`)
3. Следуйте инструкциям по настройке DNS

## Локальное тестирование

Для тестирования админ-панели локально:

1. Установите [Node.js](https://nodejs.org)
2. Установите `npx`
3. Раскомментируйте строку `local_backend: true` в `admin/config.yml`
4. Запустите:
   ```bash
   npx decap-server
   ```
5. В другом терминале запустите локальный сервер:
   ```bash
   npx serve .
   ```
6. Откройте `http://localhost:3000/admin`

## Структура файлов

```
floordsgn-site/
├── admin/
│   ├── index.html      # Админ-панель
│   └── config.yml      # Настройки CMS
├── content/
│   ├── blog/           # Статьи блога (Markdown)
│   ├── projects/       # Проекты (Markdown)
│   ├── materials/      # Материалы (Markdown)
│   └── settings/       # Настройки (JSON)
├── images/             # Загруженные изображения
├── materials/          # HTML страницы материалов
├── index.html          # Главная страница
├── floors.html         # Страница Floor Systems
├── projects.html       # Страница проектов
├── about.html          # О компании
├── blog.html           # Блог
├── contact.html        # Контакты
├── styles.css          # Стили
├── script.js           # JavaScript
├── netlify.toml        # Настройки Netlify
└── README.md           # Этот файл
```

## Поддержка

Если возникли вопросы — создайте Issue в GitHub репозитории.
