// ═══════════════════════════════════════════════════════════
// HyperLocal Delivery App - Register Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { router } from '../router.js';
import { signUp } from '../supabase.js';
import { showToast } from '../app.js';

export function renderRegister() {
  return `
    <div class="auth-page" id="register-page">
      <div class="auth-bg-pattern"></div>
      
      <div class="auth-header">
        <div class="auth-logo animate-float">
          <span class="material-icons-round">person_add</span>
        </div>
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join us for lightning-fast deliveries</p>
      </div>

      <div class="auth-card">
        <form class="auth-form" id="register-form" autocomplete="off">
          <div class="input-group has-label">
            <label for="reg-name">Full Name</label>
            <span class="input-left-icon material-icons-round">person</span>
            <input type="text" id="reg-name" class="input-field input-field-with-icon" 
                   placeholder="Enter your full name" required />
          </div>

          <div class="input-group has-label">
            <label for="reg-email">Email Address</label>
            <span class="input-left-icon material-icons-round">mail</span>
            <input type="email" id="reg-email" class="input-field input-field-with-icon" 
                   placeholder="Enter your email" required />
          </div>

          <div class="input-group has-label">
            <label for="reg-phone">Phone Number</label>
            <span class="input-left-icon material-icons-round">phone</span>
            <input type="tel" id="reg-phone" class="input-field input-field-with-icon" 
                   placeholder="+91 XXXXX XXXXX" required />
          </div>

          <div class="input-group has-label">
            <label for="reg-password">Password</label>
            <span class="input-left-icon material-icons-round">lock</span>
            <input type="password" id="reg-password" class="input-field input-field-with-icon" 
                   placeholder="Create a strong password" required minlength="6" />
          </div>

          <div class="input-group has-label">
            <label for="reg-confirm-password">Confirm Password</label>
            <span class="input-left-icon material-icons-round">lock_outline</span>
            <input type="password" id="reg-confirm-password" class="input-field input-field-with-icon" 
                   placeholder="Confirm your password" required minlength="6" />
          </div>

          <div style="display:flex;align-items:flex-start;gap:10px;margin:8px 0 20px;">
            <input type="checkbox" id="reg-terms" style="margin-top:3px;accent-color:var(--primary);width:18px;height:18px;" required />
            <label for="reg-terms" style="font-size:var(--fs-sm);color:var(--text-muted);line-height:1.4;">
              I agree to the <span style="color:var(--primary);font-weight:500;">Terms of Service</span> 
              and <span style="color:var(--primary);font-weight:500;">Privacy Policy</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-full btn-lg btn-pill" id="register-btn">
            <span class="material-icons-round">how_to_reg</span>
            Create Account
          </button>
        </form>

        <div class="auth-footer" style="margin-top:24px;">
          Already have an account? <span class="link" onclick="window.location.hash='/login'">Sign In</span>
        </div>
      </div>
    </div>
  `;
}

export function initRegister() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const terms = document.getElementById('reg-terms').checked;
    const btn = document.getElementById('register-btn');

    if (!name || !email || !phone || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      document.getElementById('reg-confirm-password').classList.add('error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (!terms) {
      showToast('Please accept Terms & Conditions', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-ring" style="width:20px;height:20px;border-width:2px;"></span> Creating account...';

    try {
      const { data, error } = await signUp(email, password, {
        full_name: name,
        phone: phone,
        role: 'customer'
      });

      if (error) {
        showToast(error.message || 'Registration failed', 'error');
        btn.disabled = false;
        btn.innerHTML = '<span class="material-icons-round">how_to_reg</span> Create Account';
        return;
      }

      // Auto login after registration
      appState.set('isLoggedIn', true);
      appState.set('user', {
        id: data?.user?.id || 'demo-user-' + Date.now(),
        email: email,
        name: name,
        phone: phone,
        role: 'customer',
        avatar: null
      });

      showToast('Account created successfully! 🎉', 'success');
      
      // Add welcome notification
      appState.addNotification({
        title: 'Welcome to HyperLocal! 🎉',
        message: 'Start exploring stores near you and get deliveries in 10 minutes!',
        type: 'info',
        icon: 'celebration'
      });

      setTimeout(() => router.navigate('/home'), 500);
    } catch (err) {
      // Demo mode
      appState.set('isLoggedIn', true);
      appState.set('user', {
        id: 'demo-user-' + Date.now(),
        email: email,
        name: name,
        phone: phone,
        role: 'customer',
        avatar: null
      });
      showToast('Account created! (Demo Mode) 🎉', 'success');
      setTimeout(() => router.navigate('/home'), 500);
    }
  });
}
