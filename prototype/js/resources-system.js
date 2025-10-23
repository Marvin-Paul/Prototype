// Comprehensive Resources Management System
class ResourcesSystem {
    constructor() {
        this.currentCategory = 'music';
        this.audioPlayer = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.playlist = this.getPlaylist();
        this.currentTrackIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAudioPlayer();
        this.setupCategoryNavigation();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Category navigation
            if (e.target.classList.contains('category-btn')) {
                this.switchCategory(e.target.dataset.category);
            }

            // Music player controls
            if (e.target.classList.contains('play-btn') || e.target.closest('.play-btn')) {
                this.playMusic();
            }

            if (e.target.classList.contains('pause-btn') || e.target.closest('.pause-btn')) {
                this.pauseMusic();
            }

            if (e.target.classList.contains('track')) {
                const trackElement = e.target.closest('.track');
                const trackId = trackElement.dataset.track;
                this.selectTrack(trackId);
            }

            if (e.target.classList.contains('shuffle-btn')) {
                this.toggleShuffle();
            }

            if (e.target.classList.contains('repeat-btn')) {
                this.toggleRepeat();
            }

            // Podcast and audio controls
            if (e.target.classList.contains('listen-btn') || e.target.closest('.listen-btn')) {
                this.playPodcast(e.target.closest('.podcast-item'));
            }

            if (e.target.classList.contains('play-audio-btn') || e.target.closest('.play-audio-btn')) {
                this.playGuidedAudio(e.target.closest('.audio-item'));
            }

            // Article reading
            if (e.target.classList.contains('read-article-btn') || e.target.closest('.read-article-btn')) {
                this.readArticle(e.target.closest('.article-item'));
            }

            // Tool usage
            if (e.target.classList.contains('use-tool-btn') || e.target.closest('.use-tool-btn')) {
                this.useTool(e.target.closest('.tool-item'));
            }

            // Emergency contacts
            if (e.target.classList.contains('call-btn') || e.target.closest('.call-btn')) {
                this.makeEmergencyCall(e.target.closest('.contact-item'));
            }

            if (e.target.classList.contains('text-btn') || e.target.closest('.text-btn')) {
                this.sendEmergencyText(e.target.closest('.contact-item'));
            }

            if (e.target.classList.contains('download-btn') || e.target.closest('.download-btn')) {
                this.downloadApp(e.target.closest('.app-item'));
            }
        });
    }

    setupCategoryNavigation() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
            });
        });
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Hide all categories
        document.querySelectorAll('.resource-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        // Show selected category
        const selectedCategory = document.getElementById(`${category}-category`);
        if (selectedCategory) {
            selectedCategory.classList.add('active');
        }

        this.showNotification(`Switched to ${this.getCategoryTitle(category)}`, 'info');
    }

    getCategoryTitle(category) {
        const titles = {
            music: 'Music & Audio',
            videos: 'Videos & Content',
            articles: 'Articles & Guides',
            tools: 'Study Tools',
            emergency: 'Emergency Resources'
        };
        return titles[category] || category;
    }

    getPlaylist() {
        return [
            {
                id: 'peaceful-piano',
                title: 'Peaceful Piano',
                duration: '3:45',
                file: 'audio/peaceful-piano.mp3'
            },
            {
                id: 'ocean-waves',
                title: 'Ocean Waves',
                duration: '5:20',
                file: 'audio/ocean-waves.mp3'
            },
            {
                id: 'forest-sounds',
                title: 'Forest Sounds',
                duration: '4:15',
                file: 'audio/forest-sounds.mp3'
            },
            {
                id: 'rain-sounds',
                title: 'Rain Sounds',
                duration: '6:30',
                file: 'audio/rain-sounds.mp3'
            },
            {
                id: 'meditation-bells',
                title: 'Meditation Bells',
                duration: '8:00',
                file: 'audio/meditation-bells.mp3'
            }
        ];
    }

    initializeAudioPlayer() {
        this.audioPlayer = new Audio();
        this.audioPlayer.addEventListener('ended', () => {
            this.nextTrack();
        });
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
    }

    selectTrack(trackId) {
        const track = this.playlist.find(t => t.id === trackId);
        if (!track) return;

        this.currentTrack = track;
        this.currentTrackIndex = this.playlist.findIndex(t => t.id === trackId);

        // Update UI
        document.querySelectorAll('.track').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-track="${trackId}"]`).classList.add('active');

        // Update time display
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = `0:00 / ${track.duration}`;
        }

        this.showNotification(`Selected: ${track.title}`, 'info');
    }

    playMusic() {
        if (!this.currentTrack) {
            this.currentTrack = this.playlist[0];
            this.currentTrackIndex = 0;
            this.selectTrack(this.currentTrack.id);
        }

        this.audioPlayer.src = this.currentTrack.file;
        this.audioPlayer.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.showNotification(`Now playing: ${this.currentTrack.title}`, 'success');
        }).catch(() => {
            this.showNotification('Audio file not available', 'warning');
        });
    }

    pauseMusic() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.currentTrack = this.playlist[this.currentTrackIndex];
        this.selectTrack(this.currentTrack.id);
        this.playMusic();
    }

    previousTrack() {
        this.currentTrackIndex = this.currentTrackIndex === 0 
            ? this.playlist.length - 1 
            : this.currentTrackIndex - 1;
        this.currentTrack = this.playlist[this.currentTrackIndex];
        this.selectTrack(this.currentTrack.id);
        this.playMusic();
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.isPlaying) {
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            playBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }
    }

    updateProgress() {
        if (!this.audioPlayer || !this.currentTrack) return;

        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update time display
        const currentTime = this.formatTime(this.audioPlayer.currentTime);
        const totalTime = this.currentTrack.duration;
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = `${currentTime} / ${totalTime}`;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    toggleShuffle() {
        const shuffleBtn = document.getElementById('shuffleBtn');
        shuffleBtn.classList.toggle('active');
        this.showNotification('Shuffle toggled', 'info');
    }

    toggleRepeat() {
        const repeatBtn = document.getElementById('repeatBtn');
        repeatBtn.classList.toggle('active');
        this.showNotification('Repeat toggled', 'info');
    }

    playPodcast(podcastItem) {
        const podcastTitle = podcastItem.querySelector('h4').textContent;
        this.showNotification(`Starting podcast: ${podcastTitle}`, 'success');
        // In a real implementation, this would start the podcast audio
    }

    playGuidedAudio(audioItem) {
        const audioTitle = audioItem.querySelector('h4').textContent;
        this.showNotification(`Starting guided audio: ${audioTitle}`, 'success');
        // In a real implementation, this would start the guided audio
    }

    readArticle(articleItem) {
        const articleTitle = articleItem.querySelector('h5').textContent;
        const readTime = articleItem.querySelector('.read-time').textContent;
        
        this.showArticleModal(articleTitle, readTime);
    }

    showArticleModal(title, readTime) {
        const modal = this.createModal('article-reader');
        
        modal.innerHTML = `
            <div class="article-reader-modal">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <span class="read-time">${readTime}</span>
                        <span class="article-date">Published today</span>
                    </div>
                    <div class="article-text">
                        <p>This is a comprehensive article about ${title.toLowerCase()}. In a real implementation, this would contain the full article content with proper formatting, images, and detailed information.</p>
                        
                        <h3>Key Points</h3>
                        <ul>
                            <li>Important concept 1 with detailed explanation</li>
                            <li>Practical tip 2 with examples</li>
                            <li>Actionable advice 3 with step-by-step instructions</li>
                            <li>Additional resource 4 for further learning</li>
                        </ul>
                        
                        <h3>Summary</h3>
                        <p>This article provides valuable insights and practical advice for students. The content is designed to be easily digestible and immediately applicable to your daily life and studies.</p>
                        
                        <div class="article-actions">
                            <button class="bookmark-btn">
                                <i class="fas fa-bookmark"></i> Bookmark
                            </button>
                            <button class="share-btn">
                                <i class="fas fa-share"></i> Share
                            </button>
                            <button class="print-btn">
                                <i class="fas fa-print"></i> Print
                            </button>
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

    useTool(toolItem) {
        const toolName = toolItem.querySelector('h5').textContent;
        
        switch(toolName) {
            case 'Pomodoro Timer':
                this.openPomodoroTimer();
                break;
            case 'Study Planner':
                this.openStudyPlanner();
                break;
            case 'Grade Calculator':
                this.openGradeCalculator();
                break;
            case 'Sleep Tracker':
                this.openSleepTracker();
                break;
            case 'Exercise Planner':
                this.openExercisePlanner();
                break;
            case 'Meal Planner':
                this.openMealPlanner();
                break;
            default:
                this.showNotification(`${toolName} tool opened`, 'info');
        }
    }

    openPomodoroTimer() {
        const modal = this.createModal('pomodoro-timer');
        
        modal.innerHTML = `
            <div class="pomodoro-timer-modal">
                <div class="modal-header">
                    <h2>Pomodoro Timer</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="timer-content">
                    <div class="timer-display">
                        <div class="time-circle">
                            <span id="pomodoroTime">25:00</span>
                        </div>
                    </div>
                    <div class="timer-controls">
                        <button class="timer-btn start-btn" id="startPomodoro">Start</button>
                        <button class="timer-btn pause-btn" id="pausePomodoro" style="display: none;">Pause</button>
                        <button class="timer-btn reset-btn" id="resetPomodoro">Reset</button>
                    </div>
                    <div class="pomodoro-settings">
                        <div class="setting-group">
                            <label>Work Time (minutes)</label>
                            <input type="number" id="workTime" value="25" min="1" max="60">
                        </div>
                        <div class="setting-group">
                            <label>Break Time (minutes)</label>
                            <input type="number" id="breakTime" value="5" min="1" max="30">
                        </div>
                    </div>
                    <div class="pomodoro-stats">
                        <div class="stat">
                            <span>Completed Sessions:</span>
                            <span id="completedSessions">0</span>
                        </div>
                        <div class="stat">
                            <span>Total Focus Time:</span>
                            <span id="totalFocusTime">0h 0m</span>
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

    openStudyPlanner() {
        this.showNotification('Study Planner tool opened', 'info');
        // Implementation would create a study planning interface
    }

    openGradeCalculator() {
        this.showNotification('Grade Calculator tool opened', 'info');
        // Implementation would create a GPA calculator interface
    }

    openSleepTracker() {
        this.showNotification('Sleep Tracker tool opened', 'info');
        // Implementation would create a sleep tracking interface
    }

    openExercisePlanner() {
        this.showNotification('Exercise Planner tool opened', 'info');
        // Implementation would create an exercise planning interface
    }

    openMealPlanner() {
        this.showNotification('Meal Planner tool opened', 'info');
        // Implementation would create a meal planning interface
    }

    makeEmergencyCall(contactItem) {
        const contactName = contactItem.querySelector('h5').textContent;
        const phoneNumber = contactItem.querySelector('p').textContent;
        
        if (confirm(`Call ${contactName} at ${phoneNumber}?`)) {
            // In a real implementation, this would initiate a phone call
            this.showNotification(`Calling ${contactName}...`, 'success');
        }
    }

    sendEmergencyText(contactItem) {
        const contactName = contactItem.querySelector('h5').textContent;
        const textNumber = contactItem.querySelector('p').textContent;
        
        if (confirm(`Send text to ${contactName} at ${textNumber}?`)) {
            // In a real implementation, this would initiate a text message
            this.showNotification(`Sending text to ${contactName}...`, 'success');
        }
    }

    downloadApp(appItem) {
        const appName = appItem.querySelector('h5').textContent;
        this.showNotification(`Downloading ${appName}...`, 'success');
        // In a real implementation, this would redirect to app store or download
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `resource-modal ${className}`;
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
        notification.className = `resource-notification ${type}`;
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

// Initialize resources system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resourcesSystem = new ResourcesSystem();
});
