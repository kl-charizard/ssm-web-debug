// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initInteractiveElements();
    initAccessibilityFeatures();
    initMobileMenu();
    initDemoFunctionality();
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Throttled scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateActiveNavigation);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    console.log('🔧 Initializing mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');
    
    console.log('📱 Found elements:', {
        hamburger: !!hamburger,
        navLinks: !!navLinks,
        navContainer: !!navContainer
    });
    
    if (hamburger && navLinks) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function(e) {
            console.log('🍔 Hamburger clicked!');
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            console.log('📱 Menu toggled. Classes:', {
                hamburgerActive: this.classList.contains('active'),
                menuActive: navLinks.classList.contains('mobile-active')
            });
            navContainer.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('mobile-menu-open');
            
            // Update aria attributes for accessibility
            const isOpen = this.classList.contains('active');
            this.setAttribute('aria-expanded', isOpen);
            navLinks.setAttribute('aria-hidden', !isOpen);
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = navLinks.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navContainer.contains(e.target) && navLinks.classList.contains('mobile-active')) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('mobile-active')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on window resize (when switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('mobile-active')) {
                closeMobileMenu();
            }
        });

        // Function to close mobile menu
        function closeMobileMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('mobile-active');
            navContainer.classList.remove('mobile-menu-open');
            document.body.classList.remove('mobile-menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.setAttribute('aria-hidden', 'true');
        }

        // Initialize accessibility attributes
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-links');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        navLinks.setAttribute('aria-hidden', 'true');
        navLinks.setAttribute('id', 'nav-links');
    }
}

// Scroll-based animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for step cards
                if (entry.target.classList.contains('step-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
                
                // Special handling for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 300;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe all glass cards for animation
    const animatedElements = document.querySelectorAll('.glass-card, .hero-title, .section-title');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Interactive elements
function initInteractiveElements() {
    // Button interactions
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Glass card hover effects
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

// Demo functionality
function initDemoFunctionality() {
    // Simple demo functionality - no additional effects needed
    // Image hover effects are handled by CSS
}

// Accessibility features
function initAccessibilityFeatures() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Reduced motion support
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('reduced-motion');
            // Disable complex animations for users who prefer reduced motion
            const animatedElements = document.querySelectorAll('.gradient-orb');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
            });
        }
    }
    
    handleReducedMotion(mediaQuery);
    mediaQuery.addListener(handleReducedMotion);

    // High contrast support
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    function handleHighContrast(contrastQuery) {
        if (contrastQuery.matches) {
            document.body.classList.add('high-contrast');
        }
    }
    
    handleHighContrast(contrastQuery);
    contrastQuery.addListener(handleHighContrast);

    // Screen reader announcements for dynamic content
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Announce section changes for screen readers
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
                const sectionTitle = entry.target.querySelector('h1, h2, h3');
                if (sectionTitle) {
                    announceToScreenReader(`Entered ${sectionTitle.textContent} section`);
                }
            }
        });
    }, { threshold: 0.7 });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for better performance
function initLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.lazy === 'background') {
                    element.style.backgroundImage = `url(${element.dataset.src})`;
                }
                element.classList.add('loaded');
                lazyObserver.unobserve(element);
            }
        });
    });

    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Statistics counter animation
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.textContent.includes('%') ? '%' : '+');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = parseInt(element.textContent);
                animateValue(element, 0, finalValue, 2000);
                statsObserver.unobserve(element);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Initialize stats animation
document.addEventListener('DOMContentLoaded', function() {
    initStatsAnimation();
    initLazyLoading();
});

// CSS Animation classes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid #a855f7 !important;
        outline-offset: 2px !important;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
`;

document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Graceful degradation - ensure basic functionality still works
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment below to register a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registered successfully');
        //     })
        //     .catch(function(error) {
        //         console.log('ServiceWorker registration failed');
        //     });
    });
}
