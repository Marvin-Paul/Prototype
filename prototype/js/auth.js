// Authentication Management System - Optimized
class AuthManager {
    constructor() {
        this.users = AppUtils.get('campusMindspace_users', []);
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.setupAuthTabs();
        this.setupAuthForms();
        this.setupPasswordToggles();
        this.setupSwitchTabLinks();
        this.setupPasswordStrength();
        this.checkAuthStatus();
    }
    
    setupAuthTabs() {
        AppUtils.$$('.auth-tab').forEach(tab => {
            AppUtils.on(tab, 'click', () => this.switchAuthTab(tab.getAttribute('data-tab')));
        });
    }
    
    switchAuthTab(targetTab) {
        AppUtils.$$('.auth-tab').forEach(tab => tab.classList.remove('active'));
        AppUtils.$(`[data-tab="${targetTab}"]`)?.classList.add('active');
        
        AppUtils.$$('.auth-form').forEach(form => form.classList.remove('active'));
        AppUtils.$(`#${targetTab}Form`)?.classList.add('active');
    }
    
    setupAuthForms() {
        AppUtils.on(AppUtils.$('#loginFormData'), 'submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        AppUtils.on(AppUtils.$('#registerFormData'), 'submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });
    }
    
    async handleLogin() {
        const email = AppUtils.$('#loginEmail').value.trim();
        const password = AppUtils.$('#loginPassword').value;
        
        if (!email || !password) {
            AppUtils.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!AppUtils.validateEmail(email)) {
            AppUtils.showNotification('Please enter a valid university email address', 'error');
            return;
        }
        
        AppUtils.setLoading(AppUtils.$('#loginFormData .auth-btn'), true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = user;
                AppUtils.set('campusMindspace_currentUser', user);
                AppUtils.showNotification('Login successful! Redirecting to dashboard...', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                AppUtils.showNotification('Invalid email or password', 'error');
            }
        } catch (error) {
            AppUtils.showNotification('Login failed. Please try again.', 'error');
        } finally {
            AppUtils.setLoading(AppUtils.$('#loginFormData .auth-btn'), false);
        }
    }
    
    async handleRegistration() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const contactNumber = document.getElementById('contactNumber').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const selectedMood = document.getElementById('selectedMood').value;
        
        // Validation
        if (!fullName || !email || !contactNumber || !password || !confirmPassword || !selectedMood) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!AppUtils.validateEmail(email)) {
            this.showMessage('Please enter a valid university email address', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            this.showMessage('Password must be at least 8 characters long', 'error');
            return;
        }
        
        if (this.users.some(u => u.email === email)) {
            this.showMessage('An account with this email already exists', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newUser = {
                id: Date.now().toString(),
                fullName,
                email,
                contactNumber,
                password,
                initialMood: selectedMood,
                registrationDate: new Date().toISOString(),
                preferences: {
                    language: languageManager.getCurrentLanguage()
                }
            };
            
            this.users.push(newUser);
            this.saveUsers();
            
            this.showMessage('Account created successfully! Redirecting to dashboard...', 'success');
            
            // Auto-login after registration
            this.currentUser = newUser;
            localStorage.setItem('campusMindspace_currentUser', JSON.stringify(newUser));
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            this.showMessage('Registration failed. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    loadUsers() {
        const users = localStorage.getItem('campusMindspace_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers() {
        localStorage.setItem('campusMindspace_users', JSON.stringify(this.users));
    }
    
    checkAuthStatus() {
        const savedUser = localStorage.getItem('campusMindspace_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('campusMindspace_currentUser');
        window.location.href = 'index.html';
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.includes('@');
    }
    
    setLoadingState(loading) {
        const authBtn = document.querySelector('.auth-form.active .auth-btn');
        if (authBtn) {
            authBtn.disabled = loading;
            authBtn.innerHTML = loading 
                ? `<span class="spinner"></span> ${languageManager.getText('loading')}`
                : authBtn.getAttribute('data-original-text') || authBtn.textContent;
            
            if (loading) {
                authBtn.setAttribute('data-original-text', authBtn.textContent);
            }
        }
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        const authSection = document.querySelector('.auth-section');
        if (authSection) {
            authSection.insertBefore(messageDiv, authSection.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
    
    setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                
                if (passwordInput) {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                    }
                    
                    button.classList.toggle('active');
                }
            });
        });
    }
    
    setupSwitchTabLinks() {
        const switchLinks = document.querySelectorAll('.switch-tab');
        switchLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');
                if (targetTab) {
                    this.switchAuthTab(targetTab);
                }
            });
        });
    }
    
    setupPasswordStrength() {
        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) {
            registerPassword.addEventListener('input', () => {
                const password = registerPassword.value;
                const strengthIndicator = document.getElementById('passwordStrength');
                
                if (strengthIndicator) {
                    if (password.length === 0) {
                        strengthIndicator.className = 'password-strength';
                        return;
                    }
                    
                    let strength = 0;
                    
                    // Length check
                    if (password.length >= 8) strength++;
                    if (password.length >= 12) strength++;
                    
                    // Character variety checks
                    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
                    if (/\d/.test(password)) strength++;
                    if (/[^a-zA-Z\d]/.test(password)) strength++;
                    
                    // Set strength class
                    strengthIndicator.className = 'password-strength active';
                    if (strength <= 2) {
                        strengthIndicator.classList.add('weak');
                    } else if (strength <= 4) {
                        strengthIndicator.classList.add('medium');
                    } else {
                        strengthIndicator.classList.add('strong');
                    }
                }
            });
        }
    }
}

// Global auth manager instance
const authManager = new AuthManager();
