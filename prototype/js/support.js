// Support Page Functionality
class SupportManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFAQToggles();
        this.setupContactForm();
        this.loadUserInfo();
    }

    setupFAQToggles() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitContactForm();
            });
        }
    }

    loadUserInfo() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (userData.fullName) {
            const nameInput = document.getElementById('contactName');
            if (nameInput) nameInput.value = userData.fullName;
        }
        
        if (userData.email) {
            const emailInput = document.getElementById('contactEmail');
            if (emailInput) emailInput.value = userData.email;
        }
    }

    submitContactForm() {
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        // In a real application, this would send to a server
        console.log('Contact Form Submitted:', { name, email, subject, message });

        // Show success message
        this.showNotification(
            'Thank you for contacting us! We\'ll respond within 24 hours.',
            'success'
        );

        // Reset form
        document.getElementById('contactForm').reset();
        this.loadUserInfo(); // Reload user info
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `support-notification support-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#00c853' : '#00b5ad'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideInSupport 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutSupport 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Scroll to section
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open chatbot
function openChatbot() {
    const chatbotButton = document.getElementById('chatbotButton');
    if (chatbotButton) {
        chatbotButton.click();
    }
}

// Add animations
const supportStyle = document.createElement('style');
supportStyle.textContent = `
    @keyframes slideInSupport {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutSupport {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(supportStyle);

// Initialize support manager
document.addEventListener('DOMContentLoaded', () => {
    new SupportManager();
});
