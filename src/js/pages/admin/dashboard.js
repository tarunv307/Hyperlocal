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
      <div class="admin-table-wrapper">
        <div class="admin-table-header">
          <span class="admin-table-title">Recent Orders</span>
          <span class="section-link" onclick="window.location.hash='/admin/orders'">View All</span>
        </div>
        ${(orders.length > 0 ? orders.slice(0, 5) : [
          { id: 'ORD-001', total: 450, status: 'delivered', date: new Date().toISOString() },
          { id: 'ORD-002', total: 320, status: 'preparing', date: new Date().toISOString() },
          { id: 'ORD-003', total: 180, status: 'confirmed', date: new Date().toISOString() },
        ]).map(order => `
          <div class="admin-table-row">
            <div style="flex:1;">
              <div style="font-weight:600;font-size:var(--fs-sm);">#${order.id}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">${new Date(order.date).toLocaleDateString()}</div>
            </div>
            <div style="font-weight:600;font-size:var(--fs-sm);">₹${order.total}</div>
            <span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'preparing' ? 'badge-warning' : 'badge-info'}">${order.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function initAdminDashboard() {}
