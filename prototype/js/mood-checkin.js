// Mood Check-in System - Optimized
class MoodCheckinManager {
    constructor() {
        this.selectedMood = null;
        this.init();
    }
    
    init() {
        this.setupMoodOptions();
    }
    
    setupMoodOptions() {
        const moodOptions = AppUtils.$$('.mood-option');
        const selectedMoodInput = AppUtils.$('#selectedMood');
        
        moodOptions.forEach(option => {
            AppUtils.on(option, 'click', () => this.selectMood(option));
        });
        
        if (selectedMoodInput) {
            new MutationObserver(() => this.validateMoodSelection())
                .observe(selectedMoodInput, { attributes: true, attributeFilter: ['value'] });
        }
    }
    
    selectMood(selectedOption) {
        AppUtils.$$('.mood-option').forEach(option => option.classList.remove('selected'));
        selectedOption.classList.add('selected');
        
        const moodValue = selectedOption.getAttribute('data-mood');
        this.selectedMood = moodValue;
        
        const selectedMoodInput = AppUtils.$('#selectedMood');
        if (selectedMoodInput) selectedMoodInput.value = moodValue;
        
        this.addSelectionFeedback(selectedOption);
    }
    
    addSelectionFeedback(selectedOption) {
        const moodIcon = selectedOption.querySelector('.mood-icon');
        if (moodIcon) {
            Object.assign(moodIcon.style, {
                transform: 'scale(1.2)',
                transition: 'transform 0.3s ease'
            });
            setTimeout(() => moodIcon.style.transform = 'scale(1)', 300);
        }
    }
    
    validateMoodSelection() {
        const selectedMoodInput = AppUtils.$('#selectedMood');
        const submitBtn = AppUtils.$('.auth-form.active .auth-btn');
        
        if (selectedMoodInput && submitBtn) {
            const hasValue = !!selectedMoodInput.value;
            submitBtn.disabled = !hasValue;
            submitBtn.style.opacity = hasValue ? '1' : '0.6';
        }
    }
    
    getSelectedMood() {
        return this.selectedMood;
    }
    
    getMoodColor(mood) {
        const config = AppUtils.getMoodConfig()[mood];
        return config?.color || '#6b7280';
    }
    
    getMoodIcon(mood) {
        const config = AppUtils.getMoodConfig()[mood];
        return config?.icon || 'fas fa-question';
    }
    
    trackMoodSelection(mood) {
        const moodData = AppUtils.get('campusMindspace_moodData', {});
        const today = new Date().toISOString().split('T')[0];
        
        if (!moodData[today]) moodData[today] = {};
        moodData[today][mood] = (moodData[today][mood] || 0) + 1;
        AppUtils.set('campusMindspace_moodData', moodData);
    }
}

// Global mood check-in manager instance
const moodCheckinManager = new MoodCheckinManager();
