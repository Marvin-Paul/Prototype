// Mood-Based Group Chat System
class MoodGroupManager {
    constructor() {
        this.currentUser = null;
        this.currentMood = null;
        this.currentGroup = null;
        this.groupMembers = [];
        this.chatMessages = [];
        this.moodCategories = this.getMoodCategories();
        this.groupChats = new Map(); // Store chat messages for each mood group
        this.userMovements = []; // Track user movements between groups
        this.groupPolls = new Map(); // Store polls for each group
        this.userAnalytics = {}; // Track user activity and analytics
        this.reportedMessages = []; // Track reported messages
        this.groupChallenges = new Map(); // Store challenges for each group
        this.mediaRecorder = null; // For voice recording
        this.audioChunks = []; // Store audio data
        this.isRecording = false; // Recording state
        this.recordingTimer = null; // Timer for recording duration
        this.recordingStartTime = null; // Start time of recording
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.loadUserMood();
        this.setupEventListeners();
        this.initializeDefaultGroups();
        this.loadGroupData();
    }

    getMoodCategories() {
        return {
            happy: {
                emoji: '😊',
                color: '#10b981',
                description: 'Happy',
                groupName: 'Happy Group',
                icon: 'fas fa-smile'
            },
            anxious: {
                emoji: '😰',
                color: '#f59e0b',
                description: 'Anxious',
                groupName: 'Anxious Group',
                icon: 'fas fa-heartbeat'
            },
            stressed: {
                emoji: '😤',
                color: '#ef4444',
                description: 'Stressed',
                groupName: 'Stressed Group',
                icon: 'fas fa-exclamation-triangle'
            },
            excited: {
                emoji: '🤩',
                color: '#8b5cf6',
                description: 'Excited',
                groupName: 'Excited Group',
                icon: 'fas fa-star'
            },
            sad: {
                emoji: '😢',
                color: '#3b82f6',
                description: 'Sad',
                groupName: 'Sad Group',
                icon: 'fas fa-frown'
            },
            motivated: {
                emoji: '💪',
                color: '#06b6d4',
                description: 'Motivated',
                groupName: 'Motivated Group',
                icon: 'fas fa-fire'
            },
            overwhelmed: {
                emoji: '😵',
                color: '#dc2626',
                description: 'Overwhelmed',
                groupName: 'Overwhelmed Group',
                icon: 'fas fa-exclamation-circle'
            },
            lonely: {
                emoji: '😔',
                color: '#6b7280',
                description: 'Lonely',
                groupName: 'Lonely Group',
                icon: 'fas fa-user'
            }
        };
    }

