// Authentication Management System - Optimized
class AuthManager {
    constructor() {
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
        
        AppUtils.$$('.auth-form').forEach(form => {
            form.classList.remove('active');
            // Clear inputs to prevent auto-fill conflicts
            form.querySelectorAll('input').forEach(input => {
                if (input.type !== 'checkbox' && input.type !== 'hidden') input.value = '';
            });
        });
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
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            if (data.user) {
                this.currentUser = data.user;
                AppUtils.set('campusMindspace_currentUser', data.user);
                AppUtils.showNotification('Login successful! Redirecting to dashboard...', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            AppUtils.showNotification(error.message || 'Login failed. Please try again.', 'error');
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
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // 1. Sign up with Supabase Auth
            const { data, error } = await window.supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: contactNumber,
                        initial_mood: selectedMood
                    }
                }
            });
            
            if (error) throw error;
            
            // 2. Create profile in public.profiles table
            if (data.user) {
                const { error: profileError } = await window.supabaseClient
                    .from('profiles')
                    .insert([
                        { 
                            id: data.user.id, 
                            full_name: fullName, 
                            email: email,
                            student_id: '', 
                            university: 'Campus University'
                        }
                    ]);
                
                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    if (profileError.code === 'PGRST116' || profileError.message.includes('relation "public.profiles" does not exist')) {
                        throw new Error('Database schema not initialized. Please run the SQL setup script in your Supabase dashboard.');
                    }
                }

                // 3. Log initial mood
                const { error: moodError } = await window.supabaseClient
                    .from('mood_entries')
                    .insert([
                        {
                            user_id: data.user.id,
                            mood: selectedMood,
                            factors: [],
                            notes: 'Initial check-in during registration'
                        }
                    ]);
                
                if (moodError && moodError.message.includes('relation "public.mood_entries" does not exist')) {
                    console.warn('Mood entries table missing, but user created.');
                }
            }
            
            this.showMessage('Account created successfully!', 'success');
            
            this.currentUser = data.user;
            localStorage.setItem('campusMindspace_currentUser', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            const msg = error.message.includes('relation') ? 
                'Database tables are missing. Please run the provided SQL schema in your Supabase dashboard.' : 
                (error.message || 'Registration failed. Please try again.');
            this.showMessage(msg, 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    checkAuthStatus() {
        const savedUser = localStorage.getItem('campusMindspace_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }
    
    async logout() {
        await window.supabaseClient.auth.signOut();
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
