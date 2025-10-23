// Post-Launch Monitoring Dashboard
class PostLaunchMonitor {
    constructor() {
        this.metrics = {
            launchDate: new Date().toISOString(),
            dailyStats: {},
            weeklyStats: {},
            alerts: [],
            goals: {
                dailyVisitors: 50,
                weeklyVisitors: 300,
                userRegistrations: 20,
                moodCheckins: 50,
                averageSessionTime: 120, // seconds
                bounceRate: 0.05 // 5%
            }
        };
        
        this.init();
    }

    init() {
        this.setupDailyMonitoring();
        this.setupWeeklyReporting();
        this.setupAlerts();
        this.setupGoalTracking();
        this.createDashboard();
    }

    setupDailyMonitoring() {
        // Track daily metrics
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.metrics.dailyStats[today]) {
            this.metrics.dailyStats[today] = {
                visitors: 0,
                pageViews: 0,
                registrations: 0,
                moodCheckins: 0,
                themeChanges: 0,
                errors: 0,
                avgSessionTime: 0,
                bounceRate: 0
            };
        }

        // Track visitor
        this.trackVisitor();
        
        // Track page views
        this.trackPageView();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Save daily stats
        this.saveDailyStats();
    }

    trackVisitor() {
        const today = new Date().toISOString().split('T')[0];
        const sessionKey = `visitor_${today}_${this.getSessionId()}`;
        
        if (!sessionStorage.getItem(sessionKey)) {
            this.metrics.dailyStats[today].visitors++;
            sessionStorage.setItem(sessionKey, 'true');
            this.saveMetrics();
        }
    }

    trackPageView() {
        const today = new Date().toISOString().split('T')[0];
        this.metrics.dailyStats[today].pageViews++;
        
        // Track session time
        const sessionStart = performance.now();
        window.addEventListener('beforeunload', () => {
            const sessionTime = Math.round((performance.now() - sessionStart) / 1000);
            this.metrics.dailyStats[today].avgSessionTime = 
                (this.metrics.dailyStats[today].avgSessionTime + sessionTime) / 2;
        });
        
        this.saveMetrics();
    }

    trackUserInteractions() {
        // Track registrations
        const registerForm = document.getElementById('registerFormData');
        if (registerForm) {
            registerForm.addEventListener('submit', () => {
                const today = new Date().toISOString().split('T')[0];
                this.metrics.dailyStats[today].registrations++;
                this.saveMetrics();
                this.checkGoalProgress();
            });
        }

        // Track mood check-ins
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mood-option')) {
                const today = new Date().toISOString().split('T')[0];
                this.metrics.dailyStats[today].moodCheckins++;
                this.saveMetrics();
                this.checkGoalProgress();
            }
        });

        // Track theme changes
        document.addEventListener('click', (e) => {
            if (e.target.matches('.theme-option')) {
                const today = new Date().toISOString().split('T')[0];
                this.metrics.dailyStats[today].themeChanges++;
                this.saveMetrics();
            }
        });

        // Track errors
        window.addEventListener('error', () => {
            const today = new Date().toISOString().split('T')[0];
            this.metrics.dailyStats[today].errors++;
            this.saveMetrics();
            this.checkAlerts();
        });
    }

    setupWeeklyReporting() {
        // Generate weekly report every Sunday
        const now = new Date();
        const daysUntilSunday = (7 - now.getDay()) % 7;
        const nextSunday = new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
        nextSunday.setHours(23, 59, 59, 999);
        
        const timeUntilSunday = nextSunday.getTime() - now.getTime();
        
        setTimeout(() => {
            this.generateWeeklyReport();
            this.setupWeeklyReporting(); // Schedule next week
        }, timeUntilSunday);
    }

    generateWeeklyReport() {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        
        const weeklyData = this.calculateWeeklyStats();
        
        this.metrics.weeklyStats[weekStart.toISOString().split('T')[0]] = weeklyData;
        
        console.log('📊 Weekly Report Generated:', weeklyData);
        
        // Send report (if analytics endpoint available)
        this.sendWeeklyReport(weeklyData);
        
        this.saveMetrics();
    }

    calculateWeeklyStats() {
        const last7Days = this.getLast7Days();
        let totalVisitors = 0;
        let totalPageViews = 0;
        let totalRegistrations = 0;
        let totalMoodCheckins = 0;
        let totalErrors = 0;
        let avgSessionTime = 0;
        let avgBounceRate = 0;

        last7Days.forEach(day => {
            if (this.metrics.dailyStats[day]) {
                const dayStats = this.metrics.dailyStats[day];
                totalVisitors += dayStats.visitors;
                totalPageViews += dayStats.pageViews;
                totalRegistrations += dayStats.registrations;
                totalMoodCheckins += dayStats.moodCheckins;
                totalErrors += dayStats.errors;
                avgSessionTime += dayStats.avgSessionTime;
                avgBounceRate += dayStats.bounceRate;
            }
        });

        const daysWithData = last7Days.filter(day => this.metrics.dailyStats[day]).length;
        
        return {
            weekStart: last7Days[0],
            weekEnd: last7Days[6],
            totalVisitors,
            totalPageViews,
            totalRegistrations,
            totalMoodCheckins,
            totalErrors,
            avgSessionTime: avgSessionTime / daysWithData || 0,
            avgBounceRate: avgBounceRate / daysWithData || 0,
            dailyAverage: {
                visitors: Math.round(totalVisitors / 7),
                pageViews: Math.round(totalPageViews / 7),
                registrations: Math.round(totalRegistrations / 7),
                moodCheckins: Math.round(totalMoodCheckins / 7)
            }
        };
    }

    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    }

    setupAlerts() {
        // Check for alerts every hour
        setInterval(() => {
            this.checkAlerts();
        }, 60 * 60 * 1000);
    }

    checkAlerts() {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.metrics.dailyStats[today];
        
        if (!todayStats) return;

        // High error rate alert
        if (todayStats.errors > 10) {
            this.addAlert('high_errors', `High error rate detected: ${todayStats.errors} errors today`);
        }

        // Low visitor count alert
        if (todayStats.visitors < 5) {
            this.addAlert('low_traffic', `Low traffic detected: ${todayStats.visitors} visitors today`);
        }

        // High bounce rate alert
        if (todayStats.bounceRate > 0.8) {
            this.addAlert('high_bounce', `High bounce rate: ${(todayStats.bounceRate * 100).toFixed(1)}%`);
        }

        // Performance issues
        if (todayStats.avgSessionTime < 30) {
            this.addAlert('low_engagement', `Low session time: ${todayStats.avgSessionTime}s average`);
        }
    }

    addAlert(type, message) {
        const alert = {
            id: Date.now(),
            type: type,
            message: message,
            timestamp: new Date().toISOString(),
            resolved: false
        };
        
        this.metrics.alerts.push(alert);
        console.warn(`🚨 Alert: ${message}`);
        
        // Send alert notification
        this.sendAlert(alert);
        
        this.saveMetrics();
    }

    setupGoalTracking() {
        // Check goal progress daily
        setInterval(() => {
            this.checkGoalProgress();
        }, 24 * 60 * 60 * 1000);
    }

    checkGoalProgress() {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.metrics.dailyStats[today];
        
        if (!todayStats) return;

        const goals = this.metrics.goals;
        
        // Check daily visitor goal
        if (todayStats.visitors >= goals.dailyVisitors) {
            console.log(`🎯 Daily visitor goal reached: ${todayStats.visitors}/${goals.dailyVisitors}`);
        }

        // Check registration goal
        if (todayStats.registrations >= goals.userRegistrations) {
            console.log(`🎯 Registration goal reached: ${todayStats.registrations}/${goals.userRegistrations}`);
        }

        // Check mood check-in goal
        if (todayStats.moodCheckins >= goals.moodCheckins) {
            console.log(`🎯 Mood check-in goal reached: ${todayStats.moodCheckins}/${goals.moodCheckins}`);
        }
    }

    createDashboard() {
        // Create monitoring dashboard
        const dashboard = document.createElement('div');
        dashboard.id = 'monitoring-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            display: none;
        `;
        
        document.body.appendChild(dashboard);
        
        // Toggle dashboard with Ctrl+Shift+M
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
                if (dashboard.style.display === 'block') {
                    this.updateDashboard();
                }
            }
        });
    }

    updateDashboard() {
        const dashboard = document.getElementById('monitoring-dashboard');
        if (!dashboard) return;

        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.metrics.dailyStats[today] || {};
        const weeklyStats = this.calculateWeeklyStats();
        
        dashboard.innerHTML = `
            <h3>📊 Campus Mindspace Monitor</h3>
            <div><strong>Today (${today}):</strong></div>
            <div>👥 Visitors: ${todayStats.visitors || 0}</div>
            <div>📄 Page Views: ${todayStats.pageViews || 0}</div>
            <div>📝 Registrations: ${todayStats.registrations || 0}</div>
            <div>😊 Mood Check-ins: ${todayStats.moodCheckins || 0}</div>
            <div>🎨 Theme Changes: ${todayStats.themeChanges || 0}</div>
            <div>❌ Errors: ${todayStats.errors || 0}</div>
            <div>⏱️ Avg Session: ${Math.round(todayStats.avgSessionTime || 0)}s</div>
            
            <div style="margin-top: 10px;"><strong>This Week:</strong></div>
            <div>👥 Total Visitors: ${weeklyStats.totalVisitors}</div>
            <div>📄 Total Page Views: ${weeklyStats.totalPageViews}</div>
            <div>📝 Total Registrations: ${weeklyStats.totalRegistrations}</div>
            <div>😊 Total Mood Check-ins: ${weeklyStats.totalMoodCheckins}</div>
            
            <div style="margin-top: 10px;"><strong>Goals Progress:</strong></div>
            <div>👥 Daily Visitors: ${todayStats.visitors || 0}/${this.metrics.goals.dailyVisitors}</div>
            <div>📝 Registrations: ${todayStats.registrations || 0}/${this.metrics.goals.userRegistrations}</div>
            <div>😊 Mood Check-ins: ${todayStats.moodCheckins || 0}/${this.metrics.goals.moodCheckins}</div>
            
            <div style="margin-top: 10px;"><strong>Alerts:</strong></div>
            <div>🚨 Active: ${this.metrics.alerts.filter(a => !a.resolved).length}</div>
            
            <div style="margin-top: 10px; font-size: 10px;">
                Press Ctrl+Shift+M to toggle
            </div>
        `;
    }

    sendWeeklyReport(weeklyData) {
        // Send to analytics endpoint if available
        fetch('/api/analytics/weekly-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                report: weeklyData,
                timestamp: new Date().toISOString()
            })
        }).catch(error => {
            console.log('Weekly report endpoint not available:', error);
        });
    }

    sendAlert(alert) {
        // Send alert notification if available
        fetch('/api/analytics/alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alert)
        }).catch(error => {
            console.log('Alert endpoint not available:', error);
        });
    }

    saveDailyStats() {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`dailyStats_${today}`, JSON.stringify(this.metrics.dailyStats[today]));
    }

    saveMetrics() {
        localStorage.setItem('postLaunchMetrics', JSON.stringify(this.metrics));
    }

    loadMetrics() {
        const saved = localStorage.getItem('postLaunchMetrics');
        if (saved) {
            this.metrics = { ...this.metrics, ...JSON.parse(saved) };
        }
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('monitoring_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('monitoring_session_id', sessionId);
        }
        return sessionId;
    }

    // Public methods for manual monitoring
    getTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        return this.metrics.dailyStats[today] || {};
    }

    getWeeklyStats() {
        return this.calculateWeeklyStats();
    }

    getAlerts() {
        return this.metrics.alerts.filter(a => !a.resolved);
    }

    resolveAlert(alertId) {
        const alert = this.metrics.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.resolved = true;
            this.saveMetrics();
        }
    }

    updateGoals(newGoals) {
        this.metrics.goals = { ...this.metrics.goals, ...newGoals };
        this.saveMetrics();
    }
}

// Initialize post-launch monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.postLaunchMonitor = new PostLaunchMonitor();
    
    // Load existing metrics
    window.postLaunchMonitor.loadMetrics();
    
    console.log('📊 Post-launch monitoring initialized');
    console.log('Press Ctrl+Shift+M to view monitoring dashboard');
});

// Export for manual use
if (typeof window !== 'undefined') {
    window.getTodayStats = () => window.postLaunchMonitor?.getTodayStats();
    window.getWeeklyStats = () => window.postLaunchMonitor?.getWeeklyStats();
    window.getAlerts = () => window.postLaunchMonitor?.getAlerts();
    window.updateGoals = (goals) => window.postLaunchMonitor?.updateGoals(goals);
}
