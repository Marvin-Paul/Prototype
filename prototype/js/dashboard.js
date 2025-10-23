// Dashboard Management System
class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'home';
        this.dailyTips = [
            "Remember to take short breaks during study sessions. Even 5 minutes of deep breathing can help refresh your mind and improve focus.",
            "Practice gratitude by noting three things you're thankful for each day. This simple habit can significantly boost your mood.",
            "Stay hydrated! Drinking enough water throughout the day helps maintain your energy levels and cognitive function.",
            "Connect with a friend today. Social support is crucial for mental wellness, even if it's just a quick text message.",
            "Try the 5-4-3-2-1 grounding technique when feeling overwhelmed: Name 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
            "Set small, achievable goals for today. Accomplishing them will give you a sense of progress and motivation.",
            "Practice self-compassion. Be as kind to yourself as you would be to a good friend facing the same challenges.",
            "Get some natural light. Even 10-15 minutes outdoors can help regulate your mood and sleep cycle."
        ];
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.setupUserProfile();
        this.setupQuickActions();
        this.setupMoodTracker();
        this.loadDashboardData();
        this.showRandomTip();
    }
    
    checkAuthentication() {
        this.currentUser = AppUtils.get('campusMindspace_currentUser');
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        this.updateUserGreeting();
    }
    
    updateUserGreeting() {
        const userName = this.currentUser?.fullName?.split(' ')[0] || 'Student';
        const greeting = `Welcome back, ${userName}!`;
        
        const mainGreeting = AppUtils.$('#mainGreeting');
        const userGreetingSpan = AppUtils.$('#userGreeting');
        
        if (mainGreeting) mainGreeting.textContent = greeting;
        if (userGreetingSpan) userGreetingSpan.textContent = userName;
    }
    
    setupNavigation() {
        AppUtils.$$('.nav-link').forEach(link => {
            AppUtils.on(link, 'click', (e) => {
                e.preventDefault();
                this.navigateToSection(link.getAttribute('href').substring(1));
            });
        });
        this.toggleAdminSection();
    }
    
    navigateToSection(sectionId) {
        AppUtils.$$('.content-section').forEach(section => section.classList.remove('active'));
        
        const targetSection = AppUtils.$(`#${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            AppUtils.$$('.nav-link').forEach(link => link.classList.remove('active'));
            AppUtils.$(`[href="#${sectionId}"]`)?.classList.add('active');
            
            this.loadSectionData(sectionId);
        }
    }
    
    setupUserProfile() {
        const profileToggle = document.getElementById('profileToggle');
        const profileMenu = document.getElementById('profileMenu');
        const logoutBtn = document.querySelector('.logout-btn');
        
        if (profileToggle && profileMenu) {
            profileToggle.addEventListener('click', () => {
                profileMenu.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileToggle.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileMenu.classList.remove('show');
                }
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }
    
    setupQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });
    }
    
    setupMoodTracker() {
        const moodUpdateBtn = document.querySelector('.mood-update-btn');
        if (moodUpdateBtn) {
            moodUpdateBtn.addEventListener('click', () => {
                this.showMoodUpdateModal();
            });
        }
        
        // Display current mood based on user's initial mood
        this.displayCurrentMood();
    }
    
    displayCurrentMood() {
        const currentMoodDisplay = document.getElementById('currentMoodDisplay');
        if (!currentMoodDisplay || !this.currentUser) return;
        
        const mood = this.currentUser.initialMood;
        const moodText = this.getMoodText(mood);
        const moodIcon = this.getMoodIcon(mood);
        
        currentMoodDisplay.innerHTML = `
            <i class="${moodIcon}"></i>
            <span>${moodText}</span>
        `;
        
        // Add color coding
        currentMoodDisplay.className = `mood-display mood-${mood}`;
    }
    
    getMoodText(mood) {
        const moodTexts = {
            'en': {
                'overwhelmed': 'Feeling overwhelmed',
                'sleep': 'Having sleep issues',
                'social': 'Stressed socially',
                'happy': 'Feeling great!',
                'anxious': 'Feeling anxious',
                'lonely': 'Feeling lonely'
            },
            'es': {
                'overwhelmed': 'Sintiéndome abrumado',
                'sleep': 'Problemas de sueño',
                'social': 'Estrés social',
                'happy': '¡Me siento genial!',
                'anxious': 'Sintiéndome ansioso',
                'lonely': 'Sintiéndome solo'
            },
            'fr': {
                'overwhelmed': 'Me sentir dépassé',
                'sleep': 'Problèmes de sommeil',
                'social': 'Stress social',
                'happy': 'Je me sens bien!',
                'anxious': 'Me sentir anxieux',
                'lonely': 'Me sentir seul'
            }
        };
        
        const currentLang = languageManager.getCurrentLanguage();
        return moodTexts[currentLang]?.[mood] || moodTexts.en[mood] || mood;
    }
    
    getMoodIcon(mood) {
        const moodIcons = {
            'overwhelmed': 'fas fa-exclamation-triangle',
            'sleep': 'fas fa-bed',
            'social': 'fas fa-users',
            'happy': 'fas fa-smile',
            'anxious': 'fas fa-heartbeat',
            'lonely': 'fas fa-user'
        };
        return moodIcons[mood] || 'fas fa-question';
    }
    
    showRandomTip() {
        const tipText = document.getElementById('dailyTipText');
        if (tipText) {
            const randomTip = this.dailyTips[Math.floor(Math.random() * this.dailyTips.length)];
            tipText.textContent = randomTip;
        }
    }
    
    showMoodUpdateModal() {
        // Simple mood update functionality
        const newMood = prompt('How are you feeling? (overwhelmed, sleep, social, happy, anxious, lonely)');
        if (newMood && ['overwhelmed', 'sleep', 'social', 'happy', 'anxious', 'lonely'].includes(newMood)) {
            // Update current user mood (in a real app, this would be saved to server)
            this.currentUser.currentMood = newMood;
            this.displayCurrentMood();
            this.showMessage('Mood updated successfully!', 'success');
        }
    }
    
    loadDashboardData() {
        // Load user statistics and other dashboard data
        this.loadUserStats();
    }
    
    loadUserStats() {
        // In a real application, this would fetch from an API
        // For now, we'll use localStorage data
        const users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        
        if (window.location.hash.includes('admin')) {
            this.loadAdminStats(users);
        }
    }
    
    loadAdminStats(users) {
        const totalUsersEl = document.getElementById('totalUsers');
        if (totalUsersEl) {
            totalUsersEl.textContent = users.length;
        }
        
        // Load mood distribution for admin
        this.loadMoodDistribution();
    }
    
    loadMoodDistribution() {
        const moodData = JSON.parse(localStorage.getItem('campusMindspace_moodData') || '{}');
        const moodDistributionEl = document.getElementById('moodDistribution');
        
        if (moodDistributionEl) {
            const distribution = this.calculateMoodDistribution(moodData);
            const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
            
            moodDistributionEl.innerHTML = Object.entries(distribution)
                .map(([mood, count]) => {
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
                    return `
                        <div class="mood-bar">
                            <span class="mood-label">${this.getMoodText(mood)}</span>
                            <div class="bar-container">
                                <div class="bar mood-${mood}" style="width: ${percentage}%"></div>
                            </div>
                            <span class="mood-count">${count}</span>
                        </div>
                    `;
                }).join('');
        }
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
    
    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'therapy':
                this.loadTherapyData();
                break;
            case 'meditation':
                this.loadMeditationData();
                break;
            case 'resources':
                this.loadResourceData();
                break;
            case 'appointments':
                this.loadAppointmentData();
                break;
            case 'games':
                this.loadGamesData();
                break;
            case 'groups':
                this.loadGroupsData();
                break;
            case 'admin':
                this.loadAdminData();
                break;
        }
    }
    
    loadTherapyData() {
        // Therapy resources would be loaded here
    }
    
    loadMeditationData() {
        // Meditation content would be loaded here
    }
    
    loadResourceData() {
        // Resource content would be loaded here
    }
    
    loadAppointmentData() {
        // Appointment data would be loaded here
    }
    
    loadGamesData() {
        // Games data would be loaded here
    }
    
    loadGroupsData() {
        // Initialize group chat functionality
        if (window.moodGroupManager) {
            // Update groups preview
            window.moodGroupManager.updateGroupsPreview();
            
            const currentMood = window.moodGroupManager.getCurrentMood();
            const currentGroup = window.moodGroupManager.getCurrentGroup();
            
            if (currentMood && currentGroup) {
                // Show current group section
                const currentGroupSection = document.getElementById('currentGroupSection');
                const groupChatSection = document.getElementById('groupChatSection');
                
                if (currentGroupSection) {
                    currentGroupSection.style.display = 'block';
                }
                if (groupChatSection) {
                    groupChatSection.style.display = 'block';
                }
                
                // Update group display
                window.moodGroupManager.updateGroupDisplay();
            } else {
                // Show mood reporting section
                const currentGroupSection = document.getElementById('currentGroupSection');
                const groupChatSection = document.getElementById('groupChatSection');
                
                if (currentGroupSection) {
                    currentGroupSection.style.display = 'none';
                }
                if (groupChatSection) {
                    groupChatSection.style.display = 'none';
                }
            }
        }
    }
    
    loadAdminData() {
        // Admin data would be loaded here
        this.loadAdminStats(JSON.parse(localStorage.getItem('campusMindspace_users') || '[]'));
    }
    
    toggleAdminSection() {
        const adminSection = document.querySelector('.admin-section');
        const adminLink = document.querySelector('.admin-only');
        
        // For demo purposes, show admin section if user is first registered user
        const users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        const isAdmin = users.length > 0 && users[0].id === this.currentUser?.id;
        
        if (adminSection) {
            adminSection.style.display = isAdmin ? 'block' : 'none';
        }
        if (adminLink) {
            adminLink.style.display = isAdmin ? 'block' : 'none';
        }
    }
    
    logout() {
        if (confirm(languageManager.getText('confirm_logout') || 'Are you sure you want to logout?')) {
            localStorage.removeItem('campusMindspace_currentUser');
            window.location.href = 'index.html';
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.dashboard-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `dashboard-message ${type}`;
        messageDiv.textContent = message;
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageDiv, mainContent.firstChild);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }
}

// Global dashboard manager instance
const dashboardManager = new DashboardManager();
