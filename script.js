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

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Category filter for blog
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Filter logic would go here
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

// Form validation
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Basic validation
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const message = this.querySelector('textarea[name="message"]');

        let valid = true;

        if (!name.value.trim()) {
            name.style.borderColor = '#ff0000';
            valid = false;
        } else {
            name.style.borderColor = '';
        }

        if (!email.value.trim() || !email.value.includes('@')) {
            email.style.borderColor = '#ff0000';
            valid = false;
        } else {
            email.style.borderColor = '';
        }

        if (!message.value.trim()) {
            message.style.borderColor = '#ff0000';
            valid = false;
        } else {
            message.style.borderColor = '';
        }

        if (valid) {
            // Submit form or show success message
            alert('Thank you for your message. We will contact you soon.');
            this.reset();
        }
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
