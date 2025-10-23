// MindSpace AI Assistant Chatbot
class MindSpaceChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Chatbot Button -->
            <div class="chatbot-button" id="chatbotButton">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
            </div>

            <!-- Chatbot Window -->
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                        </div>
                        <div class="chatbot-info">
                            <h3>Hi there 👋 I'm MindBot!</h3>
                            <p>Your mental wellness companion</p>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                <div class="chatbot-messages" id="chatbotMessages"></div>

                <div class="chatbot-input-area">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbotInput" 
                        placeholder="Type your message..."
                        autocomplete="off"
                    />
                    <button class="chatbot-send" id="chatbotSend">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('chatbotButton');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbotWindow');
        const button = document.getElementById('chatbotButton');
        
        if (this.isOpen) {
            window.classList.add('active');
            button.style.display = 'none';
            document.getElementById('chatbotInput').focus();
        } else {
            window.classList.remove('active');
            button.style.display = 'flex';
        }
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage(
                'bot',
                'Welcome to Campus Mindspace! I\'m here to support your mental wellness journey. How may I help you today?'
            );
            this.addQuickReplies([
                'I\'m feeling stressed',
                'Need study tips',
                'Feeling anxious',
                'Sleep problems'
            ]);
        }, 500);
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ sender, text, time });
    }

    addQuickReplies(replies) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.addEventListener('click', () => {
                this.handleQuickReply(reply);
                quickRepliesDiv.remove();
            });
            quickRepliesDiv.appendChild(button);
        });

        messagesContainer.appendChild(quickRepliesDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleQuickReply(reply) {
        this.addMessage('user', reply);
        this.generateResponse(reply);
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (message) {
            this.addMessage('user', message);
            input.value = '';
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Generate response after delay
            setTimeout(() => {
                this.hideTypingIndicator();
                this.generateResponse(message);
            }, 1000);
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = '';
        let quickReplies = [];

        // Stress-related responses
        if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
            response = 'I understand you\'re feeling stressed. Remember, it\'s okay to take breaks. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Would you like to try our guided meditation or breathing exercises?';
            quickReplies = ['Start breathing exercise', 'View meditation', 'Talk to counselor'];
        }
        // Anxiety-related responses
        else if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried')) {
            response = 'Anxiety can be challenging. Try grounding yourself with the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. I\'m here to help you through this.';
            quickReplies = ['Learn more techniques', 'Book counseling', 'Relaxation exercises'];
        }
        // Sleep-related responses
        else if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired')) {
            response = 'Good sleep is crucial for mental health. Try establishing a bedtime routine, avoiding screens 1 hour before bed, and keeping your room cool and dark. Would you like some sleep hygiene tips?';
            quickReplies = ['Sleep tips', 'Relaxation music', 'Talk to someone'];
        }
        // Study-related responses
        else if (message.includes('study') || message.includes('exam') || message.includes('focus')) {
            response = 'Effective studying is about quality, not just quantity. Try the Pomodoro Technique: 25 minutes of focused study, then a 5-minute break. Stay hydrated and take care of yourself!';
            quickReplies = ['Study resources', 'Time management', 'Stress relief'];
        }
        // Mood/feelings
        else if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
            response = 'I\'m sorry you\'re feeling this way. Your feelings are valid. Sometimes talking helps - would you like to connect with a counselor? In the meantime, try doing something small that usually brings you joy.';
            quickReplies = ['Book counseling', 'Self-care tips', 'Crisis support'];
        }
        // Positive responses
        else if (message.includes('good') || message.includes('great') || message.includes('happy') || message.includes('better')) {
            response = 'That\'s wonderful to hear! 🌟 Keep up the positive momentum. Remember to celebrate your wins, no matter how small. What\'s been helping you feel good?';
            quickReplies = ['Share gratitude', 'Mood tracker', 'Keep the streak'];
        }
        // Crisis keywords
        else if (message.includes('suicide') || message.includes('hurt myself') || message.includes('end it all')) {
            response = '🚨 I\'m concerned about you. Please reach out to a crisis counselor immediately. National Crisis Hotline: 988 (available 24/7). You matter, and help is available. Would you like me to connect you with immediate support?';
            quickReplies = ['Call crisis line', 'Emergency contacts', 'Talk to counselor now'];
        }
        // Default response
        else {
            response = 'I\'m here to support you with stress, anxiety, sleep issues, study tips, and general mental wellness. How can I help you today?';
            quickReplies = ['Mental health resources', 'Book counseling', 'Relaxation exercises', 'Study support'];
        }

        this.addMessage('bot', response);
        
        if (quickReplies.length > 0) {
            this.addQuickReplies(quickReplies);
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MindSpaceChatbot();
});
