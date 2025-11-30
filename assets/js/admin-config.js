// Admin Configuration & Protection
// Controls whether admin is accessible and provides password protection

const AdminConfig = {
  // ⚠️ BEFORE PUBLISHING: Set to false to disable admin completely
  // Set to true to enable admin for editing
  ADMIN_ENABLED: true, // ⚠️ CHANGE TO false BEFORE PUBLISHING
  
  // Admin password - change this to your desired password
  // Leave empty for no password (not recommended for public sites)
  // If ADMIN_ENABLED is false, password is ignored
  ADMIN_PASSWORD: '', // ⚠️ SET A STRONG PASSWORD FOR PUBLIC SITES
  
  // Storage key for admin session
  SESSION_KEY: 'admin_authenticated',
  
  // Check if admin is enabled
  isAdminEnabled() {
    // Check if admin is explicitly disabled in config
    if (this.ADMIN_ENABLED === false) {
      return false;
    }
    
    // If password is set, admin is enabled but password-protected
    // If no password is set, admin is enabled without protection
    return true;
  },
  
  // Check if admin requires password
  requiresPassword() {
    return this.ADMIN_PASSWORD && this.ADMIN_PASSWORD.length > 0;
  },
  
  // Authenticate with password
  authenticate(password) {
    if (!this.requiresPassword()) {
      return true; // No password required
    }
    
    if (password === this.ADMIN_PASSWORD) {
      // Store session (valid for 24 hours)
      const sessionData = {
        authenticated: true,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      return true;
    }
    return false;
  },
  
  // Check if currently authenticated
  isAuthenticated() {
    if (!this.requiresPassword()) {
      return true; // No password required
    }
    
    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        sessionStorage.removeItem(this.SESSION_KEY);
        return false; // Session expired
      }
      
      return session.authenticated === true;
    } catch (e) {
      return false;
    }
  },
  
  // Logout
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },
  
  // Check if admin access should be shown/hidden
  shouldShowAdminLink() {
    return this.isAdminEnabled();
  },
  
  // Block admin page access if not enabled or not authenticated
  protectAdminPage() {
    if (!this.isAdminEnabled()) {
      // Admin is disabled - show message and redirect
      document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--light-background);">
          <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px;">
            <i class="fas fa-lock" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h2>Admin Access Disabled</h2>
            <p style="color: var(--light-text); margin: 1rem 0;">The admin panel is disabled on the public website.</p>
            <a href="../index.html" class="btn primary" style="display: inline-block; margin-top: 1rem;">Return to Website</a>
          </div>
        </div>
      `;
      return false;
    }
    
    if (this.requiresPassword() && !this.isAuthenticated()) {
      // Show login form
      this.showLoginForm();
      return false;
    }
    
    return true; // Access granted
  },
  
  // Show login form
  showLoginForm() {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--light-background);">
        <div style="width: 100%; max-width: 400px; padding: 2rem;">
          <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 2rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
              <i class="fas fa-lock" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
              <h2>Admin Login</h2>
              <p style="color: var(--light-text);">Enter password to access admin panel</p>
            </div>
            <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
                <input type="password" id="admin-password-input" required 
                  style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 6px; font-size: 1rem;"
                  placeholder="Enter admin password" autofocus />
              </div>
              <div id="login-error" style="color: #ef4444; font-size: 0.875rem; display: none;"></div>
              <button type="submit" class="btn primary" style="width: 100%; padding: 0.75rem;">
                <i class="fas fa-sign-in-alt"></i> Login
              </button>
            </form>
            <div style="text-align: center; margin-top: 1rem;">
              <a href="../index.html" style="color: var(--light-text); text-decoration: none; font-size: 0.875rem;">
                ← Return to Website
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <link rel="stylesheet" href="../assets/css/style.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <script>
        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const password = document.getElementById('admin-password-input').value;
          const errorEl = document.getElementById('login-error');
          
          if (AdminConfig.authenticate(password)) {
            // Reload page to access admin
            window.location.reload();
          } else {
            errorEl.textContent = 'Incorrect password. Please try again.';
            errorEl.style.display = 'block';
            document.getElementById('admin-password-input').value = '';
            document.getElementById('admin-password-input').focus();
          }
        });
      </script>
    `;
  }
};

