// Comprehensive Mood Tracking System
class MoodTracker {
    constructor() {
        this.currentMood = null;
        this.moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        this.moodCategories = this.getMoodCategories();
        this.moodFactors = this.getMoodFactors();
        this.insights = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMoodHistory();
        this.updateMoodDisplay();
        this.generateInsights();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mood-update-btn')) {
                this.showMoodModal();
            }

            if (e.target.classList.contains('mood-option')) {
                this.selectMood(e.target.dataset.mood);
            }

            if (e.target.classList.contains('mood-factor-option')) {
                this.toggleMoodFactor(e.target.dataset.factor);
            }

            if (e.target.classList.contains('save-mood-btn')) {
                this.saveMoodEntry();
            }

            if (e.target.classList.contains('view-mood-history')) {
                this.showMoodHistory();
            }

            if (e.target.classList.contains('mood-analytics-btn')) {
                this.showMoodAnalytics();
            }
        });
    }

    getMoodCategories() {
        return {
            excellent: {
                emoji: '😄',
                color: '#10b981',
                description: 'Excellent',
                level: 5
            },
            good: {
                emoji: '😊',
                color: '#3b82f6',
                description: 'Good',
                level: 4
            },
            okay: {
                emoji: '😐',
                color: '#f59e0b',
                description: 'Okay',
                level: 3
            },
            poor: {
                emoji: '😔',
                color: '#ef4444',
                description: 'Poor',
                level: 2
            },
            terrible: {
                emoji: '😢',
                color: '#dc2626',
                description: 'Terrible',
                level: 1
            }
        };
    }

    getMoodFactors() {
        return {
            sleep: { name: 'Sleep Quality', icon: 'fas fa-bed' },
            exercise: { name: 'Exercise', icon: 'fas fa-dumbbell' },
            social: { name: 'Social Connection', icon: 'fas fa-users' },
            work: { name: 'Work/Study', icon: 'fas fa-briefcase' },
            weather: { name: 'Weather', icon: 'fas fa-cloud-sun' },
            food: { name: 'Food/Nutrition', icon: 'fas fa-utensils' },
            stress: { name: 'Stress Level', icon: 'fas fa-heartbeat' },
            activities: { name: 'Fun Activities', icon: 'fas fa-gamepad' }
        };
    }

    showMoodModal() {
        const modal = this.createModal('mood-tracker');
        
        modal.innerHTML = `
            <div class="mood-tracker-modal">
                <div class="modal-header">
                    <h2>How are you feeling today?</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="mood-content">
                    <div class="mood-selector">
                        <div class="mood-options">
                            ${Object.entries(this.moodCategories).map(([key, mood]) => `
                                <button class="mood-option" data-mood="${key}">
                                    <div class="mood-emoji">${mood.emoji}</div>
                                    <span class="mood-label">${mood.description}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="mood-factors" id="moodFactors" style="display: none;">
                        <h3>What might be affecting your mood today?</h3>
                        <div class="factors-grid">
                            ${Object.entries(this.moodFactors).map(([key, factor]) => `
                                <button class="mood-factor-option" data-factor="${key}">
                                    <i class="${factor.icon}"></i>
                                    <span>${factor.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="mood-notes" id="moodNotes" style="display: none;">
                        <h3>Additional Notes (Optional)</h3>
                        <textarea id="moodNotesText" placeholder="What's on your mind? Any specific thoughts or events that affected your mood today?"></textarea>
                    </div>

                    <div class="mood-actions" id="moodActions" style="display: none;">
                        <button class="save-mood-btn">Save Mood Entry</button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    selectMood(moodKey) {
        this.currentMood = moodKey;
        
        // Update UI
        document.querySelectorAll('.mood-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${moodKey}"]`).classList.add('selected');

        // Show next sections
        document.getElementById('moodFactors').style.display = 'block';
        document.getElementById('moodNotes').style.display = 'block';
        document.getElementById('moodActions').style.display = 'block';
    }

    toggleMoodFactor(factorKey) {
        const btn = document.querySelector(`[data-factor="${factorKey}"]`);
        btn.classList.toggle('selected');
    }

    saveMoodEntry() {
        if (!this.currentMood) {
            this.showNotification('Please select your mood first', 'warning');
            return;
        }

        const selectedFactors = Array.from(document.querySelectorAll('.mood-factor-option.selected'))
            .map(btn => btn.dataset.factor);
        
        const notes = document.getElementById('moodNotesText').value.trim();

        const moodEntry = {
            id: Date.now().toString(),
            mood: this.currentMood,
            factors: selectedFactors,
            notes: notes,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };

        this.moodHistory.push(moodEntry);
        this.saveMoodHistory();
        this.updateMoodDisplay();
        this.generateInsights();
        
        this.showNotification('Mood entry saved successfully!', 'success');
        this.closeModal(document.querySelector('.mood-tracker-modal').parentNode);
    }

    updateMoodDisplay() {
        const moodDisplay = document.getElementById('currentMoodDisplay');
        if (!moodDisplay || this.moodHistory.length === 0) return;

        const latestEntry = this.moodHistory[this.moodHistory.length - 1];
        const moodData = this.moodCategories[latestEntry.mood];
        
        moodDisplay.innerHTML = `
            <i class="fas fa-${this.getMoodIcon(latestEntry.mood)}" style="color: ${moodData.color}"></i>
            <span>${moodData.description}</span>
        `;
    }

    getMoodIcon(mood) {
        const icons = {
            excellent: 'smile',
            good: 'smile-beam',
            okay: 'meh',
            poor: 'frown',
            terrible: 'sad-tear'
        };
        return icons[mood] || 'meh';
    }

    showMoodHistory() {
        const modal = this.createModal('mood-history');
        
        const recentEntries = this.moodHistory.slice(-10).reverse();
        
        modal.innerHTML = `
            <div class="mood-history-modal">
                <div class="modal-header">
                    <h2>Your Mood History</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="history-content">
                    ${recentEntries.length === 0 ? `
                        <div class="no-entries">
                            <p>No mood entries yet. Start tracking your mood to see your history!</p>
                        </div>
                    ` : `
                        <div class="entries-list">
                            ${recentEntries.map(entry => {
                                const moodData = this.moodCategories[entry.mood];
                                return `
                                    <div class="mood-entry">
                                        <div class="entry-date">${entry.date}</div>
                                        <div class="entry-mood">
                                            <span class="mood-emoji">${moodData.emoji}</span>
                                            <span class="mood-description">${moodData.description}</span>
                                        </div>
                                        ${entry.factors.length > 0 ? `
                                            <div class="entry-factors">
                                                ${entry.factors.map(factor => this.moodFactors[factor].name).join(', ')}
                                            </div>
                                        ` : ''}
                                        ${entry.notes ? `
                                            <div class="entry-notes">${entry.notes}</div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    showMoodAnalytics() {
        const modal = this.createModal('mood-analytics');
        
        const analytics = this.generateMoodAnalytics();
        
        modal.innerHTML = `
            <div class="mood-analytics-modal">
                <div class="modal-header">
                    <h2>Mood Analytics</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="analytics-content">
                    <div class="analytics-stats">
                        <div class="stat-card">
                            <h3>Average Mood</h3>
                            <div class="stat-value">${analytics.averageMood}</div>
                            <div class="stat-description">Last 30 days</div>
                        </div>
                        <div class="stat-card">
                            <h3>Total Entries</h3>
                            <div class="stat-value">${analytics.totalEntries}</div>
                            <div class="stat-description">Mood entries recorded</div>
                        </div>
                        <div class="stat-card">
                            <h3>Current Streak</h3>
                            <div class="stat-value">${analytics.currentStreak}</div>
                            <div class="stat-description">Days in a row</div>
                        </div>
                    </div>

                    <div class="mood-trends">
                        <h3>Mood Trends</h3>
                        <div class="trend-chart">
                            <div class="chart-placeholder">
                                <p>Mood trend chart would be displayed here</p>
                            </div>
                        </div>
                    </div>

                    <div class="mood-insights">
                        <h3>Insights</h3>
                        <div class="insights-list">
                            ${this.insights.map(insight => `
                                <div class="insight-item">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>${insight}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="factor-analysis">
                        <h3>Mood Factors Analysis</h3>
                        <div class="factors-stats">
                            ${Object.entries(analytics.factorImpact).map(([factor, data]) => `
                                <div class="factor-stat">
                                    <div class="factor-name">
                                        <i class="${this.moodFactors[factor].icon}"></i>
                                        ${this.moodFactors[factor].name}
                                    </div>
                                    <div class="factor-impact">
                                        <div class="impact-bar">
                                            <div class="impact-fill" style="width: ${data.impact}%"></div>
                                        </div>
                                        <span class="impact-text">${data.impact}% positive impact</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    generateMoodAnalytics() {
        const last30Days = this.moodHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return entryDate >= thirtyDaysAgo;
        });

        const averageMood = last30Days.length > 0 
            ? (last30Days.reduce((sum, entry) => sum + this.moodCategories[entry.mood].level, 0) / last30Days.length).toFixed(1)
            : '0';

        const currentStreak = this.calculateStreak();

        const factorImpact = this.calculateFactorImpact();

        return {
            averageMood,
            totalEntries: this.moodHistory.length,
            currentStreak,
            factorImpact
        };
    }

    calculateStreak() {
        if (this.moodHistory.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            
            const hasEntry = this.moodHistory.some(entry => {
                const entryDate = new Date(entry.timestamp);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === checkDate.getTime();
            });

            if (hasEntry) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    calculateFactorImpact() {
        const factorStats = {};
        
        Object.keys(this.moodFactors).forEach(factor => {
            factorStats[factor] = { positive: 0, total: 0 };
        });

        this.moodHistory.forEach(entry => {
            entry.factors.forEach(factor => {
                factorStats[factor].total++;
                if (this.moodCategories[entry.mood].level >= 3) {
                    factorStats[factor].positive++;
                }
            });
        });

        const factorImpact = {};
        Object.entries(factorStats).forEach(([factor, stats]) => {
            const impact = stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0;
            factorImpact[factor] = { impact };
        });

        return factorImpact;
    }

    generateInsights() {
        this.insights = [];
        
        if (this.moodHistory.length < 3) {
            this.insights.push("Keep tracking your mood to get personalized insights!");
            return;
        }

        const recentEntries = this.moodHistory.slice(-7);
        const averageMood = recentEntries.reduce((sum, entry) => sum + this.moodCategories[entry.mood].level, 0) / recentEntries.length;

        if (averageMood >= 4) {
            this.insights.push("You've been feeling great lately! Keep up the positive habits.");
        } else if (averageMood <= 2) {
            this.insights.push("Consider trying some stress-relief activities or talking to someone.");
        }

        const commonFactors = this.getMostCommonFactors();
        if (commonFactors.length > 0) {
            this.insights.push(`Your mood is often influenced by: ${commonFactors.join(', ')}`);
        }

        const moodTrend = this.calculateMoodTrend();
        if (moodTrend > 0.5) {
            this.insights.push("Your mood has been improving recently. Great job!");
        } else if (moodTrend < -0.5) {
            this.insights.push("Your mood has been declining. Consider reaching out for support.");
        }
    }

    getMostCommonFactors() {
        const factorCounts = {};
        
        this.moodHistory.forEach(entry => {
            entry.factors.forEach(factor => {
                factorCounts[factor] = (factorCounts[factor] || 0) + 1;
            });
        });

        return Object.entries(factorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([factor]) => this.moodFactors[factor].name);
    }

    calculateMoodTrend() {
        if (this.moodHistory.length < 7) return 0;

        const recent = this.moodHistory.slice(-7);
        const older = this.moodHistory.slice(-14, -7);

        if (older.length === 0) return 0;

        const recentAvg = recent.reduce((sum, entry) => sum + this.moodCategories[entry.mood].level, 0) / recent.length;
        const olderAvg = older.reduce((sum, entry) => sum + this.moodCategories[entry.mood].level, 0) / older.length;

        return recentAvg - olderAvg;
    }

    saveMoodHistory() {
        localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
    }

    loadMoodHistory() {
        this.moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `mood-modal ${className}`;
        modal.innerHTML = '<div class="modal-overlay"></div>';
        return modal;
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mood-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;
        
        notification.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-notification')) {
                notification.remove();
            }
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize mood tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
});
