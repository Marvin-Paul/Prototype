// Admin Mood Groups Management System
class AdminMoodGroupsManager {
    constructor() {
        this.moodCategories = this.getMoodCategories();
        this.userMovements = [];
        this.groupStats = {};
        this.init();
    }

    init() {
        this.loadUserMovements();
        this.loadGroupStats();
        this.setupEventListeners();
        this.updateAdminDisplay();
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

    setupEventListeners() {
        // Filter controls
        const moodFilter = document.getElementById('moodFilter');
        const dateFilter = document.getElementById('dateFilter');
        const exportMovementsBtn = document.getElementById('exportMovementsBtn');
        const addMoodCategoryBtn = document.getElementById('addMoodCategoryBtn');
        const generateAnalyticsBtn = document.getElementById('generateAnalyticsBtn');
        const analyticsPeriod = document.getElementById('analyticsPeriod');

        if (moodFilter) {
            moodFilter.addEventListener('change', () => this.filterMovements());
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterMovements());
        }

        if (exportMovementsBtn) {
            exportMovementsBtn.addEventListener('click', () => this.exportMovements());
        }

        if (addMoodCategoryBtn) {
            addMoodCategoryBtn.addEventListener('click', () => this.showAddMoodCategoryModal());
        }

        if (generateAnalyticsBtn) {
            generateAnalyticsBtn.addEventListener('click', () => this.generateAnalyticsReport());
        }

        if (analyticsPeriod) {
            analyticsPeriod.addEventListener('change', () => this.updateAnalyticsChart());
        }
    }

    loadUserMovements() {
        this.userMovements = JSON.parse(localStorage.getItem('user_movements') || '[]');
    }

    loadGroupStats() {
        const users = JSON.parse(localStorage.getItem('campusMindspace_users') || '[]');
        this.groupStats = {};

        // Count members in each group
        Object.keys(this.moodCategories).forEach(mood => {
            this.groupStats[mood] = {
                memberCount: 0,
                messagesToday: 0,
                lastActivity: null
            };
        });

        // Count current group members
        users.forEach(user => {
            const currentMood = user.currentMood || user.initialMood;
            if (currentMood && this.groupStats[currentMood]) {
                this.groupStats[currentMood].memberCount++;
            }
        });

        // Count messages today for each group
        Object.keys(this.moodCategories).forEach(mood => {
            const groupChatKey = `group_chat_${mood}`;
            const messages = JSON.parse(localStorage.getItem(groupChatKey) || '[]');
            const today = new Date().toDateString();
            
            this.groupStats[mood].messagesToday = messages.filter(msg => {
                const messageDate = new Date(msg.timestamp).toDateString();
                return messageDate === today;
            }).length;

            if (messages.length > 0) {
                this.groupStats[mood].lastActivity = messages[messages.length - 1].timestamp;
            }
        });
    }

    updateAdminDisplay() {
        this.updateGroupStats();
        this.updateGroupsList();
        this.updateMovementsTable();
        this.updateMoodCategoriesList();
        this.updateAnalyticsChart();
    }

    updateGroupStats() {
        const totalActiveGroups = Object.values(this.groupStats).filter(group => group.memberCount > 0).length;
        const totalGroupMembers = Object.values(this.groupStats).reduce((sum, group) => sum + group.memberCount, 0);
        const totalMessagesToday = Object.values(this.groupStats).reduce((sum, group) => sum + group.messagesToday, 0);

        const totalActiveGroupsEl = document.getElementById('totalActiveGroups');
        const totalGroupMembersEl = document.getElementById('totalGroupMembers');
        const messagesTodayEl = document.getElementById('messagesToday');

        if (totalActiveGroupsEl) totalActiveGroupsEl.textContent = totalActiveGroups;
        if (totalGroupMembersEl) totalGroupMembersEl.textContent = totalGroupMembers;
        if (messagesTodayEl) messagesTodayEl.textContent = totalMessagesToday;
    }

