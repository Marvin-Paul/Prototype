// Admin Management System
class AdminManager {
    constructor() {
        this.isAdmin = false;
        this.users = [];
        this.moodData = {};
        this.appointmentData = [];
        this.init();
    }
    
    init() {
        this.checkAdminStatus();
        this.loadAdminData();
        this.setupAdminEvents();
    }
    
    checkAdminStatus() {
        const savedUser = localStorage.getItem('campusMindspace_currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
            this.isAdmin = this.users.length > 0 && this.users[0].id === user.id;
        }
    }
    
    loadAdminData() {
        if (!this.isAdmin) return;
        
        this.users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        this.moodData = JSON.parse(localStorage.getItem('campusMindspace_moodData') || '{}');
        this.appointmentData = JSON.parse(localStorage.getItem('campusMindspace_appointments') || '[]');
        
        this.updateAdminStats();
    }
    
    updateAdminStats() {
        const totalUsersEl = document.getElementById('totalUsers');
        const appointmentsTodayEl = document.getElementById('appointmentsToday');
        
        if (totalUsersEl) {
            totalUsersEl.textContent = this.users.length;
        }
        
        if (appointmentsTodayEl) {
            const today = new Date().toISOString().split('T')[0];
            const todayAppointments = this.appointmentData.filter(apt => apt.date === today).length;
            appointmentsTodayEl.textContent = todayAppointments;
        }
        
        this.updateMoodDistribution();
    }
    
    updateMoodDistribution() {
        const moodDistributionEl = document.getElementById('moodDistribution');
        if (!moodDistributionEl) return;
        
        const distribution = this.calculateMoodDistribution();
        const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
        
        moodDistributionEl.innerHTML = Object.entries(distribution)
            .map(([mood, count]) => {
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                const moodText = this.getMoodText(mood);
                return `
                    <div class="mood-bar">
                        <span class="mood-label">${moodText}</span>
                        <div class="bar-container">
                            <div class="bar mood-${mood}" style="width: ${percentage}%"></div>
                        </div>
                        <span class="mood-count">${count}</span>
                    </div>
                `;
            }).join('');
    }
    
    calculateMoodDistribution() {
        const distribution = {};
        Object.values(this.moodData).forEach(dayData => {
            Object.entries(dayData).forEach(([mood, count]) => {
                distribution[mood] = (distribution[mood] || 0) + count;
            });
        });
        return distribution;
    }
    
    getMoodText(mood) {
        const moodTexts = {
            'overwhelmed': 'Overwhelmed',
            'sleep': 'Sleep Issues',
            'social': 'Social Stress',
            'happy': 'Happy',
            'anxious': 'Anxious',
            'lonely': 'Lonely'
        };
        return moodTexts[mood] || mood;
    }
    
    setupAdminEvents() {
        const exportBtn = document.querySelector('.admin-btn.primary');
        const reportsBtn = document.querySelector('.admin-btn.secondary');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        if (reportsBtn) {
            reportsBtn.addEventListener('click', () => {
                this.showDetailedReports();
            });
        }
    }
    
    exportData() {
        if (!this.isAdmin) return;
        
        const exportData = {
            users: this.users,
            moodData: this.moodData,
            appointments: this.appointmentData,
            exportDate: new Date().toISOString(),
            summary: {
                totalUsers: this.users.length,
                moodDistribution: this.calculateMoodDistribution(),
                totalAppointments: this.appointmentData.length
            }
        };
        
        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `campus-mindspace-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('Data exported successfully!', 'success');
    }
    
    showDetailedReports() {
        if (!this.isAdmin) return;
        
        const reportData = {
            userGrowth: this.calculateUserGrowth(),
            moodTrends: this.calculateMoodTrends(),
            counselorWorkload: this.calculateCounselorWorkload(),
            featureUsage: this.calculateFeatureUsage()
        };
        
        // For demo purposes, show in console
        console.log('Detailed Reports:', reportData);
        
        // In a real application, you would display this in a modal or new page
        this.showMessage('Detailed reports logged to console. Check browser developer tools.', 'info');
    }
    
    calculateUserGrowth() {
        // Calculate user registration trends
        const trend = {};
        this.users.forEach(user => {
            const date = user.registrationDate.split('T')[0];
            trend[date] = (trend[date] || 0) + 1;
        });
        return trend;
    }
    
    calculateMoodTrends() {
        // Calculate mood trends over time
        return this.moodData;
    }
    
    calculateCounselorWorkload() {
        // Calculate appointment distribution by counselor
        const workload = {};
        this.appointmentData.forEach(appointment => {
            const counselor = appointment.counselorId;
            workload[counselor] = (workload[counselor] || 0) + 1;
        });
        return workload;
    }
    
    calculateFeatureUsage() {
        // Calculate which features are used most
        // This would be tracked in a real application
        return {
            therapy: Math.floor(Math.random() * 100),
            meditation: Math.floor(Math.random() * 100),
            resources: Math.floor(Math.random() * 100),
            appointments: Math.floor(Math.random() * 100),
            games: Math.floor(Math.random() * 100)
        };
    }
    
    showMessage(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global admin manager instance
const adminManager = new AdminManager();
