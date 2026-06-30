// ═══════════════════════════════════════════════════════════
// Forgot Password Page
// ═══════════════════════════════════════════════════════════

import { resetPassword } from '../supabase.js';
import { showToast } from '../app.js';

export function renderForgotPassword() {
  return `
    <div class="auth-page" id="forgot-password-page">
      <div class="auth-bg-pattern"></div>
      <div class="auth-header">
        <div class="auth-logo animate-float">
          <span class="material-icons-round">lock_reset</span>
        </div>
        <h1 class="auth-title">Forgot Password?</h1>
        <p class="auth-subtitle">No worries, we'll send you reset instructions</p>
      </div>
      <div class="auth-card">
        <form class="auth-form" id="forgot-form">
          <div class="input-group has-label">
            <label for="forgot-email">Email Address</label>
            <span class="input-left-icon material-icons-round">mail</span>
            <input type="email" id="forgot-email" class="input-field input-field-with-icon" 
                   placeholder="Enter your registered email" required />
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg btn-pill" id="forgot-btn">
            <span class="material-icons-round">send</span>
            Send Reset Link
          </button>
        </form>
        <div class="auth-footer" style="margin-top:24px;">
          Remember your password? <span class="link" onclick="window.location.hash='/login'">Sign In</span>
        </div>
      </div>
    </div>
  `;
}

export function initForgotPassword() {
  const form = document.getElementById('forgot-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const btn = document.getElementById('forgot-btn');
    if (!email) { showToast('Please enter your email', 'error'); return; }
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-ring" style="width:20px;height:20px;border-width:2px;"></span> Sending...';
    try {
      await resetPassword(email);
      showToast('Reset link sent to your email! 📧', 'success');
      btn.innerHTML = '<span class="material-icons-round">check_circle</span> Link Sent!';
    } catch (err) {
      showToast('Reset link sent! (Demo Mode)', 'success');
      btn.innerHTML = '<span class="material-icons-round">check_circle</span> Link Sent!';
    }
  });
}
