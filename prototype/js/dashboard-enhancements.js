// Dashboard Enhancement Features
class DashboardEnhancements {
    constructor() {
        this.currentTestimonial = 0;
        this.testimonials = [];
        this.init();
    }

    init() {
        this.setupTipActions();
        this.setupAnimatedCounters();
        this.setupProgressAnimations();
        this.setupCardInteractions();
        this.setupTestimonialCarousel();
        this.setupLiveActivity();
        this.setupAchievementAnimations();
        this.setupFloatingActionButton();
    }

    setupTipActions() {
        const nextTipBtn = document.getElementById('nextTipBtn');
        const saveTipBtn = document.getElementById('saveTipBtn');
        
        if (nextTipBtn) {
            nextTipBtn.addEventListener('click', () => {
                this.showNextTip();
            });
        }

        if (saveTipBtn) {
            saveTipBtn.addEventListener('click', () => {
                this.saveTip();
            });
        }
    }

    setupAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0%';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    setupCardInteractions() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardHover(card);
            });
        });
    }

    showNextTip() {
        const tipText = document.getElementById('dailyTipText');
        const tips = [
            "Remember to take short breaks during study sessions. Even 5 minutes of deep breathing can help refresh your mind and improve focus.",
            "Practice gratitude by noting three things you're thankful for each day. This simple habit can significantly boost your mood.",
            "Stay hydrated! Drinking enough water throughout the day helps maintain your energy levels and cognitive function.",
            "Connect with a friend today. Social support is crucial for mental wellness, even if it's just a quick text message.",
            "Try the 5-4-3-2-1 grounding technique when feeling overwhelmed: Name 5 things you see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
            "Set small, achievable goals for today. Accomplishing them will give you a sense of progress and motivation.",
            "Practice self-compassion. Be as kind to yourself as you would be to a good friend facing the same challenges.",
            "Get some natural light. Even 10-15 minutes outdoors can help regulate your mood and sleep cycle."
        ];

        if (tipText) {
            // Fade out
            tipText.style.opacity = '0';
            tipText.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                const randomTip = tips[Math.floor(Math.random() * tips.length)];
                tipText.textContent = randomTip;
                
                // Fade in
                tipText.style.opacity = '1';
                tipText.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    saveTip() {
        const saveBtn = document.getElementById('saveTipBtn');
        if (saveBtn) {
            const originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i><span>Saved!</span>';
            saveBtn.style.background = '#00c853';
            saveBtn.style.color = 'white';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalHTML;
                saveBtn.style.background = '';
                saveBtn.style.color = '';
            }, 2000);
        }
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = element.textContent.replace(/[\d]/g, '');
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    animateCardHover(card) {
        const icon = card.querySelector('.action-icon');
        const arrow = card.querySelector('.action-arrow');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        if (arrow) {
            arrow.style.transform = 'translateX(5px) scale(1.1)';
        }
    }

    resetCardHover(card) {
        const icon = card.querySelector('.action-icon');
        const arrow = card.querySelector('.action-arrow');
        
        if (icon) {
            icon.style.transform = '';
        }
        
        if (arrow) {
            arrow.style.transform = '';
        }
    }

    setupTestimonialCarousel() {
        const indicators = document.querySelectorAll('.indicator');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (indicators.length === 0) return;

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showTestimonial(index);
            });
        });

        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            this.currentTestimonial = (this.currentTestimonial + 1) % testimonialCards.length;
            this.showTestimonial(this.currentTestimonial);
        }, 5000);
    }

    showTestimonial(index) {
        const indicators = document.querySelectorAll('.indicator');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        // Remove active class from all
        indicators.forEach(indicator => indicator.classList.remove('active'));
        testimonialCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to current
        if (indicators[index]) indicators[index].classList.add('active');
        if (testimonialCards[index]) testimonialCards[index].classList.add('active');
        
        this.currentTestimonial = index;
    }

    setupLiveActivity() {
        const activityItems = document.querySelectorAll('.activity-item');
        
        // Animate activity items on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        });

        activityItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });
    }

    setupAchievementAnimations() {
        const badgeItems = document.querySelectorAll('.badge-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        
                        // Add special animation for earned badges
                        if (entry.target.classList.contains('earned')) {
                            this.animateEarnedBadge(entry.target);
                        }
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        });

        badgeItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.9)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });
    }

    animateEarnedBadge(badge) {
        const icon = badge.querySelector('.badge-icon');
        if (icon) {
            // Add a celebration animation
            icon.style.animation = 'bounceIn 0.6s ease-out';
            
            // Create sparkle effect
            this.createSparkleEffect(badge);
        }
    }

    createSparkleEffect(element) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #ffd700;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: sparkleAnimation 1s ease-out forwards;
                `;
                
                const rect = element.getBoundingClientRect();
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }, i * 100);
        }
    }

    setupFloatingActionButton() {
        const fabMain = document.getElementById('fabMain');
        const fabOptions = document.getElementById('fabOptions');
        const fabOptionButtons = document.querySelectorAll('.fab-option');
        
        if (!fabMain || !fabOptions) return;

        fabMain.addEventListener('click', () => {
            fabMain.classList.toggle('active');
            fabOptions.classList.toggle('active');
        });

        fabOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleFloatingAction(action);
                
                // Close the menu
                fabMain.classList.remove('active');
                fabOptions.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.floating-action-menu')) {
                fabMain.classList.remove('active');
                fabOptions.classList.remove('active');
            }
        });
    }

    handleFloatingAction(action) {
        switch (action) {
            case 'mood':
                this.quickMoodCheck();
                break;
            case 'meditation':
                this.quickMeditation();
                break;
            case 'emergency':
                this.emergencySupport();
                break;
            case 'journal':
                this.quickJournal();
                break;
        }
    }

    quickMoodCheck() {
        // Scroll to mood tracker section
        const moodSection = document.querySelector('.mood-tracker-section');
        if (moodSection) {
            moodSection.scrollIntoView({ behavior: 'smooth' });
            // Highlight the section
            moodSection.style.boxShadow = '0 0 20px rgba(0, 181, 173, 0.5)';
            setTimeout(() => {
                moodSection.style.boxShadow = '';
            }, 3000);
        }
    }

    quickMeditation() {
        // Navigate to meditation section
        const meditationSection = document.querySelector('[data-section="meditation"]');
        if (meditationSection) {
            meditationSection.click();
        }
    }

    emergencySupport() {
        // Show emergency contact modal or redirect
        alert('Emergency Support: Please call your campus counseling center or use the crisis hotline. You are not alone.');
    }

    quickJournal() {
        // Create a quick journal entry prompt
        const entry = prompt('Quick Journal Entry: How are you feeling right now?');
        if (entry && entry.trim()) {
            // In a real app, this would save to the database
            console.log('Journal entry saved:', entry);
            alert('Journal entry saved! Keep up the great self-reflection.');
        }
    }

    // Add CSS for sparkle animation
    addSparkleStyles() {
        if (!document.getElementById('sparkle-styles')) {
            const style = document.createElement('style');
            style.id = 'sparkle-styles';
            style.textContent = `
                @keyframes sparkleAnimation {
                    0% {
                        opacity: 1;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1) rotate(180deg);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) rotate(360deg);
                    }
                }
                
                @keyframes bounceIn {
                    0% {
                        transform: scale(0.3);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const enhancements = new DashboardEnhancements();
    enhancements.addSparkleStyles();
});
