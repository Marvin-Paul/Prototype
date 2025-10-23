// Comprehensive Meditation System
class MeditationSystem {
    constructor() {
        this.currentSession = null;
        this.isPlaying = false;
        this.timer = null;
        this.remainingTime = 0;
        this.sessionData = {};
        this.userProgress = JSON.parse(localStorage.getItem('meditationProgress')) || {};
        this.ambientSounds = this.getAmbientSounds();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserProgress();
        this.initializeMeditations();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Meditation session buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('meditation-btn')) {
                const card = e.target.closest('.meditation-card');
                const meditationType = this.getMeditationType(card);
                this.startMeditationSession(meditationType);
            }

            // Meditation tools
            if (e.target.classList.contains('meditation-tool-btn')) {
                const tool = e.target.closest('.meditation-tool');
                const toolName = tool.querySelector('h4').textContent;
                this.openMeditationTool(toolName);
            }

            // Timer controls
            if (e.target.classList.contains('timer-btn')) {
                const action = e.target.dataset.action;
                this.handleTimerAction(action);
            }

            // Ambient sound controls
            if (e.target.classList.contains('ambient-sound-btn')) {
                const soundId = e.target.dataset.sound;
                this.toggleAmbientSound(soundId);
            }

            // Meditation goals
            if (e.target.id === 'addMeditationGoalBtn') {
                this.addMeditationGoal();
            }

            // Quick meditation buttons
            if (e.target.classList.contains('quick-meditation-btn')) {
                const duration = parseInt(e.target.dataset.duration);
                this.startQuickMeditation(duration);
            }

