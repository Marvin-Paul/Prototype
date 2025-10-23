// Theme Manager - Optimized
class ThemeManager {
    constructor() {
        this.currentTheme = AppUtils.get('theme', 'light');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeListeners();
        this.setupSystemThemeListener();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeButtons(theme);
        AppUtils.set('theme', theme);
        this.currentTheme = theme;
    }

    updateThemeButtons(theme) {
        AppUtils.$$('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    setupThemeListeners() {
        AppUtils.$$('.theme-btn').forEach(btn => {
            AppUtils.on(btn, 'click', () => {
                this.applyTheme(btn.dataset.theme);
                this.showThemeNotification(btn.dataset.theme);
            });
        });
    }

    setupSystemThemeListener() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        AppUtils.on(darkModeMediaQuery, 'change', () => {
            if (this.currentTheme === 'auto') {
                this.showThemeNotification('auto');
            }
        });
    }

    showThemeNotification(theme) {
        const messages = {
            light: 'Light theme activated ☀️',
            dark: 'Dark theme activated 🌙',
            auto: `Auto theme activated (${this.getSystemTheme() === 'dark' ? 'Dark' : 'Light'} mode) 🔄`
        };
        
        AppUtils.showNotification(messages[theme] || 'Theme updated', 'success');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getCurrentEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            return this.getSystemTheme();
        }
        return this.currentTheme;
    }
}

// Theme animations are now handled by AppUtils

// Initialize theme manager
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
