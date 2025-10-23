// Admin Authentication System
class AdminAuth {
    constructor() {
        // Default admin credentials (in production, this should be server-side)
        this.adminCredentials = {
            username: 'admin',
            password: 'MindSpace_Admin2025!@#' // New secure admin password
        };
        this.init();
    }
    
    init() {
        this.setupLoginForm();
        this.checkAdminSession();
    }
    
    setupLoginForm() {
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }
    }
    
    async handleAdminLogin() {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        const messageDiv = document.getElementById('loginMessage');
        
        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.auth-btn.primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify credentials
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            // Create admin session
            const adminSession = {
                username: username,
                loginTime: new Date().toISOString(),
                sessionId: this.generateSessionId(),
                isAdmin: true
            };
            
            // Store admin session
            localStorage.setItem('campusMindspace_adminSession', JSON.stringify(adminSession));
            sessionStorage.setItem('campusMindspace_adminAuth', 'true');
            
            this.showMessage('Login successful! Redirecting to admin dashboard...', 'success');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            // Failed login
            this.showMessage('Invalid username or password. Access denied.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Clear password field
            document.getElementById('adminPassword').value = '';
            
            // Log failed attempt
            this.logFailedAttempt(username);
        }
    }
    
    checkAdminSession() {
        const adminSession = localStorage.getItem('campusMindspace_adminSession');
        const adminAuth = sessionStorage.getItem('campusMindspace_adminAuth');
        
        // If already logged in and on login page, redirect to dashboard
        if (adminSession && adminAuth === 'true' && window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-dashboard.html';
        }
    }
    
    generateSessionId() {
        return 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    logFailedAttempt(username) {
        const failedAttempts = JSON.parse(localStorage.getItem('campusMindspace_failedLogins') || '[]');
        failedAttempts.push({
            username: username,
            timestamp: new Date().toISOString(),
            ip: 'client' // In production, get actual IP
        });
        
        // Keep only last 10 failed attempts
        if (failedAttempts.length > 10) {
            failedAttempts.shift();
        }
        
        localStorage.setItem('campusMindspace_failedLogins', JSON.stringify(failedAttempts));
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.getElementById('loginMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds for non-error messages
            if (type !== 'error') {
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Static method to verify admin access
    static verifyAdminAccess() {
        const adminSession = localStorage.getItem('campusMindspace_adminSession');
        const adminAuth = sessionStorage.getItem('campusMindspace_adminAuth');
        
        if (!adminSession || adminAuth !== 'true') {
            // Not authenticated, redirect to login
            window.location.href = 'admin-login.html';
            return false;
        }
        
        try {
            const session = JSON.parse(adminSession);
            
            // Check if session is still valid (24 hours)
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursSinceLogin > 24) {
                // Session expired
                AdminAuth.logout();
                return false;
            }
            
            return session.isAdmin === true;
        } catch (error) {
            AdminAuth.logout();
            return false;
        }
    }
    
    // Static method to logout admin
    static logout() {
        localStorage.removeItem('campusMindspace_adminSession');
        sessionStorage.removeItem('campusMindspace_adminAuth');
        window.location.href = 'admin-login.html';
    }
    
    // Static method to get admin info
    static getAdminInfo() {
        const adminSession = localStorage.getItem('campusMindspace_adminSession');
        if (adminSession) {
            try {
                return JSON.parse(adminSession);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
}

// Initialize admin auth
const adminAuth = new AdminAuth();
