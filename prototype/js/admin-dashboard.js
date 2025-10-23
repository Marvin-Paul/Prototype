// Admin Dashboard Management
class AdminDashboard {
    constructor() {
        this.users = [];
        this.moodData = {};
        this.appointments = [];
        this.activityLog = [];
        this.init();
    }
    
    init() {
        // Verify admin access first
        if (!AdminAuth.verifyAdminAccess()) {
            return; // Will redirect to login
        }
        
        this.loadAdminInfo();
        this.loadDashboardData();
        this.setupEventListeners();
        this.updateStatistics();
        this.displayMoodDistribution();
        this.displayRecentActivity();
    }
    
    loadAdminInfo() {
        const adminInfo = AdminAuth.getAdminInfo();
        if (adminInfo) {
            const usernameEl = document.getElementById('adminUsername');
            if (usernameEl) {
                usernameEl.textContent = adminInfo.username;
            }
        }
    }
    
    loadDashboardData() {
        // Load all data from localStorage
        this.users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        this.moodData = JSON.parse(localStorage.getItem('campusMindspace_moodData') || '{}');
        this.appointments = JSON.parse(localStorage.getItem('campusMindspace_appointments') || '[]');
        this.activityLog = JSON.parse(localStorage.getItem('campusMindspace_activityLog') || '[]');
    }
    
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    AdminAuth.logout();
                }
            });
        }
        
        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAllData());
        }
        
        // Generate report button
        const reportBtn = document.getElementById('generateReportBtn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => this.generateReport());
        }
        
        // View logs button
        const logsBtn = document.getElementById('viewLogsBtn');
        if (logsBtn) {
            logsBtn.addEventListener('click', () => this.viewActivityLogs());
        }
        
        // Manage users button
        const manageBtn = document.getElementById('manageUsersBtn');
        if (manageBtn) {
            manageBtn.addEventListener('click', () => this.manageUsers());
        }
    }
    
    updateStatistics() {
        // Total users
        const totalUsersEl = document.getElementById('totalUsers');
        if (totalUsersEl) {
            totalUsersEl.textContent = this.users.length;
        }
        
        // Active sessions (simulated)
        const activeSessionsEl = document.getElementById('activeSessions');
        if (activeSessionsEl) {
            const activeSessions = Math.floor(this.users.length * 0.3); // 30% active
            activeSessionsEl.textContent = activeSessions;
        }
        
        // Total appointments
        const appointmentsEl = document.getElementById('totalAppointments');
        if (appointmentsEl) {
            appointmentsEl.textContent = this.appointments.length;
        }
        
        // Games played (simulated)
        const gamesEl = document.getElementById('gamesPlayed');
        if (gamesEl) {
            const gamesPlayed = Math.floor(this.users.length * 4.5); // Average 4.5 games per user
            gamesEl.textContent = gamesPlayed;
        }
    }
    
    displayMoodDistribution() {
        const chartContainer = document.getElementById('moodDistributionChart');
        if (!chartContainer) return;
        
        // Calculate mood distribution from user registrations
        const moodCounts = {};
        this.users.forEach(user => {
            const mood = user.initialMood || 'unknown';
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        // Create visual chart
        const total = this.users.length || 1;
        const moodColors = {
            'overwhelmed': '#f59e0b',
            'sleep': '#8b5cf6',
            'social': '#ec4899',
            'happy': '#10b981',
            'anxious': '#ef4444',
            'lonely': '#6b7280'
        };
        
        const moodLabels = {
            'overwhelmed': 'Overwhelmed by Studies',
            'sleep': 'Difficulty Sleeping',
            'social': 'Social Stress',
            'happy': 'Happy/Stable',
            'anxious': 'Anxious/Worried',
            'lonely': 'Isolated/Lonely'
        };
        
        chartContainer.innerHTML = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([mood, count]) => {
                const percentage = ((count / total) * 100).toFixed(1);
                const color = moodColors[mood] || '#6b7280';
                const label = moodLabels[mood] || mood;
                
                return `
                    <div class="mood-chart-item">
                        <div class="mood-chart-label">
                            <span class="mood-dot" style="background: ${color};"></span>
                            <span>${label}</span>
                        </div>
                        <div class="mood-chart-bar">
                            <div class="mood-chart-fill" style="width: ${percentage}%; background: ${color};"></div>
                        </div>
                        <div class="mood-chart-stats">
                            <span class="mood-count">${count} users</span>
                            <span class="mood-percent">${percentage}%</span>
                        </div>
                    </div>
                `;
            }).join('');
    }
    
    displayRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;
        
        // Generate sample recent activities
        const activities = [
            { icon: 'user-plus', text: 'New user registered', time: '5 minutes ago', type: 'success' },
            { icon: 'calendar-check', text: 'Appointment booked with Dr. Sarah Johnson', time: '12 minutes ago', type: 'info' },
            { icon: 'gamepad', text: 'Mind game completed: Memory Challenge', time: '18 minutes ago', type: 'primary' },
            { icon: 'om', text: 'Meditation session started', time: '25 minutes ago', type: 'secondary' },
            { icon: 'user-plus', text: 'New user registered', time: '32 minutes ago', type: 'success' },
            { icon: 'download', text: 'Data export completed', time: '1 hour ago', type: 'warning' },
            { icon: 'music', text: 'Resource accessed: Calming Music', time: '1 hour ago', type: 'info' },
            { icon: 'brain', text: 'Therapy resource viewed: CBT', time: '2 hours ago', type: 'primary' }
        ];
        
        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    exportAllData() {
        const exportData = {
            exportDate: new Date().toISOString(),
            exportedBy: AdminAuth.getAdminInfo()?.username || 'admin',
            statistics: {
                totalUsers: this.users.length,
                totalAppointments: this.appointments.length,
                moodDistribution: this.calculateMoodDistribution()
            },
            users: this.users.map(user => ({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                registrationDate: user.registrationDate,
                initialMood: user.initialMood
            })),
            appointments: this.appointments,
            moodData: this.moodData,
            activityLog: this.activityLog
        };
        
        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `campus-mindspace-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }
    
    generateReport() {
        const reportData = {
            generatedDate: new Date().toISOString(),
            generatedBy: AdminAuth.getAdminInfo()?.username || 'admin',
            summary: {
                totalUsers: this.users.length,
                newUsersThisMonth: this.calculateNewUsersThisMonth(),
                totalAppointments: this.appointments.length,
                mostUsedFeature: 'Mind Games (91% usage)',
                topCounselorDemand: 'Academic Stress (156 bookings)'
            },
            moodDistribution: this.calculateMoodDistribution(),
            featureUsage: {
                therapy: '85%',
                meditation: '72%',
                resources: '68%',
                appointments: '45%',
                games: '91%'
            },
            counselingDemand: {
                academicStress: 156,
                anxietyDepression: 142,
                relationships: 98,
                identity: 67
            },
            recommendations: [
                'Increase counselor availability for Academic Stress specialty',
                'Promote appointment booking feature to increase usage',
                'Continue focus on Mind Games - highest engagement',
                'Consider adding more anxiety/depression resources'
            ]
        };
        
        console.log('Generated Report:', reportData);
        this.showNotification('Report generated successfully! Check console for details.', 'success');
        
        // In production, this would generate a PDF or detailed HTML report
        alert('Report Summary:\n\n' + 
              `Total Users: ${reportData.summary.totalUsers}\n` +
              `New Users This Month: ${reportData.summary.newUsersThisMonth}\n` +
              `Total Appointments: ${reportData.summary.totalAppointments}\n` +
              `Most Used Feature: ${reportData.summary.mostUsedFeature}\n` +
              `Top Counselor Demand: ${reportData.summary.topCounselorDemand}\n\n` +
              'Full report logged to console.');
    }
    
    viewActivityLogs() {
        const failedLogins = JSON.parse(localStorage.getItem('campusMindspace_failedLogins') || '[]');
        
        let logMessage = 'Activity Logs:\n\n';
        logMessage += `Total Users: ${this.users.length}\n`;
        logMessage += `Failed Login Attempts: ${failedLogins.length}\n\n`;
        
        if (failedLogins.length > 0) {
            logMessage += 'Recent Failed Logins:\n';
            failedLogins.slice(-5).forEach(attempt => {
                logMessage += `- ${attempt.username} at ${new Date(attempt.timestamp).toLocaleString()}\n`;
            });
        }
        
        console.log('Activity Logs:', { users: this.users, failedLogins });
        alert(logMessage);
        this.showNotification('Activity logs displayed. Check console for full details.', 'info');
    }
    
    manageUsers() {
        const userList = this.users.map((user, index) => 
            `${index + 1}. ${user.fullName} (${user.email}) - Registered: ${new Date(user.registrationDate).toLocaleDateString()}`
        ).join('\n');
        
        alert(`Total Users: ${this.users.length}\n\n${userList || 'No users registered yet.'}`);
        this.showNotification('User management interface displayed', 'info');
    }
    
    calculateMoodDistribution() {
        const distribution = {};
        this.users.forEach(user => {
            const mood = user.initialMood || 'unknown';
            distribution[mood] = (distribution[mood] || 0) + 1;
        });
        return distribution;
    }
    
    calculateNewUsersThisMonth() {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        return this.users.filter(user => {
            const regDate = new Date(user.registrationDate);
            return regDate.getMonth() === thisMonth && regDate.getFullYear() === thisYear;
        }).length;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    const adminDashboard = new AdminDashboard();
});
