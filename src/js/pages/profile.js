// ═══════════════════════════════════════════════════════════
// Profile Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../app.js';

export function renderProfile() {
  const user = appState.get('user') || {};
  const orders = appState.get('orders') || [];
  const wishlist = appState.get('wishlist') || [];
  const initials = (user.name || 'U').charAt(0).toUpperCase();

  return `
    <div id="profile-page">
      <!-- Header -->
      <div class="profile-header">
        <div class="profile-avatar">${initials}</div>
        <div class="profile-name">${user.name || 'Guest User'}</div>
        <div class="profile-email">${user.email || user.phone || ''}</div>
      </div>

      <!-- Stats -->
      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-value">${orders.length}</div>
          <div class="profile-stat-label">Orders</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${wishlist.length}</div>
          <div class="profile-stat-label">Wishlist</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">⭐</div>
          <div class="profile-stat-label">Reviews</div>
        </div>
      </div>

      <!-- Menu Groups -->
      <div class="profile-menu">
        <!-- Account -->
        <div class="profile-menu-group">
          <div class="profile-menu-item" onclick="window.location.hash='/edit-profile'">
            <div class="profile-menu-icon" style="background:#2ecc7115;color:var(--primary);">
              <span class="material-icons-round">person</span>
            </div>
            <span class="profile-menu-text">Edit Profile</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
          <div class="profile-menu-item" onclick="window.location.hash='/addresses'">
            <div class="profile-menu-icon" style="background:#3498db15;color:#3498db;">
              <span class="material-icons-round">location_on</span>
            </div>
            <span class="profile-menu-text">Saved Addresses</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
          <div class="profile-menu-item" onclick="window.location.hash='/orders'">
            <div class="profile-menu-icon" style="background:#f3910015;color:#f39100;">
              <span class="material-icons-round">receipt_long</span>
            </div>
            <span class="profile-menu-text">Order History</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
          <div class="profile-menu-item" onclick="window.location.hash='/wishlist'">
            <div class="profile-menu-icon" style="background:#e74c3c15;color:#e74c3c;">
              <span class="material-icons-round">favorite</span>
            </div>
            <span class="profile-menu-text">My Wishlist</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
        </div>

        <!-- Settings -->
        <div class="profile-menu-group">
          <div class="profile-menu-item" onclick="window.location.hash='/notifications'">
            <div class="profile-menu-icon" style="background:#9b59b615;color:#9b59b6;">
              <span class="material-icons-round">notifications</span>
            </div>
            <span class="profile-menu-text">Notifications</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
          ${user.role === 'admin' ? `
          <div class="profile-menu-item" onclick="window.location.hash='/admin/dashboard'">
            <div class="profile-menu-icon" style="background:#1abc9c15;color:#1abc9c;">
              <span class="material-icons-round">admin_panel_settings</span>
            </div>
            <span class="profile-menu-text">Admin Panel</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
          ` : ''}
          <div class="profile-menu-item">
            <div class="profile-menu-icon" style="background:#34495e15;color:#34495e;">
              <span class="material-icons-round">help_outline</span>
            </div>
            <span class="profile-menu-text">Help & Support</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
          <div class="profile-menu-item">
            <div class="profile-menu-icon" style="background:#34495e15;color:#34495e;">
              <span class="material-icons-round">info_outline</span>
            </div>
            <span class="profile-menu-text">About</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
        </div>

        <!-- Logout -->
        <div class="profile-menu-group">
          <div class="profile-menu-item logout" onclick="window.logoutUser()">
            <div class="profile-menu-icon">
              <span class="material-icons-round">logout</span>
            </div>
            <span class="profile-menu-text">Logout</span>
            <span class="material-icons-round profile-menu-arrow">chevron_right</span>
          </div>
        </div>
      </div>

      <div style="text-align:center;padding:20px;font-size:var(--fs-xs);color:var(--text-light);">
        HyperLocal Delivery v1.0.0
      </div>
    </div>
  `;
}

export function initProfile() {
  window.logoutUser = function() {
    if (confirm('Are you sure you want to logout?')) {
      appState.reset();
      showToast('Logged out successfully', 'info');
      router.navigate('/login');
    }
  };
}
