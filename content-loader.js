/**
 * Floor.DSGN Content Loader
 * Загружает контент из JSON/Markdown файлов для динамических страниц
 */

// Парсер YAML front matter из Markdown
function parseFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: content };

    const frontMatter = {};
    match[1].split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Убираем кавычки
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            frontMatter[key] = value;
        }
    });

    return { data: frontMatter, content: match[2] };
}

// Простой Markdown в HTML конвертер
function markdownToHtml(md) {
    return md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<[hulo])/gim, '<p>')
        .replace(/(?<![>])$/gim, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[hulo])/g, '$1')
        .replace(/(<\/[hulo][^>]*>)<\/p>/g, '$1');
}

// Загрузка настроек сайта
async function loadSettings() {
    try {
        const response = await fetch('/content/settings/general.json');
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.log('Settings not found, using defaults');
    }
    return null;
}

// Загрузка списка файлов (для GitHub Pages / Netlify)
async function loadBlogPosts() {
    const posts = [];

    // Список известных постов (обновляется при добавлении новых)
    const knownPosts = [
        'epoxy-vs-polyurethane.md',
        'substrate-preparation-guide.md'
    ];

    for (const filename of knownPosts) {
        try {
            const response = await fetch(`/content/blog/${filename}`);
            if (response.ok) {
                const content = await response.text();
                const { data, content: body } = parseFrontMatter(content);
                if (data.published !== 'false') {
                    posts.push({
                        ...data,
                        slug: filename.replace('.md', ''),
                        body: body
                    });
                }
            }
        } catch (e) {
            console.log(`Could not load ${filename}`);
        }
    }

    // Сортировка по дате (новые первые)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return posts;
}

// Загрузка проектов
async function loadProjects() {
    const projects = [];

    const knownProjects = [
        'tel-aviv-restaurant.md'
    ];

    for (const filename of knownProjects) {
        try {
            const response = await fetch(`/content/projects/${filename}`);
            if (response.ok) {
                const content = await response.text();
                const { data, content: body } = parseFrontMatter(content);
                projects.push({
                    ...data,
                    slug: filename.replace('.md', ''),
                    body: body
                });
            }
        } catch (e) {
            console.log(`Could not load ${filename}`);
        }
    }

    return projects;
}

// Рендер карточки блога
function renderBlogCard(post) {
    const date = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <article class="blog-card" data-category="${post.category || 'Технологии'}">
            <div class="blog-image">
                ${post.image ? `<img src="${post.image}" alt="${post.title}">` : '<div class="blog-placeholder"></div>'}
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="category">${post.category || 'Технологии'}</span>
                    <span class="date">${date}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt || ''}</p>
                <a href="#" class="read-more" data-post="${post.slug}">Read Article →</a>
            </div>
        </article>
    `;
}

// Рендер карточки проекта
function renderProjectCard(project) {
    return `
        <div class="project-card" data-category="${project.category || 'Commercial'}">
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '<div class="project-placeholder"></div>'}
            </div>
            <div class="project-info">
                <span class="project-type">${project.floorType || 'Floor System'}</span>
                <h3>${project.title}</h3>
                <p>${project.location}${project.area ? ` • ${project.area}m²` : ''}</p>
            </div>
        </div>
    `;
}

// Инициализация на странице блога
async function initBlogPage() {
    const container = document.querySelector('.blog-grid');
    if (!container) return;

    const posts = await loadBlogPosts();

    if (posts.length > 0) {
        container.innerHTML = posts.map(renderBlogCard).join('');

        // Обработчики клика
        container.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slug = e.target.dataset.post;
                const post = posts.find(p => p.slug === slug);
                if (post) {
                    showPostModal(post);
                }
            });
        });
    }
}

// Модальное окно для статьи
function showPostModal(post) {
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.innerHTML = `
        <div class="post-modal-content">
            <button class="close-modal">&times;</button>
            <article class="post-full">
                <header>
                    <span class="category">${post.category}</span>
                    <h1>${post.title}</h1>
                    <p class="meta">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${post.readTime || 5} min read</p>
                </header>
                <div class="post-body">
                    ${markdownToHtml(post.body)}
                </div>
            </article>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Инициализация на странице проектов
async function initProjectsPage() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    const projects = await loadProjects();

    if (projects.length > 0) {
        // Добавляем динамические проекты к существующим
        const dynamicHtml = projects.map(renderProjectCard).join('');
        container.insertAdjacentHTML('beforeend', dynamicHtml);
    }
}

// Обновление контактной информации из настроек
async function updateContactInfo() {
    const settings = await loadSettings();
    if (!settings) return;

    // Обновляем email
    document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        if (settings.email) {
            el.href = `mailto:${settings.email}`;
            el.textContent = settings.email;
        }
    });

    // Обновляем телефон
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        if (settings.phone) {
            el.href = `tel:${settings.phone.replace(/\s/g, '')}`;
            el.textContent = settings.phone;
        }
    });
}

// Автоинициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateContactInfo();

    if (document.querySelector('.blog-grid')) {
        initBlogPage();
    }

    if (document.querySelector('.projects-grid')) {
        initProjectsPage();
    }
});
