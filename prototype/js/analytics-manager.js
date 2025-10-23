// Analytics and Monitoring Integration
class AnalyticsManager {
    constructor() {
        this.config = {
            googleAnalytics: {
                enabled: false,
                trackingId: 'GA_TRACKING_ID', // Replace with your GA4 tracking ID
            },
            googleTagManager: {
                enabled: false,
                containerId: 'GTM_CONTAINER_ID', // Replace with your GTM container ID
            },
            hotjar: {
                enabled: false,
                siteId: 'HOTJAR_SITE_ID', // Replace with your Hotjar site ID
            },
            customEvents: {
                enabled: true,
            }
        };
        
        this.init();
    }

    init() {
        // Initialize analytics based on configuration
        if (this.config.googleAnalytics.enabled) {
            this.initGoogleAnalytics();
        }
        
        if (this.config.googleTagManager.enabled) {
            this.initGoogleTagManager();
        }
        
        if (this.config.hotjar.enabled) {
            this.initHotjar();
        }
        
        if (this.config.customEvents.enabled) {
            this.initCustomEvents();
        }
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring();
    }

    initGoogleAnalytics() {
        // Google Analytics 4 (GA4)
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics.trackingId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.config.googleAnalytics.trackingId, {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'user_mood',
                'custom_parameter_2': 'theme_preference'
            }
        });

        window.gtag = gtag;
        console.log('📊 Google Analytics initialized');
    }

    initGoogleTagManager() {
        // Google Tag Manager
        const script = document.createElement('script');
        script.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${this.config.googleTagManager.containerId}');
        `;
        document.head.appendChild(script);

        // GTM noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${this.config.googleTagManager.containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);

        console.log('🏷️ Google Tag Manager initialized');
    }

    initHotjar() {
        // Hotjar
        const script = document.createElement('script');
        script.innerHTML = `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${this.config.hotjar.siteId},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `;
        document.head.appendChild(script);

        console.log('🔥 Hotjar initialized');
    }

    initCustomEvents() {
        // Track custom events
        this.trackPageView();
        this.trackUserInteractions();
        this.trackFormSubmissions();
        this.trackThemeChanges();
        this.trackMoodSelections();
    }

    trackPageView() {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        };

        this.sendEvent('page_view', pageData);
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, .auth-btn')) {
                this.sendEvent('button_click', {
                    button_text: e.target.textContent.trim(),
                    button_class: e.target.className,
                    page_location: window.location.href
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            this.sendEvent('form_submit', {
                form_id: e.target.id,
                form_action: e.target.action,
                page_location: window.location.href
            });
        });

        // Track video interactions
        const video = document.getElementById('oceanVideo');
        if (video) {
            video.addEventListener('play', () => {
                this.sendEvent('video_play', {
                    video_source: video.src,
                    page_location: window.location.href
                });
            });

            video.addEventListener('pause', () => {
                this.sendEvent('video_pause', {
                    video_source: video.src,
                    page_location: window.location.href
                });
            });
        }
    }

    trackFormSubmissions() {
        // Track login attempts
        const loginForm = document.getElementById('loginFormData');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                this.sendEvent('login_attempt', {
                    form_type: 'login',
                    page_location: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        }

        // Track registration attempts
        const registerForm = document.getElementById('registerFormData');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                this.sendEvent('registration_attempt', {
                    form_type: 'registration',
                    page_location: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        }
    }

    trackThemeChanges() {
        // Track theme changes
        document.addEventListener('click', (e) => {
            if (e.target.matches('.theme-option')) {
                const theme = e.target.getAttribute('data-theme');
                this.sendEvent('theme_change', {
                    theme: theme,
                    page_location: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    trackMoodSelections() {
        // Track mood selections
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mood-option')) {
                const mood = e.target.getAttribute('data-mood');
                this.sendEvent('mood_selection', {
                    mood: mood,
                    page_location: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    initPerformanceMonitoring() {
        // Enhanced performance monitoring
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                const performanceData = {
                    load_time: perfData.loadEventEnd - perfData.loadEventStart,
                    dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    first_paint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                    first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                    total_resources: performance.getEntriesByType('resource').length,
                    connection_type: this.getConnectionType(),
                    timestamp: new Date().toISOString()
                };

                this.sendEvent('performance_metrics', performanceData);
            }, 2000);
        });
    }

    getConnectionType() {
        if ('connection' in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return {
                effective_type: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt
            };
        }
        return null;
    }

    sendEvent(eventName, eventData) {
        // Send to Google Analytics
        if (window.gtag) {
            gtag('event', eventName, eventData);
        }

        // Send to custom analytics endpoint (if configured)
        if (this.config.customEvents.enabled) {
            this.sendToCustomEndpoint(eventName, eventData);
        }

        // Log to console for debugging
        console.log(`📊 Analytics Event: ${eventName}`, eventData);
    }

    sendToCustomEndpoint(eventName, eventData) {
        // Example: Send to your own analytics endpoint
        const analyticsData = {
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            user_id: this.getUserId()
        };

        // Use fetch API to send data
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(analyticsData)
        }).catch(error => {
            console.log('Analytics endpoint not available:', error);
        });
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        // Get user ID from localStorage or generate anonymous ID
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    // Public methods for manual tracking
    trackCustomEvent(eventName, eventData) {
        this.sendEvent(eventName, eventData);
    }

    trackError(error, context = {}) {
        this.sendEvent('error_occurred', {
            error_message: error.message,
            error_stack: error.stack,
            context: context,
            page_location: window.location.href,
            timestamp: new Date().toISOString()
        });
    }

    trackUserAction(action, details = {}) {
        this.sendEvent('user_action', {
            action: action,
            details: details,
            page_location: window.location.href,
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
    
    // Track errors globally
    window.addEventListener('error', (e) => {
        if (window.analyticsManager) {
            window.analyticsManager.trackError(e.error, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        }
    });
});

// Export for manual use
if (typeof window !== 'undefined') {
    window.trackEvent = (eventName, eventData) => {
        if (window.analyticsManager) {
            window.analyticsManager.trackCustomEvent(eventName, eventData);
        }
    };
    
    window.trackAction = (action, details) => {
        if (window.analyticsManager) {
            window.analyticsManager.trackUserAction(action, details);
        }
    };
}
