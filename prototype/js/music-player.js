// Music Player System
class MusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.tracks = {
            'peaceful-piano': {
                src: 'audio/peaceful-piano.mp3',
                title: 'Peaceful Piano',
                duration: '3:45'
            },
            'ocean-waves': {
                src: 'audio/ocean-waves.mp3',
                title: 'Ocean Waves',
                duration: '5:12'
            },
            'forest-sounds': {
                src: 'audio/forest-sounds.mp3',
                title: 'Forest Sounds',
                duration: '4:28'
            }
        };
        this.init();
    }
    
    init() {
        this.setupPlayerControls();
        this.setupPlaylist();
        this.loadTrack('peaceful-piano').catch(error => {
            console.warn('Default track failed to load:', error);
            // Try to load any available track
            const availableTrack = Object.keys(this.tracks)[0];
            if (availableTrack) {
                this.loadTrack(availableTrack);
            }
        });
    }
    
    async loadTrack(trackId) {
        const track = this.tracks[trackId];
        if (!track) {
            throw new Error(`Track ${trackId} not found`);
        }
        
        try {
            // Check if audio file exists
            const response = await fetch(track.src, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`Audio file not found: ${track.src}`);
            }
            
            this.audio = new Audio(track.src);
            this.currentTrack = track;
            this.updateUI();
            return Promise.resolve();
        } catch (error) {
            console.warn(`Failed to load track ${trackId}:`, error);
            return Promise.reject(error);
        }
    }
    
    updateUI() {
        // Update UI with current track info
        const titleElement = document.querySelector('.music-title');
        const artistElement = document.querySelector('.music-artist');
        
        if (titleElement && this.currentTrack) {
            titleElement.textContent = this.currentTrack.title;
        }
        if (artistElement) {
            artistElement.textContent = 'Campus Mindspace';
        }
    }
    
    setupPlayerControls() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const progressBar = document.getElementById('progress');
        const timeDisplay = document.querySelector('.time-display');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.play();
            });
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pause();
            });
        }
        
        // Progress bar click
        const progressContainer = document.querySelector('.progress-bar');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                this.seek(e);
            });
        }
    }
    
    setupPlaylist() {
        const tracks = document.querySelectorAll('.track');
        tracks.forEach(track => {
            track.addEventListener('click', () => {
                const trackId = track.getAttribute('data-track');
                this.loadTrack(trackId);
            });
        });
    }
    
    loadTrack(trackId) {
        if (!this.tracks[trackId]) return;
        
        // Remove active class from all tracks
        const allTracks = document.querySelectorAll('.track');
        allTracks.forEach(track => track.classList.remove('active'));
        
        // Add active class to selected track
        const selectedTrack = document.querySelector(`[data-track="${trackId}"]`);
        if (selectedTrack) {
            selectedTrack.classList.add('active');
        }
        
        this.currentTrack = trackId;
        
        // In a real application, you would load the actual audio file
        // For demo purposes, we'll simulate the audio loading
        this.simulateAudioLoad();
    }
    
    simulateAudioLoad() {
        // Simulate loading time
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (playBtn && pauseBtn) {
            playBtn.disabled = true;
            playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                playBtn.disabled = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.updateTimeDisplay();
            }, 1000);
        }
    }
    
    play() {
        if (!this.currentTrack) return;
        
        this.isPlaying = true;
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (playBtn && pauseBtn) {
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        }
        
        this.startProgressSimulation();
        this.showMessage('Playing: ' + this.tracks[this.currentTrack].title, 'success');
    }
    
    pause() {
        this.isPlaying = false;
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (playBtn && pauseBtn) {
            playBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }
        
        this.stopProgressSimulation();
        this.showMessage('Paused', 'info');
    }
    
    seek(event) {
        if (!this.currentTrack) return;
        
        const progressBar = document.querySelector('.progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        // Update progress bar
        const progress = document.getElementById('progress');
        if (progress) {
            progress.style.width = (percentage * 100) + '%';
        }
        
        // Update time display (simulated)
        const track = this.tracks[this.currentTrack];
        const totalSeconds = this.timeToSeconds(track.duration);
        const seekSeconds = Math.floor(totalSeconds * percentage);
        this.updateTimeDisplay(seekSeconds);
    }
    
    startProgressSimulation() {
        this.progressInterval = setInterval(() => {
            const progress = document.getElementById('progress');
            if (progress) {
                let currentWidth = parseFloat(progress.style.width) || 0;
                if (currentWidth < 100) {
                    currentWidth += 0.5; // Simulate 0.5% per 100ms
                    progress.style.width = currentWidth + '%';
                    
                    // Update time display
                    const track = this.tracks[this.currentTrack];
                    const totalSeconds = this.timeToSeconds(track.duration);
                    const currentSeconds = Math.floor((currentWidth / 100) * totalSeconds);
                    this.updateTimeDisplay(currentSeconds);
                    
                    // Auto-pause when track ends
                    if (currentWidth >= 100) {
                        this.pause();
                    }
                }
            }
        }, 100);
    }
    
    stopProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
    
    updateTimeDisplay(currentSeconds = 0) {
        if (!this.currentTrack) return;
        
        const track = this.tracks[this.currentTrack];
        const totalSeconds = this.timeToSeconds(track.duration);
        const remainingSeconds = totalSeconds - currentSeconds;
        
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(currentSeconds) + ' / ' + track.duration;
        }
    }
    
    timeToSeconds(timeString) {
        const [minutes, seconds] = timeString.split(':').map(Number);
        return minutes * 60 + seconds;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showMessage(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `music-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    destroy() {
        this.pause();
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
    }
}

// Global music player instance
const musicPlayer = new MusicPlayer();
