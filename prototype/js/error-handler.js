// Global Error Handler for Campus Mindspace
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
        this.errorCount = 0;
        this.maxErrors = 10;
    }

    setupGlobalErrorHandling() {
        // Handle uncaught JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                message: event.message
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection', {
                promise: event.promise
            });
        });

        // Handle fetch errors
        this.interceptFetch();
    }

    handleError(error, type = 'Unknown Error', context = {}) {
        this.errorCount++;
        
        // Log error details
        console.group(`🚨 ${type}`);
        console.error('Error:', error);
        console.log('Context:', context);
        console.log('Error Count:', this.errorCount);
        console.groupEnd();

        // Show user-friendly notification for critical errors
        if (this.isCriticalError(error)) {
            this.showUserNotification(type, error);
        }

        // Prevent infinite error loops
        if (this.errorCount >= this.maxErrors) {
            console.error('Too many errors detected. Stopping error reporting.');
            this.showUserNotification(
                'Application Error', 
                'Multiple errors detected. Please refresh the page.'
            );
        }

        // Report to analytics (if available)
        this.reportToAnalytics(error, type, context);
    }

    isCriticalError(error) {
        // Define what constitutes a critical error
        const criticalPatterns = [
            /cannot read property/i,
            /undefined is not a function/i,
            /network error/i,
            /failed to fetch/i,
            /script error/i
        ];

        const errorMessage = error?.message || error?.toString() || '';
        return criticalPatterns.some(pattern => pattern.test(errorMessage));
    }

    showUserNotification(type, error) {
        const userFriendlyMessage = this.getUserFriendlyMessage(error);
        
        AppUtils.showNotification(
            `${type}: ${userFriendlyMessage}`, 
            'error', 
            5000
        );
    }

    getUserFriendlyMessage(error) {
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        
        // Map technical errors to user-friendly messages
        const errorMappings = {
            'NetworkError': 'Unable to connect to the server. Please check your internet connection.',
            'TypeError': 'Something went wrong with the application. Please try refreshing the page.',
            'ReferenceError': 'The application encountered an unexpected error. Please try again.',
            'SyntaxError': 'There was an issue loading the application. Please refresh the page.',
            'ChunkLoadError': 'Failed to load application resources. Please refresh the page.',
            'Load failed': 'Unable to load required files. Please check your internet connection.'
        };

        // Check for specific error patterns
        for (const [pattern, message] of Object.entries(errorMappings)) {
            if (errorMessage.includes(pattern)) {
                return message;
            }
        }

        // Generic fallback
        return 'An unexpected error occurred. Please try again or refresh the page.';
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function(...args) {
            try {
                const response = await originalFetch.apply(this, args);
                
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                    error.status = response.status;
                    error.url = args[0];
                    self.handleError(error, 'Network Error', { url: args[0] });
                }
                
                return response;
            } catch (error) {
                self.handleError(error, 'Network Error', { url: args[0] });
                throw error;
            }
        };
    }

    reportToAnalytics(error, type, context) {
        // Only report in production and if analytics is available
        if (typeof gtag !== 'undefined' && process.env.NODE_ENV === 'production') {
            gtag('event', 'exception', {
                description: `${type}: ${error?.message || 'Unknown error'}`,
                fatal: this.isCriticalError(error),
                custom_map: {
                    error_type: type,
                    error_context: JSON.stringify(context)
                }
            });
        }
    }

    // Utility method to safely execute functions
    safeExecute(fn, fallback = null, context = '') {
        try {
            return fn();
        } catch (error) {
            this.handleError(error, `Safe Execute Error${context ? ` (${context})` : ''}`);
            return fallback;
        }
    }

    // Utility method for async functions
    async safeExecuteAsync(fn, fallback = null, context = '') {
        try {
            return await fn();
        } catch (error) {
            this.handleError(error, `Safe Execute Async Error${context ? ` (${context})` : ''}`);
            return fallback;
        }
    }

    // Reset error count (useful for testing)
    resetErrorCount() {
        this.errorCount = 0;
    }

    // Get current error statistics
    getErrorStats() {
        return {
            errorCount: this.errorCount,
            maxErrors: this.maxErrors,
            isHealthy: this.errorCount < this.maxErrors
        };
    }
}

// Initialize global error handler
window.errorHandler = new ErrorHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
