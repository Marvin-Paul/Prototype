// Advanced Features - Theme Switcher, 3D Effects, etc.
class AdvancedFeatures {
    constructor() {
        this.currentTheme = 'ocean';
        this.init();
    }

    init() {
        this.setupThemeSwitcher();
        this.setup3DEffects();
        this.setupParallaxEffects();
        this.setupTypingAnimation();
        this.setupAdvancedAnimations();
        this.setupTestimonialCarousel();
    }

    setupThemeSwitcher() {
        const themeToggle = document.getElementById('themeToggle');
        const themeOptions = document.getElementById('themeOptions');
        const themeOptionButtons = document.querySelectorAll('.theme-option');

        if (!themeToggle || !themeOptions) return;

        // Toggle theme options
        themeToggle.addEventListener('click', () => {
            themeOptions.classList.toggle('active');
        });

        // Handle theme selection
        themeOptionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                this.applyTheme(theme);
                
                // Update active state
                themeOptionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Close theme options
                themeOptions.classList.remove('active');
            });
        });

        // Close theme options when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-switcher')) {
                themeOptions.classList.remove('active');
            }
        });
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        const root = document.documentElement;
        
        // Single theme attribute drives the unified design system
        root.setAttribute('data-theme', theme);
        
        // Update theme variables
        this.updateThemeVariables(theme);
        
        // Save theme preference
        localStorage.setItem('preferred-theme', theme);
    }

    updateThemeVariables(theme) {
        const root = document.documentElement;
        const videoOverlay = document.querySelector('.video-overlay');
        
        switch (theme) {
            case 'sunset':
                root.style.setProperty('--primary-color', '#ff6b6b');
                root.style.setProperty('--primary-light', '#ff8787');
                root.style.setProperty('--primary-dark', '#e03131');
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)');
                if (videoOverlay) {
                    videoOverlay.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.85) 0%, rgba(255, 165, 0, 0.90) 100%)';
                }
                break;
            case 'forest':
                root.style.setProperty('--primary-color', '#51cf66');
                root.style.setProperty('--primary-light', '#69db7c');
                root.style.setProperty('--primary-dark', '#40c057');
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)');
                if (videoOverlay) {
                    videoOverlay.style.background = 'linear-gradient(135deg, rgba(81, 207, 102, 0.85) 0%, rgba(64, 192, 87, 0.90) 100%)';
                }
                break;
            case 'cosmic':
                root.style.setProperty('--primary-color', '#9775fa');
                root.style.setProperty('--primary-light', '#b197fc');
                root.style.setProperty('--primary-dark', '#845ef7');
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #9775fa 0%, #748ffc 100%)');
                if (videoOverlay) {
                    videoOverlay.style.background = 'linear-gradient(135deg, rgba(151, 117, 250, 0.85) 0%, rgba(116, 143, 252, 0.90) 100%)';
                }
                break;
            default: // ocean
                root.style.setProperty('--primary-color', '#00b5ad');
                root.style.setProperty('--primary-light', '#00d4cc');
                root.style.setProperty('--primary-dark', '#009690');
                root.style.setProperty('--primary-gradient', 'linear-gradient(135deg, #00b5ad 0%, #008b85 100%)');
                if (videoOverlay) {
                    videoOverlay.style.background = 'linear-gradient(135deg, rgba(45, 106, 95, 0.85) 0%, rgba(29, 74, 63, 0.90) 100%)';
                }
        }
        
        console.log(`🎨 Theme applied: ${theme}`);
    }

    setup3DEffects() {
        // Reduced to a subtle lift - full 3D tilt felt unprofessional for a wellness product
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const cards = document.querySelectorAll('.action-card, .stat-card, .badge-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                card.style.transform = 'translateY(-3px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupParallaxEffects() {
        // Parallax on scroll removed - kept scroll-free for calm and performance
    }

    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-animation');
        if (!typingElement) return;
        
        // Reset typing animation on page load
        setTimeout(() => {
            typingElement.style.animation = 'none';
            setTimeout(() => {
                typingElement.style.animation = 'typing 3s steps(16, end), blink-caret 0.75s step-end infinite';
            }, 100);
        }, 500);
    }

    setupAdvancedAnimations() {
        // Intersection Observer for advanced animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAdvancedAnimation(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe elements for advanced animations
        const animatedElements = document.querySelectorAll('.feature-item, .stat-item, .step-item');
        animatedElements.forEach(el => observer.observe(el));
    }

    triggerAdvancedAnimation(element) {
        // Add staggered animation delays
        const elements = Array.from(element.parentNode.children);
        const index = elements.indexOf(element);
        
        setTimeout(() => {
            element.style.animation = 'slideInUp 0.8s ease-out forwards';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    }

    // Initialize saved theme on page load
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme) {
            this.applyTheme(savedTheme);
            
            // Update active button
            const activeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
            if (activeButton) {
                document.querySelectorAll('.theme-option').forEach(btn => btn.classList.remove('active'));
                activeButton.classList.add('active');
            }
        } else {
            // Ensure the unified theme attribute is always set (ocean is the default brand)
            this.applyTheme('ocean');
        }
    }

    // Add smooth page transitions
    setupPageTransitions() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    }

    // Add particle system enhancement
    enhanceParticles() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            // Add random movement variations
            const randomDelay = Math.random() * 2;
            const randomDuration = 3 + Math.random() * 2;
            
            particle.style.animationDelay = `${randomDelay}s`;
            particle.style.animationDuration = `${randomDuration}s`;
            
            // Add click interaction
            particle.addEventListener('click', () => {
                this.createParticleBurst(particle);
            });
        });
    }

    createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const burstParticle = document.createElement('div');
            burstParticle.className = 'burst-particle';
            burstParticle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                animation: burstAnimation 0.6s ease-out forwards;
            `;
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            burstParticle.style.setProperty('--end-x', `${endX}px`);
            burstParticle.style.setProperty('--end-y', `${endY}px`);
            
            document.body.appendChild(burstParticle);
            
            setTimeout(() => {
                burstParticle.remove();
            }, 600);
        }
    }

    setupTestimonialCarousel() {
        const indicators = document.querySelectorAll('.indicator');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (indicators.length === 0 || testimonialCards.length === 0) return;

        this.currentTestimonial = 0;
        this.carouselInterval = null;

        // Handle indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showTestimonial(index);
                this.currentTestimonial = index;
                
                // Restart auto-rotation with a single interval
                this.stopAutoRotation();
                this.startAutoRotation();
            });
        });

        // Start auto-rotation
        this.startAutoRotation();
    }

    startAutoRotation() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        if (testimonialCards.length === 0) return;

        // Guard against multiple concurrent intervals
        this.stopAutoRotation();

        const rotateTestimonials = () => {
            this.currentTestimonial = (this.currentTestimonial + 1) % testimonialCards.length;
            this.showTestimonial(this.currentTestimonial);
        };

        this.carouselInterval = setInterval(rotateTestimonials, 8000);
    }

    stopAutoRotation() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    showTestimonial(index) {
        const indicators = document.querySelectorAll('.indicator');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        // Remove active class from all
        indicators.forEach(indicator => indicator.classList.remove('active'));
        testimonialCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to current
        if (indicators[index]) indicators[index].classList.add('active');
        if (testimonialCards[index]) testimonialCards[index].classList.add('active');
    }

    addBurstAnimationStyles() {
        if (!document.getElementById('burst-styles')) {
            const style = document.createElement('style');
            style.id = 'burst-styles';
            style.textContent = `
                @keyframes burstAnimation {
                    to {
                        transform: translate(var(--end-x), var(--end-y)) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const advancedFeatures = new AdvancedFeatures();
    advancedFeatures.loadSavedTheme();
    advancedFeatures.setupPageTransitions();
    advancedFeatures.enhanceParticles();
    advancedFeatures.addBurstAnimationStyles();
});
