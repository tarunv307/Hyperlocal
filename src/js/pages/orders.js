// ═══════════════════════════════════════════════════════════
// Orders History Page
// ═══════════════════════════════════════════════════════════

import { CONFIG } from '../config.js';
import { appState } from '../state.js';

const statusColors = {
  confirmed: 'badge-info',
  preparing: 'badge-warning',
  assigned: 'badge-warning',
  picked: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};

const statusLabels = {
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  assigned: 'On the Way',
  picked: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function renderOrders() {
  const orders = appState.get('orders') || [];

  return `
    <div id="orders-page">
      <div class="app-header">
        <h4 class="app-header-title" style="padding-left:4px;">My Orders</h4>
      </div>

      ${orders.length === 0 ? `
        <div class="empty-state">
          <span class="material-icons-round empty-state-icon">receipt_long</span>
          <h4 class="empty-state-title">No orders yet</h4>
          <p class="empty-state-text">Your order history will appear here once you place your first order</p>
          <button class="btn btn-primary btn-pill" onclick="window.location.hash='/home'">
            <span class="material-icons-round">storefront</span> Start Shopping
          </button>
        </div>
      ` : `
        <div id="orders-list">
          ${orders.map(order => `
            <div class="order-history-item" onclick="window.location.hash='/order-tracking?id=${order.id}'">
              <div class="order-history-header">
                <span class="order-history-id">#${order.id}</span>
                <span class="badge ${statusColors[order.status] || 'badge-info'}">${statusLabels[order.status] || order.status}</span>
              </div>
              <div class="order-history-date" style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:8px;">
                ${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div class="order-history-store" style="font-size:var(--fs-sm);">
                ${(order.items || []).map(i => i.name).slice(0, 3).join(', ')}${order.items?.length > 3 ? ` +${order.items.length - 3} more` : ''}
              </div>
              <div class="order-history-footer">
                <span class="order-history-total">${CONFIG.CURRENCY}${order.total}</span>
                <span class="order-history-items-count">${order.items?.length || 0} items</span>
              </div>
              <div style="display:flex;gap:8px;margin-top:12px;">
                ${order.status === 'delivered' ? `
                  <button class="btn btn-outline btn-sm btn-pill" style="flex:1;" onclick="event.stopPropagation();window.location.hash='/review?orderId=${order.id}'">
                    <span class="material-icons-round" style="font-size:16px;">star</span> Rate
                  </button>
                ` : ''}
                <button class="btn btn-primary btn-sm btn-pill" style="flex:1;" onclick="event.stopPropagation();window.reorderItems('${order.id}')">
                  <span class="material-icons-round" style="font-size:16px;">replay</span> Reorder
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

export function initOrders() {
  window.reorderItems = function(orderId) {
    const order = appState.get('orders')?.find(o => o.id === orderId);
    if (order?.items) {
      order.items.forEach(item => appState.addToCart(item));
      import('../app.js').then(m => m.showToast('Items added to cart! 🛒', 'success'));
    }
  };
}