    updateGroupsList() {
        const groupsListEl = document.getElementById('groupsList');
        if (!groupsListEl) return;

        const activeGroups = Object.entries(this.groupStats)
            .filter(([mood, stats]) => stats.memberCount > 0)
            .sort((a, b) => b[1].memberCount - a[1].memberCount);

        groupsListEl.innerHTML = activeGroups.map(([mood, stats]) => {
            const moodData = this.moodCategories[mood];
            const lastActivity = stats.lastActivity ? this.formatTime(stats.lastActivity) : 'No activity';
            
            return `
                <div class="group-monitor-card">
                    <div class="group-header">
                        <div class="group-mood-info">
                            <span class="group-emoji">${moodData.emoji}</span>
                            <div class="group-details">
                                <h4>${moodData.groupName}</h4>
                                <p>${stats.memberCount} member${stats.memberCount !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div class="group-status">
                            <span class="status-indicator ${stats.memberCount > 0 ? 'active' : 'inactive'}"></span>
                            <span class="status-text">${stats.memberCount > 0 ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                    <div class="group-stats">
                        <div class="stat-item">
                            <i class="fas fa-comments"></i>
                            <span>${stats.messagesToday} messages today</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-clock"></i>
                            <span>Last activity: ${lastActivity}</span>
                        </div>
                    </div>
                    <div class="group-actions">
                        <button class="view-group-btn" onclick="adminMoodGroupsManager.viewGroupDetails('${mood}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="manage-group-btn" onclick="adminMoodGroupsManager.manageGroup('${mood}')">
                            <i class="fas fa-cog"></i> Manage
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateMovementsTable() {
        const movementsTableBody = document.getElementById('movementsTableBody');
        if (!movementsTableBody) return;

        const filteredMovements = this.getFilteredMovements();
        
        movementsTableBody.innerHTML = filteredMovements.map(movement => {
            const fromMood = this.moodCategories[movement.fromMood]?.description || movement.fromMood;
            const toMood = this.moodCategories[movement.toMood]?.description || movement.toMood;
            const date = new Date(movement.timestamp).toLocaleDateString();
            const time = new Date(movement.timestamp).toLocaleTimeString();

            return `
                <tr>
                    <td>${movement.userName}</td>
                    <td><span class="mood-badge from">${fromMood}</span></td>
                    <td><span class="mood-badge to">${toMood}</span></td>
                    <td>${date}</td>
                    <td>${time}</td>
                </tr>
            `;
        }).join('');
    }

    getFilteredMovements() {
        let filtered = [...this.userMovements];

        const moodFilter = document.getElementById('moodFilter');
        const dateFilter = document.getElementById('dateFilter');

        if (moodFilter && moodFilter.value) {
            filtered = filtered.filter(movement => 
                movement.fromMood === moodFilter.value || movement.toMood === moodFilter.value
            );
        }

        if (dateFilter && dateFilter.value) {
            const filterDate = new Date(dateFilter.value).toDateString();
            filtered = filtered.filter(movement => {
                const movementDate = new Date(movement.timestamp).toDateString();
                return movementDate === filterDate;
            });
        }

        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    updateMoodCategoriesList() {
        const moodCategoriesListEl = document.getElementById('moodCategoriesList');
        if (!moodCategoriesListEl) return;

        moodCategoriesListEl.innerHTML = Object.entries(this.moodCategories).map(([key, mood]) => `
            <div class="mood-category-item">
                <div class="category-info">
                    <span class="category-emoji">${mood.emoji}</span>
                    <div class="category-details">
                        <h4>${mood.description}</h4>
                        <p>${mood.groupName}</p>
                    </div>
                </div>
                <div class="category-stats">
                    <span class="member-count">${this.groupStats[key]?.memberCount || 0} members</span>
                </div>
                <div class="category-actions">
                    <button class="edit-category-btn" onclick="adminMoodGroupsManager.editMoodCategory('${key}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-category-btn" onclick="adminMoodGroupsManager.deleteMoodCategory('${key}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateAnalyticsChart() {
        const analyticsChartEl = document.getElementById('analyticsChart');
        if (!analyticsChartEl) return;

        const period = document.getElementById('analyticsPeriod')?.value || 'week';
        const analytics = this.generateMoodAnalytics(period);

        analyticsChartEl.innerHTML = `
            <div class="analytics-summary">
                <div class="summary-stats">
                    <div class="summary-stat">
                        <h4>Most Common Mood</h4>
                        <p>${analytics.mostCommonMood}</p>
                    </div>
                    <div class="summary-stat">
                        <h4>Total Movements</h4>
                        <p>${analytics.totalMovements}</p>
                    </div>
                    <div class="summary-stat">
                        <h4>Average Daily Changes</h4>
                        <p>${analytics.averageDailyChanges}</p>
                    </div>
                </div>
            </div>
            <div class="mood-distribution-chart">
                <h4>Mood Distribution</h4>
                <div class="distribution-bars">
                    ${Object.entries(analytics.moodDistribution).map(([mood, count]) => {
                        const moodData = this.moodCategories[mood];
                        const percentage = analytics.totalMovements > 0 ? (count / analytics.totalMovements * 100).toFixed(1) : 0;
                        return `
                            <div class="distribution-bar">
                                <div class="bar-label">
                                    <span class="mood-emoji">${moodData.emoji}</span>
                                    <span class="mood-name">${moodData.description}</span>
                                </div>
                                <div class="bar-container">
                                    <div class="bar-fill" style="width: ${percentage}%; background: ${moodData.color}"></div>
                                </div>
                                <div class="bar-value">${count} (${percentage}%)</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    generateMoodAnalytics(period = 'week') {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            default:
                startDate = new Date(0);
        }

        const filteredMovements = this.userMovements.filter(movement => 
            new Date(movement.timestamp) >= startDate
        );

        const moodDistribution = {};
        filteredMovements.forEach(movement => {
            moodDistribution[movement.toMood] = (moodDistribution[movement.toMood] || 0) + 1;
        });

        const mostCommonMood = Object.entries(moodDistribution)
            .sort(([,a], [,b]) => b - a)[0];

        const daysInPeriod = Math.max(1, Math.ceil((now - startDate) / (24 * 60 * 60 * 1000)));
        const averageDailyChanges = (filteredMovements.length / daysInPeriod).toFixed(1);

        return {
            mostCommonMood: mostCommonMood ? this.moodCategories[mostCommonMood[0]].description : 'N/A',
            totalMovements: filteredMovements.length,
            averageDailyChanges,
            moodDistribution
        };
    }

    filterMovements() {
        this.updateMovementsTable();
    }

    exportMovements() {
        const filteredMovements = this.getFilteredMovements();
        const csvContent = this.generateCSV(filteredMovements);
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user_movements_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateCSV(movements) {
        const headers = ['User Name', 'From Mood', 'To Mood', 'Date', 'Time'];
        const rows = movements.map(movement => [
            movement.userName,
            this.moodCategories[movement.fromMood]?.description || movement.fromMood,
            this.moodCategories[movement.toMood]?.description || movement.toMood,
            new Date(movement.timestamp).toLocaleDateString(),
            new Date(movement.timestamp).toLocaleTimeString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    viewGroupDetails(mood) {
        const moodData = this.moodCategories[mood];
        const stats = this.groupStats[mood];
        
        // Create modal for group details
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${moodData.groupName} Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="group-details-content">
                        <div class="group-info">
                            <span class="group-emoji-large">${moodData.emoji}</span>
                            <h3>${moodData.description}</h3>
                        </div>
                        <div class="group-stats-detailed">
                            <div class="stat-item">
                                <i class="fas fa-users"></i>
                                <span>${stats.memberCount} Active Members</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-comments"></i>
                                <span>${stats.messagesToday} Messages Today</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-clock"></i>
                                <span>Last Activity: ${stats.lastActivity ? this.formatTime(stats.lastActivity) : 'None'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }

    manageGroup(mood) {
        // Implementation for group management actions
        alert(`Group management for ${this.moodCategories[mood].groupName} - Feature coming soon!`);
    }

    editMoodCategory(moodKey) {
        const moodData = this.moodCategories[moodKey];
        const newDescription = prompt('Edit mood description:', moodData.description);
        
        if (newDescription && newDescription.trim()) {
            this.moodCategories[moodKey].description = newDescription.trim();
            this.moodCategories[moodKey].groupName = `${newDescription.trim()} Group`;
            this.updateMoodCategoriesList();
            this.showNotification('Mood category updated successfully!', 'success');
        }
    }

    deleteMoodCategory(moodKey) {
        if (confirm(`Are you sure you want to delete the ${this.moodCategories[moodKey].description} category?`)) {
            delete this.moodCategories[moodKey];
            this.updateMoodCategoriesList();
            this.showNotification('Mood category deleted successfully!', 'success');
        }
    }

    showAddMoodCategoryModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Mood Category</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addMoodForm">
                        <div class="form-group">
                            <label for="moodKey">Mood Key:</label>
                            <input type="text" id="moodKey" required>
                        </div>
                        <div class="form-group">
                            <label for="moodDescription">Description:</label>
                            <input type="text" id="moodDescription" required>
                        </div>
                        <div class="form-group">
                            <label for="moodEmoji">Emoji:</label>
                            <input type="text" id="moodEmoji" required>
                        </div>
                        <div class="form-group">
                            <label for="moodColor">Color:</label>
                            <input type="color" id="moodColor" value="#667eea">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="save-btn">Save Category</button>
                            <button type="button" class="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
                modal.remove();
            }
        });

        modal.querySelector('#addMoodForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const moodKey = document.getElementById('moodKey').value;
            const description = document.getElementById('moodDescription').value;
            const emoji = document.getElementById('moodEmoji').value;
            const color = document.getElementById('moodColor').value;

            this.moodCategories[moodKey] = {
                emoji,
                color,
                description,
                groupName: `${description} Group`,
                icon: 'fas fa-heart'
            };

            this.updateMoodCategoriesList();
            modal.remove();
            this.showNotification('New mood category added successfully!', 'success');
        });

        document.body.appendChild(modal);
    }

    generateAnalyticsReport() {
        const period = document.getElementById('analyticsPeriod')?.value || 'week';
        const analytics = this.generateMoodAnalytics(period);
        
        const reportData = {
            period,
            generatedAt: new Date().toISOString(),
            analytics
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mood_analytics_report_${period}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Analytics report generated and downloaded!', 'success');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
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
}

// Initialize admin mood groups manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminMoodGroupsManager = new AdminMoodGroupsManager();
});
