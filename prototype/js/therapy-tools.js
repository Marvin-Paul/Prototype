// Therapy Tools JavaScript Functionality
class TherapyToolsManager {
    constructor() {
        this.currentModal = null;
        this.breathingTimer = null;
        this.breathingInterval = null;
        this.isBreathing = false;
        this.breathingPhase = 'inhale'; // 'inhale', 'hold', 'exhale', 'pause'
        this.init();
    }

    init() {
        this.setupToolButtons();
        this.setupModalHandlers();
        this.setupBreathingExercise();
        this.setupMoodTracker();
        this.setupGratitudeJournal();
        this.setupThoughtRecord();
        this.loadUserData();
    }

    setupToolButtons() {
        // Thought Record
        document.getElementById('thoughtRecordBtn')?.addEventListener('click', () => {
            this.openModal('thoughtRecordModal');
        });

        // Breathing Exercise
        document.getElementById('breathingExerciseBtn')?.addEventListener('click', () => {
            this.openModal('breathingExerciseModal');
        });

        // Mood Tracker
        document.getElementById('moodTrackerBtn')?.addEventListener('click', () => {
            this.openModal('moodTrackerModal');
        });

        // Gratitude Journal
        document.getElementById('gratitudeJournalBtn')?.addEventListener('click', () => {
            this.openModal('gratitudeJournalModal');
        });

        // Other tool buttons
        document.getElementById('copingStrategiesBtn')?.addEventListener('click', () => {
            this.showCopingStrategies();
        });

        document.getElementById('crisisPlanBtn')?.addEventListener('click', () => {
            this.showCrisisPlan();
        });

        document.getElementById('shareProgressBtn')?.addEventListener('click', () => {
            this.shareProgress();
        });

        document.getElementById('scheduleSessionBtn')?.addEventListener('click', () => {
            this.scheduleSession();
        });
    }

