// Wellness Insights and Recommendations System
class WellnessInsightsSystem {
    constructor() {
        this.userData = this.loadUserData();
        this.insightsData = this.initializeInsightsData();
        this.recommendations = this.generateRecommendations();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.analyzeUserPatterns();
        this.generateInsights();
        this.updateDashboard();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('insight-card')) {
                this.showDetailedInsight(e.target.dataset.insightType);
            }
            
            if (e.target.classList.contains('recommendation-btn')) {
                this.implementRecommendation(e.target.dataset.recommendation);
            }
            
            if (e.target.classList.contains('track-goal-btn')) {
                this.trackWellnessGoal(e.target.dataset.goal);
            }
        });

        // Listen for data updates from other systems
        document.addEventListener('moodUpdated', (e) => {
            this.updateMoodInsights(e.detail);
        });

        document.addEventListener('therapyCompleted', (e) => {
            this.updateTherapyInsights(e.detail);
        });

        document.addEventListener('meditationCompleted', (e) => {
            this.updateMeditationInsights(e.detail);
        });
    }

    loadUserData() {
        return {
            moodHistory: JSON.parse(localStorage.getItem('moodHistory')) || [],
            therapyProgress: JSON.parse(localStorage.getItem('therapyProgress')) || {},
            meditationHistory: JSON.parse(localStorage.getItem('meditationHistory')) || [],
            sleepData: JSON.parse(localStorage.getItem('sleepData')) || [],
            activityData: JSON.parse(localStorage.getItem('activityData')) || [],
            goals: JSON.parse(localStorage.getItem('wellnessGoals')) || [],
            preferences: JSON.parse(localStorage.getItem('userPreferences')) || {}
        };
    }

    initializeInsightsData() {
        return {
            patterns: {
                mood: {},
                sleep: {},
                activity: {},
                therapy: {},
                meditation: {}
            },
            trends: {
                weekly: {},
                monthly: {},
                seasonal: {}
            },
            correlations: [],
            recommendations: [],
            goals: [],
            achievements: []
        };
    }

    analyzeUserPatterns() {
        this.analyzeMoodPatterns();
        this.analyzeSleepPatterns();
        this.analyzeActivityPatterns();
        this.analyzeTherapyPatterns();
        this.analyzeMeditationPatterns();
        this.findCorrelations();
    }

    analyzeMoodPatterns() {
        const moodHistory = this.userData.moodHistory;
        if (moodHistory.length === 0) return;

        const patterns = {
            averageMood: this.calculateAverageMood(moodHistory),
            moodTrend: this.calculateMoodTrend(moodHistory),
            bestDay: this.findBestMoodDay(moodHistory),
            worstDay: this.findWorstMoodDay(moodHistory),
            weeklyPattern: this.analyzeWeeklyMoodPattern(moodHistory),
            monthlyPattern: this.analyzeMonthlyMoodPattern(moodHistory),
            factors: this.analyzeMoodFactors(moodHistory)
        };

        this.insightsData.patterns.mood = patterns;
    }

    analyzeSleepPatterns() {
        const sleepData = this.userData.sleepData;
        if (sleepData.length === 0) return;

        const patterns = {
            averageSleep: this.calculateAverageSleep(sleepData),
            sleepConsistency: this.calculateSleepConsistency(sleepData),
            bestSleepDay: this.findBestSleepDay(sleepData),
            worstSleepDay: this.findWorstSleepDay(sleepData),
            weeklyPattern: this.analyzeWeeklySleepPattern(sleepData),
            correlationWithMood: this.findSleepMoodCorrelation(sleepData)
        };

        this.insightsData.patterns.sleep = patterns;
    }

    analyzeActivityPatterns() {
        const activityData = this.userData.activityData;
        if (activityData.length === 0) return;

        const patterns = {
            averageActivity: this.calculateAverageActivity(activityData),
            activityTrend: this.calculateActivityTrend(activityData),
            mostActiveDay: this.findMostActiveDay(activityData),
            leastActiveDay: this.findLeastActiveDay(activityData),
            weeklyPattern: this.analyzeWeeklyActivityPattern(activityData),
            correlationWithMood: this.findActivityMoodCorrelation(activityData)
        };

        this.insightsData.patterns.activity = patterns;
    }

    analyzeTherapyPatterns() {
        const therapyProgress = this.userData.therapyProgress;
        if (!therapyProgress || Object.keys(therapyProgress).length === 0) return;

        const patterns = {
            completionRate: this.calculateTherapyCompletionRate(therapyProgress),
            favoriteTechniques: this.findFavoriteTherapyTechniques(therapyProgress),
            progressTrend: this.calculateTherapyProgressTrend(therapyProgress),
            effectiveness: this.calculateTherapyEffectiveness(therapyProgress),
            consistency: this.calculateTherapyConsistency(therapyProgress)
        };

        this.insightsData.patterns.therapy = patterns;
    }

    analyzeMeditationPatterns() {
        const meditationHistory = this.userData.meditationHistory;
        if (meditationHistory.length === 0) return;

        const patterns = {
            averageDuration: this.calculateAverageMeditationDuration(meditationHistory),
            frequency: this.calculateMeditationFrequency(meditationHistory),
            favoriteTypes: this.findFavoriteMeditationTypes(meditationHistory),
            progressTrend: this.calculateMeditationProgressTrend(meditationHistory),
            effectiveness: this.calculateMeditationEffectiveness(meditationHistory),
            consistency: this.calculateMeditationConsistency(meditationHistory)
        };

        this.insightsData.patterns.meditation = patterns;
    }

    findCorrelations() {
        const correlations = [];

        // Mood-Sleep Correlation
        if (this.insightsData.patterns.mood && this.insightsData.patterns.sleep) {
            const moodSleepCorr = this.calculateCorrelation(
                this.insightsData.patterns.mood.averageMood,
                this.insightsData.patterns.sleep.averageSleep
            );
            if (Math.abs(moodSleepCorr) > 0.3) {
                correlations.push({
                    type: 'mood-sleep',
                    strength: Math.abs(moodSleepCorr),
                    direction: moodSleepCorr > 0 ? 'positive' : 'negative',
                    description: moodSleepCorr > 0 
                        ? 'Better sleep is associated with better mood'
                        : 'Poor sleep is associated with worse mood'
                });
            }
        }

        // Mood-Activity Correlation
        if (this.insightsData.patterns.mood && this.insightsData.patterns.activity) {
            const moodActivityCorr = this.calculateCorrelation(
                this.insightsData.patterns.mood.averageMood,
                this.insightsData.patterns.activity.averageActivity
            );
            if (Math.abs(moodActivityCorr) > 0.3) {
                correlations.push({
                    type: 'mood-activity',
                    strength: Math.abs(moodActivityCorr),
                    direction: moodActivityCorr > 0 ? 'positive' : 'negative',
                    description: moodActivityCorr > 0
                        ? 'Higher activity levels are associated with better mood'
                        : 'Lower activity levels are associated with better mood'
                });
            }
        }

        // Therapy-Mood Correlation
        if (this.insightsData.patterns.therapy && this.insightsData.patterns.mood) {
            const therapyMoodCorr = this.calculateCorrelation(
                this.insightsData.patterns.therapy.completionRate,
                this.insightsData.patterns.mood.averageMood
            );
            if (Math.abs(therapyMoodCorr) > 0.3) {
                correlations.push({
                    type: 'therapy-mood',
                    strength: Math.abs(therapyMoodCorr),
                    direction: therapyMoodCorr > 0 ? 'positive' : 'negative',
                    description: therapyMoodCorr > 0
                        ? 'Regular therapy practice is associated with better mood'
                        : 'Irregular therapy practice is associated with better mood'
                });
            }
        }

        this.insightsData.correlations = correlations;
    }

    generateRecommendations() {
        const recommendations = [];

        // Mood-based recommendations
        if (this.insightsData.patterns.mood) {
            const moodPattern = this.insightsData.patterns.mood;
            
            if (moodPattern.averageMood < 3) {
                recommendations.push({
                    id: 'mood-boost',
                    type: 'mood',
                    priority: 'high',
                    title: 'Boost Your Mood',
                    description: 'Your mood has been lower than usual. Consider trying some mood-boosting activities.',
                    actions: [
                        'Try the gratitude journal',
                        'Listen to uplifting music',
                        'Practice positive affirmations',
                        'Engage in physical activity'
                    ],
                    estimatedTime: '15-30 minutes',
                    difficulty: 'easy'
                });
            }

            if (moodPattern.moodTrend < -0.1) {
                recommendations.push({
                    id: 'mood-trend',
                    type: 'mood',
                    priority: 'medium',
                    title: 'Address Declining Mood',
                    description: 'Your mood has been trending downward. Let\'s work on stabilizing it.',
                    actions: [
                        'Practice daily mood tracking',
                        'Identify mood triggers',
                        'Use therapy techniques more regularly',
                        'Maintain consistent sleep schedule'
                    ],
                    estimatedTime: '20-40 minutes',
                    difficulty: 'medium'
                });
            }
        }

        // Sleep-based recommendations
        if (this.insightsData.patterns.sleep) {
            const sleepPattern = this.insightsData.patterns.sleep;
            
            if (sleepPattern.averageSleep < 7) {
                recommendations.push({
                    id: 'sleep-improvement',
                    type: 'sleep',
                    priority: 'high',
                    title: 'Improve Sleep Quality',
                    description: 'You\'re not getting enough sleep. Better sleep can improve your overall well-being.',
                    actions: [
                        'Establish a bedtime routine',
                        'Limit screen time before bed',
                        'Create a comfortable sleep environment',
                        'Try relaxation techniques'
                    ],
                    estimatedTime: '30-60 minutes',
                    difficulty: 'medium'
                });
            }

            if (sleepPattern.sleepConsistency < 0.7) {
                recommendations.push({
                    id: 'sleep-consistency',
                    type: 'sleep',
                    priority: 'medium',
                    title: 'Improve Sleep Consistency',
                    description: 'Your sleep schedule is inconsistent. Regular sleep times can improve sleep quality.',
                    actions: [
                        'Set consistent bedtime and wake time',
                        'Avoid naps during the day',
                        'Use sleep tracking tools',
                        'Practice good sleep hygiene'
                    ],
                    estimatedTime: '15-30 minutes',
                    difficulty: 'easy'
                });
            }
        }

        // Activity-based recommendations
        if (this.insightsData.patterns.activity) {
            const activityPattern = this.insightsData.patterns.activity;
            
            if (activityPattern.averageActivity < 30) {
                recommendations.push({
                    id: 'increase-activity',
                    type: 'activity',
                    priority: 'medium',
                    title: 'Increase Physical Activity',
                    description: 'You could benefit from more physical activity. Even small increases can make a difference.',
                    actions: [
                        'Take short walks throughout the day',
                        'Use stairs instead of elevators',
                        'Try desk exercises',
                        'Set activity goals'
                    ],
                    estimatedTime: '20-45 minutes',
                    difficulty: 'easy'
                });
            }
        }

        // Therapy-based recommendations
        if (this.insightsData.patterns.therapy) {
            const therapyPattern = this.insightsData.patterns.therapy;
            
            if (therapyPattern.completionRate < 0.5) {
                recommendations.push({
                    id: 'therapy-consistency',
                    type: 'therapy',
                    priority: 'medium',
                    title: 'Improve Therapy Consistency',
                    description: 'Regular therapy practice can help maintain mental wellness.',
                    actions: [
                        'Set therapy reminders',
                        'Try shorter, more frequent sessions',
                        'Explore different therapy techniques',
                        'Track therapy progress'
                    ],
                    estimatedTime: '10-20 minutes',
                    difficulty: 'easy'
                });
            }
        }

        // Meditation-based recommendations
        if (this.insightsData.patterns.meditation) {
            const meditationPattern = this.insightsData.patterns.meditation;
            
            if (meditationPattern.frequency < 3) {
                recommendations.push({
                    id: 'meditation-frequency',
                    type: 'meditation',
                    priority: 'low',
                    title: 'Increase Meditation Practice',
                    description: 'Regular meditation can help reduce stress and improve focus.',
                    actions: [
                        'Start with 5-minute sessions',
                        'Try different meditation types',
                        'Use guided meditation',
                        'Set meditation reminders'
                    ],
                    estimatedTime: '5-15 minutes',
                    difficulty: 'easy'
                });
            }
        }

        return recommendations;
    }

    generateInsights() {
        const insights = [];

        // Mood Insights
        if (this.insightsData.patterns.mood) {
            const moodPattern = this.insightsData.patterns.mood;
            
            insights.push({
                type: 'mood',
                title: 'Mood Analysis',
                summary: `Your average mood is ${moodPattern.averageMood.toFixed(1)}/5`,
                details: [
                    `Best mood day: ${moodPattern.bestDay}`,
                    `Worst mood day: ${moodPattern.worstDay}`,
                    `Mood trend: ${moodPattern.moodTrend > 0 ? 'Improving' : 'Declining'}`
                ],
                actionable: true,
                priority: moodPattern.averageMood < 3 ? 'high' : 'medium'
            });
        }

        // Sleep Insights
        if (this.insightsData.patterns.sleep) {
            const sleepPattern = this.insightsData.patterns.sleep;
            
            insights.push({
                type: 'sleep',
                title: 'Sleep Analysis',
                summary: `You average ${sleepPattern.averageSleep.toFixed(1)} hours of sleep per night`,
                details: [
                    `Sleep consistency: ${(sleepPattern.sleepConsistency * 100).toFixed(0)}%`,
                    `Best sleep night: ${sleepPattern.bestSleepDay}`,
                    `Worst sleep night: ${sleepPattern.worstSleepDay}`
                ],
                actionable: true,
                priority: sleepPattern.averageSleep < 7 ? 'high' : 'medium'
            });
        }

        // Correlation Insights
        if (this.insightsData.correlations.length > 0) {
            insights.push({
                type: 'correlation',
                title: 'Pattern Correlations',
                summary: `Found ${this.insightsData.correlations.length} significant correlations`,
                details: this.insightsData.correlations.map(corr => corr.description),
                actionable: true,
                priority: 'medium'
            });
        }

        this.insightsData.insights = insights;
    }

    updateDashboard() {
        this.renderInsightsOverview();
        this.renderRecommendations();
        this.renderProgressTracking();
    }

    renderInsightsOverview() {
        const insightsContainer = document.getElementById('insightsOverview');
        if (!insightsContainer) return;

        const insights = this.insightsData.insights || [];
        
        insightsContainer.innerHTML = `
            <div class="insights-grid">
                ${insights.map(insight => `
                    <div class="insight-card ${insight.priority}" data-insight-type="${insight.type}">
                        <div class="insight-header">
                            <h3>${insight.title}</h3>
                            <span class="priority-badge ${insight.priority}">${insight.priority}</span>
                        </div>
                        <div class="insight-summary">
                            <p>${insight.summary}</p>
                        </div>
                        <div class="insight-details">
                            <ul>
                                ${insight.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="insight-actions">
                            <button class="view-details-btn">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderRecommendations() {
        const recommendationsContainer = document.getElementById('recommendationsList');
        if (!recommendationsContainer) return;

        const recommendations = this.recommendations || [];
        
        recommendationsContainer.innerHTML = `
            <div class="recommendations-grid">
                ${recommendations.map(rec => `
                    <div class="recommendation-card ${rec.priority}">
                        <div class="recommendation-header">
                            <h3>${rec.title}</h3>
                            <span class="priority-badge ${rec.priority}">${rec.priority}</span>
                        </div>
                        <div class="recommendation-description">
                            <p>${rec.description}</p>
                        </div>
                        <div class="recommendation-meta">
                            <span class="time-estimate">⏱️ ${rec.estimatedTime}</span>
                            <span class="difficulty">📊 ${rec.difficulty}</span>
                        </div>
                        <div class="recommendation-actions">
                            <button class="recommendation-btn" data-recommendation="${rec.id}">
                                Start Now
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderProgressTracking() {
        const progressContainer = document.getElementById('wellnessProgress');
        if (!progressContainer) return;

        const progressData = this.calculateOverallProgress();
        
        progressContainer.innerHTML = `
            <div class="progress-overview">
                <div class="progress-circle">
                    <div class="progress-fill" style="--progress: ${progressData.overall}%"></div>
                    <div class="progress-text">
                        <span class="progress-number">${progressData.overall}%</span>
                        <span class="progress-label">Overall Wellness</span>
                    </div>
                </div>
                <div class="progress-breakdown">
                    <div class="progress-item">
                        <span class="progress-category">Mood</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="--progress: ${progressData.mood}%"></div>
                        </div>
                        <span class="progress-value">${progressData.mood}%</span>
                    </div>
                    <div class="progress-item">
                        <span class="progress-category">Sleep</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="--progress: ${progressData.sleep}%"></div>
                        </div>
                        <span class="progress-value">${progressData.sleep}%</span>
                    </div>
                    <div class="progress-item">
                        <span class="progress-category">Activity</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="--progress: ${progressData.activity}%"></div>
                        </div>
                        <span class="progress-value">${progressData.activity}%</span>
                    </div>
                    <div class="progress-item">
                        <span class="progress-category">Therapy</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="--progress: ${progressData.therapy}%"></div>
                        </div>
                        <span class="progress-value">${progressData.therapy}%</span>
                    </div>
                    <div class="progress-item">
                        <span class="progress-category">Meditation</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="--progress: ${progressData.meditation}%"></div>
                        </div>
                        <span class="progress-value">${progressData.meditation}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility Methods
    calculateAverageMood(moodHistory) {
        if (moodHistory.length === 0) return 0;
        const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
        return sum / moodHistory.length;
    }

    calculateMoodTrend(moodHistory) {
        if (moodHistory.length < 2) return 0;
        const recent = moodHistory.slice(-7);
        const older = moodHistory.slice(-14, -7);
        
        if (older.length === 0) return 0;
        
        const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
        const olderAvg = older.reduce((acc, entry) => acc + entry.mood, 0) / older.length;
        
        return recentAvg - olderAvg;
    }

    findBestMoodDay(moodHistory) {
        if (moodHistory.length === 0) return 'No data';
        const bestEntry = moodHistory.reduce((best, current) => 
            current.mood > best.mood ? current : best
        );
        return new Date(bestEntry.date).toLocaleDateString();
    }

    findWorstMoodDay(moodHistory) {
        if (moodHistory.length === 0) return 'No data';
        const worstEntry = moodHistory.reduce((worst, current) => 
            current.mood < worst.mood ? current : worst
        );
        return new Date(worstEntry.date).toLocaleDateString();
    }

    analyzeWeeklyMoodPattern(moodHistory) {
        const weeklyPattern = {};
        moodHistory.forEach(entry => {
            const dayOfWeek = new Date(entry.date).getDay();
            if (!weeklyPattern[dayOfWeek]) {
                weeklyPattern[dayOfWeek] = [];
            }
            weeklyPattern[dayOfWeek].push(entry.mood);
        });
        
        Object.keys(weeklyPattern).forEach(day => {
            const moods = weeklyPattern[day];
            weeklyPattern[day] = moods.reduce((acc, mood) => acc + mood, 0) / moods.length;
        });
        
        return weeklyPattern;
    }

    analyzeMonthlyMoodPattern(moodHistory) {
        const monthlyPattern = {};
        moodHistory.forEach(entry => {
            const month = new Date(entry.date).getMonth();
            if (!monthlyPattern[month]) {
                monthlyPattern[month] = [];
            }
            monthlyPattern[month].push(entry.mood);
        });
        
        Object.keys(monthlyPattern).forEach(month => {
            const moods = monthlyPattern[month];
            monthlyPattern[month] = moods.reduce((acc, mood) => acc + mood, 0) / moods.length;
        });
        
        return monthlyPattern;
    }

    analyzeMoodFactors(moodHistory) {
        const factors = {};
        moodHistory.forEach(entry => {
            if (entry.factors) {
                entry.factors.forEach(factor => {
                    if (!factors[factor]) {
                        factors[factor] = [];
                    }
                    factors[factor].push(entry.mood);
                });
            }
        });
        
        Object.keys(factors).forEach(factor => {
            const moods = factors[factor];
            factors[factor] = moods.reduce((acc, mood) => acc + mood, 0) / moods.length;
        });
        
        return factors;
    }

    calculateAverageSleep(sleepData) {
        if (sleepData.length === 0) return 0;
        const sum = sleepData.reduce((acc, entry) => acc + entry.duration, 0);
        return sum / sleepData.length;
    }

    calculateSleepConsistency(sleepData) {
        if (sleepData.length < 2) return 0;
        const durations = sleepData.map(entry => entry.duration);
        const mean = durations.reduce((acc, duration) => acc + duration, 0) / durations.length;
        const variance = durations.reduce((acc, duration) => acc + Math.pow(duration - mean, 2), 0) / durations.length;
        const standardDeviation = Math.sqrt(variance);
        
        return 1 - (standardDeviation / mean);
    }

    findBestSleepDay(sleepData) {
        if (sleepData.length === 0) return 'No data';
        const bestEntry = sleepData.reduce((best, current) => 
            current.duration > best.duration ? current : best
        );
        return new Date(bestEntry.date).toLocaleDateString();
    }

    findWorstSleepDay(sleepData) {
        if (sleepData.length === 0) return 'No data';
        const worstEntry = sleepData.reduce((worst, current) => 
            current.duration < worst.duration ? current : worst
        );
        return new Date(worstEntry.date).toLocaleDateString();
    }

    analyzeWeeklySleepPattern(sleepData) {
        const weeklyPattern = {};
        sleepData.forEach(entry => {
            const dayOfWeek = new Date(entry.date).getDay();
            if (!weeklyPattern[dayOfWeek]) {
                weeklyPattern[dayOfWeek] = [];
            }
            weeklyPattern[dayOfWeek].push(entry.duration);
        });
        
        Object.keys(weeklyPattern).forEach(day => {
            const durations = weeklyPattern[day];
            weeklyPattern[day] = durations.reduce((acc, duration) => acc + duration, 0) / durations.length;
        });
        
        return weeklyPattern;
    }

    findSleepMoodCorrelation(sleepData) {
        // This would require matching sleep data with mood data by date
        // For now, return a placeholder
        return 0.3;
    }

    calculateAverageActivity(activityData) {
        if (activityData.length === 0) return 0;
        const sum = activityData.reduce((acc, entry) => acc + entry.minutes, 0);
        return sum / activityData.length;
    }

    calculateActivityTrend(activityData) {
        if (activityData.length < 2) return 0;
        const recent = activityData.slice(-7);
        const older = activityData.slice(-14, -7);
        
        if (older.length === 0) return 0;
        
        const recentAvg = recent.reduce((acc, entry) => acc + entry.minutes, 0) / recent.length;
        const olderAvg = older.reduce((acc, entry) => acc + entry.minutes, 0) / older.length;
        
        return recentAvg - olderAvg;
    }

    findMostActiveDay(activityData) {
        if (activityData.length === 0) return 'No data';
        const bestEntry = activityData.reduce((best, current) => 
            current.minutes > best.minutes ? current : best
        );
        return new Date(bestEntry.date).toLocaleDateString();
    }

    findLeastActiveDay(activityData) {
        if (activityData.length === 0) return 'No data';
        const worstEntry = activityData.reduce((worst, current) => 
            current.minutes < worst.minutes ? current : worst
        );
        return new Date(worstEntry.date).toLocaleDateString();
    }

    analyzeWeeklyActivityPattern(activityData) {
        const weeklyPattern = {};
        activityData.forEach(entry => {
            const dayOfWeek = new Date(entry.date).getDay();
            if (!weeklyPattern[dayOfWeek]) {
                weeklyPattern[dayOfWeek] = [];
            }
            weeklyPattern[dayOfWeek].push(entry.minutes);
        });
        
        Object.keys(weeklyPattern).forEach(day => {
            const minutes = weeklyPattern[day];
            weeklyPattern[day] = minutes.reduce((acc, minute) => acc + minute, 0) / minutes.length;
        });
        
        return weeklyPattern;
    }

    findActivityMoodCorrelation(activityData) {
        // This would require matching activity data with mood data by date
        // For now, return a placeholder
        return 0.4;
    }

    calculateTherapyCompletionRate(therapyProgress) {
        const totalSessions = Object.values(therapyProgress).reduce((acc, sessions) => acc + sessions.length, 0);
        const completedSessions = Object.values(therapyProgress).reduce((acc, sessions) => 
            acc + sessions.filter(session => session.completed).length, 0
        );
        
        return totalSessions > 0 ? completedSessions / totalSessions : 0;
    }

    findFavoriteTherapyTechniques(therapyProgress) {
        const techniqueCounts = {};
        Object.values(therapyProgress).forEach(sessions => {
            sessions.forEach(session => {
                if (session.technique) {
                    techniqueCounts[session.technique] = (techniqueCounts[session.technique] || 0) + 1;
                }
            });
        });
        
        return Object.entries(techniqueCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([technique]) => technique);
    }

    calculateTherapyProgressTrend(therapyProgress) {
        // This would require time-series analysis of therapy progress
        // For now, return a placeholder
        return 0.1;
    }

    calculateTherapyEffectiveness(therapyProgress) {
        // This would require correlating therapy sessions with mood improvements
        // For now, return a placeholder
        return 0.7;
    }

    calculateTherapyConsistency(therapyProgress) {
        // This would require analyzing the regularity of therapy sessions
        // For now, return a placeholder
        return 0.6;
    }

    calculateAverageMeditationDuration(meditationHistory) {
        if (meditationHistory.length === 0) return 0;
        const sum = meditationHistory.reduce((acc, entry) => acc + entry.duration, 0);
        return sum / meditationHistory.length;
    }

    calculateMeditationFrequency(meditationHistory) {
        if (meditationHistory.length === 0) return 0;
        const days = new Set(meditationHistory.map(entry => 
            new Date(entry.date).toDateString()
        )).size;
        return days;
    }

    findFavoriteMeditationTypes(meditationHistory) {
        const typeCounts = {};
        meditationHistory.forEach(entry => {
            if (entry.type) {
                typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
            }
        });
        
        return Object.entries(typeCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([type]) => type);
    }

    calculateMeditationProgressTrend(meditationHistory) {
        // This would require time-series analysis of meditation progress
        // For now, return a placeholder
        return 0.05;
    }

    calculateMeditationEffectiveness(meditationHistory) {
        // This would require correlating meditation sessions with mood improvements
        // For now, return a placeholder
        return 0.8;
    }

    calculateMeditationConsistency(meditationHistory) {
        // This would require analyzing the regularity of meditation sessions
        // For now, return a placeholder
        return 0.7;
    }

    calculateCorrelation(x, y) {
        // Simple correlation calculation
        // In a real implementation, this would be more sophisticated
        return Math.random() * 0.6 - 0.3; // Placeholder
    }

    calculateOverallProgress() {
        const mood = this.insightsData.patterns.mood ? 
            (this.insightsData.patterns.mood.averageMood / 5) * 100 : 50;
        const sleep = this.insightsData.patterns.sleep ? 
            Math.min((this.insightsData.patterns.sleep.averageSleep / 8) * 100, 100) : 50;
        const activity = this.insightsData.patterns.activity ? 
            Math.min((this.insightsData.patterns.activity.averageActivity / 60) * 100, 100) : 50;
        const therapy = this.insightsData.patterns.therapy ? 
            this.insightsData.patterns.therapy.completionRate * 100 : 50;
        const meditation = this.insightsData.patterns.meditation ? 
            Math.min((this.insightsData.patterns.meditation.frequency / 7) * 100, 100) : 50;
        
        const overall = (mood + sleep + activity + therapy + meditation) / 5;
        
        return {
            overall: Math.round(overall),
            mood: Math.round(mood),
            sleep: Math.round(sleep),
            activity: Math.round(activity),
            therapy: Math.round(therapy),
            meditation: Math.round(meditation)
        };
    }

    showDetailedInsight(insightType) {
        const insight = this.insightsData.insights.find(i => i.type === insightType);
        if (!insight) return;

        const modal = this.createModal('insight-detail');
        modal.innerHTML = `
            <div class="insight-detail-modal">
                <div class="modal-header">
                    <h2>${insight.title}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="insight-content">
                    <div class="insight-summary">
                        <h3>Summary</h3>
                        <p>${insight.summary}</p>
                    </div>
                    <div class="insight-details">
                        <h3>Details</h3>
                        <ul>
                            ${insight.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="insight-actions">
                        <button class="action-btn primary">Create Goal</button>
                        <button class="action-btn secondary">Get Recommendations</button>
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

    implementRecommendation(recommendationId) {
        const recommendation = this.recommendations.find(r => r.id === recommendationId);
        if (!recommendation) return;

        this.showNotification(`Starting: ${recommendation.title}`, 'success');
        
        // In a real implementation, this would navigate to the appropriate tool
        // or start the recommended activity
    }

    trackWellnessGoal(goalId) {
        this.showNotification(`Tracking goal: ${goalId}`, 'info');
        
        // In a real implementation, this would add the goal to the user's tracking list
    }

    updateMoodInsights(moodData) {
        this.userData.moodHistory.push(moodData);
        this.analyzeMoodPatterns();
        this.generateInsights();
        this.updateDashboard();
        this.saveUserData();
    }

    updateTherapyInsights(therapyData) {
        if (!this.userData.therapyProgress[therapyData.technique]) {
            this.userData.therapyProgress[therapyData.technique] = [];
        }
        this.userData.therapyProgress[therapyData.technique].push(therapyData);
        this.analyzeTherapyPatterns();
        this.generateInsights();
        this.updateDashboard();
        this.saveUserData();
    }

    updateMeditationInsights(meditationData) {
        this.userData.meditationHistory.push(meditationData);
        this.analyzeMeditationPatterns();
        this.generateInsights();
        this.updateDashboard();
        this.saveUserData();
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `wellness-modal ${className}`;
        modal.innerHTML = '<div class="modal-overlay"></div>';
        return modal;
    }

    closeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    saveUserData() {
        localStorage.setItem('moodHistory', JSON.stringify(this.userData.moodHistory));
        localStorage.setItem('therapyProgress', JSON.stringify(this.userData.therapyProgress));
        localStorage.setItem('meditationHistory', JSON.stringify(this.userData.meditationHistory));
        localStorage.setItem('sleepData', JSON.stringify(this.userData.sleepData));
        localStorage.setItem('activityData', JSON.stringify(this.userData.activityData));
        localStorage.setItem('wellnessGoals', JSON.stringify(this.userData.goals));
        localStorage.setItem('userPreferences', JSON.stringify(this.userData.preferences));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `wellness-notification ${type}`;
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

// Initialize wellness insights system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wellnessInsightsSystem = new WellnessInsightsSystem();
});
