// Meditation Hub JavaScript Functionality
class MeditationHubManager {
    constructor() {
        this.currentModal = null;
        this.currentSession = null;
        this.currentSound = null;
        this.meditationTimer = null;
        this.meditationInterval = null;
        this.isMeditating = false;
        this.isSoundPlaying = false;
        this.meditationProgress = 0;
        this.totalDuration = 0;
        this.currentDuration = 0;
        this.init();
    }

    init() {
        this.setupMeditationButtons();
        this.setupSoundControls();
        this.setupTimerControls();
        this.setupQuickMeditation();
        this.setupModalHandlers();
        this.loadMeditationData();
    }

    setupMeditationButtons() {
        // Guided meditation session buttons
        document.querySelectorAll('.play-btn[data-session]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const session = e.currentTarget.dataset.session;
                this.startGuidedMeditation(session);
            });
        });

        // Soundscape buttons
        document.querySelectorAll('.sound-play-btn[data-sound]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sound = e.currentTarget.dataset.sound;
                this.toggleSoundscape(sound, e.currentTarget);
            });
        });

        // Volume controls
        document.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const sound = e.target.closest('[data-sound]')?.dataset.sound;
                if (sound && this.currentSound === sound) {
                    this.updateSoundVolume(sound, e.target.value);
                }
            });
        });
    }

    setupSoundControls() {
        // Modal soundscape controls
        document.querySelectorAll('.sound-toggle[data-sound]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sound = e.currentTarget.dataset.sound;
                this.toggleModalSoundscape(sound, e.currentTarget);
            });
        });

        // Modal volume controls
        document.querySelectorAll('#ambientSoundsModal .volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const sound = e.target.closest('[data-sound]')?.dataset.sound;
                if (sound && this.currentSound === sound) {
                    this.updateSoundVolume(sound, e.target.value);
                }
            });
        });
    }

    setupTimerControls() {
        // Timer preset buttons
        document.querySelectorAll('.preset-btn[data-minutes]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.currentTarget.dataset.minutes);
                this.setTimerDuration(minutes);
                
                // Update active state
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Timer control buttons
        document.getElementById('timerStart')?.addEventListener('click', () => {
            this.startTimer();
        });

        document.getElementById('timerPause')?.addEventListener('click', () => {
            this.pauseTimer();
        });

        document.getElementById('timerStop')?.addEventListener('click', () => {
            this.stopTimer();
        });
    }

    setupQuickMeditation() {
        // Quick meditation buttons
        document.querySelectorAll('.quick-start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const duration = parseInt(e.target.closest('[data-duration]').dataset.duration);
                this.startQuickMeditation(duration);
            });
        });
    }

    setupModalHandlers() {
        // Close modal buttons
        document.querySelectorAll('.meditation-modal .modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.meditation-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }

    startGuidedMeditation(sessionType) {
        this.currentSession = sessionType;
        this.openModal('guidedMeditationModal');
        
        // Set session details
        const sessionDetails = this.getSessionDetails(sessionType);
        document.getElementById('meditationTitle').textContent = sessionDetails.title;
        
        // Initialize meditation
        this.initializeMeditation(sessionDetails);
    }

    getSessionDetails(sessionType) {
        const sessions = {
            'body-scan': {
                title: 'Body Scan Meditation',
                duration: 15,
                instructions: [
                    'Find a comfortable position',
                    'Close your eyes and breathe naturally',
                    'Focus on your toes...',
                    'Slowly move your attention up your body',
                    'Notice any sensations without judgment',
                    'Continue scanning your entire body',
                    'Take a deep breath and slowly open your eyes'
                ]
            },
            'breathing': {
                title: 'Breathing Focus',
                duration: 10,
                instructions: [
                    'Sit comfortably with your back straight',
                    'Close your eyes gently',
                    'Focus on your natural breath',
                    'Breathe in slowly...',
                    'Breathe out slowly...',
                    'Continue this rhythm',
                    'When ready, slowly open your eyes'
                ]
            },
            'mindfulness': {
                title: 'Mindfulness Meditation',
                duration: 20,
                instructions: [
                    'Sit in a comfortable position',
                    'Close your eyes and relax',
                    'Notice your thoughts without judgment',
                    'Let thoughts pass like clouds',
                    'Return your focus to your breath',
                    'Practice present moment awareness',
                    'Slowly return to your surroundings'
                ]
            }
        };
        
        return sessions[sessionType] || sessions['breathing'];
    }

    initializeMeditation(sessionDetails) {
        this.totalDuration = sessionDetails.duration * 60; // Convert to seconds
        this.currentDuration = 0;
        this.meditationProgress = 0;
        
        // Reset UI
        document.getElementById('meditationTimer').textContent = '00:00';
        document.getElementById('meditationProgressFill').style.width = '0%';
        document.getElementById('meditationProgressText').textContent = '0% Complete';
        document.getElementById('meditationInstruction').textContent = 'Click Start to Begin';
        
        // Reset buttons
        document.getElementById('meditationStart').style.display = 'inline-flex';
        document.getElementById('meditationPause').style.display = 'none';
        document.getElementById('meditationStop').style.display = 'none';
    }

    startMeditation() {
        if (this.isMeditating) return;
        
        this.isMeditating = true;
        this.currentDuration = 0;
        
        // Update UI
        document.getElementById('meditationStart').style.display = 'none';
        document.getElementById('meditationPause').style.display = 'inline-flex';
        document.getElementById('meditationStop').style.display = 'inline-flex';
        
        // Start meditation interval
        this.meditationInterval = setInterval(() => {
            this.updateMeditationProgress();
        }, 1000);
        
        // Start instruction cycle
        this.startInstructionCycle();
        
        this.showNotification('Meditation started. Find a comfortable position.', 'success');
    }

    pauseMeditation() {
        if (this.meditationInterval) {
            clearInterval(this.meditationInterval);
            this.meditationInterval = null;
        }
        
        document.getElementById('meditationStart').style.display = 'inline-flex';
        document.getElementById('meditationPause').style.display = 'none';
        
        this.showNotification('Meditation paused.', 'info');
    }

    stopMeditation() {
        this.isMeditating = false;
        
        if (this.meditationInterval) {
            clearInterval(this.meditationInterval);
            this.meditationInterval = null;
        }
        
        // Reset UI
        document.getElementById('meditationStart').style.display = 'inline-flex';
        document.getElementById('meditationPause').style.display = 'none';
        document.getElementById('meditationStop').style.display = 'none';
        document.getElementById('meditationInstruction').textContent = 'Click Start to Begin';
        
        // Save meditation session
        this.saveMeditationSession();
        
        this.showNotification('Meditation completed! Great job!', 'success');
    }

    updateMeditationProgress() {
        this.currentDuration++;
        this.meditationProgress = (this.currentDuration / this.totalDuration) * 100;
        
        // Update timer display
        const minutes = Math.floor(this.currentDuration / 60);
        const seconds = this.currentDuration % 60;
        document.getElementById('meditationTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        document.getElementById('meditationProgressFill').style.width = `${this.meditationProgress}%`;
        document.getElementById('meditationProgressText').textContent = 
            `${Math.round(this.meditationProgress)}% Complete`;
        
        // Update breathing circle
        this.updateBreathingCircle();
        
        // Check if meditation is complete
        if (this.currentDuration >= this.totalDuration) {
            this.completeMeditation();
        }
    }

    updateBreathingCircle() {
        const circle = document.getElementById('meditationCircle');
        if (!circle) return;
        
        // Create breathing rhythm (4 seconds in, 4 seconds out)
        const cyclePosition = this.currentDuration % 8;
        let scale = 1;
        
        if (cyclePosition <= 4) {
            // Inhale
            scale = 1 + (cyclePosition / 4) * 0.3;
        } else {
            // Exhale
            const exhalePosition = cyclePosition - 4;
            scale = 1.3 - (exhalePosition / 4) * 0.3;
        }
        
        circle.style.transform = `scale(${scale})`;
    }

    startInstructionCycle() {
        const sessionDetails = this.getSessionDetails(this.currentSession);
        const instructionInterval = this.totalDuration / sessionDetails.instructions.length;
        
        let instructionIndex = 0;
        
        const instructionTimer = setInterval(() => {
            if (!this.isMeditating) {
                clearInterval(instructionTimer);
                return;
            }
            
            if (instructionIndex < sessionDetails.instructions.length) {
                document.getElementById('meditationInstruction').textContent = 
                    sessionDetails.instructions[instructionIndex];
                instructionIndex++;
            }
        }, instructionInterval * 1000);
    }

    completeMeditation() {
        this.stopMeditation();
        document.getElementById('meditationInstruction').textContent = 'Meditation Complete! Well done!';
        
        // Show completion celebration
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }

    toggleSoundscape(soundType, button) {
        if (this.currentSound === soundType) {
            this.stopSoundscape();
        } else {
            this.playSoundscape(soundType, button);
        }
    }

    playSoundscape(soundType, button) {
        // Stop current sound if playing
        if (this.currentSound) {
            this.stopSoundscape();
        }
        
        this.currentSound = soundType;
        
        // Update button states
        document.querySelectorAll('.sound-play-btn, .sound-toggle').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.classList.remove('playing');
        });
        
        button.innerHTML = '<i class="fas fa-pause"></i>';
        button.classList.add('playing');
        
        // Update current sound display
        const soundNames = {
            'rain': 'Gentle Rain',
            'ocean': 'Ocean Waves',
            'forest': 'Forest Birds',
            'zen': 'Zen Garden'
        };
        
        const currentSoundElement = document.getElementById('currentSound');
        if (currentSoundElement) {
            currentSoundElement.innerHTML = `
                <h4>${soundNames[soundType]}</h4>
                <p>Now playing</p>
            `;
        }
        
        // Start sound waves animation
        this.startSoundWaves();
        
        this.isSoundPlaying = true;
        this.showNotification(`${soundNames[soundType]} is now playing`, 'success');
    }

    stopSoundscape() {
        if (!this.currentSound) return;
        
        // Update button states
        document.querySelectorAll('.sound-play-btn, .sound-toggle').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.classList.remove('playing');
        });
        
        // Stop sound waves animation
        this.stopSoundWaves();
        
        // Update current sound display
        const currentSoundElement = document.getElementById('currentSound');
        if (currentSoundElement) {
            currentSoundElement.innerHTML = `
                <h4>No Sound Playing</h4>
                <p>Select a soundscape to begin</p>
            `;
        }
        
        this.currentSound = null;
        this.isSoundPlaying = false;
        this.showNotification('Soundscape stopped', 'info');
    }

    updateSoundVolume(soundType, volume) {
        // In a real application, this would control actual audio volume
        console.log(`Volume for ${soundType}: ${volume}%`);
    }

    toggleModalSoundscape(soundType, button) {
        if (this.currentSound === soundType) {
            this.stopSoundscape();
        } else {
            this.playSoundscape(soundType, button);
        }
    }

    startSoundWaves() {
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.animationPlayState = 'running';
        });
    }

    stopSoundWaves() {
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.animationPlayState = 'paused';
        });
    }

    setTimerDuration(minutes) {
        this.totalDuration = minutes * 60;
        this.currentDuration = 0;
        this.meditationProgress = 0;
        
        // Update timer display
        document.getElementById('timerText').textContent = 
            `${minutes.toString().padStart(2, '0')}:00`;
        
        // Update progress circle
        this.updateTimerCircle();
    }

    startTimer() {
        if (this.totalDuration === 0) {
            this.showNotification('Please select a duration first', 'error');
            return;
        }
        
        this.isMeditating = true;
        this.currentDuration = 0;
        
        // Update buttons
        document.getElementById('timerStart').style.display = 'none';
        document.getElementById('timerPause').style.display = 'inline-flex';
        document.getElementById('timerStop').style.display = 'inline-flex';
        
        // Start timer interval
        this.meditationInterval = setInterval(() => {
            this.updateTimerProgress();
        }, 1000);
        
        this.showNotification('Meditation timer started', 'success');
    }

    pauseTimer() {
        if (this.meditationInterval) {
            clearInterval(this.meditationInterval);
            this.meditationInterval = null;
        }
        
        document.getElementById('timerStart').style.display = 'inline-flex';
        document.getElementById('timerPause').style.display = 'none';
        
        this.showNotification('Timer paused', 'info');
    }

    stopTimer() {
        this.isMeditating = false;
        
        if (this.meditationInterval) {
            clearInterval(this.meditationInterval);
            this.meditationInterval = null;
        }
        
        // Reset UI
        document.getElementById('timerStart').style.display = 'inline-flex';
        document.getElementById('timerPause').style.display = 'none';
        document.getElementById('timerStop').style.display = 'none';
        
        // Save meditation session
        this.saveMeditationSession();
        
        this.showNotification('Meditation timer completed!', 'success');
    }

    updateTimerProgress() {
        this.currentDuration++;
        this.meditationProgress = (this.currentDuration / this.totalDuration) * 100;
        
        const remainingTime = this.totalDuration - this.currentDuration;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        document.getElementById('timerText').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.updateTimerCircle();
        
        // Check if timer is complete
        if (this.currentDuration >= this.totalDuration) {
            this.completeTimer();
        }
    }

    updateTimerCircle() {
        const circle = document.querySelector('.timer-circle');
        if (circle) {
            const degrees = (this.meditationProgress / 100) * 360;
            circle.style.background = `conic-gradient(var(--primary-color) ${degrees}deg, var(--border-light) ${degrees}deg)`;
        }
    }

    completeTimer() {
        this.stopTimer();
        this.showNotification('Meditation timer completed! Well done!', 'success');
    }

    startQuickMeditation(duration) {
        this.totalDuration = duration * 60;
        this.currentDuration = 0;
        this.meditationProgress = 0;
        
        // Open guided meditation modal
        this.openModal('guidedMeditationModal');
        
        // Set up quick meditation
        document.getElementById('meditationTitle').textContent = `${duration}-Minute Quick Meditation`;
        
        const quickInstructions = [
            'Find a comfortable position',
            'Close your eyes and breathe naturally',
            'Focus on your breath',
            'Let go of any tension',
            'Stay present in this moment',
            'Slowly return to your surroundings'
        ];
        
        this.initializeQuickMeditation(quickInstructions);
    }

    initializeQuickMeditation(instructions) {
        // Reset UI
        document.getElementById('meditationTimer').textContent = '00:00';
        document.getElementById('meditationProgressFill').style.width = '0%';
        document.getElementById('meditationProgressText').textContent = '0% Complete';
        document.getElementById('meditationInstruction').textContent = 'Click Start to Begin';
        
        // Reset buttons
        document.getElementById('meditationStart').style.display = 'inline-flex';
        document.getElementById('meditationPause').style.display = 'none';
        document.getElementById('meditationStop').style.display = 'none';
        
        // Store instructions for this session
        this.currentSession = 'quick';
        this.sessionInstructions = instructions;
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.currentModal = modal;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.currentModal) {
            // Stop any ongoing meditation or sounds
            if (this.isMeditating) {
                this.stopMeditation();
            }
            if (this.isSoundPlaying) {
                this.stopSoundscape();
            }
            
            this.currentModal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentModal = null;
        }
    }

    saveMeditationSession() {
        const session = {
            type: this.currentSession || 'timer',
            duration: this.currentDuration,
            completedAt: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        // Save to localStorage
        const meditationHistory = JSON.parse(localStorage.getItem('meditationHistory') || '[]');
        meditationHistory.push(session);
        localStorage.setItem('meditationHistory', JSON.stringify(meditationHistory));
        
        // Update progress stats
        this.updateProgressStats();
    }

    updateProgressStats() {
        const meditationHistory = JSON.parse(localStorage.getItem('meditationHistory') || '[]');
        
        // Update session count
        const sessionCount = meditationHistory.length;
        document.getElementById('meditationSessionsCompleted').textContent = sessionCount;
        
        // Update total minutes
        const totalMinutes = meditationHistory.reduce((sum, session) => sum + Math.floor(session.duration / 60), 0);
        document.getElementById('meditationMinutesTotal').textContent = totalMinutes;
        
        // Update streak
        this.updateMeditationStreak();
    }

    updateMeditationStreak() {
        const meditationHistory = JSON.parse(localStorage.getItem('meditationHistory') || '[]');
        const today = new Date().toDateString();
        
        let streak = 0;
        let currentDate = new Date();
        
        for (let i = meditationHistory.length - 1; i >= 0; i--) {
            const sessionDate = new Date(meditationHistory[i].completedAt).toDateString();
            const expectedDate = currentDate.toDateString();
            
            if (sessionDate === expectedDate) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (sessionDate < expectedDate) {
                break;
            }
        }
        
        document.getElementById('meditationStreak').textContent = streak;
    }

    loadMeditationData() {
        this.updateProgressStats();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: var(--surface);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    padding: var(--spacing-md) var(--spacing-lg);
                    max-width: 400px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .notification-success {
                    border-left: 4px solid #00b894;
                }
                .notification-error {
                    border-left: 4px solid #e17055;
                }
                .notification-info {
                    border-left: 4px solid var(--primary-color);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-md);
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
                .notification-message {
                    color: var(--text-primary);
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Close notification
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.meditationHubManager = new MeditationHubManager();
});