    loadCurrentUser() {
        const savedUser = localStorage.getItem('campusMindspace_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    loadUserMood() {
        if (!this.currentUser) return;
        
        // Check if user has a current mood set
        this.currentMood = this.currentUser.currentMood || this.currentUser.initialMood;
        
        if (this.currentMood) {
            this.assignToGroup(this.currentMood);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mood-report-btn')) {
                this.showMoodReportModal();
            }
            
            if (e.target.classList.contains('mood-option-group')) {
                this.selectMoodForGroup(e.target.dataset.mood);
            }
            
            if (e.target.classList.contains('send-message-btn')) {
                this.sendMessage();
            }
            
            if (e.target.classList.contains('update-mood-btn')) {
                this.showMoodUpdateModal();
            }
            
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('group-message-input') && e.key === 'Enter') {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            }
        });

        // Voice recording setup
        this.setupVoiceRecording();
        
        // Setup enhanced chat features
        this.setupEnhancedChatFeatures();
    }

    showMoodReportModal() {
        const modal = this.createModal('mood-report-modal');
        
        modal.innerHTML = `
            <div class="mood-report-content">
                <div class="modal-header">
                    <h2><i class="fas fa-heart"></i> How are you feeling right now?</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="mood-selection">
                    <p class="mood-prompt">Select your current mood to join a supportive group chat:</p>
                    <div class="mood-options-grid">
                        ${Object.entries(this.moodCategories).map(([key, mood]) => `
                            <button class="mood-option-group" data-mood="${key}">
                                <div class="mood-emoji-large">${mood.emoji}</div>
                                <span class="mood-label">${mood.description}</span>
                                <div class="mood-group-info">
                                    <small>Join ${mood.groupName}</small>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="mood-info">
                    <p><i class="fas fa-info-circle"></i> You'll be automatically added to a group chat with others feeling the same way. You can change your mood anytime!</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showMoodUpdateModal() {
        const modal = this.createModal('mood-update-modal');
        
        modal.innerHTML = `
            <div class="mood-update-content">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> Update Your Mood</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="current-mood-display">
                    <p>Current mood: <strong>${this.moodCategories[this.currentMood]?.description || 'Not set'}</strong></p>
                </div>
                <div class="mood-selection">
                    <p class="mood-prompt">Select your new mood:</p>
                    <div class="mood-options-grid">
                        ${Object.entries(this.moodCategories).map(([key, mood]) => `
                            <button class="mood-option-group ${key === this.currentMood ? 'current' : ''}" data-mood="${key}">
                                <div class="mood-emoji-large">${mood.emoji}</div>
                                <span class="mood-label">${mood.description}</span>
                                ${key === this.currentMood ? '<div class="current-badge">Current</div>' : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    selectMoodForGroup(moodKey) {
        if (!this.currentUser) {
            this.showNotification('Please log in first', 'error');
            return;
        }

        const previousMood = this.currentMood;
        this.currentMood = moodKey;
        
        // Update user's current mood
        this.currentUser.currentMood = moodKey;
        localStorage.setItem('campusMindspace_currentUser', JSON.stringify(this.currentUser));
        
        // Record movement if changing groups
        if (previousMood && previousMood !== moodKey) {
            this.recordUserMovement(previousMood, moodKey);
        }
        
        // Assign to new group
        this.assignToGroup(moodKey);
        
        // Show success notification
        const moodData = this.moodCategories[moodKey];
        this.showNotification(`You've joined the ${moodData.groupName}!`, 'success');
        
        // Close modal
        this.closeModal();
        
        // Update UI
        this.updateGroupDisplay();
    }

    assignToGroup(moodKey) {
        this.currentGroup = moodKey;
        
        // Load group members (simulated - in real app, this would come from server)
        this.loadGroupMembers(moodKey);
        
        // Load chat messages for this group
        this.loadGroupChat(moodKey);
        
        // Update group data in localStorage
        this.updateGroupData(moodKey);
    }

    loadGroupMembers(moodKey) {
        // Simulate group members - in real app, this would fetch from server
        const allUsers = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        const groupUsers = allUsers.filter(user => user.currentMood === moodKey || user.initialMood === moodKey);
        
        // Add current user if not already in list
        if (!groupUsers.find(user => user.id === this.currentUser?.id)) {
            groupUsers.push(this.currentUser);
        }
        
        this.groupMembers = groupUsers;
    }

    loadGroupChat(moodKey) {
        const groupChatKey = `group_chat_${moodKey}`;
        this.chatMessages = JSON.parse(localStorage.getItem(groupChatKey) || '[]');
        
        // Initialize with welcome message if empty
        if (this.chatMessages.length === 0) {
            const welcomeMessage = {
                id: Date.now().toString(),
                userId: 'system',
                userName: 'System',
                message: `Welcome to the ${this.moodCategories[moodKey].groupName}! This is a safe space to share and connect with others who understand what you're going through.`,
                timestamp: new Date().toISOString(),
                type: 'system'
            };
            this.chatMessages.push(welcomeMessage);
            this.saveGroupChat(moodKey);
        }
    }

    saveGroupChat(moodKey) {
        const groupChatKey = `group_chat_${moodKey}`;
        localStorage.setItem(groupChatKey, JSON.stringify(this.chatMessages));
    }

    updateGroupData(moodKey) {
        const groupDataKey = `group_data_${moodKey}`;
        const groupData = JSON.parse(localStorage.getItem(groupDataKey) || '{}');
        
        groupData.memberCount = this.groupMembers.length;
        groupData.lastActivity = new Date().toISOString();
        
        localStorage.setItem(groupDataKey, JSON.stringify(groupData));
    }

    recordUserMovement(fromMood, toMood) {
        const movement = {
            userId: this.currentUser.id,
            userName: this.currentUser.fullName,
            fromMood: fromMood,
            toMood: toMood,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };
        
        this.userMovements.push(movement);
        
        // Save to localStorage for admin tracking
        const movements = JSON.parse(localStorage.getItem('user_movements') || '[]');
        movements.push(movement);
        localStorage.setItem('user_movements', JSON.stringify(movements));
    }

    sendMessage() {
        const messageInput = document.querySelector('.group-message-input');
        if (!messageInput || !messageInput.value.trim()) return;
        
        const messageText = messageInput.value.trim();
        const message = {
            id: Date.now().toString(),
            userId: this.currentUser.id,
            userName: this.currentUser.fullName,
            message: messageText,
            timestamp: new Date().toISOString(),
            type: 'user'
        };
        
        this.chatMessages.push(message);
        this.saveGroupChat(this.currentGroup);
        
        // Clear input
        messageInput.value = '';
        
        // Update chat display
        this.updateChatDisplay();
        
        // Show typing indicator briefly
        this.showTypingIndicator();
    }

    updateChatDisplay() {
        const chatContainer = document.querySelector('.group-chat-messages');
        if (!chatContainer) return;
        
        chatContainer.innerHTML = this.chatMessages.map(msg => {
            if (msg.type === 'voice') {
                return this.createVoiceMessageElement(msg);
            }
            return this.createMessageElement(msg);
        }).join('');
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    createMessageElement(message) {
        const isOwnMessage = message.userId === this.currentUser?.id;
        const isSystemMessage = message.type === 'system';
        
        // Get user avatar if available
        const user = this.groupMembers.find(member => member.id === message.userId);
        const userAvatar = user?.avatar || '👤';
        
        return `
            <div class="chat-message ${isOwnMessage ? 'own-message' : ''} ${isSystemMessage ? 'system-message' : ''}">
                ${!isOwnMessage && !isSystemMessage ? `
                    <div class="message-avatar">
                        <span class="avatar-emoji">${userAvatar}</span>
                    </div>
                ` : ''}
                <div class="message-content">
                    ${!isSystemMessage ? `
                        <div class="message-header">
                            <span class="message-sender">${message.userName}</span>
                            <span class="message-time">${this.formatTime(message.timestamp)}</span>
                            ${!isOwnMessage ? `
                                <div class="message-actions">
                                    <button class="report-message-btn" onclick="window.moodGroupManager.showReportMessageModal('${message.id}')" title="Report message">
                                        <i class="fas fa-flag"></i>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    <div class="message-text">${this.escapeHtml(message.message)}</div>
                </div>
            </div>
        `;
    }

    showTypingIndicator() {
        const chatContainer = document.querySelector('.group-chat-messages');
        if (!chatContainer) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatContainer.appendChild(indicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 2000);
    }

    updateGroupDisplay() {
        // Update group info display
        const groupInfoEl = document.querySelector('.current-group-info');
        if (groupInfoEl && this.currentMood) {
            const moodData = this.moodCategories[this.currentMood];
            groupInfoEl.innerHTML = `
                <div class="group-header">
                    <div class="group-mood">
                        <span class="mood-emoji">${moodData.emoji}</span>
                        <div class="group-details">
                            <h3>${moodData.groupName}</h3>
                            <p>${this.groupMembers.length} member${this.groupMembers.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button class="update-mood-btn">
                        <i class="fas fa-edit"></i>
                        Change Mood
                    </button>
                </div>
            `;
        }
        
        // Update member list
        this.updateMemberList();
        
        // Update chat display
        this.updateChatDisplay();
    }

    updateMemberList() {
        const memberListEl = document.querySelector('.group-members-list');
        if (!memberListEl) return;
        
        memberListEl.innerHTML = this.groupMembers.map(member => `
            <div class="group-member ${member.id === this.currentUser?.id ? 'current-user' : ''}">
                <div class="member-avatar">
                    <span class="avatar-emoji">${member.avatar || '👤'}</span>
                </div>
                <div class="member-info">
                    <span class="member-name">${member.fullName}</span>
                    ${member.id === this.currentUser?.id ? '<span class="you-badge">You</span>' : ''}
                </div>
            </div>
        `).join('');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    createModal(className) {
        const modal = document.createElement('div');
        modal.className = `group-modal ${className}`;
        modal.innerHTML = '<div class="modal-overlay"></div>';
        return modal;
    }

    closeModal() {
        const modal = document.querySelector('.group-modal');
        if (modal) {
            modal.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `group-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

    // Public methods for external access
    getCurrentMood() {
        return this.currentMood;
    }

    getCurrentGroup() {
        return this.currentGroup;
    }

    getGroupMembers() {
        return this.groupMembers;
    }

    getChatMessages() {
        return this.chatMessages;
    }

    getUserMovements() {
        return this.userMovements;
    }

    // Crisis Support Methods
    showCrisisModal(type = 'phone') {
        const crisisInfo = {
            phone: {
                title: 'Crisis Hotline: 988',
                description: 'Call 988 for immediate crisis support. Available 24/7.',
                action: 'Call 988',
                number: '988',
                icon: 'fas fa-phone-alt'
            },
            text: {
                title: 'Crisis Text Line: 741741',
                description: 'Text HOME to 741741 for crisis support via text.',
                action: 'Text HOME to 741741',
                number: '741741',
                icon: 'fas fa-comment'
            },
            '911': {
                title: 'Emergency Services: 911',
                description: 'Call 911 for immediate emergency assistance.',
                action: 'Call 911',
                number: '911',
                icon: 'fas fa-exclamation-triangle'
            }
        };

        const info = crisisInfo[type];
        const modal = this.createModal('crisis-modal');
        
        modal.innerHTML = `
            <div class="crisis-modal-content">
                <div class="modal-header">
                    <h2><i class="${info.icon}"></i> ${info.title}</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="crisis-modal-body">
                    <div class="crisis-info">
                        <p>${info.description}</p>
                        <div class="crisis-resources">
                            <div class="resource-item">
                                <i class="fas fa-clock"></i>
                                <span>Available 24/7</span>
                            </div>
                            <div class="resource-item">
                                <i class="fas fa-lock"></i>
                                <span>Confidential</span>
                            </div>
                            <div class="resource-item">
                                <i class="fas fa-heart"></i>
                                <span>Free Support</span>
                            </div>
                        </div>
                    </div>
                    <div class="crisis-actions">
                        <button class="crisis-action-btn primary" onclick="window.open('tel:${info.number}', '_self')">
                            <i class="${info.icon}"></i>
                            ${info.action}
                        </button>
                        <button class="crisis-action-btn secondary" onclick="window.moodGroupManager.closeModal()">
                            <i class="fas fa-times"></i>
                            Close
                        </button>
                    </div>
                    <div class="additional-resources">
                        <h4>Additional Resources:</h4>
                        <ul>
                            <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                            <li><strong>Emergency:</strong> 911</li>
                            <li><strong>Online Chat:</strong> suicidepreventionlifeline.org</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    // Message Reporting System
    reportMessage(messageId, reason) {
        const message = this.chatMessages.find(msg => msg.id === messageId);
        if (!message) return;

        const report = {
            id: Date.now().toString(),
            messageId: messageId,
            reportedBy: this.currentUser.id,
            reportedBy: this.currentUser.fullName,
            reason: reason,
            timestamp: new Date().toISOString(),
            messageContent: message.message,
            messageAuthor: message.userName
        };

        this.reportedMessages.push(report);
        localStorage.setItem('reported_messages', JSON.stringify(this.reportedMessages));

        this.showNotification('Message reported successfully. Our moderators will review it.', 'success');
    }

    showReportMessageModal(messageId) {
        const modal = this.createModal('report-message-modal');
        
        modal.innerHTML = `
            <div class="report-message-content">
                <div class="modal-header">
                    <h2><i class="fas fa-flag"></i> Report Message</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="report-modal-body">
                    <p>Please select a reason for reporting this message:</p>
                    <div class="report-reasons">
                        <label class="report-reason">
                            <input type="radio" name="reportReason" value="inappropriate">
                            <span>Inappropriate content</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="reportReason" value="harassment">
                            <span>Harassment or bullying</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="reportReason" value="spam">
                            <span>Spam or irrelevant content</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="reportReason" value="harmful">
                            <span>Harmful or dangerous content</span>
                        </label>
                        <label class="report-reason">
                            <input type="radio" name="reportReason" value="other">
                            <span>Other</span>
                        </label>
                    </div>
                    <div class="report-actions">
                        <button class="report-submit-btn" onclick="window.moodGroupManager.submitReport('${messageId}')">
                            <i class="fas fa-flag"></i>
                            Submit Report
                        </button>
                        <button class="report-cancel-btn" onclick="window.moodGroupManager.closeModal()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    submitReport(messageId) {
        const selectedReason = document.querySelector('input[name="reportReason"]:checked');
        if (!selectedReason) {
            this.showNotification('Please select a reason for reporting.', 'error');
            return;
        }

        this.reportMessage(messageId, selectedReason.value);
        this.closeModal();
    }

    // Group Resources
    showGroupResources() {
        const resourcesSection = document.getElementById('groupResourcesSection');
        if (resourcesSection) {
            resourcesSection.style.display = 'block';
            this.loadGroupResources();
        }
    }

    loadGroupResources() {
        const resourcesContent = document.getElementById('groupResourcesContent');
        if (!resourcesContent || !this.currentMood) return;

        const resources = this.getMoodResources(this.currentMood);
        
        resourcesContent.innerHTML = `
            <div class="resources-grid">
                ${resources.map(resource => `
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="${resource.icon}"></i>
                        </div>
                        <div class="resource-content">
                            <h4>${resource.title}</h4>
                            <p>${resource.description}</p>
                            <div class="resource-actions">
                                ${resource.link ? `<a href="${resource.link}" target="_blank" class="resource-link">Learn More</a>` : ''}
                                ${resource.exercise ? `<button class="resource-exercise-btn" onclick="window.moodGroupManager.startExercise('${resource.exercise}')">Try Exercise</button>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getMoodResources(mood) {
        const resources = {
            happy: [
                {
                    title: 'Maintaining Positive Energy',
                    description: 'Tips for sustaining your positive mood and spreading joy to others.',
                    icon: 'fas fa-sun',
                    link: '#',
                    exercise: 'gratitude_journal'
                },
                {
                    title: 'Celebrating Success',
                    description: 'How to properly celebrate achievements and build on positive momentum.',
                    icon: 'fas fa-trophy',
                    link: '#'
                }
            ],
            anxious: [
                {
                    title: 'Breathing Exercises',
                    description: 'Simple breathing techniques to help calm anxiety and reduce stress.',
                    icon: 'fas fa-lungs',
                    exercise: 'breathing_exercise'
                },
                {
                    title: 'Grounding Techniques',
                    description: '5-4-3-2-1 grounding method and other anxiety management tools.',
                    icon: 'fas fa-anchor',
                    exercise: 'grounding_exercise'
                },
                {
                    title: 'Anxiety Management Apps',
                    description: 'Recommended apps and resources for managing anxiety.',
                    icon: 'fas fa-mobile-alt',
                    link: '#'
                }
            ],
            stressed: [
                {
                    title: 'Time Management Strategies',
                    description: 'Effective techniques for managing workload and reducing stress.',
                    icon: 'fas fa-clock',
                    link: '#'
                },
                {
                    title: 'Stress Relief Exercises',
                    description: 'Quick exercises to reduce stress and tension.',
                    icon: 'fas fa-heartbeat',
                    exercise: 'stress_relief'
                },
                {
                    title: 'Pomodoro Technique',
                    description: 'Learn the 25-minute work, 5-minute break method.',
                    icon: 'fas fa-stopwatch',
                    link: '#'
                }
            ],
            excited: [
                {
                    title: 'Channeling Excitement',
                    description: 'How to channel positive energy into productive activities.',
                    icon: 'fas fa-bolt',
                    link: '#'
                },
                {
                    title: 'Goal Setting',
                    description: 'Turn excitement into achievable goals and action plans.',
                    icon: 'fas fa-bullseye',
                    exercise: 'goal_setting'
                }
            ],
            sad: [
                {
                    title: 'Coping with Sadness',
                    description: 'Healthy ways to process and work through difficult emotions.',
                    icon: 'fas fa-heart',
                    link: '#'
                },
                {
                    title: 'Self-Care Activities',
                    description: 'Gentle self-care practices for difficult times.',
                    icon: 'fas fa-spa',
                    exercise: 'self_care'
                },
                {
                    title: 'Professional Support',
                    description: 'When and how to seek professional help for persistent sadness.',
                    icon: 'fas fa-user-md',
                    link: '#'
                }
            ],
            motivated: [
                {
                    title: 'Sustaining Motivation',
                    description: 'Strategies for maintaining motivation over the long term.',
                    icon: 'fas fa-fire',
                    link: '#'
                },
                {
                    title: 'Goal Achievement',
                    description: 'Break down big goals into manageable steps.',
                    icon: 'fas fa-tasks',
                    exercise: 'goal_breakdown'
                }
            ],
            overwhelmed: [
                {
                    title: 'Managing Overwhelm',
                    description: 'Step-by-step approach to dealing with overwhelming situations.',
                    icon: 'fas fa-compress',
                    exercise: 'overwhelm_management'
                },
                {
                    title: 'Prioritization Techniques',
                    description: 'Learn to prioritize tasks and reduce mental load.',
                    icon: 'fas fa-sort',
                    link: '#'
                },
                {
                    title: 'Asking for Help',
                    description: 'How to reach out and ask for support when needed.',
                    icon: 'fas fa-hands-helping',
                    link: '#'
                }
            ],
            lonely: [
                {
                    title: 'Building Connections',
                    description: 'Strategies for building meaningful relationships and connections.',
                    icon: 'fas fa-users',
                    link: '#'
                },
                {
                    title: 'Social Skills',
                    description: 'Tips for improving social interactions and communication.',
                    icon: 'fas fa-comments',
                    link: '#'
                },
                {
                    title: 'Community Resources',
                    description: 'Find local groups and activities to meet new people.',
                    icon: 'fas fa-map-marker-alt',
                    link: '#'
                }
            ]
        };

        return resources[mood] || [];
    }

    // Interactive Polls
    showGroupPolls() {
        const pollsSection = document.getElementById('pollsSection');
        if (pollsSection) {
            pollsSection.style.display = 'block';
            this.loadGroupPolls();
        }
    }

    loadGroupPolls() {
        const pollsContent = document.getElementById('pollsContent');
        if (!pollsContent || !this.currentMood) return;

        const polls = this.getGroupPolls(this.currentMood);
        
        pollsContent.innerHTML = `
            <div class="polls-grid">
                ${polls.map(poll => `
                    <div class="poll-card">
                        <div class="poll-header">
                            <h4>${poll.question}</h4>
                            <span class="poll-status ${poll.active ? 'active' : 'closed'}">
                                ${poll.active ? 'Active' : 'Closed'}
                            </span>
                        </div>
                        <div class="poll-options">
                            ${poll.options.map((option, index) => `
                                <div class="poll-option">
                                    <label>
                                        <input type="radio" name="poll_${poll.id}" value="${index}">
                                        <span>${option.text}</span>
                                    </label>
                                    <div class="poll-results" style="display: none;">
                                        <div class="poll-bar">
                                            <div class="poll-fill" style="width: ${option.votes / poll.totalVotes * 100}%"></div>
                                        </div>
                                        <span class="poll-percentage">${option.votes} votes (${Math.round(option.votes / poll.totalVotes * 100)}%)</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="poll-actions">
                            <button class="vote-btn" onclick="window.moodGroupManager.votePoll('${poll.id}')">
                                <i class="fas fa-vote-yea"></i>
                                Vote
                            </button>
                            <button class="results-btn" onclick="window.moodGroupManager.showPollResults('${poll.id}')">
                                <i class="fas fa-chart-bar"></i>
                                Results
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getGroupPolls(mood) {
        const polls = {
            happy: [
                {
                    id: 'happy_1',
                    question: 'What makes you feel most grateful today?',
                    options: [
                        { text: 'Personal achievements', votes: 12 },
                        { text: 'Supportive relationships', votes: 18 },
                        { text: 'Good health', votes: 8 },
                        { text: 'Learning opportunities', votes: 6 }
                    ],
                    totalVotes: 44,
                    active: true
                }
            ],
            anxious: [
                {
                    id: 'anxious_1',
                    question: 'What helps you manage anxiety most effectively?',
                    options: [
                        { text: 'Breathing exercises', votes: 15 },
                        { text: 'Talking to someone', votes: 10 },
                        { text: 'Physical activity', votes: 8 },
                        { text: 'Mindfulness meditation', votes: 12 }
                    ],
                    totalVotes: 45,
                    active: true
                }
            ],
            stressed: [
                {
                    id: 'stressed_1',
                    question: 'What is your biggest source of stress right now?',
                    options: [
                        { text: 'Academic workload', votes: 20 },
                        { text: 'Financial concerns', votes: 8 },
                        { text: 'Social relationships', votes: 6 },
                        { text: 'Future planning', votes: 10 }
                    ],
                    totalVotes: 44,
                    active: true
                }
            ]
        };

        return polls[mood] || [];
    }

    showCreatePollModal() {
        const modal = this.createModal('create-poll-modal');
        
        modal.innerHTML = `
            <div class="create-poll-content">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> Create New Poll</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="create-poll-body">
                    <form id="createPollForm">
                        <div class="form-group">
                            <label for="pollQuestion">Poll Question:</label>
                            <input type="text" id="pollQuestion" required placeholder="What would you like to ask the group?">
                        </div>
                        <div class="form-group">
                            <label>Poll Options:</label>
                            <div class="poll-options-input">
                                <input type="text" class="poll-option-input" placeholder="Option 1" required>
                                <input type="text" class="poll-option-input" placeholder="Option 2" required>
                                <input type="text" class="poll-option-input" placeholder="Option 3">
                                <input type="text" class="poll-option-input" placeholder="Option 4">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="create-poll-submit-btn">
                                <i class="fas fa-plus"></i>
                                Create Poll
                            </button>
                            <button type="button" class="cancel-btn" onclick="window.moodGroupManager.closeModal()">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        modal.querySelector('#createPollForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPoll();
        });

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    createPoll() {
        const question = document.getElementById('pollQuestion').value;
        const options = Array.from(document.querySelectorAll('.poll-option-input'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');

        if (options.length < 2) {
            this.showNotification('Please provide at least 2 options for the poll.', 'error');
            return;
        }

        const poll = {
            id: Date.now().toString(),
            question: question,
            options: options.map(text => ({ text, votes: 0 })),
            totalVotes: 0,
            active: true,
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString()
        };

        // Save poll to localStorage
        const pollsKey = `group_polls_${this.currentMood}`;
        const existingPolls = JSON.parse(localStorage.getItem(pollsKey) || '[]');
        existingPolls.push(poll);
        localStorage.setItem(pollsKey, JSON.stringify(existingPolls));

        this.showNotification('Poll created successfully!', 'success');
        this.closeModal();
        this.loadGroupPolls();
    }

    // Personal Analytics
    showPersonalAnalytics() {
        const analyticsSection = document.getElementById('personalAnalyticsSection');
        if (analyticsSection) {
            analyticsSection.style.display = 'block';
            this.loadPersonalAnalytics();
        }
    }

    loadPersonalAnalytics() {
        const analyticsContent = document.getElementById('personalAnalyticsContent');
        if (!analyticsContent) return;

        const analytics = this.calculatePersonalAnalytics();
        
        analyticsContent.innerHTML = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="analytics-info">
                        <h4>Messages Sent</h4>
                        <p class="analytics-number">${analytics.messagesSent}</p>
                        <span class="analytics-period">This month</span>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="analytics-info">
                        <h4>Groups Joined</h4>
                        <p class="analytics-number">${analytics.groupsJoined}</p>
                        <span class="analytics-period">Total</span>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-poll"></i>
                    </div>
                    <div class="analytics-info">
                        <h4>Polls Participated</h4>
                        <p class="analytics-number">${analytics.pollsParticipated}</p>
                        <span class="analytics-period">This month</span>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="analytics-info">
                        <h4>Mood Changes</h4>
                        <p class="analytics-number">${analytics.moodChanges}</p>
                        <span class="analytics-period">This month</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-chart">
                <h4>Mood Journey</h4>
                <div class="mood-timeline">
                    ${analytics.moodTimeline.map(entry => `
                        <div class="timeline-item">
                            <div class="timeline-mood">
                                <span class="mood-emoji">${this.moodCategories[entry.mood]?.emoji}</span>
                                <span class="mood-name">${this.moodCategories[entry.mood]?.description}</span>
                            </div>
                            <div class="timeline-date">${entry.date}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    calculatePersonalAnalytics() {
        // Calculate analytics from user data
        const userMovements = JSON.parse(localStorage.getItem('user_movements') || '[]');
        const userMovementsThisMonth = userMovements.filter(movement => {
            const movementDate = new Date(movement.timestamp);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return movementDate >= monthAgo;
        });

        return {
            messagesSent: Math.floor(Math.random() * 50) + 10, // Simulated data
            groupsJoined: new Set(userMovements.map(m => m.toMood)).size,
            pollsParticipated: Math.floor(Math.random() * 10) + 2,
            moodChanges: userMovementsThisMonth.length,
            moodTimeline: userMovementsThisMonth.slice(-10).map(movement => ({
                mood: movement.toMood,
                date: new Date(movement.timestamp).toLocaleDateString()
            }))
        };
    }

    // Group Info
    showGroupInfo() {
        const modal = this.createModal('group-info-modal');
        const moodData = this.moodCategories[this.currentMood];
        
        modal.innerHTML = `
            <div class="group-info-content">
                <div class="modal-header">
                    <h2><i class="${moodData.icon}"></i> ${moodData.groupName}</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="group-info-body">
                    <div class="group-description">
                        <h4>About This Group</h4>
                        <p>This is a supportive community for people experiencing ${moodData.description.toLowerCase()} feelings. Share your experiences, offer support, and connect with others who understand what you're going through.</p>
                    </div>
                    
                    <div class="group-stats">
                        <h4>Group Statistics</h4>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Members</span>
                                <span class="stat-value">${this.groupMembers.length}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Messages Today</span>
                                <span class="stat-value">${this.chatMessages.filter(msg => {
                                    const today = new Date().toDateString();
                                    return new Date(msg.timestamp).toDateString() === today;
                                }).length}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Active Polls</span>
                                <span class="stat-value">${this.getGroupPolls(this.currentMood).filter(p => p.active).length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="group-guidelines">
                        <h4>Group Guidelines</h4>
                        <ul>
                            <li>Be respectful and supportive to all members</li>
                            <li>Keep conversations relevant to the group's purpose</li>
                            <li>Respect privacy and confidentiality</li>
                            <li>Report inappropriate content</li>
                            <li>Remember this is a safe space for everyone</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    // Voice Message Methods
    setupVoiceRecording() {
        const voiceBtn = document.getElementById('voiceMessageBtn');
        const stopBtn = document.getElementById('stopRecordingBtn');
        const cancelBtn = document.getElementById('cancelRecordingBtn');
        const sendVoiceBtn = document.getElementById('sendVoiceBtn');
        const reRecordBtn = document.getElementById('reRecordBtn');
        const playVoiceBtn = document.getElementById('playVoiceBtn');

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.startVoiceRecording());
        }
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopVoiceRecording());
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelVoiceRecording());
        }
        if (sendVoiceBtn) {
            sendVoiceBtn.addEventListener('click', () => this.sendVoiceMessage());
        }
        if (reRecordBtn) {
            reRecordBtn.addEventListener('click', () => this.startVoiceRecording());
        }
        if (playVoiceBtn) {
            playVoiceBtn.addEventListener('click', () => this.playVoiceMessage());
        }
    }

    async startVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                this.showVoicePlayback();
            };

            this.mediaRecorder.start();
            this.showRecordingInterface();
            this.startRecordingTimer();
            this.startAudioVisualizer();

            this.showNotification('Voice recording started', 'success');
        } catch (error) {
            console.error('Error starting voice recording:', error);
            this.showNotification('Unable to access microphone. Please check permissions.', 'error');
        }
    }

    stopVoiceRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopRecordingTimer();
            this.stopAudioVisualizer();
            
            // Stop all tracks to release microphone
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            this.showNotification('Voice recording stopped', 'success');
        }
    }

    cancelVoiceRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopRecordingTimer();
            this.stopAudioVisualizer();
            
            // Stop all tracks to release microphone
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            this.hideRecordingInterface();
            this.audioChunks = [];
            this.showNotification('Voice recording cancelled', 'info');
        }
    }

    showRecordingInterface() {
        const recordingInterface = document.getElementById('voiceRecordingInterface');
        const inputContainer = document.querySelector('.input-container');
        
        if (recordingInterface && inputContainer) {
            inputContainer.style.display = 'none';
            recordingInterface.style.display = 'block';
        }
    }

    hideRecordingInterface() {
        const recordingInterface = document.getElementById('voiceRecordingInterface');
        const inputContainer = document.querySelector('.input-container');
        
        if (recordingInterface && inputContainer) {
            recordingInterface.style.display = 'none';
            inputContainer.style.display = 'flex';
        }
    }

    showVoicePlayback() {
        const playbackInterface = document.getElementById('voicePlaybackInterface');
        const recordingInterface = document.getElementById('voiceRecordingInterface');
        
        if (playbackInterface && recordingInterface) {
            recordingInterface.style.display = 'none';
            playbackInterface.style.display = 'block';
        }
    }

    hideVoicePlayback() {
        const playbackInterface = document.getElementById('voicePlaybackInterface');
        const inputContainer = document.querySelector('.input-container');
        
        if (playbackInterface && inputContainer) {
            playbackInterface.style.display = 'none';
            inputContainer.style.display = 'flex';
        }
    }

    startRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            const elapsed = Date.now() - this.recordingStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            const timerElement = document.getElementById('recordingTimer');
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    startAudioVisualizer() {
        const bars = document.querySelectorAll('.audio-bars .bar');
        bars.forEach(bar => {
            const interval = setInterval(() => {
                const height = Math.random() * 100;
                bar.style.height = `${height}%`;
            }, 100);
            
            // Store interval ID for cleanup
            bar.dataset.intervalId = interval;
        });
    }

    stopAudioVisualizer() {
        const bars = document.querySelectorAll('.audio-bars .bar');
        bars.forEach(bar => {
            if (bar.dataset.intervalId) {
                clearInterval(bar.dataset.intervalId);
                bar.style.height = '20%';
            }
        });
    }

    playVoiceMessage() {
        if (this.audioChunks.length > 0) {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            const playBtn = document.getElementById('playVoiceBtn');
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            
            audio.onended = () => {
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                URL.revokeObjectURL(audioUrl);
            };
            
            audio.play();
        }
    }

    sendVoiceMessage() {
        if (this.audioChunks.length > 0) {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            const voiceMessage = {
                id: Date.now().toString(),
                userId: this.currentUser.id,
                userName: this.currentUser.fullName,
                message: '[Voice Message]',
                timestamp: new Date().toISOString(),
                type: 'voice',
                audioUrl: audioUrl,
                duration: this.getRecordingDuration()
            };

            this.chatMessages.push(voiceMessage);
            this.saveGroupChat();
            this.updateChatDisplay();
            this.hideVoicePlayback();
            this.audioChunks = [];
            
            this.showNotification('Voice message sent!', 'success');
        }
    }

    getRecordingDuration() {
        if (this.recordingStartTime) {
            const elapsed = Date.now() - this.recordingStartTime;
            return Math.floor(elapsed / 1000);
        }
        return 0;
    }

    createVoiceMessageElement(message) {
        const isOwnMessage = message.userId === this.currentUser?.id;
        
        return `
            <div class="chat-message voice-message ${isOwnMessage ? 'own-message' : ''}">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">${message.userName}</span>
                        <span class="message-time">${this.formatTime(message.timestamp)}</span>
                        ${!isOwnMessage ? `
                            <div class="message-actions">
                                <button class="report-message-btn" onclick="window.moodGroupManager.showReportMessageModal('${message.id}')" title="Report message">
                                    <i class="fas fa-flag"></i>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="voice-message-content">
                        <button class="play-voice-message-btn" onclick="window.moodGroupManager.playStoredVoiceMessage('${message.id}')">
                            <i class="fas fa-play"></i>
                            <span>Voice Message (${message.duration || 0}s)</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    playStoredVoiceMessage(messageId) {
        const message = this.chatMessages.find(msg => msg.id === messageId);
        if (message && message.audioUrl) {
            const audio = new Audio(message.audioUrl);
            audio.play();
        }
    }

    // Group Challenges Methods
    showGroupChallenges() {
        const challengesSection = document.getElementById('groupChallengesSection');
        if (challengesSection) {
            challengesSection.style.display = 'block';
            this.loadGroupChallenges();
            this.setupChallengesTabs();
        }
    }

    setupChallengesTabs() {
        const tabs = document.querySelectorAll('.challenge-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadChallengeTab(tab.dataset.tab);
            });
        });
    }

    loadChallengeTab(tab) {
        switch(tab) {
            case 'active':
                this.loadGroupChallenges();
                break;
            case 'completed':
                this.loadCompletedChallenges();
                break;
            case 'create':
                this.showCreateChallengeForm();
                break;
        }
    }

    loadGroupChallenges() {
        const challengesContent = document.getElementById('challengesContent');
        if (!challengesContent || !this.currentMood) return;

        const challenges = this.getGroupChallenges(this.currentMood);
        
        challengesContent.innerHTML = `
            <div class="challenges-grid">
                ${challenges.map(challenge => this.createChallengeCard(challenge)).join('')}
            </div>
        `;
    }

    getGroupChallenges(mood) {
        const challenges = {
            happy: [
                {
                    id: 'happy_1',
                    title: '30-Day Gratitude Challenge',
                    description: 'Share one thing you\'re grateful for every day for 30 days',
                    category: 'Gratitude',
                    duration: '30 days',
                    participants: 12,
                    progress: 65,
                    reward: 'Gratitude Master Badge',
                    icon: 'fas fa-heart',
                    status: 'active'
                },
                {
                    id: 'happy_2',
                    title: 'Spread Joy Challenge',
                    description: 'Perform one random act of kindness each week',
                    category: 'Kindness',
                    duration: '4 weeks',
                    participants: 8,
                    progress: 50,
                    reward: 'Joy Spreader Badge',
                    icon: 'fas fa-hands-helping',
                    status: 'active'
                }
            ],
            anxious: [
                {
                    id: 'anxious_1',
                    title: 'Daily Breathing Practice',
                    description: 'Practice 5-minute breathing exercises daily for 2 weeks',
                    category: 'Mindfulness',
                    duration: '14 days',
                    participants: 15,
                    progress: 70,
                    reward: 'Calm Mind Badge',
                    icon: 'fas fa-wind',
                    status: 'active'
                },
                {
                    id: 'anxious_2',
                    title: 'Worry Journal Challenge',
                    description: 'Write down 3 worries and 3 solutions every day',
                    category: 'Journaling',
                    duration: '21 days',
                    participants: 10,
                    progress: 45,
                    reward: 'Anxiety Warrior Badge',
                    icon: 'fas fa-book',
                    status: 'active'
                }
            ],
            stressed: [
                {
                    id: 'stressed_1',
                    title: 'Work-Life Balance Challenge',
                    description: 'Set clear boundaries and take breaks every 2 hours',
                    category: 'Balance',
                    duration: '14 days',
                    participants: 20,
                    progress: 60,
                    reward: 'Balance Master Badge',
                    icon: 'fas fa-balance-scale',
                    status: 'active'
                },
                {
                    id: 'stressed_2',
                    title: 'Stress-Free Sundays',
                    description: 'Dedicate Sundays to relaxation and self-care',
                    category: 'Self-Care',
                    duration: '4 weeks',
                    participants: 14,
                    progress: 75,
                    reward: 'Self-Care Champion Badge',
                    icon: 'fas fa-spa',
                    status: 'active'
                }
            ],
            motivated: [
                {
                    id: 'motivated_1',
                    title: 'Goal Crusher Challenge',
                    description: 'Set and achieve one weekly goal for 6 weeks',
                    category: 'Goals',
                    duration: '6 weeks',
                    participants: 18,
                    progress: 55,
                    reward: 'Goal Achiever Badge',
                    icon: 'fas fa-bullseye',
                    status: 'active'
                },
                {
                    id: 'motivated_2',
                    title: 'Morning Routine Challenge',
                    description: 'Follow a consistent morning routine for 21 days',
                    category: 'Habits',
                    duration: '21 days',
                    participants: 16,
                    progress: 80,
                    reward: 'Early Bird Badge',
                    icon: 'fas fa-sun',
                    status: 'active'
                }
            ]
        };

        return challenges[mood] || [];
    }

    createChallengeCard(challenge) {
        return `
            <div class="challenge-card ${challenge.status}">
                <div class="challenge-header">
                    <div class="challenge-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <i class="${challenge.icon}"></i>
                    </div>
                    <div class="challenge-category">${challenge.category}</div>
                </div>
                <div class="challenge-body">
                    <h4>${challenge.title}</h4>
                    <p>${challenge.description}</p>
                    <div class="challenge-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${challenge.duration}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${challenge.participants} participants</span>
                        </div>
                    </div>
                    <div class="challenge-progress">
                        <div class="progress-header">
                            <span>Progress</span>
                            <span>${challenge.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${challenge.progress}%"></div>
                        </div>
                    </div>
                    <div class="challenge-reward">
                        <i class="fas fa-trophy"></i>
                        <span>Reward: ${challenge.reward}</span>
                    </div>
                </div>
                <div class="challenge-actions">
                    <button class="join-challenge-btn" onclick="window.moodGroupManager.joinChallenge('${challenge.id}')">
                        <i class="fas fa-plus"></i>
                        Join Challenge
                    </button>
                    <button class="view-challenge-btn" onclick="window.moodGroupManager.viewChallenge('${challenge.id}')">
                        <i class="fas fa-info-circle"></i>
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    joinChallenge(challengeId) {
        this.showNotification('You\'ve joined the challenge! Keep up the great work!', 'success');
    }

    viewChallenge(challengeId) {
        // Show detailed challenge view
        this.showNotification('Challenge details coming soon!', 'info');
    }

    loadCompletedChallenges() {
        const challengesContent = document.getElementById('challengesContent');
        if (!challengesContent) return;

        challengesContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <h3>No Completed Challenges Yet</h3>
                <p>Complete challenges to see them here and earn badges!</p>
            </div>
        `;
    }

    showCreateChallengeForm() {
        const challengesContent = document.getElementById('challengesContent');
        if (!challengesContent) return;

        challengesContent.innerHTML = `
            <div class="create-challenge-form">
                <h4>Create a New Challenge</h4>
                <form id="createChallengeForm">
                    <div class="form-group">
                        <label for="challengeTitle">Challenge Title:</label>
                        <input type="text" id="challengeTitle" required placeholder="e.g., 30-Day Meditation Challenge">
                    </div>
                    <div class="form-group">
                        <label for="challengeDescription">Description:</label>
                        <textarea id="challengeDescription" rows="3" required placeholder="Describe the challenge..."></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="challengeCategory">Category:</label>
                            <select id="challengeCategory" required>
                                <option value="">Select category</option>
                                <option value="Mindfulness">Mindfulness</option>
                                <option value="Gratitude">Gratitude</option>
                                <option value="Self-Care">Self-Care</option>
                                <option value="Goals">Goals</option>
                                <option value="Habits">Habits</option>
                                <option value="Kindness">Kindness</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="challengeDuration">Duration:</label>
                            <input type="text" id="challengeDuration" required placeholder="e.g., 30 days">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="challengeReward">Reward Badge Name:</label>
                        <input type="text" id="challengeReward" required placeholder="e.g., Meditation Master Badge">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="create-challenge-submit-btn">
                            <i class="fas fa-plus"></i>
                            Create Challenge
                        </button>
                        <button type="button" class="cancel-btn" onclick="window.moodGroupManager.loadGroupChallenges()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('createChallengeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewChallenge();
        });
    }

    createNewChallenge() {
        const title = document.getElementById('challengeTitle').value;
        const description = document.getElementById('challengeDescription').value;
        const category = document.getElementById('challengeCategory').value;
        const duration = document.getElementById('challengeDuration').value;
        const reward = document.getElementById('challengeReward').value;

        // Save challenge
        this.showNotification('Challenge created successfully!', 'success');
        this.loadGroupChallenges();
    }

    // Enhanced Chat Features
    toggleChatSettings() {
        const modal = this.createModal('chat-settings-modal');
        
        modal.innerHTML = `
            <div class="chat-settings-content">
                <div class="modal-header">
                    <h2><i class="fas fa-cog"></i> Chat Settings</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="chat-settings-body">
                    <div class="setting-group">
                        <h4>Notifications</h4>
                        <label class="setting-item">
                            <input type="checkbox" id="messageNotifications" checked>
                            <span>Message notifications</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="typingNotifications" checked>
                            <span>Typing indicators</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="soundNotifications" checked>
                            <span>Sound notifications</span>
                        </label>
                    </div>
                    
                    <div class="setting-group">
                        <h4>Display</h4>
                        <label class="setting-item">
                            <input type="checkbox" id="showTimestamps" checked>
                            <span>Show message timestamps</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="showAvatars" checked>
                            <span>Show user avatars</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="compactMode">
                            <span>Compact mode</span>
                        </label>
                    </div>
                    
                    <div class="setting-group">
                        <h4>Privacy</h4>
                        <label class="setting-item">
                            <input type="checkbox" id="readReceipts" checked>
                            <span>Read receipts</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="onlineStatus" checked>
                            <span>Show online status</span>
                        </label>
                    </div>
                    
                    <div class="setting-actions">
                        <button class="save-settings-btn" onclick="window.moodGroupManager.saveChatSettings()">
                            <i class="fas fa-save"></i>
                            Save Settings
                        </button>
                        <button class="reset-settings-btn" onclick="window.moodGroupManager.resetChatSettings()">
                            <i class="fas fa-undo"></i>
                            Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    saveChatSettings() {
        this.showNotification('Chat settings saved!', 'success');
        this.closeModal();
    }

    resetChatSettings() {
        this.showNotification('Settings reset to default!', 'info');
        this.closeModal();
    }

    clearChat() {
        const modal = this.createModal('clear-chat-modal');
        
        modal.innerHTML = `
            <div class="clear-chat-content">
                <div class="modal-header">
                    <h2><i class="fas fa-trash"></i> Clear Chat</h2>
                    <button class="close-group-modal">&times;</button>
                </div>
                <div class="clear-chat-body">
                    <div class="warning-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Are you sure?</h3>
                        <p>This will permanently delete all messages in this group chat. This action cannot be undone.</p>
                    </div>
                    
                    <div class="clear-options">
                        <label class="clear-option">
                            <input type="radio" name="clearType" value="all" checked>
                            <span>Clear all messages</span>
                        </label>
                        <label class="clear-option">
                            <input type="radio" name="clearType" value="own">
                            <span>Clear only my messages</span>
                        </label>
                        <label class="clear-option">
                            <input type="radio" name="clearType" value="old">
                            <span>Clear messages older than 30 days</span>
                        </label>
                    </div>
                    
                    <div class="clear-actions">
                        <button class="confirm-clear-btn" onclick="window.moodGroupManager.confirmClearChat()">
                            <i class="fas fa-trash"></i>
                            Clear Chat
                        </button>
                        <button class="cancel-clear-btn" onclick="window.moodGroupManager.closeModal()">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-group-modal')) {
                this.closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    confirmClearChat() {
        const selectedType = document.querySelector('input[name="clearType"]:checked').value;
        
        switch(selectedType) {
            case 'all':
                this.chatMessages = [];
                break;
            case 'own':
                this.chatMessages = this.chatMessages.filter(msg => msg.userId !== this.currentUser.id);
                break;
            case 'old':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                this.chatMessages = this.chatMessages.filter(msg => new Date(msg.timestamp) > thirtyDaysAgo);
                break;
        }
        
        this.saveGroupChat();
        this.updateChatDisplay();
        this.updateMessageCount();
        this.showNotification('Chat cleared successfully!', 'success');
        this.closeModal();
    }

    scrollToBottom() {
        const chatContainer = document.querySelector('.group-chat-messages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        const btn = document.querySelector('[onclick="window.moodGroupManager.toggleAutoScroll()"]');
        if (btn) {
            btn.classList.toggle('active', this.autoScroll);
        }
        this.showNotification(this.autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled', 'info');
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.group-members-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    updateMessageCount() {
        const messageCountElement = document.getElementById('messageCount');
        if (messageCountElement) {
            messageCountElement.textContent = `${this.chatMessages.length} messages`;
        }
    }

    updateOnlineCount() {
        const onlineCountElement = document.getElementById('onlineCount');
        if (onlineCountElement) {
            // Simulate online count
            const onlineCount = Math.floor(Math.random() * this.groupMembers.length) + 1;
            onlineCountElement.textContent = `${onlineCount} members online`;
        }
    }

    setupEnhancedChatFeatures() {
        // Character counter
        const messageInput = document.getElementById('messageInput');
        const charCount = document.getElementById('charCount');
        
        if (messageInput && charCount) {
            messageInput.addEventListener('input', () => {
                const length = messageInput.value.length;
                charCount.textContent = `${length}/500`;
                
                if (length > 450) {
                    charCount.style.color = '#ef4444';
                } else if (length > 400) {
                    charCount.style.color = '#f59e0b';
                } else {
                    charCount.style.color = '#6b7280';
                }
            });
        }

        // Enhanced keyboard shortcuts
        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Auto-scroll functionality
        this.autoScroll = true;
        
        // Update counts periodically
        setInterval(() => {
            this.updateMessageCount();
            this.updateOnlineCount();
        }, 5000);
    }

    loadGroupData() {
        this.updateGroupsPreview();
    }

    updateGroupsPreview() {
        const groupsPreviewGrid = document.getElementById('groupsPreviewGrid');
        if (!groupsPreviewGrid) return;

        groupsPreviewGrid.innerHTML = Object.entries(this.moodCategories).map(([moodKey, moodData]) => {
            const groupMembersKey = `group_members_${moodKey}`;
            const members = JSON.parse(localStorage.getItem(groupMembersKey) || '[]');
            const memberCount = members.length;
            
            return `
                <div class="group-preview-card" data-mood="${moodKey}">
                    <div class="group-preview-header">
                        <div class="group-mood-display">
                            <span class="group-emoji-large">${moodData.emoji}</span>
                            <div class="group-info">
                                <h4>${moodData.groupName}</h4>
                                <p>${moodData.description}</p>
                            </div>
                        </div>
                        <div class="group-stats">
                            <span class="member-count">${memberCount} members</span>
                            <span class="group-status ${memberCount > 0 ? 'active' : 'inactive'}">
                                ${memberCount > 0 ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <div class="group-preview-members">
                        <div class="members-avatars">
                            ${members.slice(0, 4).map(member => `
                                <span class="member-avatar-small" title="${member.fullName}">
                                    ${member.avatar || '👤'}
                                </span>
                            `).join('')}
                            ${memberCount > 4 ? `<span class="more-members">+${memberCount - 4}</span>` : ''}
                        </div>
                    </div>
                    <div class="group-preview-actions">
                        <button class="join-group-btn" onclick="window.moodGroupManager.selectMoodForGroup('${moodKey}')">
                            <i class="fas fa-sign-in-alt"></i>
                            Join Group
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    initializeDefaultGroups() {
        // Initialize default groups with sample members and messages
        Object.keys(this.moodCategories).forEach(mood => {
            this.initializeGroupData(mood);
        });
    }

    initializeGroupData(mood) {
        const groupChatKey = `group_chat_${mood}`;
        const existingChat = localStorage.getItem(groupChatKey);
        
        if (!existingChat) {
            const moodData = this.moodCategories[mood];
            const sampleMembers = this.getSampleMembers(mood);
            const welcomeMessages = this.getWelcomeMessages(mood);
            
            // Create initial chat messages
            const initialMessages = [
                {
                    id: Date.now().toString(),
                    userId: 'system',
                    userName: 'System',
                    message: `Welcome to the ${moodData.groupName}! This is a safe space to share and connect with others who understand what you're going through.`,
                    timestamp: new Date().toISOString(),
                    type: 'system'
                },
                ...welcomeMessages
            ];
            
            // Save initial chat
            localStorage.setItem(groupChatKey, JSON.stringify(initialMessages));
            
            // Create sample group members
            const groupMembersKey = `group_members_${mood}`;
            localStorage.setItem(groupMembersKey, JSON.stringify(sampleMembers));
        }
    }

    getSampleMembers(mood) {
        const sampleMembers = {
            happy: [
                { id: 'user1', fullName: 'Sarah Johnson', currentMood: 'happy', avatar: '👩‍🎓' },
                { id: 'user2', fullName: 'Mike Chen', currentMood: 'happy', avatar: '👨‍💻' },
                { id: 'user3', fullName: 'Emma Davis', currentMood: 'happy', avatar: '👩‍🎨' },
                { id: 'user4', fullName: 'Alex Rodriguez', currentMood: 'happy', avatar: '👨‍🎵' }
            ],
            anxious: [
                { id: 'user5', fullName: 'Jordan Smith', currentMood: 'anxious', avatar: '👩‍🔬' },
                { id: 'user6', fullName: 'Taylor Brown', currentMood: 'anxious', avatar: '👨‍📚' },
                { id: 'user7', fullName: 'Casey Wilson', currentMood: 'anxious', avatar: '👩‍💼' },
                { id: 'user8', fullName: 'Riley Martinez', currentMood: 'anxious', avatar: '👨‍🎭' }
            ],
            stressed: [
                { id: 'user9', fullName: 'Morgan Taylor', currentMood: 'stressed', avatar: '👩‍⚕️' },
                { id: 'user10', fullName: 'Avery Johnson', currentMood: 'stressed', avatar: '👨‍🏫' },
                { id: 'user11', fullName: 'Quinn Anderson', currentMood: 'stressed', avatar: '👩‍🔧' },
                { id: 'user12', fullName: 'Sage Thompson', currentMood: 'stressed', avatar: '👨‍💻' }
            ],
            excited: [
                { id: 'user13', fullName: 'River Garcia', currentMood: 'excited', avatar: '👩‍🚀' },
                { id: 'user14', fullName: 'Phoenix Lee', currentMood: 'excited', avatar: '👨‍🎨' },
                { id: 'user15', fullName: 'Skyler White', currentMood: 'excited', avatar: '👩‍🎵' },
                { id: 'user16', fullName: 'Blake Cooper', currentMood: 'excited', avatar: '👨‍🎪' }
            ],
            sad: [
                { id: 'user17', fullName: 'Dakota Murphy', currentMood: 'sad', avatar: '👩‍🎭' },
                { id: 'user18', fullName: 'Indigo Foster', currentMood: 'sad', avatar: '👨‍🎨' },
                { id: 'user19', fullName: 'Ocean Reed', currentMood: 'sad', avatar: '👩‍📚' },
                { id: 'user20', fullName: 'Forest Green', currentMood: 'sad', avatar: '👨‍🎵' }
            ],
            motivated: [
                { id: 'user21', fullName: 'Aspen Hill', currentMood: 'motivated', avatar: '👩‍💪' },
                { id: 'user22', fullName: 'Cedar Stone', currentMood: 'motivated', avatar: '👨‍🏃' },
                { id: 'user23', fullName: 'Sage Moon', currentMood: 'motivated', avatar: '👩‍🎯' },
                { id: 'user24', fullName: 'River Star', currentMood: 'motivated', avatar: '👨‍🚀' }
            ],
            overwhelmed: [
                { id: 'user25', fullName: 'Storm Cloud', currentMood: 'overwhelmed', avatar: '👩‍💼' },
                { id: 'user26', fullName: 'Thunder Bolt', currentMood: 'overwhelmed', avatar: '👨‍📊' },
                { id: 'user27', fullName: 'Lightning Flash', currentMood: 'overwhelmed', avatar: '👩‍⚡' },
                { id: 'user28', fullName: 'Rain Drop', currentMood: 'overwhelmed', avatar: '👨‍🌧️' }
            ],
            lonely: [
                { id: 'user29', fullName: 'Luna Night', currentMood: 'lonely', avatar: '👩‍🌙' },
                { id: 'user30', fullName: 'Star Bright', currentMood: 'lonely', avatar: '👨‍⭐' },
                { id: 'user31', fullName: 'Moon Beam', currentMood: 'lonely', avatar: '👩‍🌕' },
                { id: 'user32', fullName: 'Sky Blue', currentMood: 'lonely', avatar: '👨‍☁️' }
            ]
        };
        
        return sampleMembers[mood] || [];
    }

    getWelcomeMessages(mood) {
        const welcomeMessages = {
            happy: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user1',
                    userName: 'Sarah Johnson',
                    message: "Hey everyone! Just finished my presentation and it went amazing! 🎉",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user2',
                    userName: 'Mike Chen',
                    message: "That's awesome Sarah! I love hearing good news. What was your presentation about?",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user3',
                    userName: 'Emma Davis',
                    message: "Congratulations! 🎊 I'm feeling great today too - just got accepted into my dream internship!",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            anxious: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user5',
                    userName: 'Jordan Smith',
                    message: "Hi everyone, I'm feeling really anxious about my upcoming exams. Anyone else in the same boat?",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user6',
                    userName: 'Taylor Brown',
                    message: "I totally understand Jordan. I've been using breathing exercises and they help a lot. Want to try together?",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user7',
                    userName: 'Casey Wilson',
                    message: "You're not alone! I find that breaking study sessions into smaller chunks helps me feel less overwhelmed.",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            stressed: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user9',
                    userName: 'Morgan Taylor',
                    message: "Ugh, I'm so stressed with all these deadlines coming up. How do you all manage your workload?",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user10',
                    userName: 'Avery Johnson',
                    message: "I feel you Morgan. I've started using a priority matrix to organize my tasks. It's been a game changer!",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user11',
                    userName: 'Quinn Anderson',
                    message: "Remember to take breaks! I set a timer for 25 minutes of work, then 5 minutes of rest. Pomodoro technique!",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            excited: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user13',
                    userName: 'River Garcia',
                    message: "OMG! I just got the news I've been waiting for! 🚀 Can't contain my excitement!",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user14',
                    userName: 'Phoenix Lee',
                    message: "Tell us more River! I love hearing exciting news! What happened?",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user15',
                    userName: 'Skyler White',
                    message: "I'm excited too! Just started a new creative project and the ideas are flowing! ✨",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            sad: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user17',
                    userName: 'Dakota Murphy',
                    message: "Having a really tough day today. Sometimes it feels like everything is going wrong.",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user18',
                    userName: 'Indigo Foster',
                    message: "I'm here with you Dakota. Those days are really hard, but they don't last forever. 💙",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user19',
                    userName: 'Ocean Reed',
                    message: "You're not alone in this. Sometimes just acknowledging how we feel is the first step to feeling better.",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            motivated: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user21',
                    userName: 'Aspen Hill',
                    message: "Feeling super motivated today! Just crushed my workout and ready to tackle my goals! 💪",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user22',
                    userName: 'Cedar Stone',
                    message: "That's amazing Aspen! I love this energy! What goals are you working on?",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user23',
                    userName: 'Sage Moon',
                    message: "I'm feeling motivated too! Just finished planning my week and I'm ready to make it count! 🎯",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            overwhelmed: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user25',
                    userName: 'Storm Cloud',
                    message: "Feeling completely overwhelmed with everything on my plate. Anyone else feeling this way?",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user26',
                    userName: 'Thunder Bolt',
                    message: "I totally get it Storm. When I feel overwhelmed, I try to focus on just one thing at a time.",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user27',
                    userName: 'Lightning Flash',
                    message: "Remember to breathe. Sometimes stepping back and taking a break helps us see things more clearly.",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ],
            lonely: [
                {
                    id: (Date.now() + 1).toString(),
                    userId: 'user29',
                    userName: 'Luna Night',
                    message: "Feeling really lonely today. It's hard when you feel disconnected from everyone around you.",
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 2).toString(),
                    userId: 'user30',
                    userName: 'Star Bright',
                    message: "I understand Luna. Loneliness can be really tough. You're not alone in feeling this way.",
                    timestamp: new Date(Date.now() - 3000000).toISOString(),
                    type: 'user'
                },
                {
                    id: (Date.now() + 3).toString(),
                    userId: 'user31',
                    userName: 'Moon Beam',
                    message: "Sometimes reaching out, even in small ways, can help. I'm glad you're here sharing with us.",
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    type: 'user'
                }
            ]
        };
        
        return welcomeMessages[mood] || [];
    }

    loadGroupMembers(moodKey) {
        // First try to load from localStorage
        const groupMembersKey = `group_members_${moodKey}`;
        const savedMembers = localStorage.getItem(groupMembersKey);
        
        if (savedMembers) {
            this.groupMembers = JSON.parse(savedMembers);
        } else {
            // Fallback to simulated group members
            const allUsers = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
            const groupUsers = allUsers.filter(user => user.currentMood === moodKey || user.initialMood === moodKey);
            
            // Add current user if not already in list
            if (!groupUsers.find(user => user.id === this.currentUser?.id)) {
                groupUsers.push(this.currentUser);
            }
            
            this.groupMembers = groupUsers;
        }
    }
}

// Initialize mood group manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodGroupManager = new MoodGroupManager();
});
