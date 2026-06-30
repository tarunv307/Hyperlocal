// ═══════════════════════════════════════════════════════════
// Notifications Page
// ═══════════════════════════════════════════════════════════

import { appState } from '../state.js';

const iconMap = {
  order: { icon: 'local_shipping', bg: '#2ecc7115', color: '#2ecc71' },
  offer: { icon: 'local_offer', bg: '#e74c3c15', color: '#e74c3c' },
  info: { icon: 'info', bg: '#3498db15', color: '#3498db' },
  promo: { icon: 'card_giftcard', bg: '#9b59b615', color: '#9b59b6' },
};

export function renderNotifications() {
  const notifications = appState.get('notifications') || [];

  // Add demo notifications if empty
  if (notifications.length === 0) {
    return `
      <div id="notifications-page">
        <div class="app-header">
          <button class="header-back-btn" onclick="window.history.back()">
            <span class="material-icons-round">arrow_back</span>
          </button>
          <h4 class="app-header-title">Notifications</h4>
        </div>
        <div class="empty-state">
          <span class="material-icons-round empty-state-icon">notifications_none</span>
          <h4 class="empty-state-title">No notifications</h4>
          <p class="empty-state-text">You're all caught up! We'll notify you about orders and offers</p>
        </div>
      </div>
    `;
  }

  return `
    <div id="notifications-page">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.history.back()">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">Notifications (${appState.get('unreadCount') || 0})</h4>
        <button class="btn-ghost" style="font-size:var(--fs-sm);color:var(--primary);font-weight:600;" 
                onclick="window.markAllRead()">Mark all read</button>
      </div>
      <div>
        ${notifications.map(n => {
          const typeInfo = iconMap[n.type] || iconMap.info;
          return `
            <div class="notification-item ${n.isRead ? '' : 'unread'}" onclick="window.readNotification(${n.id})">
              <div class="notification-icon" style="background:${typeInfo.bg};color:${typeInfo.color};">
                <span class="material-icons-round">${n.icon || typeInfo.icon}</span>
              </div>
              <div class="notification-content">
                <div class="notification-title">${n.title}</div>
                <div class="notification-text">${n.message}</div>
                <div class="notification-time">${timeAgo(n.timestamp)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function initNotifications() {
  window.readNotification = function(id) {
    appState.markNotificationRead(id);
    const item = document.querySelector(`.notification-item[onclick*="${id}"]`);
    if (item) item.classList.remove('unread');
  };

  window.markAllRead = function() {
    const notifications = appState.get('notifications') || [];
    notifications.forEach(n => appState.markNotificationRead(n.id));
    document.querySelectorAll('.notification-item').forEach(el => el.classList.remove('unread'));
    appState.set('unreadCount', 0);
  };
}

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  return Math.floor(hours / 24) + 'd ago';
}
