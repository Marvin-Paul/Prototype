// Ocean Waves Video Background Manager
class VideoBackgroundManager {
    constructor() {
        this.video = document.getElementById('oceanVideo');
        this.init();
    }

    init() {
        if (!this.video) return;

        // Ensure video plays on load
        this.ensureVideoPlays();
        
        // Handle visibility changes to pause/play video
        this.handleVisibilityChange();
        
        // Handle video errors
        this.handleVideoErrors();
        
        // Optimize performance
        this.optimizePerformance();
    }

    ensureVideoPlays() {
        // Try to play the video
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Ocean waves video playing successfully');
                })
                .catch(error => {
                    console.log('Video autoplay prevented:', error);
                    // Try to play on user interaction
                    this.playOnInteraction();
                });
        }
    }

    playOnInteraction() {
        const playVideo = () => {
            this.video.play()
                .then(() => {
                    console.log('Video started after user interaction');
                    // Remove listeners after successful play
                    document.removeEventListener('click', playVideo);
                    document.removeEventListener('touchstart', playVideo);
                    document.removeEventListener('keydown', playVideo);
                })
                .catch(error => {
                    console.warn('Failed to play video:', error);
                });
        };

        // Use single event listener with event delegation for better performance
        const handleInteraction = (e) => {
            if (e.type === 'click' || e.type === 'touchstart' || e.type === 'keydown') {
                playVideo();
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('touchstart', handleInteraction);
                document.removeEventListener('keydown', handleInteraction);
            }
        };

        // Add event listeners for user interaction
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
        document.addEventListener('keydown', handleInteraction, { once: true });
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause video when tab is not visible to save resources
                this.video.pause();
            } else {
                // Resume video when tab becomes visible
                this.video.play().catch(error => {
                    console.log('Could not resume video:', error);
                });
            }
        });
    }

    handleVideoErrors() {
        this.video.addEventListener('error', (e) => {
            console.warn('Video failed to load, using fallback background:', e);
            // Hide video and show fallback background
            const videoBackground = document.querySelector('.video-background');
            if (videoBackground) {
                videoBackground.style.background = 'linear-gradient(135deg, #2d6a5f 0%, #1d4a3f 100%)';
                if (this.video) {
                    this.video.style.display = 'none';
                }
            }
        });

        // Handle video stalling
        this.video.addEventListener('stalled', () => {
            console.log('Video stalled, attempting to reload...');
            this.video.load();
        });
    }

    optimizePerformance() {
        // Reduce video quality on slower connections
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (connection && connection.effectiveType) {
                // If connection is slow (2g or slow-2g), use fallback
                if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                    console.log('Slow connection detected, using fallback background');
                    this.video.style.display = 'none';
                    const videoBackground = document.querySelector('.video-background');
                    if (videoBackground) {
                        videoBackground.style.background = 'linear-gradient(135deg, #2d6a5f 0%, #1d4a3f 100%)';
                    }
                }
            }
        }

        // Reduce motion for users who prefer it
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            this.video.style.display = 'none';
            const videoBackground = document.querySelector('.video-background');
            if (videoBackground) {
                videoBackground.style.background = 'linear-gradient(135deg, #2d6a5f 0%, #1d4a3f 100%)';
            }
        }
    }

    // Public method to pause video
    pause() {
        if (this.video) {
            this.video.pause();
        }
    }

    // Public method to play video
    play() {
        if (this.video) {
            this.video.play().catch(error => {
                console.log('Could not play video:', error);
            });
        }
    }
}

// Initialize video background manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.videoBackgroundManager = new VideoBackgroundManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoBackgroundManager;
}
