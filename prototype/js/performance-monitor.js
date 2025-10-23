// Performance Monitor - Track system performance improvements
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Wait for page load to measure performance
        window.addEventListener('load', () => {
            setTimeout(() => this.measurePerformance(), 1000);
        });

        // Monitor runtime performance
        this.monitorRuntimePerformance();
    }

    measurePerformance() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        this.metrics = {
            // Core Web Vitals
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            
            // Resource loading
            totalResources: performance.getEntriesByType('resource').length,
            totalSize: this.calculateTotalResourceSize(),
            
            // Memory usage (if available)
            memoryUsage: this.getMemoryUsage(),
            
            // Connection info
            connectionType: this.getConnectionType(),
            
            // Timestamp
            measuredAt: new Date().toISOString()
        };

        this.displayResults();
        this.saveMetrics();
    }

    calculateTotalResourceSize() {
        const resources = performance.getEntriesByType('resource');
        return resources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);
    }

    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }

    getConnectionType() {
        if ('connection' in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt
            };
        }
        return null;
    }

    monitorRuntimePerformance() {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.metrics.fps = fps;
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    displayResults() {
        console.log('🚀 Campus Mindspace Performance Report:');
        console.log('=====================================');
        
        // Core metrics
        console.log(`📊 Load Time: ${this.metrics.loadTime.toFixed(2)}ms`);
        console.log(`📊 DOM Ready: ${this.metrics.domContentLoaded.toFixed(2)}ms`);
        console.log(`📊 First Paint: ${this.metrics.firstPaint.toFixed(2)}ms`);
        console.log(`📊 First Contentful Paint: ${this.metrics.firstContentfulPaint.toFixed(2)}ms`);
        
        // Resources
        console.log(`📦 Resources Loaded: ${this.metrics.totalResources}`);
        console.log(`📦 Total Size: ${(this.metrics.totalSize / 1024).toFixed(2)}KB`);
        
        // Memory
        if (this.metrics.memoryUsage) {
            console.log(`🧠 Memory Used: ${this.metrics.memoryUsage.used}MB`);
            console.log(`🧠 Memory Total: ${this.metrics.memoryUsage.total}MB`);
        }
        
        // Connection
        if (this.metrics.connectionType) {
            console.log(`🌐 Connection: ${this.metrics.connectionType.effectiveType}`);
            console.log(`🌐 Speed: ${this.metrics.connectionType.downlink}Mbps`);
        }
        
        // Performance rating
        this.ratePerformance();
    }

    ratePerformance() {
        let score = 100;
        const issues = [];

        // Rate based on load time
        if (this.metrics.loadTime > 3000) {
            score -= 30;
            issues.push('Slow load time');
        } else if (this.metrics.loadTime > 2000) {
            score -= 15;
            issues.push('Moderate load time');
        }

        // Rate based on resource count
        if (this.metrics.totalResources > 50) {
            score -= 20;
            issues.push('Too many resources');
        } else if (this.metrics.totalResources > 30) {
            score -= 10;
            issues.push('Many resources');
        }

        // Rate based on total size
        if (this.metrics.totalSize > 2000000) { // 2MB
            score -= 25;
            issues.push('Large resource size');
        } else if (this.metrics.totalSize > 1000000) { // 1MB
            score -= 10;
            issues.push('Moderate resource size');
        }

        // Rate based on memory usage
        if (this.metrics.memoryUsage && this.metrics.memoryUsage.used > 50) {
            score -= 15;
            issues.push('High memory usage');
        }

        const rating = score >= 90 ? 'Excellent' : 
                      score >= 70 ? 'Good' : 
                      score >= 50 ? 'Fair' : 'Poor';

        console.log(`\n⭐ Performance Rating: ${rating} (${score}/100)`);
        
        if (issues.length > 0) {
            console.log('⚠️  Issues found:');
            issues.forEach(issue => console.log(`   - ${issue}`));
        } else {
            console.log('✅ No major performance issues detected!');
        }
    }

    saveMetrics() {
        // Save to localStorage for tracking improvements over time
        const savedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
        savedMetrics.push(this.metrics);
        
        // Keep only last 10 measurements
        if (savedMetrics.length > 10) {
            savedMetrics.splice(0, savedMetrics.length - 10);
        }
        
        localStorage.setItem('performanceMetrics', JSON.stringify(savedMetrics));
    }

    // Method to compare with previous measurements
    compareWithPrevious() {
        const savedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
        if (savedMetrics.length < 2) return;

        const previous = savedMetrics[savedMetrics.length - 2];
        const current = this.metrics;

        console.log('\n📈 Performance Comparison:');
        console.log('==========================');
        
        const loadTimeDiff = current.loadTime - previous.loadTime;
        const resourceDiff = current.totalResources - previous.totalResources;
        const sizeDiff = current.totalSize - previous.totalSize;

        console.log(`Load Time: ${loadTimeDiff > 0 ? '+' : ''}${loadTimeDiff.toFixed(2)}ms`);
        console.log(`Resources: ${resourceDiff > 0 ? '+' : ''}${resourceDiff}`);
        console.log(`Size: ${sizeDiff > 0 ? '+' : ''}${(sizeDiff / 1024).toFixed(2)}KB`);

        if (loadTimeDiff < 0) {
            console.log('✅ Load time improved!');
        } else if (loadTimeDiff > 0) {
            console.log('⚠️  Load time increased');
        }
    }
}

// Initialize performance monitor
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Compare with previous measurements after 2 seconds
    setTimeout(() => {
        window.performanceMonitor.compareWithPrevious();
    }, 2000);
});

// Export for manual testing
if (typeof window !== 'undefined') {
    window.testPerformance = () => {
        if (window.performanceMonitor) {
            window.performanceMonitor.measurePerformance();
        }
    };
}
