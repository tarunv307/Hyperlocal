// ═══════════════════════════════════════════════════════════
// Admin - Manage Orders
// ═══════════════════════════════════════════════════════════

import { appState } from '../../state.js';

export function renderAdminOrders() {
  const orders = appState.get('orders') || [];
  const demoOrders = orders.length > 0 ? orders : [
    { id: 'ORD-A001', total: 650, status: 'delivered', date: new Date(Date.now() - 86400000).toISOString(), items: [{name:'Bananas'},{name:'Milk'}] },
    { id: 'ORD-A002', total: 320, status: 'preparing', date: new Date(Date.now() - 3600000).toISOString(), items: [{name:'Rice'},{name:'Dal'}] },
    { id: 'ORD-A003', total: 180, status: 'confirmed', date: new Date().toISOString(), items: [{name:'Bread'}] },
    { id: 'ORD-A004', total: 890, status: 'delivered', date: new Date(Date.now() - 172800000).toISOString(), items: [{name:'Chicken'},{name:'Eggs'},{name:'Butter'}] },
    { id: 'ORD-A005', total: 455, status: 'cancelled', date: new Date(Date.now() - 259200000).toISOString(), items: [{name:'Soap'},{name:'Shampoo'}] },
  ];

  const statusColors = { confirmed: 'badge-info', preparing: 'badge-warning', assigned: 'badge-warning', picked: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-error' };

  return `
    <div id="admin-orders" class="admin-page" style="background:var(--surface);">
      <div class="app-header">
        <button class="header-back-btn" onclick="window.location.hash='/admin/dashboard'">
          <span class="material-icons-round">arrow_back</span>
        </button>
        <h4 class="app-header-title">All Orders</h4>
      </div>
      <div style="padding:12px 16px;">
        <div style="display:flex;gap:8px;overflow-x:auto;">
          <button class="chip active">All</button>
          <button class="chip">Confirmed</button>
          <button class="chip">Preparing</button>
          <button class="chip">Delivered</button>
          <button class="chip">Cancelled</button>
        </div>
      </div>
      <div class="admin-table-wrapper" style="margin-top:8px;">
        ${demoOrders.map(order => `
          <div class="admin-table-row" style="padding:14px 20px;flex-wrap:wrap;">
            <div style="flex:1;min-width:120px;">
              <div style="font-weight:700;font-size:var(--fs-sm);">#${order.id}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">${(order.items || []).map(i => i.name).join(', ')}</div>
            </div>
            <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
              <div style="font-weight:700;">₹${order.total}</div>
              <span class="badge ${statusColors[order.status] || 'badge-info'}">${order.status}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
export function initAdminOrders() {}
