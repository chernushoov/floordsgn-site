// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect — transparent on hero, solid on scroll
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (header.classList.contains('header--hero')) {
        if (currentScroll > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    lastScroll = currentScroll;
});

// Category filter for projects and blog
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.textContent.toLowerCase().trim();
        const items = document.querySelectorAll('.project-item, .blog-card');

        items.forEach(item => {
            const category = item.dataset.category || '';
            if (filter === 'all' || category.toLowerCase().includes(filter)) {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.display = '';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (!category.toLowerCase().includes(filter) && filter !== 'all') {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});

// Category navigation highlight
document.querySelectorAll('.category-nav a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.category-nav a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.floor-section, .service-card, .project-card, .blog-card').forEach(el => {
    observer.observe(el);
});

// Form validation and submission
const contactForm = document.querySelector('form.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Basic validation
        const name = this.querySelector('input[name="name"]');
        const phone = this.querySelector('input[name="phone"]');

        let valid = true;

        if (name && !name.value.trim()) {
            name.style.borderColor = '#ff0000';
            valid = false;
        } else if (name) {
            name.style.borderColor = '';
        }

        if (phone && !phone.value.trim()) {
            phone.style.borderColor = '#ff0000';
            valid = false;
        } else if (phone) {
            phone.style.borderColor = '';
        }

        if (!valid) {
            e.preventDefault();
            return;
        }

        // If valid, redirect to thank-you page
        e.preventDefault();
        window.location.href = 'thank-you.html';
    });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]');

        if (email.value.trim() && email.value.includes('@')) {
            alert('Thank you for subscribing!');
            email.value = '';
        }
    });
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Active navigation highlight based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', function() {
    // Add reveal class to elements that should animate
    const revealElements = document.querySelectorAll(
        '.section-header, .service-card, .floor-card, .blog-card, ' +
        '.project-item, .trust-item, .process-step, .testimonial-card, ' +
        '.material-app-card, .variant-card, .faq-item, .team-member'
    );

    revealElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
        revealObserver.observe(el);
    });
});

// Staggered animation for grid items
document.addEventListener('DOMContentLoaded', function() {
    const grids = document.querySelectorAll('.services-grid, .blog-grid, .projects-grid, .trust-grid');

    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
});

// Smooth page load transition
document.body.classList.add('page-transition');

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu && mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    }
});

// Close mobile menu on link click
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

// ==================== APPLE-STYLE SCROLL ANIMATIONS ====================
class ScrollAnimationManager {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        // Observer for animate-on-scroll elements
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.15
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animatedElements.add(entry.target);
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animate-on-scroll elements
        document.querySelectorAll('.animate-on-scroll, .reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            this.observer.observe(el);
        });

        // Initialize parallax
        this.initParallax();
    }

    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-image, .hero-image img');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    parallaxElements.forEach(el => {
                        const speed = 0.3;
                        const yPos = -(scrolled * speed);
                        el.style.transform = `translateY(${yPos}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// ==================== COUNTER ANIMATION ====================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.trust-number, .counter-value');
        this.animated = new Set();
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);

        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = text.replace(/\d+/, '').trim();
        const duration = 2000;
        const startTime = performance.now();

        element.classList.add('counted');

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + suffix;
            }
        };

        requestAnimationFrame(animate);
    }
}

// ==================== EXPERTISE CARDS MANAGER ====================
class ExpertiseCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.expertise-card');
        this.init();
    }

    init() {
        if (this.cards.length === 0) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                }
            });
        }, observerOptions);

        this.cards.forEach(card => observer.observe(card));
    }
}

// ==================== BENTO GALLERY INTERACTIONS ====================
class BentoGallery {
    constructor() {
        this.items = document.querySelectorAll('.bento-item');
        this.init();
    }

    init() {
        if (this.items.length === 0) return;

        this.items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.items.forEach(i => {
                    if (i !== item) {
                        i.style.opacity = '0.7';
                        i.style.transform = 'scale(0.98)';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                this.items.forEach(i => {
                    i.style.opacity = '1';
                    i.style.transform = 'scale(1)';
                });
            });
        });
    }
}

// ==================== SPECS TABLE ANIMATION ====================
class SpecsTableAnimation {
    constructor() {
        this.tables = document.querySelectorAll('.specs-table-animated');
        this.init();
    }

    init() {
        if (this.tables.length === 0) return;

        const observerOptions = {
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const rows = entry.target.querySelectorAll('tr');
                    rows.forEach((row, index) => {
                        setTimeout(() => {
                            row.classList.add('visible');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.tables.forEach(table => observer.observe(table));
    }
}

// ==================== SMOOTH HEADER TRANSITION ====================
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        if (!this.header) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                this.header.style.background = 'rgba(255, 255, 255, 0.9)';
                this.header.style.backdropFilter = 'blur(20px)';
                this.header.style.webkitBackdropFilter = 'blur(20px)';
                this.header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.1)';
            } else {
                this.header.style.background = 'var(--white)';
                this.header.style.backdropFilter = 'none';
                this.header.style.webkitBackdropFilter = 'none';
                this.header.style.boxShadow = 'none';
            }

            this.lastScroll = currentScroll;
        });
    }
}

// ==================== INITIALIZE ALL MANAGERS ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation managers
    new ScrollAnimationManager();
    new CounterAnimation();
    new ExpertiseCardManager();
    new BentoGallery();
    new SpecsTableAnimation();
    new HeaderManager();

    // Add stagger delays to grid items
    const grids = document.querySelectorAll('.bento-gallery, .expertise-grid, .services-grid');
    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            if (!item.classList.contains('stagger-1') && !item.classList.contains('stagger-2')) {
                item.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    });

    console.log('Apple-style animations initialized');
});
