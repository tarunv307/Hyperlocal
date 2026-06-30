// ═══════════════════════════════════════════════════════════
// Edit Profile Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { showToast } from '../app.js';

export function renderEditProfile() {
  const user = appState.get('user') || {};
  return `
    <div id="edit-profile-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Edit Profile</h4>
      </div>
      <div style="padding:24px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div class="avatar avatar-xl" style="margin:0 auto 12px;font-size:36px;">${(user.name || 'U').charAt(0).toUpperCase()}</div>
          <button class="btn btn-outline btn-sm btn-pill">Change Photo</button>
        </div>
        <form id="edit-profile-form">
          <div class="input-group has-label">
            <label>Full Name</label>
            <input type="text" class="input-field" id="edit-name" value="${user.name || ''}" />
          </div>
          <div class="input-group has-label">
            <label>Email</label>
            <input type="email" class="input-field" id="edit-email" value="${user.email || ''}" />
          </div>
          <div class="input-group has-label">
            <label>Phone</label>
            <input type="tel" class="input-field" id="edit-phone" value="${user.phone || ''}" />
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg btn-pill" style="margin-top:16px;">
            <span class="material-icons-round">save</span> Save Changes
          </button>
        </form>
      </div>
    </div>
  `;
}

export function initEditProfile() {
  const form = document.getElementById('edit-profile-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = appState.get('user') || {};
      appState.set('user', {
        ...user,
        name: document.getElementById('edit-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        phone: document.getElementById('edit-phone').value.trim(),
      });
      showToast('Profile updated! ✅', 'success');
      window.history.back();
    });
  }
}
