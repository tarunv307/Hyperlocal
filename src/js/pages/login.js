// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - Login Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { router } from '../router.js';
import { signIn, signInWithGoogle } from '../supabase.js';
import { showToast } from '../app.js';

export function renderLogin() {
  return `
    <div class="auth-page" id="login-page">
      <div class="auth-bg-pattern"></div>
      
      <div class="auth-header">
        <div class="auth-logo animate-float">
          <span class="material-icons-round">local_shipping</span>
        </div>
        <h1 class="auth-title">Welcome Back!</h1>
        <p class="auth-subtitle">Sign in to get your essentials delivered fast</p>
      </div>

      <div class="auth-card">
        <form class="auth-form" id="login-form" autocomplete="off">
          <div class="input-group has-label">
            <label for="login-email">Email Address</label>
            <span class="input-left-icon material-icons-round">mail</span>
            <input type="email" id="login-email" class="input-field input-field-with-icon" 
                   placeholder="Enter your email" required autocomplete="email" />
          </div>

          <div class="input-group has-label">
            <label for="login-password">Password</label>
            <span class="input-left-icon material-icons-round">lock</span>
            <input type="password" id="login-password" class="input-field input-field-with-icon" 
                   placeholder="Enter your password" required autocomplete="current-password" />
            <button type="button" class="input-icon" id="toggle-password" style="pointer-events:auto;cursor:pointer;background:none;border:none;">
              <span class="material-icons-round">visibility_off</span>
            </button>
          </div>

          <div class="forgot-password-link">
            <span onclick="window.location.hash='/forgot-password'">Forgot Password?</span>
          </div>

          <button type="submit" class="btn btn-primary btn-full btn-lg btn-pill" id="login-btn">
            <span class="material-icons-round">login</span>
            Sign In
          </button>
        </form>

        <div class="auth-divider">or continue with</div>

        <div class="social-login-btns">
          <button class="social-btn" id="google-login-btn">
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <button class="social-btn" id="phone-login-btn" onclick="window.location.hash='/otp-verify'">
            <span class="material-icons-round" style="color:#2ECC71">phone_android</span>
            Continue with Phone
          </button>
        </div>

        <div class="auth-footer">
          Don't have an account? <span class="link" onclick="window.location.hash='/register'">Sign Up</span>
        </div>
        
        <div style="margin-top: 16px; text-align: center; font-size: var(--fs-xs); color: var(--text-muted); background: var(--accent); padding: 8px; border-radius: var(--radius-sm);">
          <strong>Demo Admin:</strong> admin@hyperlocal.com / admin123
        </div>
      </div>
    </div>
  `;
}

export function initLogin() {
  const form = document.getElementById('login-form');
  const togglePass = document.getElementById('toggle-password');
  const googleBtn = document.getElementById('google-login-btn');

  // Toggle password visibility
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const input = document.getElementById('login-password');
      const icon = togglePass.querySelector('.material-icons-round');
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
      } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
      }
    });
  }

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const btn = document.getElementById('login-btn');

      if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-ring" style="width:20px;height:20px;border-width:2px;"></span> Signing in...';

      // Hardcoded Admin Credentials Check
      if (email === 'admin@hyperlocal.com') {
        if (password === 'admin123') {
          appState.set('isLoggedIn', true);
          appState.set('user', {
            id: 'admin-user',
            email: 'admin@hyperlocal.com',
            name: 'Super Admin',
            phone: '+91 99999 99999',
            role: 'admin',
            avatar: null
          });
          showToast('Welcome back, Admin! 🎉', 'success');
          setTimeout(() => router.navigate('/admin/dashboard'), 500);
        } else {
          showToast('Invalid admin credentials', 'error');
          btn.disabled = false;
          btn.innerHTML = '<span class="material-icons-round">login</span> Sign In';
        }
        return;
      }

      try {
        const { data, error } = await signIn(email, password);
        if (error) {
          showToast(error.message || 'Login failed', 'error');
          btn.disabled = false;
          btn.innerHTML = '<span class="material-icons-round">login</span> Sign In';
          return;
        }

        // Store user data
        const user = data.user || data;
        appState.set('isLoggedIn', true);
        appState.set('user', {
          id: user.id || 'demo-user',
          email: user.email || email,
          name: user.user_metadata?.full_name || email.split('@')[0],
          phone: user.user_metadata?.phone || '',
          role: user.user_metadata?.role || 'customer',
          avatar: null
        });

        showToast('Welcome back! 🎉', 'success');
        setTimeout(() => router.navigate('/home'), 500);
      } catch (err) {
        // Demo mode - auto login
        appState.set('isLoggedIn', true);
        appState.set('user', {
          id: 'demo-user',
          email: email,
          name: email.split('@')[0],
          phone: '+91 98765 43210',
          role: 'customer',
          avatar: null
        });
        showToast('Welcome! (Demo Mode) 🎉', 'success');
        setTimeout(() => router.navigate('/home'), 500);
      }
    });
  }

  // Google login
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        await signInWithGoogle();
      } catch (err) {
        // Demo mode
        appState.set('isLoggedIn', true);
        appState.set('user', {
          id: 'demo-google-user',
          email: 'user@gmail.com',
          name: 'Google User',
          phone: '',
          role: 'customer',
          avatar: null
        });
        showToast('Welcome! (Demo Mode) 🎉', 'success');
        setTimeout(() => router.navigate('/home'), 500);
      }
    });
  }
}
