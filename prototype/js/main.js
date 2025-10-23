// Main Application Manager - Optimized
class CampusMindspaceApp {
    constructor() {
        // Initialize managers first
        this.initializeManagers();
        this.init();
    }
    
    initializeManagers() {
        // Initialize managers in correct order
        if (typeof LanguageManager !== 'undefined') {
            window.languageManager = new LanguageManager();
        }
        if (typeof AuthManager !== 'undefined') {
            window.authManager = new AuthManager();
        }
        if (typeof MoodCheckinManager !== 'undefined') {
            window.moodCheckinManager = new MoodCheckinManager();
        }
    }
    
    init() {
        this.setupAnimations();
        this.setupResponsiveFeatures();
        this.setupAccessibility();
        this.setupErrorHandling();
    }
    
    setupAnimations() {
        AppUtils.$$('.auth-tab').forEach(tab => {
            AppUtils.on(tab, 'click', () => {
                const targetForm = AppUtils.$(`#${tab.getAttribute('data-tab')}Form`);
                if (targetForm) {
                    targetForm.classList.add('fade-in');
                    setTimeout(() => targetForm.classList.remove('fade-in'), 500);
                }
            });
        });
        
        this.animateMoodParticles();
    }
    
    animateMoodParticles() {
        AppUtils.$$('.particle').forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'float 3s ease-in-out infinite';
            }, index * 500);
        });
    }
    
    setupResponsiveFeatures() {
        // Use throttled resize handler for better performance
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        };
        
        AppUtils.on(window, 'resize', handleResize);
        this.handleResize();
    }
    
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
        
        const moodOptions = AppUtils.$('.mood-options');
        if (moodOptions) {
            moodOptions.style.gridTemplateColumns = isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))';
        }
    }
    
    setupAccessibility() {
        this.enhanceAccessibility();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }
    
    enhanceAccessibility() {
        AppUtils.$$('.mood-option').forEach((option, index) => {
            const moodType = option.getAttribute('data-mood');
            Object.assign(option, {
                role: 'radio',
                'aria-checked': 'false',
                'aria-label': `Mood option: ${moodType}`,
                tabIndex: index === 0 ? 0 : -1
            });
        });
        
        AppUtils.$$('.auth-form').forEach(form => {
            form.setAttribute('role', 'tabpanel');
        });
    }
    
    setupKeyboardNavigation() {
        AppUtils.$$('.mood-option').forEach((option, index) => {
            AppUtils.on(option, 'keydown', (e) => {
                const moodOptions = AppUtils.$$('.mood-option');
                const keyActions = {
                    'ArrowRight': () => moodOptions[(index + 1) % moodOptions.length].focus(),
                    'ArrowDown': () => moodOptions[(index + 1) % moodOptions.length].focus(),
                    'ArrowLeft': () => moodOptions[(index - 1 + moodOptions.length) % moodOptions.length].focus(),
                    'ArrowUp': () => moodOptions[(index - 1 + moodOptions.length) % moodOptions.length].focus(),
                    'Enter': () => window.moodCheckinManager?.selectMood(option),
                    ' ': () => window.moodCheckinManager?.selectMood(option)
                };
                
                if (keyActions[e.key]) {
                    e.preventDefault();
                    keyActions[e.key]();
                }
            });
        });
    }
    
    setupFocusManagement() {
        AppUtils.$$('.auth-tab').forEach(tab => {
            AppUtils.on(tab, 'click', () => {
                setTimeout(() => {
                    const activeForm = AppUtils.$('.auth-form.active');
                    const firstInput = activeForm?.querySelector('input:not([type="hidden"])');
                    firstInput?.focus();
                }, 100);
            });
        });
    }
    
    setupErrorHandling() {
        AppUtils.on(window, 'error', (e) => {
            console.error('Application Error:', e.error);
            this.handleError(e.error);
        });
        
        AppUtils.on(window, 'unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.handleError(e.reason);
        });
    }
    
    handleError(error) {
        console.error('Error handled by CampusMindspaceApp:', error);
        AppUtils.showNotification('An unexpected error occurred. Please try again.', 'error');
    }
    
    // Data export for admin (for future use)
    exportUserData() {
        const users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        const moodData = JSON.parse(localStorage.getItem('campusMindspace_moodData') || '{}');
        
        return {
            users: users.length,
            moodDistribution: this.calculateMoodDistribution(moodData),
            registrationTrend: this.calculateRegistrationTrend(users)
        };
    }
    
    calculateMoodDistribution(moodData) {
        const distribution = {};
        Object.values(moodData).forEach(dayData => {
            Object.entries(dayData).forEach(([mood, count]) => {
                distribution[mood] = (distribution[mood] || 0) + count;
            });
        });
        return distribution;
    }
    
    calculateRegistrationTrend(users) {
        const trend = {};
        users.forEach(user => {
            const date = user.registrationDate.split('T')[0];
            trend[date] = (trend[date] || 0) + 1;
        });
        return trend;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CampusMindspaceApp();
    
    // Make app globally available for debugging
    window.campusMindspaceApp = app;
    
    // Add version info to console
    console.log('Campus Mindspace v1.0.0 - Mental Health & Wellness Platform');
    console.log('Built with ❤️ for university students');
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CampusMindspaceApp };
}
