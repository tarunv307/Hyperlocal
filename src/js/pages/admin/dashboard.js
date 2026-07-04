// ═══════════════════════════════════════════════════════════
// Admin Dashboard
// ═══════════════════════════════════════════════════════════

import { appState } from '../../state.js';

export function renderAdminDashboard() {
  const orders = appState.get('orders') || [];
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return `
    <div id="admin-dashboard" class="admin-page" style="background:var(--surface);">
      <div class="admin-header">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="admin-title">Dashboard</div>
            <div class="admin-subtitle">Welcome back, Admin</div>
          </div>
          <button class="header-back-btn" style="color:white;background:rgba(255,255,255,0.2);" onclick="window.location.hash='/profile'">
            <span class="material-icons-round">close</span>
          </button>
        </div>
      </div>

      <!-- Admin Details Section -->
      <div style="padding:16px; margin: 16px 16px 0; background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-xs);">
        <h4 style="font-family:var(--font-heading);font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
          <span class="material-icons-round" style="color:var(--primary);">admin_panel_settings</span>
          Admin Profile & System Details
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: var(--fs-sm);">
          <div>
            <span style="color:var(--text-muted);">Admin Name:</span>
            <div style="font-weight:500;">Super Admin</div>
          </div>
          <div>
            <span style="color:var(--text-muted);">Email:</span>
            <div style="font-weight:500;">admin@hyperlocal.com</div>
          </div>
          <div>
            <span style="color:var(--text-muted);">System Status:</span>
            <div style="font-weight:500; color: var(--success); display:flex; align-items:center; gap:4px;">
              <span class="material-icons-round" style="font-size:14px;">check_circle</span> Online
            </div>
          </div>
          <div>
            <span style="color:var(--text-muted);">Last Login:</span>
            <div style="font-weight:500;">Today, 08:45 AM</div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="admin-stats">
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:linear-gradient(135deg,#2ecc71,#27ae60);">
            <span class="material-icons-round">shopping_bag</span>
          </div>
          <div class="admin-stat-value">${orders.length || 156}</div>
          <div class="admin-stat-label">Total Orders</div>
          <div class="admin-stat-change positive">
            <span class="material-icons-round" style="font-size:14px;">trending_up</span> +12%
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:linear-gradient(135deg,#3498db,#2980b9);">
            <span class="material-icons-round">currency_rupee</span>
          </div>
          <div class="admin-stat-value">₹${totalRevenue || '45.2K'}</div>
          <div class="admin-stat-label">Revenue</div>
          <div class="admin-stat-change positive">
            <span class="material-icons-round" style="font-size:14px;">trending_up</span> +8%
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:linear-gradient(135deg,#9b59b6,#8e44ad);">
            <span class="material-icons-round">people</span>
          </div>
          <div class="admin-stat-value">1,234</div>
          <div class="admin-stat-label">Users</div>
          <div class="admin-stat-change positive">
            <span class="material-icons-round" style="font-size:14px;">trending_up</span> +24%
          </div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:linear-gradient(135deg,#e67e22,#d35400);">
            <span class="material-icons-round">storefront</span>
          </div>
          <div class="admin-stat-value">48</div>
          <div class="admin-stat-label">Stores</div>
          <div class="admin-stat-change positive">
            <span class="material-icons-round" style="font-size:14px;">trending_up</span> +5%
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="admin-chart">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h4 style="font-family:var(--font-heading);font-weight:600;">Orders This Week</h4>
          <span class="badge badge-primary">This Week</span>
        </div>
        <div class="chart-bars">
          ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
            const heights = [45, 65, 55, 80, 70, 90, 60];
            return `<div class="chart-bar" style="height:${heights[i]}%;">
              <span class="chart-bar-label">${day}</span>
            </div>`;
          }).join('')}
        </div>
        <div class="chart-labels">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="padding:0 16px 16px;">
        <h4 style="font-family:var(--font-heading);font-weight:600;margin-bottom:12px;">Quick Actions</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button class="btn btn-outline btn-sm" style="border-radius:var(--radius-lg);padding:16px;flex-direction:column;gap:8px;" onclick="window.location.hash='/admin/users'">
            <span class="material-icons-round" style="color:var(--primary);">group</span>
            <span>Manage Users</span>
          </button>
          <button class="btn btn-outline btn-sm" style="border-radius:var(--radius-lg);padding:16px;flex-direction:column;gap:8px;" onclick="window.location.hash='/admin/stores'">
            <span class="material-icons-round" style="color:var(--primary);">store</span>
            <span>Manage Stores</span>
          </button>
          <button class="btn btn-outline btn-sm" style="border-radius:var(--radius-lg);padding:16px;flex-direction:column;gap:8px;" onclick="window.location.hash='/admin/products'">
            <span class="material-icons-round" style="color:var(--primary);">inventory_2</span>
            <span>Products</span>
          </button>
          <button class="btn btn-outline btn-sm" style="border-radius:var(--radius-lg);padding:16px;flex-direction:column;gap:8px;" onclick="window.location.hash='/admin/orders'">
            <span class="material-icons-round" style="color:var(--primary);">list_alt</span>
            <span>View Orders</span>
          </button>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="admin-table-wrapper" style="margin-bottom: 24px; padding-bottom: 24px;">
        <div class="admin-table-header">
          <span class="admin-table-title">Recent Orders Details</span>
          <span class="section-link" onclick="window.location.hash='/admin/orders'">View All</span>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--fs-sm); min-width: 600px;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                <th style="padding: 12px 16px; font-weight: 500;">Order ID</th>
                <th style="padding: 12px 16px; font-weight: 500;">Date</th>
                <th style="padding: 12px 16px; font-weight: 500;">Customer</th>
                <th style="padding: 12px 16px; font-weight: 500;">Items</th>
                <th style="padding: 12px 16px; font-weight: 500;">Total</th>
                <th style="padding: 12px 16px; font-weight: 500;">Payment</th>
                <th style="padding: 12px 16px; font-weight: 500;">Status</th>
                <th style="padding: 12px 16px; font-weight: 500;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${(orders.length > 0 ? orders.slice(0, 5) : [
                { id: 'ORD-001', total: 450, status: 'delivered', date: new Date().toISOString(), customer: 'Rahul Sharma', items: 4, payment: 'UPI' },
                { id: 'ORD-002', total: 320, status: 'preparing', date: new Date().toISOString(), customer: 'Priya Patel', items: 2, payment: 'Card' },
                { id: 'ORD-003', total: 180, status: 'confirmed', date: new Date().toISOString(), customer: 'Amit Singh', items: 1, payment: 'COD' },
                { id: 'ORD-004', total: 850, status: 'pending', date: new Date().toISOString(), customer: 'Neha Gupta', items: 8, payment: 'UPI' },
                { id: 'ORD-005', total: 120, status: 'delivered', date: new Date().toISOString(), customer: 'Vikram Reddy', items: 1, payment: 'Wallet' },
              ]).map(order => `
                <tr style="border-bottom: 1px solid var(--border-light); transition: background 0.2s;" onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='transparent'">
                  <td style="padding: 12px 16px; font-weight: 600;">#${order.id}</td>
                  <td style="padding: 12px 16px; color: var(--text-muted);">${new Date(order.date).toLocaleDateString()}</td>
                  <td style="padding: 12px 16px;">${order.customer || (appState.get('user') ? appState.get('user').name : 'Guest User')}</td>
                  <td style="padding: 12px 16px;">${order.items ? (Array.isArray(order.items) ? order.items.length : order.items) : 1} items</td>
                  <td style="padding: 12px 16px; font-weight: 600;">₹${order.total}</td>
                  <td style="padding: 12px 16px;">
                    <span style="display:inline-block; padding:2px 8px; background:var(--accent); border-radius:4px; font-size:var(--fs-xs);">${order.payment || 'Online'}</span>
                  </td>
                  <td style="padding: 12px 16px;">
                    <span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'preparing' ? 'badge-warning' : order.status === 'confirmed' ? 'badge-primary' : order.status === 'pending' ? 'badge-warning' : 'badge-info'}">
                      ${order.status}
                    </span>
                  </td>
                  <td style="padding: 12px 16px;">
                    ${order.status === 'pending' 
                      ? `<button class="btn btn-sm btn-primary" style="padding:4px 8px; font-size:12px;" onclick="window.confirmOrder('${order.id}')">Confirm</button>`
                      : `<button class="btn btn-sm btn-ghost" style="padding:4px 8px;" disabled><span class="material-icons-round" style="font-size:18px;">check_circle</span></button>`
                    }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function initAdminDashboard() {
  window.confirmOrder = function(orderId) {
    appState.updateOrder(orderId, { status: 'confirmed' });
    
    // Notify user
    appState.addNotification({
      title: 'Order Confirmed! 🎉',
      message: `Your order ${orderId} has been confirmed by the admin and is being prepared.`,
      type: 'order',
      icon: 'check_circle'
    });

    // We can also trigger a toast immediately for the admin
    import('../../app.js').then(app => app.showToast('Order confirmed and user notified!', 'success'));

    // Re-render dashboard
    import('../../router.js').then(m => m.router.navigate('/admin/dashboard'));
  };
}
