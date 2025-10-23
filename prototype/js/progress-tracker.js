// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.progressData = this.loadProgressData();
        this.init();
    }
    
    init() {
        this.setupProgressListeners();
        this.updateProgressDisplay();
        this.animateProgressCircle();
    }
    
    setupProgressListeners() {
        // View Details Button
        const viewDetailsBtn = document.getElementById('viewProgressBtn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                this.showDetailedProgress();
            });
        }
        
        // My Progress menu item
        const progressMenuItem = document.querySelector('[data-lang="profile_progress"]');
        if (progressMenuItem) {
            progressMenuItem.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToProgress();
            });
        }
    }
    
    loadProgressData() {
        const saved = localStorage.getItem('campusMindspace_progress');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default progress data
        return {
            overallProgress: 40,
            activitiesCompleted: 12,
            activitiesGoal: 20,
            moodTrend: 'improving',
            moodData: [40, 50, 60, 55, 70, 75, 80],
            currentStreak: 5,
            lastUpdated: new Date().toISOString()
        };
    }
    
    saveProgressData() {
        localStorage.setItem('campusMindspace_progress', JSON.stringify(this.progressData));
    }
    
    updateProgressDisplay() {
        // Update overall progress
        const progressValue = document.getElementById('overallProgressValue');
        if (progressValue) {
            progressValue.textContent = this.progressData.overallProgress;
        }
        
        // Update activities count
        const activitiesCount = document.getElementById('activitiesCount');
        if (activitiesCount) {
            activitiesCount.textContent = this.progressData.activitiesCompleted;
        }
        
        // Update activities progress bar
        const progressPercentage = (this.progressData.activitiesCompleted / this.progressData.activitiesGoal) * 100;
        const miniProgressBar = document.querySelector('.mini-progress-bar');
        if (miniProgressBar) {
            miniProgressBar.style.width = `${progressPercentage}%`;
        }
        
        // Update mood trend
        const moodTrend = document.getElementById('moodTrend');
        if (moodTrend) {
            const trendClass = this.progressData.moodTrend === 'improving' ? 'improving' : 
                              this.progressData.moodTrend === 'declining' ? 'declining' : 'stable';
            moodTrend.className = `status-number ${trendClass}`;
            
            const icon = this.progressData.moodTrend === 'improving' ? 'fa-arrow-up' : 
                        this.progressData.moodTrend === 'declining' ? 'fa-arrow-down' : 'fa-minus';
            
            moodTrend.innerHTML = `<i class="fas ${icon}"></i> ${this.progressData.moodTrend.charAt(0).toUpperCase() + this.progressData.moodTrend.slice(1)}`;
        }
        
        // Update streak count
        const streakCount = document.getElementById('streakCount');
        if (streakCount) {
            streakCount.textContent = this.progressData.currentStreak;
        }
        
        // Update streak dots
        this.updateStreakDots();
    }
    
    updateStreakDots() {
        const dots = document.querySelectorAll('.streak-dots .dot');
        dots.forEach((dot, index) => {
            if (index < this.progressData.currentStreak) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    animateProgressCircle() {
        const progressRing = document.querySelector('.progress-ring');
        if (!progressRing) return;
        
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const progress = this.progressData.overallProgress;
        const offset = circumference - (progress / 100) * circumference;
        
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            progressRing.style.strokeDashoffset = offset;
        }, 100);
    }
    
    scrollToProgress() {
        const progressSection = document.querySelector('.progress-status-section');
        if (progressSection) {
            progressSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Add highlight animation
            progressSection.style.animation = 'highlight 1s ease';
            setTimeout(() => {
                progressSection.style.animation = '';
            }, 1000);
        }
    }
    
    showDetailedProgress() {
        // Create modal for detailed progress
        const modal = document.createElement('div');
        modal.className = 'progress-modal';
        modal.innerHTML = `
            <div class="progress-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-chart-line"></i> Detailed Progress Report</h2>
                    <button type="button" class="close-modal" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="progress-stats-grid">
                        <div class="stat-card">
                            <h3>Overall Wellness Score</h3>
                            <div class="big-number">${this.progressData.overallProgress}%</div>
                            <p class="stat-description">Based on your activities and mood tracking</p>
                        </div>
                        
                        <div class="stat-card">
                            <h3>Activities This Week</h3>
                            <div class="big-number">${this.progressData.activitiesCompleted}/${this.progressData.activitiesGoal}</div>
                            <div class="progress-bar-full">
                                <div class="progress-fill" style="width: ${(this.progressData.activitiesCompleted / this.progressData.activitiesGoal) * 100}%"></div>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <h3>Current Streak</h3>
                            <div class="big-number">${this.progressData.currentStreak} Days</div>
                            <p class="stat-description">Keep it up! Consistency is key</p>
                        </div>
                        
                        <div class="stat-card">
                            <h3>Mood Trend</h3>
                            <div class="mood-chart">
                                ${this.progressData.moodData.map((value, index) => `
                                    <div class="mood-bar" style="height: ${value}%">
                                        <span class="mood-value">${value}%</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="mood-labels">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress-insights">
                        <h3><i class="fas fa-lightbulb"></i> Insights & Recommendations</h3>
                        <ul class="insights-list">
                            ${this.generateInsights()}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Animate modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    generateInsights() {
        const insights = [];
        
        if (this.progressData.overallProgress < 50) {
            insights.push('<li><i class="fas fa-info-circle"></i> Try to engage with at least one wellness activity daily to improve your score.</li>');
        } else if (this.progressData.overallProgress >= 70) {
            insights.push('<li><i class="fas fa-star"></i> Excellent progress! You\'re maintaining great wellness habits.</li>');
        }
        
        if (this.progressData.currentStreak >= 7) {
            insights.push('<li><i class="fas fa-fire"></i> Amazing! You\'ve maintained a week-long streak. Keep the momentum going!</li>');
        } else if (this.progressData.currentStreak < 3) {
            insights.push('<li><i class="fas fa-calendar-check"></i> Build consistency by setting a daily reminder for wellness activities.</li>');
        }
        
        if (this.progressData.moodTrend === 'improving') {
            insights.push('<li><i class="fas fa-smile"></i> Your mood has been trending upward. Great work on your mental health journey!</li>');
        } else if (this.progressData.moodTrend === 'declining') {
            insights.push('<li><i class="fas fa-heart"></i> Consider reaching out to a counselor or trying meditation exercises.</li>');
        }
        
        const activitiesRemaining = this.progressData.activitiesGoal - this.progressData.activitiesCompleted;
        if (activitiesRemaining > 0) {
            insights.push(`<li><i class="fas fa-target"></i> ${activitiesRemaining} more activities to reach your weekly goal!</li>`);
        }
        
        return insights.join('');
    }
    
    // Method to update progress when activities are completed
    incrementActivity() {
        this.progressData.activitiesCompleted++;
        this.progressData.overallProgress = Math.min(100, this.progressData.overallProgress + 5);
        this.progressData.lastUpdated = new Date().toISOString();
        this.saveProgressData();
        this.updateProgressDisplay();
        this.animateProgressCircle();
    }
    
    // Method to update streak
    updateStreak() {
        const lastUpdate = new Date(this.progressData.lastUpdated);
        const today = new Date();
        const daysDiff = Math.floor((today - lastUpdate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
            this.progressData.currentStreak++;
        } else if (daysDiff > 1) {
            this.progressData.currentStreak = 1;
        }
        
        this.progressData.lastUpdated = today.toISOString();
        this.saveProgressData();
        this.updateProgressDisplay();
    }
    
    // Method to log mood
    logMood(moodValue) {
        this.progressData.moodData.push(moodValue);
        if (this.progressData.moodData.length > 7) {
            this.progressData.moodData.shift();
        }
        
        // Calculate trend
        const recent = this.progressData.moodData.slice(-3);
        const older = this.progressData.moodData.slice(0, 3);
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        if (recentAvg > olderAvg + 5) {
            this.progressData.moodTrend = 'improving';
        } else if (recentAvg < olderAvg - 5) {
            this.progressData.moodTrend = 'declining';
        } else {
            this.progressData.moodTrend = 'stable';
        }
        
        this.saveProgressData();
        this.updateProgressDisplay();
    }
}

// Initialize progress tracker
const progressTracker = new ProgressTracker();

// Add CSS for highlight animation
const style = document.createElement('style');
style.textContent = `
@keyframes highlight {
    0%, 100% { box-shadow: var(--shadow-lg); }
    50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
}
`;
document.head.appendChild(style);
