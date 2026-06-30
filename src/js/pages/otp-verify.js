// ═══════════════════════════════════════════════════════════
// OTP Verification Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../app.js';

export function renderOTPVerify() {
  return `
    <div class="auth-page" id="otp-page">
      <div class="auth-bg-pattern"></div>
      <div class="auth-header">
        <div class="auth-logo animate-float">
          <span class="material-icons-round">verified</span>
        </div>
        <h1 class="auth-title">Verify OTP</h1>
        <p class="auth-subtitle">Enter the 6-digit code sent to your phone</p>
      </div>
      <div class="auth-card">
        <div class="input-group has-label" style="margin-bottom:24px;">
          <label for="otp-phone">Phone Number</label>
          <span class="input-left-icon material-icons-round">phone</span>
          <input type="tel" id="otp-phone" class="input-field input-field-with-icon" 
                 placeholder="+91 XXXXX XXXXX" />
        </div>
        <button class="btn btn-outline btn-full btn-pill" id="send-otp-btn" style="margin-bottom:24px;">
          <span class="material-icons-round">sms</span>
          Send OTP
        </button>
        <div class="otp-inputs" id="otp-inputs">
          <input type="text" class="otp-input" maxlength="1" inputmode="numeric" pattern="[0-9]" />
          <input type="text" class="otp-input" maxlength="1" inputmode="numeric" pattern="[0-9]" />
          <input type="text" class="otp-input" maxlength="1" inputmode="numeric" pattern="[0-9]" />
          <input type="text" class="otp-input" maxlength="1" inputmode="numeric" pattern="[0-9]" />
          <input type="text" class="otp-input" maxlength="1" inputmode="numeric" pattern="[0-9]" />
          <input type="text" class="otp-input" maxlength="1" inputmode="numeric" pattern="[0-9]" />
        </div>
        <div class="otp-timer" id="otp-timer">
          Resend OTP in <strong id="otp-countdown">30</strong>s
        </div>
        <button class="btn btn-primary btn-full btn-lg btn-pill" id="verify-otp-btn" style="margin-top:24px;">
          <span class="material-icons-round">verified</span>
          Verify & Continue
        </button>
        <div class="auth-footer" style="margin-top:24px;">
          <span class="link" onclick="window.location.hash='/login'">← Back to Login</span>
        </div>
      </div>
    </div>
  `;
}

export function initOTPVerify() {
  const inputs = document.querySelectorAll('.otp-input');
  const verifyBtn = document.getElementById('verify-otp-btn');
  const sendBtn = document.getElementById('send-otp-btn');
  let countdown = 30;
  let timer = null;

  // Auto-focus and auto-advance OTP inputs
  inputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
      // Auto-submit when all filled
      const otp = Array.from(inputs).map(i => i.value).join('');
      if (otp.length === 6) {
        verifyBtn.click();
      }
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((char, i) => {
        if (inputs[i]) inputs[i].value = char;
      });
      if (pasted.length === 6) verifyBtn.click();
    });
  });

  // Send OTP
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const phone = document.getElementById('otp-phone').value.trim();
      if (!phone) { showToast('Please enter phone number', 'error'); return; }
      showToast('OTP sent to ' + phone, 'success');
      inputs[0].focus();
      startCountdown();
    });
  }

  function startCountdown() {
    countdown = 30;
    const el = document.getElementById('otp-countdown');
    const timerEl = document.getElementById('otp-timer');
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      if (el) el.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        if (timerEl) timerEl.innerHTML = '<span class="otp-resend" onclick="document.getElementById(\'send-otp-btn\').click()">Resend OTP</span>';
      }
    }, 1000);
  }

  // Verify
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const otp = Array.from(inputs).map(i => i.value).join('');
      if (otp.length < 6) { showToast('Please enter complete OTP', 'error'); return; }
      
      // Demo mode - accept any OTP
      appState.set('isLoggedIn', true);
      appState.set('user', {
        id: 'demo-phone-user',
        email: '',
        name: 'Phone User',
        phone: document.getElementById('otp-phone').value.trim() || '+91 98765 43210',
        role: 'customer',
        avatar: null
      });
      showToast('Phone verified successfully! ✅', 'success');
      if (timer) clearInterval(timer);
      setTimeout(() => router.navigate('/home'), 500);
    });
  }
}
