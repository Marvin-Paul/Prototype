// Common Utilities - Consolidates repeated patterns across the application
class AppUtils {
    // DOM Utilities
    static $(selector) {
        return document.querySelector(selector);
    }
    
    static $$(selector) {
        return document.querySelectorAll(selector);
    }
    
    static createElement(tag, className = '', content = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (content) el.innerHTML = content;
        return el;
    }
    
    // Event handling
    static on(element, event, handler) {
        if (element) element.addEventListener(event, handler);
    }
    
    static off(element, event, handler) {
        if (element) element.removeEventListener(event, handler);
    }
    
    // LocalStorage utilities
    static get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    }
    
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }
    
    static remove(key) {
        localStorage.removeItem(key);
    }
    
    // Notification system (consolidated)
    static showNotification(message, type = 'info', duration = 3000) {
        const existing = document.querySelectorAll('.app-notification');
        existing.forEach(el => el.remove());
        
        const notification = this.createElement('div', `app-notification app-notification-${type}`);
        notification.innerHTML = `<span>${message}</span>`;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: '10000',
            animation: 'slideInNotification 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    static getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: 'var(--primary-color)'
        };
        return colors[type] || colors.info;
    }
    
    // Form utilities
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    static getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }
    
    // Mood utilities (consolidated)
    static getMoodConfig() {
        return {
            overwhelmed: { text: 'Overwhelmed by studies', icon: 'fas fa-exclamation-triangle', color: '#ff9800' },
            sleep: { text: 'Difficulty sleeping', icon: 'fas fa-bed', color: '#00b5ad' },
            social: { text: 'Social stress', icon: 'fas fa-users', color: '#e91e63' },
            happy: { text: 'Happy/Stable', icon: 'fas fa-smile', color: '#00c853' },
            anxious: { text: 'Anxious/Worried', icon: 'fas fa-heartbeat', color: '#f44336' },
            lonely: { text: 'Isolated/Lonely', icon: 'fas fa-user', color: '#607d8b' }
        };
    }
    
    static getMoodText(mood, lang = 'en') {
        const texts = {
            en: {
                overwhelmed: 'Overwhelmed by studies',
                sleep: 'Difficulty sleeping',
                social: 'Social stress',
                happy: 'Happy/Stable',
                anxious: 'Anxious/Worried',
                lonely: 'Isolated/Lonely'
            },
            es: {
                overwhelmed: 'Sintiéndome abrumado',
                sleep: 'Problemas de sueño',
                social: 'Estrés social',
                happy: '¡Me siento genial!',
                anxious: 'Sintiéndome ansioso',
                lonely: 'Sintiéndome solo'
            },
            fr: {
                overwhelmed: 'Me sentir dépassé',
                sleep: 'Problèmes de sommeil',
                social: 'Stress social',
                happy: 'Je me sens bien!',
                anxious: 'Me sentir anxieux',
                lonely: 'Me sentir seul'
            }
        };
        return texts[lang]?.[mood] || texts.en[mood] || mood;
    }
    
    // Animation utilities
    static fadeIn(element, duration = 300) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.display = 'block';
        setTimeout(() => element.style.opacity = '1', 10);
    }
    
    static fadeOut(element, duration = 300) {
        if (!element) return;
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        setTimeout(() => element.style.display = 'none', duration);
    }
    
    // Loading states
    static setLoading(element, isLoading) {
        if (!element) return;
        element.classList.toggle('loading', isLoading);
        if (isLoading) {
            element.disabled = true;
            element.style.opacity = '0.6';
        } else {
            element.disabled = false;
            element.style.opacity = '1';
        }
    }
    
    // Debounce utility
    static debounce(func, wait) {
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
    
    // Throttle utility
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Add notification animations to document
if (!document.querySelector('#notification-styles')) {
    const style = AppUtils.createElement('style', '', `
        @keyframes slideInNotification {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutNotification {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `);
    style.id = 'notification-styles';
    document.head.appendChild(style);
}

// Make globally available
window.AppUtils = AppUtils;
