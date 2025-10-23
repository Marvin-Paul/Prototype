// Settings Page Functionality
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.loadUserData();
        this.attachEventListeners();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            theme: 'light',
            fontSize: 'medium',
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            notifications: {
                email: true,
                appointments: true,
                dailyTips: true,
                moodReminders: false
            },
            privacy: {
                twoFactor: false,
                anonymousMode: false,
                shareData: false,
                personalizedRecs: true
            },
            accessibility: {
                reduceMotion: false
            }
        };

        const saved = localStorage.getItem('userSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (userData.fullName) document.getElementById('fullName').value = userData.fullName;
        if (userData.email) document.getElementById('email').value = userData.email;
        if (userData.studentId) document.getElementById('studentId').value = userData.studentId;
        if (userData.department) document.getElementById('department').value = userData.department;

        // Load emergency contact
        if (userData.emergencyContact) {
            document.getElementById('emergencyName').value = userData.emergencyContact.name || '';
            document.getElementById('emergencyPhone').value = userData.emergencyContact.phone || '';
            document.getElementById('relationship').value = userData.emergencyContact.relationship || '';
        }
    }

    applySettings() {
        // Apply theme
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === this.settings.theme) {
                btn.classList.add('active');
            }
        });

        // Apply font size
        if (this.settings.fontSize) {
            document.getElementById('fontSize').value = this.settings.fontSize;
        }

        // Apply language
        if (this.settings.language) {
            document.getElementById('language').value = this.settings.language;
        }

        // Apply timezone
        if (this.settings.timezone) {
            document.getElementById('timezone').value = this.settings.timezone;
        }

        // Apply date format
        if (this.settings.dateFormat) {
            document.getElementById('dateFormat').value = this.settings.dateFormat;
        }

        // Apply notification toggles
        document.getElementById('emailNotif').checked = this.settings.notifications.email;
        document.getElementById('appointmentReminders').checked = this.settings.notifications.appointments;
        document.getElementById('dailyTips').checked = this.settings.notifications.dailyTips;
        document.getElementById('moodReminders').checked = this.settings.notifications.moodReminders;

        // Apply privacy toggles
        document.getElementById('twoFactor').checked = this.settings.privacy.twoFactor;
        document.getElementById('anonymousMode').checked = this.settings.privacy.anonymousMode;
        document.getElementById('shareData').checked = this.settings.privacy.shareData;
        document.getElementById('personalizedRecs').checked = this.settings.privacy.personalizedRecs;

        // Apply accessibility
        document.getElementById('reduceMotion').checked = this.settings.accessibility.reduceMotion;
    }

    attachEventListeners() {
        // Account settings save
        const accountSection = document.querySelector('.settings-section');
        const accountSaveBtn = accountSection.querySelector('.save-btn');
        if (accountSaveBtn) {
            accountSaveBtn.addEventListener('click', () => this.saveAccountSettings());
        }

        // Theme buttons
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.theme = btn.dataset.theme;
                this.saveSettings();
            });
        });

        // Font size
        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.settings.fontSize = e.target.value;
            this.saveSettings();
        });

        // Language
        document.getElementById('language').addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.saveSettings();
        });

        // Timezone
        document.getElementById('timezone').addEventListener('change', (e) => {
            this.settings.timezone = e.target.value;
            this.saveSettings();
        });

        // Date format
        document.getElementById('dateFormat').addEventListener('change', (e) => {
            this.settings.dateFormat = e.target.value;
            this.saveSettings();
        });

        // Notification toggles
        document.getElementById('emailNotif').addEventListener('change', (e) => {
            this.settings.notifications.email = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('appointmentReminders').addEventListener('change', (e) => {
            this.settings.notifications.appointments = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('dailyTips').addEventListener('change', (e) => {
            this.settings.notifications.dailyTips = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('moodReminders').addEventListener('change', (e) => {
            this.settings.notifications.moodReminders = e.target.checked;
            this.saveSettings();
        });

        // Privacy toggles
        document.getElementById('twoFactor').addEventListener('change', (e) => {
            this.settings.privacy.twoFactor = e.target.checked;
            if (e.target.checked) {
                this.showNotification('Two-factor authentication will be set up via email', 'info');
            }
            this.saveSettings();
        });

        document.getElementById('anonymousMode').addEventListener('change', (e) => {
            this.settings.privacy.anonymousMode = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('shareData').addEventListener('change', (e) => {
            this.settings.privacy.shareData = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('personalizedRecs').addEventListener('change', (e) => {
            this.settings.privacy.personalizedRecs = e.target.checked;
            this.saveSettings();
        });

        // Accessibility
        document.getElementById('reduceMotion').addEventListener('change', (e) => {
            this.settings.accessibility.reduceMotion = e.target.checked;
            this.saveSettings();
        });

        // Password change
        const securitySaveBtn = document.querySelectorAll('.save-btn')[1];
        if (securitySaveBtn) {
            securitySaveBtn.addEventListener('click', () => this.changePassword());
        }

        // Emergency contact save
        const emergencySaveBtn = document.querySelectorAll('.save-btn')[6];
        if (emergencySaveBtn) {
            emergencySaveBtn.addEventListener('click', () => this.saveEmergencyContact());
        }

        // Data actions
        const downloadBtn = document.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadData());
        }

        const deleteBtn = document.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteAccount());
        }
    }

    saveAccountSettings() {
        const userData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            studentId: document.getElementById('studentId').value,
            department: document.getElementById('department').value
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        this.showNotification('Account information updated successfully!', 'success');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'error');
            return;
        }

        // In a real app, this would make an API call
        this.showNotification('Password updated successfully!', 'success');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    saveEmergencyContact() {
        const emergencyContact = {
            name: document.getElementById('emergencyName').value,
            phone: document.getElementById('emergencyPhone').value,
            relationship: document.getElementById('relationship').value
        };

        if (!emergencyContact.name || !emergencyContact.phone) {
            this.showNotification('Please provide contact name and phone number', 'error');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.emergencyContact = emergencyContact;
        localStorage.setItem('userData', JSON.stringify(userData));

        this.showNotification('Emergency contact saved successfully!', 'success');
    }

    downloadData() {
        const allData = {
            settings: this.settings,
            userData: JSON.parse(localStorage.getItem('userData') || '{}'),
            moodData: JSON.parse(localStorage.getItem('moodData') || '[]'),
            gratitudeEntries: JSON.parse(localStorage.getItem('gratitudeEntries') || '[]')
        };

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `campus-mindspace-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Your data has been downloaded', 'success');
    }

    deleteAccount() {
        const confirmed = confirm(
            'Are you sure you want to delete your account? This action cannot be undone.\n\n' +
            'All your data including mood logs, gratitude entries, and settings will be permanently deleted.'
        );

        if (confirmed) {
            const doubleConfirm = confirm('This is your last chance. Are you absolutely sure?');
            
            if (doubleConfirm) {
                // Clear all data
                localStorage.clear();
                sessionStorage.clear();
                
                this.showNotification('Account deleted. Redirecting...', 'info');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00c853' : type === 'error' ? '#f44336' : '#00b5ad'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize settings manager
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});