            if (e.target.classList.contains('goal-btn')) {
                const goalItem = e.target.closest('.goal-item');
                const goalId = goalItem.dataset.goalId;
                
                if (e.target.classList.contains('complete')) {
                    this.completeGoal(goalId);
                } else if (e.target.classList.contains('delete')) {
                    this.deleteGoal(goalId);
                }
            }
        });
    }

    getMeditationType(card) {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes('body scan')) return 'body_scan';
        if (title.includes('breathing')) return 'focused_breathing';
        if (title.includes('walking')) return 'walking_meditation';
        if (title.includes('loving')) return 'loving_kindness';
        return 'body_scan';
    }

    initializeMeditations() {
        this.sessionData = {
            body_scan: {
                title: 'Body Scan Meditation',
                description: 'A systematic journey through physical sensations',
                duration: 15,
                difficulty: 'Beginner',
                instructions: [
                    'Find a comfortable lying position',
                    'Close your eyes and take three deep breaths',
                    'Begin with your toes, noticing any sensations',
                    'Slowly move your attention up through your body',
                    'Spend 30-60 seconds on each body part',
                    'Notice sensations without judgment',
                    'Return to your breath when mind wanders',
                    'End with full body awareness'
                ],
                benefits: [
                    'Reduces physical tension',
                    'Improves body awareness',
                    'Promotes relaxation',
                    'Enhances mindfulness'
                ]
            },
            focused_breathing: {
                title: 'Focused Breathing',
                description: 'Simple breath awareness for stress relief',
                duration: 10,
                difficulty: 'Beginner',
                instructions: [
                    'Sit comfortably with spine straight',
                    'Close eyes or soften gaze',
                    'Notice your natural breathing rhythm',
                    'Count breaths if helpful (1-10, then repeat)',
                    'Focus on the sensation of breath',
                    'Gently return attention when distracted',
                    'Continue for the full duration',
                    'End with gratitude for practice'
                ],
                benefits: [
                    'Calms the nervous system',
                    'Improves focus and concentration',
                    'Reduces stress and anxiety',
                    'Builds mindfulness skills'
                ]
            },
            walking_meditation: {
                title: 'Walking Meditation',
                description: 'Mindful movement for active relaxation',
                duration: 20,
                difficulty: 'Intermediate',
                instructions: [
                    'Choose a quiet, safe path to walk',
                    'Stand still and feel your feet on the ground',
                    'Begin walking slowly and deliberately',
                    'Notice the lifting, moving, and placing of each foot',
                    'Feel the sensations in your legs and feet',
                    'Maintain awareness of your surroundings',
                    'If mind wanders, return to walking sensations',
                    'End by standing still and feeling gratitude'
                ],
                benefits: [
                    'Combines movement with mindfulness',
                    'Suitable for active people',
                    'Improves balance and coordination',
                    'Reduces mental restlessness'
                ]
            },
            loving_kindness: {
                title: 'Loving-Kindness Meditation',
                description: 'Cultivate compassion for yourself and others',
                duration: 12,
                difficulty: 'Intermediate',
                instructions: [
                    'Sit comfortably and close your eyes',
                    'Take three deep, calming breaths',
                    'Begin with self-compassion phrases',
                    'Extend loving-kindness to a loved one',
                    'Include a neutral person in your life',
                    'Extend compassion to a difficult person',
                    'Include all beings in your practice',
                    'Rest in open-hearted awareness'
                ],
                benefits: [
                    'Increases compassion and empathy',
                    'Improves relationships',
                    'Reduces anger and resentment',
                    'Enhances emotional well-being'
                ]
            }
        };
    }

    startMeditationSession(meditationType) {
        const meditation = this.sessionData[meditationType];
        if (!meditation) return;

        this.currentSession = { type: meditationType, ...meditation };
        this.showMeditationInterface();
    }

    showMeditationInterface() {
        const modal = this.createModal('meditation-interface');
        
        modal.innerHTML = `
            <div class="meditation-interface">
                <div class="meditation-header">
                    <h2>${this.currentSession.title}</h2>
                    <button class="close-meditation">&times;</button>
                </div>
                <div class="meditation-content">
                    <div class="meditation-info">
                        <p class="meditation-description">${this.currentSession.description}</p>
                        <div class="meditation-meta">
                            <span><i class="fas fa-clock"></i> ${this.currentSession.duration} minutes</span>
                            <span><i class="fas fa-signal"></i> ${this.currentSession.difficulty}</span>
                        </div>
                    </div>
                    
                    <div class="meditation-timer-section">
                        <div class="timer-display">
                            <div class="time-circle">
                                <svg class="timer-svg" viewBox="0 0 100 100">
                                    <circle class="timer-bg" cx="50" cy="50" r="45"/>
                                    <circle class="timer-progress" cx="50" cy="50" r="45"/>
                                </svg>
                                <div class="time-text">
                                    <span id="timeDisplay">${this.formatTime(this.currentSession.duration * 60)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="timer-controls">
                            <button class="timer-btn play-pause" data-action="toggle">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="timer-btn reset" data-action="reset">
                                <i class="fas fa-redo"></i>
                            </button>
                            <button class="timer-btn settings" data-action="settings">
                                <i class="fas fa-cog"></i>
                            </button>
                        </div>
                    </div>

                    <div class="meditation-instructions">
                        <h3>Instructions</h3>
                        <div class="instructions-list">
                            ${this.currentSession.instructions.map((instruction, index) => `
                                <div class="instruction-item">
                                    <div class="instruction-number">${index + 1}</div>
                                    <div class="instruction-text">${instruction}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="meditation-benefits">
                        <h3>Benefits</h3>
                        <div class="benefits-list">
                            ${this.currentSession.benefits.map(benefit => `
                                <div class="benefit-item">
                                    <i class="fas fa-check"></i>
                                    <span>${benefit}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="ambient-sounds">
                        <h3>Ambient Sounds</h3>
                        <div class="sounds-grid">
                            <button class="ambient-sound-btn" data-sound="rain">
                                <i class="fas fa-cloud-rain"></i>
                                <span>Rain</span>
                            </button>
                            <button class="ambient-sound-btn" data-sound="forest">
                                <i class="fas fa-tree"></i>
                                <span>Forest</span>
                            </button>
                            <button class="ambient-sound-btn" data-sound="ocean">
                                <i class="fas fa-water"></i>
                                <span>Ocean</span>
                            </button>
                            <button class="ambient-sound-btn" data-sound="birds">
                                <i class="fas fa-dove"></i>
                                <span>Birds</span>
                            </button>
                        </div>
                    </div>

                    <div class="meditation-actions">
                        <button class="complete-session-btn" style="display: none;">
                            Complete Session
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Initialize timer
        this.remainingTime = this.currentSession.duration * 60;
        this.updateTimerDisplay();
        this.setupTimerSVG();

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-meditation')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('timer-btn')) {
                const action = e.target.dataset.action;
                this.handleTimerAction(action);
            } else if (e.target.classList.contains('ambient-sound-btn')) {
                const soundId = e.target.dataset.sound;
                this.toggleAmbientSound(soundId);
            } else if (e.target.classList.contains('complete-session-btn')) {
                this.completeMeditationSession();
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    handleTimerAction(action) {
        switch(action) {
            case 'toggle':
                this.toggleTimer();
                break;
            case 'reset':
                this.resetTimer();
                break;
            case 'settings':
                this.showTimerSettings();
                break;
        }
    }

    toggleTimer() {
        const playPauseBtn = document.querySelector('.timer-btn.play-pause');
        const icon = playPauseBtn.querySelector('i');
        
        if (this.isPlaying) {
            this.pauseTimer();
            icon.className = 'fas fa-play';
            playPauseBtn.classList.remove('playing');
        } else {
            this.startTimer();
            icon.className = 'fas fa-pause';
            playPauseBtn.classList.add('playing');
        }
    }

    startTimer() {
        this.isPlaying = true;
        this.timer = setInterval(() => {
            this.remainingTime--;
            this.updateTimerDisplay();
            this.updateProgressCircle();
            
            if (this.remainingTime <= 0) {
                this.completeTimer();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.remainingTime = this.currentSession.duration * 60;
        this.updateTimerDisplay();
        this.updateProgressCircle();
        
        const playPauseBtn = document.querySelector('.timer-btn.play-pause');
        const icon = playPauseBtn.querySelector('i');
        icon.className = 'fas fa-play';
        playPauseBtn.classList.remove('playing');
    }

    completeTimer() {
        this.pauseTimer();
        this.showNotification('Meditation session completed! Great job!', 'success');
        
        const completeBtn = document.querySelector('.complete-session-btn');
        completeBtn.style.display = 'block';
        
        // Auto-complete after 5 seconds
        setTimeout(() => {
            this.completeMeditationSession();
        }, 5000);
    }

    updateTimerDisplay() {
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(this.remainingTime);
        }
    }

    updateProgressCircle() {
        const progressCircle = document.querySelector('.timer-progress');
        if (progressCircle) {
            const totalTime = this.currentSession.duration * 60;
            const progress = (totalTime - this.remainingTime) / totalTime;
            const circumference = 2 * Math.PI * 45;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (progress * circumference);
            
            progressCircle.style.strokeDasharray = strokeDasharray;
            progressCircle.style.strokeDashoffset = strokeDashoffset;
        }
    }

    setupTimerSVG() {
        const circumference = 2 * Math.PI * 45;
        const progressCircle = document.querySelector('.timer-progress');
        if (progressCircle) {
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showTimerSettings() {
        const modal = this.createModal('timer-settings');
        
        modal.innerHTML = `
            <div class="timer-settings-modal">
                <div class="modal-header">
                    <h2>Timer Settings</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="settings-content">
                    <div class="setting-group">
                        <label>Session Duration (minutes)</label>
                        <input type="number" id="sessionDuration" value="${this.currentSession.duration}" min="1" max="120">
                    </div>
                    <div class="setting-group">
                        <label>Interval Bell</label>
                        <select id="intervalBell">
                            <option value="none">None</option>
                            <option value="5">Every 5 minutes</option>
                            <option value="10">Every 10 minutes</option>
                            <option value="15">Every 15 minutes</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>End Bell</label>
                        <input type="checkbox" id="endBell" checked>
                        <span>Play bell when session ends</span>
                    </div>
                    <div class="settings-actions">
                        <button class="save-settings-btn">Save Settings</button>
                        <button class="cancel-settings-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('cancel-settings-btn')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('save-settings-btn')) {
                this.saveTimerSettings();
                this.closeModal(modal);
            }
        });

        document.body.appendChild(modal);
    }

    saveTimerSettings() {
        const duration = parseInt(document.getElementById('sessionDuration').value);
        const intervalBell = document.getElementById('intervalBell').value;
        const endBell = document.getElementById('endBell').checked;
        
        this.currentSession.duration = duration;
        this.remainingTime = duration * 60;
        this.updateTimerDisplay();
        this.updateProgressCircle();
        
        this.showNotification('Timer settings saved!', 'success');
    }

    toggleAmbientSound(soundId) {
        const btn = document.querySelector(`[data-sound="${soundId}"]`);
        
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            this.stopAmbientSound(soundId);
        } else {
            // Stop other sounds
            document.querySelectorAll('.ambient-sound-btn.active').forEach(b => {
                b.classList.remove('active');
                this.stopAmbientSound(b.dataset.sound);
            });
            
            btn.classList.add('active');
            this.playAmbientSound(soundId);
        }
    }

    playAmbientSound(soundId) {
        // In a real implementation, this would play actual audio files
        this.showNotification(`Playing ${soundId} sounds...`, 'info');
    }

    stopAmbientSound(soundId) {
        // In a real implementation, this would stop the audio
        this.showNotification(`Stopped ${soundId} sounds`, 'info');
    }

    getAmbientSounds() {
        return {
            rain: { name: 'Rain', icon: 'fas fa-cloud-rain' },
            forest: { name: 'Forest', icon: 'fas fa-tree' },
            ocean: { name: 'Ocean', icon: 'fas fa-water' },
            birds: { name: 'Birds', icon: 'fas fa-dove' }
        };
    }

    completeMeditationSession() {
        if (!this.currentSession) return;

        const sessionData = {
            type: this.currentSession.type,
            duration: this.currentSession.duration,
            completedAt: new Date().toISOString(),
            actualTime: this.currentSession.duration - (this.remainingTime / 60)
        };

        if (!this.userProgress.sessions) {
            this.userProgress.sessions = [];
        }
        
        this.userProgress.sessions.push(sessionData);
        this.saveUserProgress();
        this.updateProgressDisplay();
        
        this.showNotification('Meditation session completed! Great work!', 'success');
    }

    openMeditationTool(toolName) {
        switch(toolName) {
            case 'Meditation Timer':
                this.openMeditationTimer();
                break;
            case 'Progress Tracker':
                this.openMeditationProgress();
                break;
            case 'Guided Sessions':
                this.showGuidedSessions();
                break;
            case 'Meditation Goals':
                this.showMeditationGoals();
                break;
            case 'Ambient Sounds':
                this.showAmbientSounds();
                break;
            case 'Meditation Library':
                this.showMeditationLibrary();
                break;
            default:
                this.showNotification(`${toolName} feature coming soon!`, 'info');
        }
    }

    openMeditationTimer() {
        const modal = this.createModal('meditation-timer');
        
        modal.innerHTML = `
            <div class="meditation-timer-modal">
                <div class="modal-header">
                    <h2>Meditation Timer</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="timer-content">
                    <div class="timer-display-large">
                        <div class="time-circle-large">
                            <svg class="timer-svg-large" viewBox="0 0 200 200">
                                <circle class="timer-bg-large" cx="100" cy="100" r="90"/>
                                <circle class="timer-progress-large" cx="100" cy="100" r="90"/>
                            </svg>
                            <div class="time-text-large">
                                <span id="largeTimeDisplay">10:00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="timer-controls-large">
                        <button class="timer-btn-large play-pause-large" data-action="toggle">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="timer-btn-large reset-large" data-action="reset">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="timer-presets">
                        <h3>Quick Presets</h3>
                        <div class="preset-buttons">
                            <button class="preset-btn" data-minutes="5">5 min</button>
                            <button class="preset-btn" data-minutes="10">10 min</button>
                            <button class="preset-btn" data-minutes="15">15 min</button>
                            <button class="preset-btn" data-minutes="20">20 min</button>
                            <button class="preset-btn" data-minutes="30">30 min</button>
                            <button class="preset-btn" data-minutes="45">45 min</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            } else if (e.target.classList.contains('timer-btn-large')) {
                const action = e.target.dataset.action;
                this.handleTimerAction(action);
            } else if (e.target.classList.contains('preset-btn')) {
                const minutes = parseInt(e.target.dataset.minutes);
                this.setTimerPreset(minutes);
            }
        });

        document.body.appendChild(modal);
    }

    setTimerPreset(minutes) {
        this.currentSession = { duration: minutes };
        this.remainingTime = minutes * 60;
        this.updateTimerDisplay();
        this.showNotification(`Timer set to ${minutes} minutes`, 'info');
    }

    openMeditationProgress() {
        const modal = this.createModal('meditation-progress');
        
        const sessions = this.userProgress.sessions || [];
        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((total, session) => total + session.actualTime, 0);
        const currentStreak = this.getCurrentStreak();
        
        modal.innerHTML = `
            <div class="meditation-progress-modal">
                <div class="modal-header">
                    <h2>Your Meditation Progress</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="progress-content">
                    <div class="progress-summary">
                        <div class="progress-stat">
                            <h3>${totalSessions}</h3>
                            <p>Sessions Completed</p>
                        </div>
                        <div class="progress-stat">
                            <h3>${Math.round(totalMinutes)}</h3>
                            <p>Total Minutes</p>
                        </div>
                        <div class="progress-stat">
                            <h3>${currentStreak}</h3>
                            <p>Day Streak</p>
                        </div>
                    </div>
                    
                    <div class="recent-sessions">
                        <h3>Recent Sessions</h3>
                        <div class="sessions-list">
                            ${sessions.slice(-5).map(session => `
                                <div class="session-item">
                                    <div class="session-info">
                                        <h4>${this.sessionData[session.type]?.title || session.type}</h4>
                                        <span class="session-date">${new Date(session.completedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div class="session-duration">
                                        ${Math.round(session.actualTime)} min
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

    showMeditationGoals() {
        const modal = this.createModal('meditation-goals');
        
        modal.innerHTML = `
            <div class="meditation-goals-modal">
                <div class="modal-header">
                    <h2>Meditation Goals</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="goals-content">
                    <div class="goal-input-section">
                        <textarea id="meditationGoalInput" placeholder="Set a meditation goal... (e.g., 'Meditate for 10 minutes daily' or 'Complete 5 body scan sessions this week')"></textarea>
                        <button id="addMeditationGoalBtn" class="add-goal-btn">
                            <i class="fas fa-plus"></i> Add Goal
                        </button>
                    </div>
                    <div class="current-goals" id="currentMeditationGoals">
                        <!-- Goals will be populated here -->
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
        this.renderMeditationGoals();
    }

    addMeditationGoal() {
        const goalInput = document.getElementById('meditationGoalInput');
        const goalText = goalInput.value.trim();
        
        if (!goalText) {
            this.showNotification('Please enter a meditation goal', 'warning');
            return;
        }

        const goal = {
            id: Date.now().toString(),
            text: goalText,
            createdAt: new Date().toISOString(),
            completed: false,
            completedAt: null
        };

        if (!this.userProgress.goals) {
            this.userProgress.goals = [];
        }
        
        this.userProgress.goals.push(goal);
        this.saveUserProgress();
        goalInput.value = '';
        this.renderMeditationGoals();
        this.showNotification('Meditation goal added!', 'success');
    }

    completeGoal(goalId) {
        const goal = this.userProgress.goals?.find(g => g.id === goalId);
        if (goal) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
            this.saveUserProgress();
            this.renderMeditationGoals();
            this.showNotification('Goal completed! Great job!', 'success');
        }
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.userProgress.goals = this.userProgress.goals.filter(g => g.id !== goalId);
            this.saveUserProgress();
            this.renderMeditationGoals();
            this.showNotification('Goal deleted', 'info');
        }
    }

    renderMeditationGoals() {
        const goalsContainer = document.getElementById('currentMeditationGoals');
        if (!goalsContainer) return;

        const goals = this.userProgress.goals || [];

        if (goals.length === 0) {
            goalsContainer.innerHTML = `
                <div class="no-goals">
                    <p>No meditation goals set yet. Add your first goal above!</p>
                </div>
            `;
            return;
        }

        goalsContainer.innerHTML = goals.map(goal => `
            <div class="goal-item ${goal.completed ? 'completed' : ''}" data-goal-id="${goal.id}">
                <div class="goal-text">${goal.text}</div>
                <div class="goal-actions">
                    ${!goal.completed ? `
                        <button class="goal-btn complete">Complete</button>
                    ` : ''}
                    <button class="goal-btn delete">Delete</button>
                </div>
            </div>
        `).join('');
    }

    showGuidedSessions() {
        this.showNotification('Guided sessions feature coming soon!', 'info');
    }

    showAmbientSounds() {
        this.showNotification('Ambient sounds library coming soon!', 'info');
    }

    showMeditationLibrary() {
        this.showNotification('Meditation library coming soon!', 'info');
    }

    getCurrentStreak() {
        const sessions = this.userProgress.sessions || [];
        if (sessions.length === 0) return 0;
        
        // Simple streak calculation
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const hasRecentActivity = sessions.some(session => {
            const sessionDate = new Date(session.completedAt);
            return sessionDate.toDateString() === today.toDateString() ||
                   sessionDate.toDateString() === yesterday.toDateString();
        });
        
        return hasRecentActivity ? 1 : 0;
    }

    updateProgressDisplay() {
        const sessions = this.userProgress.sessions || [];
        const totalSessions = sessions.length;
        const totalMinutes = Math.round(sessions.reduce((total, session) => total + session.actualTime, 0));
        const currentStreak = this.getCurrentStreak();

        // Update any progress display elements if they exist
        const sessionCountEl = document.getElementById('meditationSessionsCompleted');
        const minutesEl = document.getElementById('meditationMinutesTotal');
        const streakEl = document.getElementById('meditationStreak');

        if (sessionCountEl) sessionCountEl.textContent = totalSessions;
        if (minutesEl) minutesEl.textContent = totalMinutes;
        if (streakEl) streakEl.textContent = currentStreak;
    }

    saveUserProgress() {
        localStorage.setItem('meditationProgress', JSON.stringify(this.userProgress));
    }

    loadUserProgress() {
        this.userProgress = JSON.parse(localStorage.getItem('meditationProgress')) || {};
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `meditation-modal ${className}`;
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
        notification.className = `meditation-notification ${type}`;
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

    // Quick Meditation Functions
    startQuickMeditation(duration) {
        this.currentSession = {
            type: 'quick_meditation',
            title: `${duration}-Minute Quick Meditation`,
            description: `A ${duration}-minute guided meditation for instant calm and focus`,
            duration: duration,
            difficulty: 'Beginner',
            instructions: this.getQuickMeditationInstructions(duration),
            benefits: [
                'Reduces stress and anxiety',
                'Improves focus and concentration',
                'Promotes relaxation',
                'Quick and accessible practice'
            ]
        };
        
        this.showMeditationInterface();
        this.showNotification(`Starting ${duration}-minute meditation session`, 'info');
    }

    getQuickMeditationInstructions(duration) {
        const baseInstructions = [
            'Find a comfortable seated position',
            'Close your eyes or soften your gaze',
            'Take three deep breaths to center yourself',
            'Notice your natural breathing rhythm',
            'When your mind wanders, gently return to your breath',
            'Continue for the full duration',
            'End with gratitude for taking time for yourself'
        ];

        if (duration <= 3) {
            return [
                'Find a comfortable position',
                'Take three deep breaths',
                'Focus on your breathing',
                'Notice the rhythm of your breath',
                'Gently return attention when mind wanders',
                'End with a moment of gratitude'
            ];
        } else if (duration <= 5) {
            return baseInstructions.slice(0, 6);
        } else {
            return baseInstructions;
        }
    }
}

// Initialize meditation system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.meditationSystem = new MeditationSystem();
});
