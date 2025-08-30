// Login functionality with email-based role detection
class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', (e) => this.updateRoleIndicator(e.target.value));
        }
    }

        async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            alert('Invalid email or password!');
            return;
        }

        // Verify password (compare hashed passwords)
        const hashedPassword = btoa(password);
        if (user.password !== hashedPassword) {
            alert('Invalid email or password!');
            return;
        }
        
        // Capture location during login
        const locationAPI = new ZimbabweLocationAPI();
        const locationData = await locationAPI.getLocationFromIP();
        
        // Create session with expiration (24 hours)
        const session = {
            user: { ...user, location: locationData },
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Store session
        localStorage.setItem('currentSession', JSON.stringify(session));
        
        // Redirect based on role
        let redirectUrl = 'index.html'; // Default for regular users
        
        if (user.role === 'admin') {
            redirectUrl = 'admin-dashboard.html';
        } else if (user.role === 'auditor') {
            redirectUrl = 'admin-dashboard.html'; // Could be auditor-dashboard.html
        }
        
        alert(`Welcome ${user.firstName}! Redirecting to ${user.role} dashboard...`);
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }

    updateRoleIndicator(email) {
        const roleIndicator = document.querySelector('.role-indicator small');
        
        if (!roleIndicator) return;
        
        if (email.startsWith('admin@')) {
            roleIndicator.innerHTML = '<strong>Admin access detected</strong> - Will redirect to Admin Dashboard';
        } else if (email.startsWith('auditor@')) {
            roleIndicator.innerHTML = '<strong>Auditor access detected</strong> - Will redirect to Auditor Dashboard';
        } else if (email.includes('@')) {
            roleIndicator.innerHTML = '<strong>Standard user access</strong> - Will redirect to User Dashboard';
        } else {
            roleIndicator.innerHTML = '<strong>Email-based access:</strong><br>admin@ → Admin Dashboard | auditor@ → Auditor | Regular → User Dashboard';
        }
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('currentSession');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            
            // Check if session is expired
            if (Date.now() > session.expires) {
                localStorage.removeItem('currentSession');
                return;
            }
            
            const user = session.user;
            let redirectUrl = 'index.html';
            
            if (user.role === 'admin') {
                redirectUrl = 'admin-dashboard.html';
            } else if (user.role === 'auditor') {
                redirectUrl = 'admin-dashboard.html';
            }
            
            window.location.href = redirectUrl;
        }
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});
