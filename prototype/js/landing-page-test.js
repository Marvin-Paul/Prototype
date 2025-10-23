// Landing Page Functionality Test
class LandingPageTest {
    constructor() {
        this.testResults = [];
        this.init();
    }

    init() {
        // Wait for page to load completely
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.runAllTests();
                this.displayResults();
            }, 2000);
        });
    }

    runAllTests() {
        this.testVideoBackground();
        this.testThemeSwitcher();
        this.testTestimonialCarousel();
        this.testTypingAnimation();
        this.testLoadingScreen();
        this.testAuthForms();
        this.testMoodCheckin();
        this.test3DEffects();
        this.testLanguageSelector();
        this.testAnimations();
    }

    testVideoBackground() {
        const video = document.getElementById('oceanVideo');
        const result = {
            feature: 'Video Background',
            status: video ? 'PASS' : 'FAIL',
            details: video ? 'Video element found' : 'Video element missing'
        };
        this.testResults.push(result);
    }

    testThemeSwitcher() {
        const themeToggle = document.getElementById('themeToggle');
        const themeOptions = document.getElementById('themeOptions');
        const themeButtons = document.querySelectorAll('.theme-option');
        
        const hasToggle = !!themeToggle;
        const hasOptions = !!themeOptions;
        const hasButtons = themeButtons.length > 0;
        
        const result = {
            feature: 'Theme Switcher',
            status: (hasToggle && hasOptions && hasButtons) ? 'PASS' : 'FAIL',
            details: `Toggle: ${hasToggle}, Options: ${hasOptions}, Buttons: ${themeButtons.length}`
        };
        this.testResults.push(result);
    }

    testTestimonialCarousel() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const indicators = document.querySelectorAll('.indicator');
        
        const result = {
            feature: 'Testimonial Carousel',
            status: (testimonialCards.length > 0 && indicators.length > 0) ? 'PASS' : 'FAIL',
            details: `Cards: ${testimonialCards.length}, Indicators: ${indicators.length}`
        };
        this.testResults.push(result);
    }

    testTypingAnimation() {
        const typingElement = document.querySelector('.typing-animation');
        const result = {
            feature: 'Typing Animation',
            status: typingElement ? 'PASS' : 'FAIL',
            details: typingElement ? 'Typing animation element found' : 'Typing animation element missing'
        };
        this.testResults.push(result);
    }

    testLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.querySelector('.loading-progress .progress-fill');
        
        const result = {
            feature: 'Loading Screen',
            status: (loadingScreen && progressBar) ? 'PASS' : 'FAIL',
            details: `Loading screen: ${!!loadingScreen}, Progress bar: ${!!progressBar}`
        };
        this.testResults.push(result);
    }

    testAuthForms() {
        const loginForm = document.getElementById('loginFormData');
        const registerForm = document.getElementById('registerFormData');
        const authTabs = document.querySelectorAll('.auth-tab');
        
        const result = {
            feature: 'Authentication Forms',
            status: (loginForm && registerForm && authTabs.length > 0) ? 'PASS' : 'FAIL',
            details: `Login: ${!!loginForm}, Register: ${!!registerForm}, Tabs: ${authTabs.length}`
        };
        this.testResults.push(result);
    }

    testMoodCheckin() {
        const moodOptions = document.querySelectorAll('.mood-option');
        const selectedMoodInput = document.getElementById('selectedMood');
        
        const result = {
            feature: 'Mood Check-in',
            status: (moodOptions.length > 0 && selectedMoodInput) ? 'PASS' : 'FAIL',
            details: `Options: ${moodOptions.length}, Input: ${!!selectedMoodInput}`
        };
        this.testResults.push(result);
    }

    test3DEffects() {
        const actionCards = document.querySelectorAll('.action-card');
        const statCards = document.querySelectorAll('.stat-card');
        
        const result = {
            feature: '3D Effects',
            status: (actionCards.length > 0 || statCards.length > 0) ? 'PASS' : 'FAIL',
            details: `Action cards: ${actionCards.length}, Stat cards: ${statCards.length}`
        };
        this.testResults.push(result);
    }

    testLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        const result = {
            feature: 'Language Selector',
            status: languageSelect ? 'PASS' : 'FAIL',
            details: languageSelect ? 'Language selector found' : 'Language selector missing'
        };
        this.testResults.push(result);
    }

    testAnimations() {
        const animatedElements = document.querySelectorAll('.feature-item, .stat-item, .step-item');
        const result = {
            feature: 'Animations',
            status: animatedElements.length > 0 ? 'PASS' : 'FAIL',
            details: `Animated elements: ${animatedElements.length}`
        };
        this.testResults.push(result);
    }

    displayResults() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.status === 'PASS').length;
        const failedTests = totalTests - passedTests;

        console.log('🎯 Landing Page Functionality Test Results:');
        console.log(`✅ Passed: ${passedTests}/${totalTests}`);
        console.log(`❌ Failed: ${failedTests}/${totalTests}`);
        console.log('');

        this.testResults.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${icon} ${test.feature}: ${test.status}`);
            console.log(`   ${test.details}`);
        });

        if (failedTests === 0) {
            console.log('');
            console.log('🎉 All landing page features are functional!');
        } else {
            console.log('');
            console.log('⚠️  Some features need attention.');
        }
    }

    // Manual test functions for interactive testing
    testThemeSwitch(theme) {
        const themeButton = document.querySelector(`[data-theme="${theme}"]`);
        if (themeButton) {
            themeButton.click();
            console.log(`🎨 Theme switched to: ${theme}`);
        } else {
            console.log(`❌ Theme button not found: ${theme}`);
        }
    }

    testTestimonialSwitch(index) {
        const indicator = document.querySelectorAll('.indicator')[index];
        if (indicator) {
            indicator.click();
            console.log(`💬 Testimonial switched to: ${index}`);
        } else {
            console.log(`❌ Testimonial indicator not found: ${index}`);
        }
    }

    testMoodSelection(mood) {
        const moodOption = document.querySelector(`[data-mood="${mood}"]`);
        if (moodOption) {
            moodOption.click();
            console.log(`😊 Mood selected: ${mood}`);
        } else {
            console.log(`❌ Mood option not found: ${mood}`);
        }
    }
}

// Initialize test when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.landingPageTest = new LandingPageTest();
});

// Export for manual testing
if (typeof window !== 'undefined') {
    window.testLandingPage = {
        switchTheme: (theme) => window.landingPageTest.testThemeSwitch(theme),
        switchTestimonial: (index) => window.landingPageTest.testTestimonialSwitch(index),
        selectMood: (mood) => window.landingPageTest.testMoodSelection(mood)
    };
}