    setupModalHandlers() {
        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.therapy-modal').forEach(modal => {
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

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.currentModal = modal;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input if available
            const firstInput = modal.querySelector('input, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 300);
            }
        }
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentModal = null;
        }
    }

    setupBreathingExercise() {
        const startBtn = document.getElementById('startBreathing');
        const pauseBtn = document.getElementById('pauseBreathing');
        const stopBtn = document.getElementById('stopBreathing');
        const inhaleSlider = document.getElementById('inhaleDuration');
        const exhaleSlider = document.getElementById('exhaleDuration');
        const inhaleValue = document.getElementById('inhaleValue');
        const exhaleValue = document.getElementById('exhaleValue');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startBreathingExercise();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseBreathingExercise();
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopBreathingExercise();
            });
        }

        // Update slider values
        if (inhaleSlider && inhaleValue) {
            inhaleSlider.addEventListener('input', () => {
                inhaleValue.textContent = inhaleSlider.value;
            });
        }

        if (exhaleSlider && exhaleValue) {
            exhaleSlider.addEventListener('input', () => {
                exhaleValue.textContent = exhaleSlider.value;
            });
        }

        // Breathing presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const duration = parseInt(btn.dataset.duration);
                this.setBreathingPreset(duration);
                
                // Update active state
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    startBreathingExercise() {
        if (this.isBreathing) return;

        this.isBreathing = true;
        this.breathingTimer = 0;
        this.breathingPhase = 'inhale';

        const startBtn = document.getElementById('startBreathing');
        const pauseBtn = document.getElementById('pauseBreathing');
        const stopBtn = document.getElementById('stopBreathing');

        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-flex';
        if (stopBtn) stopBtn.style.display = 'inline-flex';

        this.breathingInterval = setInterval(() => {
            this.updateBreathingExercise();
        }, 1000);
    }

    pauseBreathingExercise() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }

        const startBtn = document.getElementById('startBreathing');
        const pauseBtn = document.getElementById('pauseBreathing');

        if (startBtn) startBtn.style.display = 'inline-flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
    }

    stopBreathingExercise() {
        this.isBreathing = false;
        
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }

        const startBtn = document.getElementById('startBreathing');
        const pauseBtn = document.getElementById('pauseBreathing');
        const stopBtn = document.getElementById('stopBreathing');
        const instruction = document.getElementById('breathingInstruction');
        const timer = document.getElementById('breathingTimer');
        const circle = document.getElementById('breathingCircle');

        if (startBtn) startBtn.style.display = 'inline-flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'none';
        if (instruction) instruction.textContent = 'Click Start to Begin';
        if (timer) timer.textContent = '00:00';
        if (circle) circle.style.transform = 'scale(1)';

        this.breathingTimer = 0;
        this.breathingPhase = 'inhale';
    }

    updateBreathingExercise() {
        this.breathingTimer++;
        
        const inhaleDuration = parseInt(document.getElementById('inhaleDuration')?.value || 4);
        const exhaleDuration = parseInt(document.getElementById('exhaleDuration')?.value || 6);
        const totalCycle = inhaleDuration + exhaleDuration;
        
        const cyclePosition = this.breathingTimer % totalCycle;
        const instruction = document.getElementById('breathingInstruction');
        const timer = document.getElementById('breathingTimer');
        const circle = document.getElementById('breathingCircle');

        // Update timer display
        if (timer) {
            const minutes = Math.floor(this.breathingTimer / 60);
            const seconds = this.breathingTimer % 60;
            timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Determine breathing phase
        if (cyclePosition <= inhaleDuration) {
            this.breathingPhase = 'inhale';
            if (instruction) instruction.textContent = 'Breathe In';
            if (circle) {
                const scale = 1 + (cyclePosition / inhaleDuration) * 0.3;
                circle.style.transform = `scale(${scale})`;
            }
        } else {
            this.breathingPhase = 'exhale';
            if (instruction) instruction.textContent = 'Breathe Out';
            if (circle) {
                const exhalePosition = cyclePosition - inhaleDuration;
                const scale = 1.3 - (exhalePosition / exhaleDuration) * 0.3;
                circle.style.transform = `scale(${scale})`;
            }
        }
    }

    setBreathingPreset(duration) {
        // Set breathing durations based on preset
        switch (duration) {
            case 5:
                document.getElementById('inhaleDuration').value = 3;
                document.getElementById('exhaleDuration').value = 4;
                break;
            case 10:
                document.getElementById('inhaleDuration').value = 4;
                document.getElementById('exhaleDuration').value = 6;
                break;
            case 15:
                document.getElementById('inhaleDuration').value = 5;
                document.getElementById('exhaleDuration').value = 7;
                break;
        }
        
        // Update display values
        document.getElementById('inhaleValue').textContent = document.getElementById('inhaleDuration').value;
        document.getElementById('exhaleValue').textContent = document.getElementById('exhaleDuration').value;
    }

    setupMoodTracker() {
        // Mood selection
        document.querySelectorAll('#moodTrackerModal .mood-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('#moodTrackerModal .mood-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Save mood entry
        document.getElementById('saveMoodEntry')?.addEventListener('click', () => {
            this.saveMoodEntry();
        });
    }

    saveMoodEntry() {
        const selectedMood = document.querySelector('#moodTrackerModal .mood-option.selected');
        const factors = Array.from(document.querySelectorAll('#moodTrackerModal input[type="checkbox"]:checked')).map(cb => cb.value);
        const note = document.getElementById('moodNoteInput')?.value || '';

        if (!selectedMood) {
            this.showNotification('Please select your current mood', 'error');
            return;
        }

        const moodEntry = {
            mood: selectedMood.dataset.mood,
            moodText: selectedMood.querySelector('span').textContent,
            factors: factors,
            note: note,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };

        // Save to localStorage
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        moodHistory.push(moodEntry);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

        this.showNotification('Mood entry saved successfully!', 'success');
        this.closeModal();
        this.resetMoodForm();
    }

    resetMoodForm() {
        document.querySelectorAll('#moodTrackerModal .mood-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('#moodTrackerModal input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.getElementById('moodNoteInput').value = '';
    }

    setupGratitudeJournal() {
        // Add gratitude entry
        document.getElementById('addGratitudeEntry')?.addEventListener('click', () => {
            this.addGratitudeEntry();
        });

        // Remove gratitude entries
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-entry')) {
                e.target.parentElement.remove();
            }
        });

        // Save gratitude journal
        document.getElementById('saveGratitudeJournal')?.addEventListener('click', () => {
            this.saveGratitudeJournal();
        });

        // Load existing gratitude entries
        this.loadGratitudeEntries();
    }

    addGratitudeEntry() {
        const entriesContainer = document.querySelector('.gratitude-entries');
        if (entriesContainer) {
            const newEntry = document.createElement('div');
            newEntry.className = 'gratitude-entry';
            newEntry.innerHTML = `
                <input type="text" placeholder="What are you grateful for?" class="gratitude-input">
                <button class="remove-entry">&times;</button>
            `;
            entriesContainer.appendChild(newEntry);
            
            // Focus the new input
            const newInput = newEntry.querySelector('.gratitude-input');
            newInput.focus();
        }
    }

    saveGratitudeJournal() {
        const entries = Array.from(document.querySelectorAll('#gratitudeJournalModal .gratitude-input'))
            .map(input => input.value.trim())
            .filter(value => value.length > 0);

        if (entries.length === 0) {
            this.showNotification('Please write at least one gratitude entry', 'error');
            return;
        }

        const gratitudeEntry = {
            entries: entries,
            date: new Date().toISOString(),
            dayOfYear: Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
        };

        // Save to localStorage
        const gratitudeHistory = JSON.parse(localStorage.getItem('gratitudeHistory') || '[]');
        gratitudeHistory.push(gratitudeEntry);
        localStorage.setItem('gratitudeHistory', JSON.stringify(gratitudeHistory));

        // Update streak
        this.updateGratitudeStreak();

        this.showNotification('Gratitude journal saved! Keep up the positive thinking!', 'success');
        this.closeModal();
    }

    updateGratitudeStreak() {
        const gratitudeHistory = JSON.parse(localStorage.getItem('gratitudeHistory') || '[]');
        const today = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        let streak = 0;
        let currentDay = today;
        
        for (let i = gratitudeHistory.length - 1; i >= 0; i--) {
            if (gratitudeHistory[i].dayOfYear === currentDay) {
                streak++;
                currentDay--;
            } else if (gratitudeHistory[i].dayOfYear < currentDay - 1) {
                break;
            }
        }

        document.querySelector('.streak-count').textContent = streak;
        document.querySelector('.stat-number').textContent = gratitudeHistory.length;
    }

    loadGratitudeEntries() {
        // Load today's entries if they exist
        const gratitudeHistory = JSON.parse(localStorage.getItem('gratitudeHistory') || '[]');
        const today = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        const todayEntry = gratitudeHistory.find(entry => entry.dayOfYear === today);
        if (todayEntry) {
            const inputs = document.querySelectorAll('#gratitudeJournalModal .gratitude-input');
            todayEntry.entries.forEach((entry, index) => {
                if (inputs[index]) {
                    inputs[index].value = entry;
                }
            });
        }
    }

    setupThoughtRecord() {
        // Emotion rating sliders
        document.querySelectorAll('#thoughtRecordModal input[type="range"]').forEach(slider => {
            slider.addEventListener('input', () => {
                const valueSpan = slider.parentElement.querySelector('.rating-value');
                if (valueSpan) {
                    valueSpan.textContent = slider.value;
                }
            });
        });

        // Save thought record
        document.getElementById('saveThoughtRecord')?.addEventListener('click', () => {
            this.saveThoughtRecord();
        });

        // Complete thought record
        document.getElementById('completeThoughtRecord')?.addEventListener('click', () => {
            this.completeThoughtRecord();
        });
    }

    saveThoughtRecord() {
        const thoughtRecord = {
            situation: document.getElementById('situationInput')?.value || '',
            thoughts: document.getElementById('thoughtsInput')?.value || '',
            emotionsBefore: {
                anxiety: document.getElementById('anxietyRating')?.value || 5,
                sadness: document.getElementById('sadnessRating')?.value || 5,
                anger: document.getElementById('angerRating')?.value || 5
            },
            evidenceFor: document.getElementById('evidenceForInput')?.value || '',
            evidenceAgainst: document.getElementById('evidenceAgainstInput')?.value || '',
            balancedThought: document.getElementById('balancedThoughtInput')?.value || '',
            emotionsAfter: {
                anxiety: document.getElementById('anxietyRatingAfter')?.value || 5,
                sadness: document.getElementById('sadnessRatingAfter')?.value || 5,
                anger: document.getElementById('angerRatingAfter')?.value || 5
            },
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };

        // Save to localStorage
        const thoughtHistory = JSON.parse(localStorage.getItem('thoughtHistory') || '[]');
        thoughtHistory.push(thoughtRecord);
        localStorage.setItem('thoughtHistory', JSON.stringify(thoughtHistory));

        this.showNotification('Thought record saved successfully!', 'success');
    }

    completeThoughtRecord() {
        this.saveThoughtRecord();
        this.closeModal();
        this.resetThoughtRecordForm();
    }

    resetThoughtRecordForm() {
        document.getElementById('thoughtRecordModal').querySelectorAll('textarea').forEach(ta => ta.value = '');
        document.querySelectorAll('#thoughtRecordModal input[type="range"]').forEach(slider => {
            slider.value = 5;
            const valueSpan = slider.parentElement.querySelector('.rating-value');
            if (valueSpan) {
                valueSpan.textContent = '5';
            }
        });
    }

    showCopingStrategies() {
        const strategies = [
            {
                title: "Deep Breathing",
                description: "Take slow, deep breaths to calm your nervous system",
                technique: "4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8"
            },
            {
                title: "Grounding (5-4-3-2-1)",
                description: "Use your senses to ground yourself in the present moment",
                technique: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste"
            },
            {
                title: "Progressive Muscle Relaxation",
                description: "Systematically tense and relax muscle groups",
                technique: "Start with your toes and work up to your head, holding tension for 5 seconds"
            },
            {
                title: "Mindful Observation",
                description: "Focus on a single object to redirect your attention",
                technique: "Choose an object and observe its color, texture, shape for 2-3 minutes"
            }
        ];

        let strategiesHTML = '<div class="coping-strategies-modal"><h3>Coping Strategies</h3>';
        strategies.forEach((strategy, index) => {
            strategiesHTML += `
                <div class="strategy-card">
                    <h4>${strategy.title}</h4>
                    <p>${strategy.description}</p>
                    <div class="technique">
                        <strong>How to practice:</strong> ${strategy.technique}
                    </div>
                </div>
            `;
        });
        strategiesHTML += '</div>';

        this.showCustomModal('Coping Strategies', strategiesHTML);
    }

    showCrisisPlan() {
        const crisisPlan = `
            <div class="crisis-plan">
                <h3>🆘 Crisis Support Plan</h3>
                <div class="crisis-steps">
                    <div class="crisis-step">
                        <h4>Step 1: Immediate Safety</h4>
                        <p>If you're having thoughts of self-harm, please reach out immediately:</p>
                        <ul>
                            <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                            <li><strong>Emergency Services:</strong> 911</li>
                        </ul>
                    </div>
                    <div class="crisis-step">
                        <h4>Step 2: Campus Resources</h4>
                        <ul>
                            <li>Campus Counseling Center: (555) 123-4567</li>
                            <li>24/7 Crisis Hotline: (555) 987-6543</li>
                            <li>Emergency Room: Campus Medical Center</li>
                        </ul>
                    </div>
                    <div class="crisis-step">
                        <h4>Step 3: Self-Care</h4>
                        <ul>
                            <li>Remove yourself from the situation</li>
                            <li>Call a trusted friend or family member</li>
                            <li>Use breathing exercises</li>
                            <li>Go to a safe, comfortable space</li>
                        </ul>
                    </div>
                </div>
                <div class="crisis-reminder">
                    <p><strong>Remember:</strong> You are not alone. Help is available 24/7. Your feelings are valid, and reaching out for help is a sign of strength.</p>
                </div>
            </div>
        `;

        this.showCustomModal('Crisis Support Plan', crisisPlan);
    }

    shareProgress() {
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        const thoughtHistory = JSON.parse(localStorage.getItem('thoughtHistory') || '[]');
        const gratitudeHistory = JSON.parse(localStorage.getItem('gratitudeHistory') || '[]');

        const progressData = {
            moodEntries: moodHistory.length,
            thoughtRecords: thoughtHistory.length,
            gratitudeEntries: gratitudeHistory.length,
            lastMoodEntry: moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null,
            lastGratitudeEntry: gratitudeHistory.length > 0 ? gratitudeHistory[gratitudeHistory.length - 1] : null
        };

        // In a real application, this would send data to the counselor
        console.log('Progress data to share:', progressData);
        this.showNotification('Progress data prepared for sharing with your counselor', 'success');
    }

    scheduleSession() {
        // Navigate to appointments section
        const appointmentSection = document.getElementById('appointments');
        if (appointmentSection) {
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showCustomModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'therapy-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.therapy-modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    }

    loadUserData() {
        // Load and display user's therapy progress
        this.updateGratitudeStreak();
        
        // Load mood analytics if available
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        if (moodHistory.length > 0) {
            this.updateMoodAnalytics(moodHistory);
        }
    }

    updateMoodAnalytics(moodHistory) {
        // Calculate mood trends and insights
        const last7Days = moodHistory.slice(-7);
        const averageMood = last7Days.reduce((sum, entry) => sum + parseInt(entry.mood), 0) / last7Days.length;
        
        // Update UI with analytics if elements exist
        const analyticsBtn = document.getElementById('viewMoodAnalyticsBtn');
        if (analyticsBtn) {
            analyticsBtn.title = `Average mood last 7 days: ${averageMood.toFixed(1)}/5`;
        }
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
    window.therapyToolsManager = new TherapyToolsManager();
});
